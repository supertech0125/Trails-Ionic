import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-trail-save-bookmark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trail-save-bookmark.component.html',
  styleUrls: ['./trail-save-bookmark.component.scss'],
})
export class TrailSaveBookmarkComponent implements OnInit {
  @Output() bookmarkClick = new EventEmitter<any>();
  @Input() isActive: boolean;
  @Input() isLoading: boolean;

  constructor() {}

  ngOnInit(): void {}
}
