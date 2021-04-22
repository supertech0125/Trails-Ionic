import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailPlacesRatingItemComponent } from './trail-places-rating-item.component';

describe('TrailPlacesRatingItemComponent', () => {
  let component: TrailPlacesRatingItemComponent;
  let fixture: ComponentFixture<TrailPlacesRatingItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailPlacesRatingItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailPlacesRatingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
