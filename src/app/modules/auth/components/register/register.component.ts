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
import { AuthService } from '../../services/auth.service';
import { ToastService } from './../../../../shared/services/toast.service';

import { UserRegister } from './../../models/auth.model';
import {
  emailValidationRegex,
  passwordValidationRegex,
} from './../../../../shared/constants/utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isFormValid = false;
  isSubmitting = false;

  constructor(
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ionViewDidEnter() {
    this.registerForm.reset();
  }

  ngOnInit(): void {
    this.createForm();
  }

  get f(): any {
    return this.registerForm.controls;
  }

  signIn() {
    this.navCtrl.navigateBack('/login');
  }

  async register(event: any) {
    this.isSubmitting = true;

    if (this.registerForm.invalid) {
      this.isSubmitting = false;
      this.validateAllFormFields(this.registerForm);
      return;
    }

    const loading = await this.loadingController.create();
    loading.present();

    const payload: UserRegister = this.registerForm.getRawValue();

    this.authService
      .registerUser(payload)
      .toPromise()
      .then((response) => {
        console.log('resp: ', response);
        if (response.statusCode === 200) {
          loading.dismiss();
          this.navCtrl.navigateForward('/verify', {
            queryParams: {
              userId: response.userId,
            },
          });
        } else {
          loading.dismiss();
          return this.toastService.showError(
            'Warning!',
            response.message
          );
        }
      })
      .catch((error) => {
        loading.dismiss();
        if (error) {
          const err = error.error;
          if (err && err.errors) {
            const errors = err.errors;
            if (errors) {
              this.toastService.showError('Warning!', errors[0]);
              return;
            }
          } else if (err && err.message) {
            this.toastService.showError('Warning!', err.message);
            return;
          }
        }
      });
  }

  private createForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.pattern(emailValidationRegex)],
      ],
      password: [
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
    if (this.registerForm) {
      if (control.value !== this.registerForm.controls.password.value) {
        return { passwordNotMatch: true };
      }
    }
    return null;
  }
}
