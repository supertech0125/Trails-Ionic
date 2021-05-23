import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortModalComponent } from './sort-modal.component';

describe('SortModalComponent', () => {
  let component: SortModalComponent;
  let fixture: ComponentFixture<SortModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
