import { UserRegister } from './../models/auth.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/services/base.service';

import { UserLogin, RefreshToken } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  private queryString(params) {
    return Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');
  }

  refreshToken(token: RefreshToken): Observable<any> {
    return this.post('/accounts/token/refresh', token);
  }

  login(data: UserLogin): Observable<any> {
    return this.post('/accounts/login', data);
  }

  currentUser(): Observable<any> {
    return this.get('/accounts/currentuser');
  }

  registerUser(user: UserRegister): Observable<any> {
    return this.post('/accounts/register', user);
  }

  forgotPassword({ email }): Observable<any> {
    const url =
      '/accounts/forgotpassword?' +
      this.queryString({
        email,
      });
    return this.post(url, {});
  }

  resetPassword({ email, oldPassword, newPassword, code }): Observable<any> {
    return this.post('/accounts/resetpassword', {
      email,
      oldPassword,
      newPassword,
      code,
    });
  }

  verifyUser({ userId, verificationCode }): Observable<any> {
    return this.put(
      `/accounts/confirm?userId=${userId}&verificationCode=${verificationCode}`,
      {}
    );
  }

  verifyResetPassword(email, code): Observable<any> {
    return this.post('/accounts/resetpassword/verify', {
      email,
      code,
    });
  }

  resendCode(userId): Observable<any> {
    return this.post('/accounts/register/resendcode', {
      userId,
    });
  }

  resendForgotCode(email): Observable<any> {
    return this.post('/accounts/forgotpassword/resendcode', {
      email,
    });
  }
}
