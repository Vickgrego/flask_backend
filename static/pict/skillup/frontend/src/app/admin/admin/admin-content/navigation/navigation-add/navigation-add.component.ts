import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminTagService } from '../../../shared/admin-tag.service';
import { AdminTagGroupService } from '../../../shared/admin-tag-group.service';
import { AdminNavigationItemService } from '../../../shared/admin-navigation-item.service';
import { Tag } from '../../../../../models/tag';
import { TagGroup } from '../../../../../models/tag-group';
import { NavigationItem } from '../../../../../models/navigation-item';
import { NavigationActionType } from '../../../../../models/navigation-action-type.enum';

@Component({
  selector: 'app-navigation-add',
  templateUrl: './navigation-add.component.html',
  styleUrls: ['./navigation-add.component.scss']
})
export class NavigationAddComponent implements OnInit, OnDestroy {
  formSubmitted: boolean = false;
  form: FormGroup;
  parentNavItem: NavigationItem;
  tagGroups: Array<TagGroup>;
  tags: Array<Tag>;
  navigationActions: Array<any>;

  private sub: any;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private tagGroupService: AdminTagGroupService,
              private tagService: AdminTagService,
              private navigationItemService: AdminNavigationItemService) {
    this.navigationActions = this.navigationItemService.getNavigationActions();

    this.buildForm();

    this.tagGroupService.fetchTagGroupsWithoutNoGroup().then(data => {
      this.tagGroups = data;
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.parentNavItem = this.navigationItemService.getNavigationItemById(null, params['id']);
        this.form.controls.action.setValue(this.parentNavItem ? this.navigationActions[0] : this.navigationActions[1]);
        this.tagService.fetchTags().then(data => {
          this.tags = data;
        });

      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    this.formSubmitted = true;
    console.log('this.form:', this.form);
    if (this.form.invalid) {
      return;
    }

    try {
      let data: any = new Object();

      data.name = this.form.value.name;
      if (this.parentNavItem) {
        data.parentId = this.parentNavItem.id;
        data.orderNumber = this.parentNavItem.children.length ?
          this.parentNavItem.children[this.parentNavItem.children.length - 1].orderNumber + 1 : 0;
      } else {
        data.orderNumber = this.navigationItemService.navigationItems[this.navigationItemService.navigationItems.length - 1].orderNumber + 1;
      }

      data.navigationActionType = this.form.value.action;
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
      } else if (this.isContentUrlAction()) {
        data.contentUrl = this.form.value.url;
      }

      this.navigationItemService.addNavigationItem(this.parentNavItem, data).then(() => {
        this.cancel();
      });
    } finally {
      this.formSubmitted = false;
    }

  }

  cancel() {
    this.router.navigate(['admin', 'navigation'])
  }

  tagGroupsSelectedChange(event) {
    this.tagService.getTagsByTagGroupIds(event).then(data => {
      this.tags = data;
    });
  }

  onChangeAction(event) {
    if (event === NavigationActionType[NavigationActionType.ContentUrl]) {
      this.form.addControl('url', new FormControl('', [
        Validators.required,
        Validators.pattern(`^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$`)
      ]));
    } else {
      this.form.removeControl('url');
    }
  }

  isContentAction() {
    return !!this.parentNavItem && this.form.value.action === NavigationActionType[NavigationActionType.Content];
  }

  isContentUrlAction() {
    return !!this.parentNavItem && this.form.value.action === NavigationActionType[NavigationActionType.ContentUrl];
  }

  isNavigationAction() {
    return !this.parentNavItem && this.form.value.action === NavigationActionType[NavigationActionType.Navigation];
  }

  private buildForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      action: [this.navigationActions[1], []],
      isActive: [true, []],
      contentTags: ['', []],
      group: ['', []]
    });
  }

}
