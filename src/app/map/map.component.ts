import { Component, NgZone } from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { styles } from './mapbox-draw-styles';
import { Map, MapboxEvent } from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  map!: Map;


  constructor(private _zone: NgZone) {

  }

  onload(event: MapboxEvent) {
    this._zone.run(() => {
      this.map = event.target
      console.log(event);
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        styles: [ {
          'id': 'extrusion',
          'type': 'fill-extrusion',
          'filter': ['all', ['==', '$type', 'Polygon']],
          'paint': {
            'fill-extrusion-height': ['coalesce', ['get', 'user_height'], 10],
            'fill-extrusion-base': 0,
            'fill-extrusion-color': 'red',
            'fill-extrusion-opacity': 0.2 
          }
        },
        ...styles],
        userProperties: true,
        // defaultMode: 'draw_polygon'
      });
      this.map.addControl(draw);

      // this.map.on('draw.selectionchange', (evt: MapboxDraw.DrawSelectionChangeEvent) => {
      //   if (evt.features[0] && evt.features[0].geometry.type == "Polygon") {
      //     (evt.features[0].geometry as any).asd = 321;
      //     draw.setFeatureProperty(evt.features[0].id as string, 'height', 10000);
      //   }
      //   const src = this.map.getSource(MapboxDraw.constants.sources.HOT);
      //   if (src.type == 'geojson') {
      //     console.log((src as any)._data);
      //   }
      //   //console.log(evt.features);
      // });
    });
  }
}
