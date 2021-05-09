import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { Trails } from '../../models/trails.model';
import {
  BookmarkedTrailsList,
  SetUpdatedBookmarkTrail,
} from './BookmarkTrails.action';

export interface BookmarkTrailsState {
  bookmarkTrails?: Trails[];
}

export const initialookmarkTrailState: BookmarkTrailsState = {
  bookmarkTrails: undefined,
};

const setUpdatedBookmarkTrail = (data: Trails[], id: any, flag: boolean) => {
  console.log('setUpdatedBookmarkTrail', data, id, flag);
  let temp = [];
  data.map((a: any)=> {
    let trail: any;
    if(a.id == id) trail = { ...a, isBookMarked: flag};
    else trail = {...a};
    temp.push(trail);
  })
  return temp;
}

export const bookmarkTrailsReducer = createReducer(
  initialookmarkTrailState,
  on(BookmarkedTrailsList, (state, action) => ({
    ...state,
    bookmarkTrails: action.bookmarkTrails,
  })),
  on(SetUpdatedBookmarkTrail, (state, action) => ({
    ...state,
    bookmarkTrails: setUpdatedBookmarkTrail(state.bookmarkTrails, action.id, action.flag)
  }))
);

export const bookmarkTrailsSelectorState = createFeatureSelector<BookmarkTrailsState>(
  'bookmarkTrails'
);

export const bookmarkTrailsSelector = createSelector(
  bookmarkTrailsSelectorState,
  (state: BookmarkTrailsState) => state.bookmarkTrails
);
