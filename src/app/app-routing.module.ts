import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './modules/auth/guards/auth.guard';
import { MainGuard } from './modules/main/guards/main.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/auth/components/landing/landing.module').then(
        (m) => m.LandingModule
      ),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import(
        './modules/auth/components/forgot-password/forgot-password.module'
      ).then((m) => m.ForgotPasswordModule),
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/auth/components/login/login.module').then(
        (m) => m.LoginModule
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./modules/auth/components/register/register.module').then(
        (m) => m.RegisterModule
      ),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import(
        './modules/auth/components/reset-password/reset-password.module'
      ).then((m) => m.ResetPasswordModule),
  },
  {
    path: 'verify',
    loadChildren: () =>
      import('./modules/auth/components/verify/verify.module').then(
        (m) => m.VerifyModule
      ),
  },
  {
    path: 'main',
    canActivate: [MainGuard],
    loadChildren: () =>
      import('./modules/main/components/tabs/tabs.module').then(
        (m) => m.TabsPageModule
      ),
  },
  {
    path: 'trail-activity',
    loadChildren: () =>
      import('./modules/main/components/trails/trail-details/trail-details.module').then(
        (m) => m.TrailDetailsModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
