import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Platform } from '@ionic/angular';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Icon from 'ol/style/Icon';
import Fill from 'ol/style/Fill';
import CircleStyle from 'ol/style/Circle';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';

import { LatLngLiteral } from 'src/app/modules/main/models/generic.model';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss'],
})
export class OlMapComponent implements OnInit, AfterViewInit {
  @Input() mapId: string;
  @Input() mapCenter: LatLngLiteral;
  @Input() currentLocation: LatLngLiteral;
  @Input() enableZooming: boolean;
  @Input() enableDragging: boolean;
  @Input() enableRouting: boolean; // displays trail lines
  @Input() enableCurrentLocationMarker: boolean | false;

  @Output() setCenter = new EventEmitter<any>();
  @Output() setZoom = new EventEmitter<any>();

  map: Map;
  mapView: View;

  mapTarget: string;
  mapOptions = {
    maxZoom: 18,
    zoom: 5,
  };

  constructor(
    private zone: NgZone,
    private platform: Platform,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initMap();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.map.setTarget('open-layer-map');
    setTimeout(() => {
      this.map
        .getView()
        .setCenter(
          olProj.fromLonLat([
            this.currentLocation.lng,
            this.currentLocation.lat,
          ])
        );
    }, 600);
  }

  private initMap() {
    this.mapView = new View({
      center: [0, 0],
      zoom: this.mapOptions.zoom,
    });

    this.map = new Map({
      view: this.mapView,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
    });

    setTimeout(() => {
      this.map.updateSize();
    }, 500);
  }

  onSetCenter() {
    this.map
      .getView()
      .setCenter(
        olProj.fromLonLat([this.currentLocation.lng, this.currentLocation.lat])
      );
    this.setCenter.emit();
  }

  onSetZoom(zoom: number) {
    this.map.getView().setZoom(zoom);
    this.setZoom.emit();
  }
}
