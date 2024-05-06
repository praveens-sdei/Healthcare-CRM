import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { CoreService } from 'src/app/shared/core.service';


@Component({
  selector: 'app-complaintdetail',
  templateUrl: './complaintdetail.component.html',
  styleUrls: ['./complaintdetail.component.scss']
})
export class ComplaintdetailComponent implements OnInit {
  paramId: string;
  complaintData: any;
  userData: any;
  add_response!: FormGroup
  handleStatus: any = "";
  innerMenuPremission:any=[];
  userRole: any;
  constructor(
    private _coreService: CoreService,
    private _superAdminService: SuperAdminService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService

  ) {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.userRole = loginData?.role;
   }

  ngOnInit(): void {
    this.paramId = this.activatedRoute.snapshot.paramMap.get("id");
    console.log("paramId", this.paramId);
    this.getViewDetails();
    this.add_response = this.fb.group({
      _id: "",
      provider_response: [""]

    })
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){

    let userPermission = this._coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)

    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;      

        if (checkSubmenu.hasOwnProperty("claim-process")) {
          this.innerMenuPremission = checkSubmenu['claim-process'].inner_menu;

        } else {
          console.log(`does not exist in the object.`);
        }

      }else{
        var checkSubmenu = checkData.submenu;

        let innerMenu = [];

        for (let key in checkSubmenu) {

          innerMenu.push({name: checkSubmenu[key].name, slug: key, status: true});
        }

        this.innerMenuPremission = innerMenu;
        console.log("this.innerMenuPremission_______________-",this.innerMenuPremission);
        
      }      
    }  
    

  }
  giveInnerPermission(value){
    if(this.userRole === "INDIVIDUAL_DOCTOR_STAFF" || this.userRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;
    }

  
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
      console.log("view==>", response);
      this.add_response.patchValue({
        provider_response: this.complaintData?.provider_response
      })
    });
  }


  addYourResponse() {
      let reqData = {
        _id: this.paramId,
        provider_response: this.add_response.value.provider_response

      }
      this.loader.start();
      console.log("reqData----------------->", reqData);
      this._superAdminService.updateComplaintResponse(reqData).subscribe((res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        console.log("addComplaint----------------->", response);
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
      doctor: 'Doctor'
    }
    return obj[ele];


  }

}
