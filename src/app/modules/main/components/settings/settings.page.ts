import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';

import { AuthState } from './../../../auth/store/auth.reducers';
import { Logout } from './../../../auth/store/auth.actions';
import { ScreensizeService } from 'src/app/shared/services/screensize.service';
import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  isDesktop: boolean;

  constructor(
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private store: Store<AuthState>,
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

  ngOnInit() {}

  onFeedBack() {
    this.navCtrl.navigateForward('/main/feedback');
  }

  // onInviteFriends() {
  //   this.navCtrl.navigateForward('/main/invite-friends');
  // }

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
