import { Component, OnInit, Input, NgZone } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss']
})
export class AssetCardComponent implements OnInit {
  srcUrl: any;
  encodedShareUrl;
  showShareOptions: boolean = false;
  showYouTubeVideo: boolean = false;
  shareOptions: Array<any> = [
    {name: 'facebook', href: "https://www.facebook.com/sharer/sharer.php?u="},
    {name: 'twitter', href: "https://twitter.com/home?status="},
    {name: 'mail', href: "mailto:?&subject="}
  ];
  scrollTop: any;

  @Input() asset;

  constructor(private santizer: DomSanitizer, private zone: NgZone) {}

  ngOnInit() {
  }

  showYouTube(event) {
    event.stopPropagation();
    event.preventDefault();
    this.showYouTubeVideo = true;
    document.body.getElementsByClassName('wrapper-holder')[0].classList.add('locked');
  }
  hideYouTube() {
    this.showYouTubeVideo = false;
    document.body.getElementsByClassName('wrapper-holder')[0].classList.remove('locked');
  }

  ngOnChanges(ev) {
    let thumbNailString, resultedString;
    let asset = ev.asset.currentValue;

    thumbNailString = asset.thumbNailData;

    if (asset.assetType == "URL") {
      resultedString = thumbNailString && thumbNailString.indexOf('embed') >= 0 ? thumbNailString : false;
    } else {
      resultedString = 'data:image/png;base64,' + thumbNailString;
    }

    this.srcUrl = resultedString ? this.santizer.bypassSecurityTrustResourceUrl(resultedString) : false;

    let shareString = asset.shortUrl || "";

    this.shareOptions[2].href = this.shareOptions[2].href + 'Marquis-Larson - '+asset.name+" Link&body="+asset.name + " ";

    this.encodedShareUrl = encodeURIComponent(shareString)
  }

  toggleOptions() {
    this.showShareOptions = !this.showShareOptions;
      if (this.showShareOptions) {
        // this.scrollTop = document.body.getElementsByClassName('wrapper-holder')[0].scrollTop;
        document.body.getElementsByClassName('wrapper-holder')[0].classList.add('locked');
      } else {
        document.body.getElementsByClassName('wrapper-holder')[0].classList.remove('locked');
        // document.body.getElementsByClassName('wrapper-holder')[0] = this.scrollTop;
      }

  }

  onYouTubeIframeLoaded() {

  }

}
