import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailInputComponent } from './trail-input.component';

describe('TrailInputComponent', () => {
  let component: TrailInputComponent;
  let fixture: ComponentFixture<TrailInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
