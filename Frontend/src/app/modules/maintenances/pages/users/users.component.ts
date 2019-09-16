import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService, IValidators } from '@app/core';
import { LoaderService, AlertService } from '@app/shared';
import { FormGroup, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('formDirective', {static: false}) private formDirective: NgForm;
  sortName: string | null = null;
  sortValue: string | null = null;
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfAllData: User[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  configPagging: any = {
    totalItems: 0,
    itemsPerPage: 5
  };
  visible = false;
  form: FormGroup;
  userEditing = false;
  userSelectedEdit: User = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
  };
  constructor(
    private userService: UserService,
    private loaderService: LoaderService,
    private nzMessageService: NzMessageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getUserList(1, this.configPagging.itemsPerPage);
    this.buildForm();
  }
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfAllData.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate = this.listOfAllData.some(item => this.mapOfCheckedId[item.id]) &&!this.isAllDisplayDataChecked;
    this.numberOfChecked = this.listOfAllData.filter(item => this.mapOfCheckedId[item.id]).length;
  }

  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
  buildForm() {
    this.form = this.formBuilder.group(
      {
        firstname: ['', [IValidators.spaceStringValidator()]],
        lastname: ['', [IValidators.spaceStringValidator()]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            IValidators.spaceStringValidator(),
            IValidators.includeSpaceStringValidator()
          ]
        ],
        password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
        confirmPassword: ['', Validators.compose([Validators.required])],
        email: ['', [Validators.required, IValidators.emailValidator()]],
      },
      {
        validator: IValidators.passwordMatchValidator
      }
    );
  }
  pageIndexChange($event: any) {
    this.getUserList($event, this.configPagging.itemsPerPage);
    this.mapOfCheckedId = {};
    this.refreshStatus();
  }
  
  getUserList(page: any, pageSize: any) {
    this.loaderService.display(true);
    this.userService.getUserList(page  ? page : 1, pageSize, 'createdAt', 'desc').subscribe(
      response => {
        if (response.status.code === 200) {
          this.listOfAllData = response.results;
          this.configPagging = {
            itemsPerPage: pageSize,
            currentPage: page  ? page : 1,
            totalItems: response.pagination.totalItems
          };
        }
      },
      err => {
        this.loaderService.display(false);
      },
      () => {
        this.loaderService.display(false);
      }
    );
  }
  onAddUser(formData: any, formDirective: FormGroupDirective) {
    if (this.form.invalid) {
      return;
    }
    this.loaderService.display(true);
    if (!this.userEditing) {
      this.userService.addUser(formData.value).subscribe(
        data => {
          this.resetFormAfterSubmit(formDirective, true);
          this.nzMessageService.success(data.status.message);
        },
        err => {
          this.loaderService.display(false);
        },
        () => {
          this.loaderService.display(false);
        }
      );
    } else {
      this.userService.updateUser(formData.value, this.userSelectedEdit.id).subscribe(
        data => {
          this.resetFormAfterSubmit(formDirective, false);
          this.nzMessageService.success(data.status.message);
        },
        err => {
          this.loaderService.display(false);
        },
        () => {
          this.loaderService.display(false);
        }
      );
    }
  }
  resetFormAfterSubmit(formDirective: FormGroupDirective, isAddnew: boolean) {
    this.getUserList(isAddnew ? 1 : this.configPagging.currentPage, this.configPagging.itemsPerPage);
    this.userEditing = false;
    formDirective.resetForm();
    this.form.reset();
    this.closeForm();
  }
  openForm(user: User) {
    this.visible = true;
    this.form.reset();
    this.userEditing = false;
    if (user) {
      this.userEditing = true;
      this.userSelectedEdit = Object.assign({}, user);
    }
  }
  onDeleteUser(userId: number) {
    this.loaderService.display(true);
    this.userService.deleteUser(userId).subscribe(response => {
      if (response.status.code === 200) { 
        this.nzMessageService.success(response.status.message);
        this.getUserList(this.configPagging.currentPage, this.configPagging.itemsPerPage);
      }
    },
    err => {
      this.loaderService.display(false);
    },
    () => {
      this.loaderService.display(false);
    })
  }
  onDeleteMultyUser() {
    const userIds = Object.keys(this.mapOfCheckedId);
    this.userService.deleteMultyUser({userIds}).subscribe(response => {
      if (response.status.code === 200) {
        this.mapOfCheckedId = {};
        this.refreshStatus();
        this.nzMessageService.success(response.status.message);
        this.getUserList(this.configPagging.currentPage, this.configPagging.itemsPerPage);
      }
    },
    err => {
      this.loaderService.display(false);
    },
    () => {
      this.loaderService.display(false);
    })
  }
  closeForm(): void {
    this.visible = false;
  }
  
}
