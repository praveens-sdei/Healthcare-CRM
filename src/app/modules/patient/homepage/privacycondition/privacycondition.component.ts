import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from '../../patient.service';

@Component({
  selector: 'app-privacycondition',
  templateUrl: './privacycondition.component.html',
  styleUrls: ['./privacycondition.component.scss']
})
export class PrivacyconditionComponent implements OnInit {
  showData:any;
  showText: any;
  constructor(
    private fb: FormBuilder,
    private service: PatientService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.getPrivacylist();
  }

  getPrivacylist() {
    const params={
      langType: this.translate.currentLang
    }
    this.service.getlistpNc(params).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.showData = response?.body;
      // console.log("FrPNClist ", this.showData);
      this.showText= response?.body?.text;
   
    });
  }
}
