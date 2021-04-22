import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteFriendsPageRoutingModule } from './invite-friends-routing.module';
import { ComponentsModule } from './../../../../../shared/components/components.module';

import { InviteFriendsPage } from './invite-friends.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    InviteFriendsPageRoutingModule
  ],
  declarations: [InviteFriendsPage]
})
export class InviteFriendsPageModule {}