import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailPlacesItemComponent } from './trail-places-item.component';

describe('TrailPlacesItemComponent', () => {
  let component: TrailPlacesItemComponent;
  let fixture: ComponentFixture<TrailPlacesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailPlacesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailPlacesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
