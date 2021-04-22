import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { createGesture, Gesture, GestureDetail } from '@ionic/core';

@Directive({
  selector: '[appLongPress]',
})
export class LongPressDirective implements OnInit, OnDestroy {
  ionicGesture: Gesture;
  timerId: any;

  @Input() delay: number;
  @Output() longPressed: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.ionicGesture = createGesture({
      el: this.elementRef.nativeElement,
      gestureName: 'longpress',
      threshold: 0,
      canStart: () => true,
      onStart: (gestureEv: GestureDetail) => {
        gestureEv.event.preventDefault();
        this.timerId = setTimeout(() => {
          this.longPressed.emit(gestureEv.event);
        }, this.delay);
      },
      onEnd: () => {
        clearTimeout(this.timerId);
      },
    });
    this.ionicGesture.enable(false);
  }

  ngOnDestroy() {
    this.ionicGesture.destroy();
  }
}
