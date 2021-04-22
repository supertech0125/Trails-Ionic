import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceContactInfoComponent } from './place-contact-info.component';

describe('PlaceContactInfoComponent', () => {
  let component: PlaceContactInfoComponent;
  let fixture: ComponentFixture<PlaceContactInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceContactInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
