import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlacesState, SearchPlacesState } from './Places.reducer';

export const placesSelectorState = createFeatureSelector<PlacesState>('places');

export const placesSelector = createSelector(
  placesSelectorState,
  (places) => places,
  (placesData) => placesData,
  (placesError) => placesError,
  (placesLoading) => placesLoading,
  (placesLoaded) => placesLoaded
);

export const arePlacesLoaded = createSelector(
  placesSelectorState,
  (state) => state.placesLoaded
);

export const isPlacesLoading = createSelector(
  placesSelectorState,
  (state) => state.placesLoading
);

export const placesDataSelector = createSelector(
  placesSelectorState,
  (state) => state.placesData
);

export const searchPlacesDataSelector = createSelector(
  placesSelectorState,
  (state) => state.placesData
);

export const searchPlacesSelectorState = createFeatureSelector<SearchPlacesState>(
  'searchPlaces'
);
export const searchPlacesSelector = createSelector(
  searchPlacesSelectorState,
  (searchPlaces) => searchPlaces,
  (searchPlacesData) => searchPlacesData,
  (searchPlacesError) => searchPlacesError,
  (searchPlacesLoading) => searchPlacesLoading,
  (searchPlacesLoaded) => searchPlacesLoaded
);
