import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map'
import { Tag } from '../../models/tag';

@Injectable()
export class TagService {

  private isTagTreeLoaded = false;
  private tagTree: Array<Tag> = [];

  constructor(private http: HttpClient) { }

  get tags(): Array<Tag> {
    return this.tagTree;
  }

  fetchTags() {
    let promise = new Promise((resolve, reject) => {
      if (this.isTagTreeLoaded) {
        resolve(this.tagTree);
        return;
      }

      this.http.get(`/tags`)
        .subscribe(tags => {
          this.tagTree.splice(0, this.tagTree.length);
          this.tagTree.push.apply(this.tagTree, tags);
          this.isTagTreeLoaded = true;
          resolve(this.tagTree);
        });
    });

    return promise;
  }

}
