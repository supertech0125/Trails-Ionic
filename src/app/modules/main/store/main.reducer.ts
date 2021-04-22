import { MainActionTypes, MainActions } from './main.actions';
import { UserProfile } from '../../auth/models/auth.model';
import { IPlacesResponse } from '../models/places.model';
import {
  IAllUserTrailsResponse,
  ITrailsResponse,
  Trails,
} from '../models/trails.model';
export interface MainState {
  // tslint:disable-next-line: ban-types
  IsProfileInfoLoaded?: Boolean;
  profileInfo?: UserProfile;
  bookmarkTrails?: Trails[];
  createdTrails?: ITrailsResponse;
  allCreatedTrails?: ITrailsResponse[];
  allUsersTrails?: IAllUserTrailsResponse[];
  mapAllPlaces?: IPlacesResponse[];
  mapAllTrails?: ITrailsResponse[];
}

export const initialMainState: MainState = {
  IsProfileInfoLoaded: false,
  profileInfo: undefined,
  bookmarkTrails: undefined,
  createdTrails: undefined,
  allCreatedTrails: undefined,
  allUsersTrails: undefined,
  mapAllPlaces: undefined,
  mapAllTrails: undefined,
};

export function mainReducer(
  // tslint:disable-next-line:no-shadowed-variable
  MainState = initialMainState,
  action: MainActions
): MainState {
  switch (action.type) {
    case MainActionTypes.isUserLoadedAction:
      return Object.assign({}, MainState, {
        IsProfileInfoLoaded: action.payload.isUserLoadedAction,
      });

    case MainActionTypes.allPlacesAction:
      return Object.assign({}, MainState, {
        allPlaces: action.payload.allPlaces,
      });

    case MainActionTypes.mapAllPlacesAction:
      return Object.assign({}, MainState, {
        mapAllPlaces: action.payload.mapAllPlaces,
      });

    case MainActionTypes.allTrailsAction:
      return Object.assign({}, MainState, {
        allTrails: action.payload.allTrails,
      });

    case MainActionTypes.mapAllTrailsAction:
      return Object.assign({}, MainState, {
        mapAllTrails: action.payload.mapAllTrails,
      });

    case MainActionTypes.createdTrail:
      return Object.assign({}, MainState, {
        createdTrails: action.payload.createdTrails,
      });

    case MainActionTypes.allUsersTrailAction:
      return Object.assign({}, MainState, {
        allUsersTrails: action.payload.allUsersTrails,
      });

    default:
      return MainState;
  }
}
