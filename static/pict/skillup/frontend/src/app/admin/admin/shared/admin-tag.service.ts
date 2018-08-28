import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/map'
import { Tag } from '../../../models/tag';
import { ParamEncoder } from '../../../shared/param-encoder';
import { TagService } from '../../shared/tag.service';

@Injectable()
export class AdminTagService {

  private tagTree: Array<Tag> = this.tagService.tags;

  constructor(private http: HttpClient, private tagService: TagService) { }

  get tags(): Array<Tag> {
    return this.tagTree;
  }

  fetchTags(): Promise<any> {
    return this.tagService.fetchTags();
  }

  getTagById(id: number): Tag {
    let res: Tag;

    res = this.tagTree.filter(e => {return e.id == id;})[0];
    return res;
  }

  getTagsByTagGroupIds(tgIds: Array<number>): Promise<any> {
    return this.fetchTags().then((data) => {
      return data.filter(e => {return tgIds.indexOf(e.tagGroupId) >= 0;});
    });
  }

  getTagsByTagIds(tagIds: Array<number>): Promise<any> {
    return this.fetchTags().then((data) => {
      return data.filter(e => {return tagIds.indexOf(e.id) >= 0;});
    });
  }

  getTagsByTagGroupId(tgId: number): Promise<any> {
    return this.fetchTags().then((data) => {
      return data.filter(e => {return e.tagGroupId == tgId;});
    });
  }

  getTagsByTagGroupName(tgName: string): Promise<any> {
    return this.fetchTags().then((data) => {
      return data.filter(e => {return e.tagGroupName == tgName;});
    });
  }

  addTag(tag: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.post(`/Tags`, tag)
        .subscribe((data: Tag) => {
          this.tagTree.push(data);
          resolve();
        });
    });

    return promise;
  }

  editTagOrder(tag: Tag, index: number) {
    let ls: Array<Tag> = this.tagTree.slice();
    let data: any = {
      reorderedTags: []
    };

    ls.splice(ls.indexOf(tag), 1);
    ls.splice(index, 0, tag);
    for (let i = 0; i < ls.length; i++) {
      data.reorderedTags.push({
        tagId: ls[i].id,
        orderNumber: i
      });
    }

    let promise = new Promise((resolve, reject) => {
      this.http.put(`/tags/reorder`, data)
        .subscribe(() => {
          this.tagTree.splice(0);
          this.tagTree.push.apply(this.tagTree, ls);
          for (let i = 0; i < this.tagTree.length; i++) {
            this.tagTree[i].orderNumber = ls[i].orderNumber;
          }
          resolve();
        });
    });

    return promise;
  }

  editTag(tag: Tag, data: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.put(`/Tags/${ tag.id }`, data)
        .subscribe((res: Tag) => {
          tag.name = res.name;
          tag.isActive = res.isActive;
          tag.orderNumber = res.orderNumber;
          tag.tagGroupId = res.tagGroupId;
          tag.tagGroupName = res.tagGroupName;
          resolve();
        });
    });

    return promise;
  }

  deleteTag(tag: Tag) {
    let promise = new Promise((resolve, reject) => {
      this.http.delete(`/Tags/${tag.id}`)
        .subscribe(() => {
          let index = this.tagTree.indexOf(tag);

          this.tagTree.splice(index, 1);
          resolve();
        });
    });

    return promise;
  }

}
