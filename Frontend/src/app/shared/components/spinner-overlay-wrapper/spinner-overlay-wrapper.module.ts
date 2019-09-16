import { SpinnerModule } from '../spinner/spinner.module';
import { NgModule } from '@angular/core';
import { SpinnerOverlayWrapperComponent } from './spinner-overlay-wrapper.component';

@NgModule({
  imports: [SpinnerModule],
  declarations: [SpinnerOverlayWrapperComponent],
  exports: [SpinnerOverlayWrapperComponent]
})
export class SpinnerOverlayWrapperModule {}
