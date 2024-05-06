import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../../super-admin.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { log } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-complaintview',
  templateUrl: './complaintview.component.html',
  styleUrls: ['./complaintview.component.scss']
})
export class ComplaintviewComponent implements OnInit {
  add_superAdmin_response!: FormGroup
  paramId: string;
  complaintData: any;
  userData: any;
  handleStatus: any = "";
  innerMenuPremission:any=[];
  loginrole: any;
  profilePic: any;

  constructor(
    private _coreService: CoreService,
    private _superAdminService: SuperAdminService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private loader : NgxUiLoaderService


  ) {
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
   }

  ngOnInit(): void {
    this.paramId = this.activatedRoute.snapshot.paramMap.get("id");
    console.log("paramId", this.paramId);
    this.getViewDetails();
    this.add_superAdmin_response = this.fb.group({
      _id: "",
      super_admin_response: [""]

    })
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array?.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this._coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    // console.log(menuID,userPermission,"checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("pharmacy")) {
          this.innerMenuPremission = checkSubmenu['pharmacy'].inner_menu;
          console.log(`exist in the object.`);

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
      }
      console.log("this.innerMenuPremission----------",this.innerMenuPremission);
      
    }  
  }

  giveInnerPermission(value) {
    if (this.loginrole === 'STAFF_USER') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.add_superAdmin_response.controls;
  }
  getViewDetails() {
    let reqData = {
      _id: this.paramId,
    }
  console.log("reqData",reqData);
  
    this._superAdminService.getUserComplaint(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });

      this.complaintData = response?.data?.complaintReason
      this.userData = response?.data?.userData
      this.profilePic=response?.data?.profilePic
      console.log("view==>", response);
      this.add_superAdmin_response.patchValue({
        super_admin_response: this.complaintData?.super_admin_response
      })

    });
  }

  statusHandle(status: any) {
    this.handleStatus = status
  }
  addYourResponse() {
    if (this.handleStatus != "") {
      this.loader.start();
      let reqData = {
        _id: this.paramId,
        super_admin_response: this.add_superAdmin_response.value.super_admin_response,
        status: this.handleStatus

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

  }

  // updateComplaintResponse
  userName(ele: any) {
    let obj = {
      PATIENT: 'Patient',
      insurance: 'Insurance',
      hospital: 'Hospital',
      pharmacy: 'Pharmacy',
      doctor: 'Doctor'
    }
    return obj[ele]


  }
}
