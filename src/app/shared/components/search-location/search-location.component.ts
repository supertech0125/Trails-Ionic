import {
  Component,
  NgZone,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ModalController, Platform, LoadingController } from '@ionic/angular';
import { CallbackID } from '@capacitor/core';
// import { GoogleMap, MapMarker } from '@angular/google-maps';

import { TRAIL_CURRENT_USER_GEOLOCATION } from './../../constants/utils';
import { LocalStorageService } from '../../services/local-storage.service';

import { SearchLocationModalComponent } from './../search-location-modal/search-location-modal.component';
import {
  GeolocationService,
  IGeoServiceLatLng,
} from '../../services/geolocation.service';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent implements OnInit {
  watchCoords = {
    latitude: 0,
    longitude: 0,
  };

  currentCoords: IGeoServiceLatLng = {
    latitude: 0,
    longitude: 0,
  };

  isLocating: boolean;
  showMap: boolean;

  // mapOptions: google.maps.MapOptions = {
  //   mapTypeId: 'roadmap',
  //   zoom: 16,
  //   zoomControl: false,
  //   scrollwheel: false,
  //   disableDoubleClickZoom: true,
  //   fullscreenControl: false,
  //   mapTypeControl: false,
  //   streetViewControl: false,

  //   // maxZoom: 15,
  //   // minZoom: 8,
  // };
  // mapCenter: google.maps.LatLngLiteral;
  mapMarker: any = {};

  // @ViewChild('MapMarker') marMarker: MapMarker;
  // @ViewChild('Map') map: GoogleMap;

  mapMarkerOptions = {
    // animation: google.maps.Animation.DROP,
    icon: './assets/png/pin.png',
    draggable: true,
  };

  watchId: CallbackID;
  locationAddress: string;

  constructor(
    private zone: NgZone,
    public platform: Platform,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private storage: LocalStorageService,
    private geoService: GeolocationService
  ) {}

  ngOnInit() {
    this.isLocating = false;
    this.showMap = false;
    this.locationAddress = '';
  }

  ionViewDidEnter() {
    this.getCurrentPosition();
  }

  ionViewWillLeave() {}

  mapPositionChanged(ev: any) {
    if (ev && ev.latLng) {
      this.currentCoords = {
        latitude: ev.latLng.lat(),
        longitude: ev.latLng.lng(),
      };
      // this.mapCenter = {
      //   lat: ev.latLng.lat(),
      //   lng: ev.latLng.lng(),
      // };

      this.getCurrentLocation(ev.latLng.lat(), ev.latLng.lng());
    }
  }

  async onChangeLocation() {
    const modal = await this.modalController.create({
      component: SearchLocationModalComponent,
      cssClass: 'modal-topmidscreen',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp.data && resp.data.coordinates) {
        const coordinates = resp.data.coordinates;

        this.currentCoords = coordinates;
        // this.mapCenter = {
        //   lat: coordinates.latitude,
        //   lng: coordinates.longitude,
        // };

        // this.mapMarker = {
        //   ...this.mapCenter,
        // };

        this.getCurrentLocation(coordinates.latitude, coordinates.longitude);
      }
    });
    modal.present();
  }

  async updateLocation() {
    const loading = await this.loadingController.create();
    loading.present();

    if (this.currentCoords) {
      this.geoService.clearLocationRefresh();

      this.storage.setItem(TRAIL_CURRENT_USER_GEOLOCATION, this.currentCoords);
      this.geoService.initLocationRefresh();
    }

    setTimeout(() => {
      loading.dismiss();
      this.modalController.dismiss('save');
    }, 600);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  private getCurrentLocation(lat, lng) {
    this.zone.run(async () => {
      this.locationAddress = await this.geoService.getCurrentLocationByLatLng(
        lat,
        lng
      );
    });
    console.log('this.locationAddress: ', this.locationAddress);
  }

  private async getCurrentPosition() {
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    if (coordinates) {
      this.zone.run(() => {
        this.currentCoords = coordinates;
        // this.mapCenter = {
        //   lat: coordinates.latitude,
        //   lng: coordinates.longitude,
        // };
        // this.mapMarker = {
        //   ...this.mapCenter,
        // };

        this.showMap = true;
        this.getCurrentLocation(coordinates.latitude, coordinates.longitude);
      });
    } else {
      this.getGeolocation();
    }
  }

  async getGeolocation() {
    try {
      this.isLocating = true;
      const coordinate: IGeoServiceLatLng = await this.geoService.getCurrentLocationPosition();

      this.currentCoords = {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      };

      // this.mapCenter = {
      //   lat: coordinate.latitude,
      //   lng: coordinate.longitude,
      // };

      // this.mapMarker = {
      //   ...this.mapCenter,
      // };

      this.showMap = true;
      this.isLocating = false;
      this.getCurrentLocation(coordinate.latitude, coordinate.longitude);
    } catch (error) {
      console.log('ERROR: ', error);
      console.warn(`ERROR DETAIL(${error.code}): ${error.message}`);
      this.isLocating = false;
    }
  }
}
