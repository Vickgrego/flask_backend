import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AdminTagService } from '../../../shared/admin-tag.service';
import { AdminTagGroupService } from '../../../shared/admin-tag-group.service';
import { TagGroup } from '../../../../../models/tag-group';

@Component({
  selector: 'app-tag-group-add',
  templateUrl: './tag-group-add.component.html',
  styleUrls: ['./tag-group-add.component.scss']
})
export class TagGroupAddComponent implements OnInit {
  formSubmitted: boolean = false;
  form: FormGroup;
  tagGroup: TagGroup = new TagGroup();
  noGroupTags: Array<any>;

  constructor(private fb: FormBuilder,
              private tagGroupService: AdminTagGroupService,
              private tagService:AdminTagService,
              private router: Router) {
    let noGroup: TagGroup = this.tagGroupService.getTagGroupByName('NoGroup');

    if (noGroup) {
      this.tagService.getTagsByTagGroupId(noGroup.id).then(data => {
        this.noGroupTags = data;
      });
    }

    this.buildForm();
  }

  ngOnInit() {
  }

  save() {
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    try {
      let data: any = new Object();

      data.name = this.form.value.name;
      data.orderNumber = this.tagGroupService.tagGroups[this.tagGroupService.tagGroups.length - 1].orderNumber + 1;
      data.tagAssignments = [];
      for (let i in this.tagGroup.tags) {
        data.tagAssignments.push({
          tagId: this.tagGroup.tags[i].id,
          tagGroupId: null
        });
      }

      this.tagGroupService.addTagGroup(data).then(() => {
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
