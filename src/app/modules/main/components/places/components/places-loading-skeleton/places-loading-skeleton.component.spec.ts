import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesLoadingSkeletonComponent } from './places-loading-skeleton.component';

describe('PlacesLoadingSkeletonComponent', () => {
  let component: PlacesLoadingSkeletonComponent;
  let fixture: ComponentFixture<PlacesLoadingSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacesLoadingSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesLoadingSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
