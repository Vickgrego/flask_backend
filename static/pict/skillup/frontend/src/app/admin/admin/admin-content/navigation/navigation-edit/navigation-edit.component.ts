import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminTagService } from '../../../shared/admin-tag.service';
import { AdminTagGroupService } from '../../../shared/admin-tag-group.service';
import { AdminNavigationItemService } from '../../../shared/admin-navigation-item.service';
import { Tag } from '../../../../../models/tag';
import { TagGroup } from '../../../../../models/tag-group';
import { NavigationItem } from '../../../../../models/navigation-item';
import { NavigationActionType } from '../../../../../models/navigation-action-type.enum';

@Component({
  selector: 'app-navigation-edit',
  templateUrl: './navigation-edit.component.html',
  styleUrls: ['./navigation-edit.component.scss']
})
export class NavigationEditComponent implements OnInit, OnDestroy {
  formSubmitted: boolean = false;
  form: FormGroup;
  navItem: NavigationItem;
  tagGroups: Array<TagGroup>;
  tags: Array<Tag>;
  navigationActions: Array<any>;
  activeNav: string;
  assets: Array<any> = [];

  private sub: any;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private tagGroupService: AdminTagGroupService,
              private tagService: AdminTagService,
              private navigationItemService: AdminNavigationItemService) {
    this.navigationActions = this.navigationItemService.getNavigationActions();

    this.buildForm();

    this.tagService.fetchTags().then((tags: Array<Tag>) => {
      this.tags = tags;
      });

    this.tagGroupService.fetchTagGroupsWithoutNoGroup().then(data => {
      this.tagGroups = data;
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.assets = [];
        this.activeNav = 'navigation';
        this.navigationItemService.fetchNavigationItem(params['id']).then((data: NavigationItem) => {
          this.navItem = data;
          this.form.controls.name.setValue(this.navItem.name);
          this.form.controls.isActive.setValue(this.navItem.isActive);
          if (this.isContentAction()) {
            this.tagService.getTagsByTagIds(this.navItem.tags.map((e: any) => { return e.tagId; }))
              .then((tags: Array<Tag>) => {
                setTimeout(() => {
                  this.form.controls.group.setValue(this.navItem.tagGroupId);
                  this.form.controls.contentTags.setValue(tags);
                }, 0)
            });
            // this.tagService.getTagsByTagIds(this.navItem.tags.map((e: any) => { return e.tagId; }))
            //   .then((tags: Array<Tag>) => {
            //     setTimeout(() => {
            //       this.form.controls.group.setValue(this.getTagGroupIdsOfTags(tags));
            //       this.form.controls.contentTags.setValue(tags);
            //     }, 0)
            //   });
          } else if (this.isContentUrlAction()) {
            this.form.addControl('url', new FormControl(this.navItem.contentUrl, [
              Validators.required,
              Validators.pattern(`^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$`)
            ]));
            this.form.controls.url.setValue(this.navItem.contentUrl);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  editAsset(ev) {
    var a = document.createElement('a');
    a.setAttribute('href', "#/admin/assets/edit/" + ev.data.id );
    a.setAttribute('target', "_blank");
    a.click();
  }

  toggleNav(link) {
    this.activeNav = link;

    if (link == 'assets') {
      this.navigationItemService.getNavItemAssets(this.navItem.id).then((resp: Array<any>) => {
        this.assets = resp;
      });
    }
  }

  save() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    try {
      let data: any = new Object();
      let tagIds: Array<number>;

      data.id = this.navItem.id;
      data.name = this.form.value.name;
      data.orderNumber = this.navItem.orderNumber;
      data.navigationActionType = this.navItem.navigationActionType;
      data.isActive = this.form.value.isActive;
      data.tags = new Array();
      if (this.isContentAction()) {
        data.tagGroupId = this.form.value.group;
        for (let i in this.form.value.contentTags) {
          data.tags.push({
            tagId: this.form.value.contentTags[i].id,
            groupName: this.form.value.contentTags[i].groupName
          });
        }
        tagIds = data.tags.map((e: any) => { return e.tagId; });
        for (let i in this.navItem.tags) {
          if (tagIds.indexOf(this.navItem.tags[i].tagId) === -1) {
            data.tags.push({
              tagId: this.navItem.tags[i].tagId,
              shouldDelete: true
            });
          }
        }
      } else if (this.isContentUrlAction()) {
        data.contentUrl = this.form.value.url;
      }

      this.navigationItemService.editNavigationItem(data).then(() => {
        this.cancel();
      });
    } finally {
      this.formSubmitted = false;
    }

  }

  cancel() {
    this.router.navigate(['admin', 'navigation']);
  }

  tagGroupsSelectedChange(event) {
    this.tagService.getTagsByTagGroupIds(event).then(data => {
      this.tags = data;
    });
  }

  isContentAction() {
    return this.navItem ? NavigationActionType[this.navItem.navigationActionType] === NavigationActionType.Content : false;
  }

  isContentUrlAction() {
    return this.navItem ? NavigationActionType[this.navItem.navigationActionType] === NavigationActionType.ContentUrl : false;
  }

  isNavigationAction() {
    return this.navItem ? NavigationActionType[this.navItem.navigationActionType] === NavigationActionType.Navigation : false;
  }

  private getTagGroupIdsOfTags(tags: Array<Tag>) {
    let res: Array<number> = new Array();

    for (let i in tags) {
      if (res.indexOf(tags[i].tagGroupId) === -1) {
        res.push(tags[i].tagGroupId);
      }
    }

    return res;
  }

  private buildForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      isActive: [true, []],
      contentTags: ['', []],
      group: ['', []],
      url: ['', []]
    });
  }

}
