import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailSelectAllNoneComponent } from './trail-select-all-none.component';

describe('TrailSelectAllNoneComponent', () => {
  let component: TrailSelectAllNoneComponent;
  let fixture: ComponentFixture<TrailSelectAllNoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailSelectAllNoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailSelectAllNoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
