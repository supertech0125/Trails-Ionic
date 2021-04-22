import { createAction, props } from '@ngrx/store';
import { IPlaceTypes } from '../../models/places.model';

export enum PlaceTypeActionTypes {
  Place_Types_Action = '[main] Place Types',
  Place_Types_Action_Success = '[main] Place Types Success',
  Place_Types_Action_Failure = '[main] Place Types Failure',
}

export const PlaceTypesAction = createAction(
  PlaceTypeActionTypes.Place_Types_Action
);

export const PlaceTypesActionSuccess = createAction(
  PlaceTypeActionTypes.Place_Types_Action_Success,
  props<{ placeTypes: IPlaceTypes[] }>()
);

export const PlaceTypesActionFailure = createAction(
  PlaceTypeActionTypes.Place_Types_Action_Failure,
  props<{ message: string }>()
);
