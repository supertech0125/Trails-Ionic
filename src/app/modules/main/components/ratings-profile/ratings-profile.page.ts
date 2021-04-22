import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import find from 'lodash-es/find';
import isEmpty from 'lodash-es/isEmpty';
import orderBy from 'lodash-es/orderBy';

import { Places } from '../../models/places.model';
import { Trails } from '../../models/trails.model';
import { MainService } from '../../services/main.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import {
  DEFAULT_DISTANCE_DECIMAL,
  TRAIL_STEP_PLACES,
  TRAIL_STEP_TRAILS,
} from 'src/app/shared/constants/utils';
import { FormatterServices } from '../../services/formatter.service';
import { IPlacesRatings } from '../../models/ratings.model';

@Component({
  selector: 'app-ratings-profile',
  templateUrl: './ratings-profile.page.html',
  styleUrls: ['./ratings-profile.page.scss'],
})
export class RatingsProfilePage implements OnInit {
  action: string;
  placeId: string;
  trailId: string;
  rating: string;

  place: Places;
  trail: Trails;

  showContent: boolean;

  ratingsArr: any[] = [];
  fakeArr: any[] = [];

  trailPlaceRating: IPlacesRatings = {
    averageRating: 0,
    reviewCount: 0,
    reviews: null,
  };
  unsubscribe$ = new Subject<any>();
  unsubscribeTrail = new Subject<any>();
  unsubscribePlace = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private mainService: MainService,
    private storage: LocalStorageService,
    private formatter: FormatterServices
  ) {
    this.fakeArr = Array.from({
      length: 10,
    });

    this.route.queryParams.subscribe((params) => {
      console.log('params: ', params);

      if (params && params.placeId) {
        this.placeId = params.placeId;
      }

      if (params && params.trailId) {
        this.trailId = params.trailId;
      }

      if (params && params.action) {
        this.action = params.action;

        if (this.action === 'place') {
          this.initPlace();
          this.initPlaceRatings();
        } else if (this.action === 'trail') {
          this.initTrails();
          this.initTrailsRatings();
        }
      }
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {}

  ionViewWillLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.unsubscribePlace.next();
    this.unsubscribePlace.complete();

    this.unsubscribeTrail.next();
    this.unsubscribeTrail.complete();
  }

  dismiss() {
    this.navCtrl.back();
  }

  doRefresh(event: any) {
    if (this.action === 'place') {
      this.initPlaceRatings(event);
    } else if (this.action === 'trail') {
      this.initTrailsRatings(event);
    }
  }

  private initPlace() {
    const placesArr: any[] = this.storage.getItem(TRAIL_STEP_PLACES);
    if (this.placeId) {
      const result = find(placesArr, { placeId: this.placeId });
      if (result) {
        const place = this.formatter.formatPlace(result);
        this.place = place;
      }
    }
  }

  private initPlaceRatings(refresh?: any) {
    this.showContent = false;
    this.mainService
      .ratingPlace(this.placeId)
      .pipe(takeUntil(this.unsubscribePlace))
      .subscribe(
        (response: IPlacesRatings) => {
          console.log('initPlaceRatings: ', response);
          if (response) {
            this.trailPlaceRating = response;
            this.rating = Number(this.trailPlaceRating.averageRating).toFixed(
              DEFAULT_DISTANCE_DECIMAL
            );

            if (!isEmpty(response.reviews)) {
              const reviews = response.reviews;
              this.ratingsArr = orderBy(reviews, ['timestamp'], ['desc']);
            }
          }

          this.showContent = true;
          if (refresh && refresh.target) {
            refresh.target.disabled = true;
            refresh.target.complete();

            setTimeout(() => {
              refresh.target.disabled = false;
            }, 100);
          }
        },
        () => {
          this.showContent = true;
          if (refresh && refresh.target) {
            refresh.target.disabled = true;
            refresh.target.complete();

            setTimeout(() => {
              refresh.target.disabled = false;
            }, 100);
          }
        }
      );
  }

  private initTrails() {
    const trailsArr: any[] = this.storage.getItem(TRAIL_STEP_TRAILS);
    if (this.trailId) {
      const result = find(trailsArr, { id: Number(this.trailId) });
      if (result) {
        const trails = this.formatter.formatTrails([result]);
        this.trail = trails[0];
      }
    }
  }

  private initTrailsRatings(refresh?: any) {
    this.showContent = false;
    this.mainService
      .ratingTrail(this.trailId)
      .pipe(takeUntil(this.unsubscribeTrail))
      .subscribe(
        (response: IPlacesRatings) => {
          if (response) {
            console.log('this.trailPlaceRating: ', this.trailPlaceRating);
            this.trailPlaceRating = response;
            this.rating = Number(response.averageRating).toFixed(
              DEFAULT_DISTANCE_DECIMAL
            );

            if (!isEmpty(response.reviews)) {
              const reviews = response.reviews;
              this.ratingsArr = orderBy(reviews, ['timestamp'], ['desc']);
            }
          }
          this.showContent = true;

          if (refresh && refresh.target) {
            refresh.target.disabled = true;
            refresh.target.complete();

            setTimeout(() => {
              refresh.target.disabled = false;
            }, 100);
          }
        },
        () => {
          this.showContent = true;

          if (refresh && refresh.target) {
            refresh.target.disabled = true;
            refresh.target.complete();

            setTimeout(() => {
              refresh.target.disabled = false;
            }, 100);
          }
        }
      );
  }
}
