import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TreeModel, TreeNode, TreeComponent } from 'angular-tree-component';
import { ConfirmationService } from 'primeng/primeng';

import { AdminTagService } from '../../shared/admin-tag.service';
import { Tag } from '../../../../models/tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  tags: Array<Tag>;
  formSubmitted: boolean = false;
  display: boolean = false;

  options = {
    allowDrag: true,
    allowDrop: (element, {parent, index}) => {
      return element ? element.parent === parent : false;
    },
    actionMapping: {
      mouse: {
        drop: (tree:TreeModel, node:TreeNode, event:any, {from, to}) => {
          this.parentTag = to.parent.data;
          this.currentTag = from.data;
          this.changeOrder(this.currentTag.orderNumber < to.index ? to.index - 1 : to.index);
        }
      }
    }
  };

  private parentTag: Tag;
  private currentTag: Tag;

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  constructor(private tagService: AdminTagService,
              private confirmationService: ConfirmationService,
              private router: Router) {
    this.tags = tagService.tags;

    this.loadTags();

  }

  ngOnInit() {
  }

  onChangeActiveNode(event) {
    this.router.navigate(['admin', 'tags', 'edit', event.node.data.id]);
  }

  changeOrder(index: number) {
    let tag: any;

    if (index === this.currentTag.orderNumber) {
      return;
    }

    this.tagService.editTagOrder(this.currentTag, index).then((data) => {
      this.tree.treeModel.update();
    });
  }

  deleteConfirm(event, tag: Tag) {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this item?',
      accept: () => {
        this.delete(tag);
      }
    });
  }

  delete(tag: Tag) {
    this.tagService.deleteTag(tag).then((data) => {
      this.tree.treeModel.update();
    });
  }

  refreshTags() {
    let activeNode = this.tree.treeModel.getActiveNode();

    if (activeNode) {
      activeNode.toggleActivated();
    }
    this.tree.treeModel.update();
  }

  private loadTags() {
    this.tagService.fetchTags().then(() => {
      this.tree.treeModel.update();
    });
  }

}
