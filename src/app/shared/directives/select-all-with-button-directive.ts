import {
  AfterViewInit,
  ContentChild,
  Directive,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { IonSelect } from '@ionic/angular';
@Directive({
  selector: '[selectAllWithButtonDirective]',
})
export class SelectAllWithButtonDirective implements AfterViewInit, OnInit {
  @ContentChild(IonSelect) ionSelect;
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    console.log('this.ionSelect1: ', this.ionSelect);
    if (this.ionSelect) {
      this.ionSelect.el.style.pointerEvents = 'none';
    }
  }

  ngAfterViewInit() {
    console.log('this.ionSelect2: ', this.ionSelect);
    if (this.ionSelect) {
      this.ionSelect.el.style.pointerEvents = 'none';
    }
  }

  @HostListener('click', ['$event'])
  onClick() {
    this.ionSelect.open().then((alert) => {
      alert.cssClass = 'unset-vertical-buttons';
      alert.buttons = [
        {
          text: 'All',
          handler: () => {
            alert.inputs = alert.inputs.map((checkbox) => {
              checkbox.checked = true;
              return checkbox;
            });
            return false;
          },
        },
        {
          text: 'None',
          handler: () => {
            alert.inputs = alert.inputs.map((checkbox) => {
              checkbox.checked = false;
              return checkbox;
            });
            return false;
          },
        },
        ...alert.buttons,
      ];
    });
  }
}
