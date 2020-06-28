import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AuthComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([{ path: '', component: AuthComponent }]),
        SharedModule,
        CommonModule,
    ]
})
export class AuthModule {}
