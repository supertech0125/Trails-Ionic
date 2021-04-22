import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailSearchbarComponent } from './trail-searchbar.component';

describe('TrailSearchbarComponent', () => {
  let component: TrailSearchbarComponent;
  let fixture: ComponentFixture<TrailSearchbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailSearchbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
