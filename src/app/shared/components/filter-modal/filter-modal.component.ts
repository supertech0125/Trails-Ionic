import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import each from 'lodash-es/each';
import filter from 'lodash-es/filter';
import find from 'lodash-es/find';
import isEmpty from 'lodash-es/isEmpty';
import flatten from 'lodash-es/flatten';
import size from 'lodash-es/size';
import lowerCase from 'lodash-es/lowerCase';
import split from 'lodash-es/split';
import upperFirst from 'lodash-es/upperFirst';

import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { ExperienceModalComponent } from './../experience-modal/experience-modal.component';

import {
  PLACES_FILTERS,
  TRAIL_FILTERS,
  TRAIL_DETAILS_FILTER_TIME,
  TRAIL_DETAILS_FILTER_WITH,
  TRAIL_STEP_FILTER,
  TRAIL_STEP_SHOW_SUBTYPES,
  PLACE_SHOW_SUBTYPES,
  TRAIL_PLACE_SORT_FILTERS,
  TRAIL_PLACE_SORT_ITEMS,
  SELECTION_TEXT,
  ALL_TEXT,
  ALL_TYPES,
  ALL_CUISINES,
} from './../../constants/utils';
import { LocalStorageService } from '../../services/local-storage.service';
import { ITrailStepsFilter } from 'src/app/modules/main/models/generic.model';
import { MainState } from 'src/app/modules/main/store/main.reducer';
import { placeTypesSelectorState } from 'src/app/modules/main/store/PlaceTypes/PlaceTypes.store';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  typeOfPlacesArr = PLACES_FILTERS.items;
  typeOfTrailsArr = TRAIL_FILTERS.items;
  filterDetailsTime = TRAIL_DETAILS_FILTER_TIME;
  filterDetailsWith = TRAIL_DETAILS_FILTER_WITH;
  sortArr = TRAIL_PLACE_SORT_FILTERS;
  labelSort: string;

  @Input() action: 'place' | 'trails';

  showPlaceSubTypes = false;
  showSubFilters = false;
  isFiltering = true;

  placeTypeArr: any[] = [];
  placeTypeIdsArr: any[] = [];
  placeSubTypeArr: any[] = [];
  placeSubTypeIdsArr: any[] = [];

  trailWhenIdsArr: any[] = [];
  trailWhoIdsArr: any[] = [];

  subFilters: any[] = [];
  unsubscribe = new Subject<any>();

  placeTypeSelectedText = '';
  placeSubTypeSelectedText = '';
  trailWhenSelectedText = '';
  trailWithSelectedText = '';

  // Setting defaults
  filter: ITrailStepsFilter = {
    trail: this.typeOfTrailsArr[0].value,
    place: this.typeOfPlacesArr[0].value,
    placeType: '',
    placeSubType: '',
    when: this.filterDetailsTime.items[0].value,
    who: '',
    sort: this.sortArr[0].value,
    sortAs: '',
  };

  constructor(
    private mainStore: Store<MainState>,
    private modalController: ModalController,
    private storage: LocalStorageService
  ) { }

  ngOnInit(): void {
    if (this.action === 'place') {
      this.labelSort = 'Sort your place';
    } else if (this.action === 'trails') {
      this.labelSort = 'Sort your trail';
    }

    this.initPlaceTypes();
    let trail_step_showPlaceSubTypes;
    let place_showPlaceSubTypes;
    if (this.action !== 'place') {
      trail_step_showPlaceSubTypes = this.storage.getItem(TRAIL_STEP_SHOW_SUBTYPES);
      if (trail_step_showPlaceSubTypes === null || trail_step_showPlaceSubTypes) this.showPlaceSubTypes = true;
      else this.showPlaceSubTypes = false;
    }
    else {
      place_showPlaceSubTypes = this.storage.getItem(PLACE_SHOW_SUBTYPES);
      if (place_showPlaceSubTypes === null || place_showPlaceSubTypes) this.showPlaceSubTypes = true;
      else this.showPlaceSubTypes = false;
    }

    this.sortArr = filter(this.sortArr, (row: any) => {
      return row.allowOn.indexOf(this.action) > -1;
    });

    const filters: ITrailStepsFilter = this.storage.getItem(TRAIL_STEP_FILTER);
    if (filters) {
      this.filter.place = filters.place || this.typeOfPlacesArr[0].value;
      this.filter.trail = filters.trail || this.typeOfTrailsArr[0].value;
      this.filter.sort = filters.sort || this.sortArr[0].value;
      this.filter.sortAs = filters.sortAs;

      if (filters.who) {

        if (filters.who !== lowerCase(ALL_TEXT)) {
          const whoArr = filters.who.split(',');
          this.trailWhoIdsArr = whoArr;
          this.filter.who = filters.who;
          if (this.trailWhoIdsArr.length > 1) {
            this.trailWithSelectedText = SELECTION_TEXT
          };
          if (this.trailWhoIdsArr.length === 1) {
            this.trailWithSelectedText = whoArr[0];
          }
        } else {
          this.trailWhoIdsArr = this.filterDetailsWith.items.map((item) => {
            return item.value;
          });
          this.filter.who = lowerCase(ALL_TEXT);
          this.trailWithSelectedText = ALL_TEXT;
        }
      }

      if (filters.when) {
        if (filters.when !== lowerCase(ALL_TEXT)) {
          const whenArr = filters.when.split(',');
          each(this.filterDetailsTime.items, (row) => {
            const result = whenArr.find((value) => value === row.label);
            if (result) {
              row.selected = true;
            } else {
              row.selected = false;
            }
          });
          this.trailWhenIdsArr = whenArr;
          if (this.trailWhenIdsArr.length === 1) {
            this.trailWhenSelectedText = whenArr[0];
            // this.filter.when = whenArr[0]
            this.filter.when = filters.when;
          }
        } else {
          each(this.filterDetailsTime.items, (row) => {
            row.selected = true;
          });
          this.trailWhenIdsArr = this.filterDetailsTime.items.map((row) => {
            return row.label;
          });
          this.trailWhenSelectedText = ALL_TEXT;
          this.filter.when = lowerCase(ALL_TEXT);
        }
      }
    } else {
      this.filter.place = this.typeOfPlacesArr[0].value;
      this.filter.trail = this.typeOfTrailsArr[0].value;
      this.filter.sort = this.sortArr[0].value;

      if (this.filter.sort === TRAIL_PLACE_SORT_ITEMS.DISTANCE.value) {
        this.subFilters = TRAIL_PLACE_SORT_ITEMS.DISTANCE.subFilters;
        this.showSubFilters = true;
      } else if (this.filter.sort === TRAIL_PLACE_SORT_ITEMS.RATING.value) {
        this.subFilters = TRAIL_PLACE_SORT_ITEMS.RATING.subFilters;
        this.showSubFilters = true;
      } else {
        this.showSubFilters = false;
      }
      this.filter.sortAs = this.subFilters[0].value;
      this.trailWhenIdsArr = this.filterDetailsTime.items.map((type) => {
        return type.label;
      });
      this.filter.when = lowerCase(ALL_TEXT);
      this.trailWhenSelectedText = ALL_TEXT;

      this.trailWhoIdsArr = this.filterDetailsWith.items.map((row) => {
        return row.value;
      });
      this.filter.who = lowerCase(ALL_TEXT);
      this.trailWithSelectedText = ALL_TEXT;
    }
  }

  ionViewWillLeave() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  clearAll() {
    // this.storage.removeItem(TRAIL_STEP_FILTER);
    // this.modalController.dismiss({
    //   filter: null,
    // });

    this.resetForm();
  }

  updateFilter() {
    this.storage.setItem(TRAIL_STEP_FILTER, this.filter);
    if (this.action !== 'place') this.storage.setItem(TRAIL_STEP_SHOW_SUBTYPES, this.showPlaceSubTypes);
    else this.storage.setItem(PLACE_SHOW_SUBTYPES, this.showPlaceSubTypes);
    this.modalController.dismiss({
      filter: this.filter,
      isFiltering: this.isFiltering,
    });
  }

  onSortFilterSelect(event: any) {
    const val = event.target.value;
    this.filter.sort = val;
    this.filter.sortAs = '';

    if (this.filter.sort === TRAIL_PLACE_SORT_ITEMS.DISTANCE.value) {
      this.subFilters = TRAIL_PLACE_SORT_ITEMS.DISTANCE.subFilters;
      this.showSubFilters = true;
    } else if (this.filter.sort === TRAIL_PLACE_SORT_ITEMS.RATING.value) {
      this.subFilters = TRAIL_PLACE_SORT_ITEMS.RATING.subFilters;
      this.showSubFilters = true;
    } else if (this.filter.sort === TRAIL_PLACE_SORT_ITEMS.RECENCY.value) {
      this.subFilters = null;
      this.showSubFilters = false;
      this.filter.sortAs = TRAIL_PLACE_SORT_ITEMS.RECENCY.value;
    } else {
      this.showSubFilters = false;
    }
  }

  onTrailFilterSelect(event: any) {
    this.filter.trail = event.target.value;
  }

  onPlaceFilterSelect(event: any) {
    const val = event.target.value;
    this.filter.place = val;
  }

  onPlaceTypeFilterSelect(event: any) {
    const type = event.target.value;
    let placeSubTypeArr = [];
    const placeTypeArr = [];

    each(type, (row: any) => {
      const placeType = find(this.placeTypeArr, { value: row });
      if (placeType) {
        placeSubTypeArr.push(placeType.subTypes);
        placeTypeArr.push(placeType.value);
      }
    });

    if(isEmpty(type)) {
      this.placeTypeArr.map(placeType=>{
        placeSubTypeArr.push(placeType.subTypes);
      })
    }

    placeSubTypeArr = flatten(placeSubTypeArr);
    this.placeSubTypeArr = placeSubTypeArr.map((row) => {
      return {
        ...row,
        value: row.value,
        label: row.subType,
      };
    });

    if (size(type) !== size(this.placeTypeArr)) {
      this.filter.placeType = placeTypeArr.join(',');
      if (size(type) > 1) {
        this.placeTypeSelectedText = SELECTION_TEXT;
      } else {
        if (!isEmpty(type)) {
          this.placeTypeSelectedText = type[0];
        } else {
          this.placeTypeSelectedText = ALL_TYPES;
          this.filter.placeType = lowerCase(ALL_TEXT);
        }
      }
    } else {
      this.placeTypeSelectedText = ALL_TYPES;
      this.filter.placeType = lowerCase(ALL_TEXT);
    }

    this.placeTypeIdsArr = type;
    if(isEmpty(type)) {
      this.placeTypeIdsArr = this.placeTypeArr.map((type) => {
        return type.value;
      });
    }
    this.showPlaceSubTypes = !isEmpty(this.placeSubTypeArr);
    if (isEmpty(this.placeSubTypeArr)) this.filter.placeSubType = ''
  }

  onPlaceSubTypeFilterSelect(event: any) {
    const subType = event.target.value;
    const placeTypeArr = [];

    each(subType, (row: any) => {
      const filterSub = find(this.placeSubTypeArr, { value: row });
      if (filterSub) {
        placeTypeArr.push(filterSub.value);
      }
    });

    if (size(subType) !== size(this.placeSubTypeArr)) {
      this.filter.placeSubType = placeTypeArr.join(',');
      if (size(subType) > 1) {
        this.placeSubTypeSelectedText = SELECTION_TEXT;
      } else {
        if (!isEmpty(subType)) {
          this.placeSubTypeSelectedText = subType[0];
        } else {
          this.placeSubTypeSelectedText = ALL_CUISINES;
          this.filter.placeSubType = lowerCase(ALL_TEXT);
        }
      }
    } else {
      this.placeSubTypeSelectedText = ALL_CUISINES;
      this.filter.placeSubType = lowerCase(ALL_TEXT);
    }

    this.placeSubTypeIdsArr = subType;
    if(isEmpty(subType)) {
      this.placeSubTypeIdsArr = this.placeSubTypeArr.map((type) => {
        return type.value;
      });
    }
  }

  onTrailTimeFilterSelect(event: any) {
    const when = event.target.value;
    if (size(when) !== size(this.filterDetailsTime.items)) {
      this.trailWhenIdsArr = [...when];
      this.filter.when = this.trailWhenIdsArr.join(',');
      if (size(when) > 1) {
        this.trailWhenSelectedText = SELECTION_TEXT;
      } else {
        this.trailWhenSelectedText = when[0];
      }
    } else {
      this.trailWhenSelectedText = ALL_TEXT;
      this.filter.when = lowerCase(ALL_TEXT);
    }
    this.trailWhenIdsArr = when;
  }

  onTrailWithFilterSelect(event: any) {
    const withArr = event.target.value;

    if (!isEmpty(withArr)) {
      if (size(withArr) !== size(this.filterDetailsWith.items)) {
        this.filter.who = withArr.join(',');
        if (size(withArr) > 1) {
          this.trailWithSelectedText = SELECTION_TEXT;
        } else {
          this.trailWithSelectedText = upperFirst(withArr[0]);
        }
      } else {
        this.trailWithSelectedText = ALL_TEXT;
        this.filter.who = lowerCase(ALL_TEXT);
      }
    }
    this.trailWhoIdsArr = withArr;
  }

  onSubFilterSelect(event: any) {
    const val = event.target.value;
    this.filter.sortAs = val;
  }

  async onExperienceModal() {
    const modal = await this.modalController.create({
      component: ExperienceModalComponent,
      cssClass: 'modal-experience-screen',
    });
    modal.onDidDismiss().then(() => { });
    modal.present();
  }

  private initPlaceTypes() {
    const filters: ITrailStepsFilter = this.storage.getItem(TRAIL_STEP_FILTER);
    this.mainStore
      .select(placeTypesSelectorState)
      .pipe(
        takeUntil(this.unsubscribe),
        map((res) => res.placeTypes)
      )
      .subscribe((response) => {
        if (response) {
          const placeTypeArr: any[] = [...response];
          this.placeTypeArr = placeTypeArr.map((type) => {
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
            return {
              ...row,
              value: row.value,
              label: row.subType,
            };
          });
          if (
            filters &&
            !isEmpty(filters.placeType) &&
            filters.placeType !== lowerCase(ALL_TEXT)
          ) {
            const typeArr = split(filters.placeType, ',');
            const tmpTypeArr = [];
            each(typeArr, (row: any) => {
              const placeType = find(this.placeTypeArr, { value: row });
              tmpTypeArr.push(placeType);
            });
            this.placeTypeIdsArr = tmpTypeArr.map((type) => {
              return type.value;
            });
            if (typeArr.length > 1)
              this.placeTypeSelectedText = SELECTION_TEXT;
            else this.placeTypeSelectedText = typeArr[0];
            this.filter.placeType = filters.placeType;
          } else {
            this.filter.placeType = lowerCase(ALL_TEXT);
            this.placeTypeSelectedText = ALL_TYPES;
            this.placeTypeIdsArr = placeTypeArr.map((type) => {
              return type.value;
            });
          }
          if (
            filters &&
            !isEmpty(filters.placeSubType) &&
            filters.placeSubType !== lowerCase(ALL_TEXT)
          ) {
            const typeArr = split(filters.placeSubType, ',');
            const tmpTypeArr = [];
            each(typeArr, (row: any) => {
              const subType = find(this.placeSubTypeArr, { value: row });
              tmpTypeArr.push(subType);
            });
            this.placeSubTypeIdsArr = tmpTypeArr.map((type) => {
              return type.value;
            });
            if (typeArr.length > 1)
              this.placeSubTypeSelectedText = SELECTION_TEXT;
            else this.placeSubTypeSelectedText = typeArr[0];
            this.filter.placeSubType = filters.placeSubType;
          } else {
            this.filter.placeSubType = lowerCase(ALL_TEXT);
            this.placeSubTypeSelectedText = ALL_CUISINES;
            this.placeSubTypeIdsArr = placeSubTypeArr.map((type) => {
              return type.value;
            });
          }
          // this.showPlaceSubTypes = true;
        }
      });
  }

  private resetForm() {
    // each(this.filterDetailsWith.items, (row: any) => {
    //   row.selected = false;
    // });

    this.filter.place = this.typeOfPlacesArr[0].value;
    this.filter.trail = this.typeOfTrailsArr[0].value;
    this.filter.sort = this.sortArr[0].value;

    this.filter.when = lowerCase(ALL_TEXT);
    this.filter.who = lowerCase(ALL_TEXT);
    this.filter.placeSubType = lowerCase(ALL_TEXT);
    this.filter.placeType = lowerCase(ALL_TEXT);

    this.placeSubTypeSelectedText = ALL_CUISINES;
    this.placeTypeSelectedText = ALL_TYPES;

    this.isFiltering = false;

    this.placeTypeIdsArr = this.placeTypeArr.map((type) => {
      return type.value;
    });
    this.placeSubTypeIdsArr = this.placeSubTypeArr.map((subtype) => {
      return subtype.value;
    })
    this.showPlaceSubTypes = true;
    this.trailWhoIdsArr = this.filterDetailsWith.items.map((who: any) => who.id);
    this.trailWithSelectedText = ALL_TEXT;
    this.trailWhenIdsArr = this.filterDetailsTime.items.map((when: any) => when.label);
    this.trailWhenSelectedText = ALL_TEXT;
  }
}
