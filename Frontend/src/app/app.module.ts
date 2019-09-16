import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule, LoaderService } from '@app/shared';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './modules/auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutsModule } from './layouts/layouts.module';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    TranslateModule.forRoot(),
    CoreModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    LayoutsModule
  ],
  declarations: [AppComponent],
  providers: [DatePipe, LoaderService],
  bootstrap: [AppComponent]
})
export class AppModule {}
