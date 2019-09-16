import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoaderService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loaderCounter = 0;

  display(value: boolean) {
    this.loaderCounter = value ? this.loaderCounter + 1 : this.loaderCounter - 1;
    if (this.loaderCounter < 0) {
      this.loaderCounter = 0;
    }
    const nextStatus = this.loaderCounter > 0;
    this.status.next(nextStatus);
  }

  clear() {
    this.loaderCounter = 0;
    this.status.next(false);
  }
}
