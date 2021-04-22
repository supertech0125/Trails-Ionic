import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailRatingCommentsComponent } from './trail-rating-comments.component';

describe('TrailRatingCommentsComponent', () => {
  let component: TrailRatingCommentsComponent;
  let fixture: ComponentFixture<TrailRatingCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailRatingCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailRatingCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
