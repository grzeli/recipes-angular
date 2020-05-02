import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import { AppState } from '../statics/interfaces.component';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  private closeSub: Subscription;
  private subscription: Subscription;

  constructor(
    // private authService: AuthService,
    // private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<AppState>,
    ) { }

    ngOnInit() {
      this.subscription = this.store.select('auth')
        .subscribe(authState => {
          this.isLoading = authState.loading;
          this.error = authState.authError;
          if (this.error) {
            this.showErrorAlert(this.error);
          }
        });
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    this.subscription.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    // this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;

    // let authObservable: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      // authObservable = this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({email, password}));
    } else {
      // authObservable = this.authService.signUp(email, password);
      this.store.dispatch(new AuthActions.SignUpStart({email, password}));
    }


    // authObservable.subscribe(resData => {
    //     console.log(resData);
    //     this.isLoading = false;
    //     this.router.navigate(['./recipes']);
    //   },
    //   errorMessage => {
    //     console.log(errorMessage);
    //     this.error = errorMessage;
    //     this.showErrorAlert(errorMessage);
    //     this.isLoading = false;
    //   }
    // );

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;

    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.messageToThePeople = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

}
