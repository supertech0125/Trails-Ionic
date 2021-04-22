import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateProfileSuccessComponent } from './rate-profile-success.component';

describe('RateProfileSuccessComponent', () => {
  let component: RateProfileSuccessComponent;
  let fixture: ComponentFixture<RateProfileSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateProfileSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateProfileSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
