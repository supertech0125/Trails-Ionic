import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonSearchbar,
  LoadingController,
  ModalController,
} from '@ionic/angular';

import isEmpty from 'lodash-es/isEmpty';

import { LocalStorageService } from './../../services/local-storage.service';
import {
  PlaceSearchService,
} from './../../services/place.search.service';
import { TRAIL_CURRENT_USER_GEOLOCATION } from '../../constants/utils';
import { IGeoServiceLatLng } from '../../services/geolocation.service';
import {
  AltPlaceSearchService,
  IAltLocationByPlaceID,
} from '../../services/alt-place.search.service';

@Component({
  selector: 'app-search-location-modal',
  templateUrl: './search-location-modal.component.html',
  styleUrls: ['./search-location-modal.component.scss'],
})
export class SearchLocationModalComponent implements OnInit {
  showSearch: boolean;
  isSearching: boolean;
  searchText: string;

  searchResultArr: any[] = [];
  fakeArr: any[] = [];

  currentCoords: IGeoServiceLatLng = {
    latitude: 0,
    longitude: 0,
  };
  // mapCenter: google.maps.LatLngLiteral;
  mapCenter: any;

  @ViewChild('searchbar', { read: IonSearchbar }) searchbar: IonSearchbar;

  constructor(
    private loadingController: LoadingController,
    private modalController: ModalController,
    private searchService: PlaceSearchService,
    private altSearchService: AltPlaceSearchService,
    private storage: LocalStorageService
  ) {
    this.fakeArr = Array.from({ length: 20 });
  }

  ngOnInit(): void {
    this.showSearch = false;
    this.isSearching = false;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.getCurrentLocation();
    }, 300);
  }

  async onSearchPlaces(ev: any) {
    this.searchText = ev.target.value;
    if (!isEmpty(this.searchText)) {
      this.isSearching = true;

      this.altSearchService
        .searchAlternatePlaces(this.searchText)
        .then((places: IAltLocationByPlaceID[]) => {
          if (places) {
            this.showSearch = true;
            this.searchResultArr = [...places];

            this.searchResultArr = places.map((row) => {
              return {
                id: row.place_id,
                place_id: row.place_id,
                title: row.formatted_address,
                subtitle: '',
                description: '',
                distance_meters: row.distanceKM,
                class: row.class,
                type: row.type,
                location: row.location,
              };
            });
          } else {
            this.isSearching = false;
            this.searchResultArr = [];
          }
        });

      // this.searchService
      //   .searchGooglePlaces(this.searchText, this.mapCenter)
      //   .then((places: google.maps.places.AutocompletePrediction[]) => {
      //     if (places) {
      //       this.showSearch = true;
      //       this.searchResultArr = [];
      //       each(places, (row) => {
      //         this.searchResultArr.push({
      //           id: row.id,
      //           place_id: row.place_id,
      //           title: row.structured_formatting.main_text,
      //           subtitle: row.structured_formatting.secondary_text,
      //           description: row.description,
      //           distance_meters: row.distance_meters,
      //           structured_formatting: row.structured_formatting,
      //           terms: row.terms,
      //           types: row.types,
      //         });
      //       });
      //     } else {
      //       this.isSearching = false;
      //       this.searchResultArr = [];
      //     }
      //   });
    } else {
      this.searchResultArr = [];
      this.isSearching = false;
      this.showSearch = false;
    }
  }

  async selectLocation(location: any) {
    const loading = await this.loadingController.create();
    loading.present();

    this.currentCoords = {
      latitude: location.location.lat,
      longitude: location.location.lng,
    };

    setTimeout(() => {
      loading.dismiss();
      this.modalController.dismiss({
        coordinates: this.currentCoords,
      });
    }, 600);

    // this.searchService
    //   .getLocationByPlaceID(location.place_id)
    //   .then(
    //     (result: ILocationByPlaceID) => {
    //       loading.dismiss();
    //       console.log('result: ', result);

    //       this.currentCoords = {
    //         latitude: result.location.lat(),
    //         longitude: result.location.lng(),
    //       };
    //       this.modalController.dismiss({
    //         coordinates: this.currentCoords,
    //       });
    //     },
    //     () => {
    //       loading.dismiss();
    //     }
    //   )
    //   .then(() => {
    //     this.modalController.dismiss();
    //   });
  }

  dismiss() {
    console.log('dismiss');
    this.modalController.dismiss();
  }

  private getCurrentLocation() {
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    if (!isEmpty(coordinates)) {
      this.currentCoords = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };

      this.mapCenter = {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      };
    }
  }
}
