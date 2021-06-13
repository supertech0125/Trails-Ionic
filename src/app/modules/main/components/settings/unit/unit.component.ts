import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-distance-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
})
export class UnitComponent implements OnInit {
  @Input() isKM: boolean;

  constructor(private modalController: ModalController) { }

  ngOnInit(): void { }
  
  onSelectKM() {
    this.isKM = true;
  }
  
  onSelectMile() {
    this.isKM = false;
  }

  dismiss() {
    this.modalController.dismiss(this.isKM);
  }
}
