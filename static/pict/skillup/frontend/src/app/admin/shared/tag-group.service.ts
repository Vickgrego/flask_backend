import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map'
import { TagGroup } from "../../models/tag-group";

@Injectable()
export class TagGroupService {

  private isTagGroupsLoaded = false;
  private tagGroupList: Array<TagGroup> = [];

  constructor(private http: HttpClient) { }

  get tagGroups(): Array<TagGroup> {
    return this.tagGroupList;
  }

  fetchTagGroups() {
    let promise = new Promise((resolve, reject) => {
      if (this.isTagGroupsLoaded) {
        resolve(this.tagGroupList);
        return;
      }

      this.http.get(`/TagGroups`)
        .subscribe((data: any) => {
          this.tagGroupList.splice(0);
          this.tagGroupList.push.apply(this.tagGroupList, data.tagGroups);
          this.isTagGroupsLoaded = true;
          resolve(this.tagGroupList);
        });
    });

    return promise;
  }

}
