import { BreakpointObserver } from "@angular/cdk/layout";
import { StepperOrientation } from "@angular/cdk/stepper";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";

import { map, Observable, startWith } from "rxjs";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { PharmacyPlanService } from "../../../../pharmacy/pharmacy-plan.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { PharmacyService } from "../../../../pharmacy/pharmacy.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { DatePipe } from "@angular/common";
import { MatRadioChange } from "@angular/material/radio";
import { PatientService } from "src/app/modules/patient/patient.service";
import { FourPortalService } from "../../../../four-portal/four-portal.service";
import { Select2Data, Select2UpdateEvent } from "ng-select2-component";
import { LabimagingdentalopticalService } from "src/app/modules/super-admin/labimagingdentaloptical.service";
import { PendingPeriodicElement } from "src/app/modules/super-admin/super-admin-totaleclaims/super-admin-totaleclaims.component";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'app-commoninformation-four-portal-make-insurance',
  templateUrl: './commoninformation-four-portal-make-insurance.component.html',
  styleUrls: ['./commoninformation-four-portal-make-insurance.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommoninformationFourPortalMakeInsuranceComponent implements OnInit {

  @Input() public mstepper: MatStepper;
  @ViewChild("commentinfo", { static: false }) commentinfo: any;
  @ViewChild("requestedamountAll") requestedamountAll: TemplateRef<any>;
  myControl = new FormControl("");
  patient = new FormControl("");
  options: string[] = ["One", "Two", "Three"];
  filteredOptions: Observable<any>;
  patientId: any;
  insuranceId: string;
  stepOneId: string = "";
  stepDetails: number = 0;
  serviceselected: any = "";
  overlay: false;
  page: any = 1;
  disable: boolean = false;
  checkAccidentVal: any = "No";
  checkResThirdParty: any = "Yes";
  firstFormGroup = this._formBuilder.group({
    insuranceId: new FormControl("", [Validators.required]),
    patientId: new FormControl("", [Validators.required]),
    ePrescriptionNumber: new FormControl(),
    pharmacyId: new FormControl(""),
    requestType: new FormControl(""),
    claimNumber: new FormControl(""),
    service: new FormControl(""),
  });
  commentInfo: any = "";

  secondFormGroup = this._formBuilder.group({
    healthExpense: new FormControl(""),
    first_name: new FormControl(""),
    middle_name: new FormControl(""),
    last_name: new FormControl(""),
    dob: new FormControl(""),
    age: new FormControl(""),
    gender: new FormControl(""),
    insuranceId: new FormControl(""),
    policyId: new FormControl(""),
    employeeId: new FormControl(""),
    cardId: new FormControl(""),
    insHolderName: new FormControl(""),
    insValidityTo: new FormControl(""),
    insValidityFrom: new FormControl(""),
    reimbursment: new FormControl(""),
  });

  thirdFormGroup = this._formBuilder.group({
    first_namet: new FormControl(""),
    middle_namet: new FormControl(""),
    last_namet: new FormControl(""),
    dobt: new FormControl(""),
    aget: new FormControl(""),
    gendert: new FormControl(""),
    insuranceIdt: new FormControl(""),
    policyIdt: new FormControl(""),
    employeeIdt: new FormControl(""),
    cardIdt: new FormControl(""),
    insHolderNamet: new FormControl(""),
    insValidityTot: new FormControl(""),
    insValidityFromt: new FormControl(""),
    reimbursmentt: new FormControl(""),
    relationPrimaryt: new FormControl(""),
  });
  fourthFormGroup = this._formBuilder.group({
    deliveryCenter: new FormControl("", [Validators.required]),
    deliverFName: new FormControl(""),
    // deliverMName: new FormControl('', [Validators.required]),
    // deliverLName: new FormControl('', [Validators.required]),
    deliverTitle: new FormControl("", [Validators.required]),
    deliverStaff: new FormControl("", [Validators.required]),
    prescriberCenter: new FormControl("", [Validators.required]),
    prescriberFName: new FormControl("", [Validators.required]),
    prescriberMName: new FormControl(""),
    prescriberLName: new FormControl("", [Validators.required]),
    prescriberTitle: new FormControl("", [Validators.required]),
    prescriberSpeciality: new FormControl("", [Validators.required]),
  });
  fifthFormGroup = this._formBuilder.group({
    firstName: new FormControl(""),
    accidentRelation: new FormControl("No"),
    accidentDate: new FormControl(""),
    accidentType: new FormControl(""),
    other: new FormControl(""),
    officialReport: new FormControl(""),
    resThirdParty: new FormControl(""),
    lastName: new FormControl(""),
    phoneNumber: new FormControl(""),
    address: new FormControl(""),
    coment: new FormControl(""),
    addItionalInformation: new FormControl(""),
  });
  isLinear = false;

  deliveryCenterselected: any = "";
  deliverTitleselected: any = "";
  deliverStaffselected: any = "";
  nested_stepperOrientation: Observable<StepperOrientation>;
  isSubmitted: boolean = false;
  insuraneList: any[] = [];
  insuranceSelectedId: any = "";
  patientSelectedId: any = "";
  editClaimData: any;
  patientList: any[] = [];
  patientDetailList: any[] = [];
  primaryFieldList: any[] = [];
  loggedId: string;
  loggedName: string;
  primaryFieldJson: any;
  secondaryFieldList: any[] = [];
  secondaryFieldJson: any;
  accidentFieldList: any[] = [];
  accidentFieldJson: any;
  staffRole: any = [];
  planServicelist: any = [];
  deliverStaff: any = [];
  selectclaimid: any = "";
  type: any = "";
  staffTitle: string = "";
  staffTitleId: string = "";
  serviceMessage: string = "";
  specialtyList: any = [];
  prescriberSpecialitydefault: any = "";
  accidenttypeselected: any = "";
  orderId: any = "";
  logginIdOrder: any = ""
  searchText = "";

  startDate: string = null;
  endDate: string = null;

  @Output() dataEvent = new EventEmitter<string>();

  selectedDeliveryStaff: any = "";
  orderDetails: any;
  insuranceIdss: any;
  subscriberId: any;
  specialityservicedataSource: any;
  matchedRecord: any;
  customIdMatchRecord: any;
  loggedType: any;
  insuranceiD: any;
  insuranceselectedname: any;
  patientDataAll: any;
  hospitalPharmacyList: any[];
  pharmacy_id: any;
  totalLength: any;
  pendingdataSource: any;
  LaboratoryDeliveryCenterId: any;
  loggedInRole: any;
  adminDataId: any;
  staffRoleAlldata: any[];
  specialtyListData: any;

  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private pharmacyService: PharmacyPlanService,
    private superAdminService: SuperAdminService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private _pharmacyService: PharmacyService,
    private _superAdminService: SuperAdminService,
    private modalService: NgbModal,
    public datepipe: DatePipe,
    private patientService: PatientService,
    private labImaginge: FourPortalService,
    private labimagingdentaloptical: LabimagingdentalopticalService

  ) {
    // this.ngxService.start();
    this.nested_stepperOrientation = breakpointObserver
      .observe("(min-width: 768px)")
      .pipe(map(({ matches }) => (matches ? "horizontal" : "vertical")));

    this.loggedId = this.coreService.getLocalStorage("loginData")._id;
    this.loggedInRole = this.coreService.getLocalStorage("adminData").role;
    this.adminDataId = this.coreService.getLocalStorage("adminData").for_user;
 
    this.route.paramMap.subscribe(params => {
      this.loggedType = params.get('path');

    });
    this.deliveryCenterselected = this.loggedId;
    // this.loggedName =
    //   this.coreService.getLocalStorage("adminData").full_name;
    sessionStorage.removeItem("stepOneId");
    sessionStorage.removeItem("claimId");
    sessionStorage.removeItem("service");
    sessionStorage.removeItem("subscriberid");
    sessionStorage.removeItem("step");
    sessionStorage.removeItem("InsuranceId");
    sessionStorage.removeItem("checkSubscriber");


    this.route.queryParams.subscribe((params: any) => {

      this.selectclaimid = params.claim_id;
      this.type = params.type;
      this.orderId = params.orderId
      this.logginIdOrder = params.logginId
    });
    if (this.type == undefined) {
      this.type = '';

    }

    if (this.orderId == undefined) {
      this.orderId = '';
      this.logginIdOrder = '';
    }




    if (this.selectclaimid != "" && this.selectclaimid != undefined) {
      this.getClaimDetails();
    }


    if (this.orderId != "" && this.orderId != undefined) {
      this.getOrderDetails();
    }

  }
  private async getClaimDetails() {
    this.pharmacyService.medicineClaimDetails(this.selectclaimid).subscribe({
      next: async (res) => {
        let encData = await res;
        let result = await this.coreService.decryptContext(encData);
        if (result.status) {
          let claimData = result.data[0];
          this.editClaimData = claimData;
          if (claimData?.insuranceId != "") {
            //this.autogetInsuranceId(claimData?.insuranceId, claimData?.patientId);
          }
          this.insuranceSelectedId = claimData?.insuranceId;
          this.pharmacy_id = claimData?.deliverCenterInfo?.deliverCenter;

          this.patientService.allRole(this.pharmacy_id).subscribe((res) => {
            let result = this.coreService.decryptObjectData(res);
            if (result?.status) {
              this.staffRole = result?.body.data;
            }
          });
          this.firstFormGroup.patchValue({
            // insuranceId: claimData?.insuranceId,
            requestType: claimData?.requestType,
            patientId: claimData?.patientId,
            claimNumber: claimData?.claimNumber,
          });
          this.fourthFormGroup.patchValue({
            prescriberCenter: claimData?.prescriberCenterInfo?.prescriberCenter,
            prescriberFName:
              claimData?.prescriberCenterInfo?.prescriberFirstName,
            prescriberLName:
              claimData?.prescriberCenterInfo?.prescriberLastName,
            prescriberMName:
              claimData?.prescriberCenterInfo?.prescriberMiddleName,
            prescriberTitle: claimData?.prescriberCenterInfo?.prescriberTitle,
            prescriberSpecialty:
              claimData?.prescriberCenterInfo?.prescriberSpecialty,
          });
          let accidentFieldListsave = [];
          claimData?.accidentRelatedField.forEach((element) => {
            accidentFieldListsave.push(Object.values(element));
          });
          let accidentRelationindex: any =
            this.indexOf2dArray(
              accidentFieldListsave,
              "Is It Related To An Accident"
            ) != -1
              ? accidentFieldListsave[
              this.indexOf2dArray(
                accidentFieldListsave,
                "Is It Related To An Accident"
              )
              ][1]
              : "";

          let accidentDateindex: any =
            this.indexOf2dArray(accidentFieldListsave, "Accident Date") != -1
              ? new Date(
                accidentFieldListsave[
                this.indexOf2dArray(accidentFieldListsave, "Accident Date")
                ][1]
              )
              : "";
          let aaccidentTypeindex: any =
            this.indexOf2dArray(accidentFieldListsave, "Accident Type") != -1
              ? accidentFieldListsave[
              this.indexOf2dArray(accidentFieldListsave, "Accident Type")
              ][1]
              : "";
          let officialReportindex: any =
            this.indexOf2dArray(
              accidentFieldListsave,
              "Is There An Official Report"
            ) != -1
              ? accidentFieldListsave[
              this.indexOf2dArray(
                accidentFieldListsave,
                "Is There An Official Report"
              )
              ][1]
              : "";
          let resThirdPartyindex: any =
            this.indexOf2dArray(
              accidentFieldListsave,
              "Is There A Responsible Third Party"
            ) != -1
              ? accidentFieldListsave[
              this.indexOf2dArray(
                accidentFieldListsave,
                "Is There A Responsible Third Party"
              )
              ][1]
              : "";
          let firstNameindex: any =
            this.indexOf2dArray(accidentFieldListsave, "First Name") != -1
              ? accidentFieldListsave[
              this.indexOf2dArray(accidentFieldListsave, "First Name")
              ][1]
              : "";
          let lastNameindex: any =
            this.indexOf2dArray(accidentFieldListsave, "Last Name") != -1
              ? accidentFieldListsave[
              this.indexOf2dArray(accidentFieldListsave, "Last Name")
              ][1]
              : "";
          let phoneNumberindex: any =
            this.indexOf2dArray(accidentFieldListsave, "Phone Number") != -1
              ? accidentFieldListsave[
              this.indexOf2dArray(accidentFieldListsave, "Phone Number")
              ][1]
              : "";
          let addressindex: any =
            this.indexOf2dArray(accidentFieldListsave, "Address") != -1
              ? accidentFieldListsave[
              this.indexOf2dArray(accidentFieldListsave, "Address")
              ][1]
              : "";
          let addItionalInformation: any =
            this.indexOf2dArray(
              accidentFieldListsave,
              "Additional Information"
            ) != -1
              ? accidentFieldListsave[
              this.indexOf2dArray(
                accidentFieldListsave,
                "Additional Information"
              )
              ][1]
              : "";
          let comment: any =
            this.indexOf2dArray(accidentFieldListsave, "Comment") != -1
              ? accidentFieldListsave[
              this.indexOf2dArray(accidentFieldListsave, "Comment")
              ][1]
              : "";
          this.checkAccidentVal = accidentDateindex;
          this.fifthFormGroup.patchValue({
            accidentRelation: accidentRelationindex,
            accidentDate: accidentDateindex,
            accidentType: aaccidentTypeindex,
            officialReport: officialReportindex,
            resThirdParty: resThirdPartyindex,
            firstName: firstNameindex,
            lastName: lastNameindex,
            phoneNumber: phoneNumberindex,
            address: addressindex,
            addItionalInformation: addItionalInformation,
            coment: comment,
          });
          this.accidenttypeselected = aaccidentTypeindex;      
       
          this.getSpecialty();
          if (claimData?.deliverCenterInfo?.deliverTitleId != undefined) {
            const param = {
              pharmacyId: this.loggedId,
              staffRoleId: claimData?.deliverCenterInfo?.deliverTitleId,
            };
            this.pharmacyService.getPharmacyStaffName(param).subscribe({
              next: async (res) => {
                let encData = await res;
                let result = this.coreService.decryptContext(encData);
                if (result.status) {
                  const checkstaff = this.staffRole.find(
                    (obj) =>
                      obj._id === claimData?.deliverCenterInfo?.deliverTitleId
                  );
                  this.staffTitle = checkstaff?.name;
                  this.staffTitleId =
                    claimData?.deliverCenterInfo?.deliverTitleId;
                  this.deliverStaff = result.data;

                  result?.data.map((curentval, index) => {
                    if (this.deliverStaff.indexOf({
                      label: curentval?.staff_name,
                      value: curentval?.staff_name,
                    }) == -1) {
                      this.deliverStaff.push({
                        label: curentval?.staff_name,
                        value: curentval?.staff_name,
                      });
                    }
                  });
                  this.deliveryCenterselected = claimData?.deliverCenterInfo?.deliverCenter;
                  this.prescriberSpecialitydefault = claimData?.prescriberCenterInfo?.prescriberSpecialty;
                } else {
                  this.staffTitle = "";
                  this.staffTitleId = "";
                }
              },
            });

            this.firstFormGroup.patchValue({ service: claimData?.service });
          }
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message, "err.message");
      },
    });
  }
  changeaccidenttype(event) {
    this.accidenttypeselected = event.value;
  }
  indexOf2dArray(array2d: any, itemtofind: any) {
    let index = [].concat
      .apply([], [].concat.apply([], array2d))
      .indexOf(itemtofind);
    // return "false" if the item is not found
    if (index === -1) {
      return index;
    }
    // Use any row to get the rows' array length
    // Note, this assumes the rows are arrays of the same length
    let numColumns = array2d[0].length;
    let row = index / numColumns;
    // col = index modulus the number of columns
    let col = index % numColumns;
    return row;
  }

  ngOnInit() {

    this.getSpecialty();
    this.getAllInsurance();   
    this.getLabList();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value || ""))
    );
  }
 
  getSpecialty() {
    let param = {
      searchText: "",
      limit: 50,
      page: 1,
    };
    this._superAdminService.listSpeciality(param).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
      
        this.specialtyListData = result.body?.data;
        this.specialtyList = [];
        this.specialtyListData.map((curentval) => {

          this.specialtyList.push({
            value: curentval.specilization,
            label: curentval?.specilization
          });
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }



  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (this.planServicelist.length > 0) {
      var result = this.planServicelist.filter((option: any) => {
        return option.service.toLowerCase().includes(filterValue);
      });
      return result != "" ? result : ["No data"];
    }
    return ["No data"];
  }

  private async getPlanDetails(patientId) {
    let param = {
      subscriber_id: patientId,
    };
    this.pharmacyService.getInsurancePlanDetailsbysubscriber(param).subscribe({
      next: async (res) => {
        const encData = await res;
        let result = this.coreService.decryptContext(encData);
        if (result.status) {
          this.serviceMessage = "";
          this.planServicelist = result.body?.planService;
          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),
            map((value) => this._filter(value || ""))
          );

          if (this.selectclaimid == "" && this.selectclaimid == undefined) {
            this.firstFormGroup.patchValue({ service: "" });
            this.serviceselected = "";
            this.filterRefresh();
          } else {
            this.firstFormGroup.patchValue({
              service: this.editClaimData?.service,
            });
            this.serviceselected = this.editClaimData?.service;
          }
        } else {
          this.coreService.showInfo(
            "Given Insurance Id is not applicable for Reimbursment",
            ""
          );
        }
      },
    });
  }

  handleservice(target: any, serviceOption: any): void {
    if (target) {
      this.serviceselected = target;
      if (serviceOption.pre_authorization) {
        this.serviceMessage =
          "THIS SERVICE REQUIRES PRE-AUTHRORIZATION PLEASE SAVE AND CONTINUE TO SUBMIT A PRE-AUTHORIZATION OTHERWISE PLEASE QUIT";
        this.firstFormGroup.patchValue({ requestType: "pre-auth" });
      } else {
        this.serviceMessage = "";
        this.firstFormGroup.patchValue({ requestType: "medical-products" });
      }
      this.firstFormGroup.patchValue({ service: target });
      // this.medicineName = target.value;
    } else {
      this.firstFormGroup.patchValue({ service: "" });
    }
  }
 
  getStaffDetails(event: any) {
    if (event.value) {
      const param = {
        pharmacyId: this.pharmacy_id,
        staffRoleId: event.value,
      };
      this.labImaginge.listCategoryStaff(param).subscribe({
        next: async (res) => {
          let encData = await res;
          let result = this.coreService.decryptContext(encData);
          if (result.status) {
            const checkstaff = this.staffRole.find(
              (obj) => obj._id === event.value
            );
            this.staffTitle = checkstaff.name;
            this.staffTitleId = event.value;

            result?.data.map((curentval, index) => {
              this.deliverStaff.push({
                label: curentval?.name,
                value: curentval?.name,
              });
            });
            if (this.editClaimData != '') {
              this.deliverStaffselected = this.editClaimData?.deliverCenterInfo?.deliverFirstName;
            }

          } else {
            this.staffTitle = "";
            this.staffTitleId = "";
          }
        },
      });
    }
  }

  openCommentPopup(info) {
    this.commentInfo = info;
    this.openVerticallyCenteredClaim(this.commentinfo);
  }

  checkAccident(event) {
    this.checkAccidentVal = event.value;
    if (event.value == "Yes") {
      this.addValidationInAccident();
    } else {
      this.removeValidationInAccident();
    }
  }

  checkResThird(event) {
    this.checkResThirdParty = event.value;
    if (event.value == "Yes") {
      this.fifthFormGroup.get("firstName").setValidators(Validators.required);
      this.fifthFormGroup.get("lastName").setValidators(Validators.required);
      this.fifthFormGroup.get("phoneNumber").setValidators(Validators.required);
      this.fifthFormGroup.get("address").setValidators(Validators.required);
    } else {
      this.fifthFormGroup.get("firstName").clearValidators();
      this.fifthFormGroup.get("lastName").clearValidators();
      this.fifthFormGroup.get("phoneNumber").clearValidators();
      this.fifthFormGroup.get("address").clearValidators();
      this.fifthFormGroup.get("firstName").updateValueAndValidity();
      this.fifthFormGroup.get("lastName").updateValueAndValidity();
      this.fifthFormGroup.get("phoneNumber").updateValueAndValidity();
      this.fifthFormGroup.get("address").updateValueAndValidity();
    }
  }

  openVerticallyCenteredClaim(commentinfo: any) {
    this.modalService.open(commentinfo, {
      centered: true,
      size: "md",
      windowClass: "claim_successfully",
    });
  }
  async autogetInsuranceId(event: any, patientId: any) {
    this.insuranceId = event;
    // await this.getAllSubscriber();
    let param = {
      for_portal_user: this.insuranceId,
    };
    this.pharmacyService.getAllSubscriber(param).subscribe({
      next: async (res) => {
        const encData = await res;
        let result = this.coreService.decryptContext(encData);
        //this.patientList = result.body;
        this.patientDetailList = result.body;
        result.body.map((curentval, index) => {
          this.patientList.push({
            value: curentval._id,
            label:
              curentval?.subscriber_full_name +
              " " +
              this.datepipe.transform(curentval?.date_of_birth, "MM-dd-yyyy"),
          });
        });

        await this.getPrimaryInsuredField();
        await this.getSecondaryInsurerField();
        await this.getAccidentField();
        await this.getpatientId(patientId);
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(""),
          map((value) => this._filter(value || ""))
        );
      },
    });
  }

  private filterRefresh() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value || ""))
    );
  }

  async getInsuranceId(event: any) {

    if (event != undefined) {
      this.insuranceId = event;

      this.serviceselected = "";
      // if (this.selectclaimid != '' && this.selectclaimid != undefined) {
      //   this.serviceselected = this.editClaimData.service;

      // }
      this.serviceMessage = "";
      await this.getAllSubscriber();
      await this.getPrimaryInsuredField();
      await this.getSecondaryInsurerField();
      await this.getAccidentField();

    }
  }

  private getAllSubscriber() {
    let param = {
      for_portal_user: this.insuranceId,
    };

    this.pharmacyService.getAllSubscriber(param).subscribe({
      next: async (res) => {
        const encData = await res;
        let result = this.coreService.decryptContext(encData);
        //this.patientList = result.body;
        if (result.status) {
          this.patientList = [];
          this.patientDetailList = await result.body;
          if (this.patientDetailList.length > 0) {
            result.body.map((curentval, index) => {
              this.patientList.push({
                value: curentval._id,
                label:
                  curentval?.subscriber_full_name +
                  " (DOB:" +
                  this.datepipe.transform(
                    curentval?.date_of_birth,
                    "MM-dd-yyyy"
                  ) +
                  ")",
              });
            });
            this.patientSelectedId = await this.editClaimData?.patientId;
            if (this.orderId != '') {
              this.patientSelectedId = await this.subscriberId;
            }

            if (this.prescData) {
              this.patientSelectedId = await this.prescData?.subscriberId;
            }
          } else {
            this.patientSelectedId = "";
            this.patientList = [];
            this.filterRefresh();
            this.coreService.showError("No Patient List Found", "");
            this.planServicelist = [];
          }
        } else {
          this.patientSelectedId = "";
          this.patientList = [];
          this.planServicelist = [];
          this.filterRefresh();
          this.coreService.showError(result.message, "");
        }

      },
    });
  }

  private getPrimaryInsuredField() {
    // this.insuranceId = this.insuranceId[]

    const requestData = {
      insuranceId: this.loggedId,
    };
    this.primaryFieldList = [];
    this.primaryFieldJson = "";
    this.pharmacyService.getAllPrimaryInsuredFields(requestData).subscribe({
      next: async (res) => {
        const encryptedData = await res;
        if (encryptedData) {
          let result = this.coreService.decryptContext(encryptedData);

          if (result.status) {
            this.primaryFieldJson = result.body.primaryData;
            result.body.primaryData.forEach((element) => {
              this.primaryFieldList.push(Object.values(element));
            });
            this.addValidationInPrimary();
            // this.primaryFieldList = result.body.primaryData;
          } else {
            //this.coreService.showError(result.message,'');
          }
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      },
    });
  }

  private addValidationInPrimary() {
    this.primaryFieldJson.forEach((element) => {
      switch (element.fieldName) {
        case "First Name":
          this.secondFormGroup
            .get("first_name")
            .setValidators(Validators.required);
          break;
        case "Last Name":
          this.secondFormGroup
            .get("last_name")
            .setValidators(Validators.required);
          break;
        // case 'Middle Name':
        //   this.secondFormGroup.get('middle_name').setValidators(Validators.required);
        //   break;
        case "Date Of Birth":
          this.secondFormGroup.get("dob").setValidators(Validators.required);
          break;
        case "Age":
          this.secondFormGroup.get("age").setValidators(Validators.required);
          break;
        case "Card ID":
          this.secondFormGroup.get("cardId").setValidators(Validators.required);
          break;
        case "Employee ID":
          this.secondFormGroup
            .get("employeeId")
            .setValidators(Validators.required);
          break;
        case "Gender":
          this.secondFormGroup.get("gender").setValidators(Validators.required);
          break;
        case "Insurance Validity":
          this.secondFormGroup
            .get("insValidityTo")
            .setValidators(Validators.required);
          break;
        case "Insurance ID":
          this.secondFormGroup
            .get("insuranceId")
            .setValidators(Validators.required);
          break;
        case "Insurance Holder Name":
          this.secondFormGroup
            .get("insHolderName")
            .setValidators(Validators.required);
          break;
        case "Policy ID":
          this.secondFormGroup
            .get("policyId")
            .setValidators(Validators.required);
          break;
        case '"Reimbursement"':
          this.secondFormGroup
            .get("reimbursment")
            .setValidators(Validators.required);
          break;
        default:
          break;
      }
    });
  }

  private getSecondaryInsurerField() {
    const requestData = {
      insuranceId: this.loggedId,
    };

    this.secondaryFieldList = [];
    this.secondaryFieldJson = "";
    this.pharmacyService.getAllSecondaryInsuredFields(requestData).subscribe({
      next: async (res) => {
        const encryptedData = await res;
        if (encryptedData) {
          let result = this.coreService.decryptContext(encryptedData);

          if (result.status) {
            if (result.body.secondaryData.length > 0) {
              this.secondaryFieldJson = result.body.secondaryData;

              result.body.secondaryData.forEach((element) => {
                this.secondaryFieldList.push(Object.values(element));
              });
              this.addValidationInSecondary();
            } else {
              this.secondaryFieldJson = null;
              this.secondaryFieldList = [];
            }
          }
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      },
    });
  }

  private addValidationInSecondary() {
    this.secondaryFieldJson.forEach((element) => {
      switch (element.fieldName) {
        case "First Name":
          this.thirdFormGroup
            .get("first_namet")
            .setValidators(Validators.required);
          break;
        case "Last Name":
          this.thirdFormGroup
            .get("last_namet")
            .setValidators(Validators.required);
          break;
        // case 'Middle Name':
        //   this.thirdFormGroup.get('middle_namet').setValidators(Validators.required);
        //   break;
        case "Date Of Birth":
          this.thirdFormGroup.get("dobt").setValidators(Validators.required);
          break;
        case "Age":
          this.thirdFormGroup.get("aget").setValidators(Validators.required);
          break;
        case "Card ID":
          this.thirdFormGroup.get("cardIdt").setValidators(Validators.required);
          break;
        case "Employee ID":
          this.thirdFormGroup
            .get("employeeIdt")
            .setValidators(Validators.required);
          break;
        case "Gender":
          this.thirdFormGroup.get("gendert").setValidators(Validators.required);
          break;
        case "Insurance Validity":
          this.thirdFormGroup
            .get("insValidityFromt")
            .setValidators(Validators.required);
          this.thirdFormGroup
            .get("insValidityTot")
            .setValidators(Validators.required);
          break;
        case "Insurance ID":
          this.thirdFormGroup
            .get("insuranceIdt")
            .setValidators(Validators.required);
          break;
        case "Insurance Holder Name":
          this.thirdFormGroup
            .get("insHolderNamet")
            .setValidators(Validators.required);
          break;
        case "Policy ID":
          this.thirdFormGroup
            .get("policyIdt")
            .setValidators(Validators.required);
          break;
        case '"Reimbursement"':
          this.thirdFormGroup
            .get("reimbursmentt")
            .setValidators(Validators.required);
          break;
        case '"Relation With The Primary Insured"':
          this.thirdFormGroup
            .get("relationPrimaryt")
            .setValidators(Validators.required);
          break;
        default:
          break;
      }
    });
  }

  private getAccidentField() {
    const requestData = {
      insuranceId: this.loggedId,
    };

    this.accidentFieldList = [];
    this.accidentFieldJson = "";
    this.pharmacyService.getAllAccidentInsurerFields(requestData).subscribe({
      next: async (res) => {
        const encryptedData = await res;
        if (encryptedData) {
          let result = this.coreService.decryptContext(encryptedData);

          if (result.status) {
            if (result.body.accidentData.length > 0) {
              this.accidentFieldJson = result.body.accidentData;

              result.body.accidentData.forEach((element) => {
                this.accidentFieldList.push(Object.values(element));
              });
              this.addValidationInAccident();
            } else {
              this.accidentFieldJson = null;
              this.accidentFieldList = [];
            }
          }
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      },
    });
  }

  private addValidationInAccident() {
    this.accidentFieldJson.forEach((element) => {
      switch (element.fieldName) {
        case "First Name":
          this.fifthFormGroup
            .get("firstName")
            .setValidators(Validators.required);
          break;
        case "Is It Related To An Accident":
          this.fifthFormGroup
            .get("accidentRelation")
            .setValidators(Validators.required);
          break;
        case "Accident Date":
          this.fifthFormGroup
            .get("accidentDate")
            .setValidators(Validators.required);
          break;
        case "Accident Type":
          this.fifthFormGroup
            .get("accidentType")
            .setValidators(Validators.required);
          break;
        case "Is There An Official Report":
          this.fifthFormGroup
            .get("officialReport")
            .setValidators(Validators.required);
          break;
        case "Is There A Responsible Third Party":
          this.fifthFormGroup
            .get("resThirdParty")
            .setValidators(Validators.required);
          break;
        case "Last Name":
          this.fifthFormGroup
            .get("lastName")
            .setValidators(Validators.required);
          break;
        case "Phone Number":
          this.fifthFormGroup
            .get("phoneNumber")
            .setValidators(Validators.required);
          break;
        case '"Address"':
          this.fifthFormGroup.get("address").setValidators(Validators.required);
          break;
        default:
          break;
      }
    });
  }

  private removeValidationInAccident() {
    this.accidentFieldJson.forEach((element) => {
      switch (element.fieldName) {
        case "First Name":
          this.fifthFormGroup.get("firstName").clearValidators();
          this.fifthFormGroup.get("firstName").updateValueAndValidity();
          break;
        case "Is It Related To An Accident":
          this.fifthFormGroup.get("accidentRelation").clearValidators();
          this.fifthFormGroup.get("accidentRelation").updateValueAndValidity();
          break;
        case "Accident Date":
          this.fifthFormGroup.get("accidentDate").clearValidators();
          this.fifthFormGroup.get("accidentDate").updateValueAndValidity();
          break;
        case "Accident Type":
          this.fifthFormGroup.get("accidentType").clearValidators();
          this.fifthFormGroup.get("accidentType").updateValueAndValidity();
          break;
        case "Is There An Official Report":
          this.fifthFormGroup.get("officialReport").clearValidators();
          this.fifthFormGroup.get("officialReport").updateValueAndValidity();
          break;
        case "Is There A Responsible Third Party":
          this.fifthFormGroup.get("resThirdParty").clearValidators();
          this.fifthFormGroup.get("resThirdParty").updateValueAndValidity();
          break;
        case "Last Name":
          this.fifthFormGroup.get("lastName").clearValidators();
          this.fifthFormGroup.get("lastName").updateValueAndValidity();
          break;
        case "Phone Number":
          this.fifthFormGroup.get("phoneNumber").clearValidators();
          this.fifthFormGroup.get("phoneNumber").updateValueAndValidity();
          break;
        case '"Address"':
          this.fifthFormGroup.get("address").clearValidators();
          this.fifthFormGroup.get("address").updateValueAndValidity();
          break;
        default:
          break;
      }
    });
  }

  getpatientId(event: any) {
    if (event != undefined) {
      this.patientId = event;
      this.serviceMessage = "";
      // this.serviceselected = '';
      this.patientDetailList.forEach((element) => {
        if (element._id == event) {
          if (element.subscription_for == "Secondary") {
            this.patchSecondaryValue(element._id);
            this.patientDetailList.forEach((ele) => {
              if (ele.secondary_subscriber.length > 0) {
                ele.secondary_subscriber.forEach((sub) => {
                  if (sub == element._id) {
                    this.patchPrimarySubscriber(ele._id, "secondaryInsurer");
                  }
                });
              }
            });
          }

          if (element.subscription_for == "Primary") {
            this.patchPrimarySubscriber(element._id, "primaryInsurer");
            this.patchSecondaryValue(element?.secondary_subscriber[0]);
          }
        }
      });
      this.filterRefresh();
      this.getPlanDetails(this.patientId);
    }
  }

  private patchSecondaryValue(secondId: any) {
    this.patientDetailList.forEach((element) => {
      if (element._id == secondId) {
        this.thirdFormGroup.patchValue({
          first_namet: element.subscriber_first_name,
          middle_namet: element.subscriber_middle_name,
          last_namet: element.subscriber_last_name,
          dobt: element.date_of_birth,
          aget: element.age,
          gendert: element.gender,
          insuranceIdt: element.insurance_id,
          policyIdt: element.policy_id,
          employeeIdt: element.employee_id,
          cardIdt: element.card_id,
          insHolderNamet: element.insurance_holder_name,
          insValidityTot: element.insurance_validity_to,
          insValidityFromt: element.insurance_validity_from,
          reimbursmentt: element.reimbersement_rate,
          relationPrimaryt: element.relationship_with_insure,
        });
      }
    });
  }

  private patchPrimarySubscriber(primaryId: any, healthExpense: string) {
    this.patientDetailList.forEach((element) => {
      if (element._id == primaryId) {
        this.secondFormGroup.patchValue({
          healthExpense: healthExpense,
          first_name: element.subscriber_first_name,
          middle_name: element.subscriber_middle_name,
          last_name: element.subscriber_last_name,
          dob: element.date_of_birth,
          age: element.age,
          gender: element.gender,
          insuranceId: element.insurance_id,
          policyId: element.policy_id,
          employeeId: element.employee_id,
          cardId: element.card_id,
          insHolderName: element.insurance_holder_name,
          insValidityTo: element.insurance_validity_to,
          insValidityFrom: element.insurance_validity_from,
          reimbursment: element.reimbersement_rate,
        });
      }
    });

  }



  private getAllInsurance() {
    if (this.loggedInRole == "INSURANCE_ADMIN") {
      this.loggedId = this.loggedId;
      let companyname = this.coreService.getLocalStorage("adminData").company_name;
      this.insuranceselectedname = companyname;
      this.insuranceiD = this.loggedId
      this.firstFormGroup.patchValue({
        insuranceId: this.insuranceselectedname
      })
      this.getInsuranceId(this.insuranceiD)
    } else {
      this.loggedId = this.adminDataId;
      let companyname = this.coreService.getLocalStorage("adminData").adminCompanyName;
      this.insuranceselectedname = companyname;
      this.insuranceiD = this.adminDataId
      this.firstFormGroup.patchValue({
        insuranceId: this.insuranceselectedname
      })
      this.getInsuranceId(this.insuranceiD)
    }
  }

 

  getAllRole(event: Select2UpdateEvent<any>) {
    if (event.value != undefined) {
      this.pharmacy_id = event.options[0].value;

      const param = {
        limit: "",
        page: "",
        searchText: "",
        userId: this.pharmacy_id,
        type: this.loggedType

        // pharmacyId: this.loggedId,

      };

      this.labImaginge.all_role(param).subscribe({
        next: async (res) => {
          // (res) => {
          let encData = await res;
          let result = this.coreService.decryptContext(encData);
          this.staffRoleAlldata = [];
          this.staffRole = result?.body.data;
          this.staffRole.map((curentval, index) => {
            if (this.staffRoleAlldata.indexOf({
              label: curentval?.name,
              value: curentval?._id,
            }) == -1) {
              this.staffRoleAlldata.push({
                label: curentval?.name,
                value: curentval?._id,
              });
            }
          });
          if (this.editClaimData != '') {
            this.deliverTitleselected = this.editClaimData?.deliverCenterInfo?.deliverTitleId;

          }

          if (result?.status) {
            this.staffRole = result?.body.data;
          }
        }
      });
    }
  }



  private getLabList(sort: any = ''): void {
    // let type;
    // if (this.loggedType == "Paramedical-Professions") {
    //   type = "Paramedical-Professions"
    // }
    let reqData = {
      page: this.page,
      limit: 1000,
      status: "APPROVED",
      searchText: this.searchText,
      from_date: this.startDate,
      to_date: this.endDate,
      sort: sort,
      type: this.loggedType
    };


    this.labimagingdentaloptical.laboratoryList(reqData).subscribe(async (res) => {
      let response = await this.coreService.decryptObjectData({ data: res });

      if (response.status) {

        let data = []
        let array2 = response.data.data;

        for (const curentval of array2) {
          this.LaboratoryDeliveryCenterId = curentval?.for_portal_user._id;
          data.push({
            label: curentval?.full_name,
            value: curentval?.for_portal_user._id,
          })
        }

        this.hospitalPharmacyList = data;
      }
      else {
        this.coreService.showError(response.message, "")
      }
   });
  }


  public saveStepOne(formVal: any, stepper: MatStepper) {

    let finalReqData = {
      insurnaceId: this.insuranceId,
    };
    this.pharmacyService.checkInsuranceStaff(finalReqData).subscribe({
      next: async (res) => {
        let encData = await res;
        let result = this.coreService.decryptContext(encData);
        if (result.data) {

          this.isSubmitted = true;
          if (this.firstFormGroup.invalid) {
            const invalid = [];
            const controls = this.firstFormGroup.controls;


            for (const name in controls) {

              if (controls[name].invalid) {
                invalid.push(name);
              }
            }

            return;
          }
          // this.ngxService.start();
          formVal.created_by = "INSURANCE_ADMIN";
          formVal.pharmacyId = "";
          formVal.createdById = this.loggedId;
          formVal.claimId = "";
          formVal.loggedInPatientId = this.loggedId;
          formVal.loggedInInsuranceId = "";

          if (this.selectclaimid) {
            formVal.claimId = this.selectclaimid;
          }
          formVal.insuranceId = this.insuranceiD;
          formVal.claimType = this.loggedType + "-order"
          // formVal.ePrescriptionNumber = "";
          if (this.type === "pre_auth") {
            formVal.preAuthReclaimId = this.selectclaimid;
            formVal.claimId = "";
            formVal.requestType = "medical-products";
          } else {
            formVal.preAuthReclaimId = "";
            formVal.requestType = "medical-products";
          }         

          this.pharmacyService.commonInformationStep1FourPortal(formVal).subscribe({
            next: async (res) => {
              const encData = await res;
              let result = this.coreService.decryptContext(encData);

              if (result.status) {
                this.stepOneId = result?.data?._id;
                this.coreService.setSessionStorage(result?.data?._id, "stepOneId");
                this.coreService.setSessionStorage(1, "step");
                this.coreService.setSessionStorage(result?.data?.claimId, "claimId");
                this.coreService.setSessionStorage(result?.data?.service, "service");
                this.coreService.setSessionStorage(
                  result?.data?.patientId,
                  "subscriberid"
                );
                this.coreService.showSuccess(result?.message, "");
                this.coreService.setSessionStorage(
                  result?.data?.insuranceId,
                  "InsuranceId"
                );
                this.coreService.setSessionStorage(
                  this.secondFormGroup.controls["healthExpense"].value,
                  "checkSubscriber"
                );
                stepper.next();
              } else {
                this.coreService.showError(result.message, "");
              }
            },
            error(err: ErrorEvent) {
              console.log(err.message);
            },
          });
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      error(err: ErrorEvent) {
        console.log(err.message);
      },

    })
  }


  get stepOneFormControl(): { [key: string]: AbstractControl } {
    return this.firstFormGroup.controls;
  }

  get stepTwoFormControl(): { [key: string]: AbstractControl } {
    return this.secondFormGroup.controls;
  }

  get stepThreeFormControl(): { [key: string]: AbstractControl } {
    return this.thirdFormGroup.controls;
  }

  get stepFourFormControl(): { [key: string]: AbstractControl } {
    return this.fourthFormGroup.controls;
  }

  get stepFiveFormControl(): { [key: string]: AbstractControl } {
    return this.fifthFormGroup.controls;
  }

  saveStepTwo(formVal: any, stepper: MatStepper) {
    const invalid = [];
    const controls = this.secondFormGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    this.isSubmitted = true;
    if (this.secondFormGroup.invalid) {
      return;
    }
    let reqData = [];
    this.primaryFieldJson.forEach((element) => {
      let addArray: any;
      switch (element.fieldName) {
        case "First Name":
          addArray = {
            fieldName: "First Name",
            fieldValue: formVal.first_name,
          };
          reqData.push(addArray);
          break;
        case "Last Name":
          addArray = {
            fieldName: "Last Name",
            fieldValue: formVal.last_name,
          };
          reqData.push(addArray);
          break;

        case "Middle Name":
          addArray = {
            fieldName: "Middle Name",
            fieldValue: formVal.middle_name,
          };
          reqData.push(addArray);
          break;
        case "Date Of Birth":
          addArray = {
            fieldName: "Date Of Birth",
            fieldValue: formVal.dob,
          };
          reqData.push(addArray);
          break;
        case "Age":
          addArray = {
            fieldName: "Age",
            fieldValue: formVal.age,
          };
          reqData.push(addArray);
          break;

        case "Card ID":
          addArray = {
            fieldName: "Card ID",
            fieldValue: formVal.cardId,
          };
          reqData.push(addArray);
          break;

        case "Employee ID":
          addArray = {
            fieldName: "Employee ID",
            fieldValue: formVal.employeeId,
          };
          reqData.push(addArray);
          break;

        case "Gender":
          addArray = {
            fieldName: "Gender",
            fieldValue: formVal.gender,
          };
          reqData.push(addArray);
          break;

        case "Insurance From Date":
          addArray = {
            fieldName: "Insurance From Date",
            fieldValue: formVal.insValidityFrom,
          };
          reqData.push(addArray);
          break;

        case "Insurance To Date":
          addArray = {
            fieldName: "Insurance To Date",
            fieldValue: formVal.insValidityTo,
          };
          reqData.push(addArray);
          break;

        case "Insurance ID":
          addArray = {
            fieldName: "Insurance ID",
            fieldValue: formVal.insuranceId,
          };
          reqData.push(addArray);
          break;

        case "Insurance Holder Name":
          addArray = {
            fieldName: "Insurance Holder Name",
            fieldValue: formVal.insHolderName,
          };
          reqData.push(addArray);
          break;

        case "Policy ID":
          addArray = {
            fieldName: "Policy ID",
            fieldValue: formVal.policyId,
          };
          reqData.push(addArray);
          break;

        case "Reimbursement":
          addArray = {
            fieldName: "Reimbursement",
            fieldValue: formVal.reimbursment,
          };
          reqData.push(addArray);
          break;

        default:
          break;
      }
    });

    let finalReqData = {
      insurerType: formVal.healthExpense,
      primaryInsuredIdentity: reqData,
      pharmacyId: this.loggedId,
      claimObjectId: this.stepOneId,
    };    

    this.pharmacyService.commonInformationStep2FourPortal(finalReqData).subscribe({
      next: (res) => {

        let result = this.coreService.decryptContext(res);
        if (result.status) {
          this.coreService.setSessionStorage(2, "step");
          
          this.coreService.showSuccess(result.message, "");

          if (formVal.healthExpense == "secondaryInsurer") {
            stepper.next();
          } else {
            stepper.next();
            stepper.next();
          }
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      },
    });
  
  }

  saveStepThree(formVal: any, stepper: MatStepper) {
    this.isSubmitted = true;
    if (this.thirdFormGroup.invalid) {
      return;
    }
    let reqData = [];
    this.secondaryFieldJson.forEach((element) => {
      let addArray: any;
      switch (element.fieldName) {
        case "First Name":
          addArray = {
            fieldName: "First Name",
            fieldValue: formVal.first_namet,
          };
          reqData.push(addArray);
          break;
        case "Last Name":
          addArray = {
            fieldName: "Last Name",
            fieldValue: formVal.last_namet,
          };
          reqData.push(addArray);
          break;

        case "Middle Name":
          addArray = {
            fieldName: "Middle Name",
            fieldValue: formVal.middle_namet,
          };
          reqData.push(addArray);
          break;
        case "Date Of Birth":
          addArray = {
            fieldName: "Date Of Birth",
            fieldValue: formVal.dobt,
          };
          reqData.push(addArray);
          break;
        case "Age":
          addArray = {
            fieldName: "Age",
            fieldValue: formVal.aget,
          };
          reqData.push(addArray);
          break;

        case "Card ID":
          addArray = {
            fieldName: "Card ID",
            fieldValue: formVal.cardIdt,
          };
          reqData.push(addArray);
          break;

        case "Employee ID":
          addArray = {
            fieldName: "Employee ID",
            fieldValue: formVal.employeeIdt,
          };
          reqData.push(addArray);
          break;

        case "Gender":
          addArray = {
            fieldName: "Gender",
            fieldValue: formVal.gendert,
          };
          reqData.push(addArray);
          break;

        case "Insurance From Date":
          addArray = {
            fieldName: "Insurance From Date",
            fieldValue: formVal.insValidityFromt,
          };
          reqData.push(addArray);
          break;

        case "Insurance To Date":
          addArray = {
            fieldName: "Insurance To Date",
            fieldValue: formVal.insValidityTot,
          };
          reqData.push(addArray);
          break;

        case "Insurance ID":
          addArray = {
            fieldName: "Insurance ID",
            fieldValue: formVal.insuranceIdt,
          };
          reqData.push(addArray);
          break;

        case "Insurance Holder Name":
          addArray = {
            fieldName: "Insurance Holder Name",
            fieldValue: formVal.insHolderNamet,
          };
          reqData.push(addArray);
          break;

        case "Policy ID":
          addArray = {
            fieldName: "Policy ID",
            fieldValue: formVal.policyIdt,
          };
          reqData.push(addArray);
          break;

        case "Reimbursement":
          addArray = {
            fieldName: "Reimbursement",
            fieldValue: formVal.reimbursmentt,
          };
          reqData.push(addArray);
          break;

        case "Relation With The Primary Insured":
          addArray = {
            fieldName: "Relation With The Primary Insured",
            fieldValue: formVal.relationPrimaryt,
          };
          reqData.push(addArray);
          break;

        default:
          break;
      }
    });

    let finalReqData = {
      secondaryInsuredIdentity: reqData,
      pharmacyId: this.loggedId,
      claimObjectId: this.stepOneId,
    };


    this.pharmacyService.commonInformationStep3FourPortal(finalReqData).subscribe({
      next: (res) => {
        let result = this.coreService.decryptContext(res);
        if (result.status) {
          this.coreService.showSuccess(result.message, "");
          this.coreService.setSessionStorage(3, "step");
          stepper.next();
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      error: (err: ErrorEvent) => {
      },
    });
  }

  saveStepFour(formVal: any, stepper: MatStepper) {
    this.isSubmitted = true;
    if (this.fourthFormGroup.invalid) {
      return;
    }
    let reqData = {
      deliverCenterInfo: {
        deliverCenter: formVal.deliveryCenter,
        deliverFirstName: formVal.deliverStaff,
        deliverMiddleName: "",
        deliverLastName: "",
        deliverTitle: this.staffTitle,
        deliverTitleId: this.staffTitleId,
      },
      prescriberCenterInfo: {
        prescriberCenter: formVal.prescriberCenter,
        prescriberFirstName: formVal.prescriberFName,
        prescriberMiddleName: formVal.prescriberMName,
        prescriberLastName: formVal.prescriberLName,
        prescriberTitle: formVal.prescriberTitle,
        prescriberSpecialty: formVal.prescriberSpeciality,
      },
      pharmacyId: "",
      createdById: this.loggedId,
      claimObjectId: this.stepOneId,
    };

    this.pharmacyService.commonInformationStep4FourPortal(reqData).subscribe({
      next: (res) => {
        let result = this.coreService.decryptContext(res);
        if (result.status) {
          this.coreService.setSessionStorage(4, "step");
          this.coreService.showSuccess(result.message, "");
          if (this.selectclaimid == "" && this.selectclaimid == undefined) {
            this.fifthFormGroup.patchValue({
              accidentRelation: "Yes",
              resThirdParty: "Yes",
            });
          }

          stepper.next();
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      },
    });
  }

  previousStep(stepper: MatStepper) {
    if (
      this.coreService.getSessionStorage("checkSubscriber") ==
      "secondaryInsurer"
    ) {

      stepper.previous();
    } else {
      stepper.previous();
      stepper.previous();
    }
  }

  radioonChange(event: MatRadioChange) {

    this.secondFormGroup
      .get("healthExpense")
      .patchValue(this.coreService.getSessionStorage("checkSubscriber"));
    // provide some info
    // alert('This can not be changed');
    this.coreService.showInfo("This Value Cannot be changed", "");
  }

  saveStepFive(formVal: any) {
    this.isSubmitted = true;
    if (this.fifthFormGroup.invalid) {
      return;
    }

    let reqData = [];
    this.accidentFieldJson.forEach((element) => {
      let addArray: any;
      switch (element.fieldName) {
        case "First Name":
          addArray = {
            fieldName: "First Name",
            fieldValue: formVal.firstName,
          };
          reqData.push(addArray);
          break;
        case "Is It Related To An Accident":
          addArray = {
            fieldName: "Is It Related To An Accident",
            fieldValue: formVal.accidentRelation,
          };
          reqData.push(addArray);
          break;

        case "Accident Date":
          addArray = {
            fieldName: "Accident Date",
            fieldValue: formVal.accidentDate,
          };
          reqData.push(addArray);
          break;
        case "Accident Type":
          addArray = {
            fieldName: "Accident Type",
            fieldValue: formVal.accidentType,
          };
          reqData.push(addArray);
          break;
        case "Is There An Official Report":
          addArray = {
            fieldName: "Is There An Official Report",
            fieldValue: formVal.officialReport,
          };
          reqData.push(addArray);
          break;

        case "Is There A Responsible Third Party":
          addArray = {
            fieldName: "Is There A Responsible Third Party",
            fieldValue: formVal.resThirdParty,
          };
          reqData.push(addArray);
          break;

        case "Last Name":
          addArray = {
            fieldName: "Last Name",
            fieldValue: formVal.lastName,
          };
          reqData.push(addArray);
          break;

        case "Phone Number":
          addArray = {
            fieldName: "Phone Number",
            fieldValue: formVal.phoneNumber,
          };
          reqData.push(addArray);
          break;
        case "Address":
          addArray = {
            fieldName: "Address",
            fieldValue: formVal.address,
          };
          reqData.push(addArray);
          break;

        case "Additional Information":
          addArray = {
            fieldName: "Additional Information",
            fieldValue: formVal.addItionalInformation,
          };
          reqData.push(addArray);
          break;

        case "Comment":
          addArray = {
            fieldName: "Comment",
            fieldValue: formVal.coment,
          };
          reqData.push(addArray);
          break;

        default:
          break;
      }
    });

    let finalReqData = {
      accidentRelatedField: reqData,
      pharmacyId: this.loggedId,
      claimObjectId: this.stepOneId,
    };


    this.pharmacyService.commonInformationStep5FourPortal(finalReqData).subscribe({
      next: (res) => {
        let result = this.coreService.decryptContext(res);
        if (result.status) {
          this.coreService.setSessionStorage(5, "step");
          this.coreService.showSuccess(result.message, "");
          // this.coreService.setInsObjectid(this.insuranceId);
          this.insuranceId = this.coreService.getSessionStorage("InsuranceId");

          this.coreService.setInsuranceId(this.insuranceId);

          this.mstepper.next();
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      error: (err: ErrorEvent) => {
      },
    });
  }

  public redirectToMainStepper() {
    this.stepOneId = this.coreService.getSessionStorage("stepOneId");
    this.insuranceId = this.coreService.getSessionStorage("InsuranceId");
    this.stepDetails = this.coreService.getSessionStorage("step");

    if (
      this.stepOneId == null ||
      this.insuranceId == null ||
      this.stepDetails != 5
    ) {
      this.coreService.showError(
        "You have to fill all the details of step 1 common information",
        ""
      );
      this.router.createUrlTree(["/pharmacy/medicinclaims"]);
    } else {
      this.mstepper.next();
    }
  }

  indexOf2d(array2d: any, itemtofind: string) {

    return (
      [].concat.apply([], [].concat.apply([], array2d)).indexOf(itemtofind) !==
      -1
    );
  }

 

  getAllTitleLists(sort: any = '') {
    let reqData = {
      page: this.page,
      limit: 1000,
      userId: "",
      searchText: "",
      sort: sort
    };

    this._superAdminService.TitleLists(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this.coreService.decryptObjectData(encryptedData);
      this.specialityservicedataSource = response?.body?.data;
      this.getRecordByCustomId(this.customIdMatchRecord)

    });
  }

  async getRecordByCustomId(customId: any) {
    return new Promise(resolve => {
      this.matchedRecord = this.specialityservicedataSource.find(record => record._id === customId);
      this.fourthFormGroup.patchValue({

        prescriberTitle:
          this.matchedRecord?.title,
        
      });

      resolve(this.matchedRecord);
    });
  }



  prescData: any;
  ePrescNumber: any = "";

  async searchWithEprescriptionNumber(ePrescriptionNumber) {

    if (ePrescriptionNumber) {
      let reqData = {
        ePrescriptionNumber: ePrescriptionNumber,
      };

      this._pharmacyService
        .getEprescriptionDetailsForMedicineClaim(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });

          if (response.body.subscriberId == "") {
            this.coreService.showError("This EPrisctiption number do not have any health plan.", "");
          } else {
            if (response.status) {
              this.ePrescNumber = ePrescriptionNumber;

              this.coreService.setEprescriptionData(response?.body); //Subject Behaviour Set Data ofrMedoicine patch
              this.coreService.showSuccess(response.message, "");


              this.getAllTitleLists();
              this.customIdMatchRecord = response?.body?.prescriberCenterDetails?.prescriberTitle

              this.prescData = response?.body;
              this.firstFormGroup.patchValue({
                insuranceId: response?.body?.insuranceId,
                patientId: response?.body?.subscriberId,
              });
              this.insuranceSelectedId = response?.body?.insuranceId;
              this.insuranceId = response?.body?.insuranceId;
              this.patientSelectedId = response?.body?.subscriberId;

              this.fourthFormGroup.patchValue({
                prescriberCenter:
                  response?.body?.prescriberCenterDetails?.prescriberCenter,
                prescriberFName:
                  response?.body?.prescriberCenterDetails?.prescriberFirstName,
                prescriberLName:
                  response?.body?.prescriberCenterDetails?.prescriberLastName,
                prescriberMName:
                  response?.body?.prescriberCenterDetails?.prescriberMiddleName,
             
                prescriberSpecialty:
                  response?.body?.prescriberCenterDetails?.prescriberSpeciality,
              });

              this.prescriberSpecialitydefault =
                response?.body?.prescriberCenterDetails?.prescriberSpeciality;
            } else {
              this.ePrescNumber = "";
              this.coreService.showError(response.message, "");
            }
          }

        });
    } else {
      this.ePrescNumber = "";
      this.coreService.showError("Please Enter ePrescription Number", "");
    }
  }

  sendDataToParent() {
    const data = "Hello from child!";
    this.dataEvent.emit(data);
  }

  getPatientDetails(patient_id: string) {
    const insuranceNo = ''
    const subscriber_id = this.orderDetails.orderData.subscriber_id
    this._pharmacyService.patientProfile(patient_id, insuranceNo, subscriber_id).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.insuranceId = response.body.profileData.in_insurance.insurance_id;
        this.insuranceSelectedId = this.insuranceId
        this.firstFormGroup.patchValue({
          insuranceId: this.insuranceId,
          requestType: "medical-products",
          patientId: this.subscriberId,
          claimNumber: '',
        });

      }
    });
  }


  public getOrderDetails(): void {
    const orderDetailRequest: any = {
      for_portal_user: this.logginIdOrder,
      for_order_id: this.orderId,
      portal_type: this.loggedType
    };
    this.patientService.fetchOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result1: any) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        this.orderDetails = result?.data
        if (result.status === true) {
          this.deliveryCenterselected = this.logginIdOrder;
          this.subscriberId = result?.data?.orderData?.subscriber_id;
          this.getPatientDetails(result.data.orderData.patient_details.user_id);
        }
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
      },
    });
  }



}
