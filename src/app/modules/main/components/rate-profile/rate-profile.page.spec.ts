import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RateProfilePage } from './rate-profile.page';

describe('RateProfilePage', () => {
  let component: RateProfilePage;
  let fixture: ComponentFixture<RateProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RateProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
