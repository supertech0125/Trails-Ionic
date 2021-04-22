import { passwordValidationRegex } from './../../../../shared/constants/utils';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import { ToastService } from './../../../../shared/services/toast.service';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  code: string;
  userId: string;
  email: string;

  loginForm: FormGroup;
  isFormValid = false;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.route.queryParams.subscribe((params) => {
      console.log('params: ', params);
      if (params && params.code) {
        this.code = params.code;
      }

      if (params && params.userId) {
        this.userId = params.userId;
      }

      if (params && params.email) {
        this.email = params.email;
      }
    });
  }

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

  async submitVerifyResetCode() {
    const loading = await this.loadingController.create();
    loading.present();

    const resetFields = {
      code: this.code,
      email: this.email,
      ...this.loginForm.getRawValue(),
    };
    console.log('resetFields: ', resetFields);

    this.authService
      .resetPassword(resetFields)
      .toPromise()
      .then(
        (response) => {
          console.log('resetPassword response: ', response);
          loading.dismiss();
          if (response.statusCode === 200) {
            this.navCtrl.navigateBack('/login');
          } else if (response.statusCode === 400) {
            const message = response.message;
            this.toastService.showAlertMessage('Warning!', message);
            return;
          }
        },
        (error) => {
          console.log('resetPassword error: ', error);
          if (error) {
            const err = error.error;
            console.log('resetPassword err: ', err);
            if (err && err.errors) {
              const errors = err.errors;
              if (errors) {
                this.toastService.showAlertMessage('Warning!', errors[0]);
                return;
              }
            } else if (err && err.message) {
              this.toastService.showAlertMessage('Warning!', err.message);
              return;
            } else if (error && error.message) {
              this.toastService.showAlertMessage('Warning!', error.message);
              return;
            }
          }
        }
      )
      .finally(() => {
        loading.dismiss();
      });
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      oldPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(passwordValidationRegex),
          Validators.minLength(6),
        ],
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(passwordValidationRegex),
          Validators.minLength(6),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(passwordValidationRegex),
          Validators.minLength(6),
          this.checkPasswords.bind(this),
        ],
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

  private checkPasswords(control: FormControl): { [s: string]: boolean } {
    if (this.loginForm) {
      if (control.value !== this.loginForm.controls.newPassword.value) {
        return { passwordNotMatch: true };
      }
    }
    return null;
  }
}
