import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { GeolocationService } from '../../services/geolocation.service';

@Component({
  selector: 'app-location-permission',
  templateUrl: './location-permission.component.html',
  styleUrls: ['./location-permission.component.scss'],
})
export class LocationPermissionComponent implements OnInit {
  currentCoords = {
    latitude: 0,
    longitude: 0,
  };

  showLoading: boolean;

  constructor(
    private loadingController: LoadingController,
    private modalController: ModalController,
    private geoService: GeolocationService
  ) {}

  ngOnInit(): void {
    this.showLoading = false;
  }

  async allow() {
    try {
      const loading = await this.loadingController.create();
      loading.present();
      await this.geoService.getCurrentLocationPosition(true);
      this.dismiss();
    } catch (error) {
      this.dismiss();
    }
  }

  dismiss() {
    if (this.loadingController) {
      this.loadingController.dismiss();
    }

    this.modalController.dismiss();
  }
}
