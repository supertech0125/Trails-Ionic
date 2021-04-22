import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailPlacesNoResultFoundComponent } from './trail-places-no-result-found.component';

describe('TrailPlacesNoResultFoundComponent', () => {
  let component: TrailPlacesNoResultFoundComponent;
  let fixture: ComponentFixture<TrailPlacesNoResultFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailPlacesNoResultFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailPlacesNoResultFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
