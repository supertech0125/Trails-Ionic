import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { MainService } from '../../services/main.service';
import { switchMap } from 'rxjs/operators';
import {
  TrailsActionFailure,
  TrailsActionSuccess,
  ActionTypes,
} from './Trails.action';

@Injectable()
export class TrailsEffects {
  constructor(private actions$: Actions, private mainService: MainService) {}

  trailsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.trailsAction),
      switchMap(({ params }) =>
        this.mainService
          .getAllTrails(params)
          .then((trails) =>
            TrailsActionSuccess({
              trails,
            })
          )
          .catch((error: any) =>
            TrailsActionFailure({
              error,
            })
          )
      )
    )
  );
}
