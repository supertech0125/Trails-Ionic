import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as momentTZ from 'moment-timezone';

import { AuthState } from '../../modules/auth/store/auth.reducers';
import { AuthService } from '../../modules/auth/services/auth.service';
import { LocalStorageService } from './local-storage.service';

import { Logout } from '../../modules/auth/store/auth.actions';

import {
  TRAIL_CURRENT_USER,
  TRAIL_STEP_PLACES_LOADING,
  TRAIL_STEP_PLACES_SAVED_LOADING,
  TRAIL_STEP_TRAILS_CREATED_LOADING,
  TRAIL_STEP_TRAILS_LOADING,
  TRAIL_STEP_TRAILS_SAVED_LOADING,
} from './../constants/utils';
import { RefreshToken } from '../../modules/auth/models/auth.model';
import { CommonService } from './common.service';
import { PubsubService } from './pubsub.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private store: Store<AuthState>,
    private auth: AuthService,
    public jwtHelper: JwtHelperService,
    private localStorageService: LocalStorageService,
    private commonService: CommonService,
    private pubsub: PubsubService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        // console.log('TokenInterceptorService: ', error);

        if (
          request.url.includes('refreshtoken') ||
          request.url.includes('login')
        ) {
          if (
            request.url.includes('refreshtoken') ||
            error.status === '(failed) net::ERR_NETWORK_CHANGED'
          ) {
            // this.logout();
          }

          return throwError(error);
        }

        if (error.status !== 401) {
          return throwError(error);
        }

        if (this.refreshTokenInProgress) {
          return this.refreshTokenSubject.pipe(
            filter((result) => result !== null),
            take(1),
            switchMap(() => next.handle(this.addAuthenticationToken(request)))
          );
        } else {
          this.refreshTokenInProgress = true;
          this.refreshTokenSubject.next(null);

          const tokenRefresh: RefreshToken = {
            token: this.getToken(),
            refreshToken: this.getRefreshToken(),
            timeZone: momentTZ.tz.guess(),
            lastLocalTimeLoggedIn: momentTZ(new Date()).format(
              'YYYY-MM-DD HH:mm:ss'
            ),
          } as RefreshToken;

          this.pubsub.$pub(TRAIL_STEP_PLACES_LOADING, true);
          this.pubsub.$pub(TRAIL_STEP_TRAILS_LOADING, true);
          this.pubsub.$pub(TRAIL_STEP_TRAILS_SAVED_LOADING, true);
          this.pubsub.$pub(TRAIL_STEP_TRAILS_CREATED_LOADING, true);
          this.pubsub.$pub(TRAIL_STEP_PLACES_SAVED_LOADING, true);

          return this.auth.refreshToken(tokenRefresh).pipe(
            switchMap((rToken) => {
              console.log('rToken============', rToken);
              // When the call to refreshToken completes we reset the refreshTokenInProgress to false
              // for the next time the token needs to be refreshed
              const user = this.localStorageService.getItem(TRAIL_CURRENT_USER);
              if (user) {
                const loginInfoStorage = this.localStorageService.getItem(
                  TRAIL_CURRENT_USER
                );
                if (loginInfoStorage) {
                  if (rToken) {
                    const newToken = rToken.token || rToken.Token;
                    const refreshToken =
                      rToken.refreshToken || rToken.RefreshToken;

                    loginInfoStorage.token = newToken;
                    loginInfoStorage.Token = newToken;

                    loginInfoStorage.refreshToken = refreshToken;
                    loginInfoStorage.RefreshToken = refreshToken;
                    console.log('current loginInfoStorage: ', loginInfoStorage, user);

                    this.localStorageService.setItem(
                      TRAIL_CURRENT_USER,
                      loginInfoStorage
                    );
                  }

                  this.pubsub.$pub(TRAIL_STEP_PLACES_LOADING, false);
                  this.pubsub.$pub(TRAIL_STEP_TRAILS_LOADING, false);
                  this.pubsub.$pub(TRAIL_STEP_TRAILS_SAVED_LOADING, false);
                  this.pubsub.$pub(TRAIL_STEP_TRAILS_CREATED_LOADING, false);
                  this.pubsub.$pub(TRAIL_STEP_PLACES_SAVED_LOADING, false);

                  this.refreshTokenInProgress = false;
                  this.refreshTokenSubject.next(tokenRefresh);
                }
              }
              return next.handle(this.addAuthenticationToken(request));
            }),
            catchError((err: any) => {
              this.refreshTokenInProgress = false;
              console.log('refreshToken err: ', err);
              // const errorResponse = err.error;

              this.pubsub.$pub(TRAIL_STEP_PLACES_LOADING, false);
              this.pubsub.$pub(TRAIL_STEP_TRAILS_LOADING, false);
              this.pubsub.$pub(TRAIL_STEP_TRAILS_SAVED_LOADING, false);
              this.pubsub.$pub(TRAIL_STEP_TRAILS_CREATED_LOADING, false);
              this.pubsub.$pub(TRAIL_STEP_PLACES_SAVED_LOADING, false);

              this.commonService.dismissAllLoaders();
              this.commonService.dismissAllModals();

              this.logout();
              return throwError(err);
            })
          );
        }
      })
    );
  }

  private getToken(): string {
    const user = this.localStorageService.getItem(TRAIL_CURRENT_USER);
    if (user) {
      if (user !== 'undefined') {
        const token = user.token || user.Token;
        return token;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  private getRefreshToken(): string {
    const user = this.localStorageService.getItem(TRAIL_CURRENT_USER);
    if (user) {
      if (user !== 'undefined') {
        const token = user.refreshToken || user.RefreshToken;
        return token;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  private addAuthenticationToken(request) {
    // Get access token from Local Storage
    const accessToken = this.getToken();

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  private logout(): void {
    this.store.dispatch(new Logout());
  }
}
