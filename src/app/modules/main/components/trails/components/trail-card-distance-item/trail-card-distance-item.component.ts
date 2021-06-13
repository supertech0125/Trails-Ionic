import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PubsubService } from 'src/app/shared/services/pubsub.service';

@Component({
  selector: 'app-trail-card-distance-item',
  templateUrl: './trail-card-distance-item.component.html',
  styleUrls: ['./trail-card-distance-item.component.scss'],
})
export class TrailCardDistanceItemComponent implements OnInit {
  @Input() sumOfAllDistance: number;
  @Input() verified: boolean = false;
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
