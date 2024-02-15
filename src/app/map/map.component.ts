import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone } from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { styles } from './mapbox-draw-styles';
import { GeoJSONSource, Map, MapboxEvent } from 'mapbox-gl';
import { Feature } from 'geojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  map!: Map;
  draw!: MapboxDraw;
  selected_poly?: Feature;

  get extrusion(): number | null {
    if (this.selected_poly?.properties) {
      const ext = this.selected_poly?.properties['extrusion'];
      return ext ? ext : 0;
    }
    return null;
  }
  set extrusion(value: number) {
    if (this.selected_poly?.properties) {
      this.draw.setFeatureProperty(this.selected_poly!.id as string, 'extrusion', value);
      this.draw.set(this.draw.getAll());
    }
  }

  constructor(private _zone: NgZone) {

  }

  onload(event: MapboxEvent) {
    this._zone.run(() => {
      this.map = event.target
      this.draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        styles: [{
          'id': 'extrusion',
          'type': 'fill-extrusion',
          'filter': ['all', ['==', '$type', 'Polygon']],
          'paint': {
            'fill-extrusion-height': ['coalesce', ['get', 'user_extrusion'], 0],
            'fill-extrusion-base': 0,
            'fill-extrusion-color': 'red',
            'fill-extrusion-opacity': 0.2
          }
        },
        ...styles],
        userProperties: true,
      });
      this.map.addControl(this.draw);

      this.map.on('draw.selectionchange', (evt: MapboxDraw.DrawSelectionChangeEvent) => {
        this._zone.run(() => {
          if (evt.features[0] && evt.features[0].geometry.type == "Polygon") {
            this.selected_poly = evt.features[0];
          } else {
            delete this.selected_poly;
          }
        });
      });
    });
  }
}