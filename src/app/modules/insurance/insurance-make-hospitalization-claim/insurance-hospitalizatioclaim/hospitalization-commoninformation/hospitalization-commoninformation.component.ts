import { BreakpointObserver } from "@angular/cdk/layout";
import { StepperOrientation } from "@angular/cdk/stepper";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { IEncryptedResponse } from "src/app/shared/classes/api-response";
import { SuperAdminStaffResponse } from "src/app/modules/super-admin/super-admin-staffmanagement/addstaff/addstaff.component.type";
import { PatientService } from "../../../../patient/patient.service";
import { elections } from "@igniteui/material-icons-extended";
import { timeStamp } from "console";

@Component({
  selector: 'app-hospitalization-commoninformation',
  templateUrl: './hospitalization-commoninformation.component.html',
  styleUrls: ['./hospitalization-commoninformation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HospitalizationCommoninformationComponent implements OnInit {
  @Input() public mstepper: MatStepper;
  @Output() locations = new EventEmitter<string>();
  @ViewChild("commentinfo", { static: false }) commentinfo: any;
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
  disable: boolean = false;
  checkAccidentVal: any = "No";
  checkResThirdParty: any = "Yes";
  showDeliverCentre: boolean = false;
  newDeliverCentre: boolean = false;
  firstFormGroup = this._formBuilder.group({
    insuranceId: new FormControl("", [Validators.required]),
    patientId: new FormControl("", [Validators.required]),
    ePrescriptionNumber: new FormControl(),
    pharmacyId: new FormControl(""),
    requestType: new FormControl(""),
    claimNumber: new FormControl(""),
    service: new FormControl(""),
    hospitalizationCategory: new FormControl("")
  });
  commentInfo: any = "";

  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  searchText: any = "";

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
    deliveryCenter: new FormControl("", []),
    deliverFName: new FormControl(""),
    // deliverMName: new FormControl('', [Validators.required]),
    // deliverLName: new FormControl('', [Validators.required]),
    deliverTitle: new FormControl("", []),
    deliverStaff: new FormControl("", []),
    prescriberCenter: new FormControl("", []),
    prescriberFName: new FormControl("", []),
    prescriberMName: new FormControl(""),
    prescriberLName: new FormControl("", []),
    prescriberTitle: new FormControl("", []),
    prescriberSpeciality: new FormControl("", []),
    doctorList: new FormControl("", []),
    hospitalCenter: new FormControl("", []),
    hospitalName: new FormControl("", [Validators.required]),
    hospitalAddress: new FormControl("", [Validators.required]),
    hospitalIfuNumber: new FormControl("", [Validators.required]),
    hospitalRccmNumber: new FormControl("", [Validators.required]),
    hospitalPhoneNumber: new FormControl("", [Validators.required]),
    hospitalEmail: new FormControl("", [Validators.required]),
    hospitalFaxNo: new FormControl("", [Validators.required]),
    // other_deliver_center: new FormControl("", []),
    // other_deliver_title: new FormControl("", []),
    // other_staff_name: new FormControl("", []),
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


  newDoctor_form = this._formBuilder.group({
    first_name: ["", [Validators.required]],
    last_name: ["", [Validators.required]],
    email: ["", [Validators.required]]
  });

  roleForm = this._formBuilder.group({
    name: ["", [Validators.required]],
    status: [true],
  });

  newDoctorStaff_form = this._formBuilder.group({
    first_name: ["", [Validators.required]],
    last_name: ["", [Validators.required]],
    email: ["", [Validators.required]]
  });

  newHospital_form = this._formBuilder.group({
    first_name: ["", [Validators.required]],
    last_name: ["", [Validators.required]],
    email: ["", [Validators.required]],
    hospital_name:["", [Validators.required]],
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
  editClaimData: any = "";
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
  selectKeyPressValue: any = [];
  @Output() dataEvent = new EventEmitter<string>();

  selectedDeliveryStaff: any = "";
  loggedRole: any;
  adminData: any;
  locationFor: any;
  locationSlected: any;
  specialityservicedataSource: any;
  DoctorList: any;
  hospitalId: any;
  doctorId: any;
  doctorIdloggedIn: any = "";
  doctorList: any;
  prescriberCenter1: any = '';
  prescriberCenter: any;
  locationList12: any;
  locationId: any;
  doctorList1: any;
  docList: any[];
  loggedNameDoctor: any;
  loggedfirst_name: any;
  loggedmiddle_name: any;
  loggedlast_name: any;
  specialityId: any;
  specialtyListData: any;
  hospitalCenter: any;
  checkHopitalCategoryVal: any = "Hospitalization Statement";
  claimtype: any;
  hospitalDetails: any;
  locationHospital: any;
  patientDataAll: any;
  insuranceiD: any;
  requestedamountAll: any;
  insuranceselectedname: any;
  doctorListAllHospitalization: any;
  DoctorList2: { value: string; label: any; }[];
  doctorlist: any[];
  loggedInRole: any;
  adminDataId: any;
  insuranceIdAdmin: any;
  loggedInRoleloginData: any;
  DoctorIdByRole: any;
  locationList12Data: any = [];
  showAddDoctorButton: boolean = false;
  showAddHospButton: boolean = false;

  selectedRole: any;
  newDeliverRole: boolean;
  // selectedRole: string;
  // selectedStaff: string;
  // showOtherStaff: boolean;



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
    private hospitalservice: HospitalService,
    private indivudualDoctorService: IndiviualDoctorService,
    private _coreService: CoreService,
    private patientService: PatientService,

  ) {
    // this.ngxService.start();
    this.nested_stepperOrientation = breakpointObserver
      .observe("(min-width: 768px)")
      .pipe(map(({ matches }) => (matches ? "horizontal" : "vertical")));

    this.loggedId = this.coreService.getLocalStorage("loginData")._id;
    this.loggedRole = this.coreService.getLocalStorage("loginData").role;
    this.insuranceIdAdmin = this.coreService.getLocalStorage("adminData").for_user;
    // this.adminData = this.coreService.getLocalStorage("adminData").in_hospital;
    if (this.loggedRole == "INDIVIDUAL_DOCTOR") {
      this.doctorIdloggedIn = this.loggedId;
    }



    this.deliveryCenterselected = this.loggedId;
    this.loggedInRoleloginData = this.coreService.getLocalStorage("loginData").role;
    this.loggedInRole = this.coreService.getLocalStorage("adminData").role;
    this.adminDataId = this.coreService.getLocalStorage("adminData").for_user;



    sessionStorage.removeItem("stepOneId");
    sessionStorage.removeItem("claimId");
    sessionStorage.removeItem("service");
    sessionStorage.removeItem("subscriberid");
    sessionStorage.removeItem("step");
    sessionStorage.removeItem("InsuranceId");
    sessionStorage.removeItem("checkSubscriber");
    this.getAllTitleLists();
    this.allDoctorsHopitalizationList()

    this.route.queryParams.subscribe((params: any) => {

      this.selectclaimid = params.claim_id;
      this.type = params.type;
      this.claimtype = params.claimtype;
    });

    if (this.type == undefined) {
      this.type = '';
    }
    if (this.claimtype == undefined) {
      this.claimtype = '';
    }

    if (this.selectclaimid != "" && this.selectclaimid != undefined) {
      this.getClaimDetails();
    }




  }
  private async getClaimDetails() {
    this.pharmacyService.medicineClaimDetailsPharmacyClaimObjectIdHopitalization(this.selectclaimid).subscribe({
      next: async (res) => {
        let encData = await res;
        let result = await this.coreService.decryptContext(encData);
        if (result.status) {
          let claimData = result.data[0];
          this.editClaimData = claimData;
          console.log("this.editClaimData___________", this.editClaimData);

          this.insuranceSelectedId = claimData?.insuranceId;

          this.firstFormGroup.patchValue({

            requestType: claimData?.requestType,
            patientId: claimData?.patientId,
            claimNumber: claimData?.claimNumber,
          });

          // this.fourthFormGroup.patchValue({
          //   other_deliver_center:
          //     this.editClaimData?.deliverCenterInfo?.other_deliver_center,
          //     other_deliver_title:
          //     this.editClaimData?.deliverCenterInfo?.other_deliver_title,
          //   other_staff_name:
          //     this.editClaimData?.deliverCenterInfo?.other_staff_name,        

          // });

          this.fourthFormGroup.patchValue({
            prescriberCenter:
              claimData.prescriberCenterInfo?.prescriberCenter,
            hospitalName:
              claimData.prescriberCenterInfo?.hospitalName,
            hospitalAddress:
              claimData.prescriberCenterInfo?.hospitalAddress,
            hospitalIfuNumber:
              claimData.prescriberCenterInfo?.hospitalIfuNumber,
            hospitalRccmNumber:
              claimData.prescriberCenterInfo?.hospitalRccmNumber,
            hospitalPhoneNumber:
              claimData.prescriberCenterInfo?.hospitalPhoneNumber,
            hospitalEmail:
              claimData.prescriberCenterInfo?.hospitalEmail,
            hospitalFaxNo:
              claimData.prescriberCenterInfo?.hospitalFaxNo,

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

          this.selectedDeliveryStaff =
            claimData?.deliverCenterInfo?.deliverFirstName;

          this.prescriberSpecialitydefault =
            claimData?.prescriberCenterInfo?.prescriberSpecialty;

          if (claimData?.deliverCenterInfo?.deliverTitleId != undefined) {
            const params = {
              hospitalId: this.loggedId,
              page: this.page,
              limit: this.pageSize,
              searchText: this.searchText,
              role: claimData?.deliverCenterInfo?.deliverTitleId,
              sort: ""
            };

            this.indivudualDoctorService.getAllStaff(params).subscribe({
              next: async (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
                const decryptedData = await this._coreService.decryptObjectData({
                  data: result,
                });
                if (decryptedData.status) {


                  const data = [];
                  for (const staff of decryptedData.body[0].paginatedResults) {
                    data.push({
                      staffname: staff.profileinfos.name,
                      role: staff.role !== undefined ? staff.roles.name : "",
                      phone: staff.portalusers?.mobile,
                      datejoined: this._coreService.createDate(new Date(staff.createdAt)),
                      id: staff.portalusers._id,
                      is_locked: staff.portalusers.lock_user,
                      is_active: staff.portalusers.isActive,
                    });
                  }

                  const checkstaff = this.staffRole.find(
                    (obj) => obj._id === claimData?.deliverCenterInfo?.deliverTitleId
                  );
                  this.staffTitle = checkstaff?.name;
                  this.staffTitleId = claimData?.deliverCenterInfo?.deliverTitleId;


                  // this.deliverStaffselected =
                  //   claimData?.deliverCenterInfo?.deliverFirstName;
                  data.map((curentval, index) => {
                    if (this.deliverStaff.indexOf({
                      label: curentval?.staffname,
                      value: curentval?.staffname,
                    }) == -1) {
                      this.deliverStaff.push({
                        label: curentval?.staffname,
                        value: curentval?.staffname,
                      });
                    }
                  });
                }
                else {
                  this.staffTitle = "";
                  this.staffTitleId = "";
                }
                // this.totalLength = decryptedData.body[0].totalCount[0]?.count;
                // this.dataSource = data;
                // this._coreService.showSuccess("", "Staff loaded successfully");
              },
              error: (err: ErrorEvent) => {

                // this._coreService.showError("", "Staff Load Failed");
              },
            });

            this.firstFormGroup.patchValue({ service: claimData?.service });
          }
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      error: (err: ErrorEvent) => {
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
    // this.getAllDetails();
    this.getAllInsurance();
    this.getInsuranceAcceptedListDoctor();
    this.getSpecialty();
    this.getLocations();
    this.getAllHospitalList();

    // this.getAllPatient();
    // this.ngxService.stop();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value || ""))
    );

    if (this.loggedRole == "INDIVIDUAL_DOCTOR" || this.loggedRole == "HOSPITAL_DOCTOR") {
      // this.doctorList;
      this.doctorList = [];

      this.doctorList.push({
        first_name: this.loggedfirst_name,
        middle_name: this.loggedmiddle_name,
        last_name: this.loggedlast_name

      }
      );
      this.fourthFormGroup.patchValue({
        doctorList: this.doctorList
      });
    }
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
        // this.specialtyList = this.specialtyListData
        if (this.loggedRole == "INDIVIDUAL_DOCTOR") {
          // this.specialityId = this.coreService.getLocalStorage("adminData").speciality;
          let matchingRecord = this.specialtyListData.find(record => record._id === this.specialityId);
          const matchedRecordsArray = [matchingRecord];
          this.specialtyList.push(matchedRecordsArray);
        }
        else {
          this.specialtyList = this.specialtyListData
        }
      },
      error: (err) => {
      },
    });
  }
  getAllTitleLists(sort: any = '') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.loggedId,
      searchText: this.searchText,
      sort: sort
    };

    this._superAdminService.TitleLists(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this.coreService.decryptObjectData(encryptedData);
      this.totalLength = response?.body;
      this.specialityservicedataSource = response?.body?.data;

    });
  }


  getAllRole(event) {

    this.DoctorIdByRole = event;
    let param = {
      userId: this.DoctorIdByRole,
      page: 1,
      limit: 0,
      searchText: "",
    };

    this.indivudualDoctorService.getAllRole(param).subscribe((res) => {
      let result = this._coreService.decryptObjectData({ data: res });
console.log("result__________",result);

      if (result?.status) {
        let roleArray = [];

        result?.body?.data.map((curentval, index: any) => {
          console.log("curentval___________",curentval);
          
          if (this.staffRole.indexOf({
            label: curentval?.name,
            value: curentval._id
          }) == -1) {
            roleArray.push({
              label: curentval?.name,
              value: curentval._id
            })
          }
        });
        this.staffRole = roleArray
        this.newDeliverCentre = true

        if (this.editClaimData != '') {
          this.deliverTitleselected = this.editClaimData?.deliverCenterInfo?.deliverTitleId;
        }

      }
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
        // console.log(res);
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
        this.firstFormGroup.patchValue({ requestType: "hospital-claim" });
      }
      this.firstFormGroup.patchValue({ service: target });
      // this.medicineName = target.value;
    } else {
      this.firstFormGroup.patchValue({ service: "" });
    }
  }
  getStaffDetails(event: any) {
    console.log("event___________",event);
    let roleId = event
    this.selectedRole = event.value;
    if (this.DoctorIdByRole === undefined) {
      return;
    }

    const params = {
      hospitalId: this.DoctorIdByRole,
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      role: event.value ? event.value : roleId,
      sort: ""
    };

    this.indivudualDoctorService.getAllStaff(params).subscribe({
      next: async (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
        const decryptedData = await this._coreService.decryptObjectData({
          data: result,
        });
        if (decryptedData.status) {

          const data = [];
          for (const staff of decryptedData.body[0].paginatedResults) {
            data.push({
              staffname: staff.profileinfos.name,
              role: staff.role !== undefined ? staff.roles.name : "",
              phone: staff.portalusers?.mobile,
              datejoined: this._coreService.createDate(new Date(staff.createdAt)),
              id: staff.portalusers._id,
              is_locked: staff.portalusers.lock_user,
              is_active: staff.portalusers.isActive,
            });
          }

          const checkstaff = this.staffRole.find(
            (obj) => obj._id === event.value
          );
          this.staffTitle = checkstaff?.name;
          this.staffTitleId = event.value;
          data.map((curentval, index) => {
            this.deliverStaff.push({
              label: curentval?.staffname,
              value: curentval?.staffname,
            });
          });

          this.newDeliverRole = true;

          if (this.editClaimData != '') {
            this.deliverStaffselected = this.editClaimData?.deliverCenterInfo?.deliverFirstName;

          }
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err, "err");
      },
    });

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

  checkHopitalCategory(event) {
    this.checkHopitalCategoryVal = event.value;
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
      this.serviceMessage = "";
      await this.getAllSubscriber();
      await this.getPrimaryInsuredField();
      await this.getSecondaryInsurerField();
      await this.getAccidentField();
    }
  }

  private getAllSubscriber() {
    var param: any;
    if (this.loggedInRoleloginData == "INSURANCE_STAFF") {
      param = {
        for_portal_user: this.insuranceIdAdmin
      };
    } else {
      param = {
        for_portal_user: this.insuranceId,
      };
    }


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

    const requestData = {
      insuranceId: this.insuranceId,
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
      insuranceId: this.insuranceId,
    };

    this.secondaryFieldList = [];
    this.secondaryFieldJson = "";
    this.pharmacyService.getAllSecondaryInsuredFields(requestData).subscribe({
      next: async (res) => {
        const encryptedData = await res;
        if (encryptedData) {
          let result = this.coreService.decryptContext(encryptedData);
          // console.log("secondary insured field", result);

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
          // console.log("secondary field list", this.secondaryFieldList);
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
      insuranceId: this.insuranceId,
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

  // private getAllPatient() {
  //   this.pharmacyService.getAllPatientList().subscribe({
  //     next: async (res) => {
  //       const patientList = await res;
  //       if (patientList) {
  //         let result = this.coreService.decryptContext(res);
  //         console.log(result);
  //         if (result.status) {
  //           this.patientList = result.body;
  //         } else {
  //           this.coreService.showError(result.message, '');
  //         }
  //         console.log(this.patientList)
  //       }
  //     },
  //     error: (err: ErrorEvent) => {
  //       console.log(err.message);
  //     }
  //   });
  // }

  public getPatientDetails(insPortalId: any) {
  }

  // private getAllInsurance() {
  //   const param = {
  //     page: 1,
  //     limit: 1000,
  //     searchText: "",
  //     startDate: "",
  //     endDate: "",
  //   };
  //   this.pharmacyService.getApprovedInsurance(param).subscribe({
  //     next: async (res) => {
  //       const encryptedData = await res;

  //       let result = this.coreService.decryptObjectData(encryptedData);
  //       console.log("insurance details", result);



  //       if (result.status) {
  //         console.log(this.insuraneList, "this.insuraneList this.insuraneList ");

  //         result.body.result.forEach((currentVal, index) => {
  //           console.log(currentVal, "898989");

  //           if (this.insuranceiD?.includes(currentVal.for_portal_user._id)) {
  //             this.insuranceselectedname = currentVal.company_name
  //           }
  //         });

  //         this.firstFormGroup.patchValue({
  //           insuranceId: this.insuranceselectedname
  //         })

  //         this.getInsuranceId(this.insuranceiD)

  //       } else {
  //         this.coreService.showError(result.message, "");
  //       }
  //       console.log(this.insuraneList);
  //     },
  //     error: (err: ErrorEvent) => {
  //       console.log(err.message);
  //     },
  //   });
  // }

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
      // this.loggedId = this.adminDataId;
      let companyname = this.coreService.getLocalStorage("adminData").adminCompanyName;
      this.insuranceselectedname = companyname;
      this.insuranceiD = this.adminDataId
      this.firstFormGroup.patchValue({
        insuranceId: this.insuranceselectedname
      })
      this.getInsuranceId(this.insuranceiD)
    }
  }
  private getInsuranceAcceptedListDoctor() {
    let param;
    if (this.loggedRole == "INDIVIDUAL_DOCTOR_STAFF") {
      param = {
        doctorId: this.adminData
      };
    } else {
      param = {
        doctorId: this.loggedId
      };
    }

    // this.pharmacyService.getApprovedInsurance(param).subscribe({
    this.pharmacyService.getInsuranceAcceptedListDoctor(param).subscribe({

      next: async (res) => {

        const encryptedData = await res;


        let result = this.coreService.decryptObjectData({ data: encryptedData });
        if (result.status) {
          // this.insuraneList = result.body.result;

          result.body.map((curentval, index) => {
            if (this.insuraneList.indexOf({
              label: curentval.company_name,
              value: curentval._id,
            }) == -1) {
              this.insuraneList.push({
                label: curentval.company_name,
                value: curentval._id,
              });
            }
          });
        } else {
          // this.coreService.showError(res.body.message, "");
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      },
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
          formVal.pharmacyId = "";
          formVal.createdById = this.loggedId;
          formVal.claimId = "";
          formVal.created_by = this.loggedRole;
          formVal.claimType = "hospitalization"
          formVal.requestType = this.checkHopitalCategoryVal;
          formVal.insuranceId = this.insuranceiD;
          if (this.selectclaimid) {
            formVal.claimId = this.selectclaimid;
          }
          if (this.type === "pre_auth") {
            formVal.preAuthReclaimId = this.selectclaimid;
            formVal.claimId = "";
            formVal.requestType = "pre-auth";
          }

          if (this.claimtype == "Hospitalization Extention") {
            formVal.preAuthReclaimId = this.selectclaimid;
            formVal.claimId = "";
            formVal.requestType = "Hospitalization Extention";
          } else if (this.claimtype == "Hospitalization Final Claim") {
            formVal.preAuthReclaimId = this.selectclaimid;
            formVal.claimId = "";
            formVal.requestType = "Hospitalization Final Claim";
          }

          // console.clear();
          // return;

          this.pharmacyService.commoninformationStep1HospitalClaim(formVal).subscribe({
            next: async (res) => {
              // this.ngxService.stop();
              const encData = await res;
              let result = this.coreService.decryptContext(encData);

              if (result.status) {
                this.stepOneId = result.data._id;
                this.coreService.setSessionStorage(result.data._id, "stepOneId");
                this.coreService.setSessionStorage(1, "step");
                this.coreService.setSessionStorage(result.data.claimId, "claimId");
                this.coreService.setSessionStorage(result.data.service, "service");
                this.coreService.setSessionStorage(
                  result.data.patientId,
                  "subscriberid"
                );
                this.coreService.showSuccess(result.message, "");
                this.coreService.setSessionStorage(
                  result.data.insuranceId,
                  "InsuranceId"
                );
                this.coreService.setSessionStorage(this.checkHopitalCategoryVal, "HopitalCategoryVal");
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
    console.log(formVal);
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
      createdById: this.loggedId,
      claimObjectId: this.stepOneId,
    };

    // console.clear();


    // return;

    this.pharmacyService.commoninformationStep2HospitalClaim(finalReqData).subscribe({
      next: (res) => {

        let result = this.coreService.decryptContext(res);
        if (result.status) {
          this.coreService.setSessionStorage(2, "step");
          // this.coreService.setSessionStorage(
          //   formVal.insuranceId,
          //   "InsuranceId"
          // );
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
    // stepper.next();
    // stepper.next();
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
      createdById: this.loggedId,
      claimObjectId: this.stepOneId,
    };


    this.pharmacyService.commoninformationStep3HospitalClaim(finalReqData).subscribe({
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
        console.log(err.message);
      },
    });
  }

  onPrescriberCenterChange(selectedLocation: any) {
    console.log("selectedLocation_______", selectedLocation);
    if (selectedLocation) {

      let filterObject = this.locationList12?.filter(obj => obj['hospital_name'] === selectedLocation);
      // this.locationFor = filterObject[0]?.locationFor;
      // this.locationSlected = filterObject[0]?.hospital_name ? filterObject[0]?.hospital_name : "Others"
      this.locationFor = filterObject[0]?.locationFor;
      this.locationSlected = filterObject[0]?.hospital_name
      this.locationId = filterObject[0]?.for_portal_user?._id;
      let hospitalId = filterObject[0]?._id;
      this.locationHospital = filterObject[0]?.location;

      this.getAssociationdetails(hospitalId)
      this.getDoctorList();

      this.fourthFormGroup.patchValue({
        hospitalName: filterObject[0]?.hospital_name,
        hospitalIfuNumber: filterObject[0]?.ifu_number,
        hospitalAddress: filterObject[0]?.location,
        hospitalRccmNumber: filterObject[0]?.rccm_number,
        hospitalPhoneNumber: filterObject[0]?.main_phone_number,
        hospitalEmail: filterObject[0]?.for_portal_user.email,
        hospitalFaxNo: filterObject[0]?.fax_number,
      });
    }
  }

  getAssociationdetails(hospitalId) {
    this.hospitalservice.hospitalDetailsById(hospitalId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // console.log("hospitaldetails", response);
      this.hospitalDetails = response?.body;
      this.fourthFormGroup.patchValue({
        hospitalName: this.hospitalDetails.hospital_name,
        hospitalIfuNumber: this.hospitalDetails.ifu_number,
        hospitalAddress: this.locationHospital,
        hospitalRccmNumber: this.hospitalDetails.rccm_number,
        hospitalPhoneNumber: this.hospitalDetails.main_phone_number,
        hospitalEmail: this.hospitalDetails.for_portal_user.email,
        hospitalFaxNo: this.hospitalDetails.fax_number,
        // hospitalRccmNumber:
      });
    });
  }

  // onPrescriberDoctorList(doctorName: any) {
  //   console.log(`doctorName`, doctorName);
  //   let doctorNamedata = doctorName?.split("-");
  //   this.fourthFormGroup.patchValue({
  //     hospitalName: doctorNamedata[0],
  //     hospitalIfuNumber: doctorNamedata[2],
  //     hospitalAddress: doctorNamedata[1],
  //     // hospitalRccmNumber:
  //   });

  // }


  saveStepFour(formVal: any, stepper: MatStepper) {
    this.isSubmitted = true;
    if (this.fourthFormGroup.invalid) {
      this.coreService.showError("", "Please fill all the fields.")
      return;
    }
    let reqData = {
      deliverCenterInfo: {
        // deliverCenter: formVal.deliveryCenter && formVal.deliveryCenter !== 'Others' ? formVal.deliveryCenter : null,
        deliverCenter: formVal.deliveryCenter,
        deliverFirstName: formVal.deliverStaff,
        deliverMiddleName: "",
        deliverLastName: "",
        deliverTitle: this.staffTitle,
        deliverTitleId: this.staffTitleId,
        // deliverTitle: this.staffTitle ? this.staffTitle  : 'Others',
        // deliverTitleId: this.staffTitleId ? this.staffTitleId : null,
        // other_deliver_center:formVal.other_deliver_center,
        // other_deliver_title:formVal.other_deliver_title,
        // other_staff_name:formVal.other_staff_name
      },
      prescriberCenterInfo: {
        prescriberCenter: "",
        prescriberFirstName: "",
        prescriberMiddleName: "",
        prescriberLastName: "",
        prescriberTitle: "",
        prescriberSpecialty: "",
        doctorList: "",
        hospitalCenter: this.locationSlected,
        // hospitalCenter: this.locationSlected ? this.locationSlected : null,
        hospitalName: formVal.hospitalName,
        hospitalAddress: formVal.hospitalAddress,
        hospitalIfuNumber: formVal.hospitalIfuNumber,
        hospitalRccmNumber: formVal.hospitalRccmNumber,
        hospitalPhoneNumber: formVal.hospitalPhoneNumber,
        hospitalEmail: formVal.hospitalEmail,
        hospitalFaxNo: formVal.hospitalFaxNo
      },
      createdById: this.loggedId,
      claimObjectId: this.stepOneId,
      locationFor: this.locationFor
    };




    this.pharmacyService.commoninformationStep4HospitalClaim(reqData).subscribe({
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
      createdById: this.loggedId,
      claimObjectId: this.stepOneId,
    };


    this.pharmacyService.commoninformationStep5HospitalClaim(finalReqData).subscribe({
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
        console.log(err.message);
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
    // console.log([].concat.apply([], ([].concat.apply([], array2d))));

    return (
      [].concat.apply([], [].concat.apply([], array2d)).indexOf(itemtofind) !==
      -1
    );
  }

  // myFilter = (d: Date | null): any => {
  //   const day = (d || new Date()).getDay();
  //   return day !== 0 && day !== 6;
  // };

  prescData: any;
  ePrescNumber: any = "";

  searchWithEprescriptionNumber(ePrescriptionNumber) {

    if (ePrescriptionNumber) {
      let reqData = {
        ePrescriptionNumber: ePrescriptionNumber,
      };

      this._pharmacyService
        .getEprescriptionDetailsForMedicineClaim(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });

          if (response.status) {
            this.ePrescNumber = ePrescriptionNumber;

            this.coreService.setEprescriptionData(response?.body); //Subject Behaviour Set Data ofrMedoicine patch
            this.coreService.showSuccess(response.message, "");

            this.prescData = response?.body;
            this.firstFormGroup.patchValue({
              ePrescriptionNumber: ePrescriptionNumber,
              insuranceId: response?.body?.insuranceId,
              patientId: response?.body?.subscriberId,
            });
            this.insuranceSelectedId = response?.body?.insuranceId;
            this.insuranceId = response?.body?.insuranceId;
            this.patientSelectedId = response?.body?.subscriberId;

            this.fourthFormGroup.patchValue({
              hospitalCenter:
                response?.body?.prescriberCenterInfo?.hospitalCenter,
              hospitalName:
                response?.body?.prescriberCenterInfo?.hospitalName,
              hospitalIfuNumber:
                response?.body?.prescriberCenterInfo?.hospitalIfuNumber,
              hospitalAddress:
                response?.body?.prescriberCenterInfo?.hospitalAddress,
              hospitalPhoneNumber:
                response?.body?.prescriberCenterInfo?.hospitalPhoneNumber,
              hospitalFaxNo:
                response?.body?.prescriberCenterInfo?.hospitalFaxNo,
              hospitalEmail: response?.body?.prescriberCenterInfo?.hospitalEmail,
              hospitalRccmNumber: response?.body?.prescriberCenterInfo?.hospitalRccmNumber,
            });

            this.prescriberSpecialitydefault =
              response?.body?.prescriberCenterInfo?.prescriberSpeciality;
            this.doctorList1 =
              response?.body?.prescriberCenterInfo?.doctorList;
            this.hospitalCenter = response?.body?.prescriberCenterInfo?.hospitalCenter;

          } else {
            this.ePrescNumber = "";
            this.coreService.showError(response.message, "");
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

  locationList: any;
  getLocations() {
    let param: any;
    if (this.loggedRole == "INDIVIDUAL_DOCTOR_STAFF") {
      param = {
        doctorId: this.adminData
      };
    } else {
      param = {
        doctorId: this.loggedId
      };
    }

    this.hospitalservice.getLocations(param.doctorId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.locationList = response?.data[0]?.hospital_or_clinic_location;
      this.locations.emit(response?.data[0]?.hospital_or_clinic_location);
    });
  }




  getAllHospitalList(sort: any = '') {
    // this.pushColumns();
    let reqData = {
      insuranceId: this.insuranceId
    };


    this.hospitalservice.getInsuranceAcceptedHospitalList(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.locationList12 = response?.data;
      this.locationList12Data = [];

      // this.locationList12Data = [{
      //   label: "Others",
      //   value: "Others",
      // }];
      response?.data.map((curentval) => {

        this.locationList12Data.push({
          value: curentval.hospital_name,
          label: curentval?.hospital_name
        });
      });

      if (this.editClaimData != "") {
        this.onPrescriberCenterChange(this.editClaimData?.prescriberCenterInfo?.hospitalCenter);
        this.hospitalCenter = this.editClaimData?.prescriberCenterInfo?.hospitalCenter;

      }
    });
  }



  getDoctorList() {
    if (this.locationId === undefined) {
      return;
    }
    let reqData = {
      page: this.page,
      limit: 1000,
      hospital_portal_id: this.locationId,
      searchText: "",
    };
    this.hospitalservice.getDoctorsList(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.doctorList = [];


      for (const curentval of response?.data?.data) {
        this.doctorList.push({
          label: curentval?.label,
          value: curentval?.value,
        })
      }

      if (this.editClaimData != "") {
        // this.onPrescriberDoctorList(this.editClaimData.prescriberCenterInfo?.prescriberFirstName + '-' + this.editClaimData.prescriberCenterInfo?.prescriberMiddleName + '-' + this.editClaimData.prescriberCenterInfo?.prescriberLastName)
        this.fourthFormGroup.patchValue({
          // hospitalCenter: this.editClaimData?.prescriberCenterInfo?.hospitalCenter,
          prescriberTitle: this.editClaimData?.prescriberCenterInfo?.prescriberTitle,
          prescriberSpecialty: this.editClaimData?.prescriberCenterInfo?.prescriberSpecialty,
          doctorList: this.editClaimData?.prescriberCenterInfo?.doctorList
        });
        this.deliveryCenterselected = this.editClaimData?.deliverCenterInfo?.deliverCenter;      

      }
     
      this.totalLength = response?.data?.totalCount;
    });
  }



  async allDoctorsHopitalizationList(enterPreeKeys: any = '') {
    this.patientService.allDoctorsHopitalizationList().subscribe({
      next: async (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        let uniqueDoctorSet = new Set();
        if (result.status) {

          this.doctorlist = result?.data?.filter((currentVal) => {
            const label = currentVal?.for_portal_user?.full_name;
            const value = currentVal?.for_portal_user?._id;
            if (label && label.trim() !== '' && !uniqueDoctorSet.has(label + value)) {
              uniqueDoctorSet.add(label + value);
              return true;
            }
            return false;
          }).map((currentVal) => ({
            label: currentVal?.for_portal_user?.full_name,
            value: currentVal?.for_portal_user?._id,
          }));




        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  adddoctorpopup(addDoctor: any) {
    this.modalService.open(addDoctor, {
      centered: true,
      backdrop: "static",
      size: "md",
      windowClass: "permission_commit",
    });
  }
  addDeliverTitlePopup(addTitle: any) {
    this.modalService.open(addTitle, {
      centered: true,
      backdrop: "static",
      size: "md",
      windowClass: "permission_commit",
    });
  }

  search(key: string, event: any) {
    // console.log(key, event);
  }


  onKeypressEvent(event: any) {
    if (event.key === "Backspace") {
      this.selectKeyPressValue = this.selectKeyPressValue.slice(0, -1);
    } else {
      this.selectKeyPressValue += event.key;
    }

    const enteredDoctor = this.selectKeyPressValue.trim().toLowerCase();

    if (enteredDoctor) {
      const doctorExists = this.doctorlist.some(doctor =>
        doctor.label.toLowerCase().startsWith(enteredDoctor)
      );

      this.showAddDoctorButton = !doctorExists;
    } else {
      this.showAddDoctorButton = false;
    }
  }


  onKeyDownEvent(event: any) { 
    if (event.key === "Backspace") {
      console.log("before remove onKeyDownEvent", this.selectKeyPressValue);
      this.selectKeyPressValue = this.selectKeyPressValue.substring(0, this.selectKeyPressValue.length - 1);
      console.log("onKeyDownEvent", this.selectKeyPressValue);

    }
  }

  get form(): { [key: string]: AbstractControl } {
    return this.newDoctor_form.controls;
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.newDoctor_form.reset();
    this.roleForm.reset();
    this.newDoctorStaff_form.reset();
    this.newHospital_form.reset();
  }
  createNewdoctor() {
    this.isSubmitted = true;

    if (this.newDoctor_form.invalid) {
      this.coreService.showError("", "Please fill all required fields.");
      return;
    }
    this.isSubmitted = false;

    let reqdata = {
      first_name: this.newDoctor_form.value.first_name,
      middle_name: '',
      last_name: this.newDoctor_form.value.last_name,
      email: this.newDoctor_form.value.email,
      password: 'Admin@123',
      country_code: '+223',
      mobile: '',
      verified: true,
      role: 'INDIVIDUAL_DOCTOR',
      createdBy: 'insurance',
      verify_status: "APPROVED",
      created_by_user: this.loggedId
    }
    this.ngxService.start();
    this.indivudualDoctorService.createUnRegisteredDoctor(reqdata).subscribe(
      (res: any) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if (result.status) {
          this.ngxService.stop();
          this._coreService.showSuccess(result.message, "");
          this.closePopup();
          this.allDoctorsHopitalizationList();
          // this.newDeliverCentre = true;

        } else {
          this._coreService.showError(result.message, "");
          this.ngxService.stop();
        }
      },
      (err: any) => {
        console.log(err);
        this.ngxService.stop();
      }
    );
  }
  get roleFormControl(): { [key: string]: AbstractControl } {
    return this.roleForm.controls;
  }

    onKeypressEventstaff(event: any) {
    if (event.key === "Backspace") {
      this.selectKeyPressValue = this.selectKeyPressValue.slice(0, -1);
    } else {
      this.selectKeyPressValue += event.key;
    }

    const enteredDoctor = this.selectKeyPressValue.trim().toLowerCase();

    if (enteredDoctor) {
      const doctorExists = this.deliverStaff.some(doctor =>
        doctor.label.toLowerCase().startsWith(enteredDoctor)
      );

      this.showAddDoctorButton = !doctorExists;
    } else {
      this.showAddDoctorButton = false;
    }
  }


  onKeyDownEventstaff(event: any) { 
    if (event.key === "Backspace") {
      console.log("before remove onKeyDownEvent", this.selectKeyPressValue);
      this.selectKeyPressValue = this.selectKeyPressValue.substring(0, this.selectKeyPressValue.length - 1);
      console.log("onKeyDownEvent", this.selectKeyPressValue);

    }
  }

  addRoleByInsurance() {
    this.isSubmitted = true;

    if (this.roleForm.invalid) {
      this.coreService.showError("", "Please fill all required fields.");
      return;
    }
    this.isSubmitted = false;
    let reqData = {

      rolesArray: [{
        name: this.roleForm.value.name,
        status: this.roleForm.value.status,

      }],
      for_user: this.DoctorIdByRole,
      createdbyInsurance: this.loggedId

    };
    console.log("REQUEST DATA===>", reqData);
    this.indivudualDoctorService.addRole(reqData).subscribe(
      (res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        console.log(result);
        if (result.status) {
          let doctorId = result?.body.map((ele) => {
            return ele.for_user
          })
          this.ngxService.stop();
          this._coreService.showSuccess(result.message, "");

          this.closePopup();
          this.getAllRole(doctorId)
        } else {
          this.ngxService.stop();
          this._coreService.showError("", result?.message)
        }

      },
      (error) => {
        this.ngxService.stop();
        console.log("error in add role", error);
      }
    );
  }

  adddoctorstaffpopup(addDoctorStaff: any) {
    this.modalService.open(addDoctorStaff, {
      centered: true,
      backdrop: "static",
      size: "md",
      windowClass: "permission_commit",
    });
  }

  get staffform(): { [key: string]: AbstractControl } {
    return this.newDoctorStaff_form.controls;
  }

  createNewdoctorStaff() {
    this.isSubmitted = true;

    if (this.newDoctorStaff_form.invalid) {
      this.coreService.showError("", "Please fill all required fields.");
      return;
    }
    this.isSubmitted = false;

    let reqdata = {
      first_name: this.newDoctorStaff_form.value.first_name,
      middle_name: '',
      last_name: this.newDoctorStaff_form.value.last_name,
      email: this.newDoctorStaff_form.value.email,
      password: 'Admin@123',
      country_code: '+223',
      mobile: '',
      verified: true,
      createdBy: 'insurance',
      verify_status: "APPROVED",
      created_by_user: this.DoctorIdByRole,
      createdbyInsurance: this.loggedId,
      role: this.selectedRole
    }
    this.ngxService.start();
    this.indivudualDoctorService.createUnRegisteredDoctorStaff(reqdata).subscribe(
      (res: any) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if (result.status) {
          console.log(result);
          let roleId = result?.body?.role
          this.ngxService.stop();
          this._coreService.showSuccess(result.message, "");
          this.closePopup();
          this.getStaffDetails(roleId);

        } else {
          this._coreService.showError(result.message, "");
          this.ngxService.stop();
        }
      },
      (err: any) => {
        console.log(err);
        this.ngxService.stop();
      }
    );
  }

  onKeypressEvent1(event: any) {
    console.log("event.key________", event.key);

    if (event.key === "Backspace") {
      this.selectKeyPressValue = this.selectKeyPressValue.slice(0, -1);
    } else {
      this.selectKeyPressValue += event.key;
    }

    const enteredhospitalName = this.selectKeyPressValue.trim().toLowerCase();

    if (enteredhospitalName) {
      console.log(" this.locationList12Dat___________", this.locationList12Data);
      
      const hospExists = this.locationList12Data.some(hosp =>
        hosp.label.toLowerCase().startsWith(enteredhospitalName)
      );

      this.showAddHospButton = !hospExists;
    } 
  }


  onKeyDownEvent1(event: any) {
    console.log("event.key________", event.key);

    if (event.key === "Backspace") {
      console.log("before remove onKeyDownEvent", this.selectKeyPressValue);
      this.selectKeyPressValue = this.selectKeyPressValue.substring(0, this.selectKeyPressValue.length - 1);
      console.log("onKeyDownEvent", this.selectKeyPressValue);

    }
  }



  addhospitalpopup(addhospital: any) {
    this.modalService.open(addhospital, {
      centered: true,
      backdrop: "static",
      size: "md",
      windowClass: "permission_commit",
    });
  }


  get hospform(): { [key: string]: AbstractControl } {
    return this.newHospital_form.controls;
  }


  createNewHospital() {
    this.isSubmitted = true;

    if (this.newHospital_form.invalid) {
      this.coreService.showError("", "Please fill all required fields.");
      return;
    }
    this.isSubmitted = false;

    let reqdata = {
      first_name: this.newHospital_form.value.first_name,
      hospital_name: this.newHospital_form.value.hospital_name,
      last_name: this.newHospital_form.value.last_name,
      email: this.newHospital_form.value.email,     
      createdBy: 'insurance',
      verify_status: "APPROVED",
      created_by_user: this.loggedId
    }
    this.ngxService.start();
    this.hospitalservice.createUnregisteredHospital(reqdata).subscribe(
      (res: any) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if (result.status) {
          this.ngxService.stop();
          this._coreService.showSuccess(result.message, "");
          this.closePopup();
          this.getAllHospitalList();

        } else {
          this._coreService.showError(result.message, "");
          this.ngxService.stop();
        }
      },
      (err: any) => {
        console.log(err);
        this.ngxService.stop();
      }
    );
  }
}
