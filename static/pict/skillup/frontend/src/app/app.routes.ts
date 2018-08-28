import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LendingPageComponent } from './lending-page/lending-page.component'
import { HomeComponent } from './lending-page/content/home/home.component'
import { AuthGuardService } from './shared/auth-guard.service'
import { GroupedAssetsComponent } from "./lending-page/content/grouped-assets/grouped-assets.component";
import {SearchAssetsComponent} from "./lending-page/content/assets-search/assets-search.component";

export const appRoutes: Routes = [
  {
    path: '',
    component: LendingPageComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: 'assets/:id',
        component: GroupedAssetsComponent
      },
      {
        path: 'search',
        component: SearchAssetsComponent
      }
    ]
  }, {
    path: 'admin',
    loadChildren: 'app/admin/admin/admin.module#AdminModule',
    canLoad: [AuthGuardService],
    canActivate: [AuthGuardService]
  }, {
    path: 'auth',
    loadChildren: 'app/admin/auth/auth.module#AuthModule'
  }, {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home'
  }];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
