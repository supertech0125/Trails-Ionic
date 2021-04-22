import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceServicesComponent } from './place-services.component';

describe('PlaceServicesComponent', () => {
  let component: PlaceServicesComponent;
  let fixture: ComponentFixture<PlaceServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
