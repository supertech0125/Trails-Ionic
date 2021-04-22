import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit(): void {}

  login() {
    this.navCtrl.navigateForward('/login');
  }

  signUp() {
    this.navCtrl.navigateForward('/register');
  }
}
