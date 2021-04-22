import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule,
  DefaultRouterStateSerializer,
} from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { JwtModule } from '@auth0/angular-jwt';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { reducers, metaReducers } from './shared/reducers';
import { effectsList } from './shared/reducers/effects';

import { CustomSerializer } from './shared/services/route.serializers.service';
import { TokenInterceptorService } from './shared/services/token-interceptor.service';
import { TRAIL_CURRENT_USER } from './shared/constants/utils';

import { AuthGuard } from './modules/auth/guards/auth.guard';
import { MainGuard } from './modules/main/guards/main.guard';
import { IonicGestureConfig } from './shared/services/IonicGestureConfig';
import { NetworkService } from './shared/services/network.service';

export function tokenGetter() {
  const parseUser = JSON.parse(localStorage.getItem(TRAIL_CURRENT_USER));
  if (parseUser) {
    const token = parseUser.token || parseUser.Token;
    return token;
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      mode: 'ios',
      backButtonIcon: 'chevron-back-outline',
      backButtonText: '',
      swipeBackEnabled: false,
      scrollAssist: false,
      rippleEffect: false,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter,
      },
    }),
    // !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot(effectsList),
    StoreRouterConnectingModule.forRoot({
      serializer: DefaultRouterStateSerializer,
      stateKey: 'router',
    }),
    AppRoutingModule,
  ],
  providers: [
    PhotoViewer,
    CallNumber,
    LaunchNavigator,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
    AuthGuard,
    MainGuard,
    NetworkService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
