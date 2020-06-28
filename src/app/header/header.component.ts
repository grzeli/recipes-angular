import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { AppState } from '../statics/interfaces.component';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

export enum ModalParams {
  Login,
  Register
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;

  showLoginModal = false;
  isLoginMode = true;

  authSubs: Subscription;

  readonly modalParams = ModalParams;
  constructor(
    private store: Store<AppState>
    ) {}

  ngOnInit() {
    this.authSubs = this.store.select('auth')
      .pipe(
        map(authState => authState.user)
      )
      .subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }

  onSaveData() {
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onLogout() {
    this.showLoginModal = false;
    this.store.dispatch(new AuthActions.Logout());
  }

  onClickOutside() {
    this.showLoginModal = false;
  }

  loginModalHandler(params: ModalParams) {
    switch (params) {
      case this.modalParams.Login:
        this.isLoginMode = true;
        this.showLoginModal = true;
        break;
      case this.modalParams.Register:
        this.isLoginMode = false;
        this.showLoginModal = true;
        break;
    }
  }
}
