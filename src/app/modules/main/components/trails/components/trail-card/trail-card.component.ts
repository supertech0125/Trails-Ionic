import { Component, Input, OnInit } from '@angular/core';
import {
  ActionSheetController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Plugins } from '@capacitor/core';

import { MainService } from 'src/app/modules/main/services/main.service';
import { MainState } from 'src/app/modules/main/store/main.reducer';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TrailPlaceInfoModalComponent } from '../../trail-place-info-modal/trail-place-info-modal.component';
import { ViewAllTrailsComponent } from '../../view-all-trails/view-all-trails.component';
import { PubsubService } from 'src/app/shared/services/pubsub.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from 'src/environments/environment';
import { BookmarkTrails, UnbookmarkTrails } from 'src/app/modules/main/store/BookmarkTrails/BookmarkTrails.action';

@Component({
  selector: 'app-trail-card',
  templateUrl: './trail-card.component.html',
  styleUrls: ['./trail-card.component.scss'],
})
export class TrailCardComponent implements OnInit {
  @Input() trail: any = {};
  isBookmarking = false;

  constructor(
    private mainStore: Store<MainState>,
    private navCtrl: NavController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private mainService: MainService,
    private toastService: ToastService,
    private pubsub: PubsubService,
    private commonService: CommonService
  ) {
    this.pubsub.$sub('TRAIL_STEP_TRAILS_SAVED', () => {
      this.isBookmarking = false;
    })
  }

  ngOnInit(): void { }

  async onRateTrail(event) {
    event.stopPropagation();
    this.navCtrl.navigateForward('/main/rate-profile', {
      queryParams: {
        action: 'trail',
        trailId: this.trail.id,
      },
    });
  }

  async onShareTrail(event) {
    event.stopPropagation();

    // if (this.platform.is('cordova') || this.platform.is('capacitor')) {
    // } else {
    //   this.shareToWeb();
    // }

    const shareURL = `${environment.webAppUrl}/trail-activity?trailId=${this.trail.id}`;
    console.log('shareURL: ', shareURL);
    try {
      const shareRet = await Plugins.Share.share({
        title: 'Check out my trails on TrailSteps',
        url: shareURL,
        dialogTitle: 'Check out my trails on TrailSteps',
      });
      console.log('shareRet: ', shareRet);
    } catch (error) {
      console.log('error: ', error);
      console.log("Your browser doesn't support Navigator.share()");
    }
  }

  async bookmarkClick(event: any) {
    this.isBookmarking = true;
    // this.trail.isbookMarked = true;
    // this.trail.isBookMarked = true;

    this.mainStore.dispatch(
      BookmarkTrails({
        trailId: this.trail.id,
      })
    );
  }

  async unBookmarkClick(event: any) {
    this.isBookmarking = true;
    // this.trail.isbookMarked = false;
    // this.trail.isBookMarked = false;

    this.mainStore.dispatch(
      UnbookmarkTrails({
        trailId: this.trail.id,
      })
    );
  }

  bookmarkActionClick(event: any) {
    event.stopPropagation();

    if (this.trail.isbookMarked || this.trail.isBookMarked) {
      this.unBookmarkClick(event);
    } else {
      this.bookmarkClick(event);
    }
  }

  async viewTrail(trailId, event) {
    event.stopPropagation();
    await this.commonService.dismissAllModals();
    this.navCtrl.navigateForward('/main/trail-details', {
      queryParams: {
        trailId,
      },
    });
  }

  async viewAllTrails(event) {
    event.stopPropagation();
    const modal = await this.modalController.create({
      component: ViewAllTrailsComponent,
      cssClass: 'modal-topmidscreen',
      swipeToClose: true,
      componentProps: {
        trail: this.trail,
      },
    });
    modal.present();
  }

  async viewPlaceDetail(place: any, event) {
    event.preventDefault();
    await this.commonService.dismissAllModals();
    const modal = await this.modalController.create({
      component: TrailPlaceInfoModalComponent,
      cssClass: 'modal-topmidscreen',
      componentProps: {
        place,
      },
      swipeToClose: true,
    });
    modal.present();
  }

  private async shareToWeb() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Share this trail to:',
      buttons: [
        {
          text: 'Facebook',
          handler: () => {
            console.log('Share clicked');
          },
        },
        {
          text: 'Twitter',
          handler: () => {
            console.log('Play clicked');
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
  }
}
