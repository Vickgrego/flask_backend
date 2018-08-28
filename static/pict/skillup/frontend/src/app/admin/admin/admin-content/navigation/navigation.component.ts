import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeModel, TreeNode, TreeComponent } from 'angular-tree-component';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';

import { AdminNavigationItemService } from '../../shared/admin-navigation-item.service';
import { NavigationItem } from '../../../../models/navigation-item';
import { NavigationActionType } from '../../../../models/navigation-action-type.enum';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  navItems: Array<NavigationItem>;

  private parentNavItem: NavigationItem;
  private currentNavItem: NavigationItem;

  options = {
    allowDrag: true,
    allowDrop: (element, {parent, index}) => {
      return element ? element.parent === parent : false;
    },
    actionMapping: {
      mouse: {
        drop: (tree:TreeModel, node:TreeNode, event:any, {from, to}) => {
          this.parentNavItem = to.parent.data;
          this.currentNavItem = from.data;
          this.changeOrder(this.currentNavItem.orderNumber < to.index ? to.index - 1 : to.index);
        }
      }
    }
  };

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  constructor(private router: Router,
              private confirmationService: ConfirmationService,
              private navigationService: AdminNavigationItemService) {
    this.navItems = navigationService.navigationItems;

    this.loadNavItems();

  }

  ngOnInit() {
  }

  changeOrder(index: number) {
    let tag: any;

    if (index === this.currentNavItem.orderNumber) {
      return;
    }

    this.navigationService.editNavigationItemOrder(this.parentNavItem, this.currentNavItem, index).then((data) => {
      this.tree.treeModel.update();
    });
  }

  refreshNavigationItems() {
    let activeNode = this.tree.treeModel.getActiveNode();

    if (activeNode) {
      activeNode.toggleActivated();
    }
    this.tree.treeModel.update();
  }

  onChangeActiveNode(event) {
    this.router.navigate(['admin', 'navigation', 'edit', event.node.data.id]);
  }

  addNavigationItem(event: any, id: number) {
    event.stopPropagation();

    this.router.navigate(['admin', 'navigation', id, 'add']);
  }

  deleteConfirm(event: any, parent: NavigationItem, ni: NavigationItem) {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: ni.children.length ?
        'By deleting this parent all children would be deleted as well. Are you sure you want to delete this item? ' :
        'Are you sure you want to remove this item?',
      accept: () => {
        this.delete(parent, ni);
      }
    });
  }

  delete(parent: NavigationItem, ni: NavigationItem) {
    this.navigationService.deleteNavigationItem(parent, ni).then((data) => {
      this.tree.treeModel.update();
      this.router.navigate(['admin', 'navigation']);
    });
  }

  onMoveTag(event) {
    console.log('event:', event);
  }

  isLevelLessThenFour(node: TreeNode) {
    return node.path.length < 4;
  }

  isContentAction(action) {
    return action === NavigationActionType[NavigationActionType.Content];
  }

  isContentUrlAction(action) {
    return action === NavigationActionType[NavigationActionType.ContentUrl];
  }

  isNavigationAction(action) {
    return action === NavigationActionType[NavigationActionType.Navigation];
  }

  private loadNavItems() {
    this.navigationService.fetchNavigationItems().then(() => {
      this.tree.treeModel.update();
    });
  }

}
