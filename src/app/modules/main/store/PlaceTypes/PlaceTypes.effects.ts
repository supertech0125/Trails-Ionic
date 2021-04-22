import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { MainService } from '../../services/main.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { TRAIL_STEP_PLACES_TYPES } from 'src/app/shared/constants/utils';
import {
  PlaceTypeActionTypes,
  PlaceTypesActionFailure,
  PlaceTypesActionSuccess,
} from './PlaceTypes.action';

@Injectable()
export class PlaceTypesEffects {
  constructor(
    private actions$: Actions,
    private mainService: MainService,
    private storage: LocalStorageService
  ) {}

  placeTypesEffects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlaceTypeActionTypes.Place_Types_Action),
      mergeMap(() =>
        this.mainService.getPlaceTypes().pipe(
          map((types) =>
            PlaceTypesActionSuccess({
              placeTypes: types,
            })
          ),
          tap((action) => {
            this.storage.setItem(TRAIL_STEP_PLACES_TYPES, action.placeTypes);
          }),
          catchError((error: any) => of(PlaceTypesActionFailure(error)))
        )
      )
    )
  );
}
