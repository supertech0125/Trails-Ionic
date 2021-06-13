import { ITrailQueryParams, Trails } from './../../models/trails.model';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';

import isEmpty from 'lodash-es/isEmpty';
import { cloneDeep, each, findIndex, find, uniqBy } from 'lodash-es';

import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SearchLocationOlComponent } from 'src/app/shared/components/search-location-ol/search-location-ol.component';
// import { FilterModalComponent } from './../../../../shared/components/filter-modal/filter-modal.component';
import { FilteringModalComponent } from './../../../../shared/components/filtering-modal/filtering-modal.component';
import { SortModalComponent } from './../../../../shared/components/sort-modal/sort-modal.component';

import {
  MAX_ITEMS_PER_PAGE,
  RATINGS_SORT,
  TRAIL_CURRENT_USER_GEOLOCATION,
  TRAIL_PLACE_SORT_ITEMS,
  TRAIL_STEP_TRAILS_LOADING,
  TRAIL_STEP_TRAILS_SAVED,
  TRAIL_TEXT,
} from './../../../../shared/constants/utils';

import { FormatterServices } from '../../services/formatter.service';
import { DataLoaderService } from './../../../../shared/services/data-loader.service';
import { LocalStorageService } from './../../../../shared/services/local-storage.service';

import { MainState } from '../../store/main.reducer';
import { TrailFilterAction, TrailSortAction } from '../../store/main.actions';
import { ITrailStepsFilter } from '../../models/generic.model';
import { PubsubService } from 'src/app/shared/services/pubsub.service';
import { ScreensizeService } from 'src/app/shared/services/screensize.service';
import { trailsSelector } from '../../store/Trails/Trails.selector';

@Component({
  selector: 'app-trails',
  templateUrl: 'trails.page.html',
  styleUrls: ['trails.page.scss'],
})
export class TrailsPage implements OnInit, OnDestroy {
  showSearch = false;
  showContent = false;
  onSearching = false;
  onPaginate = false;
  onFiltering = false;
  willResetNgRX = false;
  isDataLoaded = false;
  isDesktop: boolean;

  sort: string = null;
  currentPage = 1;
  lastPage = 1;
  searchText = '';
  totalItems: number;

  trailsArr: Trails[] = [];
  filterTrailsArr: Trails[] = [];
  fakeArr: any[] = [];

  unsubscribe$ = new Subject<any>();
  filterTrail: ITrailStepsFilter = {};

  constructor(
    public platform: Platform,
    private store: Store<MainState>,
    private modalController: ModalController,
    private navCtrl: NavController,
    private formatter: FormatterServices,
    private dataLoader: DataLoaderService,
    private storage: LocalStorageService,
    private pubsub: PubsubService,
    private screensizeService: ScreensizeService
  ) {
    this.fakeArr = Array.from({
      length: 10,
    });

    this.pubsub.$sub(TRAIL_STEP_TRAILS_SAVED, () => {
      this.initTrails();
    });

    this.pubsub.$sub(TRAIL_STEP_TRAILS_LOADING, (value) => {
      this.showContent = value;
    });

    this.pubsub.$sub('TRAIL_STEP_TRAILS_SAVED', (data) => {
      if (data.event === 'bookmark') {
        const temp: any = [...this.filterTrailsArr];

        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id * 1 === data.data.id * 1) {
            temp[i].isbookMarked = data.data.isBookMarked;
            break;
          }
        }
      }

      else this.willResetNgRX = true;
    });

    this.pubsub.$sub('TRAIL_STEP_PLACES_SAVED', (data) => {
      if (data.event === 'bookmark') {
        const temp: any = [...this.filterTrailsArr];
        for (let i = 0; i < temp.length; i++) {
          for (let j = 0; j < temp[i].trailPlace.length; j++) {
            if (temp[i].trailPlace[j].placeId * 1 === data.data.id * 1) {
              temp[i].trailPlace[j].isBookMarked = data.data.isBookMarked;
              break;
            }
          }
        }
      }
      else {
        this.doRefresh(null);
      }
    })

    this.screensizeService.isDesktopView().subscribe((isDesktop) => {
      if (this.isDesktop && !isDesktop) {
        // Reload because our routing is out of place
        window.location.reload();
      }

      this.isDesktop = isDesktop;
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit: ');
    setTimeout(() => {
      this.initTrails();
    }, 600);
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy: ');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter: ');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter: ');
    // setTimeout(() => {
    //   this.initTrails();
    // }, 600);
  }

  ionViewWillLeave() { }

  onShowSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch && !isEmpty(this.searchText)) {
      this.doRefresh(null);
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

      setTimeout(() => {
        this.reset();
      }, 600);

      this.refreshTrails(value);
    } else {
      setTimeout(() => {
        this.reset();
      }, 600);

      this.refreshTrails();
    }
  }

  onCreateTrail() {
    this.navCtrl.navigateForward('/main/create-trail');
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilteringModalComponent,
      componentProps: {
        action: 'trail',
      },
    });
    modal.onDidDismiss().then((resp) => {
      if (resp.data) {
        this.onFiltering = resp.data.isFiltering;
        this.reset();

        let data = resp.data.filter;

        if (data) {
          this.filterTrail = data;
          this.store.dispatch(
            new TrailFilterAction({
              data: data,
            })
          );
          this.filterTrails();
        }

        // if (resp.data.filter) {
        //   this.filterTrail = resp.data.filter;
        //   this.filterTrails();
        // }
      }
    });
    modal.present();
  }

  async openSortModal() {
    const modal = await this.modalController.create({
      component: SortModalComponent,
      componentProps: {
        action: 'trail',
      },
    });
    modal.onDidDismiss().then((resp) => {
      if (resp.data) {
        let data = resp.data.sort;
        this.sort = data;
        this.reset();

        this.store.dispatch(
          new TrailSortAction({
            data: data,
          })
        )
        this.filterTrails();
      }
    });
    modal.present();
  }

  async openSearchPlace() {
    const modal = await this.modalController.create({
      component: SearchLocationOlComponent,
      componentProps: {
        action: TRAIL_TEXT,
      },
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data === 'save') {
        this.reset();
        this.refreshTrails();
      }
    });
    modal.present();
  }

  doRefresh(event) {
    console.log('Begin async operation');
    let range = null;
    let who = null;
    let sortAs = null;
    let time = null;
    let type = null;
    let subStype = null;

    this.reset();

    if (this.onFiltering || this.sort) {
      if (this.onFiltering) {
        range = this.filterTrail.trail;
        who = this.filterTrail.who;
        time = this.filterTrail.when;
        type = this.filterTrail.placeType;
        subStype = this.filterTrail.placeSubType;
      }
      if (this.sort) {
        sortAs = this.sort;
      }

      this.refreshTrails(
        null,
        String(this.currentPage),
        range,
        time,
        who,
        type,
        subStype,
        sortAs,
        event
      );
    }
    else if (this.showSearch) {
      this.refreshTrails(
        this.searchText,
        String(this.currentPage),
        null,
        null,
        null,
        null,
        null,
        'distance',
        event
      );
    } else {
      this.refreshTrails(
        null,
        String(this.currentPage),
        null,
        null,
        null,
        null,
        null,
        'distance',
        event
      );
    }
  }

  loadData(event) {
    let range = null;
    let who = null;
    let sortAs = null;
    let time = null;
    let type = null;
    let subStype = null;

    if (this.filterTrailsArr.length >= this.totalItems) {
      if (event && event.target) {
        event.target.disabled = true;
      }
      return;
    }

    this.onPaginate = true;
    this.currentPage += 1;

    if (this.onFiltering || this.sort) {
      if (this.onFiltering) {
        range = this.filterTrail.trail;
        who = this.filterTrail.who;
        time = this.filterTrail.when;
        type = this.filterTrail.placeType;
        subStype = this.filterTrail.placeSubType;
      }
      if (this.sort) {
        sortAs = this.sort;
      }
      this.refreshTrails(
        null,
        String(this.currentPage),
        range,
        time,
        who,
        type,
        subStype,
        sortAs,
        event
      );
    }
    else if (this.showSearch) {
      this.refreshTrails(
        this.searchText,
        String(this.currentPage),
        null,
        null,
        null,
        null,
        null,
        null,
        event
      );
    } else {
      this.refreshTrails(
        null,
        String(this.currentPage),
        null,
        null,
        null,
        null,
        null,
        null,
        event
      );
    }
  }

  private initTrails() {
    const handleResponse = (trails: any[]) => {
      const trailsArr = this.formatter.formatTrails(trails);
      this.trailsArr = [...trailsArr];

      if (!isEmpty(this.filterTrailsArr)) {
        this.trailsArr.forEach((trail: any) => {
          const resIndex = findIndex(this.filterTrailsArr, { id: trail.id });
          if (resIndex !== -1) {
            // this.filterTrailsArr[resIndex] = trail;
            if (this.filterTrailsArr[resIndex].isbookMarked !== trail.isbookMarked) {
              this.filterTrailsArr[resIndex] = { ...this.filterTrailsArr[resIndex], isbookMarked: trail.isbookMarked }
            }
          } else {
            this.filterTrailsArr.push(trail);
          }
        });
      } else {
        this.filterTrailsArr = [...this.trailsArr];
      }

      setTimeout(() => {
        this.showContent = true;
      }, 300);
    };

    this.store
      .select(trailsSelector)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          if (this.willResetNgRX) {
            this.willResetNgRX = false;
            this.doRefresh(null);
          }
          else {
            if (response) {
              this.showContent = !response.trailsLoading;
              this.isDataLoaded = response.trailsLoaded;
              this.onSearching = response.trailsOnSearching;
              this.onPaginate = response.trailsOnPaginate;

              if (response.trails) {
                // this.lastPage = response.trails.pageSize;
                this.totalItems = response.trails.count;
                const trails = cloneDeep(response.trailsData);
                handleResponse(trails);
              }
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
          this.isDataLoaded = !isEmpty(this.filterTrailsArr);
          setTimeout(() => {
            this.showContent = true;
          }, 300);
        }
      );
  }

  private filterTrails() {
    let range = null;
    let time = null;
    let who = null;
    let sortAs = null;
    let type = null;
    let subStype = null;

    if (this.filterTrail || this.sort) {
      if (this.filterTrail) {
        range = this.filterTrail.trail;
        time = this.filterTrail.when;
        who = this.filterTrail.who;
        type = this.filterTrail.placeType;
        subStype = this.filterTrail.placeSubType;
      }
      if (this.sort) {
        if (this.sort === 'Rating') this.sort = 'ratingDesc';
        if (this.sort === 'Newest') this.sort = 'recency';
        sortAs = this.sort
      }
      this.refreshTrails(null, null, range, time, who, type, subStype, sortAs);
    }
    else {
      this.initTrails();
    }
  }

  private reset() {
    this.showContent = false;
    this.isDataLoaded = false;

    this.filterTrailsArr = [];
    this.trailsArr = [];
    this.currentPage = 1;
  }

  private refreshTrails(
    search?: string,
    page?: string,
    range?: string,
    time?: string,
    who?: string,
    type?: string,
    subtype?: string,
    sortAs?: string,
    event?: any
  ) {
    const params: ITrailQueryParams = {};
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);

    if (search) {
      params.Search = search;
    }

    if (page) {
      params.PageIndex = Number(page);
    }

    if (range) {
      params.TrailsRange = range;
    }
    else {
      params.TrailsRange = 'all,verified';
    }

    if (time) {
      params.Time = time.toLowerCase();
    }

    if (who) {
      params.Who = who;
    }

    if (sortAs) {
      params.Sort = sortAs;
    } else {
      params.Sort = 'distance';
    }

    if (type) {
      params.Type = type;
    }

    if (subtype) {
      params.SubTypes = subtype;
    }

    if (coordinates) {
      params.Lat = coordinates.latitude;
      params.Long = coordinates.longitude;
    }

    params.PageSize = MAX_ITEMS_PER_PAGE;

    this.dataLoader.getAllTrails(params).then(
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
        // this.dataLoader.fetchTrails(Number(page));

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
