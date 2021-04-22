import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrailSuccessComponent } from './create-trail-success.component';

describe('CreateTrailSuccessComponent', () => {
  let component: CreateTrailSuccessComponent;
  let fixture: ComponentFixture<CreateTrailSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrailSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrailSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
