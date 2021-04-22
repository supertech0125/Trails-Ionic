import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-trail-place-info-modal',
  templateUrl: './trail-place-info-modal.component.html',
  styleUrls: ['./trail-place-info-modal.component.scss'],
})
export class TrailPlaceInfoModalComponent implements OnInit {
  @Input() place: any = {};
  showCard: boolean;

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {
    this.showCard = false;

    setTimeout(() => {
      this.showCard = true;
    }, 600);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
