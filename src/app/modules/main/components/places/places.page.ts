import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep, uniqBy, isEmpty, findIndex } from 'lodash-es';

import {
  IonContent,
  IonInfiniteScroll,
  IonRefresher,
  ModalController,
} from '@ionic/angular';

import { IPlaceQueryParams, Places } from '../../models/places.model';
import {
  MAX_ITEMS_PER_PAGE,
  PLACE_TEXT,
  RATINGS_SORT,
  TRAIL_CURRENT_USER_GEOLOCATION,
  TRAIL_PLACE_SORT_ITEMS,
  TRAIL_STEP_PLACES_LOADING,
  TRAIL_STEP_PLACES_SAVED,
} from './../../../../shared/constants/utils';

import { MainState } from './../../store/main.reducer';

import { DataLoaderService } from './../../../../shared/services/data-loader.service';
import { FormatterServices } from './../../services/formatter.service';
import { LocalStorageService } from './../../../../shared/services/local-storage.service';

import { FilterModalComponent } from './../../../../shared/components/filter-modal/filter-modal.component';
import { ITrailStepsFilter } from '../../models/generic.model';
import { PubsubService } from 'src/app/shared/services/pubsub.service';
import { ScreensizeService } from 'src/app/shared/services/screensize.service';
import { placesSelector } from '../../store/Places/Places.selector';
import {
  clearPlacesAction,
  paginatePlacesAction,
  PlacesAction,
} from '../../store/Places/Places.action';

@Component({
  selector: 'app-places',
  templateUrl: 'places.page.html',
  styleUrls: ['places.page.scss'],
})
export class PlacesPage implements OnInit, OnDestroy {
  showSearch = false;
  showContent = false;
  onSearching = false;
  onPaginate = false;
  onFiltering = false;
  willResetNgRX = false;
  isDataLoaded = false;
  isDesktop: boolean;

  unsubscribe$ = new Subject<any>();
  filterPlacesArr: Observable<Places[]>;

  searchText: string;

  placesArr: Places[] = [];
  fakeArr: any[] = [];
  appHeight: number;

  filterPlace: ITrailStepsFilter = {};

  currentPage: 1;
  totalItems: number;
  lastPage: number;

  @ViewChild(IonRefresher) refresher: IonRefresher;
  @ViewChild(IonInfiniteScroll) infiniteScroller: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;

  constructor(
    private store: Store<MainState>,
    private modalController: ModalController,
    private dataLoader: DataLoaderService,
    private formatter: FormatterServices,
    private storage: LocalStorageService,
    private pubsub: PubsubService,
    private screensizeService: ScreensizeService
  ) {
    this.fakeArr = Array.from({
      length: 10,
    });

    this.pubsub.$sub(TRAIL_STEP_PLACES_SAVED, () => {
      console.log('TRAIL_STEP_PLACES_SAVED initPlaces');
      this.initPlaces();
    });

    this.pubsub.$sub(TRAIL_STEP_PLACES_LOADING, (value) => {
      this.showContent = !value;
    });

    this.pubsub.$sub('TRAIL_STEP_PLACES_SAVED', () => {
      this.willResetNgRX = true;
    });

    this.screensizeService.isDesktopView().subscribe((isDesktop) => {
      if (this.isDesktop && !isDesktop) {
        // Reload because our routing is out of place
        window.location.reload();
      }

      this.isDesktop = isDesktop;
    });
  }

  ngOnInit(): void {
    this.reset();

    setTimeout(() => {
      this.initPlaces();
    }, 600);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ionViewDidEnter() { }

  ionViewWillLeave() { }

  onShowSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch && !isEmpty(this.searchText)) {
      this.doRefresh(null);
    }
  }

  doRefresh(event) {
    let range = null;
    let type = null;
    let subStype = null;
    let sortAs = null;

    this.reset();

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

      this.refreshPlace(
        null,
        String(this.currentPage),
        range,
        type,
        subStype,
        sortAs,
        event
      );
    } else if (this.showSearch) {
      this.refreshPlace(
        this.searchText,
        String(this.currentPage),
        null,
        null,
        null,
        null,
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

  loadData(event) {
    let range = null;
    let type = null;
    let subStype = null;
    let sortAs = null;

    if (this.placesArr.length >= this.totalItems) {
      if (event && event.target) {
        event.target.disabled = true;
      }
      return;
    }

    this.store.dispatch(
      paginatePlacesAction({
        paginate: true,
      })
    );
    this.currentPage += 1;

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

      this.refreshPlace(
        null,
        String(this.currentPage),
        range,
        type,
        subStype,
        sortAs,
        event
      );
    } else if (this.showSearch) {
      this.refreshPlace(
        this.searchText,
        String(this.currentPage),
        null,
        null,
        null,
        null,
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

  onSearchInput(evt: any) {
    if (this.onSearching) {
      return;
    }

    const searchText = evt.target.value;
    const value = searchText.toLowerCase();
    this.searchText = value;

    if (!isEmpty(searchText)) {
      this.onSearching = true;

      this.reset();

      this.refreshPlace(value);
    } else {
      this.reset();

      this.refreshPlace();
    }
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      componentProps: {
        action: 'place',
      },
    });
    modal.onDidDismiss().then((resp) => {
      if (resp.data) {
        this.onFiltering = resp.data.isFiltering;
        this.reset();

        if (resp.data.filter) {
          this.filterPlace = resp.data.filter;
          console.log('this.filterPlace: ', this.filterPlace);
          this.filterPlaces();
        }
      }
    });
    modal.present();
  }

  private initPlaces() {
    const handleResponse = (places: any[]) => {
      const placesArr = this.formatter.formatPlace2(places);
      if (!isEmpty(placesArr)) {
        placesArr.forEach((place: any) => {
          const resIndex = findIndex(this.placesArr, { id: place.id });
          if (resIndex !== -1) {
            // this.placesArr[resIndex] = place;
          } else {
            this.placesArr.push(place);
          }
        });
      } else {
        this.placesArr = [...placesArr];
      }

      setTimeout(() => {
        this.showContent = true;
      }, 300);
    };

    this.store
      .select(placesSelector)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          if (response) {
            this.showContent = !response.placesLoading;
            this.isDataLoaded = response.placesLoaded;
            this.onSearching = response.placesOnSearching;
            this.onPaginate = response.placesOnPaginate;

            if (response.places) {
              // this.lastPage = response.places.pageSize;
              this.totalItems = response.places.count;
              const places = cloneDeep(response.placesData);
              handleResponse(places);
            }
          }
        },
        () => {
          this.isDataLoaded = false;
          setTimeout(() => {
            this.showContent = true;
          }, 300);
        },
        () => {
          this.isDataLoaded = !isEmpty(this.filterPlacesArr);
          setTimeout(() => {
            this.showContent = true;
          }, 300);
        }
      );

    // this.filterPlacesArr = this.store.select(placesSelector).pipe(
    //   takeUntil(this.unsubscribe$),
    //   map((state) => {
    //     const places = cloneDeep(state.placesData);
    //     const placesArr = this.formatter.formatPlace2(places, true);
    //     return placesArr;
    //   })
    // );
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
    } else {
      this.initPlaces();
    }
  }

  private reset() {
    this.showContent = false;
    this.isDataLoaded = false;

    if (this.placesArr?.length) {
      this.placesArr.splice(0)
    }
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
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);

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
      params.Sort = 'distance';
    }

    if (isEmpty(search)) {
      if (coordinates) {
        params.Lat = coordinates.latitude;
        params.Long = coordinates.longitude;
      }
    }

    params.PageSize = MAX_ITEMS_PER_PAGE;

    this.dataLoader.getAllPlaces(params).then(
      () => {
        if (search) {
          this.onSearching = false;
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
        this.dataLoader.fetchPlaces(Number(page));

        if (search) {
          this.onSearching = false;
        }

        if (page) {
          this.onPaginate = false;
        }
      }
    );
  }
}
