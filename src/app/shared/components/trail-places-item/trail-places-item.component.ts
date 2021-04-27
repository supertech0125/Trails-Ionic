import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isEmpty, isArray } from 'lodash-es';

@Component({
  selector: 'app-trail-places-item',
  templateUrl: './trail-places-item.component.html',
  styleUrls: ['./trail-places-item.component.scss'],
})
export class TrailPlacesItemComponent implements OnInit {
  @Input() place: any = {};
  placeType: string = '';

  @Output() placeClick = new EventEmitter<any>();
  @Output() placeDeleteClick = new EventEmitter<any>();
  @Output() placeReOrderClick = new EventEmitter<any>();

  @Input() showCheckbox: boolean | false;
  @Input() showDelete: boolean | false;
  @Input() showReOrder: boolean | false;
  @Input() showDistance: boolean | false;
  @Input() autoDistance: boolean | false;
  @Input() showIndex: boolean | false;

  constructor() {}

  ngOnInit(): void {
    if (this.place) {
      if (!isEmpty(this.place.types) && !isArray(this.place.types)) {
        this.placeType = this.place.types.type;
      } else if (!isEmpty(this.place.type) && isArray(this.place.types)) {
        this.placeType = this.place.type;
      }
      else this.placeType = this.place.type;
    }
  }

  deletePlace(event: any) {
    console.log('deletePlace: ');
    event.stopImmediatePropagation();

    this.placeDeleteClick.emit(event);
  }

  clickPlace(event: any) {
    console.log('clickPlace: ');
    event.stopImmediatePropagation();

    this.placeClick.emit(event);
  }

  reOrderPlace(event: any) {
    console.log('reOrderPlace: ');
    // event.stopImmediatePropagation();

    this.placeReOrderClick.emit(event);
  }
}
