import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceTrailCardComponent } from './place-trail-card.component';

describe('PlaceCardComponent', () => {
  let component: PlaceTrailCardComponent;
  let fixture: ComponentFixture<PlaceTrailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceTrailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceTrailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
