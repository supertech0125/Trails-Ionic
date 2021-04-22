import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trail-card-user-item',
  templateUrl: './trail-card-user-item.component.html',
  styleUrls: ['./trail-card-user-item.component.scss'],
})
export class TrailCardUserItemComponent {
  @Input() trail: any = {};
  @Output() viewAllTrailsEv = new EventEmitter<any>();
}
