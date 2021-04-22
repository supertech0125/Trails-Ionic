import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

import { ComponentsModule } from './../../../../shared/components/components.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    LoginRoutingModule,
  ],
})
export class LoginModule {}
