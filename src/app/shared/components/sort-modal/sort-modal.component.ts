import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MainState } from '../../../modules/main/store/main.reducer';
import { trailSortSelector, placeSortSelector, addTrailStepSortSelector } from '../../../modules/main/store/main.selector';

@Component({
  selector: 'app-sort-modal',
  templateUrl: './sort-modal.component.html',
  styleUrls: ['./sort-modal.component.scss'],
})
export class SortModalComponent implements OnInit {
  sort: string = null;
  sortArr: string[] = ['Distance', 'Rating'];
  additionalTrailSortArr: string[] = ['Newest'];

  @Input() action: string;
  unsubscribe = new Subject<any>();

  constructor(
    private mainStore: Store<MainState>,
    private modalController: ModalController,
    // private storage: LocalStorageService
  ) { }

  ngOnInit(): void { 
    this.mainStore
      .select(
        this.action === 'trail'? trailSortSelector : 
        this.action === 'place'? placeSortSelector : addTrailStepSortSelector)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.sort = response;
        }
      );
  }

  // ngOnDestroy(): void {
  //   this.unsubscribe.next();
  //   this.unsubscribe.complete();
  // }

  ionViewWillLeave() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setSort(data: string) {
    this.sort = data;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  reset() {
    this.sort = 'Distance';
  }

  updateSort() {
    if (this.action === 'place') console.log('sort place');
    else if(this.action === 'trail') console.log('sort trail');
    else console.log('sort addTrailStep');
    console.log('sortValue', this.sort);
    this.modalController.dismiss({
      sort: this.sort,
    });
  }

}
