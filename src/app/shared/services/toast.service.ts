import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  async showAlertMessage(header: string, message: string, onClickEvent?: any) {
    const alert = await this.alertController.create({
      header,
      message,
      animated: true,
      keyboardClose: false,
      buttons: ['OK'],
    });
    alert.onDidDismiss().then(() => {
      if (onClickEvent) {
        onClickEvent();
      }
    });
    alert.present();
  }

  async showSuccess(header: string, message: string) {
    const toast = await this.toastController.create({
      header,
      message,
      cssClass: 'toast-notif-success',
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  async showError(header: string, message: string) {
    const toast = await this.toastController.create({
      header,
      message,
      cssClass: 'toast-notif-error',
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  async showWarning(header: string, message: string) {
    const toast = await this.toastController.create({
      header,
      message,
      cssClass: 'toast-notif-warning',
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  async showConfirm(header: string, message: string) {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'Yes',
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });
      alert.present();
    });
  }

  async showInfo(header: string, message: string) {
    const toast = await this.toastController.create({
      header,
      message,
      cssClass: 'toast-notif-info',
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  async showToast(header: string, message: string) {
    const toast = await this.toastController.create({
      header,
      message,
      duration: 2000,
      position: 'bottom',
      mode: 'md',
    });
    toast.present();
  }

  showToastComponent(toast: any) {
    if (toast) {
      switch (toast.color) {
        case 1:
          this.showError('', toast.message);
          break;
        case 2:
          this.showInfo('', toast.message);
          break;
        case 3:
          this.showWarning('', toast.message);
          break;
        case 4:
          this.showSuccess('', toast.message);
          break;

        default:
          break;
      }
    }
  }
}
