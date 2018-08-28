import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/map'
import { NavigationItem } from '../../../models/navigation-item';
import { NavigationActionType } from '../../../models/navigation-action-type.enum';
import { ParamEncoder } from '../../../shared/param-encoder';
import { NavigationItemService } from '../../../shared/navigation-item.service';

@Injectable()
export class AdminNavigationItemService {

  private isNavigationItemTreeLoaded = false;
  private navigationItemTree: Array<NavigationItem> = new Array();

  constructor(private http: HttpClient,
              private navigationItemService: NavigationItemService) { }

  get navigationItems(): Array<NavigationItem> {
    return this.navigationItemTree;
  }

  // fetchNavigationItems() {
  //   return this.navigationItemService.fetchNavigationItems();
  // }

  fetchNavigationItems() {
    let promise = new Promise((resolve, reject) => {
      if (this.isNavigationItemTreeLoaded) {
        resolve();
        return;
      }
      let params: HttpParams = new HttpParams()
        .set('includeInactive', 'true');

      this.http.get(`/NavigationItems`, {params: params})
        .subscribe(navigationItems => {
          this.navigationItemTree.splice(0, this.navigationItemTree.length);
          this.navigationItemTree.push.apply(this.navigationItemTree, navigationItems);
          this.isNavigationItemTreeLoaded = true;
          resolve();
        });
    });

    return promise;
  }

  fetchNavigationItem(id: number) {
    let promise = new Promise((resolve, reject) => {
      this.http.get(`/NavigationItems/${id}`)
        .subscribe(data => {
          resolve(data);
        });
    });

    return promise;
  }

  getNavItemAssets(id) {
    let promise = new Promise((resolve, reject) => {
      this.http.get(`/NavigationItems/${id}/assets`)
        .subscribe((res: any) => {
          resolve(res.assets);
        });
    });

    return promise;
  }

  getNavigationItemById(parent: NavigationItem, id: number): NavigationItem {
    let res: NavigationItem;

    if (parent) {
      res = parent.children.filter(e => {return e.id == id;})[0];
      if (!res) {
        for (let i in parent.children) {
          res = this.getNavigationItemById(parent.children[i], id);
          if (res) {
            break;
          }
        }
      }
    } else {
      res = this.navigationItems.filter(e => {return e.id == id;})[0];
      if (!res) {
        for (let i in this.navigationItems) {
          res = this.getNavigationItemById(this.navigationItems[i], id);
          if (res) {
            break;
          }
        }
      }
    }

    return res;
  }

  addNavigationItem(parent: NavigationItem, ni: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.post(`/NavigationItems`, ni)
        .subscribe(data => {
          if (parent) {
            parent.children.push(<NavigationItem>data);
          } else {
            this.navigationItems.push(<NavigationItem>data);
          }
          resolve();
        });
    });

    return promise;
  }

  editNavigationItemOrder(parent: NavigationItem, navItem: NavigationItem, index: number) {
    let ls: Array<NavigationItem> = parent.children.slice();
    let data: any = {
      reorderedItems: []
    };

    ls.splice(ls.indexOf(navItem), 1);
    ls.splice(index, 0, navItem);
    for (let i = 0; i < ls.length; i++) {
      data.reorderedItems.push({
        navigationItemId: ls[i].id,
        orderNumber: i
      });
    }

    let promise = new Promise((resolve, reject) => {
      this.http.put(`/NavigationItems/reorder`, data)
        .subscribe(() => {
          parent.children.splice(navItem.orderNumber, 1);
          parent.children.splice(index, 0, navItem);
          for (let i = 0; i < parent.children.length; i++) {
            parent.children[i].orderNumber = i;
          }
          resolve();
        });
    });

    return promise;
  }

  editNavigationItem(data: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.put(`/NavigationItems/${data.id}`, data)
        .subscribe((res: NavigationItem) => {
          let navItem = this.getNavigationItemById(null, data.id);
          navItem.name = res.name;
          navItem.isActive = res.isActive;
          navItem.navigationActionType = res.navigationActionType;
          resolve();
        });
    });

    return promise;
  }

  deleteNavigationItem(parent: NavigationItem, navItem: NavigationItem) {
    let promise = new Promise((resolve, reject) => {
      this.http.delete(`/NavigationItems/${navItem.id}`)
        .subscribe(() => {
          let index = parent.children.indexOf(navItem);

          parent.children.splice(index, 1);
          resolve();
        });
    });

    return promise;
  }

  getNavigationActions(): Array<any> {
    let res: Array<any> = Object.keys(NavigationActionType).map(k => NavigationActionType[k]);

    return res.filter(v => typeof v === "string");
  }

}
