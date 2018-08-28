import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { AdminComponent } from './admin.component'
import { UsersComponent } from './admin-content/users/users.component'
import { UsersTableComponent } from './admin-content/users/users-table/users-table.component'
import { UsersEditComponent } from './admin-content/users/users-edit/users-edit.component'
import { UsersAddComponent } from './admin-content/users/users-add/users-add.component';
import { TagsComponent } from './admin-content/tags/tags.component'
import { TagAddComponent } from './admin-content/tags/tag-add/tag-add.component'
import { TagEditComponent } from './admin-content/tags/tag-edit/tag-edit.component'
import { TagGroupComponent } from './admin-content/tag-group/tag-group.component'
import { TagGroupAddComponent } from './admin-content/tag-group/tag-group-add/tag-group-add.component'
import { TagGroupEditComponent } from './admin-content/tag-group/tag-group-edit/tag-group-edit.component'
import { AssetsComponent } from './admin-content/assets/assets.component'
import { AccountComponent } from './admin-content/account/account.component';
import { ResetPasswordComponent } from './admin-content/account/reset-password/reset-password.component';
import { NavigationComponent } from './admin-content/navigation/navigation.component';
import { NavigationAddComponent } from './admin-content/navigation/navigation-add/navigation-add.component';
import { NavigationEditComponent } from './admin-content/navigation/navigation-edit/navigation-edit.component';
import { AssetFormComponent } from "./admin-content/assets/asset-form/asset-form.component";

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'account'
      },
      {
        path: 'account',
        component: AccountComponent,
        children: [
          {
            path: ''
          },
          {
            path: 'reset-password',
            component: ResetPasswordComponent
          }
        ]
      },
      {
        path: 'tags',
        component: TagsComponent,
        children: [
          {
            path: ''
          },
          {
            path: 'add',
            component: TagAddComponent
          },
          {
            path: 'edit/:id',
            component: TagEditComponent
          }
        ]
      },
      {
        path: 'tag-groups',
        component: TagGroupComponent,
        children: [
          {
            path: ''
          },
          {
            path: 'add',
            component: TagGroupAddComponent
          },
          {
            path: 'edit/:id',
            component: TagGroupEditComponent
          }
        ]
      },
      {
        path: 'assets',
        children: [
          {
            path: '',
            component: AssetsComponent,
          },
          {
            path: 'add',
            component: AssetFormComponent
          },
          {
            path: 'edit/:id',
            component: AssetFormComponent
          }
        ]
      },
      {
        path: 'users',
        component: UsersComponent,
        children: [
          {
            path: '',
            component: UsersTableComponent
          },
          {
            path: 'edit/:id',
            component: UsersEditComponent
          },
          {
            path: 'add',
            component: UsersAddComponent
          }
        ]
      },
      {
        path: 'navigation',
        component: NavigationComponent,
        children: [
          {
            path: ''
          },
          {
            path: 'add',
            component: NavigationAddComponent
          },
          {
            path: ':id/add',
            component: NavigationAddComponent
          },
          {
            path: 'edit/:id',
            component: NavigationEditComponent
          }
        ]
      }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(adminRoutes);
