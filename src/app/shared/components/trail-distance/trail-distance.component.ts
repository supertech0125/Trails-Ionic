import {
  Component,
  Input,
  NgZone,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CallbackID, Plugins } from '@capacitor/core';
import isEmpty from 'lodash-es/isEmpty';

import { LocalStorageService } from './../../services/local-storage.service';
import {
  DEFAULT_DISTANCE_DECIMAL,
  MAX_GEOLOCATION_TIMEOUT,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from './../../constants/utils';
import { CommonService } from '../../services/common.service';
import {
  GeolocationService,
  IGeoServiceLatLng,
} from '../../services/geolocation.service';

@Component({
  selector: 'app-trail-distance',
  templateUrl: './trail-distance.component.html',
  styleUrls: ['./trail-distance.component.scss'],
})
export class TrailDistanceComponent implements OnInit {
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() autoDistance: boolean | false;
  @Input() distance: number;

  currentCoords: IGeoServiceLatLng = {
    latitude: 0,
    longitude: 0,
  };

  watchCoords: IGeoServiceLatLng = {
    latitude: 0,
    longitude: 0,
  };

  distanceKM: string;
  watchId: CallbackID;
  showLoading = false;

  constructor(
    private storage: LocalStorageService,
    private commonService: CommonService,
    private geoService: GeolocationService
  ) {}

  ngOnInit(): void {
    if (this.autoDistance) {
      this.getCurrentPosition();
    } else {
      const distanceKm = Number(this.distance).toFixed(
        DEFAULT_DISTANCE_DECIMAL
      );
      this.distanceKM = distanceKm;
      this.showLoading = false;
    }
  }

  private computeDistance() {
    const distance = this.commonService.PythagorasEquirectangular(
      this.currentCoords.latitude,
      this.currentCoords.longitude,
      this.latitude,
      this.longitude
    );

    const distanceKm = Number(distance).toFixed(DEFAULT_DISTANCE_DECIMAL);
    this.distanceKM = distanceKm;
    this.showLoading = false;
  }

  private async getCurrentPosition() {
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    if (!isEmpty(coordinates)) {
      this.currentCoords = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };

      this.computeDistance();
      this.showLoading = false;
    } else {
      this.computeAutoDistance();
    }
  }

  private computeAutoDistance() {
    this.showLoading = true;
    this.geoService.getCurrentLocationPosition().then(
      (coords) => {
        this.currentCoords = coords;

        this.computeDistance();
        this.showLoading = false;
      },
      () => (this.showLoading = false)
    );
  }
}
