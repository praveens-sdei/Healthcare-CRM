import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { CoreService } from 'src/app/shared/core.service';

@Component({
  selector: 'app-compliant-view',
  templateUrl: './compliant-view.component.html',
  styleUrls: ['./compliant-view.component.scss']
})
export class CompliantViewComponent implements OnInit {
  paramId: string;
  complaintData: any;
  userData: any;
  add_response!: FormGroup
  handleStatus: any = "";
  userRole: any;
  userPermission: any;
  innerMenuPremission:any=[];
  profilePic: any;
  loginType: any;
  constructor(
    private _coreService: CoreService,
    private _superAdminService: SuperAdminService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService,
    private router: Router,

  ) { 
    let loginData = JSON.parse(localStorage.getItem("loginData"));

  }

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.loginType=loginData?.type
    this.paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.getViewDetails();
    this.add_response = this.fb.group({
      _id: "",
      provider_response: [""]

    })
  }
  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  get form(): { [key: string]: AbstractControl } {
    return this.add_response.controls;
  }


  getViewDetails() {
    let reqData = {
      _id: this.paramId
    }
    this._superAdminService.getUserComplaint(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });

      this.complaintData = response?.data?.complaintReason;
      this.userData = response?.data?.userData;
      this.profilePic=response?.data?.profilePic
      this.add_response.patchValue({
        provider_response: this.complaintData?.provider_response
      })
    });
  }

  addYourResponse() {
    this.loader.start();
      let reqData = {
        _id: this.paramId,
        provider_response: this.add_response.value.provider_response

      }
      this._superAdminService.updateComplaintResponse(reqData).subscribe((res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.getViewDetails();
          this._coreService.setCategoryForService(1);
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
    }


    userName(ele: any) {
      let obj = {
        PATIENT: 'Patient',
        insurance: 'Insurance',
        hospital: 'Hospital',
        pharmacy: 'Pharmacy',
        doctor: 'Doctor',
        
        
      }
      return obj[ele];
  
  
    }

    onNavigate(){
      this.router.navigate(['/portals/complaint/'+ this.loginType]);
    }
}
