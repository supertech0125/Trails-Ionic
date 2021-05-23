import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-trail-card-distance-item',
  templateUrl: './trail-card-distance-item.component.html',
  styleUrls: ['./trail-card-distance-item.component.scss'],
})
export class TrailCardDistanceItemComponent implements OnInit {
  @Input() sumOfAllDistance: number;
  @Input() verified: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
