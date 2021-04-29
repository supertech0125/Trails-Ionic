import { createAction, props } from '@ngrx/store';
import { IPlaceQueryParams, Places } from '../../models/places.model';
import { Trails } from '../../models/trails.model';

export enum ActionTypes {
  BookmarkTrailsAction = '[main] bookmark_trails',
  BookmarkTrailsActionList = '[main] bookmark_trails lists',
  BookmarkTrailsActionFail = '[main] bookmark_trails fail',
  BookmarkTrails = '[main] Bookmark Trails',
  UnbookMarkTrails = '[main] UnBookmark Trails',
  SetUpdateBookmarkTrailAction = '[main] setUpdateBookmark Trail',
}

export const BookmarkedTrailsAction = createAction(
  ActionTypes.BookmarkTrailsAction,
  props<{ params: IPlaceQueryParams }>()
);

export const BookmarkedTrailsList = createAction(
  ActionTypes.BookmarkTrailsActionList,
  props<{ bookmarkTrails: Trails[] }>()
);

export const SetUpdatedBookmarkTrail = createAction(
  ActionTypes.SetUpdateBookmarkTrailAction,
  props<{ id: any, flag: boolean }>()
);

export const BookmarkedTrailsFailure = createAction(
  ActionTypes.BookmarkTrailsActionFail,
  props<{ message: string }>()
);

export const BookmarkTrails = createAction(
  ActionTypes.BookmarkTrails,
  props<{ trailId: string }>()
);

export const UnbookmarkTrails = createAction(
  ActionTypes.UnbookMarkTrails,
  props<{ trailId: string }>()
);
