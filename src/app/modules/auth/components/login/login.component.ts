import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { take, tap } from 'rxjs/operators';
import * as momentTZ from 'moment-timezone';
import { Store } from '@ngrx/store';
import isArray from 'lodash-es/isArray';
import each from 'lodash-es/each';

import { UserAccount, UserLogin } from '../../models/auth.model';
import { Login } from '../../store/auth.actions';
import { AppState } from './../../../../shared/reducers';

import {
  emailValidationRegex,
  MAX_ITEMS_PER_PAGE,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from './../../../../shared/constants/utils';

import { AuthService } from '../../services/auth.service';
import { ToastService } from './../../../../shared/services/toast.service';
import { DataLoaderService } from './../../../../shared/services/data-loader.service';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { BookmarkedsPlacesAction } from 'src/app/modules/main/store/BookmarkPlaces/BookmarkPlaces.action';
import { PlaceTypesAction } from 'src/app/modules/main/store/PlaceTypes/PlaceTypes.action';
import { PlacesAction } from 'src/app/modules/main/store/Places/Places.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isFormValid = false;
  isSubmitting = false;
  @ViewChild('ionContent') content: IonContent;

  constructor(
    private store: Store<AppState>,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dataLoader: DataLoaderService,
    private toastService: ToastService,
    private geoService: GeolocationService,
    private storage: LocalStorageService
  ) {}

  ionViewDidEnter() {
    this.geoService.clearLocationRefresh();
    this.loginForm.reset();
  }

  ngOnInit(): void {
    this.createForm();
  }

  get f(): any {
    return this.loginForm.controls;
  }

  showPassword(event: any): void {
    if (event.type === 'text') {
      event.type = 'password';
    } else {
      event.type = 'text';
    }
  }

  back() {
    this.navCtrl.navigateBack('/landing');
  }

  signUp() {
    this.navCtrl.navigateForward('/register');
  }

  async login(event: any) {
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

    const loading = await this.loadingController.create({
      message: 'Signing in...',
    });
    await loading.present();

    const payload: UserLogin = {
      userName: this.loginForm.value.userName,
      password: this.loginForm.value.password,
      timeZone: momentTZ.tz.guess(),
      lastLocalTimeLoggedIn: momentTZ(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };

    this.authService
      .login(payload)
      .pipe(
        tap((resp: UserAccount) => {
          this.store.dispatch(new Login({ user: resp }));
        })
        )
        .toPromise()
        .then(
          (response) => {
            if (response) {
            const coordinates = this.storage.getItem(
              TRAIL_CURRENT_USER_GEOLOCATION
            );

            const loadMoreData = () => {
              loading.message = 'Loading data...';

              let params: any = {
                PageSize: MAX_ITEMS_PER_PAGE,
                Sort: 'distance',
              };

              if (coordinates) {
                params = {
                  ...params,
                  Lat: coordinates.latitude,
                  Long: coordinates.longitude,
                };
              }

              this.dataLoader.getAllPlaces(params, true, true);
              this.dataLoader.getAllBookmarkedPlaces(params);

              this.dataLoader.getAllTrails({...params, TrailsRange: 'all,verified'}, true, true);
              this.dataLoader.getAllBookmarkedTrails();

              this.store.dispatch(PlaceTypesAction());
              this.dataLoader.getAllCreatedTrails(response.id, params);

              setTimeout(() => {
                loading.dismiss();

                this.loginForm.reset();

                this.isSubmitting = false;
                this.navCtrl.navigateForward('/main/places');
              }, 1500);
            };

            this.dataLoader.refreshProfileData().then(
              () => {
                loadMoreData();
              },
              () => {
                loadMoreData();
              }
            );
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
      userName: [
        '',
        [Validators.required, Validators.pattern(emailValidationRegex)],
      ],
      password: [
        '',
        [
          Validators.required,
          // Validators.pattern(passwordValidationRegex),
          Validators.minLength(8),
        ],
      ],
    });
    this.loginForm.reset();
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
