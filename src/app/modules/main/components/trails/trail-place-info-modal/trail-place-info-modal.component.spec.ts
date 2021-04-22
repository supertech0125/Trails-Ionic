import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailPlaceInfoModalComponent } from './trail-place-info-modal.component';

describe('TrailPlaceInfoModalComponent', () => {
  let component: TrailPlaceInfoModalComponent;
  let fixture: ComponentFixture<TrailPlaceInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailPlaceInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailPlaceInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
