import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';

import { isLoggedOut } from '../store/auth.selectors';
import { AuthState } from '../store/auth.reducers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<AuthState>,
    private router: Router,
  ) {
    console.log('AuthGuard: ');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(isLoggedOut),
      // tslint:disable-next-line: no-shadowed-variable
      tap((isLoggedOut) => {
        console.log('isLoggedOut: ', isLoggedOut);
        if (!isLoggedOut) {
          this.router.navigate(['/main/places']);
        }
        return true;
      })
    );
  }
}
