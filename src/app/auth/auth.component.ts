import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import { AppState } from '../statics/interfaces.component';
import * as AuthActions from './store/auth.actions';
import { FormBoxes } from './user.model';
import { debounce } from 'lodash';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  @Input() isLoginMode = true;

  @Output() clickedOutside = new EventEmitter();

  isLoading = false;
  error: string = null;

  form: FormGroup;
  formBoxes: FormBoxes;

  passwordError: boolean;

  onInputChange = debounce(() => {
    this.passwordCheck();
  }, 200);

  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  private closeSub: Subscription;
  private subscription = new Subscription();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<AppState>,
    private fb: FormBuilder,
    ) { }

    ngOnInit() {
      this.initForms();
      this.subscription.add(this.store.select('auth')
        .subscribe(authState => {
          this.isLoading = authState.loading;
          this.error = authState.authError;
          if (this.error) {
            this.showErrorAlert(this.error);
          }
        })
      );
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    this.subscription.unsubscribe();
  }

  initForms() {
    this.formBoxes = {
      login: {
        fieldType: 'input',
        label: 'E-mail',
        name: 'email',
        type: 'email',
        placeholder: '',
        field: 'email',
        caveat: true
      },
      password0: {
        fieldType: 'input',
        label: 'Password',
        name: 'password0',
        placeholder: '',
        type: 'password',
        field: 'password0',
        caveat: true
      },
      password1: {
        fieldType: 'input',
        label: 'Password',
        name: 'password1',
        placeholder: '',
        type: 'password',
        field: 'password1',
        caveat: true
      }
    };
    this.buildForm();
  }

  buildForm() {
    if (this.form) {
      if (this.isLoginMode) {
        this.form = this.fb.group({
          email: new FormControl(this.form.controls.email.value, [Validators.required, Validators.email]),
          password0: new FormControl(this.form.controls.password0.value, [Validators.required, Validators.minLength(6)]),
        });
      } else {
        this.form = this.fb.group({
          email: new FormControl(this.form.controls.email.value, [Validators.required, Validators.email]),
          password0: new FormControl(this.form.controls.password0.value, [Validators.required, Validators.minLength(6)]),
          password1: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        });
      }
    } else {
      if (this.isLoginMode) {
        this.form = this.fb.group({
          email: new FormControl(null, [Validators.required, Validators.email]),
          password0: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        });
      } else {
        this.form = this.fb.group({
          email: new FormControl(null, [Validators.required, Validators.email]),
          password0: new FormControl(null, [Validators.required, Validators.minLength(6)]),
          password1: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        });
      }
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.buildForm();
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const email: string = this.form.value.email;
    const password: string = this.form.value.password0;
    const password1 = this.form.value.password1;

    if (!this.isLoginMode) {
      this.passwordError = password !== password1;
      if (this.passwordError) {
        return;
      }
    }

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({email, password}));
    } else {
      this.store.dispatch(new AuthActions.SignUpStart({email, password}));
    }

    this.form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  passwordCheck() {
    if (
      !this.isLoginMode
      && this.form.controls.password0
      && this.form.controls.password1
      && this.form.controls.password0.dirty
      && this.form.controls.password1.dirty
      && this.form.controls.password0.valid
      && this.form.controls.password1.valid
    ) {
      if (this.form.controls.password0.value === this.form.controls.password1.value) {
        this.passwordError = false;
      } else {
        this.passwordError = true;
      }
    }
  }

  onClickOutside() {
    this.clickedOutside.emit();
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
