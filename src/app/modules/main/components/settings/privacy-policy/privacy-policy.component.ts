import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit(): void {}

  dismiss() {
    this.modalController.dismiss();
  }
}
