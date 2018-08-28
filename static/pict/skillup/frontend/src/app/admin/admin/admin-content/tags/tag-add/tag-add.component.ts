import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminTagService } from '../../../shared/admin-tag.service';
import { AdminTagGroupService } from '../../../shared/admin-tag-group.service';
import { Tag } from '../../../../../models/tag';
import { TagGroup } from '../../../../../models/tag-group';

@Component({
  selector: 'app-tag-add',
  templateUrl: './tag-add.component.html',
  styleUrls: ['./tag-add.component.scss']
})
export class TagAddComponent implements OnInit {
  formSubmitted: boolean = false;
  form: FormGroup;
  tag: Tag = new Tag();
  tagGroups: Array<TagGroup>;

  constructor(private fb: FormBuilder,
              private tagGroupService: AdminTagGroupService,
              private tagService:AdminTagService,
              private router: Router) {
    this.buildForm();

    this.tagGroupService.fetchTagGroups().then(data => {
      let noGrop: TagGroup = this.tagGroupService.getTagGroupByName('NoGroup');

      this.form.controls.tagGroup.setValue(noGrop.id);
      this.tagGroups = data;
    });
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
      data.isActive = this.form.value.isActive;
      data.orderNumber = this.tagService.tags[this.tagService.tags.length - 1].orderNumber + 1;
      data.tagGroupId = this.form.value.tagGroup;

      this.tagService.addTag(data).then(() => {
        this.cancel();
      });
    } finally {
      this.formSubmitted = false;
    }

  }

  cancel() {
    this.router.navigate(['admin', 'tags']);
  }

  private buildForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      isActive: [true, []],
      tagGroup: ['', []]
    });
  }

}
