import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { fromLonLat, transform } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style, Text, Icon } from 'ol/style.js';
import GeoJSON from 'ol/format/GeoJSON';
import Overlay from 'ol/Overlay';
import { createEmpty, extend } from 'ol/extent';
import { MapComponent } from '@app/shared/components/map/map.component';
import { transformExtent } from 'ol/proj';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { mapConfig, MapService } from '@app/core/services/map';
import { DatePipe } from '@angular/common';
import { Logger, ProvincesService } from '@app/core';
import { LoaderService, WindowresizeService, EventService } from '@app/shared/services';
const log = new Logger('Dashboard');
import * as _ from 'lodash';
import * as $ from 'jquery';
import * as moment from 'moment';
import * as jsPDF from 'jspdf'
import { takeUntil } from 'rxjs/operators';
import { DistrictsService } from '@app/core/services/districts.service';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import { getArea, getLength } from 'ol/sphere.js';
import Draw from 'ol/interaction/Draw.js';
import { unByKey } from 'ol/Observable.js';
import DragZoom from 'ol/interaction/DragZoom';
import { always } from 'ol/events/condition';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  listRanking: any;
  @ViewChild(MapComponent, { static: false }) map: MapComponent;
  configMap = mapConfig;
  _: any = _;
  latitude: any = undefined;
  longitude: any = undefined;
  markerSource: any;
  activeLayer: BehaviorSubject<string> = new BehaviorSubject('alert');
  private currentExt: any = [];

  @ViewChild('popup', { static: false }) popup: ElementRef;
  @ViewChild('popup_click', { static: false }) popup_click: ElementRef;
  popupContent: any;
  popupContent1: any;

  private overlay_hover: Overlay;
  private overlay_click: Overlay;

  LAYERFORMAT: any = {};
  private zoomLevel = 0;
  height = '100%';
  styleCache = {};
  currZoom: any;
  gotocoordinatesdata: any = [];
  levelGis: number;
  // Draw
  /**
  * Currently drawn feature.
  * @type {module:ol/Feature~Feature}
  */
  sketch: any;
  /**
  * Message to show when the user is drawing a polygon.
  * @type {string}
  */
  /**
  * The help tooltip element.
  * @type {Element}
  */
  helpTooltipElement: any;
  /**
   * Overlay to show the help messages.
   * @type {module:ol/Overlay}
   */
  helpTooltip: any;
  /**
   * The measure tooltip element.
   * @type {Element}
   */
  measureTooltipElement: any;
  /**
   * Overlay to show the measurement.
   * @type {module:ol/Overlay}
   */
  measureTooltip: any;
  continuePolygonMsg = 'Click to continue drawing the polygon';
  /**
  * Message to show when the user is drawing a line.
  * @type {string}
  */
  continueLineMsg = 'Click to continue drawing the line';
  draw: any; // global so we can remove it later
  typeDraw: string;
  isActiveDraw: boolean;
  VietNamExtent: any[] = [102.170435826, 8.59975962975, 109.33526981, 23.3520633001];
  dragZoom: any;
  subSelectNode: Subscription;
  subEventMap: Subscription;
  private unsubscribeHelper$: Subject<void> = new Subject<void>();
  constructor(
    private datePipe: DatePipe,
    private mapService: MapService,
    private windowresizeService: WindowresizeService,
    private loaderService: LoaderService,
    private provincesService: ProvincesService,
    private districtsService: DistrictsService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.windowresizeService
      .getSize()
      .pipe(takeUntil(this.unsubscribeHelper$))
      .subscribe((size: number | string) => {
        setTimeout(() => {
          this.map.instance.updateSize();
        }, 200);
      });

    // Detect Event
    this.subSelectNode = this.eventService.getSelectNode().subscribe(res => {
      if (res) {
        this.loaderService.display(true);
        this.levelGis = res.level;
        switch (this.levelGis) {
          case 0: {
            this.provincesService.getProvinceGeo(res.key).subscribe(response => {
              if (!response.status.error) {
                this.createPolygon(response.results[0]);
              }
            }, (error: any) => {
              this.loaderService.display(false);
              log.debug(`Get province geo error: ${error.status.message}`);
            }, () => {
              this.loaderService.display(false);
            })
            break;
          }
          case 1: {
            this.districtsService.getdistrictGeo(res.key).subscribe(response => {
              if (!response.status.error) {
                this.createPolygon(response.results[0]);
              }
            }, (error: any) => {
              this.loaderService.display(false);
              log.debug(`Get province geo error: ${error.status.message}`);
            }, () => {
              this.loaderService.display(false);
            })
            break;
            
          }
          default:
            break;
        }
        this.eventService.setSelectNode(null);
      }
    })
    this.subEventMap = this.eventService.getEventMap().subscribe(res => {
      if (res) {
        switch (res.name) {
          case this.eventService.listStates.drawLineStringState: {
            if (res.value) {
              this.activeDraw('LineString');
            } else {
              this.isActiveDraw = false;
              this.clearLayer('Vector-Distance');
            }
            break;
          }
          case this.eventService.listStates.drawPolygonState: {
            if (res.value) {
              this.activeDraw('Polygon');
            } else {
              this.isActiveDraw = false;
              this.clearLayer('Vector-Distance');
            }
            break;
          }
          case this.eventService.listStates.setZoom: {
            if (res.value) {
              this.map.instance.getView().setZoom(this.map.instance.getView().getZoom() + 1);
            } else {
              this.map.instance.getView().setZoom(this.map.instance.getView().getZoom() - 1);
            }
            break;
          }
          case this.eventService.listStates.viewFullExtent: {
            if (res.value) {
              this.goToExtent(this.VietNamExtent);
            }
            break;
          }
          case this.eventService.listStates.reloadMap: {
            if (res.value) {
              this.isActiveDraw = false;
              this.clearLayer('Vector-Distance');
              this.clearLayer('Vector');
              this.fixContentHeight();
              this.goToExtent(this.VietNamExtent);
            }
            break;
          }
          case this.eventService.listStates.zoomInRect: {
            if (res.value) {
              this.isActiveDraw = false;
              this.map.instance.removeInteraction(this.draw);
              if (this.helpTooltip) {
                this.helpTooltip.setPosition(null);
              }
              if (this.map) {
                this.dragZoom = new DragZoom({
                  condition: always
                });
                this.map.instance.addInteraction(this.dragZoom);
                this.map.instance.getTargetElement().style.cursor = 'crosshair';
              }
            }
            break;
          }
          case this.eventService.listStates.printMap: {
            if (res.value) {
              this.printMap(res.value.format, res.value.resolution)
            }
            break;
          }
          default:
            break;
        }
        this.eventService.setEventMap(null);
      }
    })

  }
  printMap(format: string, resolution: number) {
    const dims = {
      a0: [1189, 841],
      a1: [841, 594],
      a2: [594, 420],
      a3: [420, 297],
      a4: [297, 210],
      a5: [210, 148]
    };
    const dim = dims[format];
    const width = Math.round(dim[0] * resolution / 25.4);
    const height = Math.round(dim[1] * resolution / 25.4);
    const size = /** @type {module:ol/size~Size} */ (this.map.instance.getSize());
    const extent = this.map.instance.getView().calculateExtent(size);

    this.map.instance.once('rendercomplete', (event) => {
      const canvas = event.context.canvas;
      const data = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF('landscape', undefined, format);
      pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
      pdf.save('map.pdf');
      // Reset original map size
      this.map.instance.setSize(size);
      this.map.instance.getView().fit(extent, { size: size });
      document.body.style.cursor = 'auto';
      this.eventService.setEventMap({
        name: this.eventService.listStates.printingMap,
        value : false
      });

    });
    // Set print size
    const printSize = [width, height];
    this.map.instance.setSize(printSize);
    this.map.instance.getView().fit(extent, { size: printSize });
  }
  activeDraw(type: string) {
    this.map.instance.removeInteraction(this.dragZoom);
    this.map.instance.getTargetElement().style.cursor = '';
    this.map.instance.removeInteraction(this.draw);
    this.isActiveDraw = true;
    this.typeDraw = type;
    this.addInteraction();
  }

  ngAfterViewInit() { }

  onComponentSetup() {
    this.overlay_hover = new Overlay({
      element: this.popup.nativeElement
    });
    this.overlay_click = new Overlay({
      element: this.popup_click.nativeElement
    });
    this.map.instance.addOverlay(this.overlay_hover);
    this.map.instance.addOverlay(this.overlay_click);
    this.fixContentHeight();
    this.goToExtent(this.VietNamExtent);
    this.currZoom = this.map.instance.getView().getZoom();
    this.map.instance.on('moveend', (e: any) => {
      const newZoom = this.map.instance.getView().getZoom();
      if (this.currZoom !== newZoom) {
        this.currZoom = newZoom;
        this.closePopup();
      }
    });
  }

  fixContentHeight = () => {
    const viewHeight = $(window).height();
    const header = $('div[data-role="header"]:visible:visible');
    const mapcontent = $('div[data-role="mapcontent"]:visible:visible');
    const contentHeight = viewHeight - header.outerHeight() - 115;
    mapcontent.height(contentHeight);
    this.map.instance.updateSize();
  };


  addToolTipFormat(layerName: any, format: any) {
    this.LAYERFORMAT[layerName] = format;
  }
  onMouseOut(event: any) {
    if (this.helpTooltip) {
      this.helpTooltip.setPosition(null);
    }
  }
  onPointerMove(evt: any) {
    if (evt.dragging) {
      return;
    }
    if (this.isActiveDraw) {
      let helpMsg = 'Click to start drawing';
      if (this.sketch) {
        const geom = (this.sketch.getGeometry());
        if (geom instanceof Polygon) {
          helpMsg = this.continuePolygonMsg;
        } else if (geom instanceof LineString) {
          helpMsg = this.continueLineMsg;
        }
      }
      this.helpTooltipElement.innerHTML = helpMsg;
      this.helpTooltip.setPosition(evt.coordinate);
      this.helpTooltipElement.classList.remove('hidden');
    } else {
      const pixel = this.map.instance.getEventPixel(evt.originalEvent);
      const coor = evt.coordinate;
      this.displayFeatureInfo(pixel, coor, this.overlay_hover, true);
    }
  }


  onMapClick(event: any) {
    if (this.map.instance.hasFeatureAtPixel(event.pixel) === true) {
      const coordinate = event.coordinate;
      this.displayFeatureInfo(event.pixel, coordinate, this.overlay_click, false);
    } else {
      this.overlay_click.setPosition(undefined);
    }
  }
  displayFeatureInfo(pixel: any, coordinate: any, overlay: any, autoHide: boolean) {
    const featureLayers: any = [];
    this.map.instance.forEachFeatureAtPixel(pixel, function (feature: any, layer: any) {
      featureLayers.push({
        feature: feature,
        layer: layer
      });
    });

    if (featureLayers.length > 0) {
      const featureLayer = featureLayers[0];
      let layerId;
      if (featureLayer.layer) {
        layerId = featureLayer.layer.get('id');
      } else {
        layerId = featureLayer.feature.get('layerId');
      }
      if (layerId && this.LAYERFORMAT[layerId]) {
        // get content and format
        const inforFeature = this.createToolTipDisplay(this.LAYERFORMAT[layerId], featureLayer.feature);
        if (!autoHide) {
          this.popupContent1 = inforFeature;
        }
        this.popupContent = inforFeature;
        overlay.setPosition(coordinate);
      }
    } else {
      if (autoHide) {
        overlay.setPosition(undefined);
      }
    }
  }

  createToolTipDisplay(format: any, feature: any) {
    const cfeatures = feature;
    while (
      format.indexOf('{') !== -1 &&
      format.indexOf('}') !== -1 &&
      format.indexOf('{') < format.indexOf('}')
    ) {
      const fieldName = format.substring(format.indexOf('{') + 1, format.indexOf('}'));
      const oldText = format.substring(format.indexOf('{'), format.indexOf('}') + 1);
      let newText = '';
      newText = cfeatures.get(fieldName) || '';
      format = format.replace(new RegExp(oldText, 'g'), newText);
    }
    return format;
  }

  closePopup() {
    this.overlay_click.setPosition(undefined);
    return false;
  }

  RefeshMap() {
    this.onComponentSetup();
    this.map.instance.getView().setRotation(0);
  }
  zoomToRegion(bbox: any) {
    this.gotocoordinatesdata = bbox;
    this.goToExtent(bbox);
  }
  createPolygon(data: any) {
    const layername = 'Vector';
    const storeLayer: any = this.map.getLayer(layername);
    const geojsonObject = this.toGeoJson(data);

    this.addToolTipFormat(layername, storeLayer.get('toolTip'));
    const features = new GeoJSON().readFeatures(geojsonObject);
    storeLayer.getSource().clear();
    storeLayer.getSource().addFeatures(features);
    storeLayer.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, 1)',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.05)'
        })
      })
    );
  }
  toGeoJson(data: any) {
    const json: any = { type: 'FeatureCollection', features: [] };
    const pointFeatures = this.createAlertDisasterPoint(data);
    json.features = json.features.concat(pointFeatures);
    return json;
  }
  createAlertDisasterPoint(data: any) {
    const features = [];
    const coordinates = this.transformPolygon(data.json.coordinates);
    const feature: any = {
      type: 'Feature',
      id: this.levelGis === 0 ? data.province_id : data.district_id,
      properties: {},
      geometry: { type: 'MultiPolygon', coordinates: coordinates }
    };
    feature.properties.id = this.levelGis === 0 ? data.province_id : data.district_id;
    feature.properties.name = this.levelGis === 0 ? data.province.name : data.district.name;
    feature.properties.population = this.levelGis === 0 ? data.province.province_info.population : data.district.district_info.population;
    feature.properties.area = this.levelGis === 0 ? data.province.province_info.area : data.district.district_info.area;
    features.push(feature);
    return features;
  }
  transformPolygon(coordinates: any[]) {
    const lats = [];
    const lngs = [];    
    
    if (coordinates[0][0][0].constructor !== Array) {
      coordinates = [coordinates];
    }
    for (let i = 0; i < coordinates.length; i++) {
      for (let j = 0; j < coordinates[i].length; j++) {
        for (let k = 0; k < coordinates[i][j].length; k++) {
          coordinates[i][j][k] = fromLonLat(coordinates[i][j][k]);
          lats.push(coordinates[i][j][k][1]);
          lngs.push(coordinates[i][j][k][0]);
        }
      }
    }
    const minlat = Math.min.apply(null, lats),
      maxlat = Math.max.apply(null, lats);
    const minlng = Math.min.apply(null, lngs),
      maxlng = Math.max.apply(null, lngs);
    const bbox = [minlng, minlat, maxlng, maxlat];
    this.map.instance
      .getView()
      .fit(bbox, { size: this.map.instance.getSize(), duration: 500 });

    return coordinates;
  }
  ngOnDestroy(): void {
    this.unsubscribeHelper$.next();
    this.unsubscribeHelper$.complete();
    this.subSelectNode.unsubscribe();
    this.subEventMap.unsubscribe();
  }

  // Draw function
  /**
  * Format length output.
  * @param {module:ol/geom/LineString~LineString} line The line.
  * @return {string} The formatted length.
  */
  formatLength = function (line: any) {
    var length = getLength(line);
    var output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
    }
    return output;
  };
  /**
  * Format area output.
  * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
  * @return {string} Formatted area.
  */
  formatArea = function (polygon: any) {
    var area = getArea(polygon);
    var output;
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
    } else {
      output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
    }
    return output;
  };
  addInteraction() {
    const layername = 'Vector-Distance';
    const storeLayer: any = this.map.getLayer(layername);
    storeLayer.setStyle(
      new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33'
          })
        })
      })
    )
    const type: any = this.typeDraw;
    this.draw = new Draw({
      source: storeLayer.getSource(),
      type: type,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          })
        })
      })
    });
    this.map.instance.addInteraction(this.draw);

    this.createMeasureTooltip();
    this.createHelpTooltip();

    let listener: any;
    this.draw.on('drawstart', (evt: any) => {
      // set sketch
      this.sketch = evt.feature;
      /** @type {module:ol/coordinate~Coordinate|undefined} */
      var tooltipCoord = evt.coordinate;
      listener = this.sketch.getGeometry().on('change', (evt: any) => {
        var geom = evt.target;
        var output;
        if (geom instanceof Polygon) {
          output = this.formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = this.formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        this.measureTooltipElement.innerHTML = output;
        this.measureTooltip.setPosition(tooltipCoord);
      });
    }, this);

    this.draw.on('drawend', () => {
      this.measureTooltipElement.className = 'tooltip tooltip-static';
      this.measureTooltip.setOffset([0, -7]);
      // unset sketch
      this.sketch = null;
      // unset tooltip so that a new one can be created
      this.measureTooltipElement = null;
      this.createMeasureTooltip();
      unByKey(listener);
    }, this);
  }


  /**
  * Creates a new help tooltip
  */
  createHelpTooltip() {
    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'tooltip hidden';
    const pos: any = 'center-left';
    this.helpTooltip = new Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: pos
    });
    this.map.instance.addOverlay(this.helpTooltip);
  }


  /**
  * Creates a new measure tooltip
  */
  createMeasureTooltip() {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'tooltip tooltip-measure';
    const pos: any = 'bottom-center'
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: pos
    });
    this.map.instance.addOverlay(this.measureTooltip);
  }
  clearLayer(layername: string) {
    if (this.map) {
      const storeLayer: any = this.map.getLayer(layername);
      storeLayer.getSource().clear();
      this.map.instance.removeInteraction(this.draw);
      this.map.instance.getOverlays().getArray().slice(0).forEach((overlay, i) => {
        if (i > 1) {
          this.map.instance.removeOverlay(overlay);
        }
      });

    }
  }
  goToExtent(extent: any[]) {
    this.map.instance
      .getView()
      .fit(this.fromLonLatExtent(extent), { size: this.map.instance.getSize(), duration: 500 });
  }
  fromLonLatExtent(extent: any[]) {
    return transformExtent(extent, 'EPSG:4326', 'EPSG:900913')
  }
}
