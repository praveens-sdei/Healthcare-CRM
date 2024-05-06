import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from '../../patient.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  showData:any;
  language: any = "en";
email:any;
phone:any;
address:any;
  constructor(
    private fb: FormBuilder,
    private service: PatientService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.listContactUs();
  }

  listContactUs() {
    const params = {
      langType: this.translate.currentLang
    }
    console.log("params=======>>>>", params)
    this.service.getContactus(params).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("CONTACT RESPONSE", response);
      this.showData = response?.body;
      console.log("this.showData",this.showData)
      this.email = response?.body?.email;
      this.phone = response?.body?.phone;
      this.address = response.body?.address;
    });
  }
}
