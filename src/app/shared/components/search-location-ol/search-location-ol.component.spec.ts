import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLocationOlComponent } from './search-location-ol.component';

describe('SearchLocationOlComponent', () => {
  let component: SearchLocationOlComponent;
  let fixture: ComponentFixture<SearchLocationOlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLocationOlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLocationOlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
