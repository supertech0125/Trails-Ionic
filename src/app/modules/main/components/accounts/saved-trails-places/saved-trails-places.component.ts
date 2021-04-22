import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  AfterViewChecked,
  NgZone,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-saved-trails-places',
  templateUrl: './saved-trails-places.component.html',
  styleUrls: ['./saved-trails-places.component.scss'],
})
export class SavedTrailsPlacesComponent implements OnInit, OnChanges {
  @Input() action: 'created' | 'trails' | 'places';

  caption: string;
  subCaption: string;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges(): void {
    this.init();
  }

  private init() {
    if (this.action === 'created') {
      this.zone.run(() => {
        this.caption = 'No created trails yet';
        this.subCaption = 'Check this section for updates, trails and more.';
      });
    } else if (this.action === 'trails') {
      this.zone.run(() => {
        this.caption = 'No saved trails yet';
        this.subCaption = 'Check this section for updates, trails and more.';
      });
    } else if (this.action === 'places') {
      this.zone.run(() => {
        this.caption = 'No saved places yet';
        this.subCaption = 'Check this section for updates, places and more.';
      });
    }
  }
}
