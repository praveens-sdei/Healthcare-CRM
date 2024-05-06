import { CoreService } from "./../../../../../shared/core.service";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { PharmacyPlanService } from "../../../../pharmacy/pharmacy-plan.service";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as XLSX from 'xlsx';


export interface PeriodicElement {
  date: string;
  claimid: string;
  prescribercentre: string;
  insuranceprovider: string;
  insuranceholder: string;
  insuranceid: string;
  patient: string;
  reimbursmentrate: string;
  paidbypatient: string;
  requestedamount: string;
  totalamount: string;
  approvedamount: string;
  rejectamount: string;
  // comments: string;
  status: string;
  detail: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-hospitalizationclaimsview',
  templateUrl: './hospitalizationclaimsview.component.html',
  styleUrls: ['./hospitalizationclaimsview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'customdropdown' },
    },
  ],
})
export class HospitalizationclaimsviewComponent implements OnInit {
  displayedColumns: string[] = [
    "status",
    "date",
    "claimid",
    "claimType",
    // "makeClaim",
    "prescribercentre",
    "insuranceprovider",
    "insuranceholder",
    "insuranceid",
    "patient",
    "reimbursmentrate",
    "totalamount",
    "paidbypatient",
    "requestedamount",
    "approvedamount",
    "rejectamount",
    "Resubmit Reason",
    "Action",
  ];
  dataSource = ELEMENT_DATA;
  pharmacyId: any;
  claimStatus: any = "pending";
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  @ViewChild("select") select: MatSelect;
  allSelected = false;
  foods: any[] = [
    // { value: "ASCOMA", viewValue: "ASCOMA" },
    // { value: "Coris", viewValue: "Coris" },
    // { value: "yelen", viewValue: "yelen" },
  ];
  selectedinsurance: any = [];
  statusCountData: any;
  innerMenuPremission:any=[];
  sortColumn: string = 'mediclaimcommoninfosData.status';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  userRole: any;
  constructor(
    private pharmacyPlanService: PharmacyPlanService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private router: Router,
    private loader : NgxUiLoaderService,

  ) { 
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role;

    if(this.userRole === "HOSPITAL_STAFF"){
      this.pharmacyId = adminData?.for_doctor;

    }else if(this.userRole === "INDIVIDUAL_DOCTOR_STAFF"){
      this.pharmacyId = adminData?.in_hospital;
    }else{
      this.pharmacyId = loginData?._id;

    }
  }

  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getClaimList(`${column}:${this.sortOrder}`);
  }


  ngOnInit(): void {
   
    this.getClaimList(`${this.sortColumn}:${this.sortOrder}`);
    this.getStatusCount();
    this.getAllInsurance();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
  }
  
  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }
  checkInnerPermission(){

    let userPermission = this.coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)

    if(checkData){
      if(checkData.isChildKey == true){

        var checkSubmenu = checkData.submenu;      

        if (checkSubmenu.hasOwnProperty("hospitalization_claims")) {
          this.innerMenuPremission = checkSubmenu['hospitalization_claims'].inner_menu;

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


  private getAllInsurance() {
    const param = {
      page: 1,
      limit: 0,
      searchText: '',
      startDate: '',
      endDate: ''
    }
    this.pharmacyPlanService.getApprovedInsurance(param).subscribe({
      next: async (res) => {
        const encryptedData = await res;


        let result = this.coreService.decryptObjectData(encryptedData);
        console.log('insurance details', result);
        if (result.status) {

          // this.insuraneList = result.body.result;

          result.body.result.map((curentval, index) => {


            this.foods.push({
              viewValue: curentval.company_name,
              value: curentval.for_portal_user._id
            });
          })



        } else {
          this.coreService.showError(result.message, '');
        }

      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      }
    });
  }

  getClaimList(sort: any = '') {
    let reqData = {
      status: this.claimStatus,
      createdByIds: [this.pharmacyId],
      limit: this.pageSize,
      page: this.page,
      insuranceIds: this.selectedinsurance.join(","),
      sort: sort
    };
    console.log(reqData, "check data ");

    this.pharmacyPlanService.medicineClaimListHospitalclaimExtensionFinal(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // console.log("All Medicine claims ---->", response);
      this.dataSource = response?.data?.result;
      console.log("All Medicine claims ---->", this.dataSource);
      this.totalLength = response?.data?.totalRecords;
    });
  }

  pendingCounts: any;
  approvedCounts: any;
  rejectedCounts: any;
  resubmitCounts: any;
  pre_authorizationCounts: any;

  getStatusCount() {
    this.pharmacyPlanService
      .medicineClaimCountByStatusHospitalClaimExtensionFinal(this.pharmacyId, this.selectedinsurance.join(","))
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        console.log("COUNT CLAIMS BY STATUS==============>", response);
        this.statusCountData = response?.data;
      });
  }

  onTabChange(tab: any) {
    console.log("Tab ---->", tab);
    this.claimStatus = tab;
    this.getClaimList();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getClaimList();
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  findvalue(fieldname: any, data: any) {
    let findobject = [];
    if (data) {
      findobject = data.filter((element: any) => {
        return (element.fieldName == fieldname)
      })
    }
    else {
      findobject = [];
    }
    if (findobject.length > 0) {
      return findobject[0].fieldValue
    } else {
      return '';
    }

  }

  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {


      if (!item.selected) {

        newStatus = false;
        if (this.selectedinsurance.indexOf(item.value) != -1) {
          this.selectedinsurance.splice(this.selectedinsurance.indexOf(item.value), 1);
        }
      }
      else {
        console.log("tejhgjdksfksd" + item.value, this.selectedinsurance.indexOf(item.value));
        if (this.selectedinsurance.indexOf(item.value) == -1) {
          this.selectedinsurance.push(item.value);
        }
      }
    });
    this.allSelected = newStatus;
    this.getClaimList();
    this.getStatusCount();
    console.log(this.selectedinsurance, "selectedinsurance");

  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
  editclaim(claim_id, claimtype = '') {
    this.router.navigate(["/individual-doctor/claims/hospitalsubmitclaim"], {
      queryParams: { claim_id: claim_id, claimtype: claimtype },
    });
  }

  exportLab() {  
    this.loader.start();
    var data: any = [];   
    let reqData = {
      status: this.claimStatus,
      createdByIds: [this.pharmacyId],
      limit: 100000,     
      insuranceIds: this.selectedinsurance.join(",")    
    };   

    this.pharmacyPlanService.medicineClaimListHospitalclaimExtensionFinal(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res }); 
         
        if(response.status == true){
          this.loader.stop();
          var array = [
            "status",
            "date",
            "claim_id",
            "prescriber_center",
            "insurance_provider",
            "insurance_holder",
            "insurance_id",
            "patient_name",
            "reimbursment_rate",
            "total_amount",
            "paid_by_patient",
            "request_amount",
            "approved_amount",
            "reject_amount",
            "resubmit_reason",
           ];
  
           data = response?.data?.exportdata;
           data.unshift(array);           
           var fileName = 'medicalconsultationExcel.xlsx';
  
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
          this.getClaimList();
        }
      });
  }
}