import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedPlacesDistanceComponent } from './saved-places-distance.component';

describe('SavedPlacesDistanceComponent', () => {
  let component: SavedPlacesDistanceComponent;
  let fixture: ComponentFixture<SavedPlacesDistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedPlacesDistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedPlacesDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
