import { Action } from '@ngrx/store';
import { UserAccount } from '../models/auth.model';

export enum AuthActionTypes {
  LoginAction = '[Login] Action',
  LogoutAction = '[Logout] Action',
  registerAction = '[Register] Action',
  profileInfoAction = '[User] profileInfo',
}

export class Login implements Action {
  readonly type = AuthActionTypes.LoginAction;

  constructor(public payload: { user: UserAccount }) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LogoutAction;
}

export class Register implements Action {
  readonly type = AuthActionTypes.registerAction;
  constructor(public payload: { isRegistered: true }) {}
}

export class ProfileInfoAction implements Action {
  readonly type = AuthActionTypes.profileInfoAction;

  // constructor(public payload: { profileInfo: UserProfile }) {}
  constructor(public payload: { profileInfo: any }) {}
}

export type AuthActions = Login | Logout | Register | ProfileInfoAction;
