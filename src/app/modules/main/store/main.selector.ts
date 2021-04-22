import { createSelector } from '@ngrx/store';
import { MainState } from './main.reducer';

export const mainSelectorState = (state) => state.main;

export const mainSelector = createSelector(
  mainSelectorState,
  (profileInfo) => profileInfo,
  (bookmarkTrails) => bookmarkTrails,
  (createdTrails) => createdTrails,
  (trails) => trails,
  (allUsersTrails) => allUsersTrails
);


export const allMapPlacesSelector = createSelector(
  mainSelectorState,
  (state: MainState) => state.mapAllPlaces
);


export const allMapTrailsSelector = createSelector(
  mainSelectorState,
  (state: MainState) => state.mapAllTrails
);

export const createdTrailsSelector = createSelector(
  mainSelectorState,
  (state: MainState) => state.createdTrails
);

export const allUsersTrailsSelector = createSelector(
  mainSelectorState,
  (state: MainState) => state.allUsersTrails
);
