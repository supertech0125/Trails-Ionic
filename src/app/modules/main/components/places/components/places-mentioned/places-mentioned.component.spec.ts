import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesMentionedComponent } from './places-mentioned.component';

describe('PlacesMentionedComponent', () => {
  let component: PlacesMentionedComponent;
  let fixture: ComponentFixture<PlacesMentionedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacesMentionedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesMentionedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
