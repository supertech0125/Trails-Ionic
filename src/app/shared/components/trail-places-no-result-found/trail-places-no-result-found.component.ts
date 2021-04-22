import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-trail-places-no-result-found',
  templateUrl: './trail-places-no-result-found.component.html',
  styleUrls: ['./trail-places-no-result-found.component.scss'],
})
export class TrailPlacesNoResultFoundComponent implements OnInit {
  @Input() action: string;
  @Input() caption: string;
  @Input() subCaption: string;

  constructor() {}

  ngOnInit(): void {}
}
