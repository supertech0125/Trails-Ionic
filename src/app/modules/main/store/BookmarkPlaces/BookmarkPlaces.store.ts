import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { Places } from '../../models/places.model';
import { BookmarkedsPlacesList } from './BookmarkPlaces.action';

export interface BookmarkPlaceState {
  bookmarkPlaces?: Places[];
}

export const initialookmarkPlaceState: BookmarkPlaceState = {
  bookmarkPlaces: undefined,
};

export const bookmarkPlacesReducer = createReducer(
  initialookmarkPlaceState,
  on(BookmarkedsPlacesList, (state, action) => ({
    ...state,
    bookmarkPlaces: action.bookmarkPlaces,
  }))
);

export const bookmarkPlacesSelectorState = createFeatureSelector<BookmarkPlaceState>(
  'bookmarkPlaces'
);

export const bookmarkPlacesSelector = createSelector(
  bookmarkPlacesSelectorState,
  (state: BookmarkPlaceState) => state.bookmarkPlaces
);
