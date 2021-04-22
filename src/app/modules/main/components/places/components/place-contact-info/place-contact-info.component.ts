import { Component, Input, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Platform } from '@ionic/angular';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-place-contact-info',
  templateUrl: './place-contact-info.component.html',
  styleUrls: ['./place-contact-info.component.scss'],
})
export class PlaceContactInfoComponent implements OnInit {
  @Input() reservationUrl: string | null | undefined;
  @Input() address: string | null | undefined;
  @Input() phone: string | null | undefined;
  @Input() website: string | null | undefined;

  constructor(
    private platform: Platform,
    private callNumber: CallNumber,
    private launchNavigator: LaunchNavigator,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  async openWebsite() {
    if (this.website) {
      await Plugins.Browser.open({ url: this.website });
    }
  }

  async openReservation() {
    if (this.reservationUrl) {
      await Plugins.Browser.open({ url: this.reservationUrl });
    }
  }

  async openAddressOnMap() {
    console.log('openAddressOnMap');
    if (this.address) {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        console.log('this.launchNavigator.userSelect');
        this.launchNavigator.userSelect(this.address, {});
      }
    }
  }

  makePhoneCall() {
    console.log('makePhoneCall');
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      console.log('makePhoneCall 1');
      if (this.phone) {
        this.callNumber
          .callNumber(this.phone, true)
          .then((res) => console.log('Launched dialer!', res))
          .catch((err) => {
            console.log('Error launching dialer', err);
            if (err === 'NoFeatureCallSupported') {
              return this.toastService.showError(
                'WARNING!',
                'No feature call supported!'
              );
            }
          });
      }
    }
  }
}
