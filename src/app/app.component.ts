import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AppState } from './statics/interfaces.component';
import { Store } from '@ngrx/store';
import * as AuthActions from '../app/auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<AppState>
    ) {}

  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
  }
}
