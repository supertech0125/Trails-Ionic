import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalController } from '@ionic/angular';

import isEmpty from 'lodash-es/isEmpty';

import { Subject, Subscription } from 'rxjs';
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
import { MainState } from '../../../store/main.reducer';
import { PubsubService } from 'src/app/shared/services/pubsub.service';
import { trailsSelector, trailsDataSelector } from '../../../store/Trails/Trails.selector';

@Component({
  selector: 'app-view-all-trails',
  templateUrl: './view-all-trails.component.html',
  styleUrls: ['./view-all-trails.component.scss'],
})
export class ViewAllTrailsComponent implements OnInit {
  showPlaces: boolean;
  willResetNgRX: boolean = false;

  @Input() trail: any;
  placesArr: any[] = [];
  trailsArr: any[] = [];
  fakeArr: any[] = [];

  $unsubscribe = new Subject<any>();
  $trailsSubscribe = new Subscription();
  // $placesSubscribe = new Subscription();

  constructor(
    private modalController: ModalController,
    private mainService: MainService,
    private store: Store<MainState>,
    private formatter: FormatterServices,
    private dataLoader: DataLoaderService,
    private storage: LocalStorageService,
    private pubsub: PubsubService,
  ) {
    this.fakeArr = Array.from({
      length: 10,
    });

    this.$trailsSubscribe = this.pubsub.$sub('TRAIL_STEP_TRAILS_SAVED', (data) => {
      if (data.event === 'bookmark') {
        const temp: any = [...this.trailsArr];

        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id * 1 === data.data.id * 1) {
            temp[i] = {...temp[i], isbookMarked: data.data.isBookMarked};
            break;
          }
        }

        this.trailsArr = temp;
      }
    });
    
    // this.$placesSubscribe = this.pubsub.$sub('TRAIL_STEP_PLACES_SAVED', (data) => {
    //   if (data.event === 'bookmark') {
    //     const temp: any = [...this.trailsArr];

    //     for (let i = 0; i < temp.length; i++) {
    //       for (let j = 0; j < temp[i].trailPlace.length; j++) {
    //         if (temp[i].trailPlace[j].placeId * 1 === data.data.id * 1) {
    //           temp[i].trailPlace[j].isBookMarked = data.data.isBookMarked;
    //           break;
    //         }
    //       }
    //     }

    //     this.trailsArr = temp;
    //   }
    // });
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
    // this.$placesSubscribe.unsubscribe();
    this.$trailsSubscribe.unsubscribe();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
