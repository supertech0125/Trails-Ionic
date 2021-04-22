import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailCardComponent } from './trail-card.component';

describe('TrailCardComponent', () => {
  let component: TrailCardComponent;
  let fixture: ComponentFixture<TrailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
