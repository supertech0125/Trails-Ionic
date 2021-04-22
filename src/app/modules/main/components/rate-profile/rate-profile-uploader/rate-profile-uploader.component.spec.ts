import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateProfileUploaderComponent } from './rate-profile-uploader.component';

describe('RateProfileUploaderComponent', () => {
  let component: RateProfileUploaderComponent;
  let fixture: ComponentFixture<RateProfileUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateProfileUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateProfileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
