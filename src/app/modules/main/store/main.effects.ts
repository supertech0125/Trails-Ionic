import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  IsUSERLoadedAction,
  MainActionTypes,
  CreatedTrailAction,
  AllUsersTrailsAction,
  AllCreatedTrailAction,
  AllTrailsAction,
  MapAllTrailsAction,
  AllPlacesAction,
  MapAllPlacesAction,
} from './main.actions';
import { MainState } from './main.reducer';
import {
  IS_USER_PROFILE_LOADED,
  TRAIL_STEP_TRAILS_CREATED,
  TRAIL_STEP_ALL_USERS_TRAILS,
  TRAIL_STEP_ALL_PLACES,
  TRAIL_STEP_TRAILS_ALL_CREATED,
  TRAIL_STEP_ALL_TRAILS,
  TRAIL_STEP_ALL_MAP_TRAILS,
  TRAIL_STEP_ALL_MAP_PLACES,
} from './../../../shared/constants/utils';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { DataLoaderService } from 'src/app/shared/services/data-loader.service';

@Injectable()
export class MainEffects {
  constructor(
    private actions$: Actions,
    private store: Store<MainState>,
    private storage: LocalStorageService,
    private dataLoader: DataLoaderService,
  ) {}

  @Effect({ dispatch: false })
  public userInfo$ = this.actions$.pipe(
    ofType<IsUSERLoadedAction>(MainActionTypes.isUserLoadedAction),
    tap(() => {
      this.storage.setItem(IS_USER_PROFILE_LOADED, true);
    })
  );

  @Effect({ dispatch: false })
  public allPlacesData$ = this.actions$.pipe(
    ofType<AllPlacesAction>(MainActionTypes.allPlacesAction),
    tap((action) => {
      this.storage.setItem(TRAIL_STEP_ALL_PLACES, action.payload.allPlaces);
    })
  );

  @Effect({ dispatch: false })
  public mapAllPlacesData$ = this.actions$.pipe(
    ofType<MapAllPlacesAction>(MainActionTypes.mapAllPlacesAction),
    tap((action) => {
      this.storage.setItem(
        TRAIL_STEP_ALL_MAP_PLACES,
        action.payload.mapAllPlaces
      );
    })
  );

  @Effect({ dispatch: false })
  public allTrailsData$ = this.actions$.pipe(
    ofType<AllTrailsAction>(MainActionTypes.allTrailsAction),
    tap((action) => {
      this.storage.setItem(TRAIL_STEP_ALL_TRAILS, action.payload.allTrails);
    })
  );

  @Effect({ dispatch: false })
  public mapAllTrailsData$ = this.actions$.pipe(
    ofType<MapAllTrailsAction>(MainActionTypes.mapAllTrailsAction),
    tap((action) => {
      this.storage.setItem(
        TRAIL_STEP_ALL_MAP_TRAILS,
        action.payload.mapAllTrails
      );
    })
  );

  @Effect({ dispatch: false })
  public createdTrailEffect$ = this.actions$.pipe(
    ofType<CreatedTrailAction>(MainActionTypes.createdTrail),
    tap((action) => {
      this.storage.setItem(
        TRAIL_STEP_TRAILS_CREATED,
        action.payload.createdTrails
      );
    })
  );

  @Effect({ dispatch: false })
  public allCreatedTrailEffect$ = this.actions$.pipe(
    ofType<AllCreatedTrailAction>(MainActionTypes.allCreatedTrail),
    tap((action) => {
      this.storage.setItem(
        TRAIL_STEP_TRAILS_ALL_CREATED,
        action.payload.allCreatedTrails
      );
    })
  );

  @Effect({ dispatch: false })
  public allUsersTrailsEffects$ = this.actions$.pipe(
    ofType<AllUsersTrailsAction>(MainActionTypes.allUsersTrailAction),
    tap((action) => {
      this.storage.setItem(
        TRAIL_STEP_ALL_USERS_TRAILS,
        action.payload.allUsersTrails
      );
    })
  );
}
