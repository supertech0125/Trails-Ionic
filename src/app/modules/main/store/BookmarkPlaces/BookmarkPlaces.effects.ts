import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MainService } from '../../services/main.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import {
  MAX_ITEMS_PER_PAGE,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from 'src/app/shared/constants/utils';
import {
  BookmarkedsPlacesList,
  ActionTypes,
  BookmarkedsPlacesFailure,
} from './BookmarkPlaces.action';
import { IPlaceQueryParams } from '../../models/places.model';
import { DataLoaderService } from 'src/app/shared/services/data-loader.service';

@Injectable()
export class BookmarkPlacesEffects {
  coordinates: any = {};
  params: IPlaceQueryParams;

  constructor(
    private actions$: Actions,
    private store: Store,
    private mainService: MainService,
    private dataLoader: DataLoaderService,
    private storage: LocalStorageService
  ) {
    this.coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    this.params = {
      PageSize: MAX_ITEMS_PER_PAGE,
      Sort: 'distance',
    };

    if (this.coordinates) {
      this.params = {
        ...this.params,
        Lat: this.coordinates.latitude,
        Long: this.coordinates.longitude,
      };
    }
  }

  bookmarkPlaceData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.bookmarkPlacesAction),
      switchMap(({ params }) =>
        this.mainService
          .getAllBookmarkedPlaces(params)
          .then((places) =>
            BookmarkedsPlacesList({
              bookmarkPlaces: places,
            })
          )
          .catch((error: any) => BookmarkedsPlacesFailure(error))
      )
    )
  );

  bookmarkPlaceEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.bookMarkPlace),
      switchMap(({ placeId }) => {
        this.mainService.bookmarkPlace(placeId).then(
          (response) => {
            if (response && response.bookMarkId !== null) {
              Promise.all([
                this.dataLoader.getAllPlaces(this.params),
                this.dataLoader.getAllBookmarkedPlaces(this.params),
              ]);
            }
          },
          (error) => of({ error })
        );
        return this.bookmarkPlaceData$;
      })
    )
  );

  unBookmarkPlaceEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.unbookMarkPlace),
      switchMap(({ placeId }) => {
        this.mainService.unBookmarkPlace(placeId).then(
          (response) => {
            console.log('response: ', response);
            if (response && response.statusCode === 200) {
              Promise.all([
                this.dataLoader.getAllPlaces(this.params),
                this.dataLoader.getAllBookmarkedPlaces(this.params),
              ]);
            }
          },
          (error) => of({ error })
        );
        return this.bookmarkPlaceData$;
      })
    )
  );
}
