export interface CreateTrails {
  steps: TrailsStepsPlace[];
  time: string;
  with: any[];
}

interface TrailsStepsPlace {
  placePrimaryId: number;
  stepOrder: number;
}

interface ITrailPlace {
  placeId: number;
  rating: string;
  longitude: number;
  latitude: number;
  address: string;
  types: string[];
}

interface ITrailUser {
  email: string;
  firstName: string;
  lastName: string;
  userId: string;
}

export interface Trails {
  id: number;
  name: string;
  time: string;
  isbookMarked?: boolean;
  purpose?: string[];
  trailPlace: ITrailPlace[];
  trailUser: ITrailUser;
}

export interface ITrailsResponse {
  count?: number;
  data?: Trails[];
  pageIndex?: number;
  pageSize?: number;
  timeTake?: number;
}

export interface IAllUserTrailsResponse {
  userId?: string;
  trails?: ITrailsResponse;
}

export interface ITrailQueryParams {
  PageIndex?: number;
  PageSize?: number;
  Sort?: string;
  TrailsRange?: string;
  Search?: string;
  Time?: string;
  Who?: string;
  Lat?: number;
  Long?: number;
  SubTypes?: string;
  Type?: string;
}

export interface ITrailRate {
  rating: number;
  comment: string;
  trailId: number;
}
