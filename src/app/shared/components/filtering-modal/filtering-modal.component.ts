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

import { Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { ExperienceModalComponent } from '../experience-modal/experience-modal.component';

import {
  PLACES_FILTERS,
  TRAIL_FILTERS,
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
  placeType: string[] = [];
  placeSubType: string[] = [];
  when: string[] = [];
  who: string[] = [];

  isSelectAllPlaces: boolean = false;
  isSelectAllCuisines: boolean = false;

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
          if (response[2] && this.action === 'trail') {
            this.setFilterOptions(response[2]);
          }
          if(response[3] && this.action === 'addTrailStep') {
            this.setFilterOptions(response[3]);
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

    if(this.action === 'place' || this.action === 'addTrailStep') {
      this.place = data.place.split(',');
    }

    if(this.action === 'trail') {
      this.trail = data.trail.split(',');
      if(data.when === 'all') {
        this.filterDetailsTime.items.map((row: any) => {
          this.when.push(row.id);
        })
      }
      else this.when = data.when.split(',');

      if(data.who === 'all') {
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

  clearAllTypes() {
    if (this.isSelectAllPlaces) this.placeType = [];
    else {
      this.placeType = [...this.placeAllTypes]
    }
    this.isSelectAllPlaces = !this.isSelectAllPlaces;
  }

  clearAllCuisines() {
    if (this.isSelectAllCuisines) this.placeSubType = [];
    else {
      this.placeSubType = [...this.placeAllSubTypes];
    }
    this.isSelectAllCuisines = !this.isSelectAllCuisines;
  }

  clearAll() {
    this.trail = [];
    this.place = [];
    this.placeType = [];
    this.placeSubType = [];
    this.when = [];
    this.who = [];
    this.isSelectAllPlaces = false;
    this.isSelectAllCuisines = false;
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
      placeSubType: !placeSubType ? 'all' : (this.placeSubType.length === this.placeAllSubTypes.length) ? 'all' : placeSubType,
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
        when: !this.when.length ? 'all' : this.when.length === this.filterDetailsTime.items.length ? 'all' : this.when.join(','),
        who: !this.who.length ? 'all' : this.who.length === this.filterDetailsWith.items.length ? 'all' : this.who.join(','),
      };
      isFiltering = !((filter.placeType === 'all') &&
        (filter.placeSubType === 'all') &&
        (filter.trail === 'all') &&
        (filter.when === 'all') &&
        (filter.who === 'all'));
    }

    this.modalController.dismiss({
      filter: filter,
      isFiltering: isFiltering,
    });
  }

  changeItems = (data: any) => {
    if(data.action !== 'addTrailStep') this[data.action] = data.data;
    else this.place = data.data;

    if(data.action === 'placeType') {
      if(this.placeType.length === this.placeTypeArr.length) this.isSelectAllPlaces = true;
      if(this.placeType.length === 0) this.isSelectAllPlaces = false;
    }
    if(data.action === 'placeSubType') {
      if(this.placeSubType.length === this.placeSubTypeArr.length) this.isSelectAllCuisines = true;
      if(this.placeSubType.length === 0) this.isSelectAllCuisines = false;
    }
  }

}
