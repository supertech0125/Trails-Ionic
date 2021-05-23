import { Injectable } from '@angular/core';
import { ofType, Actions, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ITrailQueryParams } from '../../models/trails.model';
import { MainService } from '../../services/main.service';
import { DataLoaderService } from 'src/app/shared/services/data-loader.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import {
  MAX_ITEMS_PER_PAGE,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from 'src/app/shared/constants/utils';
import {
  ActionTypes,
  BookmarkedTrailsList,
  BookmarkedTrailsFailure,
} from '../BookmarkTrails/BookmarkTrails.action';
import { PubsubService } from 'src/app/shared/services/pubsub.service';

@Injectable()
export class BookmarkTrailsEffects {
  coordinates: any = {};
  params: ITrailQueryParams;

  constructor(
    private actions$: Actions,
    private mainService: MainService,
    private dataLoader: DataLoaderService,
    private storage: LocalStorageService,
    private pubsub: PubsubService
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

  bookmarkTrailsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.BookmarkTrailsAction),
      switchMap(({ params }) =>
        this.mainService
          .getAllBookmarkedTrails(params)
          .then((trails) =>
            BookmarkedTrailsList({
              bookmarkTrails: trails,
            })
          )
          .catch((error: any) => BookmarkedTrailsFailure(error))
      )
    )
  );

  bookmarkTrailEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.BookmarkTrails),
      switchMap(({ trailId }) => {
        this.mainService.bookmarkTrail(trailId).then(
          (response) => {
            if (response) {
              // Promise.all([
              //   this.dataLoader.getAllTrails(this.params, true, true),
              //   this.dataLoader.getAllBookmarkedTrails(this.params),
              // ]);
              Promise.all([
                // this.dataLoader.setUpdatedTrail(trailId, true),
                this.dataLoader.setUpdatedBookmarkedTrail(trailId, true),
                this.dataLoader.setCreatedTrailsBookMark(trailId, true),
              ]);

              this.pubsub.$pub('TRAIL_STEP_TRAILS_SAVED', {event: 'bookmark', data: {isBookMarked: true, id: trailId}});
            }
          },
          (error) => of({ error })
        );
        return this.bookmarkTrailsData$;
      })
    )
  );

  unBookmarkTrailEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.UnbookMarkTrails),
      switchMap(({ trailId }) => {
        this.mainService.unBookmarkTrail(trailId).then(
          (response) => {
            if (response && response.statusCode === 200) {
              console.log('unbookmarkTrailEffectResponse', response);
              // Promise.all([
              //   this.dataLoader.getAllTrails(this.params, true, true),
              //   this.dataLoader.getAllBookmarkedTrails(this.params),
              // ]);
              Promise.all([
                // this.dataLoader.setUpdatedTrail(trailId, false),
                this.dataLoader.setUpdatedBookmarkedTrail(trailId, false),
                this.dataLoader.setCreatedTrailsBookMark(trailId, false),
              ]);

              this.pubsub.$pub('TRAIL_STEP_TRAILS_SAVED', {event: 'bookmark', data: {isBookMarked: false, id: trailId}});
            }
          },
          (error) => of({ error })
        );
        return this.bookmarkTrailsData$;
      })
    )
  );
}
