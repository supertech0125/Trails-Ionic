import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLocationModalComponent } from './search-location-modal.component';

describe('SearchLocationModalComponent', () => {
  let component: SearchLocationModalComponent;
  let fixture: ComponentFixture<SearchLocationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLocationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
