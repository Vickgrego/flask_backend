import { Component, Input, Output, EventEmitter } from '@angular/core';

class ListBoxOptions {
  keyName: string;
  titleName: string;
}

@Component({
  selector: 'app-list-box',
  templateUrl: './list-box.component.html',
  styleUrls: ['./list-box.component.scss']
})
export class ListBoxComponent {
  @Input() valueList: Array<any>;
  @Input() optionList: Array<any>;
  @Input() options: ListBoxOptions;
  @Input() leftLabel: string;
  @Input() rightLabel: string;

  @Output() addValues = new EventEmitter<Array<any>>();
  @Output() removeValues = new EventEmitter<Array<any>>();

  valueListSelected: Array<any> = new Array();
  optionListSelected: Array<any> = new Array();

  constructor() {
    // this.valueList = [{id: 1, name: 'one'},{id: 2, name: 'two'}];
    // this.optionList = [{id: 3, name: 'three'},{id: 4, name: 'four'},{id: 5, name: 'five'}];
  }

  add(event) {
    event.preventDefault();
    event.stopPropagation();

    this.valueList.push.apply(this.valueList, this.optionListSelected);
    for(let i in this.optionListSelected) {
      this.optionList.splice(this.optionList.indexOf(this.optionListSelected[i]), 1);
    }
  }

  addAll(event) {
    event.preventDefault();
    event.stopPropagation();

    this.valueList.push.apply(this.valueList, this.optionList);
    this.optionList.splice(0);
  }

  remove(event) {
    event.preventDefault();
    event.stopPropagation();

    this.optionList.push.apply(this.optionList, this.valueListSelected);
    for(let i in this.valueListSelected) {
      this.valueList.splice(this.valueList.indexOf(this.valueListSelected[i]), 1);
    }
  }

  removeAll(event) {
    event.preventDefault();
    event.stopPropagation();

    this.optionList.push.apply(this.optionList, this.valueList);
    this.valueList.splice(0);
  }

  valueListChange(event) {
    this.valueListSelected.splice(0);
    this.valueListSelected.push.apply(this.valueListSelected, event);
  }

  optionListChange(event) {
    this.optionListSelected.splice(0);
    this.optionListSelected.push.apply(this.optionListSelected, event);
  }

}
