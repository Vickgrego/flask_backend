import {Component, OnInit, OnDestroy} from '@angular/core';
import { ContentService } from "../../shared/content.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-grouped-assets',
  templateUrl: './grouped-assets.component.html'
})
export class GroupedAssetsComponent implements OnInit, OnDestroy {

  assets: Array<any> = [];
  sub: any;
  rsub: any;

  constructor(private contentService: ContentService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.contentService.assets.subscribe((resp) => {
      this.assets = resp;
    });
    this.rsub = this.route.params.subscribe((val: any) => {
      this.contentService.getAssets(val.id)
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.rsub.unsubscribe();
  }

}
