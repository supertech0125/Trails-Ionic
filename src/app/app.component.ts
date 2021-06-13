import { Component, HostListener, NgZone } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import includes from 'lodash-es/includes';

import { AuthState } from './modules/auth/store/auth.reducers';
import { isLoggedIn, isLoggedOut } from './modules/auth/store/auth.selectors';

import { DataLoaderService } from './shared/services/data-loader.service';
import { LocalStorageService } from './shared/services/local-storage.service';
import {
  MAX_ITEMS_PER_PAGE,
  TRAIL_CURRENT_USER_GEOLOCATION,
  TRAIL_CURRENT_USER_PROFILE,
  TRAIL_STEP_FILTER,
  TRAIL_STEP_SHOW_SUBTYPES,
  PLACE_SHOW_SUBTYPES,
} from './shared/constants/utils';
import {
  ConnectionStatus,
  NetworkService,
} from './shared/services/network.service';
import { ScreensizeService } from './shared/services/screensize.service';
import { MainState } from './modules/main/store/main.reducer';
import { PlaceTypesAction } from './modules/main/store/PlaceTypes/PlaceTypes.action';
import { PlacesAction } from './modules/main/store/Places/Places.action';
import { BookmarkedsPlacesAction } from './modules/main/store/BookmarkPlaces/BookmarkPlaces.action';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  isDesktop: boolean;

  isGoogleMapApiLoaded: boolean;

  private unsubscribe$ = new Subject<any>();

  constructor(
    private zone: NgZone,
    private platform: Platform,
    private navCtrl: NavController,
    private authstore: Store<AuthState>,
    private mainStore: Store<MainState>,
    private dataLoader: DataLoaderService,
    private storage: LocalStorageService,
    private networkService: NetworkService,
    private screensizeService: ScreensizeService
  ) {
    this.initializeApp();
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event) {
    this.screensizeService.onResize(event.target.innerWidth);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('capacitor') || this.platform.is('cordova')) {
        Plugins.StatusBar.show();
        Plugins.SplashScreen.hide();

        /* ==========================================================================
                                      NETWORK
        ============================================================================= */
        this.networkService.initializeNetwork();

        /* ==========================================================================
                                      DEEP LINKING
        ============================================================================= */
        this.initialDeepLinks();
      }

      this.screensizeService.onResize(this.platform.width());
      this.screensizeService.isDesktopView().subscribe((isDesktop) => {
        if (this.isDesktop && !isDesktop) {
          // Reload because our routing is out of place
          window.location.reload();
        }

        this.isDesktop = isDesktop;
        console.log('this.isDesktop: ', this.isDesktop);
      });

      this.isLoggedIn$ = this.authstore.pipe(select(isLoggedIn));
      this.isLoggedOut$ = this.authstore.pipe(select(isLoggedOut));

      /* ==========================================================================
                                 PRELOAD PUBLIC DATA
        ============================================================================= */
      this.initOnlineData();
    });
  }

  private initialDeepLinks() {
    console.log('initialDeepLinks');
    Plugins.App.addListener('appUrlOpen', (data: any) => {
      console.log('appUrlOpen: ', data);
      if (data && data.url) {
        console.log('data.url: ', data.url);
        this.zone.run(() => {
          if (includes(data.url, 'trailsteps')) {
            const slug = data.url.split('.web.app').pop();
            console.log('slug: ', slug);
            if (slug) {
              if (includes(slug, 'mail-confirmation')) {
                // this.navCtrl.navigateRoot('/mail-confirmation', {
                //   animationDirection: 'forward',
                //   queryParams: {
                //     userId,
                //     code,
                //   },
                // });
              } else {
                this.navCtrl.navigateForward(slug);
              }
            }
          }
        });
      }
    });
  }

  private initOnlineData() {
    const loadThisDataWhenOnline = () => {
      console.log('loadThisDataWhenOnline');
      this.isLoggedIn$.pipe(take(1)).subscribe((response) => {
        if (response) {
          console.log('isLoggedIn: ', response);
          const profile = this.storage.getItem(TRAIL_CURRENT_USER_PROFILE);
          const coordinates = this.storage.getItem(
            TRAIL_CURRENT_USER_GEOLOCATION
          );

          setTimeout(() => {
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

            if (profile) {
              this.dataLoader.getAllCreatedTrails(profile.id, params);
            }

            this.dataLoader.getAllPlaces(params, true, true);
            this.dataLoader.getAllBookmarkedPlaces(params);

            this.dataLoader.getAllTrails({...params, TrailsRange: 'all,verified'}, true, true);
            this.dataLoader.getAllBookmarkedTrails(params);

            this.dataLoader.refreshProfileData();
            this.mainStore.dispatch(PlaceTypesAction());
          }, 1500);

          // Clears filter
          this.storage.removeItem(TRAIL_STEP_FILTER);
          this.storage.removeItem(TRAIL_STEP_SHOW_SUBTYPES);
          this.storage.removeItem(PLACE_SHOW_SUBTYPES);
        }
      });

      /* ==========================================================================
                                 LAZY LOAD GOOGLE MAP
        ============================================================================= */
      // this.initOpenLayerMap();
    };

    const loadThisDataWhenOffline = () => {
      console.log('loadThisDataWhenOffline');
      this.isLoggedIn$.pipe(take(1)).subscribe((response) => {
        if (response) {
          console.log('isLoggedIn: ', response);

          this.dataLoader.offlineRefreshProfileData();
          this.dataLoader.offlineGetPlaceTypes();
          this.dataLoader.offlineGetAllTrails();
          this.dataLoader.offlineGetAllPlaces();
          this.dataLoader.offlineGetAllCreatedTrails();
          this.dataLoader.offlineGetAllBookmarkedTrails();
          // this.dataLoader.offlineGetAllBookmarkedPlaces();
        }
      });
    };

    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online
    ) {
      loadThisDataWhenOnline();
    } else {
      loadThisDataWhenOffline();
    }

    this.networkService
      .onNetworkChange()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((status: ConnectionStatus) => {
        console.log('getCurrentNetworkStatus: ', status);
        if (status === ConnectionStatus.Online) {
          loadThisDataWhenOnline();
        } else {
          loadThisDataWhenOffline();
        }
      });
  }

  // private initOpenLayerMap() {
  //   if (this.isGoogleMapApiLoaded) {
  //     return;
  //   }

  //   get(
  //     'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.5.0/build/ol.js',
  //     () => {
  //       console.log('initGoogleMaps resp: ');
  //       this.isGoogleMapApiLoaded = true;
  //     }
  //   );
  // }
}
