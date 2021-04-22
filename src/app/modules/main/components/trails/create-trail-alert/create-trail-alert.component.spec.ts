import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrailAlertComponent } from './create-trail-alert.component';

describe('CreateTrailAlertComponent', () => {
  let component: CreateTrailAlertComponent;
  let fixture: ComponentFixture<CreateTrailAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrailAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrailAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
