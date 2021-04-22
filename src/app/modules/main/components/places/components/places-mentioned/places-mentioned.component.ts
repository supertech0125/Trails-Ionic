import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { MentionedModalComponent } from './../../../../../../shared/components/mentioned-modal/mentioned-modal.component';

@Component({
  selector: 'app-places-mentioned',
  templateUrl: './places-mentioned.component.html',
  styleUrls: ['./places-mentioned.component.scss'],
})
export class PlacesMentionedComponent implements OnInit {
  @Input() mentionedIn: any[] = [];
  @Input() place: any = {};

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {}

  async viewMentioned() {
    const modal = await this.modalController.create({
      component: MentionedModalComponent,
      componentProps: {
        place: this.place,
        mentionedIn: this.mentionedIn,
      },
      cssClass: 'modal-topsmallscreen',
    });
    modal.present();
  }
}
