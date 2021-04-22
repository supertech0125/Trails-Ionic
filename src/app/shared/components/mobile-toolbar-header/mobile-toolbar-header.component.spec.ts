import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileToolbarHeaderComponent } from './mobile-toolbar-header.component';

describe('MobileToolbarHeaderComponent', () => {
  let component: MobileToolbarHeaderComponent;
  let fixture: ComponentFixture<MobileToolbarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileToolbarHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileToolbarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
