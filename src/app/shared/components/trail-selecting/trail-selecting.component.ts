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

  interfaceOptions: {
    cssClass: 'trail-select-popover';
  };

  constructor() {

  }

  ngOnInit(): void { }

  changeFilter(item: string) {
    let filter = this.value;
    let index = filter ? filter.indexOf(item) : -1;
    if (this.action === 'placeType' || this.action === 'placeSubType' || this.action === 'when' || this.action === 'who') {
      (index + 1) ? filter.splice(index, 1) : filter.push(item);
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

    this.changeItems.emit({ data: filter, action: this.action });
  }
}
