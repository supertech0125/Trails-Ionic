import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  IonContent,
  LoadingController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Subject } from 'rxjs';
import isArray from 'lodash-es/isArray';
import each from 'lodash-es/each';

import { ToastService } from './../../../../shared/services/toast.service';
import { AuthService } from './../../services/auth.service';

import { emailValidationRegex } from './../../../../shared/constants/utils';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  isFormValid = false;
  isSubmitting = false;

  unsubscribe$ = new Subject<any>();

  constructor(
    private plt: Platform,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ionViewDidEnter() {
    this.loginForm.reset();
  }

  ngOnInit(): void {
    this.createForm();
  }

  get f(): any {
    return this.loginForm.controls;
  }

  back() {
    this.navCtrl.back();
  }

  async forgot(event: any) {
    this.isSubmitting = true;

    if (event && event.keyCode === 13 && !this.isFormValid) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    if (this.loginForm.invalid) {
      this.isSubmitting = false;
      this.validateAllFormFields(this.loginForm);
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();

    this.authService
      .forgotPassword(this.loginForm.getRawValue())
      .toPromise()
      .then(
        (response) => {
          console.log('response: ', response);
          if (response && response.statusCode === 200) {
            loading.dismiss();
            this.navCtrl.navigateForward('/verify', {
              queryParams: {
                action: 'reset',
                email: this.loginForm.value.email,
                userId: response.userId,
              },
            });
          } else if (response && response.statusCode === 400) {
            this.toastService.showAlertMessage('Warning!', response.message);
            return;
          }
        },
        (err) => {
          console.log('err: ', err);
          this.isSubmitting = false;
          loading.dismiss();
          if (err) {
            const error = err.error;
            console.log('error: ', error);
            if (error && error.errors) {
              if (isArray(error.errors)) {
                each(error.errors, (row) => {
                  this.toastService.showError('Warning!', row);
                });
              }
            } else if (error && error.message) {
              return this.toastService.showError('Warning!', error.message);
            } else if (error && error.toast) {
              return this.toastService.showToastComponent(error.toast);
            }
          }
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.pattern(emailValidationRegex)],
      ],
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
