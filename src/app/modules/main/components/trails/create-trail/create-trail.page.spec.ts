import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateTrailPage } from './create-trail.page';

describe('CreateTrailPage', () => {
  let component: CreateTrailPage;
  let fixture: ComponentFixture<CreateTrailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTrailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
