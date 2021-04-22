import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateProfileLoadingSkeletonComponent } from './rate-profile-loading-skeleton.component';

describe('RateProfileLoadingSkeletonComponent', () => {
  let component: RateProfileLoadingSkeletonComponent;
  let fixture: ComponentFixture<RateProfileLoadingSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateProfileLoadingSkeletonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateProfileLoadingSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
