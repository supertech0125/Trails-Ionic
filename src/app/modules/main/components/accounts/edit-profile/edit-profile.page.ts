import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  ActionSheetController,
  IonContent,
  LoadingController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';

import { MainService } from './../../../services/main.service';
import { DataLoaderService } from './../../../../../shared/services/data-loader.service';
import { ToastService } from './../../../../../shared/services/toast.service';
import { LocalStorageService } from './../../../../../shared/services/local-storage.service';

import { UserProfile, UserUpdate } from './../../../../auth/models/auth.model';
import { TRAIL_CURRENT_USER_PROFILE } from 'src/app/shared/constants/utils';
import { take } from 'rxjs/operators';
import { PubsubService } from 'src/app/shared/services/pubsub.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  loginForm: FormGroup;
  isFormValid = false;
  isSubmitting = false;
  userAvatar: any;
  // imageFile: string;
  file: any = null;

  currentProfile: UserProfile = {};

  constructor(
    private plt: Platform,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private mainService: MainService,
    private dataLoader: DataLoaderService,
    private toastService: ToastService,
    private pubsub: PubsubService,
    private storage: LocalStorageService
  ) { }

  ionViewDidEnter() {
    this.loginForm.reset();
    this.initUserProfile();
  }

  ionViewWillEnter() {
    this.initUserProfile();
  }

  ngOnInit(): void {
    this.createForm();
  }

  get f(): any {
    return this.loginForm.controls;
  }

  back() {
    this.navCtrl.back({
      animationDirection: 'back',
    });
  }

  async update() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    if (this.loginForm.invalid) {
      this.isSubmitting = false;
      this.validateAllFormFields(this.loginForm);
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Updating...',
    });
    await loading.present();

    // const payload: UserUpdate = {
    //   imageInfo: {
    //     base64: this.imageFile,
    //     fileName: this.currentProfile.id + '_' + new Date().getTime(),
    //   },
    //   ...this.loginForm.value,
    // };
    // console.log('payload: ', payload);

    let lastName = (this.loginForm.value.lastName != 'null' && this.loginForm.value.lastName != null) ? this.loginForm.value.lastName : '';

    let formData = new FormData();
    if(this.file) formData.append('ImageInfo', this.file, this.currentProfile.id + '_' + new Date().getTime());
    formData.append('FirstName', this.loginForm.value.firstName);
    formData.append('LastName', lastName);

    this.mainService
      .updateUserProfile(formData)
      .pipe(take(1))
      .subscribe(
        (response) => {
          if (response) {
            this.dataLoader.refreshProfileData().then(() => {
              loading.dismiss();
              this.isSubmitting = false;

              this.initUserProfile();

              this.pubsub.$pub('TRAIL_CURRENT_USER_PROFILE');

              this.navCtrl.back({
                animationDirection: 'back',
              });
            });
          }
        },
        (err) => {
          console.log('err: ', err);
          this.isSubmitting = false;
          loading.dismiss();
          if (err) {
            const error = err.error;
            console.log('error: ', error);
            if (error && error.message) {
              return this.toastService.showError('', error.message);
            } else if (error && error.toast) {
              return this.toastService.showToastComponent(error.toast);
            }
          }
        }
      );
  }

  async changeAvatar() {
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
        resultType: CameraResultType.Base64,
        source: imageSource,
      });
      console.log('image: ', image);

      // this.imageFile = image.base64String;
      this.file = this.b64toBlob(image.base64String, `image/${image.format}`);
      this.userAvatar = 'data:image/png;base64,' + image.base64String;
    } else {
      const vm = this;
      const input = document.createElement('input');
      input.type = 'file';
      input.name = 'browse_file';
      input.accept = 'image/x-png,image/gif,image/jpeg, image/jpg';
      input.click();
      input.onchange = () => {
        const file = input.files[0];
        vm.file = file;
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64result = String(reader.result).split(',');
          // vm.imageFile = base64result[1];
          vm.userAvatar = String(reader.result);
        };
      };
    }
  }

  private b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
 
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
 
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
 
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
 
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  private initUserProfile() {
    const profile = this.storage.getItem(TRAIL_CURRENT_USER_PROFILE);
    if (profile) {
      this.currentProfile = profile;

      setTimeout(() => {
        this.loginForm.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
        });
      }, 300);
    }
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      // firstName: ['', [Validators.required]],
      firstName: [''],
      // lastName: ['', [Validators.required]],
      lastName: [''],
      email: [{ value: '', disabled: true }],
    });
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
