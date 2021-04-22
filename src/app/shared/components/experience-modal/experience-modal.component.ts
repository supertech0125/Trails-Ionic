import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EXPERIENCE_FILTER } from '../../constants/utils';

@Component({
  selector: 'app-experience-modal',
  templateUrl: './experience-modal.component.html',
  styleUrls: ['./experience-modal.component.scss'],
})
export class ExperienceModalComponent implements OnInit {
  experienceFilters = EXPERIENCE_FILTER;

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {}

  dismiss() {
    this.modalController.dismiss();
  }
}
