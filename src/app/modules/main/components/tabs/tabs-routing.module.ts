import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'places',
        loadChildren: () =>
          import('../places/places.module').then((m) => m.PlacesPageModule),
      },
      {
        path: 'trails',
        loadChildren: () =>
          import('../trails/trails.module').then((m) => m.TrailsPageModule),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../accounts/accounts.module').then(
            (m) => m.AccountsPageModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/places',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'edit-profile',
    loadChildren: () =>
      import('../accounts/edit-profile/edit-profile.module').then(
        (m) => m.EditProfilePageModule
      ),
  },
  {
    path: 'feedback',
    loadChildren: () =>
      import('../settings/feedback/feedback.module').then(
        (m) => m.FeedbackPageModule
      ),
  },
  // {
  //   path: 'invite-friends',
  //   loadChildren: () =>
  //     import('../settings/invite-friends/invite-friends.module').then(
  //       (m) => m.InviteFriendsPageModule
  //     ),
  // },
  {
    path: 'ratings-profile',
    loadChildren: () =>
      import('../ratings-profile/ratings-profile.module').then(
        (m) => m.RatingsProfilePageModule
      ),
  },
  {
    path: 'rate-profile',
    loadChildren: () =>
      import('../rate-profile/rate-profile.module').then(
        (m) => m.RateProfilePageModule
      ),
  },
  {
    path: 'create-trail',
    loadChildren: () =>
      import('../trails/create-trail/create-trail.module').then(
        (m) => m.CreateTrailPageModule
      ),
  },
  {
    path: 'trail-details',
    loadChildren: () =>
      import('../trails/trail-details/trail-details.module').then(
        (m) => m.TrailDetailsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
