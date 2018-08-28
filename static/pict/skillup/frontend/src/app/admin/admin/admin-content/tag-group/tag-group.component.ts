import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TreeModel, TreeNode, TreeComponent } from 'angular-tree-component';
import { ConfirmationService } from 'primeng/primeng';

import { AdminTagGroupService } from '../../shared/admin-tag-group.service';
import { TagGroup } from '../../../../models/tag-group';

@Component({
  selector: 'app-tag-group',
  templateUrl: './tag-group.component.html',
  styleUrls: ['./tag-group.component.scss']
})
export class TagGroupComponent implements OnInit {
  tagGroups: Array<TagGroup>;

  options = {
    allowDrag: true,
    allowDrop: (element, {parent, index}) => {
      return element ? element.parent === parent : false;
    },
    actionMapping: {
      mouse: {
        drop: (tree:TreeModel, node:TreeNode, event:any, {from, to}) => {
          this.changeOrder(from.data, from.data.orderNumber < to.index ? to.index : to.index + 1);
        }
      }
    }
  };

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  constructor(private router: Router,
              private confirmationService: ConfirmationService,
              private tagGroupService: AdminTagGroupService) {
    this.loadTagGroups();
  }

  ngOnInit() {
  }

  onChangeActiveNode(event) {
    if (event.node.data.name !== 'NoGroup') {
      this.router.navigate(['admin', 'tag-groups', 'edit', event.node.data.id]);
    }
  }

  changeOrder(tagGroup: TagGroup, index: number) {
    if (index === tagGroup.orderNumber) {
      return;
    }

    this.tagGroupService.editTagGroupOrder(tagGroup, index).then((data) => {
      this.loadTagGroups();
      this.tree.treeModel.update();
    });
  }

  deleteConfirm(event, tg: TagGroup) {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this item?',
      accept: () => {
        this.delete(tg);
      }
    });
  }

  delete(tg: TagGroup) {
    this.tagGroupService.deleteTagGroup(tg).then((data) => {
      this.loadTagGroups();
      this.tree.treeModel.update();
    });
  }

  refreshTagGroups() {
    let activeNode = this.tree.treeModel.getActiveNode();

    if (activeNode) {
      activeNode.toggleActivated();
    }
    this.loadTagGroups();
    this.tree.treeModel.update();
  }

  private loadTagGroups() {
    this.tagGroupService.fetchTagGroupsWithoutNoGroup().then(data => {
      this.tagGroups = data;
      this.tree.treeModel.update();
    });
  }

}
