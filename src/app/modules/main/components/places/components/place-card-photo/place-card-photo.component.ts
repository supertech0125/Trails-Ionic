import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-place-card-photo',
  templateUrl: './place-card-photo.component.html',
  styleUrls: ['./place-card-photo.component.scss'],
})
export class PlaceCardPhotoComponent implements OnInit {
  @Input() place: any = {};

  slideOpts = {
    initialSlide: 0,
    autoPlay: false,
  };

  constructor(private plt: Platform, private photoViewer: PhotoViewer) {}

  ngOnInit(): void {}

  viewPhoto(url: string) {
    if (this.plt.is('cordova') || this.plt.is('capacitor')) {
      this.photoViewer.show(url);
    }
  }
}
