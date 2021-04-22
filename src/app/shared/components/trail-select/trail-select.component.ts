import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-trail-select',
  templateUrl: './trail-select.component.html',
  styleUrls: ['./trail-select.component.scss'],
})
export class TrailSelectComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() label: string;
  @Input() sublabel: string;
  @Input() disabled: boolean | null;
  @Input() selectable: boolean | null;
  @Input() placeholder: string;
  @Input() value: string;
  @Input() multiple: boolean | false;
  @Input() selectedText: string;
  // @Input() mode: string | undefined;

  @Output() ionClickEv = new EventEmitter<any>();
  @Output() ionChangeEv = new EventEmitter<any>();
  @Output() ionBlurEv = new EventEmitter<any>();
  @Output() ionCancelEv = new EventEmitter<any>();

  interfaceOptions: {
    cssClass: 'trail-select-popover';
  };

  constructor() {}

  ngOnInit(): void {}
}
