import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { ErrorMessage, UserData } from './auth-helpers';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    token: string = null;

    private readonly apiKey = 'AIzaSyCt_B6LKKLCM1WrSktQrV0t_yNMGdMdFDc';
    private tokenExpirationTimer: any;

    constructor(
      private http: HttpClient,
      private router: Router
    ) {}

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(
          catchError(this.errorHandler),
          tap(resData => this.handlerAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn))
        );
    }

    login(email: string, password: string) {
      return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true
        }
      ).pipe(
        catchError(this.errorHandler),
        tap(resData => this.handlerAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn))
      );
    }

    autoLogin() {
      const userData: UserData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return;
      }

      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

      if (loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    }

    logout() {
      this.router.navigate(['/auth']);
      this.user.next(null);
      localStorage.removeItem('userData');
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
      }, expirationDuration);
    }

    private handlerAuthentication(email: string, userId: string, token: string, expiresIn: number) {
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      const user = new User(email, userId, token, expirationDate);
      this.user.next(user);
      this.autoLogout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
    }

    private errorHandler(errorRes: HttpErrorResponse) {
      let errorMessage = 'An error occurred!';
      const errorType = ErrorMessage;

      if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
      }
      switch (errorRes.error.error.message) {
          case errorType.EmailNotFound:
            errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted!';
            break;
          case errorType.OperationNotAllowed:
            errorMessage = 'Password sign-in is disabled for this project';
            break;
          case errorType.TooManyAttempts:
            errorMessage = 'The user account has been disabled by an administrator.';
            break;
          case errorType.EmailExists:
            errorMessage = 'This email already exists!';
            break;
          case errorType.InvalidPassword:
            errorMessage = 'The password is invalid or the user does not have a password';
            break;
          case errorType.UserDisabled:
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
          }
      return throwError(errorMessage);
    }
}
