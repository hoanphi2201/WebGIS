import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Logger, I18nService, AuthService, untilDestroyed, IValidators } from '@app/core';
import { environment } from '@env/environment';
import { LoaderService } from '@app/shared/services';
import { NzMessageService } from 'ng-zorro-antd';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string = environment.version;
  loginForm: FormGroup;
  isLoading = false;
  returnUrl: string;
  error: string | undefined;

  constructor(
    private i18nService: I18nService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private nzMessageService: NzMessageService
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/dashboard');
    }
    this.buildForm();
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  ngOnDestroy() {}

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loaderService.display(true);
    this.authService.login(this.loginForm.value).subscribe(
      data => {
        log.debug(`successfully logged in`);
        this.nzMessageService.success('Login success');
        this.router.navigate([this.route.snapshot.queryParams.redirect || '/dashboard'], { replaceUrl: true });
      },
      err => {
        this.loaderService.display(false);
        log.debug(`Login error: ${err.status && err.status.message ? err.status.message : ' '}`);
        this.error = err.status && err.status.message ? err.status.message : ' ';
        this.nzMessageService.success(this.error);
      },
      () => {
        this.loaderService.display(false);
      }
    );
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, IValidators.spaceStringValidator()]],
      password: ['', Validators.required]
    });
  }
}
