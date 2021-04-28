import { Component, NgZone, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import isEmpty from 'lodash-es/isEmpty';
import filter from 'lodash-es/filter';
import map from 'lodash-es/map';
import find from 'lodash-es/find';
import size from 'lodash-es/size';
import each from 'lodash-es/each';
import upperFirst from 'lodash-es/upperFirst';

import { AddStepsComponent } from '../add-steps/add-steps.component';
import { CreateTrailAlertComponent } from './../create-trail-alert/create-trail-alert.component';
import { CreateTrailSuccessComponent } from './../create-trail-success/create-trail-success.component';

import { DataLoaderService } from './../../../../../shared/services/data-loader.service';
import { ToastService } from './../../../../../shared/services/toast.service';

import {
  ALL_TEXT,
  MAX_ITEMS_PER_PAGE,
  SELECTION_TEXT,
  TRAIL_CURRENT_USER_GEOLOCATION,
  TRAIL_CURRENT_USER_PROFILE,
  TRAIL_DETAILS_FILTER_TIME,
  TRAIL_DETAILS_FILTER_WITH,
} from './../../../../../shared/constants/utils';
import { CreateTrails } from '../../../models/trails.model';
import { FormatterServices } from '../../../services/formatter.service';
import { IGeoServiceLatLng } from 'src/app/shared/services/geolocation.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-create-trail',
  templateUrl: './create-trail.page.html',
  styleUrls: ['./create-trail.page.scss'],
})
export class CreateTrailPage implements OnInit {
  addedTrailsArr: any[] = [];
  addedTrailsArrMarkers: any[] = [];

  enableReorder = false;

  trailsDetailsTime: any = TRAIL_DETAILS_FILTER_TIME;
  trailDetailsWith: any = TRAIL_DETAILS_FILTER_WITH;

  trailsTime: string;

  withArr: any[] = [];
  trailWhoSelectedText: string;

  constructor(
    private zone: NgZone,
    private navCtrl: NavController,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private dataLoader: DataLoaderService,
    private storage: LocalStorageService,
    private toastService: ToastService,
    private formatter: FormatterServices,
    private mainService: MainService
  ) {}

  ngOnInit() {}

  async onAddTrailSteps() {
    let coordinates: {
      latitude: number;
      longitude: number;
    } = null;
    console.log('this.addedTrailsArr: ', this.addedTrailsArr);

    if (isEmpty(this.addedTrailsArr)) {
      console.log('1: ');
      coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    } else {
      console.log('2: ');
      const place = this.addedTrailsArr[this.addedTrailsArr.length - 1];
      coordinates = {
        latitude: place.latitude,
        longitude: place.longitude,
      };
    }
    const modal = await this.modalController.create({
      component: AddStepsComponent,
      componentProps: {
        selectedPlaces: this.addedTrailsArr,
        coordinates,
      },
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data) {
        const data = resp.data;
        if (data && data.steps) {
          this.dataFormatters(data.steps);
        }
      }
    });
    modal.present();
  }

  async dismiss() {
    if (!isEmpty(this.addedTrailsArr)) {
      this.confirmAlert('save');
    } else {
      this.navCtrl.back();
    }
  }

  async onDeletePlace(place: any) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message:
        'Are you sure you would like to remove this place from your trail?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Confirm',
          handler: () => {
            const tempPlacesArr = filter(this.addedTrailsArr, (row: any) => {
              if (row.placeId !== place.placeId) {
                return row;
              }
            });

            this.addedTrailsArr = this.formatTrailPlaces(tempPlacesArr);
            this.addedTrailsArrMarkers = this.mapTrailPlacesMarkers(
              tempPlacesArr
            );
          },
        },
      ],
    });

    await alert.present();
  }

  onReorderPlace(place: any) {
    this.enableReorder = true;
  }

  onSelectPlace(place: any) {
    console.log('onSelectPlace: ', place);
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    const addedTrailsArr = [...this.addedTrailsArr];
    const draggedItem = addedTrailsArr.splice(ev.detail.from, 1)[0];
    addedTrailsArr.splice(ev.detail.to, 0, draggedItem);

    const addedTrails = this.formatTrailPlaces(addedTrailsArr);
    this.addedTrailsArrMarkers = this.mapTrailPlacesMarkers(addedTrailsArr);
    this.addedTrailsArr = map(addedTrails, (row: any, index: number) => {
      const newIndex = index + 1;
      return {
        ...row,
        stepOrder: newIndex,
      };
    });
    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    this.enableReorder = false;
    ev.detail.complete();
  }

  onTrailTimeFilterSelect(event: any) {
    const when = event.target.value;
    this.trailsTime = when;
  }

  onTrailWithFilterSelect(event: any) {
    const withArr = event.target.value;
    if (size(withArr) !== size(this.trailDetailsWith.items)) {
      if (size(withArr) > 1) {
        this.trailWhoSelectedText = SELECTION_TEXT;
      } else {
        this.trailWhoSelectedText = upperFirst(withArr[0]);
      }
    } else {
      this.trailWhoSelectedText = ALL_TEXT;
    }
    this.withArr = withArr;
  }

  async onSavePlaces() {
    const formattedTrailsArr = map(
      this.addedTrailsArr,
      (row: any, index: number) => {
        return {
          placePrimaryId: row.placePrimaryId,
          stepOrder: row.stepOrder,
        };
      }
    );
    const profile = this.storage.getItem(TRAIL_CURRENT_USER_PROFILE);
    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);

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

    if (isEmpty(formattedTrailsArr)) {
      const alert = await this.alertController.create({
        header: 'Almost There!',
        message: 'Please add at least two places in your trail',
        buttons: ['Ok'],
      });
      return await alert.present();
    }

    if (size(formattedTrailsArr) < 2) {
      const alert = await this.alertController.create({
        header: 'Almost There!',
        message: 'Please add at least two places in your trail',
        buttons: ['Ok'],
      });
      return await alert.present();
    }

    if (isEmpty(this.trailsTime)) {
      const alert = await this.alertController.create({
        header: 'Almost there!',
        message: 'Please choose the time of day best suited for your trail',
        buttons: ['Ok'],
      });
      return await alert.present();
    }

    if (isEmpty(this.withArr)) {
      const alert = await this.alertController.create({
        header: 'Almost there!',
        message: 'Please choose the audience best suited for your trail',
        buttons: ['Ok'],
      });
      return await alert.present();
    }

    const trail: CreateTrails = {
      steps: formattedTrailsArr,
      time: this.trailsTime,
      with: this.withArr,
    };

    const loading = await this.loadingController.create();
    loading.present();

    this.mainService
      .createTrails(trail)
      .toPromise()
      .then(
        (response: any) => {
          loading.dismiss();

          this.success();

          this.dataLoader.getAllTrails();
          this.dataLoader.getAllCreatedTrails(profile.id, params);
        },
        (err) => {
          console.log('error: ', err);
          loading.dismiss();
          if (err) {
            const error = err.error;
            return this.toastService.showError('WARNING!', error.message);
          }
        }
      );
  }

  private async dataFormatters(steps) {
    if (size(this.addedTrailsArr) >= 10) {
      this.toastService.showWarning(
        'WARNING!',
        'A maximum of 10 places can be added on a trail'
      );
      return;
    }

    if (!isEmpty(steps)) {
      const result = find(this.addedTrailsArr, { placeId: steps.placeId });
      if (result) {
        const alert = await this.alertController.create({
          header: 'WARNING',
          message: 'Place already in the list!',
          buttons: ['OK'],
        });
        return alert.present();
      } else {
        this.addPlaceToTrail(steps);
      }
    }
  }

  private async confirmAlert(action) {
    const modal = await this.modalController.create({
      component: CreateTrailAlertComponent,
      componentProps: {
        action,
      },
      cssClass: 'alert-modal-screen',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp.data && resp.data.action && resp.data.action === 'continue') {
        return;
      }

      this.navCtrl.back();
    });
    modal.present();
  }

  private async success() {
    const modal = await this.modalController.create({
      component: CreateTrailSuccessComponent,
      cssClass: 'alert-modal-screen',
    });
    modal.onDidDismiss().then(() => {
      this.navCtrl.back();
    });
    modal.present();
  }

  private addPlaceToTrail(steps: any) {
    const addedTrailsArr = [...this.addedTrailsArr];
    addedTrailsArr.push(steps);

    const addedTrails = this.formatTrailPlaces(addedTrailsArr);
    this.addedTrailsArrMarkers = this.mapTrailPlacesMarkers(addedTrailsArr);
    this.addedTrailsArr = map(addedTrails, (row: any, index: number) => {
      const newIndex = index + 1;
      return {
        ...row,
        stepOrder: newIndex,
      };
    });
  }

  private formatTrailPlaces(addedTrailsArr: any[]) {
    each(addedTrailsArr, (place: any, index: number) => {
      let autoDistance = true;
      let prevLocation: IGeoServiceLatLng;

      const newIndex = index + 1;
      const prevIndex = index - 1;

      if (index === 0) {
        const formattedPlace = this.formatter.formatPlace(place, autoDistance);
        place = formattedPlace;
      } else {
        prevLocation = {
          latitude: addedTrailsArr[prevIndex].latitude,
          longitude: addedTrailsArr[prevIndex].longitude,
        };

        autoDistance = false;
        const formattedPlace = this.formatter.formatPlace(
          place,
          autoDistance,
          prevLocation
        );
        place = formattedPlace;
      }
      place.placePrimaryId = place.id;
    });
    return addedTrailsArr;
  }

  private mapTrailPlacesMarkers(addedTrailsArr: any[]) {
    return map(addedTrailsArr, (row: any) => {
      return {
        lat: row.latitude,
        lng: row.longitude,
      };
    });
  }
}
