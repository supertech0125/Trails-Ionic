import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-trail-share-button',
  templateUrl: './trail-share-button.component.html',
  styleUrls: ['./trail-share-button.component.scss'],
})
export class TrailShareButtonComponent implements OnInit {
  @Output() shareClick = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
}
