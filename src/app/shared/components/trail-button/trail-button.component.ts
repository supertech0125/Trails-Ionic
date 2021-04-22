import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-trail-button',
  templateUrl: './trail-button.component.html',
  styleUrls: ['./trail-button.component.scss'],
})
export class TrailButtonComponent implements OnInit {
  @Input() label: string;
  @Input() type: string;
  @Input() fill: 'clear' | 'outline' | 'solid';
  @Input() disabled: boolean;

  constructor() {}

  ngOnInit(): void {}
}
