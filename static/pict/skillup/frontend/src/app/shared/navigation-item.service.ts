import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map'
import { NavigationItem } from '../models/navigation-item';

@Injectable()
export class NavigationItemService {

  private isNavigationItemTreeLoaded = false;
  private navigationItemTree: Array<NavigationItem> = new Array();

  constructor(private http: HttpClient) { }

  get navigationItems(): Array<NavigationItem> {
    return this.navigationItemTree;
  }

  fetchNavigationItems() {
    let promise = new Promise((resolve, reject) => {
      if (this.isNavigationItemTreeLoaded) {
        resolve();
        return;
      }

      this.http.get(`/NavigationItems`)
        .subscribe(navigationItems => {
          this.navigationItemTree.splice(0, this.navigationItemTree.length);
          this.navigationItemTree.push.apply(this.navigationItemTree, navigationItems);
          this.isNavigationItemTreeLoaded = true;
          resolve();
        });
    });

    return promise;
  }


}
