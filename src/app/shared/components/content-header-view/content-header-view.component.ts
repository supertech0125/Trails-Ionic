import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-content-header-view',
  templateUrl: './content-header-view.component.html',
  styleUrls: ['./content-header-view.component.scss'],
})
export class ContentHeaderViewComponent implements OnInit {
  @Input() title: string;
  @Input() subTitle: string;

  constructor() {}

  ngOnInit(): void {}
}
