import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-trail-theme',
  templateUrl: './trail-theme.component.html',
  styleUrls: ['./trail-theme.component.scss'],
})
export class TrailThemeComponent implements OnInit {
  @Input() trailTheme: string;

  trailThemeArr: any[];

  constructor() {}

  ngOnInit(): void {
    if (this.trailTheme !== null || this.trailTheme !== '') {
      this.trailThemeArr = this.trailTheme.split('-');
    }
  }
}
