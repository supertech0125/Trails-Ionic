import { Injectable } from '@angular/core';
import { Plugins, NetworkStatus } from '@capacitor/core';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { PubsubService } from './pubsub.service';

const { Network } = Plugins;

export enum ConnectionStatus {
  Online,
  Offline,
}

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  globalToast: any;
  isAppOnline: boolean;

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(
    ConnectionStatus.Offline
  );

  constructor(
    public pubsub: PubsubService,
    public platform: Platform,
    private toastController: ToastController
  ) {
    this.initNetworkStatus();
  }

  private async initNetworkStatus() {
    console.log('initNetworkStatus');
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      const networkStatus = await Network.getStatus();
      const status =
        networkStatus.connectionType !== 'none'
          ? ConnectionStatus.Online
          : ConnectionStatus.Offline;
      this.isAppOnline = status === ConnectionStatus.Online ? true : false;
      this.status.next(status);
    } else {
      const status = navigator.onLine
        ? ConnectionStatus.Online
        : ConnectionStatus.Offline;

      this.isAppOnline = navigator.onLine ? true : false;
      this.status.next(status);
    }
  }

  onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }

  initializeNetwork() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        Network.addListener('networkStatusChange', (status: NetworkStatus) => {
          console.log('Network status changed', status.connectionType);
          if (status.connected) {
            console.log('WE ARE ONLINE');
            this.isAppOnline = true;
            this.updateNetworkStatus(ConnectionStatus.Online);
          } else {
            console.log('WE ARE OFFLINE');
            this.isAppOnline = false;
            this.updateNetworkStatus(ConnectionStatus.Offline);
          }
        });
      } else {
        window.addEventListener('online', () => {
          if (this.status.getValue() === ConnectionStatus.Offline) {
            console.log('WE ARE ONLINE');
            this.isAppOnline = true;
            this.updateNetworkStatus(ConnectionStatus.Online);
          }
        });

        window.addEventListener('offline', () => {
          if (this.status.getValue() === ConnectionStatus.Online) {
            console.log('WE ARE OFFLINE');
            this.isAppOnline = false;
            this.updateNetworkStatus(ConnectionStatus.Offline);
          }
        });
      }
    });
  }

  async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    const connection =
      status === ConnectionStatus.Offline ? 'Offline' : 'Online';

    if (this.globalToast) {
      this.globalToast.dismiss();
    }

    if (connection === 'Offline') {
      this.toastController
        .create({
          message: 'No Connection!',
          position: 'top',
          duration: 3000,
          cssClass: 'offline-toast-notif-danger',
        })
        .then((toast) => {
          this.globalToast = toast;
          this.globalToast.present();
        });
    } else if (connection === 'Online') {
      this.toastController
        .create({
          message: 'Online!',
          position: 'top',
          duration: 3000,
          cssClass: 'online-toast-notif-success',
        })
        .then((toast) => {
          this.globalToast = toast;
          this.globalToast.present();
        });
    }
  }
}
