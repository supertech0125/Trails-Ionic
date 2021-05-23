import { Action } from '@ngrx/store';
import { IPlacesResponse, IPlaceTypes, Places } from '../models/places.model';
import {
  Trails,
  ITrailsResponse,
  IAllUserTrailsResponse,
} from '../models/trails.model';

export enum MainActionTypes {
  isUserLoadedAction = '[main] isUserLoadedAction',
  allPlacesAction = '[main] all_places',
  mapAllPlacesAction = '[main] all_map_places',
  allTrailsAction = '[main] all_trails',
  mapAllTrailsAction = '[main] all_map_trails',
  createdTrail = '[main] Created Trail',
  createdTrailBookMark = '[main] Created Trail BookMark',
  allCreatedTrail = '[main] All Created Trail',
  allUsersTrailAction = '[main] All Users Trail',
  trailFilterAction = '[main] Trail Filter',
  trailSortAction = '[main] Trail Sort',
  placeFilterAction = '[main] Place Filter',
  placeSortAction = '[main] Place Sort',
  addTrailStepFilterAction = '[main] addTrailStep Filter',
  addTrailStepSortAction = '[main] addTrailStep Sort',
}

export class IsUSERLoadedAction implements Action {
  readonly type = MainActionTypes.isUserLoadedAction;

  constructor(public payload: { isUserLoadedAction: boolean }) {}
}

export class AllPlacesAction implements Action {
  readonly type = MainActionTypes.allPlacesAction;

  constructor(public payload: { allPlaces: IPlacesResponse[] }) {}
}

export class MapAllPlacesAction implements Action {
  readonly type = MainActionTypes.mapAllPlacesAction;

  constructor(public payload: { mapAllPlaces: IPlacesResponse[] }) {}
}

export class AllTrailsAction implements Action {
  readonly type = MainActionTypes.allTrailsAction;

  constructor(public payload: { allTrails: ITrailsResponse[] }) {}
}

export class MapAllTrailsAction implements Action {
  readonly type = MainActionTypes.mapAllTrailsAction;

  constructor(public payload: { mapAllTrails: ITrailsResponse[] }) {}
}

export class CreatedTrailAction implements Action {
  readonly type = MainActionTypes.createdTrail;
  constructor(public payload: { createdTrails: ITrailsResponse }) {}
}

export class SetCreatedTrailBookMark implements Action {
  readonly type = MainActionTypes.createdTrailBookMark;
  constructor(public payload: { id: any, flag: boolean }) {}
}

export class AllCreatedTrailAction implements Action {
  readonly type = MainActionTypes.allCreatedTrail;
  constructor(public payload: { allCreatedTrails: ITrailsResponse[] }) {}
}

export class AllUsersTrailsAction implements Action {
  readonly type = MainActionTypes.allUsersTrailAction;
  constructor(public payload: { allUsersTrails: IAllUserTrailsResponse[] }) {}
}

export class TrailFilterAction implements Action {
  readonly type = MainActionTypes.trailFilterAction;
  constructor(public payload: { data: any }) {}
}

export class TrailSortAction implements Action {
  readonly type = MainActionTypes.trailSortAction;
  constructor(public payload: { data: any }) {}
}

export class PlaceFilterAction implements Action {
  readonly type = MainActionTypes.placeFilterAction;
  constructor(public payload: { data: any }) {}
}

export class PlaceSortAction implements Action {
  readonly type = MainActionTypes.placeSortAction;
  constructor(public payload: { data: any }) {}
}

export class AddTrailStepFilterAction implements Action {
  readonly type = MainActionTypes.addTrailStepFilterAction;
  constructor(public payload: { data: any }) {}
}

export class AddTrailStepSortAction implements Action {
  readonly type = MainActionTypes.addTrailStepSortAction;
  constructor(public payload: { data: any }) {}
}

export type MainActions =
  | IsUSERLoadedAction
  | AllTrailsAction
  | MapAllTrailsAction
  | CreatedTrailAction
  | SetCreatedTrailBookMark
  | AllCreatedTrailAction
  | AllUsersTrailsAction
  | AllPlacesAction
  | MapAllPlacesAction
  | TrailFilterAction
  | TrailSortAction
  | PlaceFilterAction
  | PlaceSortAction
  | AddTrailStepFilterAction
  | AddTrailStepSortAction;
