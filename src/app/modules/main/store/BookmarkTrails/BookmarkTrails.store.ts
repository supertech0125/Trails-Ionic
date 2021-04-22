import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { Trails } from '../../models/trails.model';
import {
  BookmarkedTrailsList,
} from './BookmarkTrails.action';

export interface BookmarkTrailsState {
  bookmarkTrails?: Trails[];
}

export const initialookmarkTrailState: BookmarkTrailsState = {
  bookmarkTrails: undefined,
};

export const bookmarkTrailsReducer = createReducer(
  initialookmarkTrailState,
  on(BookmarkedTrailsList, (state, action) => ({
    ...state,
    bookmarkTrails: action.bookmarkTrails,
  }))
);

export const bookmarkTrailsSelectorState = createFeatureSelector<BookmarkTrailsState>(
  'bookmarkTrails'
);

export const bookmarkTrailsSelector = createSelector(
  bookmarkTrailsSelectorState,
  (state: BookmarkTrailsState) => state.bookmarkTrails
);
