import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ModalController } from '@ionic/angular';
import { SearchLocationOlComponent } from '../search-location-ol/search-location-ol.component';
import {
  MAX_ITEMS_PER_PAGE,
  PLACE_TEXT,
  TRAIL_TEXT,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from '../../constants/utils';
import { Store } from '@ngrx/store';
import { IPlaceQueryParams } from 'src/app/modules/main/models/places.model';
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
  selector: 'app-mobile-toolbar-header',
  templateUrl: './mobile-toolbar-header.component.html',
  styleUrls: ['./mobile-toolbar-header.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('1s ease-out', style({ height: 300, opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: 300, opacity: 1 }),
        animate('1s ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class MobileToolbarHeaderComponent implements OnInit, OnChanges {
  @Input() showSearch: boolean;
  @Input() showFilterBadge: boolean;
  @Input() title: string;
  @Input() action: 'places' | 'trails';

  @Output() onShowSearch = new EventEmitter<any>();
  @Output() openFilter = new EventEmitter<any>();
  @Output() openSort = new EventEmitter<any>();
  @Output() onSearchInput = new EventEmitter<any>();
  @Output() openFilterModal = new EventEmitter<any>();

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
        action: this.action === 'places'? PLACE_TEXT : TRAIL_TEXT,
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
      params.PageSize = MAX_ITEMS_PER_PAGE;

      if (resp && resp.data === 'save') {
        // this.reset();

        if (this.action === 'places') {
          this.store.dispatch(clearPlacesAction());
          // this.store.dispatch(
          //   PlacesAction({
          //     params,
          //   })
          // );
        } else {
          this.store.dispatch(clearTrailsAction());
          // this.store.dispatch(
          //   TrailsAction({
          //     params,
          //   })
          // );
        }
      }
    });
    modal.present();
  }
}
