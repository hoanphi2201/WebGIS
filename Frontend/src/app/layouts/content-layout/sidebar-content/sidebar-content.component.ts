import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Logger,  ProvincesService, AuthService, IValidators } from '@app/core';
const log = new Logger('Exclusion');
import { SettingDrawerService, LoaderService, EventService } from '@app/shared';
import { NzFormatEmitEvent, NzMessageService } from 'ng-zorro-antd';
import { NgForm, Validators, FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { DistrictsService } from '@app/core/services/districts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar-content',
  templateUrl: './sidebar-content.component.html',
  styleUrls: ['./sidebar-content.component.scss']
})
export class SidebarContentComponent implements OnInit, OnDestroy, AfterViewInit {
  
  @Input() isCollapsed: boolean;
  @ViewChild('sidebar', { static: false }) sidebar: ElementRef;
  @ViewChild('boxSearch', { static: false }) boxSearch: ElementRef;
  @ViewChild('formDirective', {static: false}) private formDirective: NgForm;
  treeHeight = 0;
  sideNavDark: boolean;
  searchValue = '';
  provinceNodes: any[] = [];
  isVisibleModelPrint = false;
  pageSize: any [] =[
    {value: 'a0', viewValue: 'A0 (slow)' },
    {value: 'a1', viewValue: 'A1' },
    {value: 'a2', viewValue: 'A2' },
    {value: 'a3', viewValue: 'A3' },
    {value: 'a4', viewValue: 'A4' },
    {value: 'a5', viewValue: 'A5 (fast)' }
  ];
  resolution: any[] = [
    {value: '72', viewValue: '72 dpi (fast)' },
    {value: '150', viewValue: '150 dpi' },
    {value: '300', viewValue: '300 dpi (slow)' },
  ]
  pageSizeSelected = 'a4';
  resolutionSelected = '150';
  printingMap = false;
  // Draw
  controlState: string;
  listStates: any;
  currentUser: any;
  isVisibleForm = false;
  infoEdit: any = null;
  selectedEdit: any = null;
  form: FormGroup;
  subEventMap: Subscription;
  constructor(
    private settingDrawerService: SettingDrawerService,
    private provincesService: ProvincesService,
    private loaderService: LoaderService,
    private eventService: EventService,
    private cdRf: ChangeDetectorRef,
    private authService: AuthService,
    private nzMessageService: NzMessageService,
    private formBuilder: FormBuilder,
    private districtsService: DistrictsService
  ) {}
  
  ngOnInit() {
    this.getProvinces();
    this.buildForm();
    this.settingDrawerService.getSideNavDark().subscribe(res => {
      this.sideNavDark = res;
    });
    this.listStates = this.eventService.listStates;
    this.subEventMap = this.eventService.getEventMap().subscribe(res => {
      if (res) {
        const state = [
          this.listStates.drawLineStringState,
          this.listStates.drawPolygonState,
          this.listStates.reloadMap,
          this.listStates.zoomInRect
        ];
        if (res.name === this.listStates.printingMap) {
          this.printingMap = res.value;
        }
        if (state.includes(res.name) && res.value) {
          this.controlState = res.name;
        } else if (state.includes(res.name) && !res.value) {
          this.controlState = ''
        }
      }
    });

    this.authService.currentUser.subscribe(userData => {
      this.currentUser = userData;
    });
    
  }
  ngAfterViewInit() {
    if (!this.isCollapsed) {
      this.treeHeight = this.sidebar.nativeElement.offsetHeight - this.boxSearch.nativeElement.offsetHeight;
      this.cdRf.detectChanges();
    }
  }
  getProvinces() {
    this.loaderService.display(true);
    this.provincesService.getProvinces().subscribe(response => {
      if (!response.status.error) {
        const reaults = response.results;
        this.getProvinces = reaults.map((o: any) => {
          let node = {
            title: o.name,
            key: o.id,
            children: o.districts.map((d: any) => {
              return {
                title: d.name,
                key: d.id,
                isLeaf: true
              }
            })
          };
          return node;
        })
      }
    },(error: any) => {
      this.loaderService.display(false);
      log.debug(`Get provinces error: ${error.status.message}`);
    }, () => {
      this.loaderService.display(false);
    })
  }
  nzEvent(event: NzFormatEmitEvent): void {
    if (event.eventName === 'click')  {
      if ( event.keys[0]) {
        this.infoEdit = {
          level: event.node.level,
          key: event.keys[0]
        };
        this.eventService.setSelectNode(this.infoEdit);
      } else {
        this.infoEdit = null;
      }
    }
  }
  // EventSideBar
  drawLineString() {
    this.eventService.setEventMap({
      name: this.listStates.drawLineStringState,
      value: this.controlState !== this.listStates.drawLineStringState
    })
  }
  drawPolygon() {
    this.eventService.setEventMap({
      name: this.listStates.drawPolygonState,
      value: this.controlState !== this.listStates.drawPolygonState
    })
  }
  zoomIn() {
    this.eventService.setEventMap({
      name: this.listStates.setZoom,
      value: true
    })
  }
  zoomOut() {
    this.eventService.setEventMap({
      name: this.listStates.setZoom,
      value: false
    })
  }
  viewFullExtent() {
    this.eventService.setEventMap({
      name: this.listStates.viewFullExtent,
      value: true
    })
  }
  reloadMap() {
    this.eventService.setEventMap({
      name: this.listStates.reloadMap,
      value: true
    })
  }
  zoomInRect() {
    this.eventService.setEventMap({
      name: this.listStates.zoomInRect,
      value: this.controlState !== this.listStates.zoomInRect
    })
  }
  showModal(): void {
    this.isVisibleModelPrint = true;
  }

  handleOk(): void {
    this.eventService.setEventMap({
      name: this.listStates.printMap,
      value : {
        format: this.pageSizeSelected,
        resolution: this.resolutionSelected
      }
    });
    this.eventService.setEventMap({
      name: this.listStates.printingMap,
      value : true
    });
  }
  handleCancel(): void {
    this.isVisibleModelPrint = false;
  }
  // End Event Sidebar
  editInfo() {
    if (!this.infoEdit) {
      this.nzMessageService.info('Chưa chọn đơn vị hành chính');
    } else {
      this.loaderService.display(true);
      if (this.infoEdit.level === 0) {
        this.provincesService.getProvinceInfo(this.infoEdit.key).subscribe(response => {
          if (response.status.code === 200) {
            this.selectedEdit = response.results[0];
            this.isVisibleForm = true;
          }
        },() => {
          this.loaderService.display(false);
        }, () => {
          this.loaderService.display(false);
        })
      }  else if (this.infoEdit.level === 1) {
        this.districtsService.getdistrictInfo(this.infoEdit.key).subscribe(response => {
          if (response.status.code === 200) {
            this.selectedEdit = response.results[0];
            this.isVisibleForm = true;
          }
        },() => {
          this.loaderService.display(false);
        }, () => {
          this.loaderService.display(false);
        })
      }

    }
  }
  onEditInfo(formData: any, formDirective: FormGroupDirective) {
    if (this.form.invalid) {
      return;
    }
    this.loaderService.display(true);
    if (this.infoEdit.level === 0) {
      this.provincesService.updateProvinceInfo(this.infoEdit.key, formData.value).subscribe(response => {
        if (response.status.code === 200) {
          this.eventService.setSelectNode(this.infoEdit);
        }
      },() => {
        this.loaderService.display(false);
      }, () => {
        this.loaderService.display(false);
      })
    } else if (this.infoEdit.level === 1) {
      this.districtsService.updateDistrictInfo(this.infoEdit.key, formData.value).subscribe(response => {
        if (response.status.code === 200) {
          this.eventService.setSelectNode(this.infoEdit);
        }
      },() => {
        this.loaderService.display(false);
      }, () => {
        this.loaderService.display(false);
      })
    }
  }
  closeForm() {
    this.isVisibleForm = false;
  }
  buildForm() {
    this.form = this.formBuilder.group(
      {
        population: ['', [Validators.required, IValidators.positiveIntegerValidator]],
        area: ['', [Validators.required, IValidators.positiveIntegerValidator]]
      }
    );
  }
  ngOnDestroy() {
    this.subEventMap.unsubscribe();
  }
}

