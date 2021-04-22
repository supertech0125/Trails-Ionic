import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-card-map-marker',
  templateUrl: './card-map-marker.component.html',
  styleUrls: ['./card-map-marker.component.scss'],
})
export class CardMapMarkerComponent implements OnInit {
  @Input() label: string | null;

  constructor() {}

  ngOnInit(): void {}
}
