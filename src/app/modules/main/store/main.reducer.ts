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
  trailFilter?: any;
  placeFilter?: any;
  addTrailStepFilter?: any;
  trailSort?: any;
  placeSort?: any;
  addTrailStepSort?: any;
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
  trailFilter: undefined,
  placeFilter: undefined,
  addTrailStepFilter: undefined,
  trailSort: 'Distance',
  placeSort: 'Distance',
  addTrailStepSort: 'Distance',
};

const updateCreatedTrailBookMark = (state: Trails[], data: any) => {
  const trailItems = [];
  state.map((a: Trails) => {
    let xx: any;
    if(a.id == data.id) xx = {...a, isbookMarked: data.flag}
    else xx = {...a}
    trailItems.push(xx);
  })
  // console.log('ggggggggg', trailItems);
  return trailItems;
}

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

    case MainActionTypes.createdTrailBookMark:
      return Object.assign({}, MainState, {
        createdTrails: {...MainState.createdTrails, data: updateCreatedTrailBookMark(MainState.createdTrails.data, action.payload)},
      });

    case MainActionTypes.allUsersTrailAction:
      return Object.assign({}, MainState, {
        allUsersTrails: action.payload.allUsersTrails,
      });

    case MainActionTypes.trailFilterAction:
      return Object.assign({}, MainState, {
        trailFilter: action.payload.data,
      });

    case MainActionTypes.placeFilterAction:
      return Object.assign({}, MainState, {
        placeFilter: action.payload.data,
      });

    case MainActionTypes.addTrailStepFilterAction:
      return Object.assign({}, MainState, {
        addTrailStepFilter: action.payload.data,
      });

    case MainActionTypes.trailSortAction:
      return Object.assign({}, MainState, {
        trailSort: action.payload.data,
      });

    case MainActionTypes.placeSortAction:
      return Object.assign({}, MainState, {
        placeSort: action.payload.data,
      });

    case MainActionTypes.addTrailStepSortAction:
      return Object.assign({}, MainState, {
        addTrailStepSort: action.payload.data,
      });

    default:
      return MainState;
  }
}
