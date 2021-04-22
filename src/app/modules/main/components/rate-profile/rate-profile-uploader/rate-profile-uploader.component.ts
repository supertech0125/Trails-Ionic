import { Component, NgZone, OnInit } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

@Component({
  selector: 'app-rate-profile-uploader',
  templateUrl: './rate-profile-uploader.component.html',
  styleUrls: ['./rate-profile-uploader.component.scss'],
})
export class RateProfileUploaderComponent implements OnInit {
  attachmentsArr: any[] = [];

  constructor(
    private zone: NgZone,
    private plt: Platform,
    private sanitizer: DomSanitizer,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit(): void {}

  async addAttachments() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'profile-actionsheet',
      buttons: [
        {
          text: 'Take photograph',
          handler: () => {
            console.log('Take photograph clicked');
            this.takePicture(CameraSource.Camera);
          },
        },
        {
          text: 'Select from album',
          handler: () => {
            console.log('Select from album clicked');
            this.takePicture(CameraSource.Photos);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  private async takePicture(imageSource) {
    if (this.plt.is('capacitor') || this.plt.is('cordova')) {
      const image = await Plugins.Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: imageSource,
      });

      const file = this.sanitizer.bypassSecurityTrustResourceUrl(
        image && image.dataUrl
      );
      this.attachmentsArr.push(file);
    } else {
      const vm = this;
      const input = document.createElement('input');
      input.type = 'file';
      input.name = 'browse_file';
      input.accept = 'image/x-png,image/gif,image/jpeg, image/jpg';
      input.click();
      input.onchange = () => {
        const blob = window.URL.createObjectURL(input.files[0]);
        vm.zone.run(() => {
          const file = vm.sanitizer.bypassSecurityTrustResourceUrl(blob);
          // vm.imageFile = input.files[0];
          // vm.uploadFileDocument();

          vm.attachmentsArr.push(file);

          console.log('vm.attachmentsArr: ', vm.attachmentsArr);
        });
      };
    }
  }
}
