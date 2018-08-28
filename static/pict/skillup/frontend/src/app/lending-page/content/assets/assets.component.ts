import { Component, OnInit, Input, NgZone, OnChanges } from '@angular/core';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit, OnChanges {

  @Input() assets: Array<any> = [];
  @Input() groups: Array<any> = [];

  adaptedGroups: Array<any> = [];

  constructor(private zone: NgZone) { }

  ngOnInit() {

  }
  ngOnChanges(ev) {
    if (ev.assets) {
      console.log(ev.assets.currentValue);
    }
    if (ev.groups) {
      setTimeout(() => {
        this.adaptedGroups = ev.groups.currentValue.map((el, i) => {
          el['active'] = i == 0;
          return el;
        })
      }, 1000);
    }
  }

  toggleItemAccordion(group) {
    group.active = !group.active;
  }

}
