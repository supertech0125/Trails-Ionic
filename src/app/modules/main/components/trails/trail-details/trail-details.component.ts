import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { select, Store } from '@ngrx/store';

import { MainService } from '../../../services/main.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { PubsubService } from 'src/app/shared/services/pubsub.service';
import { MainState } from '../../../store/main.reducer';
import { ViewAllTrailsComponent } from '../view-all-trails/view-all-trails.component';
import { TrailPlaceInfoModalComponent } from '../trail-place-info-modal/trail-place-info-modal.component';
import { take, takeUntil } from 'rxjs/operators';
import { FormatterServices } from '../../../services/formatter.service';
import { environment } from 'src/environments/environment';
import { Meta } from '@angular/platform-browser';
import { AuthState } from 'src/app/modules/auth/store/auth.reducers';
import { isLoggedIn } from 'src/app/modules/auth/store/auth.selectors';
import { CommonService } from 'src/app/shared/services/common.service';
import {
  BookmarkTrails,
  UnbookmarkTrails,
} from '../../../store/BookmarkTrails/BookmarkTrails.action';

@Component({
  selector: 'app-trail-details',
  templateUrl: './trail-details.component.html',
  styleUrls: ['./trail-details.component.scss'],
})
export class TrailDetailsComponent implements OnInit {
  trail: any = {};
  @Input() trailId: number;
  @Input() isModal: boolean;

  isBookmarking = false;
  showContent = false;
  isLoggedIn = false;

  isLoggedIn$: Observable<boolean>;
  private unsubscribe = new Subject<any>();

  constructor(
    private authstore: Store<AuthState>,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private platform: Platform,
    private mainStore: Store<MainState>,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private mainService: MainService,
    private toastService: ToastService,
    private pubsub: PubsubService,
    private formatter: FormatterServices,
    private metaService: Meta,
    private commonService: CommonService
  ) {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      console.log('params: ', params);

      if (params && params.trailId) {
        this.trailId = params.trailId;

        this.getTrail(this.trailId);
      }
    });

    this.isLoggedIn$ = this.authstore.pipe(select(isLoggedIn));
    this.isLoggedIn$.pipe(take(1)).subscribe((response) => {
      if (response) {
        this.isLoggedIn = true;
      }
    });

    this.pubsub.$sub('TRAIL_STEP_TRAILS_SAVED', () => {
      this.isBookmarking = false;
    })
  }

  ngOnInit(): void {
    if (this.isModal && this.trailId !== null) {
      console.log('isModal: ', this.isModal);
      console.log('trailId: ', this.trailId);
      this.getTrail(this.trailId);
    }
  }

  ionViewDidEnter() {
    const shareURL = `${environment.webAppUrl}/trail-activity?trailId=${this.trail.id}`;
    const ogtitle = { name: 'og:title', content: 'Sharing My Trails' };
    const ogSitename = { name: 'og:site_name', content: 'TrailSteps' };
    const ogUrl = { name: 'og:url', content: shareURL };
    const ogdesc = {
      name: 'og:description',
      content: 'Check out my trails on TrailSteps',
    };
    const ogImage = {
      name: 'og:image',
      content: 'https://trailsteps-dev.web.app/assets/png/logo_wave.png',
    };

    const twCard = { name: 'twitter:card', content: 'summary_large_image' };
    const twTitle = { name: 'twitter:title', content: 'Sharing My Trails' };
    const twDesc = {
      name: 'twitter:description',
      content: 'Check out my trails on TrailSteps',
    };
    const twImage = {
      name: 'twitter:image',
      content: 'https://trailsteps-dev.web.app/assets/png/logo_wave.png',
    };
    const twImgAlt = {
      name: 'twitter:image:alt',
      content: 'TrailSteps - Sharing My Trails',
    };

    this.metaService.addTag(ogtitle);
    this.metaService.addTag(ogSitename);
    this.metaService.addTag(ogUrl);
    this.metaService.addTag(ogdesc);
    this.metaService.addTag(ogImage);

    this.metaService.addTag(twCard);
    this.metaService.addTag(twTitle);
    this.metaService.addTag(twDesc);
    this.metaService.addTag(twImage);
    this.metaService.addTag(twImgAlt);
  }

  ionViewWillLeave() {
    this.unsubscribe.next();
    this.unsubscribe.complete();

    this.metaService.removeTag("name='og:title'");
    this.metaService.removeTag("name='og:site_name'");
    this.metaService.removeTag("name='og:url'");
    this.metaService.removeTag("name='og:description'");
  }

  dismiss() {
    if (this.isModal) {
      this.modalController.dismiss();
    } else {
      this.navCtrl.back();
    }
  }

  async onRateTrail() {
    await this.commonService.dismissAllModals();
    this.navCtrl.navigateForward('/main/rate-profile', {
      queryParams: {
        action: 'trail',
        trailId: this.trail.id,
      },
    });
  }

  doRefresh(event) {
    if (event) {
      this.showContent = false;
    }

    this.getTrail(this.trailId, event);
  }

  async onShareTrail() {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      const shareRet = await Plugins.Share.share({
        // title: 'See cool stuff',
        // text: 'Really awesome thing you need to see right meow',
        // url: 'https://metomine.com/',
        title: 'Share the Trail',
        text: `Shared Trail Id for registering the trail as verified or not is ${this.trailId} and shared link is`,
        url: `https://trailsteps-dev.web.app/trail-activity?trailId=${this.trailId}`,
        dialogTitle: 'Verify the Trail', // only supported on Android
      });

      console.log('shareRet: ', shareRet);
    } else {
      this.shareToWeb();
    }
  }

  async bookmarkClick(event: any) {
    this.trail.isbookMarked = true;
    this.trail.isBookMarked = true;

    this.mainStore.dispatch(
      BookmarkTrails({
        trailId: String(this.trailId),
      })
    );

    // setTimeout(() => {
    //   this.getTrail(this.trailId);
    // }, 1500);
  }

  async unBookmarkClick(event: any) {
    this.trail.isbookMarked = false;
    this.trail.isBookMarked = false;

    this.mainStore.dispatch(
      UnbookmarkTrails({
        trailId: String(this.trailId),
      })
    );

    // setTimeout(() => {
    //   this.getTrail(this.trailId);
    // }, 1500);
  }

  bookmarkActionClick(event: any) {
    this.isBookmarking = true;
    if (this.trail.isbookMarked) {
      this.unBookmarkClick(event);
    } else {
      this.bookmarkClick(event);
    }
  }

  async viewAllTrails() {
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

  async viewPlaceDetail(place: any) {
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

  private getTrail(trailId, refresher?: any) {
    this.mainService
      .getTrail(trailId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          console.log('getTrail: ', response);
          if (response) {
            const trailsArr = this.formatter.formatTrails([response]);
            this.trail = trailsArr[0];
            this.showContent = true;

            if (this.isBookmarking) {
              this.isBookmarking = false;
            }

            if (refresher && refresher.target) {
              refresher.target.disabled = true;
              refresher.target.complete();

              setTimeout(() => {
                refresher.target.disabled = false;
              }, 100);
            }
          }
        },
        () => {
          this.showContent = true;

          if (this.isBookmarking) {
            this.isBookmarking = false;
          }

          if (refresher && refresher.target) {
            refresher.target.disabled = true;
            refresher.target.complete();

            setTimeout(() => {
              refresher.target.disabled = false;
            }, 100);
          }
        }
      );
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
