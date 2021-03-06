import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppState } from '../statics/interfaces.component';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';

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
    token: string = null;

    private tokenExpirationTimer: any;

    constructor(
      private store: Store<AppState>
    ) {}

    setLogoutTimer(expirationDuration: number) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.store.dispatch(new AuthActions.Logout());
      }, expirationDuration);
    }

    clearLogoutTimer() {
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
        this.tokenExpirationTimer = null;
      }
    }
}
