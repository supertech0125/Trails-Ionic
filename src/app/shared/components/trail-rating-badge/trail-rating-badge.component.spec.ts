import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailRatingBadgeComponent } from './trail-rating-badge.component';

describe('TrailRatingBadgeComponent', () => {
  let component: TrailRatingBadgeComponent;
  let fixture: ComponentFixture<TrailRatingBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailRatingBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailRatingBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
