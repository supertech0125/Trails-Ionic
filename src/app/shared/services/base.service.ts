import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TRAIL_CURRENT_USER } from '../constants/utils';

export abstract class BaseService {
  constructor(private http: HttpClient) {}

  protected getAPIBase(route: string = ''): string {
    return environment.baseUrl + route;
  }

  private getToken(): string {
    const user = localStorage.getItem(TRAIL_CURRENT_USER);
    if (user) {
      if (user !== 'undefined') {
        const parseUser = JSON.parse(user);
        if (parseUser) {
          const token = parseUser.token || parseUser.Token;
          return token;
        }
        return '';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  protected commonStateChangeHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });
  }

  protected imgUploadHeaders(): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });
  }

  protected get(route: string): Observable<any> {
    const url = this.getAPIBase() + route;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      Accept: 'application/json',
    });
    const options = { headers };
    return this.http.get(url, options);
  }

  protected getParams(route: string, params: any): Promise<any> {
    const url = this.getAPIBase() + route;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      Accept: 'application/json',
    });
    const options = { headers, params };
    return this.http.get(url, options).toPromise();
  }

  protected post(route: string, object?: any): Observable<any> {
    return this.http.post(this.getAPIBase(route), object, {
      headers: this.commonStateChangeHeaders(),
    });
  }

  protected postToParams(route: string, params: any): Observable<any> {
    return this.http.post(
      this.getAPIBase(route),
      {},
      { headers: this.commonStateChangeHeaders(), params }
    );
  }

  protected upload(route: string, object: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      Accept: 'application/json',
    });
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.post(this.getAPIBase(route), object, {
      headers,
      reportProgress: true,
      observe: 'events',
    });
  }

  protected delete(route: string, object?: any): Observable<any> {
    return this.http.delete(this.getAPIBase(route), {
      headers: this.commonStateChangeHeaders(),
      ...object,
    });
  }

  protected put(route: string, object: any): Observable<any> {
    return this.http.put(this.getAPIBase(route), object, {
      headers: this.commonStateChangeHeaders(),
    });
  }

  protected putImageUpload(route: string, object: any): Observable<any> {
    return this.http.put(this.getAPIBase(route), object, {
      headers: this.imgUploadHeaders(),
    });
  }

  protected patch(route: string, object: any): Observable<any> {
    return this.http.patch(this.getAPIBase(route), object, {
      headers: this.commonStateChangeHeaders(),
    });
  }

  public handleError = (error: any) => {};
}
