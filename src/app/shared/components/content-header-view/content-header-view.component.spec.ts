import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentHeaderViewComponent } from './content-header-view.component';

describe('ContentHeaderViewComponent', () => {
  let component: ContentHeaderViewComponent;
  let fixture: ComponentFixture<ContentHeaderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentHeaderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentHeaderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
