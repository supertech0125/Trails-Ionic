import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';

import * as fromMain from '../../modules/main/store/main.reducer';
import * as fromAuth from '../../modules/auth/store/auth.reducers';
import { routerReducer } from '@ngrx/router-store';
import { placeTypesReducer } from '../../modules/main/store/PlaceTypes/PlaceTypes.store';
import { storageMetaReducer } from './storage.metareducer';
import {
  placesReducer,
  searchPlacesReducer,
} from '../../modules/main/store/Places/Places.reducer';
import { bookmarkPlacesReducer } from '../../modules/main/store/BookmarkPlaces/BookmarkPlaces.store';
import { trailsReducer } from '../../modules/main/store/Trails/Trails.reducer';
import { bookmarkTrailsReducer } from '../../modules/main/store/BookmarkTrails/BookmarkTrails.store';

// tslint:disable-next-line: no-empty-interface
export interface AppState {}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  auth: fromAuth.authReducer,
  main: fromMain.mainReducer,
  placeTypes: placeTypesReducer,
  places: placesReducer,
  searchPlaces: searchPlacesReducer,
  bookmarkPlaces: bookmarkPlacesReducer,
  trails: trailsReducer,
  bookmarkTrails: bookmarkTrailsReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [storageMetaReducer]
  : [storageMetaReducer];
