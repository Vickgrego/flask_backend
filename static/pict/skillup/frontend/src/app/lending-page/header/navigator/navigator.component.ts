import { Component, OnInit, Input, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { Tag } from '../../../models/tag';
import { ContentService } from "../../shared/content.service";
import {Subject} from "rxjs/Rx";


@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit {
  openedAccordionId: number;
  openedSubId: number;
  openedSubSubId: number;
  activeItemId: number;
  activeMenuItemId: number;
  tags: Array<Tag>;
  tagsReady: any = new Subject();
  private showSubMenu: boolean;
  wideMenu: boolean;

  @Input() toogleNav: boolean;
  @Output() changeBtn: EventEmitter<boolean> = new EventEmitter();
  @Output() tagsLength: EventEmitter<boolean> = new EventEmitter();

  constructor(private contentService: ContentService,
              private router: Router,
              private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.setActiveMenuItemId(this.router.url, true);
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.setActiveMenuItemId(ev.url, false);
      }

    });
    this.tags = this.contentService.menuItems;

    this.contentService.getNavigationItems().then((resp: any) => {
      this.wideMenu = resp.length > 5;
      this.tagsLength.emit(this.wideMenu);
      this.tagsReady.next(true);
    });
  }

  setActiveMenuItemId(url, async) {
    if (this.router.url.indexOf('assets') >= 0) {
      if (async) {
        this.tagsReady.subscribe(() => {
          this.getTopNavItemId(parseInt(url.split('/')[2]));
        });
      } else {
        this.getTopNavItemId(parseInt(url.split('/')[2]));
      }
    } else {
      this.activeMenuItemId = -1;
      this.openedAccordionId = -1;
    }
  }

  getTopNavItemId(id) {
    let labelResult = "";
    this.tags.find(el => {
      if (el['children']) {
        el['children'].find(child => {
          if (child['children']){
            child['children'].find(subChild => {
              if (subChild['children']) {
                subChild['children'].find(subSubChild => {
                  if (subSubChild.id == id) {
                    labelResult = el.name + ' / ' + child.name + ' / ' + subChild.name + ' / ' + subSubChild.name;
                    this.contentService.assetsHeading = labelResult;
                    this.activeMenuItemId = el.id;
                  }
                  return subSubChild.id == id;
                })
              }
              if (subChild.id == id) {
                labelResult = el.name + ' / ' + child.name + ' / ' + subChild.name;
                this.contentService.assetsHeading = labelResult;
                this.activeMenuItemId = el.id;
              }
              return subChild.id == id;
            })
          }
          if (child.id == id) {
            labelResult = el.name + ' / ' + child.name;
            this.contentService.assetsHeading = labelResult;
            this.activeMenuItemId = el.id;
          }
          return el.id == id;
        })
      }
      if (el.id == id) {
        labelResult = el.name;
        this.contentService.assetsHeading = labelResult;
        this.activeMenuItemId = el.id;
      }
      return el.id == id;
    });
  }

  hideSubMenu() {
    this.toogleNav = !this.toogleNav;
    this.changeBtn.emit(this.toogleNav);
  }

  toggleSubMenu(state, i) {
    this.showSubMenu = state;
    this.activeItemId = i;
  }

  showAssets(event, tag, array) {
    event.preventDefault();

    if (tag.contentUrl) {
      var a = document.createElement('a');
      a.setAttribute('href', tag.contentUrl);
      a.setAttribute('target', "_blank");
      a.click();      
    } else {
      this.router.navigate(['/assets/'+ tag.id]);
    }

    this.showSubMenu = !this.showSubMenu;
  }

  openAccordionNav(i): void {
    this.openedSubId = null;
    this.openedSubSubId = null;
    if (this.openedAccordionId == i) {
      this.openedAccordionId = null;
    } else {
      this.openedAccordionId = i;
    }
  }

  openSubNav(i): void {
    this.openedSubSubId = null;
    if (this.openedSubId == i) {
      this.openedSubId = null;
    } else {
      this.openedSubId = i;
    }
  }

  openSubSubNav(i): void {
    if (this.openedSubSubId == i) {
      this.openedSubSubId = null;
    } else {
      this.openedSubSubId = i;
    }
  }

}
