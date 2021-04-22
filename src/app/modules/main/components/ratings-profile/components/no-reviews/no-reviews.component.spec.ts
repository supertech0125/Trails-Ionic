import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoReviewsComponent } from './no-reviews.component';

describe('NoReviewsComponent', () => {
  let component: NoReviewsComponent;
  let fixture: ComponentFixture<NoReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
