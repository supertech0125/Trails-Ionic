import { createAction, props } from '@ngrx/store';
import { IPlaceQueryParams, Places } from '../../models/places.model';

export enum ActionTypes {
  bookmarkPlacesAction = '[main] bookmark_places',
  bookmarkPlacesActionList = '[main] bookmark_places lists',
  bookmarkPlacesActionFail = '[main] bookmark_places fail',
  bookMarkPlace = '[main] bookmark Place',
  unbookMarkPlace = '[main] UnBookmark Place',
  SetUpdateBookmarkPlaceAction = '[main] setUpdateBookmark Place',
}

export const BookmarkedsPlacesAction = createAction(
  ActionTypes.bookmarkPlacesAction,
  props<{ params: IPlaceQueryParams }>()
);

export const BookmarkedsPlacesList = createAction(
  ActionTypes.bookmarkPlacesActionList,
  props<{ bookmarkPlaces: Places[] }>()
);

export const SetUpdatedBookmarkPlace = createAction(
  ActionTypes.SetUpdateBookmarkPlaceAction,
  props<{ id: any, flag: boolean }>()
);

export const BookmarkedsPlacesFailure = createAction(
  ActionTypes.bookmarkPlacesActionFail,
  props<{ error: any }>()
);

export const BookmarkPlace = createAction(
  ActionTypes.bookMarkPlace,
  props<{ placeId: string }>()
);

export const UnbookmarkPlace = createAction(
  ActionTypes.unbookMarkPlace,
  props<{ placeId: string }>()
);
