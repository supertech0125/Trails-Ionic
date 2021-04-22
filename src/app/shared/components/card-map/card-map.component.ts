import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
// import { GoogleMap } from '@angular/google-maps';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import isEmpty from 'lodash-es/isEmpty';
import each from 'lodash-es/each';
import { TRAIL_CURRENT_USER_GEOLOCATION } from '../../constants/utils';

import { LocalStorageService } from './../../services/local-storage.service';
import { mapPINS } from '../../constants/mappins';

@Component({
  selector: 'app-card-map',
  templateUrl: './card-map.component.html',
  styleUrls: ['./card-map.component.scss'],
})
export class CardMapComponent implements OnInit, OnChanges {
  // @ViewChild(GoogleMap) maps: GoogleMap;

  @Input() mapMarkers: any[] = [];
  @Input() enableZooming: boolean;
  @Input() enableDragging: boolean;
  @Input() enableRouting: boolean; // displays trail lines
  @Input() enableCurrentLocationMarker: boolean | false;

  currentCoords = {
    latitude: 0,
    longitude: 0,
  };

  // mapOptions: google.maps.MapOptions = {
  //   mapTypeId: google.maps.MapTypeId.ROADMAP,
  //   zoom: 16,
  //   scrollwheel: false,
  //   disableDoubleClickZoom: true,
  //   fullscreenControl: false,
  //   mapTypeControl: false,
  //   streetViewControl: false,
  // };

  // mapCenter: google.maps.LatLngLiteral;
  // currentLocation: google.maps.LatLngLiteral;
  // markerOptions: any = {
  //   animation: google.maps.Animation.BOUNCE,
  //   icon: './assets/icon/map_pin.png',
  // };

  // mapVertices: google.maps.LatLngLiteral[] = [];
  // mapVerticesOptions: google.maps.PolylineOptions = {
  //   strokeOpacity: 0,
  //   // strokeWeight: 2,
  //   icons: [
  //     {
  //       icon: {
  //         path: 'M 0,-1 0,1',
  //         strokeOpacity: 1,
  //         strokeColor: '#0A9FA3',
  //         scale: 4,
  //       },
  //       offset: '0',
  //       repeat: '20px',
  //     },
  //   ],
  // };

  constructor(
    private platform: Platform,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    // this.mapOptions.zoomControl = this.enableZooming;
    // this.mapOptions.draggable = this.enableDragging;

    this.getCurrentPosition();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'mapMarkers': {
            this.recalibrateMapMarkers();
          }
        }
      }
    }
  }

  private async getCurrentPosition() {
    const coordinate = this.storage.getItem(TRAIL_CURRENT_USER_GEOLOCATION);
    if (!isEmpty(coordinate)) {
      this.mappingCoordinates(coordinate);
      // this.currentLocation = {
      //   lat: coordinate.latitude,
      //   lng: coordinate.longitude,
      // };
    } else {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        const coordinates = await Plugins.Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });
        const crd = coordinates.coords;
        this.mappingCoordinates(crd);
        // this.currentLocation = {
        //   lat: crd.latitude,
        //   lng: crd.longitude,
        // };
      } else {
        const success = (pos) => {
          const crd = pos.coords;
          this.mappingCoordinates(crd);
          // this.currentLocation = {
          //   lat: crd.latitude,
          //   lng: crd.longitude,
          // };
        };

        const error = (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        };

        navigator.geolocation.getCurrentPosition(success, error, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      }
    }
  }

  private mappingCoordinates(coords) {
    this.currentCoords = coords;
    // this.mapCenter = {
    //   lat: coords.latitude,
    //   lng: coords.longitude,
    // };
  }

  private recalibrateMapMarkers() {
    // const bounds = new google.maps.LatLngBounds();
    each(this.mapMarkers, (row: any, index: number) => {
      row.index = index;
      row.markerPosition = { lat: row.lat, lng: row.lng };
      row.markerOptions = {
        // animation: google.maps.Animation.DROP,
        icon: './assets/png/map_pins/' + mapPINS[index] + '.png',
      };

      // bounds.extend(row.markerPosition);
    });

    if (!isEmpty(this.mapMarkers)) {
      if (this.mapMarkers.length === 1) {
        const marker = this.mapMarkers[this.mapMarkers.length - 1];
        this.mappingCoordinates({
          latitude: marker.lat,
          longitude: marker.lng,
        });
      } else {
        setTimeout(() => {
          // this.maps.fitBounds(bounds);
        }, 300);
      }

      // this.mapVertices = map(this.mapMarkers, (row) => {
      //   return row.markerPosition;
      // });
    }
  }
}
