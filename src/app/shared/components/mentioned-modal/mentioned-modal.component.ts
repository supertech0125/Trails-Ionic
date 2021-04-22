import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mentioned-modal',
  templateUrl: './mentioned-modal.component.html',
  styleUrls: ['./mentioned-modal.component.scss'],
})
export class MentionedModalComponent implements OnInit {
  @Input() mentionedIn: any[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {}

  dismiss() {
    this.modalController.dismiss();
  }
}
