import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-trail-searchbar',
  templateUrl: './trail-searchbar.component.html',
  styleUrls: ['./trail-searchbar.component.scss'],
})
export class TrailSearchbarComponent implements OnInit {
  @Output() ionBlur = new EventEmitter<any>();
  @Output() ionCancel = new EventEmitter<any>();
  @Output() ionChange = new EventEmitter<any>();
  @Output() ionClear = new EventEmitter<any>();

  @Input() placeholder: string;
  @Input() showCancelButton: 'always' | 'focus' | 'never';

  constructor() {}

  ngOnInit(): void {}
}
