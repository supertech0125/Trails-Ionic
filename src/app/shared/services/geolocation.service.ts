import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import {
  DEFAULT_LOCATION_REFRESH_INTERVAL,
  MAX_GEOLOCATION_TIMEOUT,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from '../constants/utils';
import { LocalStorageService } from './local-storage.service';
import { ILocationByLatLng, PlaceSearchService } from './place.search.service';
import {
  AltPlaceSearchService,
  IAltLocationByLatLng,
} from './alt-place.search.service';

export interface IGeoServiceLatLng {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  currentCoords: IGeoServiceLatLng = {
    latitude: 0,
    longitude: 0,
  };
  locationRefreshInterval: any;

  constructor(
    private platform: Platform,
    private storage: LocalStorageService,
    private placeService: PlaceSearchService,
    private altGeoService: AltPlaceSearchService
  ) {}

  getCurrentLocationPosition(
    autoSave: boolean = false
  ): Promise<IGeoServiceLatLng> {
    return new Promise(async (resolve, reject) => {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        Plugins.Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: MAX_GEOLOCATION_TIMEOUT,
          maximumAge: 0,
        }).then(
          (coordinates) => {
            if (coordinates) {
              this.currentCoords = {
                latitude: coordinates.coords.latitude,
                longitude: coordinates.coords.longitude,
              };

              if (autoSave) {
                this.storage.setItem(
                  TRAIL_CURRENT_USER_GEOLOCATION,
                  this.currentCoords
                );
              }

              resolve(this.currentCoords);
            }
          },
          (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            reject({});
          }
        );
      } else {
        const success = (pos) => {
          const crd = pos.coords;
          this.currentCoords = {
            latitude: crd.latitude,
            longitude: crd.longitude,
          };

          if (autoSave) {
            this.storeCurrentLocationPosition();
          }

          resolve(this.currentCoords);
        };

        const error = (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);

          this.currentCoords = {
            latitude: 0,
            longitude: 0,
          };

          if (autoSave) {
            this.storeCurrentLocationPosition();
          }

          reject(this.currentCoords);
        };

        navigator.geolocation.getCurrentPosition(success, error, {
          enableHighAccuracy: true,
          timeout: MAX_GEOLOCATION_TIMEOUT,
          maximumAge: 0,
        });
      }
    });
  }

  async storeCurrentLocationPosition() {
    if (this.currentCoords) {
      // this.storage.setItem(TRAIL_CURRENT_USER_GEOLOCATION, this.currentCoords);
      this.storage.setItem(TRAIL_CURRENT_USER_GEOLOCATION, {latitude: 40.730610, longitude: -73.935242});
    }
  }

  async getCurrentLocationByLatLng(lat, lng) {
    let locationAddress = '';
    const result: ILocationByLatLng = await this.placeService.getLocationByLatLng(
      lat,
      lng
    );
    if (result) {
      locationAddress = result.formatted_address;
    }
    return locationAddress;
  }

  async getAltCurrentLocationByLatLng(lat, lng) {
    let locationAddress = '';
    const result: IAltLocationByLatLng = await this.altGeoService.getLocationByLatLng(
      lat,
      lng
    );
    if (result) {
      locationAddress = result.formatted_address;
    }
    return locationAddress;
  }

  initLocationRefresh() {
    const intervalTime = DEFAULT_LOCATION_REFRESH_INTERVAL * (1000 * 60);

    this.locationRefreshInterval = setInterval(() => {
      this.getCurrentLocationPosition(true);
    }, intervalTime);
  }

  clearLocationRefresh() {
    clearInterval(this.locationRefreshInterval);
  }
}
