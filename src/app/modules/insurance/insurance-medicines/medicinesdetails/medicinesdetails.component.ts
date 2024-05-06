import { ToastrService } from "ngx-toastr";
import { InsuranceService } from "src/app/modules/insurance/insurance.service";
import {
  Component,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { ChartConfiguration } from "chart.js";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ElementRef, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable, of } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CoreService } from "src/app/shared/core.service";
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  Event,
  NavigationEnd,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  RoutesRecognized,
  GuardsCheckStart,
  ChildActivationStart,
  ActivationStart,
  GuardsCheckEnd,
  ResolveStart,
  NavigationCancel,
  ActivationEnd,
  ResolveEnd,
  ChildActivationEnd,
  NavigationError,
  Scroll,
} from "@angular/router";

export interface PeriodicElement {
  claimdate: string;
  insuranceid: string;
  plans: string;
  insuranceholder: string;
  requestedamount: string;
  totalamount: string;
  approvedamount: string;
  comments: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    claimdate: "11/18/2019",
    insuranceid: "1234567890",
    plans: "Lorem Ipsum is simply dummy",
    insuranceholder: "Zodo Company",
    requestedamount: "15 000 CFA",
    totalamount: "25 000 CFA",
    approvedamount: "25 000 CFA",
    comments: "Lorem Ipsum is simply dummy",
  },
];

export interface InsuranceElement {
  claimdate: string;
  insuranceid: string;
  plans: string;
  insuranceholder: string;
  reimbursmentrate: string;
  requestedamount: string;
  totalamount: string;
  approvedamount: string;
  status: string;
  comments: string;
  insurancecontract: string;
}

const INSURANCE_DATA: InsuranceElement[] = [
  {
    claimdate: "11/18/2019",
    insuranceid: "1234567890",
    plans: "Lorem Ipsum is simply dummy",
    insuranceholder: "Zodo Company",
    reimbursmentrate: "80%",
    requestedamount: "15 000 CFA",
    totalamount: "25 000 CFA",
    approvedamount: "25 000 CFA",
    status: "",
    comments: "Lorem Ipsum is simply dummy",
    insurancecontract: "",
  },
];

export interface DetailElement {
  drugspeciality: string;
  druggenericname: string;
  drugdosage: string;
  quantity: string;
  paidbytheinsured: string;
  totalamount: string;
  approvedamount: string;
  medicalanalysis: string;
  comments: string;
}

const DETAIL_DATA: DetailElement[] = [
  {
    drugspeciality: "11/18/2019",
    druggenericname: "1234567890",
    drugdosage: "Lorem Ipsum is simply dummy",
    quantity: "Zodo Company",
    paidbytheinsured: "80%",
    totalamount: "15 000 CFA",
    approvedamount: "25 000 CFA",
    medicalanalysis: "",
    comments: "Lorem Ipsum is simply dummy",
  },
];

export interface PrimaryinsuranceElement {
  drugspeciality: string;
  druggenericname: string;
  drugdosage: string;
  quantityprescribed: string;
  quantitydelivered: string;
  paidbytheinsured: string;
  totalamount: string;
  approvedamount: string;
  medicalanalysis: string;
  comments: string;
}
export interface ServiceElement {
  category: string;
  service: string;
  reimbursmentrate: string;
  servicelimit: string;
  servicecondition: string;
  categorylimit: string;
  categorycondition: string;
  preauthorization: string;
  waitingperiod: string;
  waitingperiodredeemed: string;
}
export interface CateogryElement {
  categoryofexclusion: string;
  exclusioninninternationalnonpropertynames: string;
  brandname: string;
  comment: string;
}

const PRIMARYINSURANCE_DATA: PrimaryinsuranceElement[] = [
  {
    drugspeciality: "11/18/2019",
    druggenericname: "1234567890",
    drugdosage: "Lorem Ipsum is simply dummy",
    quantityprescribed: "Zodo Company",
    quantitydelivered: "3 boîtes",
    paidbytheinsured: "80%",
    totalamount: "15 000 CFA",
    approvedamount: "25 000 CFA",
    medicalanalysis: "",
    comments: "Lorem Ipsum is simply dummy",
  },
];
const ELEMENT_DATA_SERVICES: ServiceElement[] = [
  {
    category: "1/18/2019",
    service: "1234567890",
    reimbursmentrate: "80",
    servicelimit: "80",
    servicecondition: "Zodo Company",
    categorylimit: "Zodo Company",
    categorycondition: "Zodo Company",
    preauthorization: "Zodo Company",
    waitingperiod: "Zodo Company",
    waitingperiodredeemed: "Zodo Company",
  },
];
const EXPLORE_DATA_CATEGORY: CateogryElement[] = [
  {
    categoryofexclusion: "Zodo Company",
    exclusioninninternationalnonpropertynames: "Zodo Company",
    brandname: "Zodo Company",
    comment: "Zodo Company",
  },
];
@Component({
  selector: "app-medicinesdetails",
  templateUrl: "./medicinesdetails.component.html",
  styleUrls: ["./medicinesdetails.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class MedicinesdetailsComponent implements OnInit {
  displayedColumns: string[] = [
    "claimdate",
    "claimid",
    // "claimType",
    "insuranceid",
    "plans",
    "insuranceholder",
    "reimbursmentrate",
    "requestedamount",
    "totalamount",
    "approvedamount",
    // "approvedCheckAmount12",
    "status",

    // "comments",
    "action",
  ];
  dataSource = ELEMENT_DATA;

  displayedColumnss: string[] = [
    "claimdate",
    "claimid",
    "claimType",
    "insuranceid",
    "plans",
    "insuranceholder",
    "reimbursmentrate",
    "requestedamount",
    "totalamount",
    "approvedamount",
    // "approvedCheckAmount12",
    "status",

    // "comments",
    "action",
  ];
  dataSources = INSURANCE_DATA;

  displayedColumn: string[] = [
    "drugspeciality",
    "druggenericname",
    "drugdosage",
    "quantityprescribed",
    "quantitydelivered",
    "paidbytheinsured",
    "totalamount",
    "approvedamount",
    // "approvedCheckAmount12",
    // "receptionists",
    "medicalanalysis",
    "comments",
  ];
  dataSourcee = PRIMARYINSURANCE_DATA;

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

  // serahc dropdown
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl("");
  // filtereduser: Observable<string[]>;
  filteredOptions!: Observable<any[]>;
  myControl = new FormControl("");
  user: any[] = [];
  alluser: string[] = [
    "Reeve Ewer",
    "Roy L. Commishun",
    "Ray O’Sun",
    "Rhoda Report",
  ];
  staffList: any[] = [];
  selectedStaff: any[] = [];
  alreadyTakenMessage: any = "";

  @ViewChild("userInput") userInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild("comment") comment: TemplateRef<any>;
  @ViewChild("warning") warning: TemplateRef<any>;
  @ViewChild("requestedamount") requestedamount: TemplateRef<any>;
  @ViewChild("requestedamountAll") requestedamountAll: TemplateRef<any>;
  @ViewChild("modelAfterRejctForConCFO") modelAfterRejctForConCFO: TemplateRef<any>;
  @ViewChild("modelAfterRejctForConCFOAll") modelAfterRejctForConCFOAll: TemplateRef<any>;
  @ViewChild("approveClaim") approveClaim: TemplateRef<any>;
  @ViewChild("rejectClaim") rejectClaim: TemplateRef<any>;
  @ViewChild("leaveClaim") leaveClaim: TemplateRef<any>;
  @ViewChild("resubmitt") resubmitt: TemplateRef<any>;
  @ViewChild("approvalPopup") approvalPopup: TemplateRef<any>;
  claimDetails: any;
  subscriberDetails: any;
  dynamiccolumns = [];
  displayedColumnses: string[] = [
    "medicinename",
    "totalamount",
    "rate",
    "requestAmount",
    "paidbytheinsured",
    "frequency",
    "drugdosage",
    "quantity",
    // "approvedCheckAmount12"
    // "approvedamount",
    // "receptionists",
    // "medicalAdvisorResponse",
    // "medicalanalysis",
  ];
  dataSourceses = DETAIL_DATA;

  // service
  displayedColumnsservice: string[] = [
    "category",
    "service",
    "reimbursmentrate",
    "servicelimit",
    "servicecondition",
    "categorylimit",
    "categorycondition",
    "preauthorization",
    "waitingperiod",

    "waitingperiodredeemed",
  ];
  dataSourceService = ELEMENT_DATA_SERVICES;
  // category
  displayedColumnscategory: string[] = [
    "categoryofexclusion",
    "exclusioninninternationalnonpropertynames",
    "brandname",
    "comment",
  ];
  dataSourcesCatogery = EXPLORE_DATA_CATEGORY;

  darkColorArray = [
    "#003366", // Dark Blue
    "#006600", // Dark Green
    "#990000", // Dark Red
    "#660066", // Dark Purple
    "#cc6600", // Dark Orange
    "#999900", // Dark Yellow
    "#663300", // Dark Brown
    "#333333", // Dark Gray
    "#006666", // Dark Teal
    "#990066", // Dark Pink
    "#006666", // Dark Cyan
    "#663399", // Dark Lavender
    "#333366", // Dark Slate
    "#666600", // Dark Olive
    "#660033", // Dark Maroon
    "#cc3300", // Dark Coral
    "#996633", // Dark Salmon
    "#006666", // Dark Turquoise
    "#330066", // Dark Indigo
    "#996633"  // Dark Beige
  ];
  
   lightColorArray = [
    "#66ccff", // Light Blue
    "#99cc99", // Light Green
    "#ff6666", // Light Red
    "#cc99ff", // Light Purple
    "#ffcc99", // Light Orange
    "#ffff66", // Light Yellow
    "#cc9966", // Light Brown
    "#cccccc", // Light Gray
    "#66cccc", // Light Teal
    "#ff99cc", // Light Pink
    "#66cccc", // Light Cyan
    "#cc99ff", // Light Lavender
    "#9999cc", // Light Slate
    "#cccc66", // Light Olive
    "#cc6699", // Light Maroon
    "#ff9966", // Light Coral
    "#ffcc99", // Light Salmon
    "#66cccc", // Light Turquoise
    "#9966cc", // Light Indigo
    "#ffcc99"  // Light Beige
  ];

  claimId: any;
  userID: any;
  adminId;
  medicineList: any[] = [];
  totalCost: any = 0;
  totalCoPayment: any = 0;
  totalToBePaidByInsurance: any = 0;
  userRole: any;
  staffRole: any;
  isReceptionist: any = false;
  isDisabled: any = false;
  approvedAmountByConAdvisor: any;
  isSendDisable: any = false;
  isLeaveClaimDisable: any = false;
  requestedAmount: any = 0;
  claimDetailsclaimStaffData: any = [];
  planExclusion: any = [];
  reimbursmentRate: any = 0;
  subscriber_details: any;

  healthPlanDetails: any;

  excludedMedicines: any[] = [];
  previousClaims: any[] = [];
  approvalClaimForm: any = FormGroup;
  confirmationPopup: any;

  defaultMedicineListColumns: any[] = [];
  checkApproved: any;
  approveStaff: any;
  staffRoleID: any;
  lastRoleId: any = '';
  approvedStaffRole: any[];
  uniqueRole: any = [];
  AdminData: any;
  allApprovedStaff: any[];
  approvedAmountForAllMedicine: number;
  typeofRead: any;
  claimDetailssubscriberDetails: any;
  Primarydetails: any;
  lastAmount: any;
  for_current_insurance_staff_role: any;
  forcurrnetinsurnacestaffName: any;
  innerMenuPremission: any = [];
  totalAmount: any;
  categoryGraphValue: any[];
  serviceGraphValue: any[];
  familycategoryGraphValue: any[];
  familyserviceGraphValue: any[];
  total_care_limit: any;
  total_assured_service_amount: any;
  family_total_insured_amount: any;
  grand_total: any;
  claimTypeFilterData: any = 'primary';
  selectedValue: any;
  primaryhealthplanData: any;
  primaryplanServiceData: any;
  medicineClaimData: any;
  constructor(
    private modalService: NgbModal,
    private coreService: CoreService,
    private service: InsuranceService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder
  ) {
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
    this.defaultMedicineListColumns = this.displayedColumnses;
    this.approvalClaimForm = this.fb.group({
      requestedAmount: [""],
      approvedAmount: ["", [Validators.required]],
    });

    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.AdminData = adminData;
    let role = loginData?.role;
    this.userRole = role;

    this.userID = loginData?._id;

    if (adminData?.role) {
      let staffRole = adminData?.role;
      this.staffRole = staffRole?.name;
      this.staffRoleID = staffRole?._id;
      // this.dynamiccolumns = [
      //   { columnDef: staffRole?.name + " Analysis", header: staffRole?.name + " Analysis", actualColumn: staffRole?.name },

      // ];
      // this.displayedColumnses.splice(this.uniqueRole.length + 8, 0, staffRole?.name + " Analysis");
      // this.displayedColumnses.splice(this.uniqueRole.length + 9, 0, "comments");
      this.adminId = adminData?.for_user;
    }

    if (role === "INSURANCE_ADMIN") {
      this.isSendDisable = true;
    }
    console.log("Role---->", role);
    console.log("User id =====>", this.userID);
    console.log("Role  of staff---->", this.staffRole);

    // this.claimId = this.activatedRoute.snapshot.paramMap.get("id");
    this.activatedRoute.queryParams.subscribe((params) => {
      console.clear();
      console.log("CLAIM ID=>", params["claimId"]);
      this.claimId = params["claimId"];

      // this.getInsuranceStaff();
      this.getClaimDetails();



      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value || ""))
      );
    });
    // this.checkInnerPermission();
  }

  ngOnInit(): void {

    // setTimeout(() => {
    //   this.checkInnerPermission();
    // }, 300);
  }

  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission() {

    let userPermission = this.coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");


    let checkData = this.findObjectByKey(userPermission, "parent_id", menuID)

    if (checkData) {
      if (checkData.isChildKey == true) {

        var checkSubmenu = checkData.submenu;

        if (checkSubmenu.hasOwnProperty("medicine")) {
          console.log("MAKECLAIM1");

          this.innerMenuPremission = checkSubmenu['medicine'].inner_menu;
          console.log(` exists in the object.`);
        } else {
          console.log(`does not exist in the object.`);
        }

        if (checkSubmenu.hasOwnProperty("make-medicine-claim")) {
          console.log("MAKECLAIM");

          this.innerMenuPremission = checkSubmenu['make-medicine-claim'].inner_menu;
          console.log(` exists in the object.`);
        } else {
          console.log(`does not exist in the object.`);
        }

      } else {
        var checkSubmenu = checkData.submenu;

        let innerMenu = [];

        for (let key in checkSubmenu) {

          innerMenu.push({ name: checkSubmenu[key].name, slug: key, status: true });
        }

        this.innerMenuPremission = innerMenu;
      }
    }




  }

  giveInnerPermission(value) {
    return new Promise((resolve, reject) => {
      // setTimeout(() => {
        if (this.userRole === 'INSURANCE_STAFF') {
          const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
          // console.log("checkRequest__________", checkRequest)
          resolve(checkRequest ? checkRequest.status : false);
        } else {
          resolve(true);
        }
      // }, 2000);
    });
  }

  async getClaimDetails() {
    let reqData = {
      claimId: this.claimId,
      // insuranceStaffId: "6392fc4b8d7930a363b4c401",
      insuranceStaffId: this.userID,
      insuranceStaffRole: "",
    };

    if (this.userRole === "INSURANCE_ADMIN") {
      reqData.insuranceStaffRole = this.userRole;
    } else {
      let adminRoleValue = this.AdminData.role.map((e) => e._id).join(",");
      reqData.insuranceStaffRole = adminRoleValue;
    }

    console.log("ReqData - --->", reqData);

    this.service.claimDetails(reqData).subscribe({
      next: async (res) => {
        let response = await this.coreService.decryptObjectData({
          data: res,
        });
        console.log("Claim Details---->", response);

        this.claimDetails = response?.data?.result;
        this.for_current_insurance_staff_role =
          response?.data?.result.for_current_insurance_staff_role;
        // if (this.userRole != 'INSURANCE_ADMIN') {
        // console.log(this.AdminData.role, "staffRole");

        // let staffRoleIDROle = this.AdminData.role.filter(obj => obj._id === this.for_current_insurance_staff_role);
        // console.log(staffRoleIDROle, "staffRoleIDROle");

        // if (staffRoleIDROle.length > 0) {
        //   this.staffRoleID = staffRoleIDROle[0]._id

        // }
        // }
        this.claimDetailssubscriberDetails =
          response?.data?.subscriberDetails?.subscriberDetails;
        this.Primarydetails = response?.data?.subscriberDetails;
        this.claimDetailsclaimStaffData = this.claimDetails.claimStaffData;
        console.log(
          this.claimDetailsclaimStaffData,
          "claimDetailsclaimStaffData"
        );
        this.medicineClaimData = this.claimDetails?.medicinedetailsonclaims;

        this.primaryhealthplanData = response?.data?.subscriberDetails?.primary_health_plan;
        // console.log("this.primaryhealthplanData",this.primaryhealthplanData)
        this.primaryplanServiceData = response?.data?.subscriberDetails?.primary_plan_service;
        // console.log("this.primaryplanServiceData",this.primaryplanServiceData)

        this.findUniquerole();
        this.getLastClaimRole();

        this.subscriberDetails = response?.data?.subscriberDetails;
        this.healthPlanDetails = response?.data?.subscriberDetails?.health_plan;
        this.total_care_limit = this.healthPlanDetails?.total_care_limit;

        this.dataSourceService =
          response?.data?.subscriberDetails?.plan_service;
        // if (this.claimDetails?.insurerType === 'primaryInsurer') {
        this.selectedValue = this.claimDetailssubscriberDetails?._id;
        // console.log("1111111111",this.selectedValue)
        // }else{
        //   this.selectedValue = this.claimDetailssubscriberDetails?._id;
        //   // console.log("2222222",this.selectedValue)
        // }
        this.findCategoryGraph(
          this.dataSourceService,
          this.subscriberDetails?.subscriberDetails?._id,
          this.claimDetails?.plan_validity
        );

        this.findFamilyCategoryGraph(
          this.dataSourceService,
          this.subscriberDetails?.subscriberDetails?._id,
          this.claimDetails?.plan_validity
        );
        this.dataSourcesCatogery =
          response?.data?.subscriberDetails?.plan_exclusion;
        // this.getHealthPlanDetails(response?.data?.subscriberDetails?.health_plan?._id)
        this.medicineList = response?.data?.result?.medicinedetailsonclaims;

        this.extractPreviousClaims(response?.data?.previousClaim);

        this.getPlanDetails(
          response?.data?.result?.patientId,
          response?.data?.result?.service
        );

        (this.totalCost = this.claimDetails?.totalCostOfAllMedicine),
          (this.totalCoPayment = this.claimDetails?.totalCoPayment),
          (this.totalToBePaidByInsurance =
            this.claimDetails?.totalRequestedAmount),
          console.log("INSURANCE----->", this.totalToBePaidByInsurance);

        if (response.errorCode) {
          console.log("Already working another resp");
          this.isDisabled = true;
          this.alreadyTakenMessage = response.message;
          this.modalService.open(this.warning);
        }

        this.isSendDisable = true;
        for (let i = 0; i < this.medicineList?.length; i++) {
          var medicineListInStaffData = this.medicineList[i].staffData;
          console.log(medicineListInStaffData, "medicineListInStaffData");
          // if (medicineListInStaffData.length > 0) {
          let valueData = this.findValue(
            medicineListInStaffData,
            "roleId",
            this.staffRoleID
          );
          console.log(valueData, "valueData");

          if (valueData == null) {
            // if (this.claimDetailsclaimStaffData[i]?.isApproved === false && this.claimDetailsclaimStaffData[i].staff_id == this.userID) {
            this.isSendDisable = true;
            break;
          } else {
            this.isSendDisable = false;
          }

          if (valueData != null) {
            this.isLeaveClaimDisable = true;
          }
          // }
        }
        if (
          this.userRole != "INSURANCE_ADMIN" &&
          this.staffRoleID != this.lastRoleId
        ) {
          if (!this.isDisabled) {
            this.getInsuranceStaff();
          }
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message, "err.message");
      },
    });
  }

  findUniquerole() {
    this.dynamiccolumns = [];
    this.uniqueRole = this.claimDetailsclaimStaffData.filter(obj => obj.isApproved === true);

    console.log(this.uniqueRole, "testing");

    // this.for_current_insurance_staff_role
    if (this.uniqueRole.length > 0) {
      var i = 1;

      this.uniqueRole.forEach((value) => {

        console.log(value, "check valuevalue");

        this.dynamiccolumns.push(


          { columnDef: value?.roleInfoData + " Response", header: value?.roleInfoData + " Response", actualColumn: value?.roleInfoData, staffRoleID: value?.staff_role_id, columApprovedAmount: value?.roleInfoData + " Approved Amount" },

        )
        if (this.displayedColumnses.indexOf(value?.roleInfoData + " Response") == -1) {
          this.displayedColumnses.splice(i + 8, 0, value?.roleInfoData + " Response");
        }
        i++;
        if (this.displayedColumnses.indexOf(value?.roleInfoData + " Approved Amount") == -1) {
          this.displayedColumnses.splice(i + 8, 0, value?.roleInfoData + " Approved Amount");
        }

        i++;
      })

    }



    console.log(this.staffRoleID, "check id 0");
    let uniqueStaffid = []
    if (this.userRole != 'INSURANCE_ADMIN') {
      if (this.staffRoleID == undefined) {
        uniqueStaffid = this.uniqueRole.filter(obj => {
          // Assuming staff_role_id is a property in each object of this.staffRoleID
          return this.AdminData?.role.some(roleObj => roleObj._id === obj.staff_role_id);
        });
      } else {
        uniqueStaffid = this.uniqueRole.filter(obj => obj.staff_role_id == this.staffRoleID);
        console.log(uniqueStaffid, "uniqueStaffid", this.dynamiccolumns, "displayedColumnses", this.displayedColumnses)
      }
    }


    if (uniqueStaffid.length > 0) {
      lengthDynamic = i - 1;
    }
    else {
      if (this.userRole != 'INSURANCE_ADMIN') {
        if (this.AdminData?.role) {
          let staffRole = this.AdminData?.role;
          console.log(staffRole, "9090");

          let for_current_insurance_staff_roleData = staffRole.filter(obj => obj._id === this.for_current_insurance_staff_role)[0];
          console.log(for_current_insurance_staff_roleData, "for_current_insurance_staff_roleData");

          //     // this.staffRole = staffRole?.name;
          if (for_current_insurance_staff_roleData == undefined) {
            this.staffRoleID = staffRole[0]?._id;
            this.forcurrnetinsurnacestaffName = staffRole[0]?.name;
          } else {
            this.staffRoleID = for_current_insurance_staff_roleData?._id;
            this.forcurrnetinsurnacestaffName = for_current_insurance_staff_roleData?.name
          }



          var lengthDynamic = this.dynamiccolumns.length * 2;
          this.dynamiccolumns.push(
            { columnDef: this.forcurrnetinsurnacestaffName + " Analysis", header: this.forcurrnetinsurnacestaffName + " Analysis", actualColumn: this.forcurrnetinsurnacestaffName, staffRoleID: this.staffRoleID },

          );
          if (this.displayedColumnses.indexOf(this.forcurrnetinsurnacestaffName + " Analysis") == -1) {
            this.displayedColumnses.splice(lengthDynamic + 9, 0, this.forcurrnetinsurnacestaffName + " Analysis");
          }
          //     // this.adminId = this.AdminData?.for_user;
        }
      }
      else {
        var lengthDynamic = this.dynamiccolumns.length * 2;
      }
    }
    if (this.displayedColumnses.indexOf("comments") == -1) {
      this.displayedColumnses.splice(lengthDynamic + 9, 0, "comments");
    }

    // console.log(foundObjects);
    // this.uniqueRole = this.findValue(this.claimDetailsclaimStaffData, "isApproved", true)
    console.log(this.uniqueRole, "findUniquerole()", this.dynamiccolumns.length);

    if (this.uniqueRole.length > 0) {
      // Get the last object from the array and retrieve the 'amount' value
      this.lastAmount = this.uniqueRole[this.uniqueRole.length - 1].amount;
      console.log("Last amount value:", this.lastAmount);
    }
  }

  allStaffList: any[] = [];

  getLastClaimRole() {
    console.log("check log")
    let reqData = {
      insurance_id: this.claimDetails?.insuranceId
    }
    console.log(this.claimDetails, "dta check req");


    this.service.getLastClaimRole(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("dta check ", response);
      if (response.status) {
        this.lastRoleId = response.body[0]?.roleId;
      }
    })
  }

  getInsuranceStaff() {


    console.log("staff req data--->", this.claimDetailsclaimStaffData);

    this.approvedStaffRole = [];
    for (var i = 0; i < this.claimDetailsclaimStaffData.length; i++) {
      if (this.claimDetailsclaimStaffData[i].isApproved) {
        if (this.approvedStaffRole.indexOf(this.claimDetailsclaimStaffData[i].staff_role_id == -1)) {
          this.approvedStaffRole.push(this.claimDetailsclaimStaffData[i].staff_role_id);
        }
      }
    }

    console.log(this.approvedStaffRole, " this.approvedStaffRole");

    let reqData = {
      // insuranceId: "63899f9d1142b0fed53bd4e1",
      insuranceId: this.adminId,
      insuranceStaffRole: this.staffRole,
      approvedStaffRole: this.approvedStaffRole,
      // nextRoleArray: roleArray,
      uniquerole: this.uniqueRole.length,
    };
    this.service.getAllStaffWithoutPageLimit(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("Get all staff ---->", response);
      this.staffList = [];


      this.allStaffList = [];
      console.log(this.allStaffList, "check staffList");
      this.user = [];
      this.selectedStaff = [];
      response.data?.forEach((element) => {
        if (element.staff_role != this.staffRole) {
          this.staffList.push({
            id: element?.for_portal_user,
            name: element?.staff_name,
            staff_role: element?.staff_role,
            staffRoleId: element?.staffRoleId,
          });
          console.log(this.allStaffList, "check staffList");
          this.allStaffList.push({
            id: element?.for_portal_user,
            name: element?.staff_name,
            staff_role: element?.staff_role,
            staffRoleId: element?.staffRoleId
          });
        }
      });

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value || ""))
      );
    });
  }

  handleAfterConfirmation() {
    this.approvalClaimForm.reset();
    // if (this.staffRole === "Contract Advisor" || this.staffRole === "CFO") {
    // if (this.staffRole === "Contract Advisor") {
    // }
    this.confirmationPopup.close();
    this.approvalClaimForm.patchValue({
      requestedAmount: this.claimDetails?.totalRequestedAmount,
      approvedAmount: this.approvedAmountForAllMedicine
    });
    this.modalService.open(this.approvalPopup);
    // }
    //  else {
    // this.handleSend();
    // }
  }

  handleSendApproval(status: any = '') {
    this.handleSend(status);
    // if (this.staffRole === "Contract Advisor") {

    // } else {
    //   this.approveOrRejectClaim(true);
    // }
  }

  handleSend(status) {
    let reqArrayId = [];
    console.log(this.selectedStaff, "slelected");
    this.selectedStaff.forEach((element) => {
      reqArrayId.push({ insurance_staff_id: element.id, staffRoleId: element.staffRoleId });
    });
    console.log(this.approvalClaimForm, "this.approvedAmountForAllMedicine");

    let reqData = {
      approvalStatus: status,
      claimId: this.claimId,
      insuranceStaffRole: this.staffRoleID,
      insuranceStaffList: reqArrayId,
      approvedAmount: this.approvalClaimForm.value.approvedAmount != "" ? this.approvalClaimForm.value.approvedAmount : 0,
      claim_object_id: this.claimDetails._id,
      loginStaffid: this.userID,
      reSubmit: false,
    };
    console.log("ReqData to send claim------>", reqData);

    this.service.addClaimForInsuranceStaff(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log(response);
      if (response.status) {
        this.modalService.dismissAll("close");
        this.toastr.success(response.message);
        this.router.navigate(["/insurance/medicines"]);
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (this.staffList.length > 0) {
      var result = this.staffList.filter((option: any) => {
        return option.name.toLowerCase().includes(filterValue);
      });
      return result.length > 0 ? result : ["No Data"];
    }
    return ["No Data"];
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    if (value) {
      this.user.push(value);
    }
    event.chipInput!.clear();
    this.userCtrl.setValue(null);
  }

  remove(user: string): void {
    const index = this.user.indexOf(user);
    if (index >= 0) {
      this.user.splice(index, 1);
    }
    this.selectedStaff.forEach((element) => {
      if (element.name === user) {
        let index = this.selectedStaff.indexOf(element);
        this.selectedStaff.splice(index, 1);
      }
    });

    this.allStaffList.forEach((element) => {
      console.log(element, "element eee");

      if (element.name === user) {
        this.staffList.push(element);
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(""),
          map((value) => this._filter(value || ""))
        );
      }
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.user.push(event.option.value.name);
    this.selectedStaff.push(event.option.value);
    this.userCtrl.setValue(null);
    console.log(this.staffList, "staffList123")
    this.staffList.forEach((elem, index) => {
      if (elem.id === event.option.value.id) {
        this.staffList.splice(index, 1);
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(""),
          map((value) => this._filter(value || ""))
        );
      }
    });
  }

  openVerticallyCenteredsecond(addsecondsubsriber: any) {
    this.modalService.open(addsecondsubsriber, {
      centered: true,
      size: "xl   ",
    });
  }

  //comment modal------------
  openVerticallyCenteredrequestedamount(comment: any) {
    this.modalService.open(comment, { centered: true, size: "md   " });
  }

  //Reason modal------------
  addReasonModal(resubmitreason: any) {
    this.resubmitConfirmationModal.close();
    this.modalService.open(resubmitreason, { centered: true, size: "md   " });
  }

  openCommentModal(comment: any, medicine_id: any) {
    this.medicine_id = medicine_id;
    this.modalService.open(comment, { centered: true, size: "md   " });
  }

  // openVerticallyCenteredrequestedamount(comment: any) {
  //   this.modalService.open(comment, { centered: true, size: "md   " });
  // }

  openVerticallyCenteredapproved(
    approved: any,
    medicine_id: any,
    appAmountByConAdv: any,
    data: any
  ) {
    // this.requestedAmount = requestedAmount;
    this.seletedMedineData = data;
    this.amountApprovedByConAdvisor = data?.requestAmount;
    if (this.isDisabled) {
      this.modalService.open(this.warning);
      return;
    }
    this.approvedAmountByConAdvisor = appAmountByConAdv
      ? appAmountByConAdv
      : "";
    this.medicine_id = medicine_id;
    this.modalService.open(approved, { centered: true, size: "md   " });
  }

  openVerticallyCenteredReject(
    reject: any,
    medicine_id: any,
    approveAmountByConAdv: any,
    data: any
  ) {
    // this.requestedAmount = requestAmount;
    this.seletedMedineData = data;
    this.amountApprovedByConAdvisor = data?.requestAmount;
    if (this.isDisabled) {
      this.modalService.open(this.warning);
      return;
    }
    this.approvedAmountByConAdvisor = approveAmountByConAdv
      ? approveAmountByConAdv
      : "";
    this.medicine_id = medicine_id;
    this.modalService.open(reject, { centered: true, size: "md   " });
  }

  medicine_approve_or_reject: any;
  medicine_id: any;

  async approveOrRejectMedicine(item) {


    return new Promise((resolve) => {
      let approvedAmount;
      if (this.medicine_approve_or_reject) {
        approvedAmount = item.requestAmount
      } else {
        approvedAmount = 0
      }
      let reqData = {
        claimId: this.claimId,
        medicineId: item._id,
        // insuranceStaffId: "6392fc4b8d7930a363b4c401",
        insuranceStaffId: this.userID,
        action: this.medicine_approve_or_reject,
        approvedAmount: approvedAmount,
        roleId: this.staffRoleID
      };

      this.service.approveOrRejectMedicine(reqData).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log("Approve req Data------>", response);
          if (response.status) {
            this.allApprovedStaff.push({ approveStaff: response?.data?.approveStaff, requestAmount: item.requestAmount });
            this.toastr.success(response.message);
            resolve(response);
          } else {
            // this.toastr.error(response.message);
            resolve(response);

          }
        },
        (err) => {
          let errorResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          this.toastr.error(errorResponse.message);
          resolve(err);

        }
      );
    });

  }

  async handleAprrovedOrRejectAll(action: any) {
    if (action === "approved") {
      this.medicine_approve_or_reject = true;
    } else {
      this.medicine_approve_or_reject = false;
    }
    let medicineData;
    // requestAmount: "0.80"

    this.allApprovedStaff = [];
    for await (const item of this.medicineList) {
      console.log(this.medicineList, "check medicin list", item);

      // for (let i = 0; i < this.medicineList.length; i++) {
      // const element = array[index];
      await this.approveOrRejectMedicine(item);

      // console.log("Approve req Data----->", reqData);
    }
    console.log("Approve req Data----->out", this.allApprovedStaff.length);

    if (this.allApprovedStaff.length > 0) {
      this.toastr.success("sucess");
      this.getClaimDetails();
      this.openCommentModalHandleAll(action);
      this.showAddedComment = "";
    }

    // this.modalService.open(this.comment);
  }


  handleAprrovedOrReject(action: any) {
    let amountApproved;

    if (action === "approved") {
      this.medicine_approve_or_reject = true;
      amountApproved = this.amountApprovedByConAdvisor;
    } else {
      this.medicine_approve_or_reject = false;
      amountApproved = 0
    }

    let reqData = {
      claimId: this.claimId,
      medicineId: this.medicine_id,
      // insuranceStaffId: "6392fc4b8d7930a363b4c401",
      insuranceStaffId: this.userID,
      action: this.medicine_approve_or_reject,
      approvedAmount: amountApproved,
      roleId: this.staffRoleID
    };

    this.service.approveOrRejectMedicine(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("Approved Reponse------>", response);
        if (response.status) {
          this.toastr.success(response.message);
          // this.getClaimDetails();
          this.openCommentModalHandle(response.data.approveStaff, response.data.MedicineData, "autoOpen");
          this.showAddedComment = "";

        }
        else {
          this.toastr.error(response.message);
        }
      },
      (err) => {
        let errorResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errorResponse.message);
      }
    );

    console.log("Approve req Data----->", reqData);
    // this.modalService.open(this.comment);
  }

  popupForComment(response) {
    console.log(response, "check response")
    this.modalService.dismissAll("close");
    if (this.userRole === "INSURANCE_STAFF") {
      if (this.medicine_approve_or_reject === false) {
        this.modalService.open(this.modelAfterRejctForConCFO);
      } else {
        this.modalService.open(this.requestedamount);
      }
    }
  }

  approveOrRejectClaim(status: any) {
    let reqData = {
      claimId: this.claimId,
      insuranceStaffRole: this.staffRole,
      approvalStatus: status,
      reSubmit: false,
      approvedAmount: this.approvalClaimForm.value.approvedAmount,
    };

    console.log("Claim Req------>", reqData);

    this.service.approveOrRejectClaim(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.toastr.success(response.message);
        this.closePopup();
        this.router.navigate(["/insurance/medicines"]);
      }
    });
  }

  openPopup(string: any, type = '') {
    this.typeofRead = type;
    if (string === "approve") {
      this.approvedAmountForAllMedicine = 0;
      if (this.medicineList.length > 0) {
        let data = this.medicineList.forEach((item) => {
          console.log(item, "itemuniqueStaffid");

          let uniqueStaffid = item.staffData.filter(obj => obj.staff_id == this.userID);
          console.log(uniqueStaffid, "uniqueStaffid1");

          if (uniqueStaffid.length > 0) {
            this.approvedAmountForAllMedicine += uniqueStaffid[0]?.amount
            console.log(this.approvedAmountForAllMedicine, "approvedAmountForAllMedicine");
          }


        })
      }
      this.confirmationPopup = this.modalService.open(this.approveClaim);
    } else {
      this.modalService.open(this.rejectClaim);
    }
  }

  commentOnCliam(comment: any) {
    if (this.isDisabled) {
      this.modalService.open(this.warning);
      return;
    }
    let reqData = {
      // insuranceStaffId: "6392fc4b8d7930a363b4c401",
      insuranceStaffId: this.userID,
      medicineId: this.medicine_id,
      claimId: this.claimId,
      comment: comment,
      reSubmit: "",
      approvedAmount: "",
    };

    if (this.staffRole === "Medical Advisor") {
      reqData.reSubmit = this.resubmit;
    }

    console.log("Comment Request------>", reqData);

    this.service.commentOnClaim(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("Comment Reponse------>", response);
        if (response.status) {
          this.toastr.success(response.message);
          this.closePopup();
          this.getClaimDetails();
          this.showAddedComment = "";
        }
      },
      (err) => {
        let errorResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errorResponse.message);
      }
    );
  }


  handleCommentForContractAdvisorAll(comment: any, action) {
    // console.log(this.approveStaff.approveStaff._id, " this.seletedMedineData ")

    if (this.isDisabled) {
      this.modalService.open(this.warning);
      return;
    }

    for (let i = 0; i < this.allApprovedStaff.length; i++) {
      let approvedAmount;
      if (action) {
        approvedAmount = this.allApprovedStaff[i]?.requestAmount
      } else {
        approvedAmount = 0;
      }
      let reqData = {
        // insuranceStaffId: "6392fc4b8d7930a363b4c401",
        claimMedicineApprovebyStaffId: this.allApprovedStaff[i]?.approveStaff._id,
        insuranceStaffId: this.userID,
        medicineId: this.allApprovedStaff[i]?.approveStaff.medicine_id,
        claimId: this.claimId,
        comment: comment,
        reSubmit: "",
        approvedAmount: approvedAmount,
      };

      this.service.commentOnClaim(reqData).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log("Comment Reponse------>", response);
          if (response.status) {
            this.toastr.success(response.message);
            this.closePopup();
            this.getClaimDetails();
          }
        },
        (err) => {
          let errorResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          this.toastr.error(errorResponse.message);
        }
      );
    }

  }


  handleCommentForContractAdvisor(comment: any, ammount: any) {
    // console.log(this.approveStaff.approveStaff._id, " this.seletedMedineData ")
    if (this.isDisabled) {
      this.modalService.open(this.warning);
      return;
    }
    let reqData = {
      // insuranceStaffId: "6392fc4b8d7930a363b4c401",
      claimMedicineApprovebyStaffId: this.approveStaff._id,
      insuranceStaffId: this.userID,
      medicineId: this.medicine_id,
      claimId: this.claimId,
      comment: comment,
      reSubmit: "",
      approvedAmount: ammount,
    };
    console.log("Comment Request------>", reqData);

    this.service.commentOnClaim(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("Comment Reponse------>", response);
        if (response.status) {
          this.toastr.success(response.message);
          this.closePopup();
          this.getClaimDetails();
        }
      },
      (err) => {
        let errorResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errorResponse.message);
      }
    );
  }

  showAddedComment: any = "";
  seletedMedineData: any;
  amountApprovedByConAdvisor: any = "";

  openCommentModalHandleAll(action) {
    this.modalService.dismissAll("close");
    if (action == "approved") {
      console.log("check if conditions");

      this.modalService.open(this.requestedamountAll);
    } else {
      console.log("check else conditions");

      this.modalService.open(this.modelAfterRejctForConCFOAll);

    }
  }


  openCommentModalHandle(
    approvedStaff,
    medicineData,
    type = ''
  ) {
    if (type == "autoOpen") {
      this.modalService.dismissAll("close");
    }
    console.log(approvedStaff, "response check");
    this.approveStaff = approvedStaff;
    if (type == 'edit') {
      this.seletedMedineData = medicineData;
    }


    console.log(approvedStaff, "approvedStaff");
    this.showAddedComment = approvedStaff?.comment;
    this.amountApprovedByConAdvisor = approvedStaff?.amount;
    let checkApproved = approvedStaff?.type
    console.log(checkApproved, "checkApproved");

    if (checkApproved == "approved") {
      console.log("check if conditions");

      this.modalService.open(this.requestedamount);
    } else {
      console.log("check else conditions");

      this.modalService.open(this.modelAfterRejctForConCFO);
    }
  }

  resubmit: any = false;

  handleResubmit(event: any) {
    console.log(event);
    this.resubmit = event.value;
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.getClaimDetails();
  }

  openVerticallyCenteredwanttosign(wanttosign: any) {
    this.modalService.open(wanttosign, { centered: true, size: "md   " });
  }
  openVerticallyCenteredother(othercontent: any) {
    console.log("kabnathanael@gmail.com");
    this.modalService.open(othercontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }

  openVerticallyCenteredPatientInurance(patientinuranceplan: any) {
    this.modalService.open(patientinuranceplan, {
      centered: true,
      size: "xl   ",
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  openLeaveClaimPopup(leaveClaim) {
    this.modalService.open(leaveClaim, { centered: true, size: "md   " });
  }

  openPopupSendConfoirmation(sendPopup, type) {

    if (this.selectedStaff.length > 0) {
      this.typeofRead = type;
      console.log(this.medicineList, "medicineList")
      this.approvedAmountForAllMedicine = 0;
      if (this.medicineList.length > 0) {
        let data = this.medicineList.forEach((item) => {
          console.log(item, "itemuniqueStaffid");

          let uniqueStaffid = item.staffData.filter(obj => obj.staff_id == this.userID);
          console.log(uniqueStaffid, "uniqueStaffid1");

          if (uniqueStaffid.length > 0) {
            this.approvedAmountForAllMedicine += uniqueStaffid[0]?.amount
            console.log(this.approvedAmountForAllMedicine, "approvedAmountForAllMedicine");
          }


        })
      }

      this.confirmationPopup = this.modalService.open(sendPopup, {
        centered: true,
        size: "md",
      });
    } else {
      this.toastr.error("Please select any user");
    }
  }

  resubmitConfirmationModal: any;

  resubmitConfirmation(resubmit) {
    this.resubmitConfirmationModal = this.modalService.open(resubmit, {
      centered: true,
      size: "md   ",
    });
  }

  handleLeaveClaim() {
    let reqData = {
      claimId: this.claimId,
      insuranceStaffId: this.userID,
      insuranceStaffRole: this.staffRole,
    };

    console.log("REQUEST DATA===>", reqData);

    this.service.leaveClaimByStaff(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RESPONSE===>", response);
      if (response.status) {
        this.toastr.success(response.message);
        this.modalService.dismissAll("close");
        this.router.navigate(["/insurance/medicines"]);
      }
    });
  }

  setDocToView: any = "";

  // Quick view modal
  openVerticallyCenteredquickview(quick_view: any, url: any) {
    this.setDocToView = url;
    this.modalService.open(quick_view, {
      centered: true,
      size: "lg",
      windowClass: "quick_view",
    });
  }

  handleDisableCommentAction(index: number) {
    let isVisible = true;
    if (this.staffRole === "Receptionist") {
      if (this.medicineList[index].receptionist?.isApproved != null) {
        isVisible = true;
      } else {
        isVisible = false;
      }
    }

    if (this.staffRole === "Medical Advisor") {
      if (this.medicineList[index].medicalAdvisor?.isApproved != null) {
        isVisible = true;
      } else {
        isVisible = false;
      }
    }

    if (this.staffRole === "Contract Advisor") {
      if (this.medicineList[index].contractAdvisor?.isApproved != null) {
        isVisible = true;
      } else {
        isVisible = false;
      }
    }

    if (this.staffRole === "CFO") {
      if (this.medicineList[index].cfo?.isApproved != null) {
        isVisible = true;
      } else {
        isVisible = false;
      }
    }

    return isVisible;
  }

  downloadclaimtemplate() {
    if (this.claimDetails && this.claimDetails.previewtemplateUrl) {
      window.open(this.claimDetails.previewtemplateUrl, '_blank');
    }
  }

  findvalue(fieldname: any) {
    let findobject = [];
    if (this.claimDetails?.primaryInsuredIdentity.length > 0) {
      findobject = this.claimDetails?.primaryInsuredIdentity.filter(
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

  findvalueAccident(fieldname: any) {
    let findobject = [];
    if (this.claimDetails?.accidentRelatedField.length > 0) {
      findobject = this.claimDetails?.accidentRelatedField.filter(
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
    if (this.claimDetails?.secondaryInsuredIdentity.length > 0) {
      findobject = this.claimDetails?.secondaryInsuredIdentity.filter(
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

  private async getPlanDetails(
    selectedsubscriberid: any,
    selectedservice: any
  ) {
    let param = {
      subscriber_id: selectedsubscriberid,
    };

    this.service.getInsurancePlanDetailsbysubscriber(param).subscribe({
      next: async (res) => {
        const encData = await res;
        let result = this.coreService.decryptContext(encData);
        if (result.status) {
          this.subscriber_details = result.body?.resultData;
          this.planExclusion = await result.body?.planExclusion;
          this.extractExcludedMedicines();
          result.body?.planService.forEach((element) => {
            if (element?.service === selectedservice) {
              this.reimbursmentRate = element.reimbursment_rate;
              return;
            }
          });
        } else {
          this.reimbursmentRate = 0;
        }
      },
    });
  }

  checkmedicine(medicine_name: any) {
    medicine_name = medicine_name.toLowerCase();
    let excReimburmentRate = 1;
    var returndata = false;
    this.planExclusion.forEach((element, index1) => {
      // var str1 = new String(element.in_exclusion.name);
      // var index = str1.localeCompare(medicine_name);
      element.in_exclusion.name = element.in_exclusion.name.toLowerCase();
      // console.log(element.in_exclusion.name, "element.in_exclusion.nam", medicine_name);

      const result =
        medicine_name.indexOf(element.in_exclusion.name) == -1 ? false : true;
      if (result) {
        excReimburmentRate = 0;
        return;
      }
    });

    if (excReimburmentRate == 0) {
      returndata = true;
    } else {
      returndata = false;
    }
    return returndata;
  }

  extractExcludedMedicines() {
    this.medicineList.forEach((medicine) => {
      this.planExclusion.forEach((element) => {
        if (medicine.medicineName === element.in_exclusion.name) {
          this.excludedMedicines.push(element.in_exclusion.name);
        }
      });
    });
  }

  handleResubmitClaim(resubmitReason: any) {
    let reqData = {
      claimId: this.claimId,
      // insuranceStaffId: this.adminId,
      insuranceStaffId: this.userID,
      resubmitReason: resubmitReason,
    };

    console.log("Resubmit data====>", reqData);

    this.service.resubmitClaimByStaff(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RESUBMIT RESPONSE====>", response);
        if (response.status) {
          this.modalService.dismissAll("close");
          this.toastr.success(response.message);
          this.router.navigate(["/insurance/medicines"]);
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }

  async extractPreviousClaims(previousClaims) {
    console.log("PREVIOUS CLAIMS=====>", previousClaims);

    let previousClaim = [];

    let previousMedicineClaim = [];

    await previousClaims.forEach((element) => {
      if (element.claimId != this.claimId) {
        previousClaim.push(element);
      }
      if (element.claimType === "medicine" && element.claimId != this.claimId) {
        previousMedicineClaim.push(element);
      }
    });

    this.dataSources = previousClaim;
    // console.log(this.dataSource,"datasoucrsce check ");

    this.dataSource = previousMedicineClaim;
  }

  findvalue2(fieldname: any, data: any) {
    let findobject = [];
    if (data) {
      findobject = data.filter((element: any) => {
        return element.fieldName == fieldname;
      });
    } else {
      findobject = [];
    }
    if (findobject.length > 0) {
      return findobject[0].fieldValue;
    } else {
      return "";
    }
  }

  async handleViewPreviousClaim(claimId, claimtype) {
    console.log(claimtype, "CLAIM ID===>", claimId);
    let url = `insurance/${claimtype}/details/${claimId}`;

    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      // this.router.navigate([`/${url}`]).then(() => {
      //   console.log(`After navigation I am on:${this.router.url}`);
      // });
      if (claimtype == 'medicine') {
        claimtype = 'medicines'
        this.router.navigate([`/insurance/${claimtype.toLowerCase()}/details`], {
          queryParams: {
            claimId: claimId,
          },
        });
      } else {
        this.router.navigate([`/insurance/${claimtype.toLowerCase()}/details`], {
          queryParams: {
            claimId: claimId,
          },
        });
      }

    });
  }


  async handleViewPreviousClaim1(claimId) {
    console.log("CLAIM ID===>", claimId);
    // let url = `insurance/${claimtype}/details/${claimId}`;

    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      // this.router.navigate([`/${url}`]).then(() => {
      //   console.log(`After navigation I am on:${this.router.url}`);
      // });

      this.router.navigate([`/insurance/medicines/details`], {
        queryParams: {
          claimId: claimId,
        },
      });
    });
  }

  routeToClaimList() {
    this.router.navigate(["/insurance/medicines"]);
  }
  checkallapprovereject(staffRoleId) {
    // console.log(staffRoleId, "check role id");

    let flag = false;

    if (this.userRole === "INSURANCE_ADMIN") {
      flag = false;
    }
    else {
      // console.log(this.uniqueRole, "uniqueStaffid11111111111",staffRoleId);
      //       let uniqueStaffid 
      // if(staffRoleId == undefined){
      //   let uniqueStaffid = this.uniqueRole.filter(obj => {
      //     // Assuming staff_role_id is a property in each object of this.staffRoleID
      //     return this.AdminData?.role.some(roleObj => roleObj._id === obj.staff_role_id);
      //   });
      // }
      let uniqueStaffid = this.uniqueRole.filter(obj => obj.staff_role_id == staffRoleId);
      console.log(uniqueStaffid, "uniqueStaffid", this.uniqueRole, "this.uniqueRole", staffRoleId);

      if (uniqueStaffid.length > 0) {
        flag = true;
      }
    }
    return flag
  }
  flagForResubmitAndLeaveClaim() {
    let flag = false;

    if (this.userRole === "INSURANCE_ADMIN") {
      flag = false;
    }
    else {
      let uniqueStaffid = this.uniqueRole.filter(obj => obj.staff_role_id == this.staffRoleID);
      console.log(uniqueStaffid, "uniqueStaffid");
      if (uniqueStaffid.length > 0) {
        flag = false;
      }
      else if (!this.isDisabled && this.claimDetails?.status === "pending") {
        flag = true;
      }
      //  else if (this.staffRole === "Receptionist") {
      //   if (this.claimDetails?.is_approved_by_receptionist != null) {
      //     flag = false;
      //   } else if (!this.isDisabled && this.claimDetails?.status === "pending") {
      //     flag = true;
      //   }
      // } else if (this.staffRole === "Medical Advisor") {
      //   if (this.claimDetails?.is_approved_by_medical_advisor != null) {
      //     flag = false;
      //   } else if (!this.isDisabled && this.claimDetails?.status === "pending") {
      //     flag = true;
      //   }
      // } else if (this.staffRole === "Contract Advisor") {
      //   if (this.claimDetails?.is_approved_by_contract_advisor != null) {
      //     flag = false;
      //   } else if (!this.isDisabled && this.claimDetails?.status === "pending") {
      //     flag = true;
      //   }
      // } else if (this.staffRole === "CFO") {
      //   if (this.claimDetails?.is_approved_by_cfo != null) {
      //     flag = false;
      //   } else if (!this.isDisabled && this.claimDetails?.status === "pending") {
      //     flag = true;
      //   }
      // }
    }
    return flag;

  }



  findValue(array, key, valueToFind) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === valueToFind) {
        return array[i];
      }
    }
    return null; // Value not found
  }
  checkanlysiscolumn(header) {
    return header.includes("Analysis");
  }
  checkLoginUser(val, medicineId, actualColumn = '') {
    // console.log(val, "checkLoginUser", actualColumn, "medicineId", medicineId, this.uniqueRole, " this.uniqueRole ", this.claimDetails)
    if (actualColumn == this.staffRoleID) {
      console.log(this.staffRoleID, "check staff role id");

      let uniqueColumRoleName = this.uniqueRole.filter(obj => obj.staff_role_id === this.staffRoleID);
      if (uniqueColumRoleName.length > 0) {
        const targetObject = { medicine_id: medicineId, claim_object_id: this.claimDetails._id, roleName: actualColumn };
        let foundObject = null;
        for (let i = 0; i < val.length; i++) {
          const currentObject = val[i];
          console.log(currentObject, "check staff roleaaaa id");

          let roleId = currentObject.staffadmininfo[0].role;
          if (currentObject.medicine_id === targetObject.medicine_id && currentObject.claim_object_id === targetObject.claim_object_id && roleId.indexOf(targetObject.roleName)) {
            foundObject = currentObject;
            break; // Found the object, exit the loop
          }
        }
        return foundObject;
      }
      const targetObject = { medicine_id: medicineId, claim_object_id: this.claimDetails._id, roleName: actualColumn, staff_id: this.userID };
      let foundObject = null;

      for (let i = 0; i < val.length; i++) {
        const currentObject = val[i];
        let roleId = currentObject.roleId;
        if (currentObject.medicine_id === targetObject.medicine_id && currentObject.claim_object_id === targetObject.claim_object_id && roleId == targetObject.roleName && currentObject.staff_id == targetObject.staff_id) {
          foundObject = currentObject;
          break; // Found the object, exit the loop
        }
      }
      return foundObject;
    } else {
      const targetObject = { medicine_id: medicineId, claim_object_id: this.claimDetails._id, roleName: actualColumn };
      let foundObject = null;
      for (let i = 0; i < val.length; i++) {
        const currentObject = val[i];
        let roleId = currentObject.roleId;
        // let roleId = currentObject.staffadmininfo[0].role;
        if (currentObject.medicine_id === targetObject.medicine_id && currentObject.claim_object_id === targetObject.claim_object_id && roleId == targetObject.roleName) {
          foundObject = currentObject;
          break; // Found the object, exit the loop
        }
      }
      return foundObject;
    }
  }


  checkLoginUserwithColumName(val, medicineId, columRoleName = '') {
    if (this.userRole === "INSURANCE_ADMIN") {
      return null;
    }
    let uniqueColumRoleName = this.uniqueRole.filter(obj => obj.staff_role_id === columRoleName);
    if (uniqueColumRoleName.length > 0) {
      return null;
    } else {
      let checkloginData = this.checkLoginUser(val, medicineId, columRoleName)
      return checkloginData;

    }

  }

  openVerticallyCenteredapprovedAll(approvedAll: any,) {
    let claimObjectId = this.claimDetails._id
    if (this.isDisabled) {
      this.modalService.open(this.warning);
      return;
    }
    this.modalService.open(approvedAll, { centered: true, size: "md   " });
  }

  openVerticallyCenteredRejectAll(rejectAll: any) {
    let claimObjectId = this.claimDetails._id
    if (this.isDisabled) {
      this.modalService.open(this.warning);
      return;
    }
    this.modalService.open(rejectAll, { centered: true, size: "md   " });
  }


  onKeydown(event: KeyboardEvent): void {
    console.log('Key pressed:', event.key);
  }

  findCategoryGraph(data: any, subscriberId: any, plan_validity: any) {
    console.log("runnnnnnnnnnnnnnnnnn")
    console.log(subscriberId, "data---------", data, "----------", plan_validity)
    // Assuming 'data' is your array of objects
    const uniqueHasCategories = [
      ...new Set(data.map((obj) => obj.has_category)),
    ];
    let reqData = {
      subscriber_id: subscriberId,
      plan_validity: JSON.stringify(plan_validity),
      category_name: JSON.stringify(uniqueHasCategories),
    };
    this.service.categoryclaimGraph(reqData).subscribe({
      next: async (res) => {
        let response = await this.coreService.decryptObjectData({
          data: res,
        });
        console.log(response, "response data");
        let categoriesArray = response.body;
        console.log(categoriesArray, "response data");
        let uniqueCategoryNames = new Set();
        let matchedCategories = [];

        data.forEach((item2, index) => {
          console.log(item2, "item2222");

          const matchingItem = categoriesArray.find((item1) => {
            return item1.category_name === item2.has_category;
          });
          if (matchingItem) {
            matchedCategories.push({
              number_index: index,
              category_name: matchingItem.category_name,
              category_limit: matchingItem.category_limit,
              in_limit: item2.in_limit,
              remaining_percentage: 0,
              complete_percentage: 0,
              darkcolor: { "background-color": `${this.darkColorArray[index]}` },
              yellow: { "background-color": `${this.lightColorArray[index]}` },
              use_limit: 0,
              styleprogress: { "background-color": `${this.darkColorArray[index]}`, "width.%": 29.4 },
            });
          } else {
            console.log(matchingItem, "check matching item else");
            matchedCategories.push({
              number_index: index,
              category_name: item2.has_category,
              category_limit: 0,
              in_limit: item2.in_limit,
              remaining_percentage: 0,
              complete_percentage: 0,
              yellow: { "background-color": `${this.lightColorArray[index]}` },
              use_limit: 0,
              darkcolor: { "background-color": `${this.darkColorArray[index]}` },
              styleprogress: { "background-color": `${this.darkColorArray[index]}`, "width.%": 29.4 },
            });
          }
        });
        matchedCategories = matchedCategories.filter((item) => {
          if (!uniqueCategoryNames.has(item.category_name)) {
            uniqueCategoryNames.add(item.category_name);
            return true;
          }
          return false;
        });
        matchedCategories.forEach((entry, index) => {
          const categoryLimit = entry.category_limit;
          const inLimitCategoryLimit = entry.in_limit.category_limit;
          const difference =
            (Number(categoryLimit) / Number(inLimitCategoryLimit)) * 100;
          const percentageDifference = 100 - difference;
          entry.remaining_percentage = (percentageDifference > 0) ? `${percentageDifference.toFixed(2)}%` : 0 + '%';
          entry.complete_percentage = `${difference.toFixed(2)}%`;
          // entry.styleprogress.width = `${difference.toFixed(2)}%`/* { "width": ,"background-color": "yellow"} */
          entry.use_limit = Number(inLimitCategoryLimit) - Number(categoryLimit);


          entry.styleprogress = { "background-color": `${this.darkColorArray[index]}`, "width": `${difference.toFixed(2)}%` }
          entry.number_index = index + 1;
          entry.yellow = { "background-color": `${this.lightColorArray[index]}` };
          entry.darkcolor = { "background-color": `${this.darkColorArray[index]}` }
        });

        this.categoryGraphValue = matchedCategories;

        this.findServiceGraph(
          data,
          this.medicineClaimData
        );

        this.doughnutChart1(this.total_care_limit, subscriberId, plan_validity, 'primary')
      },
      error: (err: ErrorEvent) => {
        console.log(err.message, "err.message");
      },
    });

  }

  findServiceGraph(data: any, mergedData: any) {
    // Assuming 'data' is your array of objects
    const uniqueHasCategories = [
      ...new Set(data.map((obj) => { return { serviceName: obj.service, in_limit: obj.in_limit, category_name: obj.has_category } })),
    ];

    const result = [];
    mergedData.forEach(item => {
      const existingItemIndex = result.findIndex(obj => obj.categoryService === item.categoryService && obj.serviceName === item.serviceName);
      console.log(`existingItemIndex`, existingItemIndex);
      if (existingItemIndex !== -1) {
        result[existingItemIndex].usedAmount = (parseFloat(result[existingItemIndex].usedAmount) + parseFloat(item.usedAmount)).toFixed(1);
      } else {
        result.push({
          categoryService: item.categoryService,
          serviceName: item.serviceName,
          usedAmount: item.usedAmount
        });
      }
    });
    let matchedCategories = [];

    uniqueHasCategories.forEach((item2: any, index) => {
      const matchingItem = result.find(
        (item1) => item1.serviceName === item2.serviceName
      );
      if (matchingItem) {
        matchedCategories.push({
          number_index: index,
          service_name: matchingItem.serviceName,
          service_limit: matchingItem.usedAmount,
          category_name: matchingItem.categoryService,
          in_limit: item2.in_limit,
          remaining_percentage: 0,
          complete_percentage: 0,
          darkcolor: { "background-color": `${this.darkColorArray[index]}` },
          yellow: { "background-color": `${this.lightColorArray[index]}` },
          use_limit: 0,
          styleprogress: { "background-color": `${this.darkColorArray[index]}`, "width.%": 29.4 },
        });
      }
    });
    matchedCategories = matchedCategories.filter((item) => {
      let matchCategoryService = this.categoryGraphValue.find((item1) => item1.category_name === item.category_name);
      if (matchCategoryService) {
        item.darkcolor = matchCategoryService.darkcolor,
          item.yellow = matchCategoryService.yellow,
          item.styleprogress = matchCategoryService.styleprogress
        item.number_index = matchCategoryService.number_index;
        return item;
      } else {
        return item;
      }
    });
    matchedCategories.forEach((entry) => {
      const categoryLimit = entry.service_limit;
      const inLimitCategoryLimit = entry.in_limit.service_limit;
      const difference =
        (Number(categoryLimit) / Number(inLimitCategoryLimit)) * 100;
      const percentageDifference = 100 - difference;
      entry.remaining_percentage = (percentageDifference > 0) ? `${percentageDifference.toFixed(2)}%` : 100 + '%';
      entry.complete_percentage = `${difference.toFixed(2)}%`;
      entry.styleprogress.width = `${difference.toFixed(2)}%`;
      entry.use_limit = Number(inLimitCategoryLimit) - Number(categoryLimit);
    });

    this.serviceGraphValue = matchedCategories;

  }

  findFamilyCategoryGraph(data: any, subscriberId: any, plan_validity: any) {
    // Assuming 'data' is your array of objects
    const uniqueHasCategories = [
      ...new Set(data.map((obj) => obj.has_category)),
    ];
    let reqData = {
      subscriber_id: subscriberId,
      plan_validity: JSON.stringify(plan_validity),
      category_name: JSON.stringify(uniqueHasCategories),
    };
    this.service.categoryclaimGraph(reqData).subscribe({
      next: async (res) => {
        let response = await this.coreService.decryptObjectData({
          data: res,
        });
        let categoriesArray = response.body;
        let uniqueCategoryNames = new Set();
        let matchedCategories = [];

        data.forEach((item2, index) => {
          const matchingItem = categoriesArray.find(
            (item1) => item1.category_name === item2.has_category
          );

          if (matchingItem) {
            matchedCategories.push({
              number_index: index,
              category_name: matchingItem.category_name,
              category_limit: matchingItem.family_category_limit,
              in_limit: item2.primary_and_secondary_category_limit,
              remaining_percentage: 0,
              complete_percentage: 0,
              darkcolor: { "background-color": `${this.darkColorArray[index]}` },
              yellow: { "background-color": `${this.lightColorArray[index]}` },
              use_limit: 0,
              styleprogress: { "background-color": `${this.darkColorArray[index]}`, "width.%": 29.4 },
            });
          } else {
            matchedCategories.push({
              number_index: index,
              category_name: item2.has_category,
              category_limit: 0,
              in_limit: item2.primary_and_secondary_category_limit,
              remaining_percentage: 0,
              complete_percentage: 0,
              yellow: { "background-color": `${this.lightColorArray[index]}` },
              use_limit: 0,
              darkcolor: { "background-color": `${this.darkColorArray[index]}` },
              styleprogress: { "background-color": `${this.darkColorArray[index]}`, "width.%": 29.4 },
            });
          }
        });
        matchedCategories = matchedCategories.filter((item) => {
          if (!uniqueCategoryNames.has(item.category_name)) {
            uniqueCategoryNames.add(item.category_name);
            return true;
          }
          return false;
        });
        console.log("matchedCategories1----", matchedCategories)
        matchedCategories.forEach((entry, index) => {
          const categoryLimit = entry.category_limit;
          const inLimitCategoryLimit = entry.in_limit;
          const difference =
            (Number(categoryLimit) / Number(inLimitCategoryLimit)) * 100;
          const percentageDifference = 100 - difference;
          entry.remaining_percentage = (percentageDifference > 0) ? `${percentageDifference.toFixed(2)}%` : 0 + '%';
          entry.complete_percentage = `${difference.toFixed(2)}%`;
          // entry.styleprogress.width = `${difference.toFixed(2)}%`/* { "width": ,"background-color": "yellow"} */
          entry.use_limit = Number(inLimitCategoryLimit) - Number(categoryLimit);

          entry.styleprogress = { "background-color": `${this.darkColorArray[index]}`, "width": `${difference.toFixed(2)}%` }
          entry.number_index = index + 1;
          entry.yellow = { "background-color": `${this.lightColorArray[index]}` };
          entry.darkcolor = { "background-color": `${this.darkColorArray[index]}` }
        });

        this.familycategoryGraphValue = matchedCategories;

        this.findFamilyServiceGraph(
          data,
          subscriberId,
          plan_validity);

        this.doughnutChart2(this.total_care_limit, subscriberId, plan_validity)
      },
      error: (err: ErrorEvent) => {
        console.log(err.message, "err.message");
      },
    });
  }

  findFamilyServiceGraph(data: any, subscriberId: any, plan_validity: any) {
    // Assuming 'data' is your array of objects
    const uniqueHasCategories = [
      ...new Set(data.map((obj) => obj.service)),
    ];
    let reqData = {
      subscriber_id: subscriberId,
      plan_validity: JSON.stringify(plan_validity),
      service_name: JSON.stringify(uniqueHasCategories),
    };
    this.service.categoryclaimGraph(reqData).subscribe({
      next: async (res) => {
        let response = await this.coreService.decryptObjectData({
          data: res,
        });
        let categoriesArray = response.body;
        let matchedCategories = [];
        data.forEach((item2, index) => {
          const matchingItem = categoriesArray.find(
            (item1) => item1.service_name === item2.service
          );
          if (matchingItem) {
            matchedCategories.push({
              number_index: index,
              service_name: matchingItem.service_name,
              service_limit: matchingItem.family_service_limit,
              category_name: matchingItem.category_name,
              in_limit: item2.primary_and_secondary_service_limit,
              remaining_percentage: 0,
              complete_percentage: 0,
              darkcolor: { "background-color": `${this.darkColorArray[index]}` },
              yellow: { "background-color": `${this.lightColorArray[index]}` },
              use_limit: 0,
              styleprogress: { "background-color": `${this.darkColorArray[index]}`, "width.%": 29.4 },
            });
          }
        });
        matchedCategories = matchedCategories.filter((item) => {
          let matchCategoryService = this.categoryGraphValue.find((item1) => item1.category_name === item.category_name);
          if (matchCategoryService) {
            item.darkcolor = matchCategoryService.darkcolor,
              item.yellow = matchCategoryService.yellow,
              item.styleprogress = matchCategoryService.styleprogress
            item.number_index = matchCategoryService.number_index;
            return item;
          } else {
            return item;
          }

        });
        matchedCategories.forEach((entry) => {
          const categoryLimit = entry.service_limit;
          const inLimitCategoryLimit = entry.in_limit;
          const difference =
            (Number(categoryLimit) / Number(inLimitCategoryLimit)) * 100;
          const percentageDifference = 100 - difference;
          entry.remaining_percentage = (percentageDifference > 0) ? `${percentageDifference.toFixed(2)}%` : 0 + '%';
          entry.complete_percentage = `${difference.toFixed(2)}%`;
          entry.styleprogress.width = `${difference.toFixed(2)}%`/* { "width": ,"background-color": "yellow"} */
          entry.use_limit = Number(inLimitCategoryLimit) - Number(categoryLimit);
        });

        this.familyserviceGraphValue = matchedCategories;

      },
      error: (err: ErrorEvent) => {
        console.log(err.message, "err.message");
      },
    });
  }

  doughnutChart1(totalcarelimit: any, subscriberId: any, plan_validity: any, type: any) {
    let total_limit = 0;
    if (type === 'primary') {
      total_limit = totalcarelimit?.primary_care_limit;
    } else {
      total_limit = totalcarelimit?.secondary_care_limit;
    }

    let reqData = {
      subscriber_id: subscriberId,
      plan_validity: JSON.stringify(plan_validity),
    };
    this.service.categoryclaimGraph(reqData).subscribe({
      next: async (res) => {
        let response = await this.coreService.decryptObjectData({
          data: res,
        });
        console.log(response, "check response chart");

        let categoriesArray = response.body;

        this.total_assured_service_amount = {
          totalcarelimit: total_limit,
          servicelimit: Number(categoriesArray[0]?.own_limit),
          availablelimit: (total_limit - Number(categoriesArray[0]?.own_limit))
        }
        if (this.total_assured_service_amount.availablelimit < 0) {
          this.doughnutChart2Datasets = [
            {
              data: [100, 0],
              label: "Reputation",
              backgroundColor: ["#FFD57A", "#62D94F"],
              hoverBackgroundColor: ["#FFD57A", "#62D94F"],
              hoverBorderColor: ["#FFD57A", "#62D94F"],
              borderWidth: 0,
              hoverBorderWidth: 0,
            }
          ]
        } else {
          this.doughnutChart2Datasets = [
            {
              data: [this.total_assured_service_amount.servicelimit, this.total_assured_service_amount.availablelimit],
              label: "Reputation",
              backgroundColor: ["#FFD57A", "#62D94F"],
              hoverBackgroundColor: ["#FFD57A", "#62D94F"],
              hoverBorderColor: ["#FFD57A", "#62D94F"],
              borderWidth: 0,
              hoverBorderWidth: 0,
            }
          ]
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message, "err.message");
      },
    });
  }

  doughnutChart2(totallimit: any, subscriberId: any, plan_validity: any) {
    let total_limit = 0;
    total_limit = totallimit?.grand_total;

    let reqData = {
      subscriber_id: subscriberId,
      plan_validity: JSON.stringify(plan_validity),
    };
    this.service.categoryclaimGraph(reqData).subscribe({
      next: (res) => {
        let categoriesArray = res.body;

        this.family_total_insured_amount = {
          totallimit: total_limit,
          servicelimit: Number(categoriesArray[0]?.family_total_limit),
          availablelimit: (total_limit - Number(categoriesArray[0]?.family_total_limit))
        }

        if (this.family_total_insured_amount?.availablelimit < 0) {
          this.doughnutChartDatasets = [
            {
              data: [100, 0],
              label: "Reputation",
              backgroundColor: ["#FFD57A", "#4F90F2"],
              hoverBackgroundColor: ["#FFD57A", "#4F90F2"],
              hoverBorderColor: ["#FFD57A", "#4F90F2"],
              borderWidth: 0,
              hoverBorderWidth: 0,
            }
          ]
        } else {
          this.doughnutChartDatasets = [
            {
              data: [this.family_total_insured_amount.servicelimit, this.family_total_insured_amount.availablelimit],
              label: "Reputation",
              backgroundColor: ["#FFD57A", "#4F90F2"],
              hoverBackgroundColor: ["#FFD57A", "#4F90F2"],
              hoverBorderColor: ["#FFD57A", "#4F90F2"],
              borderWidth: 0,
              hoverBorderWidth: 0,
            }
          ]
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message, "err.message");
      },
    });
  }

  claimTypeFilter(event) {
    console.log("event----", event)
    if (event.value.subscription_for === 'Primary') {
      this.selectedValue = event.value._id;
      this.total_care_limit = this.primaryhealthplanData?.total_care_limit;
      this.findCategoryGraph(
        this.primaryplanServiceData,
        this.selectedValue,
        this.claimDetails.plan_validity
      );

      this.findFamilyCategoryGraph(
        this.primaryplanServiceData,
        this.selectedValue,
        this.claimDetails.plan_validity
      );
    } else {
      this.selectedValue = event.value;
      this.findCategoryGraph(
        this.dataSourceService,
        this.selectedValue,
        this.claimDetails.plan_validity
      );

      this.findFamilyCategoryGraph(
        this.dataSourceService,
        this.selectedValue,
        this.claimDetails.plan_validity
      );
    }
  }


  userDeopDwonFilter(event: any) {
    console.log(event.target.value);
    let value = event.target.value;
    const filterValue = value.toLowerCase();
    
    if (this.staffList.length > 0) {
      var result = this.staffList.filter((option: any) => {
        return option.name.toLowerCase().includes(filterValue);
      });      
      this.filteredOptions = result.length > 0 ? of(result) : of(["No Data"]);
      } else {
    this.filteredOptions = of(["No Data"]);
  }
}

}
