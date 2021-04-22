import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-trail-select-all-none',
  templateUrl: './trail-select-all-none.component.html',
  styleUrls: ['./trail-select-all-none.component.scss'],
})
export class TrailSelectAllNoneComponent {
  @Input() items: any[] = [];
  @Input() label: string;
  @Input() sublabel: string;
  @Input() disabled: boolean | null;
  @Input() selectable: boolean | null;
  @Input() placeholder: string;
  @Input() value: any[] | any | string;
  @Input() selectedText: string;
  @Input() mode: string | undefined;

  @Output() ionClickEv = new EventEmitter<any>();
  @Output() ionChangeEv = new EventEmitter<any>();
  @Output() ionBlurEv = new EventEmitter<any>();
  @Output() ionCancelEv = new EventEmitter<any>();

  interfaceOptions: {
    cssClass: 'trail-select-popover';
  };

  constructor(
    private alertController: AlertController,
    private platform: Platform
  ) {}

  async showAlert() {
    console.log('value: ', this.value);

    let buttons = [
      {
        text: 'Select All',
        cssClass: 'all-none-button',
        handler: () => {
          // check all checkboxes
          alert.inputs = alert.inputs.map((checkbox) => {
            checkbox.checked = true;
            return checkbox;
          });

          return false;
        },
      },
      {
        text: 'Deselect all',
        cssClass: 'all-none-button',
        handler: () => {
          // uncheck all checkboxes
          alert.inputs = alert.inputs.map((checkbox) => {
            checkbox.checked = false;
            return checkbox;
          });

          return false;
        },
      },
      {
        text: 'OK',
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: (data) => {
          this.ionCancelEv.emit(data);
        },
      },
    ];

    // adjust button order in four button layout for ios
    // if (this.platform.is('ios')) {
    //   const okButton = { ...buttons[2] };
    //   const cancelButton = { ...buttons[3] };
    //   buttons = [buttons[0], buttons[1], cancelButton, okButton];
    // }

    const okButton = { ...buttons[2] };
    const cancelButton = { ...buttons[3] };
    buttons = [buttons[0], buttons[1], cancelButton, okButton];

    const alert = await this.alertController.create({
      header: 'Select Option',
      mode: 'ios',
      inputs: this.items.map((item) => {
        const isChecked = this.value.find((val) => val === item.value);
        return {
          label: item.label,
          type: 'checkbox',
          value: item.value,
          checked: isChecked,
        };
      }),
      cssClass: 'four-button-alert',
      buttons: [...buttons],
    });
    alert.onDidDismiss().then((resp) => {
      if (resp.data) {
        this.ionChangeEv.emit({
          target: {
            value: resp.data.values,
          },
        });

        this.ionBlurEv.emit({
          target: {
            value: resp.data.values,
          },
        });
      }
    });
    await alert.present();
  }
}
