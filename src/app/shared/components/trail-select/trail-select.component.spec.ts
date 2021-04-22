import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailSelectComponent } from './trail-select.component';

describe('TrailSelectComponent', () => {
  let component: TrailSelectComponent;
  let fixture: ComponentFixture<TrailSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
