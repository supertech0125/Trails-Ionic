import { createReducer, on } from '@ngrx/store';
import { IPlacesResponse, Places } from '../../models/places.model';
import {
  clearPlacesAction,
  paginatePlacesAction,
  PlacesAction,
  PlacesActionFailure,
  PlacesActionSuccess,
  SearchPlacesActionSuccess,
  paginateSearchPlacesAction,
  clearSearchPlacesAction,
  SetUpdatedPlace,
} from './Places.action';

export interface PlacesState {
  places?: IPlacesResponse | null;
  placesData?: Places[] | null;
  placesError: any | null;
  placesLoading: boolean;
  placesLoaded: boolean;
  placesOnSearching: boolean;
  placesOnPaginate: boolean;
}

export interface SearchPlacesState {
  searchPlaces?: IPlacesResponse | null;
  searchPlacesData?: Places[] | null;
  searchPlacesError: any | null;
  searchPlacesLoading: boolean;
  searchPlacesLoaded: boolean;
  searchPlacesOnSearching: boolean;
  searchPlacesOnPaginate: boolean;
}

export const initialPlacesState: PlacesState = {
  places: undefined,
  placesData: [],
  placesLoading: true,
  placesLoaded: false,
  placesError: null,
  placesOnSearching: false,
  placesOnPaginate: false,
};

export const initialSearchPlacesState: SearchPlacesState = {
  searchPlaces: undefined,
  searchPlacesData: [],
  searchPlacesLoading: true,
  searchPlacesLoaded: false,
  searchPlacesError: null,
  searchPlacesOnSearching: false,
  searchPlacesOnPaginate: false,
};

const placesData = (places: any[], pageIndex: any, state): Places[] => {
  const itemPlaces = [...state.placesData];
  if (pageIndex * 1 === 1 && state.placesData) {
    itemPlaces.splice(0, state.placesData.length);
  }
  places.forEach((content) => {
    itemPlaces.push(content);
  });
  return itemPlaces;
  // if (pageIndex * 1 === 1) state.placeData = [];
  // places.forEach((content) => {
  //   state.placeData.push(content)
  // });
  // return state.placeData;
};

const searchPlacesData = (places: any[], state): Places[] => {
  const itemPlaces = [...state.searchPlacesData];
  places.forEach((content) => {
    itemPlaces.push(content);
  });
  return itemPlaces;
};

const updateBookmarkedPlace = (data: Places[], id: any, flag: boolean) => {
  let temp = [];
  data.map((a: any) => {
    let place: any;
    if (a.id == id) {
      place = { ...a, isBookMarked: flag };
    }
    else place = { ...a };
    temp.push(place);
  })
  return temp;
}

export const placesReducer = createReducer(
  initialPlacesState,
  on(paginatePlacesAction, (state, action) => ({
    ...state,
    placesOnPaginate: action.paginate,
  })),
  on(clearPlacesAction, (state) => ({
    ...state,
    places: undefined,
    placesData: [],
    placesLoading: true,
    placesLoaded: false,
    placesError: null,
    placesOnPaginate: false,
  })),
  on(PlacesAction, (state) => ({
    ...state,
    placesLoading: state.placesOnPaginate ? false : true,
    placesLoaded:
      state.placesData && state.placesData.length > 0 ? true : false,
  })),
  on(SetUpdatedPlace, (state, action) => ({
    ...state,
    placesData: updateBookmarkedPlace(state.placesData, action.id, action.flag),
    placesLoading: false,
    placesLoaded: true,
  })),
  on(PlacesActionSuccess, (state, action) => ({
    ...state,
    places: action.places,
    placesData: placesData(action.places.data, action.places.pageIndex, state),
    // placesData: action.places.data,
    placesLoading: false,
    placesLoaded: true,
  })),
  on(PlacesActionFailure, (state, action) => ({
    ...state,
    placesLoading: false,
    placesLoaded: false,
    placesError: action.error,
  }))
);

export const searchPlacesReducer = createReducer(
  initialSearchPlacesState,
  on(paginateSearchPlacesAction, (state, action) => ({
    ...state,
    searchPlacesOnPaginate: action.paginate,
  })),
  on(clearSearchPlacesAction, (state) => ({
    ...state,
    searchPlaces: undefined,
    searchPlacesData: [],
    searchPlacesLoading: true,
    searchPlacesLoaded: false,
    searchPlacesError: null,
    searchPlacesOnPaginate: false,
  })),
  on(SearchPlacesActionSuccess, (state, action) => ({
    ...state,
    searchPlaces: action.places,
    searchPlacesData: searchPlacesData(action.places.data, state),
    searchPlacesLoading: false,
    searchPlacesLoaded: true,
  })),
  on(PlacesActionFailure, (state, action) => ({
    ...state,
    searchPlacesLoading: false,
    searchPlacesLoaded: false,
    searchPlacesError: action.error,
  }))
);
