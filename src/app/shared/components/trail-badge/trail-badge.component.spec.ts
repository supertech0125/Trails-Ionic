import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailBadgeComponent } from './trail-badge.component';

describe('TrailBadgeComponent', () => {
  let component: TrailBadgeComponent;
  let fixture: ComponentFixture<TrailBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
