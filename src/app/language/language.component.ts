import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {

  constructor(public translate: TranslateService) {
    translate.addLangs(['en','fr']);
    translate.setDefaultLang('en');
    
  }
  switchLang(lang: string) {
    console.log("lang====>",lang)
    this.translate.use(lang);
  }

  ngOnInit(): void {
  }

}
