import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { MainService } from '../../services/main.service';
import { switchMap } from 'rxjs/operators';
import {
  PlacesActionFailure,
  PlacesActionSuccess,
  ActionTypes,
} from './Places.action';

@Injectable()
export class PlacesEffects {
  constructor(private actions$: Actions, private mainService: MainService) {}

  placesData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.placesAction),
      switchMap(({ params }) =>
        this.mainService
          .getAllPlaces(params)
          .then((places) =>
            PlacesActionSuccess({
              places,
            })
          )
          .catch((error: any) =>
            PlacesActionFailure({
              error,
            })
          )
      )
    )
  );
}
