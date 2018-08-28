import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SessionService } from './session.service';

@Injectable()
export class AuthGuardService implements CanLoad, CanActivate {

  constructor(private sessionService: SessionService,
              private router: Router) { }

  canLoad(route: Route): boolean {
    return this.checkLogin(`/${route.path}`);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return this.checkLogin(`/${route.pathFromRoot}`);
  }

  private checkLogin(url: string) {
    let res = !!this.sessionService.token;

    if (!res) {
      this.router.navigate(['auth', 'login']);
      // this.router.navigate(['auth', 'login'], {queryParams: {url: url}});
    }
    return res;
  }

}
