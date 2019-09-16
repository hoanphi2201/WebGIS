import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  objSwal: any = {
    title: 'Thông báo',
    html: '',
    width: null,
    footer: null,
    type: '',
    textConfirm: 'Yes, Do it',
    textCancel: 'Cancel',
    timer: null,
    showCloseButton: false,
    showCancelButton: true,
    focusCancel: false,
    showConfirmButton: true,
    allowOutsideClick: true
  };
  constructor() {}
  ResetSwalDefault() {
    this.objSwal.title = 'Thông báo';
    this.objSwal.html = '';
    this.objSwal.width = null;
    this.objSwal.footer = null;
    this.objSwal.type = '';
    this.objSwal.textConfirm = 'Yes';
    this.objSwal.textCancel = 'No';
    this.objSwal.timer = null;
    this.objSwal.showCloseButton = false;
    this.objSwal.showCancelButton = true;
    this.objSwal.focusCancel = false;
    this.objSwal.showConfirmButton = true;
    this.objSwal.allowOutsideClick = true;
  }
  SwalMain(objSwal: any, FuncConfirm: any) {
    swal({
      title: objSwal.title,
      html: objSwal.html,
      width: objSwal.width,
      type: objSwal.type,
      confirmButtonText: objSwal.textConfirm,
      cancelButtonText: objSwal.textCancel,
      timer: objSwal.timer,
      showCloseButton: objSwal.showCloseButton,
      showCancelButton: objSwal.showCancelButton,
      focusCancel: objSwal.focusCancel,
      showConfirmButton: objSwal.showConfirmButton,
      allowOutsideClick: objSwal.allowOutsideClick,
      cancelButtonClass: 'btn btn-blue btn-fix btn-square',
      confirmButtonClass: 'btn btn-blue btn-fix btn-square'
    })
      .then(result => {
        if (result) {
          FuncConfirm();
        }
      })
      .catch(swal.noop);
  }

  SwalConfirm(html: string, FuncConfirm: any, title: string, width: string = '', textConfirm: string = '') {
    this.ResetSwalDefault();
    this.objSwal.html = html;
    this.objSwal.title = title;
    this.objSwal.width = width === '' ? null : width;
    this.objSwal.textConfirm = textConfirm === '' ? 'Ok' : textConfirm;
    this.objSwal.allowOutsideClick = false;
    this.SwalMain(this.objSwal, FuncConfirm);
  }
}
