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

export const trailFilterSelector = createSelector(
  mainSelectorState,
  (state: MainState) => state.trailFilter
);

export const trailSortSelector = createSelector(
  mainSelectorState,
  (state: MainState) => state.trailSort
);

export const placeFilterSelector = createSelector(
  mainSelectorState,
  (state: MainState) => state.placeFilter
);

export const placeSortSelector = createSelector(
  mainSelectorState,
  (state: MainState) => state.placeSort
);

export const addTrailStepFilterSelector = createSelector(
  mainSelectorState,
  (state: MainState) => state.addTrailStepFilter
);

export const addTrailStepSortSelector = createSelector(
  mainSelectorState,
  (state: MainState) => state.addTrailStepSort
);
