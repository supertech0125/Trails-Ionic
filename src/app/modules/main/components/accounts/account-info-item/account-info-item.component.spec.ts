import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInfoItemComponent } from './account-info-item.component';

describe('AccountInfoItemComponent', () => {
  let component: AccountInfoItemComponent;
  let fixture: ComponentFixture<AccountInfoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountInfoItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInfoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
