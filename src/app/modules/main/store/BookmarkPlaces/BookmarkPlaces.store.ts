import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { Places } from '../../models/places.model';
import { BookmarkedsPlacesList, SetUpdatedBookmarkPlace } from './BookmarkPlaces.action';

export interface BookmarkPlaceState {
  bookmarkPlaces?: Places[];
}

export const initialookmarkPlaceState: BookmarkPlaceState = {
  bookmarkPlaces: undefined,
};

const setUpdatedBookmarkPlace = (data: Places[], id: any, flag: boolean) => {
  let temp = [];
  data.map((a: any) => {
    let place: any;
    if (a.id == id){
      place = { ...a, isBookMarked: flag };
    }
    else place = {...a};
    temp.push(place);
  })
  return temp;
}

export const bookmarkPlacesReducer = createReducer(
  initialookmarkPlaceState,
  on(BookmarkedsPlacesList, (state, action) => ({
    ...state,
    bookmarkPlaces: action.bookmarkPlaces,
  })),
  on(SetUpdatedBookmarkPlace, (state, action) => ({
    ...state,
    bookmarkPlaces: setUpdatedBookmarkPlace(state.bookmarkPlaces, action.id, action.flag)
  }))
);

export const bookmarkPlacesSelectorState = createFeatureSelector<BookmarkPlaceState>(
  'bookmarkPlaces'
);

export const bookmarkPlacesSelector = createSelector(
  bookmarkPlacesSelectorState,
  (state: BookmarkPlaceState) => state.bookmarkPlaces
);
