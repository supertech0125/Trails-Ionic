import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-trail-success',
  templateUrl: './create-trail-success.component.html',
  styleUrls: ['./create-trail-success.component.scss'],
})
export class CreateTrailSuccessComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit(): void {}

  dismiss() {
    this.modalController.dismiss();
  }
}
