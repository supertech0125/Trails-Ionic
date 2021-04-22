import {
  PLACE_TEXT,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from './../../constants/utils';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SearchLocationOlComponent } from '../search-location-ol/search-location-ol.component';
import { IPlaceQueryParams } from 'src/app/modules/main/models/places.model';
import { Store } from '@ngrx/store';
import { LocalStorageService } from '../../services/local-storage.service';
import {
  clearPlacesAction,
  PlacesAction,
} from 'src/app/modules/main/store/Places/Places.action';
import {
  clearTrailsAction,
  TrailsAction,
} from 'src/app/modules/main/store/Trails/Trails.action';

@Component({
  selector: 'app-desktop-toolbar-header',
  templateUrl: './desktop-toolbar-header.component.html',
  styleUrls: ['./desktop-toolbar-header.component.scss'],
})
export class DesktopToolbarHeaderComponent implements OnInit, OnChanges {
  @Input() showSearch: boolean;
  @Input() showFilterBadge: boolean;
  @Input() title: string;
  @Input() action: 'places' | 'trails';

  @Output() onShowSearch = new EventEmitter<any>();
  @Output() openFilter = new EventEmitter<any>();
  @Output() onSearchInput = new EventEmitter<any>();

  constructor(
    private modalController: ModalController,
    private store: Store,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'showFilterBadge': {
            this.showFilterBadge = changes['showFilterBadge'].currentValue;
          }
        }
      }
    }
  }

  openSearch() {
    this.openSearchPlace();
  }

  private async openSearchPlace() {
    const modal = await this.modalController.create({
      component: SearchLocationOlComponent,
      componentProps: {
        action: PLACE_TEXT,
      },
    });
    modal.onDidDismiss().then((resp) => {
      const params: IPlaceQueryParams = {};
      const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
      if (coordinates) {
        params.Lat = coordinates.latitude;
        params.Long = coordinates.longitude;
      }
      params.Sort = 'distance';

      if (resp && resp.data === 'save') {
        // this.reset();
        if (this.action === 'places') {
          this.store.dispatch(clearPlacesAction());
          this.store.dispatch(
            PlacesAction({
              params,
            })
          );
        } else {
          this.store.dispatch(clearTrailsAction());
          this.store.dispatch(
            TrailsAction({
              params,
            })
          );
        }
      }
    });
    modal.present();
  }
}
