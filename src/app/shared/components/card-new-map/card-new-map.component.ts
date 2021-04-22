import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  ɵConsole,
} from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

import isEmpty from 'lodash-es/isEmpty';
import each from 'lodash-es/each';
import map from 'lodash-es/map';

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
import Stroke from 'ol/style/Stroke';
import LineString from 'ol/geom/LineString';

import { LatLngLiteral } from '../../../modules/main/models/generic.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { TRAIL_CURRENT_USER_GEOLOCATION } from '../../constants/utils';
import { mapPINS } from '../../constants/mappins';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-card-new-map',
  templateUrl: './card-new-map.component.html',
  styleUrls: ['./card-new-map.component.scss'],
})
export class CardNewMapComponent implements OnInit, AfterViewInit, OnChanges {
  // @Input() mapId: string;
  @Input() mapMarkers: any[] = [];
  @Input() enableZooming: boolean;
  @Input() enableDragging: boolean;
  @Input() enableRouting: boolean; // displays trail lines
  @Input() enableCurrentLocationMarker: boolean | false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onMapShareEvent = new EventEmitter<any>();

  map: Map;
  mapView: View;
  mapMarkerFeature: Feature;
  vectorSource: VectorSource;
  vectorLayer: VectorLayer;
  tileLayer: TileLayer;
  mapIconStyle: Style;

  mapTarget: string;
  currentCoords = {
    latitude: 0,
    longitude: 0,
  };
  mapCenter: LatLngLiteral;
  currentLocation: LatLngLiteral;

  mapVertices: LatLngLiteral[] = [];

  mapOptions = {
    maxZoom: 18,
    zoom: 16,
  };

  markerOptions = {
    icon: './assets/icon/map_pin.png',
  };

  isMapLoaded = false;
  @ViewChild('mapTarget') mapElementRef: ElementRef;

  constructor(
    private zone: NgZone,
    private platform: Platform,
    private storage: LocalStorageService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();

    if (this.map) {
      // this.map.setTarget(this.mapTarget);
      this.map.setTarget(this.mapElementRef.nativeElement);
    }

    setTimeout(() => {
      this.recalibrateMapMarkers();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'mapMarkers': {
            if (this.isMapLoaded && !isEmpty(this.mapMarkers)) {
              this.recalibrateMapMarkers();
            }
          }
        }
      }
    }
  }

  private initMap() {
    const mapOptions = {
      pinchZoom: this.enableZooming,
      mouseWheelZoom: this.enableZooming,
      doubleClickZoom: this.enableZooming,
      keyboard: false,
      dragPan: this.enableDragging,
      pinchRotate: this.enableDragging,
    };

    this.mapTarget = `Map${new Date().getTime()}`;
    // console.log('this.mapTarget: ', this.mapTarget);
    this.mapView = new View({
      // projection: 'EPSG:4326',
      center: olProj.transform(
        [this.currentCoords.longitude, this.currentCoords.latitude],
        'EPSG:4326',
        'EPSG:3857'
      ),
      zoom: this.mapOptions.zoom,
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
      controls: defControls({
        zoom: this.enableZooming,
        attribution: false,
        rotate: this.enableDragging,
      }),
      interactions: defaults(mapOptions),
      // target: this.mapElementRef.nativeElement,
    });

    if (this.enableCurrentLocationMarker) {
      this.mapIconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: this.markerOptions.icon,
        }),
      });

      this.mapMarkerFeature = new Feature({
        type: 'icon',
      });

      this.vectorSource = new VectorSource({
        features: [this.mapMarkerFeature],
      });

      this.vectorLayer = new VectorLayer({
        name: 'current-location-layer',
        source: this.vectorSource,
        style: this.mapIconStyle,
      });

      this.map.addLayer(this.vectorLayer);
    }

    this.map.once('postrender', (event) => {
      this.isMapLoaded = true;
      // this.map.setTarget(this.mapTarget);
      this.map.setTarget(this.mapElementRef.nativeElement);

      this.getCurrentPosition();
    });

    setTimeout(() => {
      this.map.updateSize();
    }, 500);
  }

  private async getCurrentPosition() {
    const coordinate = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    if (!isEmpty(coordinate)) {
      this.mappingCoordinates(coordinate);
      this.currentLocation = {
        lat: coordinate.latitude,
        lng: coordinate.longitude,
      };
    } else {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        const coordinates = await Plugins.Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });
        const crd = coordinates.coords;
        this.mappingCoordinates(crd);
        this.currentLocation = {
          lat: crd.latitude,
          lng: crd.longitude,
        };
      } else {
        const success = (pos) => {
          const crd = pos.coords;
          this.mappingCoordinates(crd);
          this.currentLocation = {
            lat: crd.latitude,
            lng: crd.longitude,
          };
        };

        const error = (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        };

        navigator.geolocation.getCurrentPosition(success, error, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      }
    }
  }

  private mappingCoordinates(coords) {
    this.currentCoords = coords;
    this.mapCenter = {
      lat: coords.latitude,
      lng: coords.longitude,
    };

    if (this.isMapLoaded && this.enableCurrentLocationMarker) {
      const coordinates = olProj.fromLonLat([
        coords.longitude,
        coords.latitude,
      ]);
      if (coordinates) {
        const points = new Point(coordinates);
        this.mapMarkerFeature.setGeometry(points);
        this.map.getView().setCenter(coordinates);
      }
    }
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
              console.log('removed layer: ', layer.get('name'));
              this.map.removeLayer(layer);
            }
          }
        });
    };

    if (!isEmpty(this.mapMarkers)) {
      // this.mapVertices = map(this.mapMarkers, (row) => {
      //   return row.markerPosition;
      // });

      // Remove old layers
      removeLayers();

      if (this.mapMarkers.length === 1) {
        const marker = this.mapMarkers[this.mapMarkers.length - 1];
        this.mappingCoordinates({
          latitude: marker.lat,
          longitude: marker.lng,
        });

        this.map
          .getView()
          .setCenter(olProj.fromLonLat([marker.lng, marker.lat]));
      } else {
        // Fit bounds here
        if (this.enableRouting) {
          const mapVertices = map(this.mapMarkers, (row) => {
            return olProj.transform(
              [row.lng, row.lat],
              'EPSG:4326',
              'EPSG:3857'
            );
          });
          const routeFeature = new Feature({
            type: 'route',
            geometry: new LineString(mapVertices),
          });

          const routeStyle = new Style({
            stroke: new Stroke({
              width: 2,
              lineDash: [3, 3],
              color: [0, 149, 153, 1],
              lineDashOffset: 0,
              miterLimit: 20,
            }),
          });

          const vectorLayer = new VectorLayer({
            name: 'marker-path-layer',
            source: new VectorSource({
              features: [routeFeature],
            }),
            style: [routeStyle],
          });
          this.map.addLayer(vectorLayer);
          const extent = vectorLayer.getSource().getExtent();

          this.map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
          });
        }

        this.mapVertices = map(this.mapMarkers, (row) => {
          return {
            latitude: row.lat,
            longitude: row.lng,
          };
        });

        const centerGeo = this.commonService.centerGeolocationBounds(
          this.mapVertices
        );
        this.mappingCoordinates({
          latitude: centerGeo.latitude,
          longitude: centerGeo.longitude,
        });
      }

      // plot all markers
      each(this.mapMarkers, (row: any, index: number) => {
        // row.index = index;
        const points = new Point(olProj.fromLonLat([row.lng, row.lat]));
        const markerStyle = new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            src: './assets/png/map_pins/' + mapPINS[index] + '.png',
          }),
        });

        const startMarker = new Feature({
          type: 'icon',
          geometry: points,
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

      // setTimeout(() => {
      //   this.tileLayer.getSource().refresh();
      //   this.map.render();
      //   this.map.updateSize();
      // }, 600);
    } else {
      // Remove old layers
      removeLayers();
    }
  }

  private generateMapImage() {
    this.map.once('rendercomplete', () => {
      const mapCanvas: any = document.createElement('canvas');
      const size = map.getSize();
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext('2d');
      Array.prototype.forEach.call(
        document.querySelectorAll('.ol-layer canvas'),
        (canvas) => {
          if (canvas.width > 0) {
            const opacity = canvas.parentNode.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            const transform = canvas.style.transform;
            // Get the transform parameters from the style's transform matrix
            const matrix = transform
              .match(/^matrix\(([^\(]*)\)$/)[1]
              .split(',')
              .map(Number);
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );
      if (navigator.msSaveBlob) {
        // link download attribuute does not work on MS browsers
        // navigator.msSaveBlob(mapCanvas.msToBlob(), `map-${this.mapId}.png`);
      } else {
        const link: any = document.getElementById('image-download');
        link.href = mapCanvas.toDataURL();
        link.click();
      }
    });
    this.map.renderSync();
  }
}
