import { Component, Input, OnChanges } from '@angular/core';
import { IPlaceRatingsReview } from 'src/app/modules/main/models/ratings.model';
import { DEFAULT_DISTANCE_DECIMAL } from '../../constants/utils';

@Component({
  selector: 'app-trail-rating-comments',
  templateUrl: './trail-rating-comments.component.html',
  styleUrls: ['./trail-rating-comments.component.scss'],
})
export class TrailRatingCommentsComponent implements OnChanges {
  @Input() review: IPlaceRatingsReview = null;

  rating: string;

  constructor() {
    if (this.review) {
      this.rating = Number(this.review.rating).toFixed(
        DEFAULT_DISTANCE_DECIMAL
      );
    }
  }

  ngOnChanges(): void {
    if (this.review) {
      this.rating = Number(this.review.rating).toFixed(
        DEFAULT_DISTANCE_DECIMAL
      );
    }
  }
}
