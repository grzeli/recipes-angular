import { Actions, ofType, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';

import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { AuthResponseData, AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorMessage } from '../auth-helpers';
import { User } from '../user.model';
import { UserData } from 'src/app/statics/interfaces.component';

const handleAuthentication = (resData) => {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(
        resData.email,
        resData.localId,
        resData.idToken,
        expirationDate
    );
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate,
            redirect: true,
        }
    );
};

const handleError = (errorRes) => {
    let errorMessage = 'An error occurred!';
    const errorType = ErrorMessage;

    if (!errorRes.error || !errorRes.error.error) {
        return of (new AuthActions.AuthenticateFail(errorMessage));
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

    return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
    @Effect()
    authSignUp = this.actions$.pipe(
        ofType(AuthActions.SIGN_UP_START),
        switchMap((signUpAction: AuthActions.SignUpStart) => {
            return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.API_KEY}`,
                {
                    email: signUpAction.payload.email,
                    password: signUpAction.payload.password,
                    returnSecureToken: true
                }
            );
        })
    )
    .pipe(
        tap((resData) => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
        map(resData => handleAuthentication(resData)),
        catchError(errorRes => handleError(errorRes)),
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.API_KEY}`,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            )
            .pipe(
                tap((resData) => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
                map(resData => handleAuthentication(resData)),
                catchError(errorRes => handleError(errorRes)),
            );
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: UserData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
              return { type: 'not valid' };
            }

            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

            if (loadedUser.token) {
              // this.user.next(loadedUser);
              const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
              this.authService.setLogoutTimer(expirationDuration);
              return new AuthActions.AuthenticateSuccess({
                  email: userData.email,
                  userId: userData.id,
                  token: userData._token,
                  expirationDate: new Date(userData._tokenExpirationDate),
                  redirect: false,
            });
            //   const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            //   this.autoLogout(expirationDuration);
            }
            return { type: 'not valid' };
        })
    );

    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
        })
    );

    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(
        ofType(
            AuthActions.AUTHENTICATE_SUCCESS,
            AuthActions.LOGOUT,
        ),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
            if (authSuccessAction.payload.redirect) {
                this.router.navigate(['/']);
            }
        })
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService,
    ) {}
}
