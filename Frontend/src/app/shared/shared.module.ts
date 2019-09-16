import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
  CollapseModule,
  BsDropdownModule,
  TabsModule,
  BsDatepickerModule,
  TimepickerModule,
  TooltipModule
} from 'ngx-bootstrap';

import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { SpinnerModule } from './components/spinner/spinner.module';
import { SpinnerOverlayWrapperModule } from './components/spinner-overlay-wrapper/spinner-overlay-wrapper.module';

import { ImagePreloadDirective } from './directives/imagepreload.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { MapComponent } from './components/map/map.component';
import { AlertComponent } from './components/alert/alert.component';
import { FieldErrorDisplayComponent } from '@app/shared/components/field-error-display/field-error-display.component';
import { SummaryPipe } from '@app/shared/pipes/summaty.pipe';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SpinnerModule,
    SpinnerOverlayWrapperModule,
    TabsModule,
    BsDatepickerModule,
    TimepickerModule,
    TooltipModule,
    CollapseModule,
    BsDropdownModule,
    TranslateModule,
    NgxPaginationModule,
    NgZorroAntdModule,
    PerfectScrollbarModule
  ],
  declarations: [
    ControlMessagesComponent,
    ImagePreloadDirective,
    MapComponent,
    AlertComponent,
    FieldErrorDisplayComponent,
    SummaryPipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    ControlMessagesComponent,
    MapComponent,
    AlertComponent,
    SpinnerModule,
    SpinnerOverlayWrapperModule,
    TabsModule,
    BsDatepickerModule,
    TimepickerModule,
    TooltipModule,
    CollapseModule,
    BsDropdownModule,
    ImagePreloadDirective,
    NgxPaginationModule,
    FieldErrorDisplayComponent,
    SummaryPipe,
    NgZorroAntdModule,
    PerfectScrollbarModule
  ]
})
export class SharedModule {}
