import { NgModule } from '@angular/core';
import { SpinnerOverlayService } from '@app/core/spinner-overlay/spinner-overlay.service';
import { SpinnerOverlayComponent } from '@app/core/spinner-overlay/spinner-overlay.component';
import { SpinnerModule } from '@app/shared/components/spinner/spinner.module';

@NgModule({
  imports: [SpinnerModule],
  declarations: [SpinnerOverlayComponent],
  entryComponents: [SpinnerOverlayComponent],
  providers: [SpinnerOverlayService],
  exports: []
})
export class SpinnerOverlayModule {}
