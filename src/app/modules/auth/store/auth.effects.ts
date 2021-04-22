import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { defer, of } from 'rxjs';
import { NavController } from '@ionic/angular';

import {
  Login,
  AuthActionTypes,
  Logout,
  ProfileInfoAction,
} from './auth.actions';

import {
  TRAIL_CURRENT_USER,
  TRAIL_CURRENT_USER_TOKEN,
  TRAIL_CURRENT_USER_PROFILE,
  TRAIL_STEP_TRAILS_SAVED,
  TRAIL_STEP_PLACES_SAVED,
} from '../../../shared/constants/utils';

import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private navCtrl: NavController,
    private storage: LocalStorageService,
    private geoService: GeolocationService
  ) {}

  @Effect()
  init$ = defer(() => {
    const userData = this.storage.getItem(TRAIL_CURRENT_USER);
    if (userData && userData !== 'undefined') {
      return of(new Login(userData));
    } else {
      return of();
    }
  });

  @Effect({ dispatch: false })
  public login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.LoginAction),
    tap((action) => {
      this.storage.setItem(TRAIL_CURRENT_USER, action.payload.user);
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<Logout>(AuthActionTypes.LogoutAction),
    tap(() => {
      this.storage.clearStorage();
      this.geoService.clearLocationRefresh();

      setTimeout(() => {
        this.navCtrl.navigateRoot('/login', {
          animationDirection: 'back',
          animated: true,
        });
      }, 600);
    })
  );

  @Effect({ dispatch: false })
  public profileInfo$ = this.actions$.pipe(
    ofType<ProfileInfoAction>(AuthActionTypes.profileInfoAction),
    tap((action) => {
      this.storage.setItem(
        TRAIL_CURRENT_USER_PROFILE,
        action.payload.profileInfo
      );
    })
  );
}
