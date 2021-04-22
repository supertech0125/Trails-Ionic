import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopToolbarHeaderComponent } from './desktop-toolbar-header.component';

describe('DesktopToolbarHeaderComponent', () => {
  let component: DesktopToolbarHeaderComponent;
  let fixture: ComponentFixture<DesktopToolbarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopToolbarHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopToolbarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
