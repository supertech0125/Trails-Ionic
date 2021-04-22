import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import find from 'lodash-es/find';
import { take } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/services/toast.service';
import { APP_FEEDBACK } from '../../../../../shared/constants/utils';
import { IFeedback } from '../../../models/generic.model';
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  feedbackMessage = '';
  maxNumberOfCharacters = 100;
  numberOfCharacters = 0;

  appFeedBackArr = APP_FEEDBACK;
  feedbackOption: string;
  feedbackOptionLabel: string;

  isSubmitting: boolean;

  constructor(
    private mainService: MainService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.isSubmitting = false;
  }

  onKeyUp(event: any): void {
    this.numberOfCharacters = event.target.value.length;
    if (this.numberOfCharacters > this.maxNumberOfCharacters) {
      event.target.value = event.target.value.slice(
        0,
        this.maxNumberOfCharacters
      );
      this.numberOfCharacters = this.maxNumberOfCharacters;
    }
  }

  onSelectFeedback(event: any) {
    console.log('value: ', event.target.value);
    if (event && event.target) {
      this.feedbackOption = event.target.value;

      const feedback = find(this.appFeedBackArr, { id: this.feedbackOption });
      if (feedback) {
        this.feedbackOptionLabel = feedback.label;
      }

      console.log('this.feedbackOptionLabel: ', this.feedbackOptionLabel);
    }
  }

  async sendFeedback() {
    this.isSubmitting = true;

    const loading = await this.loadingController.create();
    loading.present();

    const data: IFeedback = {
      option: this.feedbackOption,
      optionDescription: this.feedbackOptionLabel,
      message: this.feedbackMessage,
    };
    this.mainService.sendAppFeedback(data).then(
      (response: any) => {
        loading.dismiss();
        this.isSubmitting = false;
        if (response && response.statusCode === 200) {
          this.toastService.showSuccess('SUCCESS', response.message);
        }

        setTimeout(() => {
          this.navCtrl.back();
        }, 600);
      },
      (error) => {
        loading.dismiss();
        this.isSubmitting = false;
      }
    );
  }
}
