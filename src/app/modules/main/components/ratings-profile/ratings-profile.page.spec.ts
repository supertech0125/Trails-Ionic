import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RatingsProfilePage } from './ratings-profile.page';

describe('RatingsProfilePage', () => {
  let component: RatingsProfilePage;
  let fixture: ComponentFixture<RatingsProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingsProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RatingsProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
