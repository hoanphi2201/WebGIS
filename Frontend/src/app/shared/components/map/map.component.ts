import {
  Component,
  OnInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import MapEvent from 'ol/MapEvent';
import RenderEvent from 'ol/render/Event';
import ObjectEvent from 'ol/Object';
import { bbox } from 'ol/loadingstrategy';

import { Zoom, ZoomToExtent, Rotate, MousePosition, ScaleLine, FullScreen, OverviewMap } from 'ol/control.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { Tile, Group, Image, Vector as VectorLayer } from 'ol/layer.js';
import { Cluster, OSM, Vector as VectorSource } from 'ol/source.js';
import TileLayer from 'ol/layer/Tile';

@Component({
  selector: 'app-map',
  template: `
    <div [style.width]="width" [style.height]="height"></div>
    <ng-content></ng-content>
  `
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  public instance: Map;
  public componentType = 'map';
  @Input() config: any;
  @Input() width = '100%';
  @Input() height = '100%';
  @Input() pixelRatio: number;
  @Input() keyboardEventTarget: Element | string;
  @Input() loadTilesWhileAnimating: boolean;
  @Input() loadTilesWhileInteracting: boolean;

  @Output() oncomponentsetup: EventEmitter<any> = new EventEmitter<any>();
  @Output() onclick: EventEmitter<MapBrowserEvent>;
  @Output() ondblclick: EventEmitter<MapBrowserEvent>;
  @Output() onmoveend: EventEmitter<MapEvent>;
  @Output() onpointerdrag: EventEmitter<MapBrowserEvent>;
  @Output() onpointermove: EventEmitter<MapBrowserEvent>;
  @Output() mouseout: EventEmitter<MapBrowserEvent>;
  @Output() onpostcompose: EventEmitter<RenderEvent>;
  @Output() onpostrender: EventEmitter<MapEvent>;
  @Output() onprecompose: EventEmitter<RenderEvent>;
  @Output() onpropertychange: EventEmitter<ObjectEvent>;
  @Output() onsingleclick: EventEmitter<MapBrowserEvent>;
  LAYERFORMAT: any;
  popupContent: any;
  centerMap: Array<number> = [];
  mapDefault = {
    projection: 'EPSG:4326',
    zoom: 4,
    mcenter: [0, 0]
  };
  mapStyle = {};

  constructor(private host: ElementRef) {
    this.onclick = new EventEmitter<MapBrowserEvent>();
    this.ondblclick = new EventEmitter<MapBrowserEvent>();
    this.onmoveend = new EventEmitter<MapEvent>();
    this.onpointerdrag = new EventEmitter<MapBrowserEvent>();
    this.onpointermove = new EventEmitter<MapBrowserEvent>();
    this.mouseout = new EventEmitter<MapBrowserEvent>();
    this.onpostcompose = new EventEmitter<RenderEvent>();
    this.onpostrender = new EventEmitter<MapEvent>();
    this.onprecompose = new EventEmitter<RenderEvent>();
    this.onpropertychange = new EventEmitter<ObjectEvent>();
    this.onsingleclick = new EventEmitter<MapBrowserEvent>();
  }

  ngOnInit() {
    this.LoadMap(this.config);
    this.instance.setTarget(this.host.nativeElement.firstElementChild);
    this.instance.on('click', (event: MapBrowserEvent) => this.onclick.emit(event));
    this.instance.on('dblclick', (event: MapBrowserEvent) => this.ondblclick.emit(event));
    this.instance.on('moveend', (event: MapEvent) => this.onmoveend.emit(event));
    this.instance.on('pointerdrag', (event: MapBrowserEvent) => this.onpointerdrag.emit(event));
    this.instance.on('pointermove', (event: MapBrowserEvent) => this.onpointermove.emit(event));
    this.instance.on('mouseout', (event: MapBrowserEvent) => this.mouseout.emit(event));
    this.instance.on('postcompose', (event: RenderEvent) => this.onpostcompose.emit(event));
    this.instance.on('postrender', (event: MapEvent) => this.onpostrender.emit(event));
    this.instance.on('precompose', (event: RenderEvent) => this.onprecompose.emit(event));
    this.instance.on('propertychange', (event: ObjectEvent) => this.onpropertychange.emit(event));
    this.instance.on('singleclick', (event: MapBrowserEvent) => this.onsingleclick.emit(event));
  }

  ngAfterViewInit(): void {
    this.oncomponentsetup.emit(true);
    this.instance.updateSize();
  }

  CreateGroups(groupDatas: any) {
    const wfsGroups = [];
    if (groupDatas) {
      for (let i = 0; i < groupDatas.length; i++) {
        const groupData = groupDatas[i];
        const layers = groupData.layers || [];
        const group = this.CreateGroup(groupData, layers);
        if (group) {
          wfsGroups.push(group);
        }
      }
    }
    return wfsGroups;
  }

  CreateGroup(group: any, groupData: any) {
    let groupLayers = this.CreateLayers(groupData);

    if (group.layersGroup && group.layersGroup.length > 0) {
      const sub = this.CreateGroups(group.layersGroup);
      groupLayers = groupLayers.concat(sub);
    }
    const _group = new Group({ layers: groupLayers });
    _group.set('id', group.id);
    _group.set('type', group.type);

    for (const key in group) {
      if (typeof group[key] !== 'object') {
        _group.set(key, group[key]);
      }
    }
    return _group;
  }

  CreateLayers(arrayLayerObj: any) {
    const wfsLayers: any = [];
    arrayLayerObj.forEach((layerObj: any, key: any) => {
      if (layerObj.layers && layerObj.layers.length > 0) {
        const group = this.CreateGroup(layerObj, layerObj.layers);
        if (group) {
          wfsLayers.push(group);
        }
      } else {
        const oLayer = this.CreateLayer(layerObj);
        if (oLayer) {
          wfsLayers.push(oLayer);
        }
      }
    });
    return wfsLayers;
  }

  CreateSource(layerInfos: any) {
    let oSource: any = {};
    const sourceType = layerInfos.dataFormat;
    const sourceUrl = layerInfos.sourceUrl;

    const options = layerInfos.options;
    let projection = this.mapDefault.projection;
    if (layerInfos.projection) {
      projection = layerInfos.projection;
    }

    switch (sourceType) {
      case 'OSM':
        oSource = new OSM();
        if (sourceUrl) {
          oSource.setUrl(sourceUrl);
        }
        break;
      case 'ServerSource':
        oSource = new VectorSource({
          strategy: bbox
        });
        break;
    }
    return oSource;
  }

  CreateLayer(layerObj: any) {
    const name = layerObj.name;
    const title = layerObj.title;
    const layerId = layerObj.id;
    const projection = layerObj.projection;
    const type = layerObj.type;
    const layerType = layerObj.layerType;
    const zIndex = layerObj.zIndex;
    const visible = layerObj.visible;
    const dataFormat = layerObj.dataFormat;
    const sourceUrl = layerObj.sourceUrl;
    const styleMap = layerObj.styleMap;
    const toolTipFormat = layerObj.toolTipFormat;
    const distance = layerObj.distance;
    let oLayer: any = {};

    const oSource = this.CreateSource(layerObj);
    if (!oSource) {
      return;
    }

    switch (type) {
      case 'Image':
        oLayer = new Image({ source: oSource });
        break;
      case 'Tile':
        oLayer = new Tile({ source: oSource });
        break;
      case 'Vector':
        oLayer = new VectorLayer({
          source: oSource
        });
        if (this.mapStyle[layerId]) {
          const s = function(feature: any, resolution: any) {
            const styles = this.mapStyle[layerId];
            return styles[feature.getGeometry().getType()];
          };
          oLayer.setStyle(s);
        } else if (styleMap) {
          // get style map from layer config
        }
        break;
      case 'Cluster':
        const clusterSource = new Cluster({
          distance: parseInt(distance, 10),
          source: oSource
        });
        oLayer = new VectorLayer({
          source: clusterSource
        });
        if (this.mapStyle[layerId]) {
          const s = function(feature: any, resolution: any) {
            const styles = this.mapStyle[layerId];
            return styles[feature.getGeometry().getType()];
          };
          oLayer.setStyle(s);
        } else if (styleMap) {
          // get style map from layer config
        }
        break;
    }
    for (const key in layerObj) {
      if (layerObj.hasOwnProperty(key)) {
        oLayer.set(key, layerObj[key]);
      }
    }
    if (typeof layerType !== 'undefined') {
      oLayer.set('type', layerType);
    }
    if (typeof zIndex !== 'undefined') {
      oLayer.set('zIndex', zIndex);
    }
    // set a layer name if given
    if (typeof name !== 'undefined') {
      oLayer.set('name', name);
    }
    // set a layer title if given
    if (typeof title !== 'undefined') {
      oLayer.set('title', title);
    }
    if (typeof visible === 'boolean') {
      oLayer.setVisible(visible);
    }
    // else
    if (layerId) {
      oLayer.set('id', layerId);
    }
    return oLayer;
  }

  LoadMap(data: any = {}) {
    if (data.projection === undefined) {
      data.projection = data.defaultprojection;
    }
    data.target = this.host.nativeElement.firstElementChild;
    this.LoadEmptyMap(data);
    const layers = data.layers;
    if (layers) {
      const wfsLayers = this.CreateLayers(layers);
      for (let i = 0; i < wfsLayers.length; i++) {
        this.instance.addLayer(wfsLayers[i]);
      }
    }
    const groups = data.layersGroup;
    if (groups) {
      const wfsGroups = this.CreateGroups(groups);
      for (let i = 0; i < wfsGroups.length; i++) {
        this.instance.addLayer(wfsGroups[i]);
      }
    }
    this.setDefaultControls(this.instance, data.defaultControls);
  }

  LoadEmptyMap(mapConfigInfo: any) {
    if (mapConfigInfo.projection) {
      this.mapDefault.projection = mapConfigInfo.projection;
    } else if (mapConfigInfo.defaultprojection) {
      this.mapDefault.projection = mapConfigInfo.defaultprojection;
    }
    if (mapConfigInfo.layerProjection) {
      this.mapDefault['layerProjection'] = mapConfigInfo.layerProjection;
    }
    if (mapConfigInfo.target) {
      this.mapDefault['target'] = mapConfigInfo.target;
    }
    if (mapConfigInfo.mcenter) {
      this.mapDefault['mcenter'] = mapConfigInfo.mcenter;
    }
    if (mapConfigInfo.zoom) {
      this.mapDefault['zoom'] = mapConfigInfo.zoom;
    }
    if (mapConfigInfo.maxZoom) {
      this.mapDefault['maxZoom'] = mapConfigInfo.maxZoom;
    }
    if (mapConfigInfo.minZoom) {
      this.mapDefault['minZoom'] = mapConfigInfo.minZoom;
    }
    if (mapConfigInfo.defaultZoom) {
      this.mapDefault['defaultZoom'] = mapConfigInfo.defaultZoom;
    }
    let options = {};
    // defined map
    if (this.mapDefault['maxZoom'] && this.mapDefault['minZoom']) {
      options = {
        projection: this.mapDefault.projection,
        center: fromLonLat(this.mapDefault['mcenter']),
        zoom: this.mapDefault['zoom'],
        maxZoom: this.mapDefault['maxZoom'],
        minZoom: this.mapDefault['minZoom']
      };
    } else {
      options = {
        projection: this.mapDefault.projection,
        center: fromLonLat(this.mapDefault['mcenter']),
        zoom: this.mapDefault['zoom']
      };
    }
    if (
      this.mapDefault['extend'] &&
      Array.isArray(this.mapDefault['extend']) &&
      this.mapDefault['extend'].length === 4
    ) {
      options['extend'] = this.mapDefault['extend'];
    }
    if (!this.instance) {
      this.instance = new Map({
        target: this.mapDefault['target'],
        view: new View(options)
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {}

  setDefaultControls(map: any, controls: any) {
    if (controls.indexOf('Zoom') > -1) {
      map.addControl(new Zoom());
    }
    if (controls.indexOf('ZoomToExtent') > -1) {
      map.addControl(new ZoomToExtent());
    }
    if (controls.indexOf('Rotate') > -1) {
      map.addControl(new Rotate());
    }
    if (controls.indexOf('FullScreen') > -1) {
      map.addControl(new FullScreen());
    }
    if (controls.indexOf('OverviewMap') > -1) {
      map.addControl(new OverviewMap({
        className: 'ol-overviewmap ol-custom-overviewmap',
        collapsed: true
      }));
    }
    if (controls.indexOf('Mouse Position') > -1) {
      map.addControl(
        new MousePosition({
          undefinedHTML: '&nbsp;',
          target: document.getElementById('mouse-position'),
          projection: this.mapDefault['layerProjection'],
          coordinateFormat: function(coordinate: any) {
            return `${coordinate[0].toFixed(4)}, ${coordinate[1].toFixed(4)}`;
          }
        })
      );
    }
    if (controls.indexOf('ScaleLine') > -1) {
      map.addControl(new ScaleLine());
    }
  }

  getLayersRecursive(lyr: any, fn: any) {
    lyr.getLayers().forEach(
      function(_lyr: any, idx: any, a: any) {
        fn(_lyr, idx, a);
        if (_lyr.getLayers) {
          this.getLayersRecursive(_lyr, fn);
        }
      }.bind(this)
    );
  }

  getLayerById(layerId: any) {
    let findLayer;
    this.getLayersRecursive(
      this.instance,
      function(l: any, idx: any, a: any) {
        if (l.get('name') === layerId || l.get('id') === layerId) {
          findLayer = l;
        }
      }.bind(this)
    );
    return findLayer;
  }

  getLayer(layerId: any) {
    return this.getLayerById(layerId);
  }

  getFeatureByExtent(extent: any, layername: any) {
    const newLocal: any = this.getLayer(layername);
    newLocal.getSource().forEachFeatureIntersectingExtent(extent, function(feature: any, layer: any) {
      console.log(feature, layer);
    });
  }
}
