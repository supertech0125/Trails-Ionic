import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPermissionComponent } from './location-permission.component';

describe('LocationPermissionComponent', () => {
  let component: LocationPermissionComponent;
  let fixture: ComponentFixture<LocationPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
