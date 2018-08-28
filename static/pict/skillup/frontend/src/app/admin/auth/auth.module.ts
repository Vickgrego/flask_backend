import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component'
import { LoginComponent } from './login/login.component';
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component'
import { AuthResetPasswordMessageComponent } from './auth-reset-password-message/auth-reset-password-message.component'
import { AuthResetPasswordEmailComponent } from './auth-reset-password-email/auth-reset-password-email.component'
import { routing } from './auth.routes';
import { AdminSharedModule } from '../shared/admin-shared.module';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    AuthResetPasswordComponent,
    AuthResetPasswordEmailComponent,
    AuthResetPasswordMessageComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AdminSharedModule,
    routing
  ],
  providers: [],
  bootstrap: [AuthComponent]
})
export class AuthModule { }
