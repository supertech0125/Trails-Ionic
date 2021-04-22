import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailShareButtonComponent } from './trail-share-button.component';

describe('TrailShareButtonComponent', () => {
  let component: TrailShareButtonComponent;
  let fixture: ComponentFixture<TrailShareButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailShareButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailShareButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
