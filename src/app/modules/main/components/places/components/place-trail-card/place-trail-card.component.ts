import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { isEmpty, isArray } from 'lodash-es';

import { Places } from '../../../../models/places.model';
import { MainState } from 'src/app/modules/main/store/main.reducer';
import { CommonService } from 'src/app/shared/services/common.service';
import { PubsubService } from 'src/app/shared/services/pubsub.service';

import {
  TRAIL_CURRENT_USER_PROFILE,
  MAX_ITEMS_PER_PAGE,
  ACCOUNTS_PAGE_TABS,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from './../../../../../../shared/constants/utils';
import { LocalStorageService } from './../../../../../../shared/services/local-storage.service';
import {
  BookmarkPlace,
  UnbookmarkPlace,
} from 'src/app/modules/main/store/BookmarkPlaces/BookmarkPlaces.action';

@Component({
  selector: 'app-place-trail-card',
  templateUrl: './place-trail-card.component.html',
  styleUrls: ['./place-trail-card.component.scss'],
})
export class PlaceTrailCardComponent implements OnInit {
  @Input() place: any = {};
  placeType: string = '';
  distanceKM: any = null;

  isBookmarking = false;
  $placesSubscribe = new Subscription();

  constructor(
    private mainStore: Store<MainState>,
    private navCtrl: NavController,
    private storage: LocalStorageService,
    private commonService: CommonService,
    private pubsub: PubsubService
  ) {
    this.$placesSubscribe = this.pubsub.$sub('TRAIL_STEP_PLACES_SAVED', (data) => {
      this.isBookmarking = false;
      
      if(this.place.id * 1 === data.data.id * 1) this.place = {...this.place, isBookMarked: data.data.isBookMarked};
    })
  }

  ngOnInit(): void {
    if (this.place) {
      if (!isEmpty(this.place.types) && !isArray(this.place.types)) {
        this.placeType = this.place.types.type;
      } else if (!isEmpty(this.place.type) && isArray(this.place.types)) {
        this.placeType = this.place.type;
      }
      else {
        this.placeType = this.place.type;
      }

      // caculate the distance from user's position to this place
      const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);

      let distance = this.commonService.PythagorasEquirectangular(
        coordinates.latitude,
        coordinates.longitude,
        this.place.latitude,
        this.place.longitude
      );
      this.distanceKM = Math.round(distance * 10) / 10;
      if ((this.distanceKM % 1) === 0) this.distanceKM += '.0';
    }
  }

  ionViewWillLeave() {
    this.$placesSubscribe.unsubscribe();
  }

  async bookmarkClick(event: any) {
    this.isBookmarking = true;
    // this.place.isBookMarked = true;
    this.mainStore.dispatch(
      BookmarkPlace({
        placeId: this.place.placeId,
      })
    );
  }

  async unBookmarkClick(event: any) {
    this.isBookmarking = true;
    // this.place.isBookMarked = false;
    this.mainStore.dispatch(
      UnbookmarkPlace({
        placeId: this.place.placeId,
      })
    );
  }

  bookmarkActionClick(place: Places, event: any) {
    if (place.isBookMarked) {
      this.unBookmarkClick(event);
    } else {
      this.bookmarkClick(event);
    }
  }

  async onRatePlace() {
    await this.commonService.dismissAllModals();
    this.navCtrl.navigateForward('/main/rate-profile', {
      queryParams: {
        action: 'place',
        placeId: this.place.placeId,
      },
    });
  }
}
