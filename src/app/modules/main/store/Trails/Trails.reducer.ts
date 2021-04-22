import { createReducer, on } from '@ngrx/store';
import { uniqBy } from 'lodash-es';
import { ITrailsResponse, Trails } from '../../models/trails.model';
import {
  clearTrailsAction,
  paginateTrailsAction,
  TrailsAction,
  TrailsActionFailure,
  TrailsActionSuccess,
} from './Trails.action';

export interface TrailsState {
  trails?: ITrailsResponse | null;
  trailsData?: Trails[] | null;
  trailsError: any | null;
  trailsLoading: boolean;
  trailsLoaded: boolean;
  trailsOnSearching: boolean;
  trailsOnPaginate: boolean;
}

export const initialPlacesState: TrailsState = {
  trails: undefined,
  trailsData: [],
  trailsLoading: true,
  trailsLoaded: false,
  trailsError: null,
  trailsOnSearching: false,
  trailsOnPaginate: false,
};

const trailsData = (places: any[], state): Trails[] => {
  let itemPlaces = [...state.trailsData];
  places.forEach((content) => {
    itemPlaces.push(content);
  });
  itemPlaces = uniqBy(itemPlaces, 'id');
  return itemPlaces;
};

export const trailsReducer = createReducer(
  initialPlacesState,
  on(paginateTrailsAction, (state, action) => ({
    ...state,
    trailsOnPaginate: action.paginate,
  })),
  on(clearTrailsAction, (state) => ({
    ...state,
    trails: undefined,
    trailsData: [],
    trailsLoading: true,
    trailsLoaded: false,
    trailsError: null,
    trailsOnPaginate: false,
  })),
  on(TrailsAction, (state) => ({
    ...state,
    trailsLoading: state.trailsOnPaginate ? false : true,
    trailsLoaded:
      state.trailsData && state.trailsData.length > 0 ? true : false,
  })),
  on(TrailsActionSuccess, (state, action) => ({
    ...state,
    trails: action.trails,
    trailsData: trailsData(action.trails.data, state),
    trailsLoading: false,
    trailsLoaded: true,
  })),
  on(TrailsActionFailure, (state, action) => ({
    ...state,
    trailsLoading: false,
    trailsLoaded: false,
    trailsError: action.error,
  }))
);
