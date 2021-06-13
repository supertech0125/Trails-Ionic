import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import isEmpty from 'lodash-es/isEmpty';
import { LocalStorageService } from '../../services/local-storage.service';
import { PubsubService } from 'src/app/shared/services/pubsub.service';

@Component({
  selector: 'app-trail-rating-badge',
  templateUrl: './trail-rating-badge.component.html',
  styleUrls: ['./trail-rating-badge.component.scss'],
})
export class TrailRatingBadgeComponent implements OnInit {
  @Input() expand: 'block' | 'full' | undefined;
  @Input() fill: 'clear' | 'default' | 'outline' | 'solid' | undefined;
  @Input() rating: string | null | undefined;
  @Input() color: string | 'white';
  @Input() iconName: string | 'star';

  @Output() ratingClick = new EventEmitter<any>();

  isRate: boolean = true;
  isUnitKM: boolean = true;
  distanceMile: any;
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
    if (isEmpty(this.iconName)) {
      this.iconName = 'star';
    }
    const isDistance = this.rating.indexOf('km');
    const flag = this.storage.getItem('appUnit');
    if(isDistance > -1) {
      this.isRate = false;
      if(flag !== null) {
        const temp: any = this.rating.split(' km')[0];
        this.distanceMile = (Math.round(temp * 6.214) / 10).toFixed(1) + ' mile';
        this.isUnitKM = flag;
      }
      else this.isUnitKM = true;
    }
    else this.isRate = true;
  }
}
