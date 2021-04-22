import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ForgotPasswordComponent } from './forgot-password.component';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    ForgotPasswordRoutingModule,
  ],
})
export class ForgotPasswordModule {}
