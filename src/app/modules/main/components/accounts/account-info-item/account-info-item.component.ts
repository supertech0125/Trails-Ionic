import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserProfile } from 'src/app/modules/auth/models/auth.model';

@Component({
  selector: 'app-account-info-item',
  templateUrl: './account-info-item.component.html',
  styleUrls: ['./account-info-item.component.scss'],
})
export class AccountInfoItemComponent implements OnInit {
  @Input() currentProfile: UserProfile;
  @Output() editProfileEv = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
}
