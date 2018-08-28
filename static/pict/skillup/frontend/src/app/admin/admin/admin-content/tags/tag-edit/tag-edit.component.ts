import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AdminTagService } from '../../../shared/admin-tag.service';
import { AdminTagGroupService } from '../../../shared/admin-tag-group.service';
import { Tag } from '../../../../../models/tag';
import { TagGroup } from '../../../../../models/tag-group';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.scss']
})
export class TagEditComponent implements OnInit, OnDestroy {
  formSubmitted: boolean = false;
  form: FormGroup;
  tag: Tag = new Tag();
  tagGroups: Array<TagGroup>;

  private sub: any;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private tagGroupService: AdminTagGroupService,
              private tagService:AdminTagService,
              private router: Router) {
    this.tagGroupService.fetchTagGroups().then(data => {
      this.tagGroups = data;
    });

    this.buildForm();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.tag = this.tagService.getTagById(params['id']);
        if (this.tag) {
          this.form.controls.name.setValue(this.tag.name);
          this.form.controls.isActive.setValue(this.tag.isActive);
          this.form.controls.tagGroup.setValue(this.tag.tagGroupId);
        } else {
          this.router.navigate(['admin', 'tags']);
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
      data.isActive = this.form.value.isActive;
      data.orderNumber = this.tagService.tags[this.tagService.tags.length - 1].orderNumber + 1;
      data.tagGroupId = this.form.value.tagGroup === '0' ? noGrop.id : this.form.value.tagGroup;

      this.tagService.editTag(this.tag, data).then(() => {
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
