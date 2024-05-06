import { InsuranceSubscriber } from "./../../insurance-subscriber.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CoreService } from "src/app/shared/core.service";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
export interface PeriodicElement {
  name: string;
  uniqueId: string;
  creationDate: string;
  typeofinsurance: string;
  insuranceholder: string;
  dateofbirth: string;
  gender: string;
  phonenumber: string;
  subscriptionisfor: string;
  insuranceid: string;
  employeeid: string;
  healthplan: string;
  id: "",
  for_user: "",
}

const NESTED_ELEMENT_DATA: PeriodicElement[] = [
  {

    name: "",
    uniqueId: '',
    creationDate: '',
    typeofinsurance: "",
    insuranceholder: "",
    dateofbirth: "",
    gender: "",
    phonenumber: "",
    subscriptionisfor: "",
    insuranceid: "",
    employeeid: "",
    healthplan: "",
    id: "",
    for_user: "",
  },
];

const ELEMENT_DATA: PeriodicElement[] = [
  {

    name: "",
    uniqueId: '',
    creationDate: '',
    typeofinsurance: "",
    insuranceholder: "",
    dateofbirth: "",
    gender: "",
    phonenumber: "",
    subscriptionisfor: "",
    insuranceid: "",
    employeeid: "",
    healthplan: "",
    id: "",
    for_user: "",
  },
];
import * as XLSX from "xlsx";
import { Router } from "@angular/router";
import { InsuranceService } from "../../insurance.service";
import { log } from "console";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { MatPaginator } from "@angular/material/paginator";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: "app-subscribersview",
  templateUrl: "./subscribersview.component.html",
  styleUrls: ["./subscribersview.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class SubscribersviewComponent implements OnInit {

  @ViewChild("EXCLUSION") exclusion: ElementRef;

  // Nested table
  disabled: boolean = true;
  displayednestedColumns: string[] = [

    "name",
    "uniqueId",
    "creationDate",
    "typeofinsurance",
    "insuranceholder",
    "dateofbirth",
    "gender",
    "subscriptionisfor",
    "insuranceid",
    "employeeid",
    "healthplan",
    "card",
    'activestatus',
    "nestedaction"
  ];
  datanestedSource = NESTED_ELEMENT_DATA;
  // Parent table
  columnsToDisplay: string[] = [

    "name",
    "uniqueId",
    "creationDate",
    "typeofinsurance",
    "insuranceholder",
    "dateofbirth",
    "gender",
    "subscriptionisfor",
    "insurance_id",
    "employee_id",
    "healthplan",
    "card",
    "activestatus",
    "action",

  ];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['healthPlan', 'fromDate', 'toDate', 'view'];

  testData1 = [
    { testname: 'Hydrogen' },
    { testname: 'Helium' },
  ];
  displayedColumnss: string[] = [
    "categoryofexclusion",
    "medicinename",
    "brandname",
    "comment",
  ];

  displayedColumns: string[] = [
    "category",
    "primarySecondaryCatLimit",
    "categorylimit",
    "categorycondition",
    "service",
    "primarySecondaryServcLimit",
    "servicelimit",
    "repaymentcondition",
    "reimbursmentrate",
    "preauthorization",
    "waitingperiod",
    "waitingperiodredeemed",
    "comment"
  ];

  columnsToDisplayWithExpand = [...this.columnsToDisplay];
  expandedElement: null;

  addSubscriberForm: FormGroup;
  initialValue: any;
  subscriberTypeList: any;
  healthPlanList: any;
  subscriberforselect: any;
  userId: any;
  ageError: any = false;
  isSubmitted: Boolean = false;
  selectedFiles: any = "";
  editId: any = "";
  isEdit: any = false;
  pageSize: number = 10;
  totalLength: number = 0;
  page: any = 1;
  subscriberNameFilter: any = "";
  subscriberTypeFilter: any = "all";
  subscriberType: string = "Individual";
  primarySubscriberId: string = "";
  formSubmitError: string = "";
  isImport: boolean = false;
  oldFile: string = "";
  minDate = new Date();
  maxDate = new Date();
  maxDOB = new Date();
  selectedFileName: any = ''
  action: string;
  searchText: any = "";
  @ViewChild("TABLE") table: ElementRef;
  subsciberIds: any = [];
  subsciberIdsForCard: any = [];
  secondarySubscriberInfo: any = [];
  combinedSubscribersInfo: any = [];
  printAll: boolean = false;
  subscriberForValue: any;

  subscriberPlansHistory: any = [];

  healthPlanFromDate: any = '';
  healthPlanToDate: any = '';
  healthPlanName: any = '';
  subscriberId: any = '';
  subscriberHealthPlanId: any = '';
  subscriberProfile: any = '';
  selectedSubProfile: any = '';
  key: any;
  subscriberProfileView: any = '';
  selectedHealthPlanId: any = '';
  healthPlanNameSelected: any = '';

  subProfile: any = '';
  baseUrl: any = environment.apiUrl;
  planServicesData: any = [];
  planExclusionData: any = [];
  planData: any;
  planId: any = '';

  check: number;

  sortColumn: string = 'subscriber_full_name';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';

  selectAllSubscriberList: any = [];
  data_Subscriber: any;
  companyCardFieldsList: any;
  backFieldsExist: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  loginId: any;
  innerMenuPremission: any = [];
  userRole: any;
  previousHealthPlanToDate: Date;
  ToDate: Date;
  fromDate: Date;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private insuranceSubscriber: InsuranceSubscriber,
    private _coreService: CoreService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private _insuranceService: InsuranceService,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService
  ) {

    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
    this.addSubscriberForm = this.fb.group({
      subscriberType: ["", [Validators.required]],
      subscriberFor: ["Primary", [Validators.required]],
      unique: ["", [Validators.required]],
      companyName: [""],
      healthPlan: ["", [Validators.required]],
      firstName: ["", [Validators.required]],
      middleName: [""],
      lastName: ["", [Validators.required]],
      mobile: [""],
      dateofbirth: ["", [Validators.required]],
      subscriberAge: [""],
      gender: ["", [Validators.required]],
      insuranceId: [""],
      policyId: [""],
      cardId: [""],
      employeeId: [""],
      insuranceHolderName: ["", [Validators.required]],
      insuranceValidityFrom: ["", [Validators.required]],
      insuranceValidityTo: ["", [Validators.required]],
      reimbursementRate: ["", [Validators.max(100), Validators.min(0)]],
      relationship: [""],
      csvFileName: [""],
      dateofcreation: [new Date()],
      dateofjoining: [""]
    });
    // this.userId = '63388eab41788128c3070f7a'

    var d = new Date();
    d.setMonth(d.getMonth());
    this.maxDOB = d
    const userData = this._coreService.getLocalStorage("loginData");
    const adminData = this._coreService.getLocalStorage("adminData");
    this.loginId = userData._id;
    this.userRole = userData.role;

    if (userData.role === "INSURANCE_STAFF") {
      this.userId = adminData?.for_user
    } else {
      this.userId = this.loginId
    }

    this.initialValue = this.addSubscriberForm.value;
    this.setSubscriberType();

    this.addSubscriberForm.controls["subscriberType"].setValue("Individual");
    this.getCardFields();

  }
  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getSubscriberList(`${column}:${this.sortOrder}`);
  }



  setSubscriberType() {
    this.insuranceSubscriber.getSubscriberType().subscribe((res) => {
      let data = [];
      const decryptedData = this._coreService.decryptObjectData(
        JSON.parse(res)
      );
      for (const value of decryptedData.body.data) {
        data.push({
          id: value._id,
          value: value.type_name,
        });
      }
      this.subscriberTypeList = data;
    });
  }

  checkTodate() {

    this.minDate = new Date(this.addSubscriberForm.controls['insuranceValidityFrom'].value);
    console.log(this.minDate, 'min Date');
  }

  checkFromDate() {
    this.maxDate = new Date(this.addSubscriberForm.controls['insuranceValidityTo'].value);
  }

  handlePrimaryClick(id: string, value: any) {
    if (value) {
      this.viewSubscriberDetailsForSecondary(id);
    }
  }

  viewSubscriberDetailsForSecondary(id: any) {
    this.insuranceSubscriber.viewSubscriberDetails(id).subscribe((res: any) => {
      let data = [];
      const decryptedData = this._coreService.decryptObjectData(
        JSON.parse(res)
      );
      let primarySubInfo = {
        name: decryptedData.body.subscriber_details.subscriber_full_name,
        first_name: decryptedData.body.subscriber_details.subscriber_first_name,
        middle_name: decryptedData.body.subscriber_details.subscriber_middle_name,
        last_name: decryptedData.body.subscriber_details.subscriber_last_name,
        uniqueId: decryptedData.body.subscriber_details.unique,
        creationDate: decryptedData.body.subscriber_details.createdAt,
        typeofinsurance: decryptedData.body.subscriber_details.subscriber_type,
        insuranceholder:
          decryptedData.body.subscriber_details.subscriber_type === "Individual"
            ? "Individual"
            : decryptedData.body.subscriber_details.company_name,
        insurance_holder_name: decryptedData.body.subscriber_details.insurance_holder_name,
        dateofbirth: decryptedData.body.subscriber_details.date_of_birth,
        gender: decryptedData.body.subscriber_details.gender,
        subscriptionisfor: decryptedData.body.subscriber_details.subscription_for,
        insurance_validity_to: decryptedData.body.subscriber_details.insurance_validity_to,
        insurance_id: decryptedData.body.subscriber_details.insurance_id,
        employee_id: decryptedData.body.subscriber_details.employee_id,
        healthplan: decryptedData.body.subscriber_details.health_plan_for.name,
        id: decryptedData.body.subscriber_details._id,
        mobile: decryptedData.body.subscriber_details.mobile,
        reimbursment_rate: decryptedData.body.subscriber_details.health_plan_for.reimbursment_rate,
        age: decryptedData.body.subscriber_details.age,
        card_id: decryptedData.body.subscriber_details.card_id,
        policy_id: decryptedData.body.subscriber_details.policy_id
      }
      const secondarySubscriber =
        decryptedData.body.subscriber_details.secondary_subscriber;
      for (const value of secondarySubscriber) {
        console.log("valuevaluevalue======================", value);

        const uniqueHasCategories = new Set();
        const extractedPlanServices = [];

        for (const planService of decryptedData.body.plan_services) {
          if (!uniqueHasCategories.has(planService.has_category)) {
            extractedPlanServices.push({
              has_category: planService.has_category,
              services: [{
                service: planService.service,
                reimbursment_rate: planService.reimbursment_rate,
                cat_in_limit: planService.in_limit.category_limit,
                ser_in_limit: planService.in_limit.service_limit,
                checkservice: planService.service,
                checkcatgory: planService.has_category,
                primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
                primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
              }],
            });

            uniqueHasCategories.add(planService.has_category);
          } else {
            const existingObject = extractedPlanServices.find(obj => obj.has_category === planService.has_category);

            if (existingObject) {
              existingObject.services.push({
                service: planService.service,
                reimbursment_rate: planService.reimbursment_rate,
                cat_in_limit: planService.in_limit.category_limit,
                ser_in_limit: planService.in_limit.service_limit,
                checkservice: planService.service,
                checkcatgory: planService.has_category,
                primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
                primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
              });
            }
          }
        }

        var newPlanService1 = [];
        var k = 1;
        for (const planService of extractedPlanServices) {

          newPlanService1.push({
            checkservice: '',
            checkcatgory: planService.has_category,
            service: planService.has_category,
            cat_in_limit: planService.services[0].cat_in_limit,
            ser_in_limit: '',
            reimbursment_rate: '',
            primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
            primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
          })
          newPlanService1.push(...planService.services)
        }

        var newPlanService2 = [];
        var k = 1;
        for (const planServic11e of newPlanService1) {
          console.log(planServic11e, "planServic11e");

          if (this.isBackFieldExist(planServic11e.checkcatgory, planServic11e.checkservice)) {
            newPlanService2.push({ ...planServic11e, seq: k })
            if (planServic11e.checkservice == '') {
              k++
            }
          }
        }

        data.push({
          name: value.subscriber_full_name,
          uniqueId: value.unique,
          creationDate: value.createdAt,
          typeofinsurance: value.subscriber_type,
          insuranceholder:
            value.subscriber_type === "Individual"
              ? "Individual"
              : value.company_name,
          insurance_holder_name: value.insurance_holder_name,
          dateofbirth: value.date_of_birth,
          gender: value.gender,
          subscriptionisfor: value.subscription_for,
          insurance_validity_to: value.insurance_validity_to,
          insurance_validity_from: value.insurance_validity_from,
          insurance_id: value.insurance_id,
          employee_id: value.employee_id,
          healthplan: value.health_plan_for.name,
          healthplanId: value.health_plan_for._id,
          id: value._id,
          primarySubscriberId: primarySubInfo,
          mobile: value.mobile,
          reimbursment_rate: value.health_plan_for.reimbursment_rate,
          age: value.age,
          card_id: value.card_id,
          policy_id: value.policy_id,
          first_name: value.subscriber_first_name,
          middle_name: value.subscriber_middle_name,
          last_name: value.subscriber_last_name,
          relationship: value.relationship_with_insure,
          totalCareLimitPrimSec: value.health_plan_for.total_care_limit.grand_total,
          plan_services: newPlanService2,
          subscriberImage: value.insurance_card_id_proof,
          dateofcreation: value.dateofcreation,
          is_active: value.is_active
        });
      }
      this.datanestedSource = data;
      console.log(decryptedData.body, "decryptedDataaaww______", this.datanestedSource);

    });

  }

  getHealthPlans() {
    this.insuranceSubscriber
      .getHealthPlans(this.userId)
      .subscribe((res: any) => {
        let data = [];
        const decryptedData = this._coreService.decryptObjectData(
          JSON.parse(res)
        );
        for (const value of decryptedData.body.result) {
          data.push({
            id: value._id,
            value: value.name,
          });
        }
        this.healthPlanList = data;
        console.log(this.healthPlanList, "healthPlanListtt______");

      });
  }
  handleSubscriberTypeFilter(value: any) {
    this.subscriberTypeFilter = value;
    this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);
  }
  handleSearchFilter(event: any) {
    console.log("check handleSearchFilter");

    this.subscriberNameFilter = event.target.value;
    this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);
  }
  handleFilter() {
    console.log("check handleSearchFilter down");

    this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);
  }
  handlePageEvent(data: any) {
    console.log("hjgggjgjhg", data);

    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);
  }
  handleClose() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addSubscriberForm.reset(this.initialValue);
    this.addSubscriberForm.markAsPristine();
    this.addSubscriberForm.markAsUntouched();
    this.isSubmitted = false;
    this.selectedFiles = [];
    this.editId = "";
    this.isEdit = false;
    this.subscriberType = "Individual";
    this.addSubscriberForm.controls["subscriberType"].setValue("Individual");
    this.primarySubscriberId = "";
    this.formSubmitError = "";
    this.isImport = false;
    const validateArray = ['subscriberType', 'subscriberFor', 'unique', 'healthPlan', 'firstName', 'lastName', 'dateofbirth', 'gender', 'insuranceHolderName', 'insuranceValidityFrom', 'insuranceValidityTo']
    this.setAndUnsetValidations(validateArray);
    this.subProfile = '';
  }
  isBackFieldExist(category: string, service: string): boolean {
    console.log("category=", category, "service=", service);

    if (service == '') {
      return this.backFieldsExist.some((field) => {
        return field.category === category;
      });
    }
    return this.backFieldsExist.some((field) => {
      return field.category === category && field.service === service;
    });
  }


  sendit(event: number) {

    this.check = Math.trunc(this.paginator.length / this.paginator.pageSize);
    console.log(this.check, "event-----------",);
    if (event > this.check) {
      console.log("ERROR");
      this._coreService.showError("", `Please enter the correct number of pages. As you have only ${this.check} pages.`)
    } else {
      this.page = event;
      this.paginator.pageIndex = this.page - 1;
      this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);

    }


  }

  getSubscriberList(sort: any = '') {
    const param = {
      page: this.page,
      limit: this.pageSize,
      subscriber_name: this.subscriberNameFilter,
      subscriberTypeFilter: this.subscriberTypeFilter,
      user_id: this.userId,
      sort: sort
    };
    this.insuranceSubscriber.getSubscriberList(param).subscribe((res: any) => {
      const decryptedData = this._coreService.decryptObjectData(
        JSON.parse(res)
      );
      console.log(decryptedData, "subscriberListtt_____");

      this.totalLength = decryptedData.body.totalCount;
      this.data_Subscriber = [];
      let data = [];
      for (const value of decryptedData.body.data) {
        console.log(value);

        const uniqueHasCategories = new Set();
        const extractedPlanServices = [];
        //this.subProfile = 
        console.log(value.plan_services[0], "planServiceeee____", decryptedData.body);

        for (const planService of value.plan_services) {

          if (!uniqueHasCategories.has(planService.has_category)) {
            extractedPlanServices.push({
              has_category: planService.has_category,
              services: [{
                service: planService.service,
                reimbursment_rate: planService.reimbursment_rate,
                cat_in_limit: planService.in_limit.category_limit,
                ser_in_limit: planService.in_limit.service_limit,
                checkservice: planService.service,
                checkcatgory: planService.has_category,
                primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
                primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
              }],
            });

            uniqueHasCategories.add(planService.has_category);
          } else {
            const existingObject = extractedPlanServices.find(obj => obj.has_category === planService.has_category);

            if (existingObject) {
              existingObject.services.push({
                service: planService.service,
                reimbursment_rate: planService.reimbursment_rate,
                cat_in_limit: planService.in_limit.category_limit,
                ser_in_limit: planService.in_limit.service_limit,
                checkservice: planService.service,
                checkcatgory: planService.has_category,
                primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
                primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
              });
            }
          }
        }

        var newPlanService1 = [];
        var k = 1;
        for (const planService of extractedPlanServices) {

          newPlanService1.push({
            checkservice: '',
            checkcatgory: planService.has_category,
            service: planService.has_category,
            cat_in_limit: planService.services[0].cat_in_limit,
            ser_in_limit: '',
            reimbursment_rate: '',
            primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
            primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
          })
          newPlanService1.push(...planService.services)
        }

        var newPlanService2 = [];
        var k = 1;
        for (const planServic11e of newPlanService1) {
          console.log(planServic11e, "planServic11e");

          if (this.isBackFieldExist(planServic11e.checkcatgory, planServic11e.checkservice)) {
            newPlanService2.push({ ...planServic11e, seq: k })
            if (planServic11e.checkservice == '') {
              k++
            }
          }
        }


        console.log(extractedPlanServices, "extractedPlanServicesss_____", newPlanService2);

        data.push({
          name: value.subscriber_full_name,
          uniqueId: value.unique,
          creationDate: value.createdAt,
          typeofinsurance: value.subscriber_type,
          insuranceholder:
            value.subscriber_type === "Individual"
              ? "Individual"
              : value.company_name,
          dateofbirth: value.date_of_birth,
          gender: value.gender,
          subscriptionisfor: value.subscription_for,
          insurance_id: value.insurance_id,
          employee_id: value.employee_id,
          healthplan: value.health_plan_for?.name,
          healthplanId: value.health_plan_for._id,
          id: value._id,
          mobile: value.mobile,
          reimbursment_rate: value.reimbersement_rate,
          age: value.age,
          insurance_validity_to: value.insurance_validity_to,
          insurance_validity_from: value.insurance_validity_from,
          card_id: value.card_id,
          policy_id: value.policy_id,
          plan_services: newPlanService2,
          first_name: value.subscriber_first_name,
          middle_name: value.subscriber_middle_name,
          last_name: value.subscriber_last_name,
          totalCareLimitPrimSec: value.health_plan_for.total_care_limit.grand_total,
          subscriberImage: value.insurance_card_id_proof,
          dateofcreation: value.dateofcreation,
          secondary_subscriber: value.secondary_subscriber,
          is_active: value.is_active

        });
      }

      this.data_Subscriber = data
      this.dataSource = data;
      this.check = Math.trunc(this.totalLength / this.paginator.pageSize);
      this.loader.stop()
      console.log(this.paginator.length, "this.check-----------", this.paginator.pageSize);
      console.log(this.dataSource, "check__recorddd___", decryptedData.body.data);


    });
  }

  monthDiff(d1: any, d2: any) {
    let months: any;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months;
  }

  handleDOBChange(d: any) {
    const diff = this.monthDiff(new Date(d), new Date())
    this.addSubscriberForm.controls["subscriberAge"].setValue((diff / 12).toFixed(1));
  }

  downloadSampleExcel() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'assets/doc/primary-subscriber.xlsx');
    link.setAttribute('download', `subscriberSamplelist.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  downloadSampleCompanyExcel() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'assets/doc/company-subscriber.xlsx');
    link.setAttribute('download', `sample-primarysubscriber.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  openVerticallyCenteredEditplan(imporsubscriber: any) {
    this.modalService.open(imporsubscriber, {
      centered: true,
      windowClass: "import_subscribes",
    });
    const validateArray = ['csvFileName']
    this.isImport = true;
    this.setAndUnsetValidations(validateArray);
  }


  viewSubscriberDetails() {
    this.insuranceSubscriber
      .viewSubscriberDetails(this.editId)
      .subscribe((res: any) => {
        const decryptedData = this._coreService.decryptObjectData(
          JSON.parse(res)
        );
        const subscriberDetails = decryptedData.body.subscriber_details;
        this.subscriberForValue = subscriberDetails.subscription_for;

        this.addSubscriberForm.controls["subscriberType"].setValue(
          subscriberDetails.subscriber_type
        );
        this.addSubscriberForm.controls["subscriberFor"].setValue(
          subscriberDetails.subscription_for
        );
        this.addSubscriberForm.controls["unique"].setValue(
          subscriberDetails.unique
        );
        this.addSubscriberForm.controls["healthPlan"].setValue(
          subscriberDetails.health_plan_for._id
        );
        this.addSubscriberForm.controls["firstName"].setValue(
          subscriberDetails.subscriber_first_name
        );
        this.addSubscriberForm.controls["middleName"].setValue(
          subscriberDetails.subscriber_middle_name
        );
        this.addSubscriberForm.controls["lastName"].setValue(
          subscriberDetails.subscriber_last_name
        );
        this.addSubscriberForm.controls["mobile"].setValue(
          subscriberDetails.mobile
        );
        this.addSubscriberForm.controls["dateofbirth"].setValue(
          subscriberDetails.date_of_birth
        );
        this.addSubscriberForm.controls["subscriberAge"].setValue(
          subscriberDetails.age
        );
        this.addSubscriberForm.controls["gender"].setValue(
          subscriberDetails.gender
        );
        this.addSubscriberForm.controls["policyId"].setValue(
          subscriberDetails.policy_id
        );
        this.addSubscriberForm.controls["cardId"].setValue(
          subscriberDetails.card_id
        );
        this.addSubscriberForm.controls["employeeId"].setValue(
          subscriberDetails.employee_id
        );
        this.addSubscriberForm.controls["insuranceId"].setValue(
          subscriberDetails.insurance_id
        );
        this.addSubscriberForm.controls["insuranceHolderName"].setValue(
          subscriberDetails.insurance_holder_name
        );
        this.addSubscriberForm.controls["insuranceValidityFrom"].setValue(
          subscriberDetails.insurance_validity_from
        );
        this.addSubscriberForm.controls["insuranceValidityTo"].setValue(
          subscriberDetails.insurance_validity_to
        );
        this.addSubscriberForm.controls["reimbursementRate"].setValue(
          subscriberDetails.reimbersement_rate
        );
        this.addSubscriberForm.controls["relationship"].setValue(
          subscriberDetails.relationship_with_insure

        );
        this.addSubscriberForm.controls["dateofcreation"].setValue(
          subscriberDetails.dateofcreation

        );
        this.addSubscriberForm.controls["dateofjoining"].setValue(
          subscriberDetails.dateofjoining

        );
        console.log(subscriberDetails, "subscriberDetailsss______");
        if (decryptedData.body.subscriberProfile) {
          this.subProfile = decryptedData.body.subscriberProfile;
        } else {
          this.subProfile = '';
        }

        this.checkFromDate()
        this.checkTodate()
        this.oldFile = subscriberDetails.insurance_card_id_proof;
      });
  }

  openVerticallyCentered(addsubsriber: any, id: string = "", flag: number) {
    this.getHealthPlans();
    if (flag === 1) {
      this.action = 'Add'
    } else {
      this.action = 'Edit'
    }
    if (id != '') {
      // this.action = 'Edit'
      this.editId = id;
      this.isEdit = true;
      this.subscriberType = "Individual";
      this.viewSubscriberDetails();
    }
    this.modalService.open(addsubsriber, {
      centered: true,
      windowClass: "add_subscriber",
    });
  }

  openVerticallyCenteredsecond(addsecondsubsriber: any, primaryInfo: any) {
    console.log(primaryInfo, "primaryInfo");

    this.getHealthPlans();
    this.addSubscriberForm.controls["subscriberFor"].setValue("Secondary");
    this.primarySubscriberId = primaryInfo.id;
    this.ToDate = new Date(primaryInfo.insurance_validity_to);
    this.ToDate.setDate(this.ToDate.getDate() + 1);

    this.fromDate = new Date(primaryInfo.insurance_validity_from);
    this.fromDate.setDate(this.fromDate.getDate() + 1);

    this.subscriberType = "Individual";
    this.addSubscriberForm.patchValue({ unique: primaryInfo.uniqueId })
    const validateArray = ['subscriberType', 'subscriberFor', 'healthPlan', 'firstName', 'lastName', 'dateofbirth', 'gender', 'insuranceHolderName', 'insuranceValidityFrom', 'insuranceValidityTo', 'relationship']
    this.setAndUnsetValidations(validateArray);
    this.modalService.open(addsecondsubsriber, {
      centered: true,
      size: "lg",
      windowClass: "add__secondary_subscriber",
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
  ngOnInit(): void {
    // setTimeout(() => {
    //   this.checkInnerPermission();
    // }, 300);

  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission() {
    let userPermission = this._coreService.getLocalStorage("loginData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id", menuID)

    if (checkData) {
      if (checkData.isChildKey == true) {

        var checkSubmenu = checkData.submenu;

        if (checkSubmenu.hasOwnProperty("subscriber")) {

          this.innerMenuPremission = checkSubmenu['subscriber'].inner_menu;

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

  printAllSubscribersData() {
    this.openInNewPage();
    this.combinedSubscribersInfo = []
  }


  getCardFields() {
    this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);
  }
  myFilter = (d: Date | null): boolean => {
    return true;
  };
  createDate(date: Date) {
    const newDay = `0${date.getDate()}`;
    const newMonth = `0${date.getMonth() + 1}`;
    return `${date.getFullYear()}-${newMonth.length > 2 ? newMonth.slice(1) : newMonth
      }-${newDay.length > 2 ? newDay.slice(1) : newDay}`;
  }
  selectFile(file: any) {
    this.selectedFiles = file.target.files[0];
    this.formSubmitError = "";
    this.selectedFileName = file.target.files[0].name;

    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.subProfile = event.target.result;
    };

    // Read the selected file as a data URL
    reader.readAsDataURL(this.selectedFiles);

    console.log(this.subProfile, "selectedFileNameee_____", this.selectedFileName);

  }
  setAndUnsetValidations(validateArray: any) {
    const removeAllValidations = ['subscriberType', 'subscriberFor', 'unique', 'healthPlan', 'companyName', 'csvFileName', 'firstName', 'lastName', 'dateofbirth', 'gender', 'insuranceHolderName', 'insuranceValidityFrom', 'insuranceValidityTo']
    for (const invalidate of removeAllValidations) {
      this.addSubscriberFormControl[invalidate].clearValidators();
      this.addSubscriberFormControl[invalidate].updateValueAndValidity();
    }
    for (const validate of validateArray) {
      this.addSubscriberFormControl[validate].setValidators(
        Validators.required
      );
      this.addSubscriberFormControl[validate].updateValueAndValidity();
    }
  }


  handleSubscriberTypeChange(value: any) {
    let validateArray: any;
    if (value == "Individual") {
      validateArray = ['subscriberType', 'subscriberFor', 'unique', 'healthPlan', 'firstName', 'lastName', 'dateofbirth', 'gender', 'insuranceHolderName', 'insuranceValidityFrom', 'insuranceValidityTo']
    } else {
      validateArray = ['subscriberType', 'companyName', 'csvFileName']
    }
    this.setAndUnsetValidations(validateArray);
    this.isSubmitted = false;
    this.subscriberType = value;
  }

  uploadDocuments(doc: FormData) {
    return new Promise((resolve, reject) => {
      this._insuranceService.uploadFile(doc).subscribe(
        (res) => {
          let response = this._coreService.decryptObjectData({ data: res });
          resolve(response);
        },
        (err) => {
          let errResponse = this._coreService.decryptObjectData({
            data: err.error,
          });
          this._coreService.showError(errResponse.messgae, "");
        }
      );
    });
  }

  selectSubProfile(event: any) {

    if (event.target.files && event.target.files[0]) {

      let file = event.target.files[0];
      console.log("fileeee_____", file);

      const formData: FormData = new FormData();

      formData.append("userId", 'subscriberProfile');
      formData.append("docType", 'subscriberProfile');
      formData.append("multiple", "false");
      formData.append("docName", file);
      // this.addSubscriberForm.patchValue({
      //   subcriberProfile: this.selectedSubProfile,       
      // });
      this.selectedSubProfile = formData;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.subscriberProfileView = event.target.result;
        this.subProfile = this.subscriberProfileView
        //console.log(this.subscriberProfileView,"subscriberProfileViewww______");

      };


      reader.readAsDataURL(event.target.files[0]);
    }
  }


  async onSubmit(type: any = "") {
    //console.log('dasdasd');

    this.isSubmitted = true;
    const values = this.addSubscriberForm.value;
    //console.log("REQDATA==>", values)
    const validateIndividualArray = ['subscriberType', 'subscriberFor', 'healthPlan', 'companyName', 'csvFileName', 'firstName', 'middleName', 'lastName', 'dateofbirth', 'subscriberAge', 'gender', 'insuranceId', 'policyId', 'cardId', 'employeeId', 'insuranceHolderName', 'insuranceValidityFrom', 'insuranceValidityTo', 'reimbursementRate', 'dateofcreation', 'dateofjoining']
    for (const iterator of validateIndividualArray) {

      console.log(this.addSubscriberForm.controls[iterator].errors, iterator);
    }

    if (this.addSubscriberForm.invalid) {
      // this.addSubscriberForm.controls

      const invalid = [];
      const controls = this.addSubscriberForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid, 'addSubscriberForm invalid');
      return;
    }

    this.loader.start();

    if (this.subscriberType === "Individual" && !this.isImport) {
      console.log("Primaryyyyy______");

      const formData: any = new FormData();

      //Img aws url

      if (this.selectedSubProfile !== "") {
        console.log(this.selectedSubProfile, "insideeSelectedProfilee_____");


        await this.uploadDocuments(this.selectedSubProfile).then((res: any) => {
          console.log(res, "insideResponseee____");


          this.key = res.data[0].Key
          console.log(this.key, "keyyyy_____");

          formData.append("insurance_card_id_proof", this.key)
          // this.addSubscriberForm.patchValue({
          //   subscriberProfile: res.data[0].Key,
          // });
        });
      } else {
        formData.append("insurance_card_id_proof", "")
      }

      //formData.append("insurance_card_id_proof", this.selectedFiles);

      formData.append("subscriber_type", values.subscriberType);
      formData.append("subscription_for", values.subscriberFor);
      formData.append("unique", values.unique);
      formData.append("health_plan_for", values.healthPlan);
      formData.append("subscriber_first_name", values.firstName);
      formData.append("subscriber_middle_name", values.middleName);
      formData.append("subscriber_last_name", values.lastName);
      formData.append("mobile", values.mobile);
      formData.append(
        "date_of_birth",
        values.dateofbirth ? this.createDate(new Date(values.dateofbirth)) : ""
      );
      formData.append("gender", values.gender);
      formData.append("age", values.subscriberAge);
      formData.append("insurance_id", values.insuranceId);
      formData.append("policy_id", values.policyId);
      formData.append("card_id", values.cardId);
      formData.append("employee_id", values.employeeId);
      formData.append("insurance_holder_name", values.insuranceHolderName);
      formData.append(
        "insurance_validity_from",
        values.insuranceValidityFrom
          ? this.createDate(new Date(values.insuranceValidityFrom))
          : ""
      );
      formData.append(
        "insurance_validity_to",
        values.insuranceValidityTo
          ? this.createDate(new Date(values.insuranceValidityTo))
          : ""
      );
      formData.append("reimbersement_rate", values.reimbursementRate);
      formData.append("dateofcreation", values.dateofcreation ? this.createDate(new Date(values.dateofcreation)) : "");
      formData.append("dateofjoining", values.dateofjoining ? this.createDate(new Date(values.dateofjoining)) : "");

      formData.append("for_user", this.userId);
      formData.append("addedBy", this.loginId);


      if (type === "secondary") {
        formData.append("relationship_with_insure", values.relationship);
        formData.append("primary_id", this.primarySubscriberId);
      }
      if (this.isEdit) {
        type = "edit";
        formData.append("subscriber_id", this.editId);
        formData.append("old_insurance_card_id_proof", this.oldFile);
        formData.append("relationship_with_insure", values.relationship);
        formData.append("primary_id", this.primarySubscriberId);
      }

      for (let [key, value] of formData) {
        console.log("REQDATA====>", key + '----->' + value)

      }

      this.insuranceSubscriber.submitSubscriberForm(formData, type).subscribe(
        (res: any) => {
          const decryptedData = this._coreService.decryptObjectData(
            JSON.parse(res)
          );
          if (decryptedData.status) {
            this._coreService.showSuccess(decryptedData.message, "Success");
            this.handleClose();
            this.loader.stop();
            this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);
            this.selectedFileName = '';

          }
          if (decryptedData.status && !this.isEdit) {
            this.addSubscriberPlanHistory(decryptedData)
          }

          if (!decryptedData.status) {
            this.loader.stop();
            this._coreService.showError(decryptedData.message, "Error");
          }
        },
        (err) => {
          const decryptedData = this._coreService.decryptObjectData(
            JSON.parse(err.error)
          );
          this.loader.stop();
          console.log(decryptedData);
        }
      );
    } else {
      console.log("seconndaryyy_________");

      const formData = new FormData();
      formData.append("subscriber_type", values.subscriberType);
      formData.append("health_plan_id", values.healthPlan);
      formData.append("company_name", values.companyName);
      formData.append("for_user", this.userId);
      formData.append("csv_file", this.selectedFiles);
      formData.append("subscriber_mobile", values.mobile);
      formData.append("addedBy", this.loginId);



      this.insuranceSubscriber.uploadCSVFile(formData).subscribe(
        (res: any) => {
          const decryptedData = this._coreService.decryptObjectData(
            JSON.parse(res)
          );
          console.log(decryptedData, "decryptedData");

          if (decryptedData.status) {
            this.handleClose();
            this.loader.stop();
            this.selectedFileName = '';
            this._coreService.showSuccess(decryptedData.message, "Success");
            this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);
          }
          if (!decryptedData.status) {
            this._coreService.showError(decryptedData.message, "Error");
            this.selectedFileName = '';
            this.handleClose();
            this.loader.stop();
            this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);

          }
        },
        (err) => {
          const decryptedData = this._coreService.decryptObjectData(
            JSON.parse(err.error)
          );
          this.loader.stop();
          console.log(decryptedData);
          this._coreService.showError(err.error, "")
          this.formSubmitError = JSON.parse(err.error).message;
        }
      );
    }


  }

  addSubscriberPlanHistory(subscriber: any) {
    this.loader.start();
    let subscriberData = {};
    if (subscriber.body) {
      subscriberData = {
        health_plan_for: subscriber.body.health_plan_for,
        plan_validity_from: subscriber.body.insurance_validity_from,
        plan_validity_to: subscriber.body.insurance_validity_to,
        subscriberId: subscriber.body._id
      };
    } else {
      subscriberData = {
        health_plan_for: subscriber.health_plan_for,
        plan_validity_from: subscriber.insurance_validity_from,
        plan_validity_to: subscriber.insurance_validity_to,
        subscriberId: subscriber._id
      };
    }
    console.log(subscriberData, 'subscriberDataaaaa_____', subscriber);

    this.insuranceSubscriber.addSubscriberPlanHistory(subscriberData).subscribe((res: any) => {
      const decryptedData = this._coreService.decryptObjectData(
        JSON.parse(res)
      );
      this.loader.stop();
      console.log(decryptedData, "decryptedDataHistoryyy____", res);
    })

  }
  getSubscriberPlanHistory(subscriberId: any, plansHistory: any) {
    console.log(subscriberId, "subscrinberrrrrr___");

    this.insuranceSubscriber.getSubscriberPlanHistory({ subscriberId: subscriberId.id }).subscribe((res: any) => {
      let decryptedData = this._coreService.decryptContext(JSON.parse(res));
      //console.log(decryptedData, "decryptedDataaaa_____", res);

      if (decryptedData.body.subscriberHistoryDetails.length !== 0) {
        this.subscriberPlansHistory = decryptedData.body.subscriberHistoryDetails;
      } else {
        this.subscriberPlansHistory = [];
      }


      console.log(this.subscriberPlansHistory, "subscriberPlansHistory___");
    })
    this.modalService.open(plansHistory, {
      centered: true,
      size: "lg",
      windowClass: "view__subscriber_plan_history",
    });
  }

  getSubscriberPlanValidity(subscriber: any, planValidity: any) {
    this.getHealthPlans();
    console.log(subscriber, "subscriberrr11_______", subscriber.insurance_validity_to);

    /*   this.healthPlanFromDate = subscriber.insurance_validity_from;
      this.healthPlanToDate = subscriber.insurance_validity_to; */
    this.healthPlanName = subscriber.healthplan;
    this.healthPlanNameSelected = subscriber.healthplanId;

    this.subscriberId = subscriber.id;
    this.subscriberHealthPlanId = subscriber.healthplanId;
    this.previousHealthPlanToDate = new Date(subscriber.insurance_validity_to);
    this.previousHealthPlanToDate.setDate(this.previousHealthPlanToDate.getDate() + 1);
    this.healthPlanFromDate = new Date(subscriber.insurance_validity_to);
    this.healthPlanFromDate.setDate(this.healthPlanFromDate.getDate() + 1);

    const insuranceValidityFrom = new Date(subscriber.insurance_validity_from);
    const insuranceValidityTo = new Date(subscriber.insurance_validity_to);

    // Calculate the difference in days
    const daysDifference = (insuranceValidityTo.getTime() - insuranceValidityFrom.getTime()) / (1000 * 60 * 60 * 24);

    // Create a new date by adding the calculated days to insuranceValidityTo and update this.healthPlanToDate
    this.healthPlanToDate = new Date(insuranceValidityTo);
    this.healthPlanToDate.setDate(insuranceValidityTo.getDate() + daysDifference);
    this.healthPlanToDate.setDate(this.healthPlanToDate.getDate() + 1);

    console.log(this.healthPlanFromDate, "subscriberrr22_______", this.healthPlanToDate);


    this.modalService.open(planValidity, {
      centered: true,
      size: "lg",
      windowClass: "Update__subscriber_plan_validity",
    });
  }

  onHealthPlanChange(event: any) {
    this.selectedHealthPlanId = event;
    console.log(this.selectedHealthPlanId, "eventtttt______");
  }

  renewHealthPlan() {
    let planUpdateData = {
      plan_validity_from: this.createDate(new Date(this.healthPlanFromDate)),
      plan_validity_to: this.createDate(new Date(this.healthPlanToDate)),
      subscriberId: this.subscriberId,
      health_plan_for: this.selectedHealthPlanId ? this.selectedHealthPlanId : this.healthPlanNameSelected
    };
    console.log(planUpdateData, "planUpdateDataaa_______");

    this.insuranceSubscriber.updateSubscriberPlanValidity(planUpdateData).subscribe((res: any) => {
      let decryptedData = this._coreService.decryptContext(JSON.parse(res));
      console.log(decryptedData.data.result, "decryptedDataaaads_____", decryptedData);
      this.addSubscriberPlanHistory(decryptedData.data.result)
      this.toastr.success("Health Plan Renewed Successfully!")
      this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);
    })
    this.handleClose();
    console.log("updatedd______", planUpdateData);
  }

  openValidityPopup(planValidityConfirmation: any) {
    this.modalService.open(planValidityConfirmation, {
      centered: true,
      size: "lg",
      windowClass: "Update__subscriber_plan_validity",
    });
  }

  get addSubscriberFormControl(): { [key: string]: AbstractControl } {
    return this.addSubscriberForm.controls;
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }
  handlePlansExport() {
    console.log("Service Exported");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, "SubscriberList.xlsx");
  }

  openCardPreview(subscriberInfo: any) {
    console.log(subscriberInfo, "subscriberInfooooo");
    this.router.navigate([`/insurance/subscriber-card-review/${subscriberInfo.id}`])
  }

  exportSubscriber() {
    this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    const param = {
      user_id: this.userId,
    };
    this._insuranceService
      .getSubscriberListDataexport(param)
      .subscribe((res) => {
        // console.log("res=>>>>>>>>>>",res)
        let result = this._coreService.decryptObjectData({ data: res });
        // console.log("result=>>>>>>>>>>",result)
        if (result.status == true) {
          this.loader.stop();
          var array = ["SubscriberUniqueID",
            "SubscriberType", "GroupName", "SubscriptionFor",
            "SubscriberFirstName",
            "SubscriberMiddleName",
            "SubscriberLastName",
            "SubscriberMobile",
            "SubscriberCountryCode",
            "SubscriberReimbersementRate",
            "HealthPlan",
            "DOB",
            "Gender",
            "InsuranceID",
            "PolicyID",
            "CardID",
            "EmployeeID",
            "InsuranceHolderName",
            "InsuranceValidityFromDate",
            "InsuranceValidityToDate",
            "Relationship",
            "DateofCreation",
            "DateofJoining"
          ];

          data = result.data.array

          data.unshift(array);
          console.log("data", data);

          var fileName = 'SubscriberExcel.xlsx';

          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        }
      });
  }


  openDeletePopup(deletePopup: any, id: any) {
    // this.primarySubscriberId = id;
    if (id != "") {
      if (this.subsciberIds.indexOf(id) == -1) {
        this.subsciberIds.push(id)
      }
    }

    this.modalService.open(deletePopup, { centered: true, size: "lg" });
  }

  openCardPrintPopup(printPopup: any, id: any) {
    // this.primarySubscriberId = id;
    // if (id != "") {
    //   if (this.subsciberIdsForCard.indexOf(id) == -1) {
    //     this.subsciberIdsForCard.push(id)
    //   }
    // }
    if (id === 'ALL') {
      this.printAll = true;
    } else {
      this.printAll = false
    }

    this.modalService.open(printPopup, { centered: true, size: "lg" });
  }

  deleteManual(deletePopup, id) {
    this.openDeletePopup(deletePopup, id)
  }

  deleteSubscriberData() {
    const data = {
      subscriber_id: this.subsciberIds.length > 0 ? this.subsciberIds : '',
      user_id: this.userId
    };
    console.log("check all delete", data);

    this.insuranceSubscriber.deleteSubscriber(data).subscribe(
      (res: any) => {
        const decryptedData = this._coreService.decryptObjectData(
          JSON.parse(res)
        );
        if (decryptedData.status) {
          this._coreService.showSuccess(decryptedData.message, "Success");
          this.handleClose();
          this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  //Old One
  /*   printAllSubscribersData() {
      const param = {
        page: this.page,
        limit: 0,
        subscriber_name: this.subscriberNameFilter,
        subscriberTypeFilter: this.subscriberTypeFilter,
        user_id: this.userId,
      };
  
      this.insuranceSubscriber.getSubscriberList(param).subscribe((res: any) => {
        const decryptedData = this._coreService.decryptObjectData(
          JSON.parse(res)
        );
        this.totalLength = decryptedData.body.totalCount;
        let data = [];
        for (const value of decryptedData.body.data) {
  
  
          const uniqueHasCategories = new Set();
          const extractedPlanServices = [];
  
          for (const planService of value.plan_services) {
            if (!uniqueHasCategories.has(planService.has_category)) {
              extractedPlanServices.push({
                has_category: planService.has_category,
                services: [{
                  service: planService.service,
                  reimbursment_rate: planService.reimbursment_rate,
                  cat_in_limit: planService.in_limit.category_limit,
                  ser_in_limit: planService.in_limit.service_limit,
                  checkservice: planService.service,
                  checkcatgory: planService.has_category,
                  primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
                  primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
                }],
              });
  
              uniqueHasCategories.add(planService.has_category);
            } else {
              const existingObject = extractedPlanServices.find(obj => obj.has_category === planService.has_category);
  
              if (existingObject) {
                existingObject.services.push({
                  service: planService.service,
                  reimbursment_rate: planService.reimbursment_rate,
                  cat_in_limit: planService.in_limit.category_limit,
                  ser_in_limit: planService.in_limit.service_limit,
                  checkservice: planService.service,
                  checkcatgory: planService.has_category,
                  primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
                  primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
                });
              }
            }
          }
  
          var newPlanService1 = [];
          var k = 1;
          for (const planService of extractedPlanServices) {
  
            newPlanService1.push({
              checkservice: '',
              checkcatgory: planService.has_category,
              service: planService.has_category,
              cat_in_limit: planService.services[0].cat_in_limit,
              ser_in_limit: '',
              reimbursment_rate: '',
              primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
              primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
            })
            newPlanService1.push(...planService.services)
          }
  
          var newPlanService2 = [];
          var k = 1;
          for (const planServic11e of newPlanService1) {
            console.log(planServic11e, "planServic11e");
  
            if (this.isBackFieldExist(planServic11e.checkcatgory, planServic11e.checkservice)) {
              newPlanService2.push({ ...planServic11e, seq: k })
              if (planServic11e.checkservice == '') {
                k++
              }
            }
          }
  
  
          console.log("dateeeeeee", value);
          data.push({
            name: value.subscriber_full_name,
            uniqueId: value.unique,
            creationDate: value.createdAt,
            typeofinsurance: value.subscriber_type,
            insuranceholder:
              value.subscriber_type === "Individual"
                ? "Individual"
                : value.company_name,
            dateofbirth: value.date_of_birth,
            gender: value.gender,
            subscriptionisfor: value.subscription_for,
            insurance_id: value.insurance_id,
            employee_id: value.employee_id,
            healthplan: value.health_plan_for?.name,
            id: value._id,
            mobile: value.mobile,
            reimbursment_rate: value.reimbersement_rate,
            age: value.age,
            insurance_validity_to: value.insurance_validity_to,
            insurance_validity_from: value.insurance_validity_from,
            card_id: value.card_id,
            policy_id: value.policy_id,
            plan_services: newPlanService2,
            first_name: value.subscriber_first_name,
            middle_name: value.subscriber_middle_name,
            last_name: value.subscriber_last_name,
            totalCareLimitPrimSec: value.health_plan_for.total_care_limit.grand_total,
            subscriberImage: value.insurance_card_id_proof,
            dateofcreation: value.dateofcreation,
            is_active:value.is_active
          });
        }
  
  
        this.dataSource = data;
        this.combinedSubscribersInfo = this.dataSource
  
        console.log(this.dataSource, "check__recordddddddddd___");
        const combinedSubscribersInfoString = JSON.stringify(this.combinedSubscribersInfo);
        this.router.navigate(['/insurance/insurance-subscribers/card-review', btoa(combinedSubscribersInfoString)]);
        this.handleClose();
  
  
      });
  
    } */

  handleCheckBoxChange(event, medicineId) {
    console.log("check ids333", medicineId, this.subsciberIds);

    if (event.checked == true) {
      // console.log(this.subsciberIds?.push(medicineId), "check ids3334444");

      this.subsciberIds?.push(medicineId);
    } else {
      const index = this.subsciberIds?.indexOf(medicineId);
      console.log(index, "check ids3334444666");
      if (index > -1) {
        this.subsciberIds.splice(index, 1);
      }
    }
    console.log("check ids333", this.subsciberIds);

  }

  handleCheckBoxChangeForCardPrint(event, subscriber) {


    if (event.checked) {
      if (this.combinedSubscribersInfo.indexOf(subscriber.id) == -1) {
        this.combinedSubscribersInfo.push(subscriber.id)
      }
      if (subscriber.secondary_subscriber) {
        this.combinedSubscribersInfo = Array.from(new Set([...this.combinedSubscribersInfo, ...subscriber.secondary_subscriber]));
      }
    } else {
      if (this.combinedSubscribersInfo.indexOf(subscriber.id) != -1) {
        this.combinedSubscribersInfo.splice(this.combinedSubscribersInfo.indexOf(subscriber.id), 1);
      }
    }
    console.log(this.subsciberIdsForCard, "subsciberIdsForCardSeletce____", this.combinedSubscribersInfo);

  }

  handleCheckBoxChangeForSecondarySub(event, subscriber) {
    console.log(subscriber, "subscriber_____");
    if (event.checked) {
      if (!this.isSubscriberSelectedForSec(subscriber)) {
        this.secondarySubscriberInfo?.push(subscriber);
        this.combinedSubscribersInfo.push(subscriber);
      }
    } else {
      const index = this.secondarySubscriberInfo?.findIndex((selectedSubscriber) => selectedSubscriber.id === subscriber.id);
      if (index > -1) {
        this.secondarySubscriberInfo.splice(index, 1);
      }
      const index1 = this.combinedSubscribersInfo?.findIndex((selectedSubscriber) => selectedSubscriber.id === subscriber.id);
      if (index1 > -1) {
        this.combinedSubscribersInfo.splice(index1, 1);
      }
    }
    console.log(this.secondarySubscriberInfo, "secondarySubscriberInfoSeletce____", this.combinedSubscribersInfo);

  }

  isAllSelected() {
    let allSelected = false;
    if (this.subsciberIds?.length === this.dataSource?.length && this.subsciberIds?.length != 0) {
      allSelected = true;
    }
    return allSelected;
  }
  isAllSelectedToPrintCard() {
    let allSelected = false;
    if (this.subsciberIdsForCard?.length === this.dataSource?.length && this.subsciberIdsForCard?.length != 0) {
      allSelected = true;
    }
    return allSelected;
  }

  makeSelectAll(event: any) {
    if (event.checked == true) {
      // console.log(this.dataSource, "check ids");
      // console.log(this.subsciberIds, "check ids");
      const resultArray = this.data_Subscriber?.flatMap(item => item.secondary_subscriber);
      console.log(resultArray, "resultArray");
      this.subsciberIds = resultArray;
      this.dataSource?.map((element) => {


        if (this.subsciberIds?.indexOf(element?.id) == -1) {
          this.subsciberIds?.push(element?.id);
          // console.log(this.subsciberIds?.push(element?._id), "check ids");

        }
      });
      console.log(this.subsciberIds, "check ids");

    } else {
      this.subsciberIds = [];
    }
  }

  makeSelectAllForCard(event: any) {

    let data = [];
    if (event.checked) {
      this.dataSource?.forEach((element) => {
        this.handleCheckBoxChangeForCardPrint(event, element)
      });
    }
    else {
      this.combinedSubscribersInfo = [];
    }
  }

  isSecondarySelected(element: any): boolean {
    return this.selectAllSubscriberList.some(subscriber => subscriber.id === element.id);
  }

  isSubscriberSelected(subscriber: any): boolean {
    console.log("ssssssssssssssssssssssssssssssssssssssssssss", this.combinedSubscribersInfo?.some((selectedSubscriber) => selectedSubscriber === subscriber.id));

    return this.combinedSubscribersInfo?.some((selectedSubscriber) => selectedSubscriber === subscriber.id);
  }

  isSubscriberSelectedForSec(subscriber: any): boolean {
    return this.secondarySubscriberInfo?.some((selectedSubscriber) => selectedSubscriber.id === subscriber.id);
  }
  openInNewPage() {
    // Generate the route with base64-encoded parameter

    let sort = btoa(this.sortColumn + ":" + this.sortOrder)
    const route = ['/insurance/insurance-subscribers/card-review/', sort];

    // Create an anchor element
    const anchor = document.createElement('a');

    // Set the href attribute with the router link
    anchor.href = this.router.createUrlTree(route).toString();

    // Set the target attribute to open in a new tab or window
    anchor.target = '_blank';

    // Create and dispatch a click event to open the link
    const clickEvent = new MouseEvent('click');
    anchor.dispatchEvent(clickEvent);
  }

  // Usage
  async printSubscriberCard() {
    if (this.printAll === true) {
      localStorage.setItem("printCard", '')

      this.printAllSubscribersData();
      this.handleClose();

    } else {

      const combinedSubscribersInfoString = await JSON.stringify(this.combinedSubscribersInfo);
      localStorage.setItem("printCard", btoa(combinedSubscribersInfoString))

      this.openInNewPage();
      this.combinedSubscribersInfo = []
      this.handleClose();
    }
  }

  getPlanById(planId) {
    this._insuranceService.getPlanById(planId).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.planData = response.body;
      console.log(this.planData, "planDataaaaaa_______");

    });
  }

  getSelectedPlanHistory(planDetail: any, viewSubscribersPlanDetails: any) {
    this.closePopup();
    console.log("planDetaill______", planDetail);
    this.insuranceSubscriber.getSubscriberPlanDetails({ planHistoryId: planDetail._id }).subscribe((res: any) => {
      let decryptedData = this._coreService.decryptContext(JSON.parse(res));
      let response = decryptedData.body.subscriberHistoryDetails
      if (decryptedData.status) {
        this.planServicesData = response?.planService;
        this.planExclusionData = response?.palnExclusion;
      } else {
        this.planServicesData = [];
        this.planExclusionData = [];
      }
      this.getPlanById(planDetail.health_plan_for._id)
      console.log(response, "decryptedDataaaa_____", decryptedData);
      this.modalService.open(viewSubscribersPlanDetails, { centered: true, size: "xl" });
    })
  }

  handleDOCChange(type: string) {
    if (type === 'dateofcreation') {
      new Date(this.addSubscriberForm.controls['dateofcreation'].value)
    } else {
      new Date(this.addSubscriberForm.controls['dateofjoining'].value)
    }
  }

  handletoggleChange(subsciberId: any) {
    this.loader.start();
    let reqData = {
      subscriber_id: subsciberId,
    }
    this.insuranceSubscriber.active_deactive(reqData).subscribe(
      (res: any) => {

        let decryptedData = this._coreService.decryptContext((res));
        if (decryptedData.status == true) {
          this.loader.stop();
          this._coreService.showSuccess(decryptedData.message, "Success");
          this.getSubscriberList(`${this.sortColumn}:${this.sortOrder}`);
        }
      },
      (err) => {
        this.loader.stop();
        console.log(err);
      }
    );
  }

}
