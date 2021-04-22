import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailThemeComponent } from './trail-theme.component';

describe('TrailThemeComponent', () => {
  let component: TrailThemeComponent;
  let fixture: ComponentFixture<TrailThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailThemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
