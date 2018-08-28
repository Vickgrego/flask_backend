import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/map'
import { TagGroup } from '../../../models/tag-group';
import { TagGroupService } from "../../shared/tag-group.service";
import { AdminTagService } from "./admin-tag.service";

@Injectable()
export class AdminTagGroupService {

  private tagGroupList: Array<TagGroup> = this.tagGroupService.tagGroups;

  constructor(private http: HttpClient,
              private tagService: AdminTagService,
              private tagGroupService: TagGroupService) { }

  get tagGroups(): Array<TagGroup> {
    return this.tagGroupList;
  }

  fetchTagGroups(): Promise<any> {
    return this.tagGroupService.fetchTagGroups();
  }

  fetchTagGroupsWithoutNoGroup(): Promise<any> {
    return this.fetchTagGroups().then(data => {
      return data.filter((e: any) => {return e.name !== 'NoGroup'});
    });
  }

  getTagGroupById(id: number): TagGroup {
    let res: TagGroup;

    res = this.tagGroupList.filter(e => {return e.id == id;})[0];
    return res;
  }

  getTagGroupByName(name: string): TagGroup {
    let res: TagGroup;

    res = this.tagGroupList.filter(e => {return e.name == name;})[0];
    return res;
  }

  addTagGroup(tagGroup: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.post(`/TagGroups`, tagGroup)
        .subscribe((data: TagGroup) => {
          this.tagGroupList.push(data);
          if (data.tags && data.tags.length) {
            this.tagService.getTagsByTagIds(data.tags.map((e: any) => {return e.id;})).then((tags: any) => {
              for (let i in tags) {
                tags[i].tagGroupId = data.id;
                tags[i].tagGroupName = data.name;
              }
              data.tags = tags;
              resolve();
            });
          } else {
            resolve();
          }
        });
    });

    return promise;
  }

  editTagGroupOrder(tagGroup: TagGroup, index: number) {
    let ls: Array<TagGroup> = this.tagGroups.slice();
    let data: any = {
      reorderedItems: []
    };

    ls.splice(ls.indexOf(tagGroup), 1);
    ls.splice(index, 0, tagGroup);
    for (let i = 0; i < ls.length; i++) {
      data.reorderedItems.push({
        tagGroupId: ls[i].id,
        orderNumber: i
      });
    }

    let promise = new Promise((resolve, reject) => {
      this.http.put(`/tagGroups/reorder`, data)
        .subscribe(() => {
          this.tagGroups.splice(0);
          this.tagGroups.push.apply(this.tagGroups, ls);
          for (let i = 0; i < this.tagGroups.length; i++) {
            this.tagGroups[i].orderNumber = ls[i].orderNumber;
          }
          resolve();
        });
    });

    return promise;
  }

  editTagGroup(tagGroup: TagGroup, data: any) {
    let promise = new Promise((resolve, reject) => {
      this.http.put(`/tagGroups/${tagGroup.id}`, data)
        .subscribe((res: any) => {
          let noGroup: TagGroup = this.tagGroups.filter((e: TagGroup) => {return e.name === 'NoGroup';})[0];
          tagGroup.name = res.name;
          tagGroup.orderNumber = res.orderNumber;
          this.tagService.getTagsByTagGroupId(tagGroup.id).then((tags: any) => {
            for (let i in tags) {
              tags[i].tagGroupId = noGroup.id;
              tags[i].tagGroupName = noGroup.name;
            }
          });
          if (res.tags && res.tags.length) {
            this.tagService.getTagsByTagIds(res.tags.map((e: any) => {
              return e.id;
            })).then((tags: any) => {
              for (let i in tags) {
                tags[i].tagGroupId = tagGroup.id;
                tags[i].tagGroupName = tagGroup.name;
              }
              tagGroup.tags.splice(0);
              tagGroup.tags.push.apply(tagGroup.tags, res.tags);
              resolve();
            });
          } else {
            tagGroup.tags.splice(0);
            resolve();
          }
        });
    });

    return promise;
  }

  deleteTagGroup(tg: TagGroup) {
    let promise = new Promise((resolve, reject) => {
      this.http.delete(`/tagGroups/${tg.id}`)
        .subscribe(() => {
          let index = this.tagGroups.indexOf(tg);

          this.tagGroups.splice(index, 1);
          resolve();
        });
    });

    return promise;
  }


}
