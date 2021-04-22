import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailCardDistanceItemComponent } from './trail-card-distance-item.component';

describe('TrailCardDistanceItemComponent', () => {
  let component: TrailCardDistanceItemComponent;
  let fixture: ComponentFixture<TrailCardDistanceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailCardDistanceItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailCardDistanceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
