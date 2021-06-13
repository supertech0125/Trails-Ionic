import {
  Component,
  Input,
  NgZone,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CallbackID, Plugins } from '@capacitor/core';
import isEmpty from 'lodash-es/isEmpty';

import { LocalStorageService } from '../../services/local-storage.service';
import { PubsubService } from 'src/app/shared/services/pubsub.service';
import {
  DEFAULT_DISTANCE_DECIMAL,
  MAX_GEOLOCATION_TIMEOUT,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from '../../constants/utils';
import { CommonService } from '../../services/common.service';
import {
  GeolocationService,
  IGeoServiceLatLng,
} from '../../services/geolocation.service';

@Component({
  selector: 'app-saved-places-distance',
  templateUrl: './saved-places-distance.component.html',
  styleUrls: ['./saved-places-distance.component.scss'],
})
export class SavedPlacesDistanceComponent implements OnInit {
  // @Input() latitude: number;
  // @Input() longitude: number;
  // @Input() autoDistance: boolean | false;
  // @Input() distance: number;
  @Input() distanceKM: any;

  // currentCoords: IGeoServiceLatLng = {
  //   latitude: 0,
  //   longitude: 0,
  // };

  // watchCoords: IGeoServiceLatLng = {
  //   latitude: 0,
  //   longitude: 0,
  // };

  // distanceKM: string;
  // watchId: CallbackID;
  showLoading = false;
  isUnitKM: boolean = true;
  Math: any;

  constructor(
    private storage: LocalStorageService,
    private pubsub: PubsubService,
    // private commonService: CommonService,
    // private geoService: GeolocationService
  ) {
    this.pubsub.$sub('APP_MEASUREMENT_UNIT', (data) => {
      this.isUnitKM = data.isKM;
    });

    this.Math = Math;
  }

  ngOnInit(): void {
    const flag = this.storage.getItem('appUnit');
    if(flag === null) this.isUnitKM = true;
    else this.isUnitKM = flag;
    // if (this.autoDistance) {
    //   this.getCurrentPosition();
    // } else {
    //   const distanceKm = Number(this.distance).toFixed(
    //     DEFAULT_DISTANCE_DECIMAL
    //   );
    //   this.distanceKM = distanceKm;
    //   this.showLoading = false;
    // }
  }

  // private computeDistance() {
  //   const distance = this.commonService.PythagorasEquirectangular(
  //     this.currentCoords.latitude,
  //     this.currentCoords.longitude,
  //     this.latitude,
  //     this.longitude
  //   );

  //   const distanceKm = Number(distance).toFixed(DEFAULT_DISTANCE_DECIMAL);
  //   this.distanceKM = distanceKm;
  //   this.showLoading = false;
  // }

  // private async getCurrentPosition() {
  //   const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
  //   if (!isEmpty(coordinates)) {
  //     this.currentCoords = {
  //       latitude: coordinates.latitude,
  //       longitude: coordinates.longitude,
  //     };

  //     this.computeDistance();
  //     this.showLoading = false;
  //   } else {
  //     this.computeAutoDistance();
  //   }
  // }

  // private computeAutoDistance() {
  //   this.showLoading = true;
  //   this.geoService.getCurrentLocationPosition().then(
  //     (coords) => {
  //       this.currentCoords = coords;

  //       this.computeDistance();
  //       this.showLoading = false;
  //     },
  //     () => (this.showLoading = false)
  //   );
  // }
}
