import { Component, OnInit } from '@angular/core';

import { Alert, AlertType } from '@app/core/models';
import { AlertService } from '@app/shared/services';

@Component({
  moduleId: module.id,
  selector: 'alert',
  templateUrl: 'alert.component.html'
})
export class AlertComponent implements OnInit {
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }

      // add alert to array
      this.alerts.push(alert);

      // remove alert after 5 seconds
      setTimeout(() => this.removeAlert(alert), 5000);
    });
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }

    // return css class based on alert type
    switch (alert.type) {
      case AlertType.Success:
        return 'toast-message alert alert-success';
      case AlertType.Error:
        return 'toast-message alert alert-danger';
      case AlertType.Info:
        return 'toast-message alert alert-info';
      case AlertType.Warning:
        return 'toast-message alert alert-warning';
    }
  }
}
