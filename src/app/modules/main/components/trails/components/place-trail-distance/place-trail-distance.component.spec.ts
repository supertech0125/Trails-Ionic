import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceTrailDistanceComponent } from './place-trail-distance.component';

describe('PlaceTrailDistanceComponent', () => {
  let component: PlaceTrailDistanceComponent;
  let fixture: ComponentFixture<PlaceTrailDistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceTrailDistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceTrailDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
