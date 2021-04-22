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
import { isLoggedIn } from '../../auth/store/auth.selectors';
import { AuthState } from '../../auth/store/auth.reducers';

@Injectable()
export class MainGuard implements CanActivate {
  constructor(private store: Store<AuthState>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(isLoggedIn),
      // tslint:disable-next-line: no-shadowed-variable
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          location.replace('/login');
        }
      })
    );
  }
}
