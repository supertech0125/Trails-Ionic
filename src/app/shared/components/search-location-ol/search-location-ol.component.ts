import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { ModalController, Platform, LoadingController } from '@ionic/angular';
import { CallbackID } from '@capacitor/core';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { defaults } from 'ol/interaction';
import { defaults as defControls } from 'ol/control';
import { Translate } from 'ol/interaction';
import Collection from 'ol/Collection';

import isEmpty from 'lodash-es/isEmpty';
import each from 'lodash-es/each';
import uniqBy from 'lodash-es/uniqBy';
import cloneDeep from 'lodash-es/cloneDeep';
import flattenDeep from 'lodash-es/flattenDeep';
import isArray from 'lodash-es/isArray';

import { LatLngLiteral } from 'src/app/modules/main/models/generic.model';
import {
  GeolocationService,
  IGeoServiceLatLng,
} from '../../services/geolocation.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { PubsubService } from 'src/app/shared/services/pubsub.service';
import {
  EPSG_3857,
  EPSG_4326,
  MAX_ITEMS_PER_PAGE,
  PLACE_TEXT,
  TRAIL_CURRENT_USER_GEOLOCATION,
  TRAIL_STEP_ALL_PLACES,
  TRAIL_STEP_ALL_TRAILS,
  TRAIL_TEXT,
} from '../../constants/utils';
import { SearchLocationModalComponent } from '../search-location-modal/search-location-modal.component';
import { ITrailQueryParams } from 'src/app/modules/main/models/trails.model';
import { DataLoaderService } from '../../services/data-loader.service';
import { IPlaceQueryParams } from 'src/app/modules/main/models/places.model';
import { FormatterServices } from 'src/app/modules/main/services/formatter.service';
import { MainState } from 'src/app/modules/main/store/main.reducer';
import {
  allMapPlacesSelector,
  allMapTrailsSelector,
} from 'src/app/modules/main/store/main.selector';
import {
  MapAllPlacesAction,
  MapAllTrailsAction,
} from 'src/app/modules/main/store/main.actions';

import { TrailPlaceInfoModalComponent } from 'src/app/modules/main/components/trails/trail-place-info-modal/trail-place-info-modal.component';
import { CommonService } from '../../services/common.service';
import { TrailDetailsComponent } from 'src/app/modules/main/components/trails/trail-details/trail-details.component';
import { PlacesAction } from 'src/app/modules/main/store/Places/Places.action';

@Component({
  selector: 'app-search-location-ol',
  templateUrl: './search-location-ol.component.html',
  styleUrls: ['./search-location-ol.component.scss'],
})
export class SearchLocationOlComponent implements OnInit, AfterViewInit {
  map: Map;
  mapView: View;
  mapMarkerFeature: Feature;
  vectorSource: VectorSource;
  vectorLayer: VectorLayer;
  mapIconStyle: Style;

  tileLayer: TileLayer;
  markerIconStyle: Style;

  currentCoords: IGeoServiceLatLng = {
    latitude: 0,
    longitude: 0,
  };

  isLocating: boolean;
  showMap: boolean;
  onSearching: boolean;

  mapOptions = {
    zoom: 15,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
  };
  mapCenter: LatLngLiteral;
  mapMarker: any = {};

  mapMarkerOptions = {
    icon: './assets/png/pin.png',
    draggable: true,
  };

  watchId: CallbackID;
  locationAddress: string;
  action: string;

  placesArr: any[] = [];
  trailsArr: any[] = [];

  filterPlacesArr: any[] = [];
  filterTrailsArr: any[] = [];

  mapMarkers: any[] = [];

  private unsubscribe$ = new Subject<any>();

  constructor(
    private store: Store<MainState>,
    private zone: NgZone,
    public platform: Platform,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private storage: LocalStorageService,
    private geoService: GeolocationService,
    private dataLoader: DataLoaderService,
    private formatter: FormatterServices,
    private commonService: CommonService,
    private pubsub: PubsubService,
  ) { }

  ngOnInit() {
    this.isLocating = false;
    this.showMap = false;
    this.locationAddress = '';

    this.initMap();

    if (this.action === TRAIL_TEXT) {
      this.initTrails();
    } else if (this.action === PLACE_TEXT) {
      this.initPlaces();
    }
  }

  ngAfterViewInit(): void {
    this.map.setTarget('open-layer-map');
  }

  ionViewWillEnter() {
    this.getCurrentPosition();
  }

  ionViewWillLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  mapPositionChanged(coordinate) {
    if (coordinate) {
      this.currentCoords = {
        latitude: coordinate[1],
        longitude: coordinate[0],
      };
      this.getCurrentLocation(coordinate[1], coordinate[0]);

      if (this.action === TRAIL_TEXT) {
        this.refreshTrails(
          this.currentCoords.latitude,
          this.currentCoords.longitude
        );
      } else if (this.action === PLACE_TEXT) {
        this.refreshPlace(
          this.currentCoords.latitude,
          this.currentCoords.longitude
        );
      }
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async onChangeLocation() {
    const modal = await this.modalController.create({
      component: SearchLocationModalComponent,
      cssClass: 'modal-topmidscreen',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp.data && resp.data.coordinates) {
        const coordinates = resp.data.coordinates;
        this.getCurrentLocation(
          coordinates.latitude,
          coordinates.longitude,
          true
        );

        if (this.action === TRAIL_TEXT) {
          this.refreshTrails(coordinates.latitude, coordinates.longitude);
        } else if (this.action === PLACE_TEXT) {
          this.refreshPlace(coordinates.latitude, coordinates.longitude);
        }
      }
    });
    modal.present();
  }

  async updateLocation() {
    const loading = await this.loadingController.create();
    loading.present();

    if (this.currentCoords) {
      this.geoService.clearLocationRefresh();

      if (this.action === TRAIL_TEXT) {
        this.refreshPlace(
          this.currentCoords.latitude,
          this.currentCoords.longitude
        );
        this.pubsub.$pub('TRAIL_STEP_TRAILS_SAVED', {event: 'locationUpdated', data: ''});
      } else if (this.action === PLACE_TEXT) {
        this.refreshTrails(
          this.currentCoords.latitude,
          this.currentCoords.longitude
        );
        this.pubsub.$pub('TRAIL_STEP_PLACES_SAVED', {event: 'locationUpdated', data: ''});
      }

      this.storage.setItem(TRAIL_CURRENT_USER_GEOLOCATION, this.currentCoords);
      this.geoService.initLocationRefresh();
    }

    setTimeout(() => {
      loading.dismiss();
      this.modalController.dismiss('save');
    }, 600);
  }

  async getGeolocation() {
    try {
      this.isLocating = true;
      const coordinate: IGeoServiceLatLng = await this.geoService.getCurrentLocationPosition();
      this.showMap = true;
      this.isLocating = false;
      this.getCurrentLocation(coordinate.latitude, coordinate.longitude, true);
    } catch (error) {
      console.log('ERROR: ', error);
      console.warn(`ERROR DETAIL(${error.code}): ${error.message}`);
      this.isLocating = false;
    }
  }

  private async viewPlaceDetail(place: any) {
    // await this.commonService.dismissAllModals();
    const modal = await this.modalController.create({
      component: TrailPlaceInfoModalComponent,
      cssClass: 'modal-topmidscreen',
      componentProps: {
        place,
      },
      swipeToClose: true,
    });
    modal.present();
  }

  private async viewTrailDetails(trailId: any) {
    // await this.commonService.dismissAllModals();
    const modal = await this.modalController.create({
      component: TrailDetailsComponent,
      cssClass: 'modal-topmidscreen',
      componentProps: {
        trailId,
        isModal: true,
      },
      swipeToClose: true,
    });
    modal.present();
  }

  private initMap() {
    this.mapView = new View({
      zoom: this.mapOptions.zoom,
      center: olProj.transform([0, 0], EPSG_4326, EPSG_3857),
    });

    this.tileLayer = new TileLayer({
      name: 'main-tile-layer',
      source: new OSM({
        crossOrigin: null,
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      }),
    });

    this.map = new Map({
      view: this.mapView,
      layers: [this.tileLayer],
      interactions: defaults({
        pinchZoom: true,
        mouseWheelZoom: true,
        doubleClickZoom: true,
        keyboard: false,
        dragPan: true,
        pinchRotate: true,
      }),
      controls: defControls({
        attribution: false,
      }),
    });

    setTimeout(() => {
      this.map.updateSize();
    }, 500);

    this.mapIconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: this.mapMarkerOptions.icon,
      }),
    });

    const coordinates = olProj.fromLonLat([0, 0]);
    const marker = new Point(coordinates);
    let coordMarker2 = null;

    this.mapMarkerFeature = new Feature({
      type: 'icon',
      geometry: marker,
    });

    this.vectorSource = new VectorSource({
      features: [this.mapMarkerFeature],
    });

    this.vectorLayer = new VectorLayer({
      name: 'current-location-layer',
      source: this.vectorSource,
      style: this.mapIconStyle,
    });

    const translate1 = new Translate({
      features: new Collection([this.mapMarkerFeature]),
    });

    translate1.on('translateend', (evt) => {
      console.log('translating evt.coordinate: ', evt.coordinate);
      const coordinates = olProj.transform(
        evt.coordinate,
        EPSG_3857,
        EPSG_4326
      );
      this.mapPositionChanged(coordinates);
    });

    this.map.addLayer(this.vectorLayer);
    this.map.addInteraction(translate1);

    this.map.on('click', (evt) => {
      const features: Feature = this.map.forEachFeatureAtPixel(
        evt.pixel,
        (feature) => {
          return feature;
        }
      );
      if (features) {
        const properties = features.getProperties();
        if (this.action === TRAIL_TEXT) {
          this.viewTrailDetails(properties.id);
        } else if (this.action === PLACE_TEXT) {
          this.viewPlaceDetail(properties);
        }
      }
    });
  }

  private getCurrentLocation(lat, lng, update = false) {
    this.currentCoords = {
      latitude: lat,
      longitude: lng,
    };

    if (update) {
      this.mapCenter = {
        lat,
        lng,
      };

      this.mapMarker = {
        ...this.mapCenter,
      };

      const coordinates = olProj.fromLonLat([lng, lat]);
      const marker = new Point(coordinates);
      this.mapMarkerFeature.setGeometry(marker);
      this.map.getView().setCenter(coordinates);
    }

    this.zone.run(async () => {
      this.locationAddress = await this.geoService.getAltCurrentLocationByLatLng(
        lat,
        lng
      );
    });
  }

  private async getCurrentPosition() {
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    if (coordinates) {
      this.zone.run(() => {
        this.showMap = true;
        this.getCurrentLocation(
          coordinates.latitude,
          coordinates.longitude,
          true
        );
      });
    } else {
      this.getGeolocation();
    }
  }

  private refreshTrails(latitude?: number, longitude?: number) {
    const params: ITrailQueryParams = {};

    if (latitude && longitude) {
      params.Lat = latitude;
      params.Long = longitude;
    }
    params.PageIndex = 1;
    params.PageSize = MAX_ITEMS_PER_PAGE;
    params.Sort = 'distance';

    this.dataLoader.getAllTrails(params, false, false, true);
  }

  private refreshPlace(latitude?: number, longitude?: number) {
    const params: IPlaceQueryParams = {};
    if (latitude && longitude) {
      params.Lat = latitude;
      params.Long = longitude;
    }

    params.PageIndex = 1;
    params.PageSize = 15;
    params.Sort = 'distance';

    this.dataLoader.getAllPlaces(params, false, false, true);
  }

  private initPlaces() {
    const handleResponse = (places) => {
      let filterPlacesArr = [];

      const placesArr = this.formatter.formatPlaceManualCoordinates(
        places,
        true,
        this.currentCoords
      );
      this.placesArr = [...placesArr];

      if (!isEmpty(this.filterPlacesArr)) {
        filterPlacesArr = [...this.filterPlacesArr, ...this.placesArr];
      } else {
        filterPlacesArr = [...this.placesArr];
      }

      filterPlacesArr = uniqBy(filterPlacesArr, (row) => {
        return row.id;
      });

      each(filterPlacesArr, (place: any, index: number) => {
        const resIndex = this.filterPlacesArr.findIndex(
          (item) => item.id === place.id
        );
        const result = this.filterPlacesArr.find(
          (item) => item.id === place.id
        );
        if (result) {
          this.filterPlacesArr[resIndex] = place;
        } else {
          this.filterPlacesArr.push(place);
        }
      });
      this.mapMarkers = [...this.filterPlacesArr];

      setTimeout(() => {
        this.recalibrateMapMarkers();
      }, 300);
    };

    const allPlacesArrItem = this.storage.getItem(TRAIL_STEP_ALL_PLACES);
    if (!isEmpty(allPlacesArrItem)) {
      this.store.dispatch(
        new MapAllPlacesAction({
          mapAllPlaces: allPlacesArrItem,
        })
      );
    }

    this.store
      .pipe(
        select(allMapPlacesSelector),
        takeUntil(this.unsubscribe$),
        distinctUntilChanged()
      )
      .subscribe((response) => {
        if (!isEmpty(response)) {
          if (response) {
            const allPlacesArr = response.map((item) => {
              return [...item.data];
            });
            const flattenAllPlacesArr = flattenDeep(allPlacesArr);
            if (flattenAllPlacesArr) {
              const places = cloneDeep(flattenAllPlacesArr);
              handleResponse(places);
            }
          }
        }
      });
  }

  private initTrails() {
    const handleResponse = (trails) => {
      let filterTrailsArr = [];

      const trailsArr = this.formatter.formatTrails(trails);
      this.trailsArr = trailsArr;

      if (!isEmpty(this.filterTrailsArr)) {
        filterTrailsArr = [...this.filterTrailsArr, ...this.trailsArr];
      } else {
        filterTrailsArr = [...this.trailsArr];
      }

      filterTrailsArr = uniqBy(filterTrailsArr, (row) => {
        return row.id;
      });

      each(filterTrailsArr, (trail: any, index: number) => {
        const resIndex = this.filterTrailsArr.findIndex(
          (item) => item.id === trail.id
        );
        const result = this.filterTrailsArr.find(
          (item) => item.id === trail.id
        );

        if (isArray(trail)) {
          return;
        }

        if (result) {
          this.filterTrailsArr[resIndex] = trail;
        } else {
          this.filterTrailsArr.push(trail);
        }
      });

      const filterTrailsVertices = this.filterTrailsArr.map((trail) => {
        return {
          longitude: trail.mapMarkers[0].lng,
          latitude: trail.mapMarkers[0].lat,
          ...trail,
        };
      });
      this.mapMarkers = [...filterTrailsVertices];

      setTimeout(() => {
        this.recalibrateMapMarkers();
      }, 300);
    };

    const allTrailsItem = this.storage.getItem(TRAIL_STEP_ALL_TRAILS);
    if (!isEmpty(allTrailsItem)) {
      this.store.dispatch(
        new MapAllTrailsAction({
          mapAllTrails: allTrailsItem,
        })
      );
    }

    this.store
      .select(allMapTrailsSelector)
      .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe((response) => {
        if (!isEmpty(response)) {
          if (response) {
            const allTrailsArr = response.map((item) => {
              return [...item.data];
            });

            const flattenAllTrailsArr = flattenDeep(allTrailsArr);
            if (flattenAllTrailsArr) {
              const places = cloneDeep(flattenAllTrailsArr);
              handleResponse(places);
            }

            if (allTrailsArr) {
              const trails = cloneDeep(allTrailsArr);
              handleResponse(trails);
            }
          }
        }
      });
  }

  private recalibrateMapMarkers() {
    const removeLayers = () => {
      this.map
        .getLayers()
        .getArray()
        .slice()
        .forEach((layer) => {
          if (layer) {
            if (
              layer.get('name') !== 'main-tile-layer' &&
              layer.get('name') !== 'current-location-layer'
            ) {
              this.map.removeLayer(layer);
            }
          }
        });
    };

    if (!isEmpty(this.mapMarkers)) {
      // Remove old layers
      removeLayers();

      // plot all markers
      each(this.mapMarkers, (row: any, index: number) => {
        // row.index = index;
        let iconUrl: string = null;
        const points = new Point(
          olProj.fromLonLat([row.longitude, row.latitude])
        );
        if (this.action === TRAIL_TEXT) {
          iconUrl = './assets/png/location-pin_32.png';
        } else if (this.action === PLACE_TEXT) {
          iconUrl = './assets/png/place-pin_32.png';
        }

        const markerStyle = new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            src: iconUrl,
          }),
        });

        const startMarker = new Feature({
          type: 'icon',
          geometry: points,
          ...row,
        });

        const vectorLayer = new VectorLayer({
          name: 'marker-layer-' + index,
          source: new VectorSource({
            features: [startMarker],
          }),
          style: [markerStyle],
        });

        this.map.addLayer(vectorLayer);

        setTimeout(() => {
          this.map.updateSize();
        }, 500);
      });
    } else {
      // Remove old layers
      removeLayers();
    }
  }
}
