import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/map';
import {ParamEncoder} from "../../shared/param-encoder";
import {BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class ContentService {

  _assetTypes: Array<any> = [];
  _assets: any = new BehaviorSubject([]);
  _assetsSearch: any = new BehaviorSubject([]);
  _menuItems: Array<any> = [];
  _featuredAssets: Array<any> = [];
  _assetsHeading: string = "";

  constructor(private http: HttpClient) {

  }

  get featuredAssets() {
    return this._featuredAssets;
  }
  get assets() {
    return this._assets;
  }

  get assetsSearch() {
    return this._assetsSearch;
  }

  get assetTypes() {
    return this._assetTypes;
  }

  get menuItems() {
    return this._menuItems;
  }

  set assetsHeading(val) {
    localStorage.setItem('assetsHeading', val);
    this._assetsHeading = val;
  }
  get assetsHeading() {
    return this._assetsHeading || localStorage.getItem('assetsHeading');
  }

  getFeaturedAssets(filterString?: string) {
    let promise = new Promise((resolve, reject) => {
      this.http.get(`/assets/featured`)
        .subscribe((res: any) => {
          this._featuredAssets.splice(0, this._featuredAssets.length);
          this._featuredAssets.push.apply(this._featuredAssets, res.assets);

          resolve();
        });
    });

    return promise;
  }

  getNavigationItems() {
    let promise = new Promise((resolve, reject) => {
      this.http.get(`/NavigationItems`)
        .subscribe((res: any) => {
          this._menuItems.splice(0, this._menuItems.length);
          this._menuItems.push.apply(this._menuItems, res);

          resolve(res);
        });
    });

    return promise;
  }

  getAssets(navigationItemId: any) {
    let params = new HttpParams({encoder: new ParamEncoder()});
    if (navigationItemId) {
      params = params.set('navigationItemId', navigationItemId);
    }

    this.http.get(`/Assets`, {params})
      .subscribe((res: any) => {
        this._assets.next(res.groups);
      });

  }

  searchAssets(searchString) {
    let params = new HttpParams({encoder: new ParamEncoder()});

    params = params.set('searchString', searchString);
    params = params.set('pageNumber', '1');
    params = params.set('itemsPerPage', '50');

    this.http.get(`/assets/search`, {params})
      .subscribe((res: any) => {
        // res.totalCount

        this._assetsSearch.next(res.items);


      });
  }
}
