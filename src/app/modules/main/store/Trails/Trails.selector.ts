import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrailsState } from './Trails.reducer';

export const trailsSelectorState = createFeatureSelector<TrailsState>('trails');

export const trailsSelector = createSelector(
  trailsSelectorState,
  (trails) => trails,
  (trailsData) => trailsData,
  (trailsError) => trailsError,
  (trailsLoading) => trailsLoading,
  (trailsLoaded) => trailsLoaded
);

export const areTrailsLoaded = createSelector(
  trailsSelectorState,
  (state) => state.trailsLoaded
);

export const isTrailsLoading = createSelector(
  trailsSelectorState,
  (state) => state.trailsLoading
);

export const trailsDataSelector = createSelector(
  trailsSelectorState,
  (state) => state.trailsData
);