import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from '../patient.service';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from "@techiediaries/ngx-qrcode";
@Component({
  selector: 'app-patient-vaccination-card',
  templateUrl: './patient-vaccination-card.component.html',
  styleUrls: ['./patient-vaccination-card.component.scss']
})
export class PatientVaccinationCardComponent implements OnInit {
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.LOW;
    
  queryParams: any=[];
  getData: any;
    constructor(
      private activatedRoute: ActivatedRoute,
      private _coreService: CoreService,
      private patientService: PatientService
      ) { }

  ngOnInit(): void {
    let data = this.activatedRoute.snapshot.paramMap.get("id");
    this.getVaccinationData(data)
    
  }

getVaccinationData(id){
  let reqData ={
    _id:id
  }
  this.patientService.getIDbyImmunization(reqData).subscribe((res) => {
    let response = this._coreService.decryptObjectData({data:res});
    // console.log("RESPONSE=====>", res);   
    if(response.status == true){
      this.getData = response.data;
      // console.log("RESPONSE=====>", this.getData);
    }
  });
}

}
