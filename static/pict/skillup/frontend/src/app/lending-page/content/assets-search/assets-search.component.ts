import {Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ContentService } from "../../shared/content.service";

@Component({
  selector: 'app-assets-search',
  templateUrl: './assets-search.component.html',
  styleUrls: ['./assets-search.component.scss']
})
export class SearchAssetsComponent implements OnInit, OnDestroy {
  openedAccordionId: number;
  searchString: string;
  assets: Array<any> = [];
  sub: any;
  rsub: any;

  constructor(private contentService: ContentService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.contentService.assetsSearch.subscribe((resp) => {
      this.assets = resp;
    });

    this.rsub = this.route.params.subscribe((val) => {
      this.searchString = val['id'];
      this.contentService.searchAssets(this.searchString);
    });
  }

  ngOnDestroy() {
    this.rsub.unsubscribe();
    this.sub.unsubscribe();
  }
}
