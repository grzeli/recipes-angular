import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorMessage } from './auth-helpers';
import { throwError } from 'rxjs';

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
    apiKey = 'AIzaSyCt_B6LKKLCM1WrSktQrV0t_yNMGdMdFDc';

    constructor(private http: HttpClient) {}

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
            {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.errorHandler));
    }

    login(email: string, password: string) {
      return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true
        }
      ).pipe(catchError(this.errorHandler));
    }

    errorHandler(errorRes: HttpErrorResponse) {
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
            errorMessage = 'The password is invalid or the user does not have a password';
            break;
          case errorType.TooManyAttempts:
            errorMessage = 'The user account has been disabled by an administrator.';
            break;
          case errorType.EmailExists:
            errorMessage = 'This email already exists!';
            break;
          case errorType.InvalidPassword:
            errorMessage = 'Password sign-in is disabled for this project';
            break;
          case errorType.UserDisabled:
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
          }
      return throwError(errorMessage);
    }
}
