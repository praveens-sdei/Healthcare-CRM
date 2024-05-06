import { Component, OnInit } from '@angular/core';
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/auth.service";
import { InsuranceService } from '../insurance.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-insurance-superadminpermission',
  templateUrl: './insurance-superadminpermission.component.html',
  styleUrls: ['./insurance-superadminpermission.component.scss']
})
export class InsuranceSuperadminpermissionComponent implements OnInit {
  adminId: any = "";
  profileDetails: any;
  allowHealthPlan:boolean;
  groupIcon: any = "";
  logoIcon: any = "";
  allowSubscription: boolean;
  constructor( 
    private _insuranceService: InsuranceService,
    private _coreService: CoreService,
    private loader: NgxUiLoaderService,
    private sadminService: SuperAdminService,
    private auth: AuthService) { }

  ngOnInit(): void {
   
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.adminId = loginData?._id;
    this.getInsuranceDetails()
  }

  getInsuranceDetails() {
    let reqData = {
      id: this.adminId,
    };

    this._insuranceService.getProfileDetails(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });

      if (response.status) {
        this.profileDetails = response?.body;
      }
      this.allowHealthPlan = response?.body?.allowHealthPlan
      this.allowSubscription=response?.body?.allowSubscription
      
      this.groupIcon = response?.body?.profile_pic_signed_url
      this.logoIcon = response?.body?.company_logo_signed_url
    });
  }
  allowSubscriptioncheckbox(ischecked:any){
  
    if (ischecked.target.checked) {
     this.allowSubscription=true

      
    } 
    else {
      this.allowSubscription=false

    }
  }
  allowHelthPlancheckbox(ischecked:any){
  
    if (ischecked.target.checked) {
     this.allowHealthPlan=true

      
    } 
    else {
      this.allowHealthPlan=false

    }
  }
  updatesuperadminpermission(){
    this.loader.start();
    let reqData={
      id: this.adminId,
      allowHealthPlan:this.allowHealthPlan,
      allowSubscription:this.allowSubscription
    }
    this._insuranceService.updatesuperadminpermission(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({data:res});      
      if (response.status) {
        this.loader.stop();
        this._coreService.showSuccess(response.message, "");        
      }else{
        this.loader.stop();
      }
    });
  }
}
