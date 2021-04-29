import { createAction, props } from '@ngrx/store';
import { IPlaceQueryParams, IPlacesResponse } from '../../models/places.model';

export enum ActionTypes {
  placesAction = '[main] Places',
  placesAction_Success = '[main] Places Success',
  placesAction_Failure = '[main] Places Failure',
  placesClearAction = '[main] Places Clear',
  placesPaginateAction = '[main] Places Paginate',

  searchPlacesAction_Success = '[main] Search Places Success',
  searchPlacesAction_Failure = '[main] Search Places Failure',
  searchPlacesClearAction = '[main] Search Places Clear',
  searchPlacesPaginateAction = '[main] Search Places Paginate',
  updatedBookmarkedplacesAction_Success = '[main] updatedBookmarkedPlaces Success'
}

export const PlacesAction = createAction(
  ActionTypes.placesAction,
  props<{ params: IPlaceQueryParams }>()
);

export const clearPlacesAction = createAction(ActionTypes.placesClearAction);

export const paginatePlacesAction = createAction(
  ActionTypes.placesPaginateAction,
  props<{ paginate: boolean }>()
);

export const PlacesActionSuccess = createAction(
  ActionTypes.placesAction_Success,
  props<{ places: IPlacesResponse }>()
);

export const PlacesActionFailure = createAction(
  ActionTypes.placesAction_Failure,
  props<{ error: any }>()
);

export const clearSearchPlacesAction = createAction(
  ActionTypes.searchPlacesClearAction
);

export const paginateSearchPlacesAction = createAction(
  ActionTypes.searchPlacesPaginateAction,
  props<{ paginate: boolean }>()
);

export const SetUpdatedPlace = createAction(
  ActionTypes.updatedBookmarkedplacesAction_Success,
  props<{ id: any, flag: boolean }>()
);

export const SearchPlacesActionSuccess = createAction(
  ActionTypes.searchPlacesAction_Success,
  props<{ places: IPlacesResponse }>()
);

export const SearchPlacesActionFailure = createAction(
  ActionTypes.searchPlacesAction_Failure,
  props<{ error: any }>()
);
