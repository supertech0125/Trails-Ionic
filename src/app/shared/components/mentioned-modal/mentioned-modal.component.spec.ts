import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionedModalComponent } from './mentioned-modal.component';

describe('MentionedModalComponent', () => {
  let component: MentionedModalComponent;
  let fixture: ComponentFixture<MentionedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentionedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentionedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
