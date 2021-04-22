import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesAmbianceComponent } from './places-ambiance.component';

describe('PlacesAmbianceComponent', () => {
  let component: PlacesAmbianceComponent;
  let fixture: ComponentFixture<PlacesAmbianceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacesAmbianceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesAmbianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
