export interface Places {
  address: string;
  ambiances?: any[];
  description: string;
  distance: number;
  id: number;
  image: string;
  isBookMarked?: boolean;
  latitude: number;
  longitude: number;
  mentions?: any[];
  name: string;
  phone: string;
  photo?: {
    photo_320: PlacesPhoto[];
    photo_480: PlacesPhoto[];
    photo_600: PlacesPhoto[];
    photo_1080: PlacesPhoto[];
  };
  photos?: string[];
  placeId: string;
  placeIdChar: string;
  priceRange: number;
  rating: string;
  reservationUrl: string;
  subTypes: any[];
  thumbnail: string;
  type: string;
  types?: any[];
  website: string;
}

export interface IPlacesResponse {
  count?: number;
  data?: Places[];
  pageIndex?: number;
  pageSize?: number;
  timeTake?: number;
}

export interface PlacesPhoto {
  height: number;
  url: string;
  width: number;
}

export interface IPlaceRate {
  rating: number;
  comment: string;
  placeId: number;
}

export interface IPlaceQueryParams {
  PageIndex?: number;
  PageSize?: number;
  PlaceRange?: string;
  Search?: string;
  Sort?: string;
  SubTypes?: string;
  Type?: string;
  Lat?: number;
  Long?: number;
}

export interface IPlaceSubTypes {
  id: number;
  subType: string;
}

export interface IPlaceTypes {
  id: number;
  type: string;
  subTypes: IPlaceSubTypes[];
}
