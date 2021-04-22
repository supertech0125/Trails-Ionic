import { AuthActions, AuthActionTypes } from './auth.actions';
import { UserAccount } from '../models/auth.model';

export interface AuthState {
  loggedIn: boolean;
  user: UserAccount;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  user: undefined,
};

export function authReducer(
  state = initialAuthState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LoginAction:
      return {
        loggedIn: true,
        user: action.payload.user,
      };

    case AuthActionTypes.LogoutAction:
      return {
        loggedIn: false,
        user: null,
      };

    case AuthActionTypes.registerAction:
      return {
        loggedIn: false,
        user: null,
      };

    default:
      return state;
  }
}
