import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTrailsPlacesComponent } from './saved-trails-places.component';

describe('SavedTrailsPlacesComponent', () => {
  let component: SavedTrailsPlacesComponent;
  let fixture: ComponentFixture<SavedTrailsPlacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedTrailsPlacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedTrailsPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
