import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import each from 'lodash-es/each';
// import filter from 'lodash-es/filter';
// import find from 'lodash-es/find';
// import isEmpty from 'lodash-es/isEmpty';
import flatten from 'lodash-es/flatten';
// import size from 'lodash-es/size';
// import lowerCase from 'lodash-es/lowerCase';
// import split from 'lodash-es/split';
// import upperFirst from 'lodash-es/upperFirst';

import { Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

// import { ExperienceModalComponent } from '../experience-modal/experience-modal.component';

import {
  PLACES_FILTERS,
  TRAIL_FILTERS,
  TRAIL_THEME,
  TRAIL_DETAILS_FILTER_TIME,
  TRAIL_DETAILS_FILTER_WITH,
} from '../../constants/utils';
import { LocalStorageService } from '../../services/local-storage.service';
import { MainState } from 'src/app/modules/main/store/main.reducer';
import { trailFilterSelector, placeFilterSelector, addTrailStepFilterSelector } from '../../../modules/main/store/main.selector';
import { placeTypesSelectorState } from 'src/app/modules/main/store/PlaceTypes/PlaceTypes.store';

@Component({
  selector: 'app-filtering-modal',
  templateUrl: './filtering-modal.component.html',
  styleUrls: ['./filtering-modal.component.scss'],
})
export class FilteringModalComponent implements OnInit {
  @Input() action: string;

  typeOfPlacesArr = PLACES_FILTERS.items;
  typeOfTrailsArr = TRAIL_FILTERS.items;
  trailTheme = TRAIL_THEME;
  filterDetailsTime = TRAIL_DETAILS_FILTER_TIME;
  filterDetailsWith = TRAIL_DETAILS_FILTER_WITH;
  placeTypeArr: any[] = [];
  placeSubTypeArr: any[] = [];

  placeAllTypes: any[] = [];
  placeAllSubTypes: any[] = [];

  unsubscribe = new Subject<any>();

  // Setting defaults

  trail: string[] = [];
  place: string[] = [];
  theme: string[] = [];
  placeType: string[] = [];
  placeSubType: string[] = [];
  when: string[] = [];
  who: string[] = [];

  isSelectAllPlaces: boolean = false;
  isSelectAllCuisines: boolean = false;
  isSelectAllThemes: boolean = false;

  stepRange: any = { lower: 2, upper: 8 };
  distanceRange: any = { lower: 1, upper: 10 };

  constructor(
    private mainStore: Store<MainState>,
    private modalController: ModalController,
    private storage: LocalStorageService
  ) { }

  ngOnInit(): void {
    const a$ = combineLatest([
      this.mainStore.select(placeTypesSelectorState),
      this.mainStore.select(placeFilterSelector),
      this.mainStore.select(trailFilterSelector),
      this.mainStore.select(addTrailStepFilterSelector),
    ])
      .pipe(
        takeUntil(this.unsubscribe),
        map((res) => res)
      )
      .subscribe((response) => {
        if (response) {
          const placeTypeArr: any[] = [...response[0].placeTypes];
          this.placeTypeArr = placeTypeArr.map((type) => {
            this.placeAllTypes.push(type.id);
            return {
              ...type,
              value: type.value,
              label: type.type,
            };
          });
          const placeSubTypeArr = flatten(
            this.placeTypeArr.map((type) => {
              return type.subTypes;
            })
          );
          this.placeSubTypeArr = placeSubTypeArr.map((row) => {
            this.placeAllSubTypes.push(row.id);
            return {
              ...row,
              value: row.value,
              label: row.subType,
            };
          });

          if (response[1] && this.action === 'place') {
            this.setFilterOptions(response[1]);
          }
          else if (this.action === 'place') {
            this.setFilterOptions({
              place: 'all',
              placeType: 'all',
              placeSubType: 'all'
            })
          }
          if (response[2] && this.action === 'trail') {
            this.setFilterOptions(response[2]);
          }
          else if (this.action === 'trail') {
            this.setFilterOptions({
              trail: 'all,verified',
              theme: 'all',
              placeType: 'all',
              placeSubType: 'all',
              when: 'all',
              who: 'all',
            })
          }
          if (response[3] && this.action === 'addTrailStep') {
            this.setFilterOptions(response[3]);
          }
          else if (this.action === 'addTrailStep') {
            this.setFilterOptions({
              place: 'all',
              placeType: 'all',
              placeSubType: 'all'
            })
          }
        }
      });
  }

  private setFilterOptions = (data: any) => {
    let temp: any = [];
    if (data.placeType === 'all') {
      this.placeType = [...this.placeAllTypes];
      this.isSelectAllPlaces = true;
    }
    else {
      temp = data.placeType.split(',');
      temp.map((a: any) => {
        this.placeTypeArr.map(row => {
          if (row.label === a) this.placeType.push(row.id);
        })
      });
    }
    if (data.placeSubType === 'all') {
      this.placeSubType = [...this.placeAllSubTypes];
      this.isSelectAllCuisines = true;
    }
    else {
      temp = data.placeSubType.split(',');
      temp.map((a: any) => {
        this.placeSubTypeArr.map(row => {
          if (row.label === a) this.placeSubType.push(row.id);
        })
      });
    }
    temp = [];

    if (this.action === 'place' || this.action === 'addTrailStep') {
      this.place = data.place.split(',');
    }

    if (this.action === 'trail') {
      this.trail = data.trail.split(',');
      if (data.theme === 'all') {
        this.isSelectAllThemes = true;
        this.theme = [];
        this.trailTheme.map((row: any) => {
          this.theme.push(row.id);
        })
      }
      else this.theme = data.theme.split(',');

      if (data.when === 'all') {
        this.when = [];
        this.filterDetailsTime.items.map((row: any) => {
          this.when.push(row.id);
        })
      }
      else this.when = data.when.split(',');

      if (data.who === 'all') {
        this.who = [];
        this.filterDetailsWith.items.map((row: any) => {
          this.who.push(row.id);
        })
      }
      else this.who = data.who.split(',');
    }
  }

  ionViewWillLeave() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  clearAllThemes() {
    if (this.isSelectAllThemes) {
      this.theme = [];
      this.placeType = [];
      this.placeSubType = [];
    }
    else {
      this.theme = [];
      this.trailTheme.map((row: any) => {
        this.theme.push(row.id);
      })
      this.placeType = [...this.placeAllTypes];
      this.placeSubType = [...this.placeAllSubTypes];
    }
    this.isSelectAllThemes = this.isSelectAllPlaces = this.isSelectAllCuisines = !this.isSelectAllThemes;
  }

  clearAllTypes() {
    if (this.isSelectAllPlaces) {
      this.placeType = [];
      this.placeSubType = [];
      this.theme = [];
    }
    else {
      this.placeType = [...this.placeAllTypes];
      this.placeSubType = [...this.placeAllSubTypes];
      this.theme = [];
      this.trailTheme.map(theme => {
        this.theme.push(theme.id);
      })
    }
    this.isSelectAllPlaces = this.isSelectAllThemes = this.isSelectAllCuisines = !this.isSelectAllPlaces;
  }

  clearAllCuisines() {
    let temp: any = 1;
    let index = this.placeType.indexOf(temp);

    if (this.isSelectAllCuisines) {
      this.placeSubType = [];

      if (index > -1) {
        this.placeType.splice(index, 1);

        let dinnerIndex = this.theme.indexOf('dinner');
        if (dinnerIndex > -1) this.theme.splice(dinnerIndex, 1);
        let lunchIndex = this.theme.indexOf('lunch');
        if (lunchIndex > -1) this.theme.splice(lunchIndex, 1);

        if (!this.placeType.length) {
          this.isSelectAllPlaces = this.isSelectAllThemes = false;
        }
      }
    }
    else {
      this.placeSubType = [...this.placeAllSubTypes];
      if (index < 0) {
        this.placeType.push(temp);
        this.theme.push('dinner');
        this.theme.push('lunch');

        if (this.placeType.length === this.placeAllTypes.length) {
          this.isSelectAllPlaces = this.isSelectAllThemes = true;
        }
      }
    }
    this.isSelectAllCuisines = !this.isSelectAllCuisines;
  }

  reset() {
    if (this.action === 'place' || this.action === 'addTrailStep') {
      this.setFilterOptions({
        place: 'all',
        placeType: 'all',
        placeSubType: 'all'
      })
    }
    if (this.action === 'trail') {
      this.setFilterOptions({
        trail: 'all,verified',
        theme: 'all',
        placeType: 'all',
        placeSubType: 'all',
        when: 'all',
        who: 'all',
      })
    }
    this.isSelectAllPlaces = true;
    this.isSelectAllCuisines = true;
    this.isSelectAllThemes = true;
  }

  updateFilter() {
    let isFiltering = false;
    let filter: any;
    let placeType: string = '';
    let placeSubType: string = '';
    let tmp = [];
    this.placeType.map(data => {
      this.placeTypeArr.map(row => {
        if (row.id === data) tmp.push(row.label);
      })
    });
    placeType = tmp.join(',');
    tmp = [];

    this.placeSubType.map(data => {
      this.placeSubTypeArr.map(row => {
        if (row.id === data) tmp.push(row.label);
      })
    });
    placeSubType = tmp.join(',');
    tmp = [];

    let temp = {
      placeType: !placeType ? 'all' : (this.placeType.length === this.placeAllTypes.length) ? 'all' : placeType,
      placeSubType: !placeSubType ? placeSubType==='' ? '' : 'all' : (this.placeSubType.length === this.placeAllSubTypes.length) ? 'all' : placeSubType,
    }
    if (this.action === 'place' || this.action === 'addTrailStep') {
      filter = { ...temp, place: !this.place.length ? 'all' : (this.place[0] === 'all') ? 'all' : this.place.join(',') };
      isFiltering = !((filter.placeType === 'all') &&
        (filter.placeSubType === 'all') &&
        (filter.place === 'all'));
    }
    if (this.action === 'trail') {
      filter = {
        ...temp,
        trail: !this.trail.length ? 'all' : (this.trail[0] === 'all' && this.trail.length === 1) ? 'all' : this.trail.join(','),
        theme: !this.theme.length ? 'all' : this.theme.length === this.trailTheme.length ? 'all' : this.theme.join(','),
        when: !this.when.length ? 'all' : this.when.length === this.filterDetailsTime.items.length ? 'all' : this.when.join(','),
        who: !this.who.length ? 'all' : this.who.length === this.filterDetailsWith.items.length ? 'all' : this.who.join(','),
      };
      isFiltering = !((filter.placeType === 'all') &&
        (filter.placeSubType === 'all') &&
        ((filter.trail === 'all,verified') || (filter.trail === 'verified,all')) &&
        (filter.theme === 'all') &&   // this might occur issue because 'dinner' & 'lunch' have the same type('restaurant')
        (filter.when === 'all') &&
        (filter.who === 'all'));
    }

    this.modalController.dismiss({
      filter: filter,
      isFiltering: isFiltering,
    });
  }

  changeItems = (data: any) => {
    if (data.action !== 'addTrailStep') this[data.action] = data.data;
    else this.place = data.data;

    if (data.action === 'placeType') {
      if (this.placeType.length === this.placeTypeArr.length) {
        this.isSelectAllPlaces = this.isSelectAllThemes = this.isSelectAllCuisines = true;
      }
      if (this.placeType.length === 0) {
        this.isSelectAllPlaces = this.isSelectAllThemes = this.isSelectAllCuisines = false;
      }

      // when parent status is changed, child status should be changed along the parent status
      if (data.changedParentData) {
        if (data.changedParentData.flag) {
          this.placeSubType = [];
          this.isSelectAllCuisines = false;

          let dinnerIndex = this.theme.indexOf('dinner');
          if (dinnerIndex > -1) this.theme.splice(dinnerIndex, 1);
          let lunchIndex = this.theme.indexOf('lunch');
          if (lunchIndex > -1) this.theme.splice(lunchIndex, 1);
        }
        else {
          this.placeSubType = [...this.placeAllSubTypes];
          this.isSelectAllCuisines = true;

          let dinnerIndex = this.theme.indexOf('dinner');
          if (dinnerIndex < 0) this.theme.push('dinner');
          let lunchIndex = this.theme.indexOf('lunch');
          if (lunchIndex < 0) this.theme.push('lunch');
        }
      }
      else {
        this.theme = [];
        data.data.map((a: any) => {
          this.trailTheme.map((b: any) => {
            if (b.child.indexOf(a) > -1) this.theme.push(b.id);
          })
        })
      }
    }
    if (data.action === 'placeSubType') {
      if (this.placeSubType.length > 0) {
        let temp: any = 1;
        let index = this.placeType.indexOf(temp); // check if placeType has 'restaurant' or not
        if (index === -1) {
          this.placeType.push(temp);
          if (this.theme.indexOf('dinner') < 0 && this.theme.indexOf('lunch') < 0) {
            this.theme.push('lunch');
            this.theme.push('dinner');
          }
          if (this.placeType.length === this.placeAllTypes.length) {
            this.isSelectAllPlaces = true;
            this.isSelectAllThemes = true;
          }
        }
        if (this.placeSubType.length === this.placeSubTypeArr.length) {
          this.isSelectAllCuisines = true;
        }
      }
      if (this.placeSubType.length === 0) {
        this.isSelectAllCuisines = false;

        let temp: any = 1;
        let index = this.placeType.indexOf(temp);
        if (index > -1) this.placeType.splice(index, 1);
        if (!this.placeType.length) {
          this.theme = [];
          this.isSelectAllPlaces = this.isSelectAllThemes = false;
        }
      }
    }
    if (data.action === 'theme') {
      if (this.theme.length === 0) {
        this.isSelectAllThemes = this.isSelectAllPlaces = this.isSelectAllCuisines = false;
      }
      if (this.theme.length === this.trailTheme.length) {
        this.isSelectAllThemes = this.isSelectAllPlaces = this.isSelectAllCuisines = true;
      }

      // when theme is changed, the status of type and subType should be changed
      let changedParentData = data.changedParentData;
      if (changedParentData) {
        this.trailTheme.map((theme: any) => {
          if (changedParentData.id === theme.id) {
            if (changedParentData.id === 'dinner' || changedParentData.id === 'lunch') {
              if (this.theme.indexOf('dinner') === -1 && this.theme.indexOf('lunch') === -1 && changedParentData.flag) {
                let index = this.placeType.indexOf(theme.child[0]);
                this.placeType.splice(index, 1);

                this.placeSubType = [];
                this.isSelectAllCuisines = false;
              }
              if (!changedParentData.flag && !(this.theme.indexOf('dinner') > -1 && this.theme.indexOf('lunch') > -1)) {
                this.placeType.push(theme.child[0]);

                this.placeSubType = [...this.placeAllSubTypes];
                this.isSelectAllCuisines = true;
              }
            }
            else {
              theme.child.map(child => {
                if (changedParentData.flag) {
                  let index = this.placeType.indexOf(child);
                  this.placeType.splice(index, 1);
                }
                else this.placeType.push(child);
              })
            }
          }
        });

      }
    }
  }

  changeStepRange = (evt: any) => {
    this.stepRange = evt.target.value;
  }
  
  changeDistanceRange = (evt: any) => {
    this.distanceRange = evt.target.value;
  }

}
