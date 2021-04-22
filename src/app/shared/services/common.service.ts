import { Injectable } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
  ) {}

  async dismissAllLoaders() {
    let topLoader = await this.loadingCtrl.getTop();
    while (topLoader) {
      if (!(await topLoader.dismiss())) {
        throw new Error('Could not dismiss the topmost loader. Aborting...');
      }
      topLoader = await this.loadingCtrl.getTop();
    }
  }

  async dismissAllModals() {
    let topModal = await this.modalCtrl.getTop();
    while (topModal) {
      if (!(await topModal.dismiss())) {
        throw new Error('Could not dismiss the topmost modal. Aborting...');
      }
      topModal = await this.modalCtrl.getTop();
    }
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.Deg2Rad(lat2 - lat1); // this.Deg2Rad below
    const dLon = this.Deg2Rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.Deg2Rad(lat1)) *
        Math.cos(this.Deg2Rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    }

    lat1 = this.Deg2Rad(lat1);
    lat2 = this.Deg2Rad(lat2);
    lon1 = this.Deg2Rad(lon1);
    lon2 = this.Deg2Rad(lon2);
    const R = 6371; // km
    const x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    const y = lat2 - lat1;
    const d = Math.sqrt(x * x + y * y) * R;
    return d;
  }

  // Convert Degress to Radians
  Deg2Rad(deg) {
    return (deg * Math.PI) / 180;
  }

  /**
   * Calculate the center/average of multiple GeoLocation coordinates
   * Expects an array of objects with .latitude and .longitude properties
   *
   * @url http://stackoverflow.com/a/14231286/538646
   */
  centerGeolocationBounds(coords: any[]) {
    if (coords.length === 1) {
      return coords[0];
    }

    let x = 0.0;
    let y = 0.0;
    let z = 0.0;

    for (const coord of coords) {
      const latitude = (coord.latitude * Math.PI) / 180;
      const longitude = (coord.longitude * Math.PI) / 180;

      x += Math.cos(latitude) * Math.cos(longitude);
      y += Math.cos(latitude) * Math.sin(longitude);
      z += Math.sin(latitude);
    }

    const total = coords.length;

    x = x / total;
    y = y / total;
    z = z / total;

    const centralLongitude = Math.atan2(y, x);
    const centralSquareRoot = Math.sqrt(x * x + y * y);
    const centralLatitude = Math.atan2(z, centralSquareRoot);

    return {
      latitude: (centralLatitude * 180) / Math.PI,
      longitude: (centralLongitude * 180) / Math.PI,
    };
  }
}
