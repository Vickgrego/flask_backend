import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminTagService } from '../../../shared/admin-tag.service';
import { AdminTagGroupService } from '../../../shared/admin-tag-group.service';
import { TagGroup } from '../../../../../models/tag-group';

@Component({
  selector: 'app-tag-group-edit',
  templateUrl: './tag-group-edit.component.html',
  styleUrls: ['./tag-group-edit.component.scss']
})
export class TagGroupEditComponent implements OnInit, OnDestroy {
  formSubmitted: boolean = false;
  form: FormGroup;
  tagGroup: TagGroup = new TagGroup();
  tagGroupTags: Array<any>;
  noGroupTags: Array<any>;

  private sub: any;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private tagGroupService: AdminTagGroupService,
              private tagService:AdminTagService) {
    this.buildForm();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let noGroup: TagGroup = this.tagGroupService.getTagGroupByName('NoGroup');

      if (params['id']) {
        this.tagGroup = this.tagGroupService.getTagGroupById(params['id']);
        if (this.tagGroup) {
          this.form.controls.name.setValue(this.tagGroup.name);
          this.tagService.getTagsByTagGroupId(this.tagGroup.id).then(data => {
            this.tagGroupTags = data;
          });
          if (noGroup) {
            this.tagService.getTagsByTagGroupId(noGroup.id).then(data => {
              this.noGroupTags = data;
            });
          }
        } else {
          this.router.navigate(['admin', 'tag-groups']);
        }
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    try {
      let data: any = new Object();
      let noGrop: TagGroup = this.tagGroupService.getTagGroupByName('NoGroup');

      data.name = this.form.value.name;
      data.orderNumber = this.tagGroup.orderNumber;
      data.tagAssignments = [];
      for (let i in this.tagGroupTags) {
        data.tagAssignments.push({
          tagId: this.tagGroupTags[i].id,
          tagGroupId: this.tagGroup.id
        });
      }
      for (let i in this.noGroupTags) {
        data.tagAssignments.push({
          tagId: this.noGroupTags[i].id,
          tagGroupId: noGrop.id
        });
      }

      this.tagGroupService.editTagGroup(this.tagGroup, data).then(() => {
        this.cancel();
      });
    } finally {
      this.formSubmitted = false;
    }

  }

  cancel() {
    this.router.navigate(['admin', 'tag-groups']);
  }

  private buildForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

}
