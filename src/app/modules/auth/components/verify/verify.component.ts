import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import isEmpty from 'lodash-es/isEmpty';

import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  verifyCode: string;
  userId: string;
  email: string;
  action: string;

  isSubmitting: boolean;

  constructor(
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.route.queryParams.subscribe((params) => {
      console.log('params: ', params);
      if (params && params.action) {
        this.action = params.action;
      }

      if (params && params.userId) {
        this.userId = params.userId;
      }

      if (params && params.email) {
        this.email = params.email;
      }
    });
  }

  ngOnInit(): void {}

  onCodeCompleted(code: string) {
    this.verifyCode = code;
  }

  submitResendCode() {
    if (this.action === 'reset') {
      this.resendVerifyForgotCode();
    } else {
      this.resendVerifyCode();
    }
  }

  submitVerification() {
    if (this.action === 'reset') {
      this.submitVerifyResetCode();
    } else {
      this.submitVerifyUserCode();
    }
  }

  private async resendVerifyCode() {
    if (isEmpty(this.userId)) {
      return this.toastService.showAlertMessage(
        'Warning!',
        'User ID is missing!'
      );
    }

    const loading = await this.loadingController.create();
    loading.present();

    this.authService
      .resendCode(this.userId)
      .toPromise()
      .then((response) => {
        console.log('verifyUser response: ', response);
        const resp = response.data;
        if (response.ok && response.status === 200) {
          let message = '';
          let header = '';
          if (resp.statusCode === 200) {
            header = 'Info!';
            message = resp.message;
          } else if (resp.statusCode === 400) {
            header = 'Warning!';
            message = resp.message;
          }
          this.toastService.showAlertMessage(header, message);
          return;
        } else {
          loading.dismiss();
        }
      })
      .catch((error) => {
        console.log('verifyUser err: ', error);
        if (error) {
          const err = error.error;
          if (err && err.errors) {
            const errors = err.errors;
            if (errors) {
              this.toastService.showAlertMessage('Warning!', errors[0]);
              return;
            }
          } else if (err && err.message) {
            this.toastService.showAlertMessage('Warning!', err.message);
            return;
          }
        }
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  private async resendVerifyForgotCode() {
    if (isEmpty(this.email)) {
      return this.toastService.showAlertMessage(
        'Warning!',
        'Please enter Email Address!'
      );
    }

    const loading = await this.loadingController.create();
    loading.present();

    this.authService
      .resendForgotCode(this.email)
      .toPromise()
      .then((response) => {
        console.log('resendForgotCode response: ', response);
        const resp = response.data;
        if (response.ok && response.status === 200) {
          let message = '';
          let header = '';
          if (resp.statusCode === 200) {
            header = 'Info!';
            message = resp.message;
          } else if (resp.statusCode === 400) {
            header = 'Warning!';
            message = resp.message;
          }
          this.toastService.showAlertMessage(header, message);
          return;
        } else {
          loading.dismiss();
        }
      })
      .catch((error) => {
        console.log('verifyUser err: ', error);
        if (error) {
          const err = error.error;
          if (err && err.errors) {
            const errors = err.errors;
            if (errors) {
              this.toastService.showAlertMessage('Warning!', errors[0]);
              return;
            }
          } else if (err && err.message) {
            this.toastService.showAlertMessage('Warning!', err.message);
            return;
          }
        }
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  private async submitVerifyUserCode() {
    if (isEmpty(this.userId)) {
      return this.toastService.showAlertMessage(
        'Warning!',
        'User ID is missing!'
      );
    }

    if (isEmpty(this.verifyCode)) {
      return this.toastService.showAlertMessage(
        'Warning!',
        'Please enter Verification Code!'
      );
    }

    const loading = await this.loadingController.create();
    loading.present();

    this.authService
      .verifyUser({
        userId: this.userId,
        verificationCode: this.verifyCode,
      })
      .toPromise()
      .then((response) => {
        console.log('resp: ', response);
        if (response.statusCode === 200) {
          loading.dismiss();
          this.toastService
            .showSuccess(
              'Verification Success!',
              'We sucessfully verified your account. You can no proceed to login'
            )
            .then(() => {
              this.navCtrl.navigateBack('/login');
            });
        } else if (response.statusCode === 400) {
          loading.dismiss();
          const message = response.message;
          this.toastService.showAlertMessage('Warning!', message, () => {
            this.navCtrl.navigateBack('/login');
          });
          return;
        }
      })
      .catch((error) => {
        loading.dismiss();
        if (error) {
          const err = error.error;
          console.log('error: ', error);
          if (err && err.errors) {
            const errors = err.errors;
            if (errors) {
              this.toastService.showAlertMessage('Warning!', errors[0]);
              return;
            }
          } else if (err && err.message) {
            this.toastService.showAlertMessage('Warning!', err.message, () => {
              this.navCtrl.navigateBack('/login');
            });
            return;
          }
        }
      });
  }

  private async submitVerifyResetCode() {
    if (isEmpty(this.email)) {
      return this.toastService.showAlertMessage(
        'Warning!',
        'Please enter Email Address!'
      );
    }

    if (isEmpty(this.verifyCode)) {
      return this.toastService.showAlertMessage(
        'Warning!',
        'Please enter Verification Code!'
      );
    }

    const loading = await this.loadingController.create();
    loading.present();

    this.authService
      .verifyResetPassword(this.email, this.verifyCode)
      .toPromise()
      .then((response: any) => {
        console.log('resp: ', response);
        loading.dismiss();
        this.navCtrl.navigateBack('/reset-password', {
          queryParams: {
            userId: response.userId,
            code: this.verifyCode,
            email: this.email,
          },
        });
      })
      .catch((error) => {
        loading.dismiss();
        if (error) {
          const err = error.error;
          console.log('error: ', error);
          if (err && err.errors) {
            const errors = err.errors;
            if (errors) {
              this.toastService.showAlertMessage('Warning!', errors[0]);
              return;
            }
          } else if (err && err.message) {
            this.toastService.showAlertMessage('Warning!', err.message, () => {
              this.navCtrl.navigateBack('/login');
            });
            return;
          }
        }
      });
  }
}
