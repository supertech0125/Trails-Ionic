import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/services/base.service';
import {
  CreateTrails,
  ITrailQueryParams,
  ITrailRate,
} from '../models/trails.model';
import {
  IPlaceQueryParams,
  IPlaceTypes,
  IPlaceRate,
} from '../models/places.model';
import { UserUpdate } from '../../auth/models/auth.model';
import { IFeedback } from '../models/generic.model';
import { IPlacesRatings } from '../models/ratings.model';

// import { UserLogin, RefreshToken } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class MainService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  private queryString(params) {
    return Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
  }

  getAllPlaces(params?: IPlaceQueryParams): Promise<any> {
    return this.getParams('/places', { ...params });
  }

  getPlace(placeId: string): Observable<any> {
    return this.get('/places/' + placeId);
  }

  getPlaceTypes(): Observable<IPlaceTypes[]> {
    return this.get('/places/type');
  }

  bookmarkPlace(placeId: string): Promise<any> {
    const url =
      '/places/bookmark?' +
      this.queryString({
        placeId,
      });
    return this.post(url, {}).toPromise();
  }

  unBookmarkPlace(placeId): Promise<any> {
    const url =
      '/places/unbookmark?' +
      this.queryString({
        placeId,
      });
    return this.post(url, {}).toPromise();
  }

  getAllBookmarkedPlaces(params?: any): Promise<any> {
    return this.getParams('/places/bookmarked', { ...params });
  }

  createTrails(trails: CreateTrails): Observable<any> {
    return this.post('/trails', trails);
  }

  getAllTrails(params?: ITrailQueryParams): Promise<any> {
    return this.getParams('/trails/details', { ...params });
  }

  getAllTrailsNearby(params?: ITrailQueryParams): Promise<any> {
    return this.getParams('/trails/nearbytrails', { ...params });
  }

  getAllTrailsOld(params?: ITrailQueryParams): Promise<any> {
    return this.getParams('/trails', { ...params });
  }

  getTrail(trailId: string): Observable<any> {
    return this.get('/trails/' + trailId);
  }

  getAllBookmarkedTrails(params?: any): Promise<any> {
    return this.getParams('/trails/bookmarked', { ...params });
  }

  bookmarkTrail(trailId): Promise<any> {
    const url =
      '/trails/bookmark?' +
      this.queryString({
        TrailId: trailId,
      });
    return this.post(url, {}).toPromise();
  }

  unBookmarkTrail(trailId): Promise<any> {
    const url =
      '/trails/unbookmark?' +
      this.queryString({
        TrailId: trailId,
      });
    return this.post(url, {}).toPromise();
  }

  ratingPlace(placeId: string): Observable<IPlacesRatings> {
    return this.get('/ratings/' + placeId + '/place');
  }

  ratingTrail(trailId: string): Observable<IPlacesRatings> {
    return this.get('/ratings/' + trailId + '/trail');
  }

  rateTrail(data: ITrailRate): Observable<IPlacesRatings> {
    return this.post('/ratings/trail', data);
  }
  
  updateRateTrail(data: ITrailRate): Observable<any> {
    return this.post('/ratings/updatetrail', data);
  }

  ratePlace(data: IPlaceRate): Observable<any> {
    return this.post('/ratings/place', data);
  }

  updateRatePlace(data: IPlaceRate): Observable<any> {
    return this.post('/ratings/updateplace', data);
  }

  // updateUserProfile(data: UserUpdate): Observable<any> {
  //   return this.put('/userprofile', data);
  // }

  updateUserProfile(data: FormData): Observable<any> {
    return this.putImageUpload('/userprofile', data);
  }

  sendAppFeedback(data: IFeedback): Promise<any> {
    return this.post('/feedback', data).toPromise();
  }

  getTrailsByUserId(
    userId: string,
    params: ITrailQueryParams
  ): Observable<any> {
    return this.postToParams(`/users/${userId}/trails`, { ...params });
  }
}
