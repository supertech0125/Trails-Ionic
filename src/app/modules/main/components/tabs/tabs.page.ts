import { Component } from '@angular/core';
import { PermissionType, Plugins, PermissionResult } from '@capacitor/core';
import { ModalController, Platform } from '@ionic/angular';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import {
  MAX_ITEMS_PER_PAGE,
  TRAIL_CURRENT_USER_GEOLOCATION,
} from 'src/app/shared/constants/utils';
import { DataLoaderService } from 'src/app/shared/services/data-loader.service';
import { ScreensizeService } from 'src/app/shared/services/screensize.service';
import { NavigationEnd, Router } from '@angular/router';

import { LocationPermissionComponent } from './../../../../shared/components/location-permission/location-permission.component';

const { Permissions } = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  tabsPlacement = 'bottom';
  tabsLayout = 'icon-top';
  isDesktop: boolean;

  isUrlPlaces = false;
  isUrlTrails = false;
  isUrlAccount = false;
  isUrlSettings = false;

  constructor(
    private router: Router,
    private platform: Platform,
    private modalController: ModalController,
    private geoService: GeolocationService,
    private storage: LocalStorageService,
    private dataLoader: DataLoaderService,
    private screensizeService: ScreensizeService
  ) {
    if (this.platform.is('desktop')) {
      this.tabsPlacement = 'top';
      this.tabsLayout = 'icon-left';
    }

    this.screensizeService.isDesktopView().subscribe(isDesktop => {
      if (this.isDesktop && !isDesktop) {
        // Reload because our routing is out of place
        window.location.reload();
      }

      this.isDesktop = isDesktop;
    });

    this.router.events.subscribe((event: any) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      const url = this.router.url;
      if (url.includes('places')) {
        this.isUrlPlaces = true;
        this.isUrlTrails = false;
        this.isUrlAccount = false;
        this.isUrlSettings = false;

      } else if (url.includes('trails')) {
        this.isUrlTrails = true;
        this.isUrlPlaces = false;
        this.isUrlAccount = false;
        this.isUrlSettings = false;
      } else if (url.includes('account')) {
        this.isUrlTrails = false;
        this.isUrlPlaces = false;
        this.isUrlAccount = true;
        this.isUrlSettings = false;
      } else if (url.includes('settings')) {
        this.isUrlTrails = false;
        this.isUrlPlaces = false;
        this.isUrlAccount = false;
        this.isUrlSettings = true;
      }
    });
  }

  ionViewDidEnter() {
    if (this.platform.is('desktop')) {
      this.tabsPlacement = 'top';
      this.tabsLayout = 'icon-left';
    }

    const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    Permissions.query({
      name: PermissionType.Geolocation,
    }).then(
      (resp: PermissionResult) => {
        if (resp.state === 'prompt') {
          this.showLocationPermission();
        } else if (resp.state === 'granted') {
          if (coordinates) {
            this.geoService.initLocationRefresh();
          } else {
            this.showLocationPermission();
          }
        }
      },
      (error) => {
        console.log('Permissions Geolocation err: ', error);
      }
    );
  }

  private async showLocationPermission() {
    const modal = await this.modalController.create({
      component: LocationPermissionComponent,
      backdropDismiss: false,
      keyboardClose: false,
      cssClass: 'modal-fullscreen',
    });
    modal.onDidDismiss().then(() => {
      const coordinates = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
      if (coordinates) {
        this.dataLoader.getAllPlaces({
          PageSize: MAX_ITEMS_PER_PAGE,
          Lat: coordinates.latitude,
          Long: coordinates.longitude,
          Sort: 'distance',
        });
        this.dataLoader.getAllTrails({
          PageSize: MAX_ITEMS_PER_PAGE,
          Lat: coordinates.latitude,
          Long: coordinates.longitude,
          Sort: 'distance',
          TrailsRange: 'all,verified'
        });
      }
    });
    modal.present();
  }
}
