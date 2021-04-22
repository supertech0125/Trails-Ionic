import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailTextareaComponent } from './trail-textarea.component';

describe('TrailTextareaComponent', () => {
  let component: TrailTextareaComponent;
  let fixture: ComponentFixture<TrailTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
