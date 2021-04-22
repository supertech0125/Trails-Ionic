import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceCardPhotoComponent } from './place-card-photo.component';

describe('PlaceCardPhotoComponent', () => {
  let component: PlaceCardPhotoComponent;
  let fixture: ComponentFixture<PlaceCardPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceCardPhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceCardPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
