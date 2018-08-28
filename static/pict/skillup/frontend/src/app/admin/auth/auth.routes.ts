import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthComponent} from './auth.component'
import {LoginComponent} from './login/login.component'
import { AuthResetPasswordComponent } from './auth-reset-password/auth-reset-password.component'
import { AuthResetPasswordEmailComponent } from './auth-reset-password-email/auth-reset-password-email.component'
import { AuthResetPasswordMessageComponent } from './auth-reset-password-message/auth-reset-password-message.component'

export const adminRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'reset-password',
        component: AuthResetPasswordEmailComponent
      },
      {
        path: 'changing-password',
        component: AuthResetPasswordComponent
      },
      {
        path: 'reset-password-message',
        component: AuthResetPasswordMessageComponent
      }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(adminRoutes);
