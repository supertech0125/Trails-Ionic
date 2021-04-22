import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-trail-alert',
  templateUrl: './create-trail-alert.component.html',
  styleUrls: ['./create-trail-alert.component.scss'],
})
export class CreateTrailAlertComponent implements OnInit {
  @Input() action: string | 'dismiss' | 'save';

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {}

  dismiss() {
    this.modalController.dismiss({
      action: 'continue',
    });
  }

  continue() {
    this.modalController.dismiss();
  }
}
