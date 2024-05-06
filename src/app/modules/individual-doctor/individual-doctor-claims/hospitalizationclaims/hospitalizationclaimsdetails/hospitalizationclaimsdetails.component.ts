import { PharmacyPlanService } from "./../../../../pharmacy/pharmacy-plan.service";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChartConfiguration } from "chart.js";
import { map, Observable, startWith } from "rxjs";
import { CoreService } from "src/app/shared/core.service";
import { ActivatedRoute } from "@angular/router";
import { InsuranceSubscriber } from "src/app/modules/insurance/insurance-subscriber.service";

export interface InsuranceElement {
  other_service_name: string,
  quantity_prescribed: string,
  price_per_unit: string;
  copayment: string;
  reimbursementrate: string;
  totalrequestedamount: string;
  totalamount: string;
}

const INSURANCE_DATA: InsuranceElement[] = [
  { other_service_name: 'other_service_name', quantity_prescribed: 'medicine', price_per_unit: 'It is a long established fact that a reader', copayment: '1 600 CFA', reimbursementrate: '80%', totalrequestedamount: '6 400 CFA', totalamount: '8 000 CFA' },

];
@Component({
  selector: 'app-hospitalizationclaimsdetails',
  templateUrl: './hospitalizationclaimsdetails.component.html',
  styleUrls: ['./hospitalizationclaimsdetails.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HospitalizationclaimsdetailsComponent implements OnInit {
  displayedColumnss: string[] = [
    'other_service_name',
    'quantity_prescribed',
    'price_per_unit',
    'copayment',
    'reimbursementrate',
    'totalrequestedamount',
    'totalamount',


  ];
  dataSources = INSURANCE_DATA;

  public doughnutChart2Datasets: ChartConfiguration<"doughnut">["data"]["datasets"] =
    [
      {
        data: [200, 800],
        label: "Reputation",
        backgroundColor: ["#FFD57A", "#62D94F"],
        hoverBackgroundColor: ["#FFD57A", "#62D94F"],
        hoverBorderColor: ["#FFD57A", "#62D94F"],
        borderWidth: 0,
        hoverBorderWidth: 0,
      },
    ];

  public doughnutChart2Options: ChartConfiguration<"doughnut">["options"] = {
    responsive: true,
  };

  // Doughnut chart
  public doughnutChartDatasets: ChartConfiguration<"doughnut">["data"]["datasets"] =
    [
      {
        data: [200, 800],
        label: "Reputation",
        backgroundColor: ["#FFD57A", "#4F90F2"],
        hoverBackgroundColor: ["#FFD57A", "#4F90F2"],
        hoverBorderColor: ["#FFD57A", "#4F90F2"],
        borderWidth: 0,
        hoverBorderWidth: 0,
      },
    ];

  public doughnutChartOptions: ChartConfiguration<"doughnut">["options"] = {
    responsive: true,
  };

  claimID: any = ""
  allDetails: any;
  planExclusion: any = [];
  reimbursmentRate: any = 0;
  subscriber_details: any;
  totalCost: any = 0;
  totalCoPayment: any = 0;
  totalToBePaidByInsurance: any = 0;
  totalApprovedAmountByCFO: any = 0;
  dynamiccolumns: any[];
  uniqueRole: any;
  claimDetailsclaimStaffData: any;
  patientId: any;
  lastElement: any;
  for_current_insurance_staff_role: any;
  forcurrnetinsurnacestaffName: any;
  userRole: string;
  innerMenuPremission:any=[];

  constructor(
    private pharmacyPlanService: PharmacyPlanService,
    private coreService: CoreService,
    private actoivatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private insuranceSubscriber: InsuranceSubscriber,
  ) { 
    let loginData = JSON.parse(localStorage.getItem("loginData"));

    this.userRole = loginData?.role;
  }

  ngOnInit(): void {

    this.claimID = this.actoivatedRoute.snapshot.paramMap.get('id')
    this.getMedicineClaimDetails()
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
  
  private async getPlanDetails(selectedsubscriberid: any, selectedservice: any) {
    let param = {
      subscriber_id: selectedsubscriberid
    }

    this.pharmacyPlanService.getInsurancePlanDetailsbysubscriber(param).subscribe({
      next: async (res) => {
        console.log(res);

        const encData = await res;
        let result = this.coreService.decryptContext(encData)
        console.log('plandetails', result);
        if (result.status) {
          this.subscriber_details = result.body?.resultData
          this.planExclusion = result.body?.planExclusion;
          result.body?.planService.forEach(element => {
            if (element?.service === selectedservice) {
              this.reimbursmentRate = element.reimbursment_rate;
              return;
            }
          });


        } else {
          this.reimbursmentRate = 0;
        }

      }
    })
  }




  checkmedicine(medicine_name: any) {
    // medicine_name = medicine_name.toLowerCase();
    let excReimburmentRate = 1;
    var returndata = false;
    // console.log(this.planExclusion,'select2updateEventValue',medicine_name);
    // console.log('select2updateEventValue', excReimburmentRate);
    this.planExclusion.forEach((element, index1) => {
      //  console.log(this.planExclusion,'select2updateEventValue',medicine_name);
      //  console.log(this.planExclusion,'select2updateEventValue',element.in_exclusion.name);
      const result = medicine_name.indexOf(element.in_exclusion.name) == -1 ? false : true;


      //  console.log('select2updateEventValue', index);
      if (result) {
        excReimburmentRate = 0;
        return;
      }
    });

    if (excReimburmentRate == 0) {
      returndata = true
    }
    else {
      returndata = false
    }
    // console.log('select2updateEventValue', returndata);
    return returndata;

  }

  getMedicineClaimDetails() {
    this.pharmacyPlanService.medicineClaimDetails(this.claimID).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("Get Claim Details--->", response)
      this.allDetails = response.data[0];
      (this.totalCost = this.allDetails?.totalCoPayment),
        (this.totalCoPayment = this.allDetails?.totalCostOfAllMedicine),
        (this.totalToBePaidByInsurance = this.allDetails?.totalRequestedAmount),
        (this.totalApprovedAmountByCFO = this.allDetails?.totalApprovedAmountByCFO),
        this.dataSources = response.data[0]?.medicinedetailsonclaims
      this.getPlanDetails(response.data[0]?.patientId, response.data[0]?.service);
      this.claimDetailsclaimStaffData = this.allDetails.claimStaffData;
      this.findUniquerole();
      console.log(this.planExclusion, "Get Claim Details--->")
    })
  }
  findUniquerole() {
    this.dynamiccolumns = [];
    this.uniqueRole = this.claimDetailsclaimStaffData.filter(obj => obj.isApproved === true);

    console.log(this.uniqueRole, "testing");
    if (this.uniqueRole.length > 0) {
      let LastRecord = this.uniqueRole.length - 1;

      this.lastElement = this.uniqueRole[LastRecord].amount;
      console.log(this.lastElement, "check record last")
    }

    if (this.uniqueRole.length > 0) {
      var i = 1;

      this.uniqueRole.forEach((value) => {


        this.dynamiccolumns.push(

          { columnDef: value?.roleInfoData + " Response", header: value?.roleInfoData + " Response", actualColumn: value?.roleInfoData, staffRoleID: value?.staff_role_id },
        )
        if (this.displayedColumnss.indexOf(value?.roleInfoData + " Response") == -1) {
          this.displayedColumnss.splice(i + 7, 0, value?.roleInfoData + " Response");
        }

        i++;
      })

    }

  }


  checkLoginUser(val, medicineId, actualColumn = '') {
    console.log(val, "checkLoginUser", actualColumn, "medicineId", medicineId, this.uniqueRole, " this.uniqueRole ")

    const targetObject = { medicine_id: medicineId, claim_object_id: this.allDetails._id, roleName: actualColumn };
    let foundObject = null;
    for (let i = 0; i < val.length; i++) {
      const currentObject = val[i];
      let roleId = currentObject.staffadmininfo[0].role;
      console.log(roleId, "check roleId");

      // const filteredRoles = roleId.filter(roleId => roleId === actualColumn);
      if (currentObject.medicine_id === targetObject.medicine_id && currentObject.claim_object_id === targetObject.claim_object_id && roleId.includes(targetObject.roleName)) {
        foundObject = currentObject;
        break; // Found the object, exit the loop
      }
    }
    return foundObject;

  }




  // allStaffList: any[] = [];


  findvalue(fieldname: any) {
    let findobject = [];
    if (this.allDetails?.primaryInsuredIdentity.length > 0) {
      findobject = this.allDetails?.primaryInsuredIdentity.filter((element: any) => {
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

  findvalueAccident(fieldname: any) {
    let findobject = [];
    if (this.allDetails?.accidentRelatedField.length > 0) {
      findobject = this.allDetails?.accidentRelatedField.filter(
        (element: any) => {
          return element.fieldName == fieldname;
        }
      );
    } else {
      findobject = [];
    }
    if (findobject.length > 0) {
      return findobject[0].fieldValue;
    } else {
      return "";
    }
  }

  findvaluesecondary(fieldname: any) {
    let findobject = [];
    if (this.allDetails?.secondaryInsuredIdentity.length > 0) {
      findobject = this.allDetails?.secondaryInsuredIdentity.filter((element: any) => {
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
  openVerticallyCenteredsecond(addsecondsubsriber: any) {
    this.modalService.open(addsecondsubsriber, {
      centered: true,
      size: "xl   ",
    });
  }
}