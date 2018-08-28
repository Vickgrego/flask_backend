import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/map';
import {ParamEncoder} from "../../shared/param-encoder";
import {BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class AssetsService {

  _assets: any = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
    // this.getAssetTypes()
  }


  get assets() {
    return this._assets;
  }

  getAssets(filters: any) {
    let params = new HttpParams({encoder: new ParamEncoder()});
    if (filters) {
      Object.keys(filters).map(key => {
        if(filters[key] !== null){
          params = params.set(key, filters[key]);
        }
        return key
      });
    }

    this.http.get(`/Assets`, {params})
      .subscribe((res: any) => {
        this._assets.next(res);
      });
  }

  getAssetDetails(id) {
    let promise = new Promise((resolve, reject) => {
      this.http.get(`/assets/${id}`)
        .subscribe((res: any) => {
          resolve(res);
        });
    });

    return promise;
  }

  addAsset(asset) {
    let promise = new Promise((resolve, reject) => {
      this.http.post(`/Assets`, asset)
        .subscribe((res: any) => {

          resolve(res);
        });
    });

    return promise;
  }

  editAsset(asset, id) {
    let promise = new Promise((resolve, reject) => {
      this.http.put(`/assets/${id}`, asset)
        .subscribe((res: any) => {
          console.log(res);

          resolve(res);
        });
    });

    return promise;
  }

  addFiles(assetId, data) {
    let promise = new Promise((resolve, reject) => {
      this.http.post(`/assets/${assetId}/files`, data)
        .subscribe((res: any) => {

          resolve();
        });
    });

    return promise;
  }

}
