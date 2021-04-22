import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';

import { isEmpty, isArray } from 'lodash-es';

import { Places } from './../../../../models/places.model';
import { MainState } from 'src/app/modules/main/store/main.reducer';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  BookmarkPlace,
  UnbookmarkPlace,
} from 'src/app/modules/main/store/BookmarkPlaces/BookmarkPlaces.action';

@Component({
  selector: 'app-place-card',
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.scss'],
})
export class PlaceCardComponent implements OnInit {
  @Input() place: any = {};
  placeType: string = '';

  isBookmarking = false;

  constructor(
    private mainStore: Store<MainState>,
    private navCtrl: NavController,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    if (this.place) {
      if (!isEmpty(this.place.types) && !isArray(this.place.types)) {
        this.placeType = this.place.types.type;
      }else if (!isEmpty(this.place.type) && isArray(this.place.types)) {
        this.placeType = this.place.type;
      }
    }
  }

  async bookmarkClick(event: any) {
    this.isBookmarking = true;
    this.place.isBookMarked = true;
    this.mainStore.dispatch(
      BookmarkPlace({
        placeId: this.place.placeId,
      })
    );
  }

  async unBookmarkClick(event: any) {
    this.isBookmarking = true;
    this.place.isBookMarked = false;
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
