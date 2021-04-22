import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { CommonService } from './common.service';
import {
  DEFAULT_DISTANCE_DECIMAL,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from '../constants/utils';

import '@capacitor-community/http';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
const { Http } = Plugins;

export interface IAltLocationByLatLng {
  place_id: string;
  location: {
    lat: number;
    lng: number;
  };
  formatted_address: string;
  address_components: {
    country: string;
    country_code: string;
    place_of_worship: string;
    postcode: string;
    road: string;
    state: string;
    town: string;
  };
  boundingbox: string[];
}

export interface IAltLocationByPlaceID {
  place_id: string;
  location: {
    lat: number;
    lng: number;
  };
  formatted_address: string;
  class: string;
  type: string;
  importance: number;
  icon: string;
  boundingbox: string[];
  distanceKM: number;
}

@Injectable({
  providedIn: 'root',
})
export class AltPlaceSearchService {
  constructor(
    private platform: Platform,
    private http: HttpClient,
    private storage: LocalStorageService,
    private commonService: CommonService
  ) {}

  getLocationByLatLng(
    latitude: number,
    longitude: number
  ): Promise<IAltLocationByLatLng> {
    const url = environment.locationIQUrl + '/reverse.php';
    const paramsObj = {
      lat: String(latitude),
      lon: String(longitude),
      format: 'json',
      key: environment.locationIQKey,
    };

    return new Promise((resolve, reject) => {
      const showSuccessResponse = (response: any) => {
        if (response) {
          resolve({
            place_id: response.place_id,
            location: {
              lat: response.lat,
              lng: response.lon,
            },
            formatted_address: response.display_name,
            address_components: response.address,
            boundingbox: response.boundingbox,
          });
        }
      };

      const failResponse = () => {
        reject([]);
      };

      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        Http.request({
          method: 'GET',
          url,
          headers: {
            referer: 'http://localhost',
          },
          params: {
            ...paramsObj,
          },
        })
          .then((resp) => resp.data)
          .then(showSuccessResponse)
          .catch(failResponse);
      } else {
        const params = new HttpParams({
          fromObject: paramsObj,
        });
        const options = { params };
        this.http
          .get(url, options)
          .toPromise()
          .then(showSuccessResponse, failResponse);
      }
    });
  }

  async searchAlternatePlaces(
    searchText: string
  ): Promise<IAltLocationByPlaceID[]> {
    const url = environment.locationIQUrl + '/search.php';
    const paramsObj = {
      q: searchText,
      format: 'json',
      limit: '50',
      key: environment.locationIQKey,
    };
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);

    return new Promise((resolve, reject) => {
      const failResponse = () => {
        reject([]);
      };

      const showSuccessResponse = (response: any) => {
        if (response) {
          let newArr = [];
          newArr = response.map((row) => {
            let distanceKm: string = null;
            if (coordinates) {
              const distance = this.commonService.PythagorasEquirectangular(
                coordinates.latitude,
                coordinates.longitude,
                row.lat,
                row.lon
              );

              distanceKm = Number(distance).toFixed(DEFAULT_DISTANCE_DECIMAL);
            } else {
              distanceKm = '0';
            }

            return {
              place_id: row.place_id,
              location: {
                lat: row.lat,
                lng: row.lon,
              },
              formatted_address: row.display_name,
              class: row.class,
              type: row.type,
              importance: row.importance,
              icon: row.icon,
              boundingbox: row.boundingbox,
              distanceKM: Number(distanceKm),
            };
          });

          resolve(newArr);
        }
      };

      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        Http.request({
          method: 'GET',
          url,
          headers: {
            referer: 'http://localhost',
          },
          params: {
            ...paramsObj,
          },
        })
          .then((resp) => resp.data)
          .then(showSuccessResponse)
          .catch(failResponse);
      } else {
        const params = new HttpParams({
          fromObject: paramsObj,
        });
        const options = { params };
        this.http
          .get(url, options)
          .toPromise()
          .then(showSuccessResponse, failResponse);
      }
    });
  }

  // async getLocationByPlaceID(placeID: string): Promise<ILocationByPlaceID> {
  // return new Promise((resolve, reject) => {
  // const geocoder = new google.maps.Geocoder();
  // geocoder.geocode({ placeId: placeID }, (results, status) => {
  //   if (status === 'OK') {
  //     if (results[0]) {
  //       resolve({
  //         location: results[0].geometry.location,
  //         formatted_address: results[0].formatted_address,
  //         address_components: results[0].address_components,
  //         types: results[0].types,
  //       });
  //     } else {
  //       reject([]);
  //     }
  //   } else {
  //     console.log('Geocoder failed due to: ' + status);
  //     reject([]);
  //   }
  // });
  // });
  // }
}
