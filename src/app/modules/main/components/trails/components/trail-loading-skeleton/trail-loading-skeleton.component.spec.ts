import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailLoadingSkeletonComponent } from './trail-loading-skeleton.component';

describe('TrailLoadingSkeletonComponent', () => {
  let component: TrailLoadingSkeletonComponent;
  let fixture: ComponentFixture<TrailLoadingSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailLoadingSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailLoadingSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
