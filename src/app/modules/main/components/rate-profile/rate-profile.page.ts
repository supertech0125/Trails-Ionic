import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { ToastService } from './../../../../shared/services/toast.service';
import { LocalStorageService } from './../../../../shared/services/local-storage.service';
import { FormatterServices } from './../../services/formatter.service';
import { MainService } from '../../services/main.service';

import {
  MAX_ITEMS_PER_PAGE,
  PLACE_TEXT,
  TRAIL_CURRENT_USER_GEOLOCATION,
  TRAIL_STEP_PLACES,
  TRAIL_STEP_TRAILS,
  TRAIL_TEXT,
  TRAIL_CURRENT_USER,
} from './../../../../shared/constants/utils';

import { ITrailRate, ITrailsResponse, Trails } from '../../models/trails.model';
import {
  IPlaceQueryParams,
  IPlaceRate,
  IPlacesResponse,
  Places,
} from './../../models/places.model';
import { IPlacesRatings } from '../../models/ratings.model';
import { ITrailQueryParams } from './../../models/trails.model';
import { DataLoaderService } from 'src/app/shared/services/data-loader.service';
import { IGeoServiceLatLng } from 'src/app/shared/services/geolocation.service';

@Component({
  selector: 'app-rate-profile',
  templateUrl: './rate-profile.page.html',
  styleUrls: ['./rate-profile.page.scss'],
})
export class RateProfilePage implements OnInit, OnDestroy {
  feedbackMessage = '';
  maxNumberOfCharacters = 250;
  numberOfCharacters = 0;

  action: string;
  placeId: string;
  trailId: string;
  rating: number;

  place: Places = undefined;
  trail: Trails = undefined;
  showContent = false;

  isAlreadyRated: boolean = false;

  trailPlaceRating: IPlacesRatings = {
    averageRating: 0,
    reviewCount: 0,
    reviews: null,
  };

  currentCoords: IGeoServiceLatLng = {
    latitude: 0,
    longitude: 0,
  };

  attachmentsArr: any[] = [];
  private unsubscribe$: Subscription = new Subscription();
  private unsubscribeTrail: Subscription = new Subscription();
  private unsubscribePlace: Subscription = new Subscription();

  @ViewChild('feedback') feedBackInput: ElementRef;

  DEFAULT_SUCCESS_HEADER = 'THANK YOU';
  DEFAULT_SUCCESS_MSG =
    'Thank you for your valuable feedback! This will help guide other users and our choice of places to add to our platform.';

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private toastService: ToastService,
    private storage: LocalStorageService,
    private formatter: FormatterServices,
    private mainService: MainService,
    private dataLoader: DataLoaderService
  ) {
    this.route.queryParams.subscribe((params) => {
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

  ngOnInit() {
    this.currentCoords = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    this.resetForm();
  }

  ngOnDestroy() {
    this.unsubscribe$.unsubscribe();
    this.unsubscribePlace.unsubscribe();
    this.unsubscribeTrail.unsubscribe();
  }

  ionViewWillEnter() {
    this.resetForm();
  }

  ionViewWillLeave() {
    this.resetForm();
  }

  onKeyUp(event: any): void {
    this.numberOfCharacters = event.target.value.length;
    if (this.numberOfCharacters > this.maxNumberOfCharacters) {
      event.target.value = event.target.value.slice(
        0,
        this.maxNumberOfCharacters
      );
      this.numberOfCharacters = this.maxNumberOfCharacters;
    }
  }

  dismiss() {
    this.navCtrl.back();
  }

  logRatingChange(rating) {
    if (!this.showContent) {
      return;
    }

    this.rating = rating;
  }

  onViewRatings() {
    this.navCtrl.navigateForward('/main/ratings-profile', {
      queryParams: {
        action: this.action,
        placeId: this.placeId,
        trailId: this.trailId,
      },
    });
  }

  async submitRate() {
    if (this.action === TRAIL_TEXT.toLowerCase()) {
      this.rateTrail();
    } else if (this.action === PLACE_TEXT.toLowerCase()) {
      this.ratePlace();
    }
  }

  private async ratePlace() {
    const loading = await this.loadingController.create();
    const parseUser = JSON.parse(localStorage.getItem(TRAIL_CURRENT_USER));

    this.isAlreadyRated = false;
    for (let i = 0; i < this.trailPlaceRating.reviews?.length; i++) {
      if (this.trailPlaceRating.reviews[i].id === parseUser.id) {
        this.isAlreadyRated = true;
        break;
      }
    }

    const rating: IPlaceRate = {
      placeId: Number(this.placeId) || this.place.id,
      comment: this.feedbackMessage,
      rating: this.rating,
    };

    if (!this.isAlreadyRated) {
      loading.present();
      this.mainService
        .ratePlace(rating)
        .pipe(take(1))
        .toPromise()
        .then(
          (response: any) => {
            console.log('ratePlace: ', response);
            loading.dismiss();
            if (response && response.statusCode === 200) {
              this.resetForm();

              this.refreshPlace(
                this.currentCoords.latitude,
                this.currentCoords.longitude
              );

              this.toastService.showAlertMessage(
                this.DEFAULT_SUCCESS_HEADER,
                this.DEFAULT_SUCCESS_MSG,
                () => {
                  this.dismiss();
                }
              );
            }
          },
          (err) => {
            console.log('error: ', err);
            loading.dismiss();
            if (err) {
              const error = err.error;
              if (error && error.message) {
                return this.toastService.showWarning('WARNING!', error.message);
              }
            }
          }
        );
    }
    else {
      const confirm_result = await this.toastService.showConfirm('Would you like to replace your old review?', '');
      if (confirm_result) {
        if (this.rating == 0) {
          this.toastService.showWarning('WARNING!', 'You can only give ratings from 1-5.');
        }
        else {
          loading.present();
          this.mainService
            .updateRatePlace(rating)
            .pipe(take(1))
            .toPromise()
            .then(
              (response: any) => {
                console.log('ratePlace: ', response);
                loading.dismiss();
                if (response && response.statusCode === 200) {
                  this.resetForm();

                  this.refreshPlace(
                    this.currentCoords.latitude,
                    this.currentCoords.longitude
                  );

                  this.toastService.showAlertMessage(
                    this.DEFAULT_SUCCESS_HEADER,
                    this.DEFAULT_SUCCESS_MSG,
                    () => {
                      this.dismiss();
                    }
                  );
                }
              },
              (err) => {
                console.log('error: ', err);
                loading.dismiss();
                if (err) {
                  const error = err.error;
                  if (error && error.message) {
                    return this.toastService.showWarning('WARNING!', error.message);
                  }
                }
              }
            );
        }
      }
    }
  }

  private initPlace() {
    if (this.placeId) {
      this.unsubscribePlace = this.mainService.getPlace(this.placeId).subscribe(
        (resp: any) => {
          if (resp) {
            const place = this.formatter.formatPlace(resp);
            this.place = place;
          }

          this.showContent = true;
          this.unsubscribePlace.unsubscribe();
        },
        () => {
          const placesData: IPlacesResponse = this.storage.getItem(
            TRAIL_STEP_PLACES
          );
          const result = placesData.data.find(
            (item) => item.id === Number(this.placeId)
          );
          if (result) {
            const place = this.formatter.formatPlace(result);
            this.place = place;
          }

          this.showContent = true;
          this.unsubscribePlace.unsubscribe();
        }
      );
    }
  }

  private initPlaceRatings() {
    this.unsubscribe$ = this.mainService
      .ratingPlace(this.placeId)
      .subscribe((response: IPlacesRatings) => {
        if (response) {
          this.trailPlaceRating = response;
          console.log('this.trailPlaceRating: ', this.trailPlaceRating);
        }
      });
  }

  private async rateTrail() {
    const loading = await this.loadingController.create();
    // loading.present();
    const parseUser = JSON.parse(localStorage.getItem(TRAIL_CURRENT_USER));

    this.isAlreadyRated = false;
    for (let i = 0; i < this.trailPlaceRating.reviews?.length; i++) {
      if (this.trailPlaceRating.reviews[i].id === parseUser.id) {
        this.isAlreadyRated = true;
        break;
      }
    }

    const rating: ITrailRate = {
      trailId: Number(this.trailId) || this.trail.id,
      comment: this.feedbackMessage,
      rating: this.rating,
    };

    if (!this.isAlreadyRated) {
      loading.present();
      this.mainService
        .rateTrail(rating)
        .pipe(take(1))
        .toPromise()
        .then(
          (response: any) => {
            console.log('rateTrail: ', response);
            loading.dismiss();
            if (response && response.statusCode === 200) {
              this.resetForm();
              this.refreshTrails(
                this.currentCoords.latitude,
                this.currentCoords.longitude
              );

              this.toastService.showAlertMessage(
                this.DEFAULT_SUCCESS_HEADER,
                this.DEFAULT_SUCCESS_MSG,
                () => {
                  this.dismiss();
                }
              );
            }
          },
          (err) => {
            console.log('error: ', err);
            loading.dismiss();
            if (err) {
              const error = err.error;
              if (error && error.message) {
                return this.toastService.showWarning('WARNING!', error.message);
              }
            }
          }
        );
    }
    else {
      const confirm_result = await this.toastService.showConfirm('Would you like to replace your old review?', '');
      if (confirm_result) {
        if (this.rating == 0) {
          this.toastService.showWarning('WARNING!', 'You can only give ratings from 1-5.');
        }
        else {
          loading.present();
          this.mainService
            .updateRateTrail(rating)
            .pipe(take(1))
            .toPromise()
            .then(
              (response: any) => {
                console.log('rateTrail: ', response);
                loading.dismiss();
                if (response && response.statusCode === 200) {
                  this.resetForm();

                  this.refreshTrails(
                    this.currentCoords.latitude,
                    this.currentCoords.longitude
                  );

                  this.toastService.showAlertMessage(
                    this.DEFAULT_SUCCESS_HEADER,
                    this.DEFAULT_SUCCESS_MSG,
                    () => {
                      this.dismiss();
                    }
                  );
                }
              },
              (err) => {
                console.log('error: ', err);
                loading.dismiss();
                if (err) {
                  const error = err.error;
                  if (error && error.message) {
                    return this.toastService.showWarning('WARNING!', error.message);
                  }
                }
              }
            );
        }
      }
    }
  }

  private initTrails() {
    if (this.trailId) {
      this.unsubscribeTrail = this.mainService.getTrail(this.trailId).subscribe(
        (resp: any) => {
          if (resp) {
            const trails = this.formatter.formatTrails([resp]);
            this.trail = trails[0];

            this.showContent = true;
            this.unsubscribeTrail.unsubscribe();
          }
        },
        () => {
          const trailsData: ITrailsResponse = this.storage.getItem(
            TRAIL_STEP_TRAILS
          );
          const result = trailsData.data.find(
            (item) => item.id === Number(this.trailId)
          );
          if (result) {
            const trails = this.formatter.formatTrails([result]);
            this.trail = trails[0];
          }
          this.showContent = true;
          this.unsubscribeTrail.unsubscribe();
        }
      );
    }
  }

  private initTrailsRatings() {
    this.unsubscribe$ = this.mainService
      .ratingTrail(this.trailId)
      .subscribe((response: IPlacesRatings) => {
        if (response) {
          this.trailPlaceRating = response;
          console.log('this.trailPlaceRating: ', this.trailPlaceRating);
        }
      });
  }

  private resetForm() {
    console.log('resetForm');
    this.feedbackMessage = '';
    this.rating = 0;
  }

  private refreshTrails(latitude?: number, longitude?: number) {
    const params: ITrailQueryParams = {};

    if (latitude && longitude) {
      params.Lat = latitude;
      params.Long = longitude;
    }
    params.PageIndex = 1;
    params.PageSize = MAX_ITEMS_PER_PAGE;
    params.Sort = 'distance';

    this.dataLoader.getAllTrails(params);
  }

  private refreshPlace(latitude?: number, longitude?: number) {
    const params: IPlaceQueryParams = {};
    if (latitude && longitude) {
      params.Lat = latitude;
      params.Long = longitude;
    }

    params.PageIndex = 1;
    params.PageSize = MAX_ITEMS_PER_PAGE;
    params.Sort = 'distance';

    this.dataLoader.getAllPlaces(params);
  }
}
