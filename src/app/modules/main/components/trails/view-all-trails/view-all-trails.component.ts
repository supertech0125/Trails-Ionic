import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import isEmpty from 'lodash-es/isEmpty';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  MAX_ITEMS_PER_PAGE,
  TRAIL_CURRENT_USER_GEOLOCATION,
  TRAIL_STEP_ALL_USERS_TRAILS,
} from 'src/app/shared/constants/utils';
import { DataLoaderService } from 'src/app/shared/services/data-loader.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

import { FormatterServices } from '../../../services/formatter.service';
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-view-all-trails',
  templateUrl: './view-all-trails.component.html',
  styleUrls: ['./view-all-trails.component.scss'],
})
export class ViewAllTrailsComponent implements OnInit {
  showPlaces: boolean;

  @Input() trail: any;
  placesArr: any[] = [];
  trailsArr: any[] = [];
  fakeArr: any[] = [];

  $unsubscribe = new Subject<any>();

  constructor(
    private modalController: ModalController,
    private mainService: MainService,
    private formatter: FormatterServices,
    private dataLoader: DataLoaderService,
    private storage: LocalStorageService
  ) {
    this.fakeArr = Array.from({
      length: 10,
    });
  }

  ngOnInit(): void {
    this.showPlaces = false;
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);

    if (this.trail) {
      const user = this.trail.trailUser;

      let params: any = {
        PageSize: MAX_ITEMS_PER_PAGE,
        Sort: 'distance',
      };

      if (coordinates) {
        params = {
          ...params,
          Lat: coordinates.latitude,
          Long: coordinates.longitude,
        };
      }

      this.mainService
        .getTrailsByUserId(user.userId, params)
        .pipe(takeUntil(this.$unsubscribe))
        .toPromise()
        .then(
          (trails: any) => {
            console.log('view-all-trails: ', trails)
            const trailsArr = trails.data;
            if (!isEmpty(trailsArr)) {
              const formatterTrails = this.formatter.formatTrails(trailsArr);
              this.trailsArr = formatterTrails;

              this.dataLoader.setAllUsersTrails(user.userId, trails);
              this.showPlaces = true;
            } else {
              this.showPlaces = false;
            }
          },
          () => {
            const allUsersArrItem = this.storage.getItem(
              TRAIL_STEP_ALL_USERS_TRAILS
            );
            const result = allUsersArrItem.find(
              (item) => item.userId === user.userId
            );
            if (result && result.data) {
              const trailsArr = result.data;
              const formatterTrails = this.formatter.formatTrails(trailsArr);
              this.trailsArr = formatterTrails;

              this.showPlaces = true;
            } else {
              this.showPlaces = false;
            }
          }
        );
    }
  }

  ionViewWillLeave() {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
