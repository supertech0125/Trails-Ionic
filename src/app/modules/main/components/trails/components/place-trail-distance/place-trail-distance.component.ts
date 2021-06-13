import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PubsubService } from 'src/app/shared/services/pubsub.service';

@Component({
  selector: 'app-place-trail-distance',
  templateUrl: './place-trail-distance.component.html',
  styleUrls: ['./place-trail-distance.component.scss'],
})
export class PlaceTrailDistanceComponent implements OnInit {
  @Input() distance: number;

  isUnitKM: boolean = true;
  Math: any;

  constructor(
    private storage: LocalStorageService,
    private pubsub: PubsubService,
  ) {
    this.pubsub.$sub('APP_MEASUREMENT_UNIT', (data) => {
      this.isUnitKM = data.isKM;
    });

    this.Math = Math;
  }

  ngOnInit(): void {
    const flag = this.storage.getItem('appUnit');
    if(flag === null) this.isUnitKM = true;
    else this.isUnitKM = flag;
  }
}
