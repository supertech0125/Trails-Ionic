import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import isEmpty from 'lodash-es/isEmpty';

@Component({
  selector: 'app-trail-rating-badge',
  templateUrl: './trail-rating-badge.component.html',
  styleUrls: ['./trail-rating-badge.component.scss'],
})
export class TrailRatingBadgeComponent implements OnInit {
  @Input() expand: 'block' | 'full' | undefined;
  @Input() fill: 'clear' | 'default' | 'outline' | 'solid' | undefined;
  @Input() rating: string | null | undefined;
  @Input() color: string | 'white';
  @Input() iconName: string | 'star';

  @Output() ratingClick = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    if (isEmpty(this.iconName)) {
      this.iconName = 'star';
    }
  }
}
