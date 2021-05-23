import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteringModalComponent } from './filtering-modal.component';

describe('FilteringModalComponent', () => {
  let component: FilteringModalComponent;
  let fixture: ComponentFixture<FilteringModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteringModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteringModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
