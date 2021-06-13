import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-trail-selecting',
  templateUrl: './trail-selecting.component.html',
  styleUrls: ['./trail-selecting.component.scss'],
})
export class TrailSelectingComponent implements OnInit {
  @Input() action: string;
  @Input() items: string[];
  @Input() value: string[];
  @Input() size: string;
  @Input() fontSize: string;

  @Output() changeItems = new EventEmitter<any>();

  isBetweenClass: boolean = false;

  interfaceOptions: {
    cssClass: 'trail-select-popover';
  };

  constructor() {

  }

  ngOnInit(): void { 
    if(this.action === 'placeType' || this.action === 'placeSubType' || this.action === 'theme') {
      this.isBetweenClass = false;
    }
    else this.isBetweenClass = true;
  }

  changeFilter(item: any) {
    let filter = this.value;
    let changedParentData: any = null;
    let index = filter ? filter.indexOf(item) : -1;
    if (this.action === 'placeType' || this.action === 'placeSubType' || this.action === 'when' || this.action === 'who' || this.action === 'theme') {
      (index + 1) ? filter.splice(index, 1) : filter.push(item);
      
      /* 
        When parent is selected/deselected, selection status of its child should be also changed.
      */

      // when click the 'restaurant' item in Type
      if(this.action === 'placeType' && item * 1 === 1) { // item * 1 === 1 means selected item is restaurant.
        if(index > -1) {
          changedParentData = {
            flag: true,  // true means restaurant will be deselected and so all cuisines should be deselected.
          }
        }
        else {
          changedParentData = {
            flag: false,
          }
        }
      }

      // When theme is changed
      if(this.action === 'theme') {
        if(index > -1) changedParentData = {id: item, flag: true};
        else changedParentData = {id: item, flag: false};
      }
    }
    else if(this.action === 'trail') {
      if(index + 1) filter.splice(index, 1);
      else {
        if(item === 'verified') filter.push(item);
        else {
          if(filter.length > 1 || (filter.indexOf('verified')+1)) {
            filter = [item, 'verified']
          }
          else filter = [item];
        }
      }
    }
    else if(this.action === 'place' || this.action === 'addTrailStep') {
      if(index + 1) filter.splice(index, 1);
      else {
        filter = [item]
      }
    }

    this.changeItems.emit({ data: filter, action: this.action, changedParentData: changedParentData });
  }
}
