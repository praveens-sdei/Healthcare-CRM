import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from '../../patient.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {
  // aboutUsEnForm!: FormGroup;
  // aboutUsFrForm!: FormGroup;
  // showEnData: any;
  // showFrData: any;
  // sanitizedHtmlData: SafeHtml = '';
  langType:any='en';
  showData:any;
  showText:any;
  image:any;
  constructor(
    private fb: FormBuilder,
    private service: PatientService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    public translate: TranslateService,
    // private sanitizer: DomSanitizer
  ) { 
    // translate.addLangs(['en','fr']);
    // translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.getLanguageList();
  }


  getLanguageList() {
    const params = {
      langType: this.translate.currentLang
    };
    console.log("params->>",params)

       this.service.getAboutUs(params).subscribe((res) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        this.showData = response?.body;
        console.log("showData=======>", this.showData);
        this.showText= response?.body?.text;
        // this.sanitizedHtmlData = this.sanitizer.bypassSecurityTrustHtml(this.showText);
        // this.showText= response?.body?.text.replace(/(<([^>]+)>)/gi, '');
        console.log("showText=======>", this.showText);
        // this.image= response?.body?.image.replace(/(<([^>]+)>)/gi, '');
        // console.log("image=======>", this.image);
        // this.updateValueEn();
        // this.updateValueFr();
      });
  
  }
}
