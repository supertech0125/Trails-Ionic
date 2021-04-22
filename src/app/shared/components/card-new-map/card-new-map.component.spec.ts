import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardNewMapComponent } from './card-new-map.component';

describe('CardNewMapComponent', () => {
  let component: CardNewMapComponent;
  let fixture: ComponentFixture<CardNewMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardNewMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardNewMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
