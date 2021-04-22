import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailDetailLoadingSkeletonComponent } from './trail-detail-loading-skeleton.component';

describe('TrailDetailLoadingSkeletonComponent', () => {
  let component: TrailDetailLoadingSkeletonComponent;
  let fixture: ComponentFixture<TrailDetailLoadingSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailDetailLoadingSkeletonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailDetailLoadingSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
