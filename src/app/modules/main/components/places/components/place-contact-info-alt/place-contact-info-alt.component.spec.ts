import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceContactInfoAltComponent } from './place-contact-info-alt.component';

describe('PlaceContactInfoAltComponent', () => {
  let component: PlaceContactInfoAltComponent;
  let fixture: ComponentFixture<PlaceContactInfoAltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceContactInfoAltComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceContactInfoAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
