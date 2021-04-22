import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailCardUserItemComponent } from './trail-card-user-item.component';

describe('TrailCardUserItemComponent', () => {
  let component: TrailCardUserItemComponent;
  let fixture: ComponentFixture<TrailCardUserItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailCardUserItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailCardUserItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
