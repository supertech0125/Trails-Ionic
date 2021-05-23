import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import cloneDeep from 'lodash-es/cloneDeep';
import each from 'lodash-es/each';
import filter from 'lodash-es/filter';
import isEmpty from 'lodash-es/isEmpty';
import find from 'lodash-es/find';
import size from 'lodash-es/size';
import uniqBy from 'lodash-es/uniqBy';
import findIndex from 'lodash-es/findIndex';
import orderBy from 'lodash-es/orderBy';

import { MainState } from '../../../store/main.reducer';
import { AddTrailStepFilterAction, AddTrailStepSortAction } from '../../../store/main.actions';
import { addTrailStepFilterSelector, addTrailStepSortSelector } from '../../../store/main.selector';
import {
  placesSelector,
  searchPlacesSelector,
} from '../../../store/Places/Places.selector';

import { FormatterServices } from './../../../services/formatter.service';
import { DataLoaderService } from './../../../../../shared/services/data-loader.service';
import { LocalStorageService } from './../../../../../shared/services/local-storage.service';

import {
  MAX_ITEMS_PER_PAGE,
  PLACE_TEXT,
  RATINGS_SORT,
  TRAIL_CURRENT_USER_GEOLOCATION,
  TRAIL_PLACE_SORT_ITEMS,
  TRAIL_STEP_ALL_PLACES,
} from './../../../../../shared/constants/utils';

// import { FilterModalComponent } from './../../../../../shared/components/filter-modal/filter-modal.component';
import { FilteringModalComponent } from './../../../../../shared/components/filtering-modal/filtering-modal.component';
import { SortModalComponent } from './../../../../../shared/components/sort-modal/sort-modal.component';
import {
  IPlaceQueryParams,
  IPlacesResponse,
} from '../../../models/places.model';
import { ITrailStepsFilter } from '../../../models/generic.model';
import { MainService } from '../../../services/main.service';
import {
  clearPlacesAction,
  clearSearchPlacesAction,
  PlacesAction,
  SearchPlacesActionSuccess,
} from '../../../store/Places/Places.action';
import { SearchLocationOlComponent } from 'src/app/shared/components/search-location-ol/search-location-ol.component';

@Component({
  selector: 'app-add-steps',
  templateUrl: './add-steps.component.html',
  styleUrls: ['./add-steps.component.scss'],
})
export class AddStepsComponent implements OnInit, OnDestroy {
  fakeArr: any[] = [];
  placesArr: any[] = [];
  filterPlacesArr: any[] = [];
  @Input() selectedPlaces: any[] = [];
  @Input() coordinates: {
    latitude: number;
    longitude: number;
  };

  showContent: boolean;
  onSearching: boolean;
  onFiltering: boolean;
  isPaginate: boolean;

  sort: string = null;
  currentPage = 1;
  lastPage: number;
  searchText: string;
  totalItems: number;

  private unsubscribe$ = new Subject<any>();
  filterPlace: ITrailStepsFilter = {};

  constructor(
    private store: Store<MainState>,
    private modalController: ModalController,
    private mainService: MainService,
    private formatter: FormatterServices,
    private storage: LocalStorageService
  ) {
    this.fakeArr = Array.from({
      length: 20,
    });
  }

  ngOnInit() {
    this.onSearching = false;
    this.showContent = false;
    this.isPaginate = false;

    this.reset();
    combineLatest([
      this.store.select(addTrailStepFilterSelector),
      this.store.select(addTrailStepSortSelector),
    ])
      .pipe(
        takeUntil(this.unsubscribe$),
        map((res) => res)
      )
      .subscribe((response) => {
        let range = null;
        let type = null;
        let subtype = null;
        let sortAs = null;

        if (response) {
          let [filter, sort] = response;
          if (filter) {
            this.filterPlace = filter;

            range = filter.place;
            type = filter.placeType;
            subtype = filter.placeSubType;
          }
          this.sort = sort;
          sortAs = sort;
        }

        this.refreshPlace(null, String(this.currentPage), range, type, subtype, sortAs);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilteringModalComponent,
      componentProps: {
        action: 'addTrailStep',
      },
    });
    modal.onDidDismiss().then((resp) => {
      if (resp.data) {
        this.onFiltering = resp.data.isFiltering;
        this.reset();
        let data = resp.data.filter;

        if (data) {
          this.filterPlace = data;
          this.store.dispatch(
            new AddTrailStepFilterAction({
              data: data,
            })
          )
          this.filterPlaces();
        }
      }
    });
    modal.present();
  }

  async openSortModal() {
    const modal = await this.modalController.create({
      component: SortModalComponent,
      componentProps: {
        action: 'addTrailStep',
      },
    });
    modal.onDidDismiss().then((resp) => {
      console.log('dismissed modal')
      if (resp.data) {
        let data = resp.data.sort;
        this.sort = data;

        this.reset();

        this.store.dispatch(
          new AddTrailStepSortAction({
            data: data,
          })
        );
        this.filterPlaces();
      }
    });
    modal.present();
  }

  doRefresh(event) {
    console.log('Begin async operation');

    let range = null;
    let type = null;
    let subStype = null;
    let sortAs = null;

    range = this.filterPlace.place;
    type = this.filterPlace.placeType;
    subStype = this.filterPlace.placeSubType;
    
    sortAs = this.sort;
    
    this.reset();
    
    this.refreshPlace(null, null, range, type, subStype, sortAs, event);

    // this.refreshPlace(
    //   null,
    //   String(this.currentPage),
    //   null,
    //   null,
    //   null,
    //   null,
    //   event
    // );
  }

  loadData(event) {
    let range = null;
    let type = null;
    let subStype = null;
    let sortAs = null;

    if (this.currentPage >= this.lastPage) {
      if (event && event.target) {
        event.target.disabled = true;
      }
      return;
    }

    this.currentPage += 1;
    this.isPaginate = true;

    if (this.searchText) {
      this.refreshPlace(
        this.searchText,
        String(this.currentPage),
        null,
        null,
        null,
        null,
        event
      );
    }
    else if (this.onFiltering || this.sort) {
      if (this.onFiltering) {
        range = this.filterPlace.place;
        type = this.filterPlace.placeType;
        subStype = this.filterPlace.placeSubType;
      }

      if (this.sort) sortAs = this.sort

      this.refreshPlace(
        null,
        String(this.currentPage),
        range,
        type,
        subStype,
        sortAs,
        event
      );
    } else {
      this.refreshPlace(
        null,
        String(this.currentPage),
        null,
        null,
        null,
        null,
        event
      );
    }
  }

  onSelectPlace(place, slidingItem?: IonItemSliding) {
    each(this.filterPlacesArr, (row: any) => {
      if (row.placeId === place.placeId) {
        row.selected = true;
      } else {
        row.selected = false;
      }
    });

    if (slidingItem) {
      slidingItem.close();

      this.addSteps();
    }
  }

  hasSelectedPlace() {
    return size(filter(this.filterPlacesArr, { selected: true })) > 0
      ? true
      : false;
  }

  addSteps() {
    const steps = find(this.filterPlacesArr, { selected: true });
    this.modalController.dismiss({
      steps,
    });
  }

  onSearchInput(evt: any) {
    let range = null;
    let type = null;
    let subStype = null;
    let sortAs = null;

    const searchText = evt.target.value;
    const value = searchText.toLowerCase();
    this.searchText = value;
    this.onSearching = true;

    setTimeout(() => {
      this.reset();
    }, 600);

    if (this.onFiltering) {
      range = this.filterPlace.place;
      type = this.filterPlace.placeType;
      subStype = this.filterPlace.placeSubType;

      if (this.filterPlace.sort === TRAIL_PLACE_SORT_ITEMS.RATING.value) {
        sortAs = this.filterPlace.sortAs || RATINGS_SORT.HIGH.value;
      }

      if (this.filterPlace.sort === TRAIL_PLACE_SORT_ITEMS.RECENCY.value) {
        sortAs = this.filterPlace.sortAs;
      }

      this.store.dispatch(clearSearchPlacesAction());
      this.refreshPlace(
        this.searchText,
        String(this.currentPage),
        range,
        type,
        subStype,
        sortAs
      );
    } else {
      this.refreshPlace(this.searchText);
    }
  }

  onShowSearch() {
    if (!isEmpty(this.searchText)) {
      this.store.dispatch(clearSearchPlacesAction());
      this.doRefresh(null);
    } else {
      this.onSearching = false;
      this.showContent = true;
    }
  }

  async openSearchPlace() {
    const modal = await this.modalController.create({
      component: SearchLocationOlComponent,
      componentProps: {
        action: PLACE_TEXT,
      },
    });
    modal.onDidDismiss().then((resp) => {
      const params: IPlaceQueryParams = {};
      const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
      if (coordinates) {
        params.Lat = coordinates.latitude;
        params.Long = coordinates.longitude;
      }
      params.Sort = 'distance';

      if (resp && resp.data === 'save') {
        this.reset();
        this.refreshPlace(null, String(this.currentPage), null, null, null, null);

        // this.store.dispatch(clearPlacesAction());
        // this.store.dispatch(
        //   PlacesAction({
        //     params,
        //   })
        // );
      }
    });
    modal.present();
  }

  private reset() {
    this.showContent = false;
    this.isPaginate = false;

    this.filterPlacesArr = [];
    this.placesArr = [];
    this.currentPage = 1;
  }

  private refreshPlace(
    search?: string,
    page?: string,
    range?: string,
    type?: string,
    subtype?: string,
    sortAs?: string,
    event?: any
  ) {
    const params: IPlaceQueryParams = {};

    if (search) {
      params.Search = search;
    }

    if (range) {
      params.PlaceRange = range;
    }

    if (page) {
      params.PageIndex = Number(page);
    }

    if (type) {
      params.Type = type;
    }

    if (subtype) {
      params.SubTypes = subtype;
    }

    if (sortAs) {
      params.Sort = sortAs;
    } else {
      params.Sort = 'distanceAsc';
    }

    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    if (coordinates) {
      params.Lat = coordinates.latitude;
      params.Long = coordinates.longitude;
    }

    params.PageSize = MAX_ITEMS_PER_PAGE;

    const handleResponse = (places) => {
      let filterPlacesArr = [];

      // const placesArr = this.formatter.formatPlaceManualCoordinates(
      //   places,
      //   true,
      //   this.coordinates
      // );
      const placesArr = this.formatter.formatPlace2(places);
      this.placesArr = [...placesArr];

      if (!isEmpty(this.filterPlacesArr)) {
        filterPlacesArr = [...this.filterPlacesArr, ...this.placesArr];
      } else {
        filterPlacesArr = [...this.placesArr];
      }


      // Remove places that are already added on the create trails
      each(this.selectedPlaces, (place: any) => {
        filterPlacesArr = filterPlacesArr.filter((obj) => {
          return obj.id !== place.id;
        });
      });

      each(filterPlacesArr, (place: any) => {
        const resIndex = findIndex(this.filterPlacesArr, { id: place.id });
        const result = find(this.filterPlacesArr, { id: place.id });
        if (result) {
          this.filterPlacesArr[resIndex] = place;
        } else {
          this.filterPlacesArr.push(place);
        }
      });

      setTimeout(() => {
        this.showContent = true;
      }, 300);
    };

    if (!this.isPaginate) {
      this.showContent = false;
    }

    this.mainService.getAllPlaces(params).then(
      (response: IPlacesResponse) => {
        if (search) {
          this.onSearching = false;
        }
        if (!isEmpty(response)) {
          if (response.data) {
            const places = cloneDeep(response.data);
            handleResponse(places);

            this.totalItems = response.count;
            this.lastPage = response.pageSize;
          }
        }

        if (event && event.target) {
          event.target.disabled = true;
          event.target.complete();

          setTimeout(() => {
            event.target.disabled = false;
          }, 100);
        }
      },
      () => {
        if (search) {
          this.onSearching = false;
        }
      }
    );
  }

  private filterPlaces() {
    let range = null;
    let type = null;
    let subStype = null;
    let sortAs = null;

    if (this.filterPlace) {
      range = this.filterPlace.place;
      type = this.filterPlace.placeType;
      subStype = this.filterPlace.placeSubType;

      if (this.filterPlace.sort === TRAIL_PLACE_SORT_ITEMS.RATING.value) {
        sortAs = this.filterPlace.sortAs || RATINGS_SORT.HIGH.value;
      }

      if (this.filterPlace.sort === TRAIL_PLACE_SORT_ITEMS.RECENCY.value) {
        sortAs = this.filterPlace.sortAs;
      }

      this.refreshPlace(null, null, range, type, subStype, sortAs);
    }
  }
}
