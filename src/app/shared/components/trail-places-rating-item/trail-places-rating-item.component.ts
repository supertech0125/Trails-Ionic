import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { IPlacesRatings } from 'src/app/modules/main/models/ratings.model';
import { DEFAULT_DISTANCE_DECIMAL } from '../../constants/utils';

@Component({
  selector: 'app-trail-places-rating-item',
  templateUrl: './trail-places-rating-item.component.html',
  styleUrls: ['./trail-places-rating-item.component.scss'],
})
export class TrailPlacesRatingItemComponent implements OnInit, OnChanges {
  @Input() action: 'place' | 'trail';

  @Input() place: any = {};
  @Input() trail: any = {};

  ratingName: string;

  @Input() trailPlaceRating: IPlacesRatings = {
    averageRating: 0,
    reviewCount: 0,
    reviews: [],
  };

  @Output() viewRatingClick = new EventEmitter<any>();

  reviewCount: number;
  ratingCount: string;

  constructor() {}

  ngOnInit(): void {
    this.reviewCount = this.trailPlaceRating.reviewCount;
    this.ratingCount = Number(this.trailPlaceRating.averageRating).toFixed(
      DEFAULT_DISTANCE_DECIMAL
    );

    if (this.action === 'place') {
      if (this.place) {
        this.ratingName = this.place.name;
      }
    } else {
      if (this.trail) {
        this.ratingName = this.trail.time;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'trailPlaceRating': {
            this.reviewCount = this.trailPlaceRating.reviewCount;
            this.ratingCount = Number(
              this.trailPlaceRating.averageRating
            ).toFixed(DEFAULT_DISTANCE_DECIMAL);

            if (this.action === 'place') {
              if (this.place) {
                this.ratingName = this.place.name;
              }
            } else {
              if (this.trail) {
                this.ratingName = this.trail.time;
              }
            }
          }
        }
      }
    }
  }
}
