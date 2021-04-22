import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailDistanceComponent } from './trail-distance.component';

describe('TrailDistanceComponent', () => {
  let component: TrailDistanceComponent;
  let fixture: ComponentFixture<TrailDistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailDistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
