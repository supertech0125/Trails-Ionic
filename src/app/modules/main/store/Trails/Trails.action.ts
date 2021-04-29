import { createAction, props } from '@ngrx/store';
import { ITrailQueryParams, ITrailsResponse } from '../../models/trails.model';

export enum ActionTypes {
  trailsAction = '[main] Trails',
  trailsAction_Success = '[main] Trails Success',
  trailsAction_Failure = '[main] Trails Failure',
  trailsClearAction = '[main] Trails Clear',
  trailsPaginateAction = '[main] Trails Paginate',
  updatedBookmarkedtrailsAction_Success = '[main] updatedBookmarkedTrails Success',
}

export const TrailsAction = createAction(
  ActionTypes.trailsAction,
  props<{ params: ITrailQueryParams }>()
);

export const clearTrailsAction = createAction(ActionTypes.trailsClearAction);

export const paginateTrailsAction = createAction(
  ActionTypes.trailsPaginateAction,
  props<{ paginate: boolean }>()
);

export const SetUpdatedTrail = createAction(
  ActionTypes.updatedBookmarkedtrailsAction_Success,
  props<{ id: any, flag: boolean }>()
);

export const TrailsActionSuccess = createAction(
  ActionTypes.trailsAction_Success,
  props<{ trails: ITrailsResponse }>()
);

export const TrailsActionFailure = createAction(
  ActionTypes.trailsAction_Failure,
  props<{ error: any }>()
);
