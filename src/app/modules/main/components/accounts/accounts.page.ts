import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import cloneDeep from 'lodash-es/cloneDeep';
import each from 'lodash-es/each';
import orderBy from 'lodash-es/orderBy';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/shared/services/common.service';

import {
  TRAIL_CURRENT_USER_PROFILE,
  MAX_ITEMS_PER_PAGE,
  ACCOUNTS_PAGE_TABS,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from './../../../../shared/constants/utils';
import { UserProfile } from './../../../auth/models/auth.model';

import { MainState } from '../../store/main.reducer';

import { LocalStorageService } from './../../../../shared/services/local-storage.service';
import { FormatterServices } from './../../services/formatter.service';
import { DataLoaderService } from './../../../../shared/services/data-loader.service';

import { createdTrailsSelector } from '../../store/main.selector';
import { bookmarkPlacesSelector } from '../../store/BookmarkPlaces/BookmarkPlaces.store';
import { bookmarkTrailsSelector } from '../../store/BookmarkTrails/BookmarkTrails.store';

import { Places } from '../../models/places.model';
import { ITrailsResponse, Trails } from '../../models/trails.model';
import { PubsubService } from 'src/app/shared/services/pubsub.service';
import { ScreensizeService } from 'src/app/shared/services/screensize.service';

@Component({
  selector: 'app-accounts',
  templateUrl: 'accounts.page.html',
  styleUrls: ['accounts.page.scss'],
})
export class AccountsPage implements OnInit, OnDestroy {
  accountTabs = ACCOUNTS_PAGE_TABS;

  activeSegment = 'created';
  currentProfile: UserProfile = {};

  unsubscribe$ = new Subject<any>();
  unsubscribe2$ = new Subject<any>();

  placesArr: Places[] = [];
  trailsArr: Trails[] = [];
  createTrailsArr: Trails[] = [];

  filterPlacesArr: Places[] = [];
  filterTrailsArr: Trails[] = [];
  filterCreatedTrailsArr: Trails[] = [];

  fakeArr: any[] = [];

  currentPlacesPage = 1;
  currentTrailsPage = 1;
  currentCreatedPage = 1;

  showSavedPlaces: boolean;
  showSavedTrails: boolean;
  showCreatedTrails: boolean;
  isDesktop: boolean;

  constructor(
    private store: Store<MainState>,
    private navCtrl: NavController,
    private storage: LocalStorageService,
    private formatter: FormatterServices,
    private dataLoader: DataLoaderService,
    private pubsub: PubsubService,
    private screensizeService: ScreensizeService,
    private commonService: CommonService
  ) {
    this.fakeArr = Array.from({
      length: 10,
    });

    this.pubsub.$sub('TRAIL_CURRENT_USER_PROFILE', () => {
      this.initUserProfile();
    });

    this.pubsub.$sub('TRAIL_STEP_PLACES_SAVED', (data) => {
      if(data.event === 'bookmark') {
        const tempSavedPlaces: any = [...this.filterPlacesArr];
        for (let i=0; i<tempSavedPlaces.length; i++) {
          if(tempSavedPlaces[i].placeId * 1 === data.data.id * 1) {
            tempSavedPlaces[i].isBookMarked = data.data.isBookMarked;
            break;
          }
        }

        const tempCreatedTrails: any = [...this.filterCreatedTrailsArr];
        for(let i=0; i<tempCreatedTrails.length; i++) {
          for(let j=0; j<tempCreatedTrails[i].trailPlace.length; j++) {
            if(tempCreatedTrails[i].trailPlace[j].placeId * 1 === data.data.id * 1) {
              tempCreatedTrails[i].trailPlace[j].isBookMarked = data.data.isBookMarked;
              break;
            }
          }
        }

        const tempTrails: any = [...this.filterTrailsArr];
        for(let i=0; i<tempTrails.length; i++) {
          for(let j=0; j<tempTrails[i].trailPlace.length; j++) {
            if(tempTrails[i].trailPlace[j].placeId * 1 === data.data.id * 1) {
              tempTrails[i].trailPlace[j].isBookMarked = data.data.isBookMarked;
              break;
            }
          }
        }
      }
      else {
        let activeSegment = this.activeSegment;
        ['created', 'trails', 'places'].map(data=>{
          this.activeSegment = data;
          this.doRefresh(null);
        });
        this.activeSegment = activeSegment;
      }
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
    this.initUserProfile();

    setTimeout(() => {
      this.initSavedPlaces();
      this.initSavedTrails();
      this.initCreatedTrails();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.unsubscribe2$.next();
    this.unsubscribe2$.complete();
  }

  editProfile() {
    this.navCtrl.navigateForward('/main/edit-profile');
  }

  doRefresh(event) {
    console.log('Begin async operation');
    const profile = this.storage.getItem(TRAIL_CURRENT_USER_PROFILE);
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);

    if (this.activeSegment === 'created') {
      this.showCreatedTrails = false;
      this.currentCreatedPage = 1;

      let params: any = {
        PageSize: MAX_ITEMS_PER_PAGE,
        Sort: 'distance',
      };

      if (coordinates) {
        params = {
          ...params,
          Lat: coordinates.latitude,
          Long: coordinates.longitude,
        };
      }

      this.dataLoader.getAllCreatedTrails(profile.id, params).then(
        () => {
          if (event && event.target) {
            event.target.disabled = true;
            event.target.complete();

            setTimeout(() => {
              event.target.disabled = false;
            }, 100);
          }
        },
        () => {
          if (event && event.target) {
            event.target.disabled = true;
            event.target.complete();

            setTimeout(() => {
              event.target.disabled = false;
            }, 100);
          }
        }
      );
    } else if (this.activeSegment === 'trails') {
      this.showSavedTrails = false;
      this.currentTrailsPage = 1;

      this.dataLoader.getAllBookmarkedTrails().then(
        () => {
          if (event && event.target) {
            event.target.disabled = true;
            event.target.complete();

            setTimeout(() => {
              event.target.disabled = false;
            }, 100);
          }
        },
        () => {
          if (event && event.target) {
            event.target.disabled = true;
            event.target.complete();

            setTimeout(() => {
              event.target.disabled = false;
            }, 100);
          }
        }
      );
    } else if (this.activeSegment === 'places') {
      this.showSavedPlaces = false;
      this.currentPlacesPage = 1;

      this.dataLoader.getAllBookmarkedPlaces().then(
        () => {
          if (event && event.target) {
            event.target.disabled = true;
            event.target.complete();

            setTimeout(() => {
              event.target.disabled = false;
            }, 100);
          }
        },
        () => {
          if (event && event.target) {
            event.target.disabled = true;
            event.target.complete();

            setTimeout(() => {
              event.target.disabled = false;
            }, 100);
          }
        }
      );
    }
  }

  // loadData(event) {
  //   if (this.activeSegment === 'created') {
  //     if (this.filterTrailsArr.length < MAX_ITEMS_PER_PAGE) {
  //       event.target.disabled = true;
  //     }

  //     this.currentCreatedPage += 1;
  //     this.paginateData(this.trailsArr);

  //     setTimeout(() => {
  //       event.target.complete();
  //       // App logic to determine if all data is loaded
  //       // and disable the infinite scroll
  //       if (this.filterTrailsArr.length === this.trailsArr.length) {
  //         event.target.disabled = true;
  //       }
  //     }, 1000);
  //   } else if (this.activeSegment === 'trails') {
  //   } else if (this.activeSegment === 'places') {
  //     if (this.filterPlacesArr.length < MAX_ITEMS_PER_PAGE) {
  //       event.target.disabled = true;
  //     }

  //     this.currentPlacesPage += 1;
  //     this.paginatePlaces(this.placesArr);

  //     setTimeout(() => {
  //       event.target.complete();
  //       if (this.filterPlacesArr.length === this.placesArr.length) {
  //         event.target.disabled = true;
  //       }
  //     }, 1000);
  //   }
  // }

  private sortByDistance(data: any) {
    data.sort((a: any, b: any) => (a.distanceToTrail * 1 > b.distanceToTrail * 1) ? 1 : -1)
    return data;
  }

  private sortByDistanceKM(data: any) {
    data.sort((a: any, b: any) => (a.distanceKM * 1 > b.distanceKM * 1) ? 1 : -1)
    return data;
  }

  private initUserProfile() {
    const profile = this.storage.getItem(TRAIL_CURRENT_USER_PROFILE);
    if (profile) {
      this.currentProfile = profile;
    }
  }

  private initSavedPlaces() {
    this.showSavedPlaces = false;
    this.store
      .pipe(select(bookmarkPlacesSelector), takeUntil(this.unsubscribe$))
      .subscribe(
        async (response) => {
          if (response) {
            const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
            this.placesArr = [];
            this.filterPlacesArr = [];

            const places = cloneDeep(response);
            const placesArr = this.formatter.formatPlace2(places);
            this.placesArr = cloneDeep(placesArr);

            this.filterPlacesArr = this.paginateData(
              this.currentPlacesPage,
              this.placesArr
            );

            // console.log('before sort', this.filterPlacesArr);
            try {
              await Promise.all(this.filterPlacesArr.map(async (a: any) => {
                let distance = this.commonService.PythagorasEquirectangular(
                  coordinates.latitude,
                  coordinates.longitude,
                  a.latitude,
                  a.longitude
                );
                a.distanceKM = Math.round(distance * 10) / 10;
                if ((a.distanceKM % 1) === 0) a.distanceKM += '.0';
              }))
            } catch (err) {
              console.log('getDistanceErr', err);
            }

            let result = this.sortByDistanceKM(this.filterPlacesArr);
            this.filterPlacesArr = result;

            // console.log('initSavedPlaces: ', this.filterPlacesArr);

            setTimeout(() => {
              this.showSavedPlaces = true;
            }, 300);
          } else {
            setTimeout(() => {
              this.showSavedPlaces = true;
            }, 300);
          }
        },
        () => {
          this.showSavedPlaces = true;
        }
      );
  }

  private initSavedTrails() {
    this.showSavedTrails = false;
    this.store
      .select(bookmarkTrailsSelector)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          if (response) {
            this.trailsArr = [];
            this.filterTrailsArr = [];

            const trails = cloneDeep(response);
            const trailsArr = this.formatter.formatTrails(trails);

            this.trailsArr = cloneDeep(trailsArr);

            this.filterTrailsArr = this.paginateData(
              this.currentTrailsPage,
              this.trailsArr
            );

            let result = this.sortByDistance(this.filterTrailsArr);
            this.filterTrailsArr = result;

            setTimeout(() => {
              this.showSavedTrails = true;
            }, 300);
          } else {
            setTimeout(() => {
              this.showSavedTrails = true;
            }, 300);
          }
        },
        () => {
          this.showSavedTrails = true;
        }
      );
  }

  private initCreatedTrails() {
    this.showCreatedTrails = false;
    this.store
      .pipe(select(createdTrailsSelector), takeUntil(this.unsubscribe$))
      .subscribe((response: ITrailsResponse) => {
        if (response) {
          if (response.data) {
            this.trailsArr = [];
            this.filterCreatedTrailsArr = [];

            const trails = cloneDeep(response.data);
            const trailsArr = this.formatter.formatTrails(trails);
            this.createTrailsArr = [...trailsArr];

            this.filterCreatedTrailsArr = this.paginateData(
              this.currentCreatedPage,
              this.createTrailsArr
            );

            let result = this.sortByDistance(this.filterCreatedTrailsArr);
            this.filterCreatedTrailsArr = result;

            // console.log('initCreatedTrails: ', this.filterCreatedTrailsArr);

            setTimeout(() => {
              this.showCreatedTrails = true;
            }, 300);
          }
        } else {
          setTimeout(() => {
            this.showCreatedTrails = true;
          }, 300);
        }
      });
  }

  private paginateData(currentPage: number, sourceArr: any[]) {
    const outputArr = [];
    const paginatedArr = this.formatter.paginateData(
      sourceArr,
      currentPage,
      MAX_ITEMS_PER_PAGE
    );
    each(paginatedArr.data, (place: any) => {
      outputArr.push(place);
    });

    return outputArr;
  }
}
