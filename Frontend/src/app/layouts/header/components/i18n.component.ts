import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { I18nService } from '@app/core';

@Component({
  selector: 'header-i18n',
  template: `
    <div nz-dropdown [nzDropdownMenu]="langMenu" nzPlacement="bottomRight">
      <i nz-icon nzType="global"></i>
      {{ 'menu.lang' | translate }}
      <i nz-icon nzType="down"></i>
    </div>
    <nz-dropdown-menu #langMenu="nzDropdownMenu">
      <ul nz-menu>
        <li
          nz-menu-item
          *ngFor="let item of langs"
          [nzSelected]="item.code === curLangCode"
          (click)="change(item.code)"
        >
          <span role="img" [attr.aria-label]="item.text" class="pr-xs">{{ item.abbr }}</span>
          {{ item.text }}
        </li>
      </ul>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class I18nComponent implements OnInit {
  LANGS: any = {
    'zh-CN': {
      text: '简体中文',
      abbr: '🇨🇳'
    },
    'zh-TW': {
      text: '繁体中文',
      abbr: '🇭🇰'
    },
    'en-US': {
      text: 'English',
      abbr: '🇬🇧'
    },
    'fr-FR': {
      text: 'French',
      abbr: '🇫🇷'
    }
  };
  langs = Object.keys(this.LANGS).map(code => {
    const item = this.LANGS[code];
    return { code, text: item.text, abbr: item.abbr };
  });
  constructor(private i18nService: I18nService) {}
  ngOnInit() {
    
  }
  change(lang: string) {
    this.i18nService.language = lang;
    // this.i18n.use(lang);
    // this.settings.setLayout('lang', lang);
  }
}
