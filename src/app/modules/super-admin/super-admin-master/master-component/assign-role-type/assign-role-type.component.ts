import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InsuranceService } from 'src/app/modules/insurance/insurance.service';
import { CoreService } from 'src/app/shared/core.service';
import { SuperAdminService } from '../../../super-admin.service';
import { InsuranceManagementService } from "../../../../super-admin/super-admin-insurance.service";
import { PatientService } from 'src/app/modules/patient/patient.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-assign-role-type',
  templateUrl: './assign-role-type.component.html',
  styleUrls: ['./assign-role-type.component.scss']
})
export class AssignRoleTypeComponent implements OnInit {
  loggedUserId: any;
  mylist: Array<string> = [];
  planserviceList: any;
  portalType: string;
  portalValue: any = '';
  portaltypeData: any = [];
  insuranceList: any[] = [];
  insuranceCompanyId: any;
  isSubmitted: boolean = false
  overlay: false;
  adminID: any;


  constructor(private sAdminServices: SuperAdminService,
    private service: InsuranceService,
    private insuranceService: InsuranceManagementService,
    private patientService: PatientService,
    private _coreService: CoreService,private loader : NgxUiLoaderService) {
    const userdata = this._coreService.getLocalStorage('loginData');
    const adminData = this._coreService.getLocalStorage('adminData');

    this.loggedUserId = userdata._id


    if (userdata.role === 'STAFF_USER') {
      this.adminID = adminData?.for_staff

    } else {
      this.adminID = this.loggedUserId

    }

  }

  // getCompanyid(event:any) {
  //   this.insuranceCompanyId = event;
  //   this.getplanserviceneByForUser(this.insuranceCompanyId)
  // }
  // getInsuranceList() {
  //   this.insuranceService.insuranceList().subscribe((res: any) => {
  //     let listOfData = this._coreService.decryptObjectData({ data: res.data });

  //     this.insuranceList = listOfData.body.result;
  //   });
  // }
  getCompanyid(event: any) {
    console.log(event, "event log")
    this.insuranceCompanyId = event.value;
    this.getplanserviceneByForUser(event.value)
  }
  getInsuranceList() {
    this.patientService.getInsuanceList().subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      const arr = response?.body?.result;
      // arr.unshift({
      //   for_portal_user: { _id: "" },
      //   company_name: "All Insurance Company",
      // });
      arr.map((curentval: any) => {
        this.insuranceList.push({
          label: curentval?.company_name,
          value: curentval?.for_portal_user?._id,
        });
      });
      console.log(this.insuranceList, "insuranceList");
    });
  }
  ngOnInit(): void {
    this.getInsuranceList();

  }
  getplanserviceneByForUser(insuranceCompanyId: any) {

    this.sAdminServices.getplanserviceneByForUser(insuranceCompanyId).subscribe(async (res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);


      this.planserviceList = await response.body;

    });
  }
  portaltypeandinsuranceId() {
    this.loader.start();
    let myjson = {
      categoryName: this.mylist,
      insuranceId: this.insuranceCompanyId,
      forportaluserId: this.adminID,
      portalType: this.portalValue,
      addedBy: "SuperAdmin",
      created_by: this.loggedUserId
    }
    this.sAdminServices.portaltypeandinsuranceId(myjson).subscribe({
      next: (res) => {
        let result = this._coreService.decryptContext(res);
        console.log(result, "YYYYYYYYYYYYYYY");
        if (result.status) {
          this.loader.stop();
          this._coreService.showSuccess(result.message, '');
        } else {
          this.loader.stop();
          this._coreService.showError(result.message, '');
        }
      },
      error: (err: ErrorEvent) => {
        this.loader.stop();
        console.log(err.message);
      }
    })
  }
  checkboxCheck(name: any, ischecked: any) {
    if (this.portalValue != '') {
      if (name && ischecked.target.checked) {
        if (!this.mylist.includes(name)) {
          this.mylist.push(name)


        }

      }
      else {
        let index = this.mylist.indexOf(name)
        this.mylist.splice(index, 1)



      }

    } else {
      this._coreService.showError("Need to select role type", "")
    }
  }

  portalTypeSeclect(event: any) {
    this.portaltypeData = []
    this.mylist = []
    this.portalValue = event.value

    this.getportaltypeandinsuranceId()

  }
  getportaltypeandinsuranceId() {
    let mydata = {
      insuranceId: this.insuranceCompanyId,
      portalType: this.portalValue
    }
    this.sAdminServices.getportaltypeandinsuranceId(mydata).subscribe(async (res) => {

      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        if (response.body.result.length > 0) {
          this.portaltypeData = response.body.result[0].categoryName;
          this.portaltypeData.map((name: any) => {
            this.mylist.push(name)
          })
        }

      }

    });
  }
}
