import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-trail-badge',
  templateUrl: './trail-badge.component.html',
  styleUrls: ['./trail-badge.component.scss'],
})
export class TrailBadgeComponent implements OnInit {
  @Input() label: string;
  @Input() state: 'active' | 'normal' = 'normal';
  @Input() shape: 'round' | null = null;

  constructor() {}

  ngOnInit(): void {}
}
