import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private selectNode$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private eventMap$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listStates = {
    drawLineStringState: 'draw-line-string',
    drawPolygonState:  'draw-polygon',
    zoomInRectState: 'zoom-in-rect',
    setZoom: 'set-zoom',
    viewFullExtent: 'view-full-extent',
    reloadMap: 'reload-map',
    zoomInRect: 'zoom-in-rect',
    printMap: 'print-map',
    printingMap: 'printing-map'
  };
  constructor() { }
  getSelectNode(): Observable<any> {
    return this.selectNode$.asObservable();
  }
  setSelectNode(node: any): void {
    this.selectNode$.next(node);
  }
  // getDrawLineString(): Observable<boolean> {
  //   return this.drawLineString$.asObservable();
  // }
  // setDrawLineString(value: boolean): void {
  //   this.drawLineString$.next(value);
  // }
  // getDrawPolygon(): Observable<boolean> {
  //   return this.drawPolygon$.asObservable();
  // }
  // setDrawPolygon(value: boolean): void {
  //   this.drawPolygon$.next(value);
  // }
  // getZoomIn(): Observable<boolean> {
  //   return this.zoomIn$.asObservable();
  // }
  // setZoomIn(value: boolean): void {
  //   this.zoomIn$.next(value);
  // }
  // getZoomOut(): Observable<boolean> {
  //   return this.zoomOut$.asObservable();
  // }
  // setZoomOut(value: boolean): void {
  //   this.zoomOut$.next(value);
  // }
  // getViewFullExtent(): Observable<boolean> {
  //   return this.viewFullExtent$.asObservable();
  // }
  // setViewFullExtent(value: boolean): void {
  //   this.viewFullExtent$.next(value);
  // }
  // getReloadMap(): Observable<boolean> {
  //   return this.reloadMap$.asObservable();
  // }
  // setReloadMap(value: boolean): void {
  //   this.reloadMap$.next(value);
  // }
  // getZoomInRect(): Observable<boolean> {
  //   return this.zoomInRect$.asObservable();
  // }
  // setZoomInRect(value: boolean): void {
  //   this.zoomInRect$.next(value);
  // }
  // getPrintMap(): Observable<any> {
  //   return this.printMap$.asObservable();
  // }
  // setPrintMap(value: any): void {
  //   this.printMap$.next(value);
  // }
  // getPrintingMap(): Observable<any> {
  //   return this.printingMap$.asObservable();
  // }
  // setPrintingMap(value: any): void {
  //   this.printingMap$.next(value);
  // }
  getEventMap(): Observable<any> {
    return this.eventMap$.asObservable();
  }
  setEventMap(event: any): void {
    this.eventMap$.next(event);
  }
}
