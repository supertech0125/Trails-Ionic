import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllTrailsComponent } from './view-all-trails.component';

describe('ViewAllTrailsComponent', () => {
  let component: ViewAllTrailsComponent;
  let fixture: ComponentFixture<ViewAllTrailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllTrailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllTrailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
