import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMapMarkerComponent } from './card-map-marker.component';

describe('CardMapMarkerComponent', () => {
  let component: CardMapMarkerComponent;
  let fixture: ComponentFixture<CardMapMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardMapMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMapMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
