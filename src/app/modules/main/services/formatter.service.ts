import { Injectable } from '@angular/core';

import isEmpty from 'lodash-es/isEmpty';
import each from 'lodash-es/each';
import isUndefined from 'lodash-es/isUndefined';
import map from 'lodash-es/map';
import size from 'lodash-es/size';
import sumBy from 'lodash-es/sumBy';

import { LocalStorageService } from './../../../shared/services/local-storage.service';
import {
  DEFAULT_DISTANCE_DECIMAL,
  TRAIL_CURRENT_USER_GEOLOCATION,
  TRAIL_STEP_PLACES,
} from './../../../shared/constants/utils';
import { mapPINS } from 'src/app/shared/constants/mappins';
import { CommonService } from 'src/app/shared/services/common.service';
import { IGeoServiceLatLng } from 'src/app/shared/services/geolocation.service';

@Injectable({
  providedIn: 'root',
})
export class FormatterServices {
  constructor(
    private storage: LocalStorageService,
    private commonService: CommonService
  ) {}

  paginateData(dataArr: any[], currentPage: number, perPageItems: number) {
    const page = currentPage || 1;
    const perPage = perPageItems || 10;
    const offset = (page - 1) * perPage;

    const paginatedItems = dataArr.slice(offset).slice(0, perPageItems);
    const totalPages = Math.ceil(dataArr.length / perPage);

    return {
      page,
      perPage,
      prePage: page - 1 ? page - 1 : null,
      nextPage: totalPages > page ? page + 1 : null,
      total: dataArr.length,
      totalPages,
      data: paginatedItems,
    };
  }

  formatPlaces(placesArr: any, includeDistance = false) {
    const placesTempArr: any[] = [];
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);

    each(placesArr, (place: any) => {
      place.hasPhoto_1080 = false;
      place.hasPhoto_600 = false;
      place.hasPhoto_480 = false;
      place.hasPhoto_320 = false;

      if (place.photo) {
        if (place.photo.photo_1080 && !isEmpty(place.photo.photo_1080)) {
          place.image = place.photo.photo_1080[0].url;
          place.thumbnail = place.photo.photo_1080[0].url;
          place.hasPhoto = true;
          place.hasPhoto_1080 = true;
        } else if (place.photo.photo_600 && !isEmpty(place.photo.photo_600)) {
          place.image = place.photo.photo_600[0].url;
          place.thumbnail = place.photo.photo_600[0].url;
          place.hasPhoto = true;
          place.hasPhoto_600 = true;
        } else if (place.photo.photo_480 && !isEmpty(place.photo.photo_480)) {
          place.image = place.photo.photo_480[0].url;
          place.thumbnail = place.photo.photo_480[0].url;
          place.hasPhoto = true;
          place.hasPhoto_480 = true;
        } else if (place.photo.photo_320 && !isEmpty(place.photo.photo_320)) {
          place.image = place.photo.photo_320[0].url;
          place.thumbnail = place.photo.photo_320[0].url;
          place.hasPhoto = true;
          place.hasPhoto_320 = true;
        } else {
          place.hasPhoto = false;
          place.image = './assets/png/default-placeholder-image.png';
          place.thumbnail = './assets/png/default-placeholder-image.png';
        }
      } else {
        place.hasPhoto = false;
        place.image = './assets/png/default-placeholder-image.png';
        place.thumbnail = './assets/png/default-placeholder-image.png';
      }

      place.rating = Number(place.rating).toFixed(DEFAULT_DISTANCE_DECIMAL);
      place.selected = false;

      if (includeDistance) {
        if (coordinates) {
          place.distanceKM = Number(
            this.computeDistance(
              coordinates.latitude,
              coordinates.longitude,
              place.latitude,
              place.longitude
            )
          );
        } else {
          place.distanceKM = 0;
        }
      }

      if (place.mentions && !isEmpty(place.mentions)) {
        const mentions = [];
        each(place.mentions, (mention, index) => {
          if (mention) {
            mentions.push({
              id: index,
              name: mention,
            });
          }
        });
        place.mentionIns = mentions;
      } else {
        place.mentionIns = [];
      }

      if (isUndefined(place.isBookMarked)) {
        place.isBookMarked = false;
      }

      placesTempArr.push(place);
    });

    return placesTempArr;
  }

  formatPlace2(placesArr: any[]) {
    const placesTempArr: any[] = [];
    each(placesArr, (place: any) => {
      if (place.photo) {
        if (place.photo.photo_1080 && !isEmpty(place.photo.photo_1080)) {
          place.image = place.photo.photo_1080[0].url;
          place.thumbnail = place.photo.photo_1080[0].url;
          place.hasPhoto = true;
          place.hasPhoto_1080 = true;
        } else if (place.photo.photo_600 && !isEmpty(place.photo.photo_600)) {
          place.image = place.photo.photo_600[0].url;
          place.thumbnail = place.photo.photo_600[0].url;
          place.hasPhoto = true;
          place.hasPhoto_600 = true;
        } else if (place.photo.photo_480 && !isEmpty(place.photo.photo_480)) {
          place.image = place.photo.photo_480[0].url;
          place.thumbnail = place.photo.photo_480[0].url;
          place.hasPhoto = true;
          place.hasPhoto_480 = true;
        } else if (place.photo.photo_320 && !isEmpty(place.photo.photo_320)) {
          place.image = place.photo.photo_320[0].url;
          place.thumbnail = place.photo.photo_320[0].url;
          place.hasPhoto = true;
          place.hasPhoto_320 = true;
        } else {
          place.hasPhoto = false;
          place.image = './assets/png/default-placeholder-image.png';
          place.thumbnail = './assets/png/default-placeholder-image.png';
        }
      } else {
        place.hasPhoto = false;
        place.image = './assets/png/default-placeholder-image.png';
        place.thumbnail = './assets/png/default-placeholder-image.png';
      }

      place.rating = Number(place.rating).toFixed(DEFAULT_DISTANCE_DECIMAL);
      place.selected = false;

      if (place.distance && place.distance !== null) {
        place.distanceKM = Number(place.distance).toFixed(
          DEFAULT_DISTANCE_DECIMAL
        );
      } else {
        place.distanceKM = 0;
      }

      if (place.mentions && !isEmpty(place.mentions)) {
        const mentions = [];
        each(place.mentions, (mention, index) => {
          if (mention) {
            mentions.push({
              id: index,
              name: mention,
            });
          }
        });
        place.mentionIns = mentions;
      } else {
        place.mentionIns = [];
      }

      if (isUndefined(place.isBookMarked)) {
        place.isBookMarked = false;
      }

      placesTempArr.push(place);
    });

    return placesTempArr;
  }

  formatPlaceManualCoordinates(
    placesArr: any,
    includeDistance?: boolean,
    coordinates?: { latitude: number; longitude: number }
  ) {
    const placesTempArr: any[] = [];
    each(placesArr, (place: any) => {
      if (place.photo) {
        if (place.photo.photo_1080 && !isEmpty(place.photo.photo_1080)) {
          place.image = place.photo.photo_1080[0].url;
          place.thumbnail = place.photo.photo_1080[0].url;
          place.hasPhoto = true;
          place.hasPhoto_1080 = true;
        } else if (place.photo.photo_600 && !isEmpty(place.photo.photo_600)) {
          place.image = place.photo.photo_600[0].url;
          place.thumbnail = place.photo.photo_600[0].url;
          place.hasPhoto = true;
          place.hasPhoto_600 = true;
        } else if (place.photo.photo_480 && !isEmpty(place.photo.photo_480)) {
          place.image = place.photo.photo_480[0].url;
          place.thumbnail = place.photo.photo_480[0].url;
          place.hasPhoto = true;
          place.hasPhoto_480 = true;
        } else if (place.photo.photo_320 && !isEmpty(place.photo.photo_320)) {
          place.image = place.photo.photo_320[0].url;
          place.thumbnail = place.photo.photo_320[0].url;
          place.hasPhoto = true;
          place.hasPhoto_320 = true;
        } else {
          place.hasPhoto = false;
          place.image = './assets/png/default-placeholder-image.png';
          place.thumbnail = './assets/png/default-placeholder-image.png';
        }
      } else {
        place.hasPhoto = false;
        place.image = './assets/png/default-placeholder-image.png';
        place.thumbnail = './assets/png/default-placeholder-image.png';
      }

      place.rating = Number(place.rating).toFixed(DEFAULT_DISTANCE_DECIMAL);
      place.selected = false;

      if (includeDistance) {
        if (coordinates) {
          place.distanceKM = Number(
            this.computeDistance(
              coordinates.latitude,
              coordinates.longitude,
              place.latitude,
              place.longitude
            )
          );
        } else {
          const coord = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
          if (coord) {
            place.distanceKM = Number(
              this.computeDistance(
                coord.latitude,
                coord.longitude,
                place.latitude,
                place.longitude
              )
            );
          } else {
            place.distanceKM = 0;
          }
        }
      } else {
        place.distanceKM = 0;
      }

      if (place.mentions && !isEmpty(place.mentions)) {
        const mentions = [];
        each(place.mentions, (mention, index) => {
          if (mention) {
            mentions.push({
              id: index,
              name: mention,
            });
          }
        });
        place.mentionIns = mentions;
      } else {
        place.mentionIns = [];
      }

      if (isUndefined(place.isBookMarked)) {
        place.isBookMarked = false;
      }

      placesTempArr.push(place);
    });

    return placesTempArr;
  }

  formatPlace(
    place: any,
    autoDistance: boolean = true,
    currentCoords?: IGeoServiceLatLng
  ) {
    if (place) {
      if (place.photo) {
        if (place.photo.photo_1080 && !isEmpty(place.photo.photo_1080)) {
          place.image = place.photo.photo_1080[0].url;
          place.thumbnail = place.photo.photo_1080[0].url;
          place.hasPhoto = true;
          place.hasPhoto_1080 = true;
        } else if (place.photo.photo_600 && !isEmpty(place.photo.photo_600)) {
          place.image = place.photo.photo_600[0].url;
          place.thumbnail = place.photo.photo_600[0].url;
          place.hasPhoto = true;
          place.hasPhoto_600 = true;
        } else if (place.photo.photo_480 && !isEmpty(place.photo.photo_480)) {
          place.image = place.photo.photo_480[0].url;
          place.thumbnail = place.photo.photo_480[0].url;
          place.hasPhoto = true;
          place.hasPhoto_480 = true;
        } else if (place.photo.photo_320 && !isEmpty(place.photo.photo_320)) {
          place.image = place.photo.photo_320[0].url;
          place.thumbnail = place.photo.photo_320[0].url;
          place.hasPhoto = true;
          place.hasPhoto_320 = true;
        } else {
          place.hasPhoto = false;
          place.image = './assets/png/default-placeholder-image.png';
          place.thumbnail = './assets/png/default-placeholder-image.png';
        }
      } else {
        place.hasPhoto = false;
        place.image = './assets/png/default-placeholder-image.png';
        place.thumbnail = './assets/png/default-placeholder-image.png';
      }

      place.rating = parseFloat(place.rating).toFixed(DEFAULT_DISTANCE_DECIMAL);
      place.selected = false;

      let distanceKm;
      if (autoDistance) {
        const coordinates = this.storage.getItem(
          TRAIL_CURRENT_USER_GEOLOCATION
        );
        const distance = this.commonService.PythagorasEquirectangular(
          coordinates.latitude,
          coordinates.longitude,
          place.latitude,
          place.longitude
        );
        distanceKm = Number(distance).toFixed(DEFAULT_DISTANCE_DECIMAL);
      } else {
        const distance = this.commonService.PythagorasEquirectangular(
          currentCoords.latitude,
          currentCoords.longitude,
          place.latitude,
          place.longitude
        );
        distanceKm = Number(distance).toFixed(DEFAULT_DISTANCE_DECIMAL);
      }
      place.distanceKM = Number(distanceKm);

      if (place.mentions && !isEmpty(place.mentions)) {
        const mentions = [];
        each(place.mentions, (mention, index) => {
          if (mention) {
            mentions.push({
              id: index,
              name: mention,
            });
          }
        });
        place.mentionIns = mentions;
      } else {
        place.mentionIns = [];
      }

      if (isUndefined(place.isBookMarked)) {
        place.isBookMarked = false;
      }

      return place;
    }
  }

  formatTrails(trailsArr: any) {
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    each(trailsArr, (place: any) => {
      let mapMarkers = [];
      const trailPlace = this.formatPlace2(place.trailPlace);

      if (coordinates) {
        if (!isEmpty(trailPlace)) {
          const distance = this.commonService.PythagorasEquirectangular(
            coordinates.latitude,
            coordinates.longitude,
            trailPlace[0].latitude,
            trailPlace[0].longitude
          );
          const distanceKm = Number(distance).toFixed(DEFAULT_DISTANCE_DECIMAL);
          place.distanceToTrail = distanceKm;
        } else {
          place.distanceToTrail = 0;
        }
      } else {
        place.distanceToTrail = 0;
      }

      each(trailPlace, (row: any, index: number) => {
        const nextIndex = index + 1;
        row.index = nextIndex;
        row.markerPosition = { lat: row.latitude, lng: row.longitude };
        row.lat = row.latitude;
        row.lng = row.longitude;
        row.markerOptions = {
          // animation: google.maps.Animation.DROP,
          icon: './assets/png/map_pins/' + mapPINS[index] + '.png',
        };

        if (index === size(place.trailPlace) - 1) {
          row.distanceKM = 0;
        } else {
          const distance = this.commonService.PythagorasEquirectangular(
            trailPlace[nextIndex].latitude,
            trailPlace[nextIndex].longitude,
            row.latitude,
            row.longitude
          );
          const distanceKm = Number(distance).toFixed(DEFAULT_DISTANCE_DECIMAL);
          row.distanceKM = distanceKm;
        }
      });

      place.trailPlace = trailPlace;

      if (!isEmpty(place.trailPlace)) {
        mapMarkers = map(place.trailPlace, (row: any) => {
          return {
            index: row.index,
            lat: row.latitude,
            lng: row.longitude,
            markerPosition: row.markerPosition,
            markerOptions: row.markerOptions,
            latitude: row.latitude,
            longitude: row.longitude,
          };
        });

        // ----- mark based on user's current position(last index number mark)

        // mapMarkers.push({
        //   index: place.trailPlace.length *1 + 1,
        //   lat: coordinates.latitude,
        //   lng: coordinates.longitude,
        //   markerPosition: {lat: coordinates.latitude, lng: coordinates.longitude},
        //   markerOptions: {
        //     icon: './assets/png/map_pins/' + mapPINS[place.trailPlace.length *1 + 1] + '.png',
        //   },
        //   latitude: coordinates.latitude,
        //   longitude: coordinates.longitude,
        // })
      }
      place.mapMarkers = mapMarkers;
      const centerGeo = this.commonService.centerGeolocationBounds(mapMarkers);
      place.mapMarkerCenter = centerGeo;
      place.averageRating = Number(place.averageRating).toFixed(
        DEFAULT_DISTANCE_DECIMAL
      );

      const sumOfAllDistance: number = sumBy(trailPlace, (row: any) => {
        return Number(row.distanceKM);
      });
      place.sumOfAllDistance = Number(sumOfAllDistance).toFixed(
        DEFAULT_DISTANCE_DECIMAL
      );
      
    });

    return trailsArr;
  }

  private computeDistance(latitude, longitude, latitude1, longitude2) {
    const distance = this.commonService.PythagorasEquirectangular(
      latitude,
      longitude,
      latitude1,
      longitude2
    );
    return Number(distance).toFixed(DEFAULT_DISTANCE_DECIMAL);
  }
}
