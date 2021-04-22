import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { IPlaceTypes } from '../../models/places.model';
import { PlaceTypesActionSuccess } from './PlaceTypes.action';

export interface PlaceTypesState {
  placeTypes?: IPlaceTypes[];
}

export const initialPlaceTypesState: PlaceTypesState = {
  placeTypes: undefined,
};

export const placeTypesReducer = createReducer(
  initialPlaceTypesState,
  on(PlaceTypesActionSuccess, (state, action) => ({
    ...state,
    placeTypes: action.placeTypes,
  }))
);

export const placeTypesSelectorState = createFeatureSelector<PlaceTypesState>(
  'placeTypes'
);

export const placeTypesSelector = createSelector(
  placeTypesSelectorState,
  (state: PlaceTypesState) => state.placeTypes
);
