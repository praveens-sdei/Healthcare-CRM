import { InsuranceService } from "./../../insurance.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { timeStamp } from "console";
import * as XLSX from "xlsx";
import { throws } from "assert";
import { CommonService } from "../../common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
// import { J } from "node_modules_2/@angular/cdk/keycodes";

export interface PeriodicElement {
  policyid: number;
  typeofinsurance: string;
  insuranceholder: string;
  healthplanname: string;
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
  healthplantype: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: "app-healthplanview",
  templateUrl: "./healthplanview.component.html",
  styleUrls: ["./healthplanview.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HealthplanviewComponent implements OnInit {
  displayedColumns: string[] = [
    // "policyid",
    // "typeofinsurance",
    // "insuranceholder",
    "createddate",
    "healthplanname",
    "reimbersmentrate",
    // "category",
    // "service",
    // "reimbursmentrate",
    // "servicelimit",
    // "repaymentcondition",
    // "categorylimit",
    // "categorycondition",
    // "preauthorization",
    // "waitingperiod",
    // "waitingperiodredeemed",
    "healthplantype",
    "action",
  ];

  dataSource: any;
  companyName: string = "";
  initialValue: any;
  initialValueactual: any;
  serviceForm: any = FormGroup;
  serviceFormactual: FormGroup;
  editForm!: FormGroup;
  isSubmitted: boolean = false;
  userId: any;
  planId: any;
  planServiceId: any;
  planExclusionId: any;
  get_active_categories: any;
  types_of_service: any[] = [];
  category_of_exclusions: any;
  related_category_of_exclusion_details: any[] = [];
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  searchText: any = "";
  isDefault: boolean = true;
  plan: any;
  services: any;
  exclusions: any;
  exclusionArray: any;
  modalReference: any;
  insuranceCompanyId: any;
  insPlanList: any;
  insPlanListActual: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;
  @ViewChild("TABLE") table: ElementRef;
  @ViewChild('edithealthplancontent') edithealthplancontent: ElementRef;

  id_for_delete: any;
  item_to_be_delete: any;
  remove_at_index: any;
  selectedFiles: any;
  selectfilename: any = "";
  selectedHealthPlan: any = "";
  defaultHealthPlan: any = "";
  selectedLabs: any = [];
  labId: any;
  innerMenuPremission: any = [];
  userRole: any;
  planID: any;
  healthPlanType: any = ""

  sortColumn: string = 'createdAt';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: InsuranceService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loader: NgxUiLoaderService
  ) {
    this.userRole = JSON.parse(localStorage.getItem("loginData")).role;

    this.serviceForm = this.fb.group({
      name: [""],
      plan_type: [""],
      description: ["", Validators.required],
      default: [true],
      primary_care_limit: ["", Validators.required],
      secondary_care_limit: ["", Validators.required],
      reimbursment_rate: ["", [Validators.pattern("^[0-99]*$"), Validators.required, Validators.max(100)]],
      contract_exclusion: [""],
      grand_total: ["", Validators.required],
      newService: this.fb.array([]),
      newExclusion: this.fb.array([]),
      company_name: "",
    });

    this.initialValue = this.serviceForm.value;

    this.serviceFormactual = this.fb.group({
      name: [""],
      plan_type: [""],
      description: [""],
      default: [false],
      primary_care_limit: ["", Validators.required],
      secondary_care_limit: ["", Validators.required],
      reimbursment_rate: ["", [Validators.pattern("^[0-99]*$"), Validators.required, Validators.max(100)]],
      contract_exclusion: [""],
      grand_total: ["", Validators.required],
      newService: this.fb.array([]),
      newExclusion: this.fb.array([]),
      company_name: "",
    });

    this.initialValueactual = this.serviceFormactual.value;

    this.editForm = this.fb.group({
      name: [""],
      plan_type: [""],
      description: [""],
      primary_care_limit: ["", Validators.required],
      secondary_care_limit: ["", Validators.required],
      grand_total: ["", Validators.required],
      newService: this.fb.array([]),
      newExclusion: this.fb.array([]),
      reimbursment_rate: ["", [Validators.pattern("^[0-99]*$"), Validators.required, Validators.max(100)]],
      contract_exclusion: [""],
    });

    this.userId = commonService.getLoggeduserId();
    this.insuranceCompanyId = commonService.getInsuranceCompanyID();

    // this.checkInnerPermission();

    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
  }
  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.listPlan("", `${column}:${this.sortOrder}`);
  }
  ngAfterViewInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log("NEW PARAM________________", params);

      this.planID = params;
    })

    if (this.planID.planId) {
      this.openVerticallyCenteredEditplan(this.edithealthplancontent, this.planID.planId)

    }

  }

  ngOnInit(): void {


    this.addNewService();
    this.addNewServiceactual();

    this.addNewExclusion();
    this.addNewExclusionactual();
    this.addNewEditService();
    this.addNewEditExclusion();
    this.listPlan("", `${this.sortColumn}:${this.sortOrder}`);
    this.getCategoryList();
    this.getCategoryExclusionList();

    // console.log(this.types_of_service);
    // console.log(this.related_category_of_exclusion_details);
    // setTimeout(() => {
    //   this.checkInnerPermission();
    // }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission() {
    console.log("checkSubmenu---");
    let userPermission = this._coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    console.log("checkSubmenu---", userPermission, menuID);
    let checkData = this.findObjectByKey(userPermission, "parent_id", menuID)
    console.log("checkSubmenu---", checkData);

    if (checkData) {
      if (checkData.isChildKey == true) {

        var checkSubmenu = checkData.submenu;

        console.log("checkSubmenu---", checkSubmenu);


        if (checkSubmenu.hasOwnProperty("health-plan")) {

          this.innerMenuPremission = checkSubmenu['health-plan'].inner_menu;


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
      console.log("this.innerMenuPremission----------", this.innerMenuPremission);
    }




  }

  giveInnerPermission(value) {    return new Promise((resolve, reject) => {
      // setTimeout(() => {
        if (this.userRole === 'INSURANCE_STAFF') {
          const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
          // console.log("checkRequest__________", checkRequest)
          resolve(checkRequest ? checkRequest.status : false);
        } else {
          resolve(true);
        }
      // }, 1000);
    });
  }

  handlePlansExport() {
    console.log("Service Exported");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, "PlanList.xlsx");
  }

  listPlan(planType: any = "", sort: any = '') {
    console.log("USer Id", this.userId);
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      plan_type: planType === 'true' ? true : planType === 'false' ? false : '',
      sort: sort
    };
    console.log("LIST PLAN REQUEST=====>", reqData)
    this.service.listPlan(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("All Plans--->", response.body.result);
      this.totalLength = response.body.totalRecords;
      this.dataSource = response.body.result;
    });
  }

  listPlanDefault(planType: any) {
    console.log()
    let reqData = {
      userId: this.userId,
      plan_type: true,
      page: 1,
      limit: 0,
      searchText: "",
    };
    this.service.listPlan(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("All Plans--->", response.body.result);
      this.insPlanList = response.body.result;
    });
  }

  listPlanActual(planType: any) {
    let reqData = {
      userId: this.userId,
      plan_type: '',
      page: 1,
      limit: 0,
      searchText: "",
    };
    this.service.listPlan(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("All Plans--->", response.body.result);
      this.insPlanListActual = response.body.result;
    });
  }

  getHealthPlan(event: any) {
    this.listPlan(event.value);
    this.healthPlanType = event.value
    this.selectedHealthPlan = event.value;
  }



  areRowsEqual(row1, row2) {
    // Compare the fields of two rows and check if they are not the same.
    return row1.field1 !== row2.field1 || row1.field2 !== row2.field2;
  }

  checkFormArray() {


    // All rows are the same, you can continue with your desired logic.
    console.log('All rows are the same, continue with your work.');
  }

  addPlan(companyName) {
    // debugger;
    console.log("Default", this.isDefault);
    if (!companyName.value) {
      alert("Enter Plan Name");
      return;
    }
    console.log(companyName.value);

    let data;

    if (this.isDefault) {
      data = this.serviceForm.value;
    } else {
      data = this.serviceFormactual.value;
    }

    let rate = parseInt(data?.reimbursment_rate);
    let planData = {
      name: companyName.value.trim(),
      description: data.description ? data.description.trim() : "",
      plan_type: this.isDefault === true ? "default" : "actual",
      total_care_limit: {
        primary_care_limit: data.primary_care_limit,
        secondary_care_limit: data.secondary_care_limit,
        grand_total: data.grand_total,
      },
      for_user: this.insuranceCompanyId,
      added_by: this.userId,
      reimbursment_rate: rate,
      contract_exclusion: data?.contract_exclusion.trim(),
    };

    console.log("REQUEST DATA====>", planData);


    if (this.isDefault) {
      var errors = [];
      for (let i = 0; i < this.serviceForm.value.newService.length - 1; i++) {
        for (let j = i + 1; j < this.serviceForm.value.newService.length; j++) {
          console.log(this.serviceForm.value.newService[i].category_of_service, "this.serviceForm.value.newService[i].category_of_service");

          if (this.serviceForm.value.newService[i].category_of_service == this.serviceForm.value.newService[j].category_of_service) {
            if (this.serviceForm.value.newService[i].category_limit != this.serviceForm.value.newService[j].category_limit || this.serviceForm.value.newService[i].category_condition != this.serviceForm.value.newService[j].category_condition || this.serviceForm.value.newService[i].primary_and_secondary_category_limit != this.serviceForm.value.newService[j].primary_and_secondary_category_limit) {
              console.log(this.serviceForm.value.newService[i].category_limit, "kkkkkkkk", i, "this.serviceForm.value.newService[i].category_limit", this.serviceForm.value.newService[j].category_limit, "kkkkkkkk", j);
              console.log(this.serviceForm.value.newService[i].category_condition, "kkkkkkkk", i, "this.serviceForm.value.newService[i].category_condition", this.serviceForm.value.newService[j].category_condition, "kkkkkkkk", j);
              if (errors.indexOf(`All row of the category of service (${this.serviceForm.value.newService[i].category_of_service}), values should be same for four fields(category conditon, categroy limit and primary and secondary category and service limit)`) == -1) {
                errors.push(`All row of the category of service (${this.serviceForm.value.newService[i].category_of_service}), values should be same for four fields(category conditon, categroy limit and primary and secondary category and service limit)`);
              }
            }
          }
        }
      }

      console.log(errors, "check errors");

      if (errors.length > 0) {
        const commaSeparatedString = errors.join(', ');

        this.toastr.error(commaSeparatedString);
        return;
      }
    } else {
      var errors = [];
      for (let i = 0; i < this.serviceFormactual.value.newService.length - 1; i++) {
        for (let j = i + 1; j < this.serviceFormactual.value.newService.length; j++) {
          console.log(this.serviceFormactual.value.newService[i].category_of_service, "this.serviceFormactual.value.newService[i].category_of_service");

          if (this.serviceFormactual.value.newService[i].category_of_service == this.serviceFormactual.value.newService[j].category_of_service) {
            if (this.serviceFormactual.value.newService[i].category_limit != this.serviceFormactual.value.newService[j].category_limit || this.serviceFormactual.value.newService[i].category_condition != this.serviceFormactual.value.newService[j].category_condition || this.serviceFormactual.value.newService[i].primary_and_secondary_category_limit != this.serviceFormactual.value.newService[j].primary_and_secondary_category_limit) {
              console.log(this.serviceFormactual.value.newService[i].category_limit, "kkkkkkkk", i, "this.serviceFormactual.value.newService[i].category_limit", this.serviceFormactual.value.newService[j].category_limit, "kkkkkkkk", j);
              console.log(this.serviceFormactual.value.newService[i].category_condition, "kkkkkkkk", i, "this.serviceFormactual.value.newService[i].category_condition", this.serviceFormactual.value.newService[j].category_condition, "kkkkkkkk", j);
              if (errors.indexOf(`All row of the category of service (${this.serviceFormactual.value.newService[i].category_of_service}), values should be same for four fields(category conditon, categroy limit and primary and secondary category and service limit)`) == -1) {
                errors.push(`All row of the category of service (${this.serviceFormactual.value.newService[i].category_of_service}), values should be same for four fields(category conditon, categroy limit and primary and secondary category and service limit)`);
              }
            }
          }
        }
      }

      console.log(errors, "checkeerrors_____");

      if (errors.length > 0) {
        const commaSeparatedString = errors.join(', ');

        this.toastr.error(commaSeparatedString);
        return;
      }
    }
    this.loader.start();

    this.service.addPlan(planData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        let servicesArray = [];
        if (this.isDefault) {

          for (let data of this.serviceForm.value.newService) {
            console.log(data);
            let obj = {
              reimbursment_rate: data.reimbursment_rate,
              in_limit: {
                service_limit: data.service_limit,
                category_limit: data.category_limit,
              },
              has_conditions: {
                repayment_condition: {
                  max_no: data.repayment_condition_max,
                  unit_no: data.repayment_condition_for,
                  unit: data.repayment_condition_unit,
                },

                category_condition: data.category_condition,
              },
              pre_authorization: data.pre_authorization == "yes" ? true : false,
              waiting_period: {
                duration: {
                  min_no: data.waiting_period_max,
                  unit: data.waiting_period_unit,
                },
                redeemed: data.waiting_period_redeemed,
              },
              has_category: data.category_of_service,
              primary_and_secondary_category_limit: data.primary_and_secondary_category_limit,
              service: data.type_of_service,
              primary_and_secondary_service_limit: data.primary_and_secondary_service_limit,
              comment: data.comment,
              service_code: data.service_code,
              total_max_duration_in_days: data.total_max_duration_in_days,
              max_extend_duration_in_days: data.max_extend_duration_in_days,
            };

            servicesArray.push(obj);
          }
          this.loader.stop();
        } else {

          for (let data of this.serviceFormactual.value.newService) {
            console.log(data);
            let obj = {
              reimbursment_rate: data.reimbursment_rate,
              in_limit: {
                service_limit: data.service_limit,
                category_limit: data.category_limit,
              },
              has_conditions: {
                repayment_condition: {
                  max_no: data.repayment_condition_max,
                  unit_no: data.repayment_condition_for,
                  unit: data.repayment_condition_unit,
                },

                category_condition: data.category_condition,
              },
              pre_authorization: data.pre_authorization == "yes" ? true : false,
              waiting_period: {
                duration: {
                  min_no: data.waiting_period_max,
                  unit: data.waiting_period_unit,
                },
                redeemed: data.waiting_period_redeemed,
              },
              has_category: data.category_of_service,
              primary_and_secondary_category_limit: data.primary_and_secondary_category_limit,
              service: data.type_of_service,
              primary_and_secondary_service_limit: data.primary_and_secondary_service_limit,
              comment: data.comment,
              service_code: data.service_code,
              total_max_duration_in_days: data.total_max_duration_in_days,
              max_extend_duration_in_days: data.max_extend_duration_in_days,
            };

            servicesArray.push(obj);
            this.loader.stop();
          }
        }

        let serviceData = {
          services: servicesArray,
          for_user: this.userId,
          for_plan: response.body._id,
          addedBy: this.userId
        };

        console.log("Service Data====>", serviceData);

        this.service.addPlanService(serviceData).subscribe(
          (res) => {
            let encryptedData = { data: res };
            let serviceResponse =
              this._coreService.decryptObjectData(encryptedData);
            if (serviceResponse.status) {
              let exclusionArray = [];

              if (this.isDefault) {

                for (let data of this.serviceForm.value.newExclusion) {
                  // console.log(data);
                  let obj = {
                    in_exclusion: {
                      category: data.exclusion,
                      name: data.in_exclusion,
                      brand: data.brand_name,
                      comment: data.comment,
                    },
                  };

                  exclusionArray.push(obj);
                }

              } else {
                for (let data of this.serviceFormactual.value.newExclusion) {
                  console.log(data);
                  let obj = {
                    in_exclusion: {
                      category: data.exclusion,
                      name: data.in_exclusion,
                      brand: data.brand_name,
                      comment: data.comment,
                    },
                  };

                  exclusionArray.push(obj);
                }
              }


              this.loader.stop();
              let exclusionData = {
                exclusions: exclusionArray,
                for_user: this.userId,
                for_plan: response.body._id,
              };

              console.log("Exclusion Data", exclusionData);

              this.service.addPlanExclusion(exclusionData).subscribe((res) => {
                let encryptedData = { data: res };
                let exclusionResponse =
                  this._coreService.decryptObjectData(encryptedData);
                if (exclusionResponse.status) {
                  this.toastr.success(response.message);
                  this.listPlan();
                  this.closePopup();
                  this.loader.stop();
                } else {
                  this.toastr.error(response.message);
                }
                console.log("Exclusion Plan", exclusionResponse);
              });
            } else {
              this.toastr.error(response.message);
            }
            console.log("Plann service", serviceResponse);
          },
          (err) => {
            let errResponse = this._coreService.decryptObjectData({
              data: err.error,
            });
            this.toastr.error(errResponse.message);
          }
        );
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  handleUpdatePlan() {
    this.isSubmitted = true
    if (!this.editForm.valid) {
      this.toastr.error("Please fill all the mandetory fields");
      return
    }
    this.loader.start();
    console.log("Default", this.isDefault);
    let data = this.editForm.value;
    let rate = parseInt(data?.reimbursment_rate);
    let planData = {
      name: data.name,
      description: data.description ? data.description : '',
      plan_type: "actual",
      total_care_limit: {
        primary_care_limit: data.primary_care_limit,
        secondary_care_limit: data.secondary_care_limit,
        grand_total: data.grand_total,
      },
      planId: this.planId,
      reimbursment_rate: rate,
      contract_exclusion: data?.contract_exclusion,
    };

    console.log("plan updtae data", planData);

    var errors = [];
    for (let i = 0; i < this.editForm.value.newService.length - 1; i++) {
      for (let j = i + 1; j < this.editForm.value.newService.length; j++) {
        console.log(this.editForm.value.newService[i].category_of_service, "this.editForm.value.newService[i].category_of_service", this.editForm.value.newService[j].category_of_service);

        if (this.editForm.value.newService[i].category_of_service == this.editForm.value.newService[j].category_of_service) {
          if (this.editForm.value.newService[i].category_limit != this.editForm.value.newService[j].category_limit || this.editForm.value.newService[i].category_condition != this.editForm.value.newService[j].category_condition || this.editForm.value.newService[i].primary_and_secondary_category_limit != this.editForm.value.newService[j].primary_and_secondary_category_limit) {
            console.log(this.editForm.value.newService[i].category_limit, "kkkkkkkk", i, "this.editForm.value.newService[i].category_limit", this.editForm.value.newService[j].category_limit, "kkkkkkkk", j);
            console.log(this.editForm.value.newService[i].category_condition, "kkkkkkkk", i, "this.editForm.value.newService[i].category_condition", this.editForm.value.newService[j].category_condition, "kkkkkkkk", j);
            if (errors.indexOf(`All row of the category of service (${this.editForm.value.newService[i].category_of_service}), values should be same for four fields(category conditon, categroy limit and Primary and Secondary category and service limit)`) == -1) {
              errors.push(`All row of the category of service (${this.editForm.value.newService[i].category_of_service}), values should be same for four fields(category conditon, categroy limit and Primary and Secondary category and service limit)`);
            }
          }
        }
      }
    }

    console.log(errors, "check errors");

    if (errors.length > 0) {
      const commaSeparatedString = errors.join(', ');

      this.toastr.error(commaSeparatedString);
      return;
    }

    this.service.updatePlan(planData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("data Plan", response);
      if (response.status) {
        this.loader.stop();
        let servicesArray = [];

        for (let data of this.editForm.value.newService) {
          console.log(data);
          let obj = {
            reimbursment_rate: data.reimbursment_rate,
            in_limit: {
              service_limit: data.service_limit,
              category_limit: data.category_limit,
            },
            has_conditions: {
              repayment_condition: {
                max_no: data.repayment_condition_max,
                unit_no: data.repayment_condition_for,
                unit: data.repayment_condition_unit,
              },

              category_condition: data.category_condition,
            },
            pre_authorization: data.pre_authorization == "yes" ? true : false,
            waiting_period: {
              duration: {
                min_no: data.waiting_period_max,
                unit: data.waiting_period_unit,
              },
              redeemed: data.waiting_period_redeemed,
            },
            has_category: data.category_of_service.trim(),
            primary_and_secondary_category_limit: data.primary_and_secondary_category_limit,
            service: data.type_of_service.trim(),
            primary_and_secondary_service_limit: data.primary_and_secondary_service_limit,
            comment: data.comment.trim(),
            service_code: data.service_code.trim(),
            total_max_duration_in_days: data.total_max_duration_in_days,
            max_extend_duration_in_days: data.max_extend_duration_in_days,
          };

          servicesArray.push(obj);
        }

        let serviceData = {
          services: servicesArray,
          for_user: this.userId,
          for_plan: response.body._id,
        };

        console.log("Service Data", serviceData);

        this.service.addPlanService(serviceData).subscribe((res) => {
          let encryptedData = { data: res };
          let serviceResponse =
            this._coreService.decryptObjectData(encryptedData);
          if (serviceResponse.status) {
            let exclusionArray = [];

            for (let data of this.editForm.value.newExclusion) {
              console.log(data);
              let obj = {
                in_exclusion: {
                  category: data.exclusion.trim(),
                  name: data.in_exclusion.trim(),
                  brand: data.brand_name,
                  comment: data.comment,
                },
              };

              exclusionArray.push(obj);
            }

            let exclusionData = {
              exclusions: exclusionArray,
              for_user: this.userId,
              for_plan: response.body._id,
            };

            console.log("Exclusion Data", exclusionData);

            this.service.addPlanExclusion(exclusionData).subscribe((res) => {
              let encryptedData = { data: res };
              let exclusionResponse =
                this._coreService.decryptObjectData(encryptedData);
              if (exclusionResponse.status) {
                this.toastr.success(response.message);
                this.listPlan();
                this.closePopup();
              } else {
                this.toastr.error(response.message);
              }
              console.log("Exclusion Plan", exclusionResponse);
            });
          } else {
            this.toastr.error(response.message);
          }
          console.log("Plann service", serviceResponse);
        });
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  getCategoryList() {
    let reqData = {
      // insuranceId: "638494dfb9f95074fec812a4",
      insuranceId: this.userId,
    };

    this.service.listCategoryForInsurance(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("Category Listing--->", response);
      this.get_active_categories = response.body;
    });
  }

  handleCategorySelectChange(event: any, i: any) {
    if (event.value) {
      this.getRelatedTypeOfService(event.value, i);
    }
  }

  getRelatedTypeOfService(in_category: any, index: any) {
    let reqData = {
      // insuranceId: "638494dfb9f95074fec812a4",
      insuranceId: this.userId,
      categoryId: in_category,
    };

    this.service.listCategoryServiceForInsurance(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("Related Types Of Services--->", response);
      this.types_of_service[index] = response.body;
    });
  }

  getCategoryExclusionList() {
    let reqData = {
      // insuranceId: "638494dfb9f95074fec812a4",
      insuranceId: this.userId,
    };

    this.service.listExclusionForInsurance(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("Exclusion Listing----->", response);
      this.category_of_exclusions = response.body;
    });
  }

  handleSelectExclusionChange(event: any, j: any) {
    if (event.value) {
      this.getRelatedExclusion(event.value, j);
    }
  }

  getRelatedExclusion(in_eclusion: any, index: any) {
    let reqData = {
      // insuranceId: "638494dfb9f95074fec812a4",
      insuranceId: this.userId,
      exclusionId: in_eclusion,
    };

    this.service.listExclusionDetailsForInsurance(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      this.related_category_of_exclusion_details[index] = response.body;
    });
  }

  async handleDefaultPlanSelect(event: any, checkdefault: boolean) {
    console.log(event);

    this.isDefault = false;

    this.types_of_service = [];
    this.isDefault = false;
    this.related_category_of_exclusion_details = [];
    if (event.value !== "new") {
      this.isDefault = true;
      let reqData = {
        page: 1,
        limit: 1000,
        planId: event.value,
      };

      if (checkdefault) {
        this.subServiceForms.clear();
        this.subExclucionForms.clear();

        await this.service.getPlanById(event.value).subscribe((res) => {
          let encryptedData = { data: res };
          let response = this._coreService.decryptObjectData(encryptedData);
          console.log("Get plan by id", response);
          let plan = response.body;

          this.serviceForm.patchValue({
            description: plan.description,
            name: plan.name,
            primary_care_limit: plan.total_care_limit?.primary_care_limit,
            secondary_care_limit: plan.total_care_limit?.secondary_care_limit,
            grand_total: plan.total_care_limit?.grand_total,
            reimbursment_rate: plan?.reimbursment_rate,
            contract_exclusion: plan?.contract_exclusion,
          });
        });

        await this.service.listPlanServices(reqData).subscribe((res) => {
          let encryptedData = { data: res };
          let response = this._coreService.decryptObjectData(encryptedData);
          let services = response.body.result;
          console.log("Plan related services", services);
          let serviceArray = [];

          for (const { index, service } of services.map((service, index) => ({
            index,
            service,
          }))) {
            console.log("Plan related service bolte", service);

            this.addNewService();
            this.getRelatedTypeOfService(
              service?.has_category?.in_category?._id,
              index
            );
            let obj = {
              category_of_service: service?.has_category,
              primary_and_secondary_category_limit: service?.primary_and_secondary_category_limit,
              type_of_service: service?.service,
              primary_and_secondary_service_limit: service?.primary_and_secondary_service_limit,
              reimbursment_rate: service?.reimbursment_rate,
              pre_authorization: service?.pre_authorization ? "yes" : "no",
              service_limit: service.in_limit?.service_limit,
              category_limit: service.in_limit?.category_limit,
              repayment_condition_max:
                service.has_conditions?.repayment_condition.max_no,
              repayment_condition_for:
                service.has_conditions?.repayment_condition.unit_no,
              repayment_condition_unit:
                service.has_conditions?.repayment_condition.unit,
              category_condition: service.has_conditions?.category_condition,
              waiting_period_max: service.waiting_period?.duration.min_no,
              waiting_period_unit: service.waiting_period?.duration.unit,
              waiting_period_redeemed: service.waiting_period?.redeemed,
              comment: service.comment,
              service_code: service.service_code,
              total_max_duration_in_days: service.total_max_duration_in_days,
              max_extend_duration_in_days: service.max_extend_duration_in_days,
            };
            serviceArray.push(obj);
          }

          this.serviceForm.patchValue({
            newService: serviceArray,
          });
        });

        await this.service.listPlanExclusions(reqData).subscribe((res) => {
          let encryptedData = { data: res };
          let response = this._coreService.decryptObjectData(encryptedData);
          let exclusions = response.body.result;
          console.log("Plan related exclusions response", response);

          let exclusionArray = [];
          if (exclusions.length === 0) {
            this.addNewExclusion();
          }

          for (const { index, exclusion } of exclusions.map(
            (exclusion, index) => ({ index, exclusion })
          )) {
            this.addNewExclusion();
            console.log("Related Exclusion single", exclusion);
            // this.getRelatedExclusion(
            //   exclusion.in_exclusion?.in_exclusion?._id,
            //   index
            // );
            let obj = {
              exclusion: exclusion.in_exclusion?.category,
              in_exclusion: exclusion.in_exclusion?.name,
              brand_name: exclusion.in_exclusion?.brand,
              comment: exclusion.in_exclusion?.comment,
            };
            exclusionArray.push(obj);
          }
          this.serviceForm.patchValue({
            newExclusion: exclusionArray,
          });
        });
      } else {
        this.subServiceFormsactual.clear();
        this.subExclucionFormsactual.clear();
        await this.service.getPlanById(event.value).subscribe((res) => {
          let encryptedData = { data: res };
          let response = this._coreService.decryptObjectData(encryptedData);
          console.log("Get plan by id", response);
          let plan = response.body;

          this.serviceFormactual.patchValue({
            description: plan.description,
            name: plan.name,
            primary_care_limit: plan.total_care_limit?.primary_care_limit,
            secondary_care_limit: plan.total_care_limit?.secondary_care_limit,
            grand_total: plan.total_care_limit?.grand_total,
            reimbursment_rate: plan?.reimbursment_rate,
            contract_exclusion: plan?.contract_exclusion,
          });
        });

        await this.service.listPlanServices(reqData).subscribe((res) => {
          let encryptedData = { data: res };
          let response = this._coreService.decryptObjectData(encryptedData);
          let services = response.body.result;
          console.log("Plan related services", services);
          let serviceArray = [];

          for (const { index, service } of services.map((service, index) => ({
            index,
            service,
          }))) {
            console.log("Plan related service bolte", service);

            this.addNewServiceactual();
            this.getRelatedTypeOfService(
              service?.has_category?.in_category?._id,
              index
            );
            let obj = {
              category_of_service: service?.has_category,
              primary_and_secondary_category_limit: service?.primary_and_secondary_category_limit,
              type_of_service: service?.service,
              primary_and_secondary_service_limit: service?.primary_and_secondary_service_limit,
              reimbursment_rate: service?.reimbursment_rate,
              pre_authorization: service?.pre_authorization ? "yes" : "no",
              service_limit: service.in_limit?.service_limit,
              category_limit: service.in_limit?.category_limit,
              repayment_condition_max:
                service.has_conditions?.repayment_condition.max_no,
              repayment_condition_for:
                service.has_conditions?.repayment_condition.unit_no,
              repayment_condition_unit:
                service.has_conditions?.repayment_condition.unit,
              category_condition: service.has_conditions?.category_condition,
              waiting_period_max: service.waiting_period?.duration.min_no,
              waiting_period_unit: service.waiting_period?.duration.unit,
              waiting_period_redeemed: service.waiting_period?.redeemed,
              comment: service.comment,
              service_code: service.service_code,
              total_max_duration_in_days: service.total_max_duration_in_days,
              max_extend_duration_in_days: service.max_extend_duration_in_days,
            };
            serviceArray.push(obj);
          }

          this.serviceFormactual.patchValue({
            newService: serviceArray,
          });
        });

        await this.service.listPlanExclusions(reqData).subscribe((res) => {
          let encryptedData = { data: res };
          let response = this._coreService.decryptObjectData(encryptedData);
          let exclusions = response.body.result;
          console.log("Plan related exclusions response", response);

          let exclusionArray = [];
          if (exclusions.length === 0) {
            this.addNewExclusionactual();
          }

          for (const { index, exclusion } of exclusions.map(
            (exclusion, index) => ({ index, exclusion })
          )) {
            this.addNewExclusionactual();
            console.log("Related Exclusion single", exclusion);
            // this.getRelatedExclusion(
            //   exclusion.in_exclusion?.in_exclusion?._id,
            //   index
            // );
            let obj = {
              exclusion: exclusion.in_exclusion?.category,
              in_exclusion: exclusion.in_exclusion?.name,
              brand_name: exclusion.in_exclusion?.brand,
              comment: exclusion.in_exclusion?.comment,
            };
            exclusionArray.push(obj);
          }
          this.serviceFormactual.patchValue({
            newExclusion: exclusionArray,
          });
        });
      }
    } else {
      this.serviceForm.reset();
      this.subServiceForms.clear();
      this.subExclucionForms.clear();
      this.serviceFormactual.reset();
      this.addNewService();
      this.addNewExclusion();
    }
  }

  handleExclusionDetailSelection(data: any, index: any, string: any) {
    //to pre-populate brand name and comment in exclusion
    console.log(data, index);
    if (string === "add") {
      this.subExclucionForms.at(index).patchValue({
        brand_name: data?.brand_name,
        comment: data?.comment,
      });
    }
    if (string === "edit") {
      this.subEditExclucionForms.at(index).patchValue({
        brand_name: data?.brand_name,
        comment: data?.comment,
      });
    }
  }

  handleSelectExclusionForEdit(data) {
    console.log(data);
    this.editForm.patchValue({
      newExclusion: [data],
    });
  }

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    this.listPlan(this.selectedHealthPlan);
  }

  closePopup() {
    this.serviceForm.reset();
    this.subServiceForms.clear();
    this.subExclucionForms.clear();
    this.editForm.reset();
    this.modalService.dismissAll("close");
    this.addNewService();
    this.addNewServiceactual();
    this.addNewExclusion();
    this.addNewExclusionactual();
    this.types_of_service = [];
    this.related_category_of_exclusion_details = [];
    this.isSubmitted = false;
    this.selectedFiles = "";
    this.selectfilename = "";
    this.router.navigate([`/insurance/insurance-healthplan`])
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.listPlan(this.healthPlanType);
  }

  validateService(index) {
    let form = this.serviceForm.get("newService") as FormArray;
    const formGroup = form.controls[index] as FormGroup;
    return formGroup;
  }

  newServiceForm(): FormGroup {
    return this.fb.group({
      total_max_duration_in_days: ["", [Validators.required]],
      max_extend_duration_in_days: ["", [Validators.required]],
      service_code: ["", [Validators.required]],
      category_of_service: ["", [Validators.required]],
      primary_and_secondary_category_limit: ["", [Validators.required]],
      category_limit: [
        "",
        [Validators.required, Validators.pattern("^([0-9]*)(.[[0-9]+]?)?$")],
      ],
      category_condition: ["", [Validators.required]],
      type_of_service: ["", [Validators.required]],
      primary_and_secondary_service_limit: ["", [Validators.required]],
      service_limit: ["", [Validators.required]],
      repayment_condition_max: ["", [Validators.required]],
      repayment_condition_for: ["", [Validators.required]],
      repayment_condition_unit: ["", [Validators.required]],
      pre_authorization: ["", [Validators.required]],
      waiting_period_max: ["", [Validators.required]],
      waiting_period_unit: ["", [Validators.required]],
      waiting_period_redeemed: ["", [Validators.required]],
      reimbursment_rate: ["", [Validators.pattern("^[0-99]*$"), Validators.required, Validators.max(100)]],
      comment: ["", [Validators.required]],
    });
  }

  newExclusionForm(): FormGroup {
    return this.fb.group({
      exclusion: ["", [Validators.required]],
      in_exclusion: ["", [Validators.required]],
      brand_name: [""],
      comment: [""],
    });
  }

  get subServiceForms(): FormArray {
    return this.serviceForm.get("newService") as FormArray;
  }

  get subServiceFormsactual(): FormArray {
    return this.serviceFormactual.get("newService") as FormArray;
  }

  get subExclucionForms(): FormArray {
    return this.serviceForm.get("newExclusion") as FormArray;
  }
  get subExclucionFormsactual(): FormArray {
    return this.serviceFormactual.get("newExclusion") as FormArray;
  }

  addNewService() {
    this.subServiceForms.push(this.newServiceForm());
  }
  addNewServiceactual() {
    this.subServiceFormsactual.push(this.newServiceForm());
  }
  addNewServiceByExcel(row: any) {
    console.log("geet by excel", row);

    // this.serviceForm.controls['newService'].patchValue({
    //   row
    // });
  }

  addNewExclusion() {
    this.subExclucionForms.push(this.newExclusionForm());
  }

  addNewExclusionactual() {
    this.subExclucionFormsactual.push(this.newExclusionForm());
  }

  removeService(i: number) {
    console.log("formindex", i);
    this.subServiceForms.removeAt(i);
    this.types_of_service.splice(i, 1);
  }

  removeExclusion(j: number) {
    this.subExclucionForms.removeAt(j);
    this.related_category_of_exclusion_details.splice(j, 1);
  }
  removeServiceactual(i: number) {
    console.log("formindex", i);
    this.subServiceFormsactual.removeAt(i);
    this.types_of_service.splice(i, 1);
  }

  removeExclusionactual(j: number) {
    this.subExclucionFormsactual.removeAt(j);
    this.related_category_of_exclusion_details.splice(j, 1);
  }

  //---------------------------------
  newEditServiceForm(): FormGroup {
    return this.fb.group({
      total_max_duration_in_days: ["", [Validators.required]],
      max_extend_duration_in_days: ["", [Validators.required]],
      service_code: ["", [Validators.required]],
      category_of_service: ["", [Validators.required]],
      primary_and_secondary_category_limit: ["", [Validators.required]],
      category_limit: ["", [Validators.required]],
      category_condition: ["", [Validators.required]],
      type_of_service: ["", [Validators.required]],
      primary_and_secondary_service_limit: ["", [Validators.required]],
      service_limit: ["", [Validators.required]],
      repayment_condition_max: ["", [Validators.required]],
      repayment_condition_for: ["", [Validators.required]],
      repayment_condition_unit: ["", [Validators.required]],
      pre_authorization: ["", [Validators.required]],
      waiting_period_max: ["", [Validators.required]],
      waiting_period_unit: ["", [Validators.required]],
      waiting_period_redeemed: ["", [Validators.required]],
      reimbursment_rate: ["", [Validators.pattern("^[0-99]*$"), Validators.required, Validators.max(100)]],
      comment: ["", [Validators.required]],
    });
  }

  newEditExclusionForm(): FormGroup {
    return this.fb.group({
      exclusion: ["", [Validators.required]],
      in_exclusion: ["", [Validators.required]],
      brand_name: [""],
      comment: [""],
    });
  }

  get subEditServiceForms(): FormArray {
    return this.editForm.get("newService") as FormArray;
  }

  get subEditExclucionForms(): FormArray {
    return this.editForm.get("newExclusion") as FormArray;
  }

  addNewEditService() {
    this.subEditServiceForms.push(this.newEditServiceForm());
  }
  get editFormFormControl(): { [key: string]: AbstractControl } {
    // console.log(this.loginForm.controls);
    return this.editForm.controls;
  }
  addNewEditExclusion() {
    this.subEditExclucionForms.push(this.newEditExclusionForm());
  }

  removeEditService(i: number) {
    this.subEditServiceForms.removeAt(i);

    this.types_of_service.splice(i, 1);
  }

  removeEditExclusion(j: number) {
    this.subEditExclucionForms.removeAt(j);

    this.related_category_of_exclusion_details.splice(j, 1);
  }

  //  Edit plan modal
  async openVerticallyCenteredEditplan(
    edithealthplancontent: any,
    planId: any
  ) {
    console.log(this.edithealthplancontent, "EDIT______________", planId);
    this.planId = planId;
    // this.planServiceId = data._id;
    this.planExclusionId = "";

    await this.subEditServiceForms.clear();
    await this.subEditExclucionForms.clear();

    let reqData = {
      page: 1,
      limit: 1000,
      planId: planId, //plan_id
    };

    await this.service.getPlanById(planId).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      let plan = response.body;
      console.log("Get plan by id", plan);
      this.editForm.patchValue({
        name: plan?.name,
        description: plan?.description,
        primary_care_limit: plan.total_care_limit?.primary_care_limit,
        secondary_care_limit: plan.total_care_limit?.primary_care_limit,
        grand_total: plan.total_care_limit?.grand_total,
        reimbursment_rate: plan?.reimbursment_rate,
        contract_exclusion: plan?.contract_exclusion,
      });
    });

    await this.service.listPlanServices(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      let services = response.body.result;
      console.log("Plan related services", services);
      let serviceArray = [];

      for (const { index, service } of services.map((service, index) => ({
        index,
        service,
      }))) {
        this.addNewEditService();
        // this.getRelatedTypeOfService(
        //   service?.has_category?.in_category?._id,
        //   index
        // );

        let obj = {
          // planServiceId: service._id,
          category_of_service: service?.has_category,
          primary_and_secondary_category_limit: service?.primary_and_secondary_category_limit,
          type_of_service: service?.service,
          primary_and_secondary_service_limit: service?.primary_and_secondary_service_limit,
          reimbursment_rate: service?.reimbursment_rate,
          pre_authorization: service?.pre_authorization ? "yes" : "no",
          service_limit: service.in_limit?.service_limit,
          category_limit: service.in_limit?.category_limit,
          repayment_condition_max:
            service.has_conditions?.repayment_condition.max_no,
          repayment_condition_for:
            service.has_conditions?.repayment_condition.unit_no,
          repayment_condition_unit:
            service.has_conditions?.repayment_condition.unit,
          category_condition: service.has_conditions?.category_condition,
          waiting_period_max: service.waiting_period?.duration.min_no,
          waiting_period_unit: service.waiting_period?.duration.unit,
          waiting_period_redeemed: service.waiting_period?.redeemed,
          comment: service.comment,
          service_code: service.service_code,
          total_max_duration_in_days: service.total_max_duration_in_days,
          max_extend_duration_in_days: service.max_extend_duration_in_days,
        };
        serviceArray.push(obj);
      }

      this.editForm.patchValue({
        newService: serviceArray,
      });
    });

    await this.service.listPlanExclusions(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      let exclusions = response.body.result;
      console.log("Plan related exclusions response", response);

      let exclusionArray = [];
      if (exclusions.length === 0) {
        this.addNewEditExclusion();
      }

      for (const { index, exclusion } of exclusions.map((exclusion, index) => ({
        index,
        exclusion,
      }))) {
        this.addNewEditExclusion();
        console.log("Related Exclusion single", exclusion);
        // this.getRelatedExclusion(
        //   exclusion.in_exclusion?.in_exclusion?._id,
        //   index
        // );
        let obj = {
          // planExclusionId: exclusion?._id,
          exclusion: exclusion.in_exclusion?.category,
          in_exclusion: exclusion.in_exclusion?.name,
          brand_name: exclusion.in_exclusion?.brand,
          comment: exclusion.in_exclusion?.comment,
        };

        exclusionArray.push(obj);
      }

      this.editForm.patchValue({
        newExclusion: exclusionArray,
      });
    });

    await this.modalService.open(edithealthplancontent, {
      centered: true,
      size: "xl",
    });
  }

  //  Add plan modal
  openVerticallyCenteredAddplan(addhealthplancontent: any) {
    this.listPlanDefault("true");
    this.listPlanActual("");
    this.modalService.open(addhealthplancontent, {
      centered: true,
      size: "xl",
      windowClass: "add_health_plan",
    });
  }

  //  New health plan name modal
  openVerticallyCenteredNewplan(newhealthplancontent: any, isDefault: any) {
    this.isDefault = isDefault;
    console.log(this.serviceForm.value);

    if (isDefault === true) {
      this.isSubmitted = true;

      if (this.serviceForm.invalid) {
        console.log("rssss");

        return;
      }
      this.isSubmitted = false;
      // console.log(this.serviceForm.value);
      this.modalService.open(newhealthplancontent, {
        centered: true,
        size: "md",
      });
    } else {
      this.isSubmitted = true;

      if (this.serviceFormactual.invalid) {
        console.log("rssss");

        return;
      }
      this.isSubmitted = false;
      // console.log(this.serviceForm.value);
      this.modalService.open(newhealthplancontent, {
        centered: true,
        size: "md",
      });
    }
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

  saveHealth(companyName: any) { }

  handleAddActualPlan() {
    this.serviceForm.patchValue({
      default: false,
    });
    console.log(this.serviceForm.value);
  }

  get serviceFormControl(): { [key: string]: AbstractControl } {
    // console.log(this.loginForm.controls);
    return this.serviceForm.controls;
  }

  get serviceFormControlactual(): { [key: string]: AbstractControl } {
    // console.log(this.loginForm.controls);
    return this.serviceFormactual.controls;
  }

  deletePopup(deleteModal: any, data: any, delete_for: string, index: number) {
    console.log("Data--->", data);

    if (delete_for === "planService") {
      if (data.planServiceId) {
        this.id_for_delete = data.planServiceId;
        this.item_to_be_delete = "planService";
        this.remove_at_index = index;
        this.modalReference = this.modalService.open(deleteModal, {
          centered: true,
          size: "sm",
        });
      } else {
        this.removeEditService(index);
      }
    }

    if (delete_for === "planExclusion") {
      if (data.planExclusionId) {
        this.id_for_delete = data?.planExclusionId;
        this.item_to_be_delete = "planExclusion";
        this.remove_at_index = index;
        this.modalReference = this.modalService.open(deleteModal, {
          centered: true,
          size: "sm",
        });
      } else {
        this.removeEditExclusion(index);
      }
    }
  }

  handelDeletePlanServiceOrEclusion() {
    if (this.item_to_be_delete === "planService") {
      let reqData = {
        planServiceId: this.id_for_delete,
      };
      this.service.deletePlanService(reqData).subscribe((res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.removeEditService(this.remove_at_index);
          this.toastr.success(response.message);
          this.modalReference.close();
        }
      });
    }

    if (this.item_to_be_delete === "planExclusion") {
      let reqData = {
        planExclusionId: this.id_for_delete,
      };
      this.service.deletePlanExclusion(reqData).subscribe((res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.removeEditExclusion(this.remove_at_index);
          this.toastr.success(response.message);
          this.modalReference.close();
        }
      });
    }
  }

  public serviceExcleForm: FormGroup = new FormGroup({
    service_csv: new FormControl("", [Validators.required]),
  });

  public exclusionExcleForm: FormGroup = new FormGroup({
    exclusion_csv: new FormControl("", [Validators.required]),
  });

  public fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      console.log(fileList[0].name, "djdhkjdh");
      let file: File = fileList[0];
      this.selectedFiles = file;
      this.selectfilename = fileList[0].name;
    }
  }

  handleClose() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

  closeExclusionPop() { }

  public excleSubmit() {
    if (this.serviceExcleForm.invalid) {
      return;
    }

    const formData = new FormData();
    console.log(this.selectedFiles);
    this.subServiceForms.clear();
    this.addNewService();
    formData.append("file", this.selectedFiles);
    formData.append("col1", "category_of_service");

    formData.append("col2", "primary_and_secondary_category_limit");

    formData.append("col3", "category_limit");
    formData.append("col4", "category_condition");
    formData.append("col5", "service_code");
    formData.append("col6", "type_of_service");

    formData.append("col7", "primary_and_secondary_service_limit");

    formData.append("col8", "service_limit");
    formData.append("col9", "repayment_condition_max");
    formData.append("col10", "repayment_condition_for");
    formData.append("col11", "repayment_condition_unit");
    formData.append("col12", "total_max_duration_in_days");
    formData.append("col13", "max_extend_duration_in_days");
    formData.append("col14", "pre_authorization");
    formData.append("col15", "waiting_period_max");
    formData.append("col16", "waiting_period_unit");
    formData.append("col17", "waiting_period_redeemed");
    formData.append("col18", "reimbursment_rate");
    formData.append("col19", "comment");

    // uploadExcelMedicine
    this.service.uploadExcelMedicine(formData).subscribe({
      next: async (res) => {
        console.log("upload data", res);

        let result = this._coreService.decryptContext(res);
        console.log(result);
        if (result.status) {
          for (let index = 0; index < result.body.length - 1; index++) {
            this.addNewService();
          }

          console.log("EXCELLL DATA=====>", result.body);

          this.subServiceForms.patchValue(result.body);

          if (this.isDefault) {
            var errors = [];
            for (let i = 0; i < this.serviceForm.value.newService.length - 1; i++) {
              for (let j = i + 1; j < this.serviceForm.value.newService.length; j++) {
                console.log(this.serviceForm.value.newService[i].category_of_service, "this.serviceForm.value.newService[i].category_of_service");

                if (this.serviceForm.value.newService[i].category_of_service == this.serviceForm.value.newService[j].category_of_service) {
                  if (this.serviceForm.value.newService[i].category_limit != this.serviceForm.value.newService[j].category_limit || this.serviceForm.value.newService[i].category_condition != this.serviceForm.value.newService[j].category_condition || this.serviceForm.value.newService[i].primary_and_secondary_category_limit != this.serviceForm.value.newService[j].primary_and_secondary_category_limit) {
                    console.log(this.serviceForm.value.newService[i].category_limit, "kkkkkkkk", i, "this.serviceForm.value.newService[i].category_limit", this.serviceForm.value.newService[j].category_limit, "kkkkkkkk", j);
                    console.log(this.serviceForm.value.newService[i].category_condition, "kkkkkkkk", i, "this.serviceForm.value.newService[i].category_condition", this.serviceForm.value.newService[j].category_condition, "kkkkkkkk", j);
                    if (errors.indexOf(`All row of the category of service (${this.serviceForm.value.newService[i].category_of_service}), values should be same for four fields(category conditon, categroy limit and primary and secondary category and service limit)`) == -1) {
                      errors.push(`All row of the category of service (${this.serviceForm.value.newService[i].category_of_service}), values should be same for four fields(category conditon, categroy limit and primary and secondary category and service limit)`);
                    }
                  }
                }
              }
            }

            console.log(errors, "check errors");

            if (errors.length > 0) {
              const commaSeparatedString = errors.join(', ');

              this.toastr.error(commaSeparatedString);
              return;
            }
          } else {
            var errors = [];
            for (let i = 0; i < this.serviceFormactual.value.newService.length - 1; i++) {
              for (let j = i + 1; j < this.serviceFormactual.value.newService.length; j++) {
                console.log(this.serviceFormactual.value.newService[i].category_of_service, "this.serviceFormactual.value.newService[i].category_of_service");

                if (this.serviceFormactual.value.newService[i].category_of_service == this.serviceFormactual.value.newService[j].category_of_service) {
                  if (this.serviceFormactual.value.newService[i].category_limit != this.serviceFormactual.value.newService[j].category_limit || this.serviceFormactual.value.newService[i].category_condition != this.serviceFormactual.value.newService[j].category_condition || this.serviceFormactual.value.newService[i].primary_and_secondary_category_limit != this.serviceFormactual.value.newService[j].primary_and_secondary_category_limit) {
                    console.log(this.serviceFormactual.value.newService[i].category_limit, "kkkkkkkk", i, "this.serviceFormactual.value.newService[i].category_limit", this.serviceFormactual.value.newService[j].category_limit, "kkkkkkkk", j);
                    console.log(this.serviceFormactual.value.newService[i].category_condition, "kkkkkkkk", i, "this.serviceFormactual.value.newService[i].category_condition", this.serviceFormactual.value.newService[j].category_condition, "kkkkkkkk", j);
                    if (errors.indexOf(`All row of the category of service (${this.serviceFormactual.value.newService[i].category_of_service}), values should be same for four fields(category conditon, categroy limit and primary and secondary category and service limit)`) == -1) {
                      errors.push(`All row of the category of service (${this.serviceFormactual.value.newService[i].category_of_service}), values should be same for four fields(category conditon, categroy limit and primary and secondary category and service limit)`);
                    }
                  }
                }
              }
            }

            console.log(errors, "checkeerrors_____");

            if (errors.length > 0) {
              const commaSeparatedString = errors.join(', ');

              this.toastr.error(commaSeparatedString);
              return;
            }
          }

          this._coreService.showSuccess("File Uploaded Successfully", "");
          let element: HTMLElement = document.getElementById(
            "closebutton"
          ) as HTMLElement;
          element.click();
          this.selectfilename = "";
        } else {
          this._coreService.showError(result.message, "");
        }
      },
      error: (err) => {
        console.log(err);
        this._coreService.showError(err.statusText, "");
      },
      complete: () => {
        console.log("request done");
      },
    });
  }

  public excluExcelSubmit() {
    if (this.exclusionExcleForm.invalid) {
      return;
    }

    const formData = new FormData();
    console.log(this.selectedFiles);
    this.subExclucionForms.clear();
    this.addNewExclusion();
    formData.append("file", this.selectedFiles);
    formData.append("col1", "exclusion");
    formData.append("col2", "in_exclusion");
    formData.append("col3", "brand_name");
    formData.append("col4", "comment");

    // uploadExcelMedicine
    this.service.uploadExcelMedicine(formData).subscribe({
      next: async (res) => {
        console.log("upload data", res);

        let result = this._coreService.decryptContext(res);
        console.log(result);
        if (result.status) {
          for (let index = 0; index < result.body.length - 1; index++) {
            this.addNewExclusion();
          }

          this.subExclucionForms.patchValue(result.body);

          this._coreService.showSuccess("File Uploaded Successfully", "");
          let element: HTMLElement = document.getElementById(
            "closebuttonexclusion"
          ) as HTMLElement;
          element.click();
          this.selectfilename = "";
        } else {
          this._coreService.showError(result.message, "");
        }
      },
      error: (err) => {
        console.log(err);
        this._coreService.showError(err.statusText, "");
      },
      complete: () => {
        console.log("request done");
      },
    });
  }

  openVerticallyCenteredimport(importServices: any) {
    this.modalService.open(importServices, {
      centered: true,
      size: "md",
      windowClass: "master_modal Import",
      backdrop: "static",
    });
  }

  downLoadServiceExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/healthPlan_planService.xlsx");
    link.setAttribute("download", `healthPlan_planService.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  downLoadExclusionExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/exclusion.xlsx");
    link.setAttribute("download", `exclusion.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }


  handleCheckBoxChange(event, medicineId) {
    console.log("check ids333", medicineId, this.selectedLabs);

    if (event.checked == true) {
      // console.log(this.selectedLabs?.push(medicineId), "check ids3334444");

      this.selectedLabs?.push(medicineId);
    } else {
      const index = this.selectedLabs?.indexOf(medicineId);
      console.log(index, "check ids3334444666");
      if (index > -1) {
        this.selectedLabs.splice(index, 1);
      }
    }
    console.log("check ids333", this.selectedLabs);

  }


  makeSelectAll(event: any) {
    if (event.checked == true) {
      console.log(this.dataSource, "check ids");
      console.log(this.selectedLabs, "check ids");
      this.dataSource?.map((element) => {


        if (this.selectedLabs?.indexOf(element?._id) == -1) {
          this.selectedLabs?.push(element?._id);
          // console.log(this.selectedLabs?.push(element?._id), "check ids");

        }
      });
      console.log(this.selectedLabs, "check ids");

    } else {
      this.selectedLabs = [];
    }
  }
  deletemanual(deletePopupSelected, id) {
    this.selectedLabs.push(id);
    this.openVerticallyCenteredsecond(deletePopupSelected, '');
  }

  openVerticallyCenteredsecond(deletePopup: any, labId: any) {
    this.labId = labId;

    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }


  deletelab(isDeleteAll: any = "") {
    this.loader.start();
    let reqData = {
      planId: "",
      action_name: "delete",
      action_value: true,
      insuranceCompanyId: this.userId
    };

    if (isDeleteAll === "all") {
      reqData.planId = "";
    } else {
      reqData.planId = this.selectedLabs;
      console.log(reqData.planId, "check ids selectex");

    }

    console.log("REQUEST DATA LABS===>", reqData);

    this.service.healthplanDelete(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        this.listPlan();
        this.toastr.success(response.message);
        this.handleClose();
        this.selectedLabs = []
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }


  isAllSelected() {
    let allSelected = false;
    if (this.selectedLabs?.length === this.dataSource?.length && this.selectedLabs?.length != 0) {
      allSelected = true;
    }
    return allSelected;
  }


  close() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.router.navigate([`/insurance/insurance-healthplan`])
  }


}
