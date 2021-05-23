import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailSelectingComponent } from './trail-selecting.component';

describe('TrailSelectingComponent', () => {
  let component: TrailSelectingComponent;
  let fixture: ComponentFixture<TrailSelectingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailSelectingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailSelectingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
