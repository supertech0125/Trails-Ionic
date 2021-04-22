import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailSaveBookmarkComponent } from './trail-save-bookmark.component';

describe('TrailSaveBookmarkComponent', () => {
  let component: TrailSaveBookmarkComponent;
  let fixture: ComponentFixture<TrailSaveBookmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailSaveBookmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailSaveBookmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
