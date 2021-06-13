import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import {
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';

import { AuthState } from './../../../auth/store/auth.reducers';
import { Logout } from './../../../auth/store/auth.actions';
import { ScreensizeService } from 'src/app/shared/services/screensize.service';
import { UnitComponent } from './unit/unit.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { PubsubService } from 'src/app/shared/services/pubsub.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  isDesktop: boolean;
  isKM: boolean = true;

  constructor(
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private store: Store<AuthState>,
    private pubsub: PubsubService,
    private storage: LocalStorageService,
    private screensizeService: ScreensizeService
  ) {
    this.screensizeService.isDesktopView().subscribe((isDesktop) => {
      if (this.isDesktop && !isDesktop) {
        // Reload because our routing is out of place
        window.location.reload();
      }

      this.isDesktop = isDesktop;
    });
  }

  ngOnInit() {
    const flag = this.storage.getItem('appUnit');
    if(flag === null) this.isKM = true;
    else this.isKM = flag;
  }

  async onRate() {
    await Plugins.Browser.open({ url: 'https://apps.apple.com/us/app/avenues/id1448098428' })
  }

  onFeedBack() {
    this.navCtrl.navigateForward('/main/feedback');
  }

  // onInviteFriends() {
  //   this.navCtrl.navigateForward('/main/invite-friends');
  // }

  async onChangeUnit(){
    const modal = await this.modalController.create({
      component: UnitComponent,
      cssClass: 'unit-modal-screen',
      componentProps: {
        isKM: this.isKM,
      },
      swipeToClose: true,
    });
    modal.onDidDismiss().then(resp => {
      this.isKM = resp.data;
      localStorage.setItem('appUnit', resp.data);
      this.pubsub.$pub('APP_MEASUREMENT_UNIT', {isKM: this.isKM});
    });
    modal.present();
  }

  async onTerms() {
    const modal = await this.modalController.create({
      component: TermsComponent,
    });
    modal.present();
  }

  async onPrivacy() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyComponent,
    });
    modal.present();
  }

  async logoutApp() {
    const loading = await this.loadingController.create();
    loading.present();
    setTimeout(() => {
      loading.dismiss();

      this.store.dispatch(new Logout());
    }, 1000);
  }
}
