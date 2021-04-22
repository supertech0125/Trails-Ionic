import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailButtonComponent } from './trail-button.component';

describe('TrailButtonComponent', () => {
  let component: TrailButtonComponent;
  let fixture: ComponentFixture<TrailButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
