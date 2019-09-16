import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingDrawerService {
  visible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  headerColor$: BehaviorSubject<string> = new BehaviorSubject<string>('white');
  foldedMenu$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  sideNavDark$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {}
  getVisible(): Observable<boolean> {
    return this.visible$.asObservable();
  }
  setVisible(visible: boolean): void {
    this.visible$.next(visible);
  }
  getHeaderColor(): Observable<string> {
    return this.headerColor$.asObservable();
  }
  setHeaderColor(color: string): void {
    this.headerColor$.next(color);
  }
  getSideNavDark(): Observable<boolean> {
    return this.sideNavDark$.asObservable();
  }
  setSideNavDark(value: boolean): void {
    this.sideNavDark$.next(value);
  }
  getFoldedMenu(): Observable<boolean> {
    return this.foldedMenu$.asObservable();
  }
  setFoldedMenu(value: boolean): void {
    this.foldedMenu$.next(value);
  }
}
