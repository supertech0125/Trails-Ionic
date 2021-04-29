import { createReducer, on } from '@ngrx/store';
import { uniqBy } from 'lodash-es';
import { ITrailsResponse, Trails } from '../../models/trails.model';
import {
  clearTrailsAction,
  paginateTrailsAction,
  TrailsAction,
  TrailsActionFailure,
  TrailsActionSuccess,
  SetUpdatedTrail,
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

const updateBookmarkedTrail = (data: Trails[], id: any, flag: boolean) => {
  console.log('flag', flag);
  let temp = [];
  data.map((a: any) => {
    let trail: any;
    if (a.id == id) trail = { ...a, isbookMarked: flag };
    else trail = { ...a };
    temp.push(trail);
  })
  return temp;
}

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
  on(SetUpdatedTrail, (state, action) => ({
    ...state,
    trailsData: updateBookmarkedTrail(state.trailsData, action.id, action.flag),
    trailsLoading: false,
    trailsLoaded: true,
  })),
  on(TrailsActionSuccess, (state, action) => ({
    ...state,
    trails: action.trails,
    // trailsData: trailsData(action.trails.data, state),
    trailsData: action.trails.data,
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
