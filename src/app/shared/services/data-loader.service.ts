import { IPlacesResponse } from './../../modules/main/models/places.model';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { AuthService } from './../../modules/auth/services/auth.service';
import { MainService } from './../../modules/main/services/main.service';

import { AuthState } from './../../modules/auth/store/auth.reducers';
import { MainState } from './../../modules/main/store/main.reducer';

import { ProfileInfoAction } from './../../modules/auth/store/auth.actions';
import {
  CreatedTrailAction,
  SetCreatedTrailBookMark,
  AllUsersTrailsAction,
  AllPlacesAction,
  AllTrailsAction,
  MapAllPlacesAction,
  MapAllTrailsAction,
} from './../../modules/main/store/main.actions';
import { IPlaceQueryParams } from 'src/app/modules/main/models/places.model';
import { LocalStorageService } from './local-storage.service';
import {
  TRAIL_CURRENT_USER_PROFILE,
  TRAIL_STEP_ALL_USERS_TRAILS,
  TRAIL_STEP_PLACES,
  TRAIL_STEP_PLACES_SAVED,
  TRAIL_STEP_PLACES_TYPES,
  TRAIL_STEP_TRAILS,
  TRAIL_STEP_TRAILS_CREATED,
  TRAIL_STEP_TRAILS_SAVED,
  TRAIL_STEP_ALL_PLACES,
  TRAIL_STEP_ALL_TRAILS,
  TRAIL_STEP_PLACES_LOADING,
  TRAIL_STEP_PLACES_SAVED_LOADING,
  TRAIL_STEP_TRAILS_LOADING,
  TRAIL_STEP_TRAILS_SAVED_LOADING,
  TRAIL_STEP_TRAILS_CREATED_LOADING,
  TRAIL_STEP_ALL_MAP_PLACES,
  TRAIL_STEP_ALL_MAP_TRAILS,
} from '../constants/utils';
import {
  IAllUserTrailsResponse,
  ITrailQueryParams,
  ITrailsResponse,
} from 'src/app/modules/main/models/trails.model';
import { PubsubService } from './pubsub.service';
import {
  PlacesActionFailure,
  PlacesActionSuccess,
  SearchPlacesActionSuccess,
  SetUpdatedPlace,
} from 'src/app/modules/main/store/Places/Places.action';
import { BookmarkedsPlacesList, SetUpdatedBookmarkPlace } from './../../modules/main/store/BookmarkPlaces/BookmarkPlaces.action';
import { BookmarkedTrailsList, SetUpdatedBookmarkTrail } from './../../modules/main/store/BookmarkTrails/BookmarkTrails.action';
import {
  TrailsActionFailure,
  TrailsActionSuccess,
  SetUpdatedTrail,
} from 'src/app/modules/main/store/Trails/Trails.action';
import { PlaceTypesActionSuccess } from 'src/app/modules/main/store/PlaceTypes/PlaceTypes.action';

@Injectable({
  providedIn: 'root',
})
export class DataLoaderService {
  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private authStore: Store<AuthState>,
    private mainStore: Store<MainState>,
    private storage: LocalStorageService,
    private pubsub: PubsubService
  ) { }

  refreshProfileData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.currentUser().subscribe(
        (response: any) => {
          if (response) {
            this.authStore.dispatch(
              new ProfileInfoAction({ profileInfo: response })
            );
          }
          resolve(true);
        },
        () => {
          this.offlineRefreshProfileData();
          resolve(false);
        }
      );
    });
  }

  getAllPlaces(
    params?: IPlaceQueryParams,
    enableCaching: boolean = true,
    showLoading: boolean = false,
    forMapping: boolean = false
  ): Promise<any> {
    if (showLoading) {
      this.pubsub.$pub(TRAIL_STEP_PLACES_LOADING, true);
    }
    return new Promise((resolve, reject) => {
      this.mainService.getAllPlaces(params).then(
        (response: IPlacesResponse) => {
          if (response) {
            if (enableCaching) {
              this.mainStore.dispatch(
                PlacesActionSuccess({ places: response })
              );
              this.mainStore.dispatch(
                SearchPlacesActionSuccess({ places: response })
              );
              this.setAllPlaces(response.pageIndex, response);
            }

            if (forMapping) {
              this.setAllMapPlaces(response.pageIndex, response);
            }
          }
          if (showLoading) {
            this.pubsub.$pub(TRAIL_STEP_PLACES_LOADING, false);
          }
          resolve(true);
        },
        (error) => {
          console.log('getAllPlaces error');
          this.mainStore.dispatch(
            PlacesActionFailure({
              error,
            })
          );
          if (showLoading) {
            this.pubsub.$pub(TRAIL_STEP_PLACES_LOADING, false);
          }
          const page = params.PageIndex || 1;
          // this.fetchPlaces(page);
          resolve(false);
        }
      );
    });
  }

  setUpdatedPlace(id: any, flag: boolean): void {
    this.mainStore.dispatch(
      SetUpdatedPlace({ id, flag })
    );
  }

  getAllBookmarkedPlaces(params?: IPlaceQueryParams): Promise<any> {
    this.pubsub.$pub(TRAIL_STEP_PLACES_SAVED_LOADING, true);
    return new Promise((resolve, reject) => {
      this.mainService
        .getAllBookmarkedPlaces(params)
        .then((resp) => resp.data)
        .then(
          (response: any) => {
            if (response) {
              this.mainStore.dispatch(
                BookmarkedsPlacesList({ bookmarkPlaces: response })
              );
            }
            this.pubsub.$pub(TRAIL_STEP_PLACES_SAVED_LOADING, false);
            resolve(true);
          },
          () => {
            this.pubsub.$pub(TRAIL_STEP_PLACES_SAVED_LOADING, false);
            // this.offlineGetAllBookmarkedPlaces();
            resolve(false);
          }
        );
    });
  }

  setUpdatedBookmarkedPlace(id: any, flag: boolean): void {
    this.mainStore.dispatch(
      SetUpdatedBookmarkPlace({ id, flag })
    );
  }

  getAllTrails(
    params?: ITrailQueryParams,
    enableCaching: boolean = true,
    showLoading: boolean = false,
    forMapping: boolean = false
  ): Promise<any> {
    if (showLoading) {
      this.pubsub.$pub(TRAIL_STEP_TRAILS_LOADING, true);
    }

    return new Promise((resolve, reject) => {
      this.mainService.getAllTrails(params).then(
        (response: ITrailsResponse) => {
          if (response) {
            if (enableCaching) {
              this.mainStore.dispatch(
                TrailsActionSuccess({ trails: response })
              );
              this.setAllTrails(response.pageIndex, response);
            }

            if (forMapping) {
              this.setAllMapTrails(response.pageIndex, response);
            }
          }

          if (showLoading) {
            this.pubsub.$pub(TRAIL_STEP_TRAILS_LOADING, false);
          }

          resolve(true);
        },
        (error) => {
          console.log('getAllTrails error');

          this.mainStore.dispatch(TrailsActionFailure({ error }));

          if (showLoading) {
            this.pubsub.$pub(TRAIL_STEP_TRAILS_LOADING, false);
          }

          const page = params.PageIndex || 1;
          this.fetchTrails(page);
          resolve(false);
        }
      );
    });
  }

  setUpdatedTrail(id: any, flag: boolean): void {
    this.mainStore.dispatch(
      SetUpdatedTrail({ id, flag })
    );
  }

  getAllBookmarkedTrails(params?: IPlaceQueryParams): Promise<any> {
    this.pubsub.$pub(TRAIL_STEP_TRAILS_SAVED_LOADING, true);
    return new Promise((resolve, reject) => {
      this.mainService
        .getAllBookmarkedTrails(params)
        .then((resp) => resp.data)
        .then(
          (response: any) => {
            if (response) {
              this.mainStore.dispatch(
                BookmarkedTrailsList({ bookmarkTrails: response })
              );
            }
            this.pubsub.$pub(TRAIL_STEP_TRAILS_SAVED_LOADING, false);
            resolve(true);
          },
          () => {
            this.pubsub.$pub(TRAIL_STEP_TRAILS_SAVED_LOADING, false);
            this.offlineGetAllBookmarkedTrails();
            resolve(false);
          }
        );
    });
  }

  setUpdatedBookmarkedTrail(id: any, flag: boolean): void {
    this.mainStore.dispatch(
      SetUpdatedBookmarkTrail({ id, flag })
    );
  }

  getAllCreatedTrails(userId: string, params: ITrailQueryParams): Promise<any> {
    this.pubsub.$pub(TRAIL_STEP_TRAILS_CREATED_LOADING, true);
    return new Promise((resolve, reject) => {
      this.mainService.getTrailsByUserId(userId, params).subscribe(
        (response: any) => {
          if (response) {
            this.mainStore.dispatch(
              new CreatedTrailAction({ createdTrails: response })
            );
          }
          this.pubsub.$pub(TRAIL_STEP_TRAILS_CREATED_LOADING, false);
          resolve(true);
        },
        () => {
          this.pubsub.$pub(TRAIL_STEP_TRAILS_CREATED_LOADING, false);
          this.offlineGetAllCreatedTrails();
          resolve(false);
        }
      );
    });
  }

  setCreatedTrailsBookMark(id: any, flag: boolean): void {
    this.mainStore.dispatch(
      new SetCreatedTrailBookMark({id, flag})
    );
  }

  setAllUsersTrails(userId: string, trails: ITrailsResponse) {
    let allUsersArr: IAllUserTrailsResponse[] = [];

    const allUsersArrItem = this.storage.getItem(TRAIL_STEP_ALL_USERS_TRAILS);
    if (allUsersArrItem) {
      allUsersArr = [...allUsersArrItem];
    }

    const result = allUsersArr.find((item) => item.userId === userId);
    const index = allUsersArr.findIndex((item) => item.userId === userId);
    if (result) {
      allUsersArr[index] = {
        userId,
        trails,
      };
    } else {
      allUsersArr.push({
        userId,
        trails,
      });
    }

    this.mainStore.dispatch(
      new AllUsersTrailsAction({
        allUsersTrails: [...allUsersArr],
      })
    );
  }

  setAllPlaces(pageIndex: number, place: IPlacesResponse) {
    let allPlacesArr: IPlacesResponse[] = [];
    const allPlacesArrItem = this.storage.getItem(TRAIL_STEP_ALL_PLACES);
    if (allPlacesArrItem) {
      allPlacesArr = [...allPlacesArrItem];
    }

    const result = allPlacesArr.find((item) => item.pageIndex === pageIndex);
    const index = allPlacesArr.findIndex(
      (item) => item.pageIndex === pageIndex
    );
    if (result) {
      allPlacesArr[index] = {
        ...place,
      };
    } else {
      allPlacesArr.push({
        ...place,
      });
    }

    this.mainStore.dispatch(
      new AllPlacesAction({
        allPlaces: [...allPlacesArr],
      })
    );
  }

  setAllTrails(pageIndex: number, place: ITrailsResponse) {
    let allTrailsArr: ITrailsResponse[] = [];
    const allTrailsArrItem = this.storage.getItem(TRAIL_STEP_ALL_TRAILS);
    if (allTrailsArrItem) {
      allTrailsArr = [...allTrailsArrItem];
    }

    const result = allTrailsArr.find((item) => item.pageIndex === pageIndex);
    const index = allTrailsArr.findIndex(
      (item) => item.pageIndex === pageIndex
    );
    if (result) {
      allTrailsArr[index] = {
        ...place,
      };
    } else {
      allTrailsArr.push({
        ...place,
      });
    }

    this.mainStore.dispatch(
      new AllTrailsAction({
        allTrails: [...allTrailsArr],
      })
    );
  }

  setAllMapPlaces(pageIndex: number, place: IPlacesResponse) {
    let allPlacesArr: IPlacesResponse[] = [];
    const allPlacesArrItem = this.storage.getItem(TRAIL_STEP_ALL_MAP_PLACES);
    if (allPlacesArrItem) {
      allPlacesArr = [...allPlacesArrItem];
    }

    const result = allPlacesArr.find((item) => item.pageIndex === pageIndex);
    const index = allPlacesArr.findIndex(
      (item) => item.pageIndex === pageIndex
    );
    if (result) {
      allPlacesArr[index] = {
        ...place,
      };
    } else {
      allPlacesArr.push({
        ...place,
      });
    }

    this.mainStore.dispatch(
      new MapAllPlacesAction({
        mapAllPlaces: [...allPlacesArr],
      })
    );
  }

  setAllMapTrails(pageIndex: number, trail: ITrailsResponse) {
    let allTrailsArr: ITrailsResponse[] = [];
    const allTrailsArrItem = this.storage.getItem(TRAIL_STEP_ALL_MAP_TRAILS);
    if (allTrailsArrItem) {
      allTrailsArr = [...allTrailsArrItem];
    }

    const result = allTrailsArr.find((item) => item.pageIndex === pageIndex);
    const index = allTrailsArr.findIndex(
      (item) => item.pageIndex === pageIndex
    );
    if (result) {
      allTrailsArr[index] = {
        ...trail,
      };
    } else {
      allTrailsArr.push({
        ...trail,
      });
    }

    this.mainStore.dispatch(
      new MapAllTrailsAction({
        mapAllTrails: [...allTrailsArr],
      })
    );
  }

  fetchPlaces(pageIndex: number) {
    console.log('fetchPlaces: ', pageIndex);
    let allPlacesArr: IPlacesResponse[] = [];
    const allPlacesArrItem = this.storage.getItem(TRAIL_STEP_ALL_PLACES);
    if (allPlacesArrItem) {
      allPlacesArr = [...allPlacesArrItem];
    }
    const result = allPlacesArr.find((item) => item.pageIndex === pageIndex);
    // this.mainStore.dispatch(new PlacesAction({ places: result }));
  }

  fetchTrails(pageIndex: number) {
    console.log('fetchTrails: ', pageIndex);
    let allTrailsArr: ITrailsResponse[] = [];
    const allTrailsArrItem = this.storage.getItem(TRAIL_STEP_ALL_TRAILS);
    if (allTrailsArrItem) {
      allTrailsArr = [...allTrailsArrItem];
    }
    const result = allTrailsArr.find((item) => item.pageIndex === pageIndex);
    this.mainStore.dispatch(TrailsActionSuccess({ trails: result }));
  }

  offlineRefreshProfileData() {
    const profileInfo = this.storage.getItem(TRAIL_CURRENT_USER_PROFILE);
    this.authStore.dispatch(
      new ProfileInfoAction({
        profileInfo: {
          ...profileInfo,
        },
      })
    );
  }

  offlineGetAllPlaces() {
    const placesData = this.storage.getItem(TRAIL_STEP_PLACES);
    this.mainStore.dispatch(
      PlacesActionSuccess({
        places: {
          ...placesData,
        },
      })
    );
    this.fetchPlaces(1);
  }

  offlineGetAllBookmarkedPlaces() {
    const bookmarkPlaces = this.storage.getItem(TRAIL_STEP_PLACES_SAVED);
    if (bookmarkPlaces) {
      this.mainStore.dispatch(
        BookmarkedsPlacesList({
          bookmarkPlaces: [...bookmarkPlaces],
        })
      );
    }
  }

  offlineGetAllTrails() {
    const trailsData = this.storage.getItem(TRAIL_STEP_TRAILS);
    if (trailsData) {
      this.mainStore.dispatch(
        TrailsActionSuccess({
          trails: {
            ...trailsData,
          },
        })
      );
    }

    this.fetchTrails(1);
  }

  offlineGetAllBookmarkedTrails() {
    const trailsData = this.storage.getItem(TRAIL_STEP_TRAILS_SAVED);
    if (trailsData) {
      this.mainStore.dispatch(
        BookmarkedTrailsList({
          bookmarkTrails: [...trailsData],
        })
      );
    }
  }

  offlineGetAllCreatedTrails() {
    const trailsData = this.storage.getItem(TRAIL_STEP_TRAILS_CREATED);
    if (trailsData) {
      this.mainStore.dispatch(
        new CreatedTrailAction({
          createdTrails: {
            ...trailsData,
          },
        })
      );
    }
  }

  offlineGetPlaceTypes() {
    const placesData = this.storage.getItem(TRAIL_STEP_PLACES_TYPES);
    if (placesData) {
      this.mainStore.dispatch(
        PlaceTypesActionSuccess({
          placeTypes: [...placesData],
        })
      );
    }
  }
}
