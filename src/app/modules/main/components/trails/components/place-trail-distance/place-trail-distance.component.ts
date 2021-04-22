import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-place-trail-distance',
  templateUrl: './place-trail-distance.component.html',
  styleUrls: ['./place-trail-distance.component.scss'],
})
export class PlaceTrailDistanceComponent implements OnInit {
  @Input() distance: number;

  constructor() {}

  ngOnInit(): void {}
}
