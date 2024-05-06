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
import { PatientService } from "../../../patient.service";
import { Select2UpdateEvent } from "ng-select2-component";


@Component({
  selector: 'app-commoninformation-hospitalization',
  templateUrl: './commoninformation-hospitalization.component.html',
  styleUrls: ['./commoninformation-hospitalization.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommoninformationHospitalizationComponent implements OnInit {
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
  doctorIdSelected: any;
  SubscriberId: any[];
  DoctorIdByRole: any;
  locationListAllData: any[];
  hospitalPharmacyList: any[];
  staffRoleAlldata: any[];
  locationList12Data: any[];
  pharmacy_id: string | number | boolean | object;

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
    // this.adminData = this.coreService.getLocalStorage("adminData").in_hospital;
    if (this.loggedRole == "INDIVIDUAL_DOCTOR") {
      this.doctorIdloggedIn = this.loggedId;
    }
    // this.loggedName =
    //   this.coreService.getLocalStorage("adminData").full_name;
    // if (this.loggedRole == "INDIVIDUAL_DOCTOR_STAFF") {
    //   this.doctorIdloggedIn = this.adminData;
    // }


    this.deliveryCenterselected = this.loggedId;
    // this.loggedName =
    //   this.coreService.getLocalStorage("adminData").full_name;
    // this.loggedfirst_name = this.coreService.getLocalStorage("adminData").first_name;
    // this.loggedmiddle_name = this.coreService.getLocalStorage("adminData").middle_name;
    // this.loggedlast_name = this.coreService.getLocalStorage("adminData").last_name;



    sessionStorage.removeItem("stepOneId");
    sessionStorage.removeItem("claimId");
    sessionStorage.removeItem("service");
    sessionStorage.removeItem("subscriberid");
    sessionStorage.removeItem("step");
    sessionStorage.removeItem("InsuranceId");
    sessionStorage.removeItem("checkSubscriber");
    // this.getAllRole();
    this.getAllTitleLists();
    this.allDoctorsHopitalizationList()

    this.route.queryParams.subscribe((params: any) => {
      console.log(params);

      this.selectclaimid = params.claim_id;
      this.type = params.type;
      console.log(this.type, "check type log");
      this.claimtype = params.claimtype;
    });

    if (this.type == undefined) {
      this.type = '';
    }
    if (this.claimtype == undefined) {
      this.claimtype = '';
    }
    console.log("selectclaimid" + JSON.stringify(this.selectclaimid));

    if (this.selectclaimid != "" && this.selectclaimid != undefined) {
      this.getClaimDetails();
    }


  }
  private async getClaimDetails() {
    this.pharmacyService.medicineClaimDetailsPharmacyClaimObjectIdHopitalization(this.selectclaimid).subscribe({
      next: async (res) => {
        console.log(res);
        let encData = await res;
        let result = await this.coreService.decryptContext(encData);
        console.log("claimDetails", result);
        if (result.status) {
          let claimData = result.data[0];
          console.log("getClaimDetails", claimData);
          this.editClaimData = claimData;
          if (claimData?.insuranceId != "") {
            //this.autogetInsuranceId(claimData?.insuranceId, claimData?.patientId);
          }
          this.insuranceSelectedId = claimData?.insuranceId;

          this.firstFormGroup.patchValue({
            insuranceId: claimData?.insuranceId,
            requestType: claimData?.requestType,
            patientId: claimData?.patientId,
            claimNumber: claimData?.claimNumber,
          });

          // this.prescriberSpecialitydefault =
          // claimData?.prescriberCenterInfo?.prescriberSpecialty;

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
          console.log("getClaimDetails", accidentFieldListsave);
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
          console.log(accidentRelationindex, "accidentRelationindex");

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

          this.deliveryCenterselected = claimData?.deliverCenterInfo?.deliverCenter;
          

          this.hospitalCenter = claimData.prescriberCenterInfo?.hospitalCenter;

          this.selectedDeliveryStaff =
            claimData?.deliverCenterInfo?.deliverFirstName;

          this.prescriberSpecialitydefault =
            claimData?.prescriberCenterInfo?.prescriberSpecialty;
          // console.log("testdd" + this.prescriberSpecialitydefault);
          // this.getSpecialty();
          if (claimData?.deliverCenterInfo?.deliverTitleId != undefined) {
            const params = {
              hospitalId: this.loggedId,
              page: this.page,
              limit: this.pageSize,
              searchText: this.searchText,
              role: claimData?.deliverCenterInfo?.deliverTitleId,
              sort: ""
            };
            console.log(params, 'getAllstaffData Request');

            this.indivudualDoctorService.getAllStaff(params).subscribe({
              next: async (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
                const decryptedData = await this._coreService.decryptObjectData({
                  data: result,
                });
                if (decryptedData.status) {

                  console.log("getAllStaff", decryptedData);

                  const data = [];
                  for (const staff of decryptedData.body[0].paginatedResults) {
                    console.log("getAllStaff", staff.profileinfos);
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
                  console.log(checkstaff, "event");
                  this.staffTitle = checkstaff?.name;
                  this.staffTitleId = claimData?.deliverCenterInfo?.deliverTitleId;


                  // this.deliverStaffselected =
                  //   claimData?.deliverCenterInfo?.deliverFirstName;
                  console.log("getAllStaff data", data);
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

                // this.deliverTitleselected = this.editClaimData?.deliverCenterInfo?.deliverTitleId;
                // this.totalLength = decryptedData.body[0].totalCount[0]?.count;
                // this.dataSource = data;
                // this._coreService.showSuccess("", "Staff loaded successfully");
              },
              error: (err: ErrorEvent) => {
                console.log(err, "err");

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
        console.log(err.message, "err.message");
      },
    });
  }
  changeaccidenttype(event) {
    console.log("event", event.value);
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
    this.getAllDetails();
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
      console.log(this.doctorList, "doctorList");
      console.log(this.loggedfirst_name, "loggedNameDoctor");


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

  onTagChanged(data: { value: string[] }): void {
    console.log(data, "onTagChanged");
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
          console.log(matchedRecordsArray, "check list speciality12");
          this.specialtyList.push(matchedRecordsArray);
          console.log(this.specialtyList, "doctorList");
        }
        else {
          this.specialtyList = this.specialtyListData
          console.log(this.specialtyList, "check list speciality");
        }
      },
      error: (err) => {
        console.log(err);
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
      console.log(this.totalLength, "data check specialityservicedataSource");

    });
  }


  // private getAllRole() {
  //   this._pharmacyService.allRole(this.loggedId).subscribe((res) => {
  //     let result = this.coreService.decryptObjectData(res);
  //     console.log(result, "check result");

  //     if (result?.status) {
  //       this.staffRole = result?.body.data;
  //       console.log(this.staffRole, "this.staffRole");
  //     }
  //   });
  // }

  getAllRole(event) {
    console.log(event,"check event");
    

    this.DoctorIdByRole = event;

    let param = {
      userId: event.value,
      page: 1,
      limit: 0,
      searchText: "",
    };

    this.indivudualDoctorService.getAllRole(param).subscribe((res) => {
      let result = this._coreService.decryptObjectData({ data: res });
      console.log(result, "check result");

      if (result?.status) {
        this.staffRole = result?.body.data;

        this.staffRoleAlldata = [];
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
          console.log("check inside");
          
          this.deliverTitleselected = this.editClaimData?.deliverCenterInfo?.deliverTitleId;
        }
        console.log(this.staffRole, "this.staffRole");
      }
    });
  }


  // getAllRole(event: Select2UpdateEvent<any>) {
  //   console.log("check getall role", event);
  //   if (event.value != undefined) {
  //     this.pharmacy_id = `${event.options[0].value}`;
  //   console.log("check getall role", this.pharmacy_id);

  //     this.patientService.allRole(this.pharmacy_id).subscribe((res) => {
  //       let result = this.coreService.decryptObjectData(res);
  //       if (result?.status) {
  //         this.staffRole = result?.body.data;
  //         this.staffRoleAlldata = [];
  //         this.staffRole.map((curentval, index) => {
  //           if (this.staffRoleAlldata.indexOf({
  //             label: curentval?.name,
  //             value: curentval?._id,
  //           }) == -1) {
  //             this.staffRoleAlldata.push({
  //               label: curentval?.name,
  //               value: curentval?._id,
  //             });
  //           }
  //         });

  //         if (this.editClaimData != '') {
  //           this.deliverTitleselected = this.editClaimData?.deliverCenterInfo?.deliverTitleId;
  //         }


  //         console.log(this.staffRole, "this.staffRole");
  //       }
  //     });
  //   }

  // }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log("filterValue", filterValue);
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
        console.log("plandetails", result);
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
      console.log(serviceOption, "serviceOption");

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
  getStaffList(element) {
    this.doctorIdSelected = element.value;
    console.log(element, "check value");

  }

  getStaffDetails(event: any) {
console.log(this.DoctorIdByRole,"this.DoctorIdByRole");

    const params = {
      hospitalId: this.DoctorIdByRole.options[0].value,
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      role: event.value,
      sort: ""
    };
    console.log(params, 'getAllstaffData Request');

    this.indivudualDoctorService.getAllStaff(params).subscribe({
      next: async (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
        const decryptedData = await this._coreService.decryptObjectData({
          data: result,
        });
        console.log("getAllStaff", decryptedData);

        const data = [];
        for (const staff of decryptedData.body[0].paginatedResults) {
          console.log("getAllStaff", staff.profileinfos);
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
        console.log(checkstaff, "event");
        this.staffTitle = checkstaff.name;
        this.staffTitleId = event.value;
        console.log("getAllStaff data", data);
        data.map((curentval, index) => {
          this.deliverStaff.push({
            label: curentval?.staffname,
            value: curentval?.staffname,
          });
        });
        if (this.editClaimData != '') {
          this.deliverStaffselected = this.editClaimData?.deliverCenterInfo?.deliverFirstName;

        }
        // this.totalLength = decryptedData.body[0].totalCount[0]?.count;
        // this.dataSource = data;
        // this._coreService.showSuccess("", "Staff loaded successfully");
      },
      error: (err: ErrorEvent) => {
        console.log(err, "err");

        // this._coreService.showError("", "Staff Load Failed");
      },
    });


    console.log(event, "event");
    // return;
    // if (event.value) {
    //   const param = {
    //     pharmacyId: this.loggedId,
    //     staffRoleId: event.value,
    //   };
    //   this.pharmacyService.getPharmacyStaffName(param).subscribe({
    //     next: async (res) => {
    //       let encData = await res;
    //       let result = this.coreService.decryptContext(encData);
    //       console.log(result, "999");
    //       if (result.status) {
    //         const checkstaff = this.staffRole.find(
    //           (obj) => obj._id === event.value
    //         );
    //         console.log(checkstaff, "event");
    //         this.staffTitle = checkstaff.name;
    //         this.staffTitleId = event.value;

    //         // this.deliverStaff = result.data;

    //         result?.data.map((curentval, index) => {
    //           this.deliverStaff.push({
    //             label: curentval?.staff_name,
    //             value: curentval?.staff_name,
    //           });
    //         });

    //         console.log("STAFF LIST====>", this.deliverStaff);
    //       } else {
    //         this.staffTitle = "";
    //         this.staffTitleId = "";
    //       }
    //     },
    //   });
    // }
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
    console.log("insuranceId", this.insuranceId);
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
        console.log("this.patientList", this.patientList);
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
    console.log(event, "getInsuranceId Event");

    if (event != undefined) {
      this.insuranceId = event;

      this.serviceselected = "";
      // if (this.selectclaimid != '' && this.selectclaimid != undefined) {
      //   this.serviceselected = this.editClaimData.service;

      // }
      this.serviceMessage = "";
      console.log("insuranceId", this.insuranceId);
      await this.getAllSubscriber();
      await this.getPrimaryInsuredField();
      await this.getSecondaryInsurerField();
      await this.getAccidentField();
    }
  }

  private getAllSubscriber() {

    this.SubscriberId = [];
    this.patientDataAll.map((element) => {
      console.log(element, "check elemetn");

      this.SubscriberId.push(element.subscriber_id)
    })
    console.log(this.SubscriberId, "SubscriberId");



    let param = {
      allsubscriber_id: this.SubscriberId,
    };
    console.log("this.insuranceId", this.insuranceId);

    this.pharmacyService.getAllSubscriberbyid(param).subscribe({
      next: async (res) => {
        const encData = await res;
        let result = this.coreService.decryptContext(encData);
        //this.patientList = result.body;
        if (result.status) {
          this.patientList = [];
          this.patientDetailList = await result.body;
          if (this.patientDetailList.length > 0) {
            console.log("AFTER PRESc===>", this.prescData);
            result.body.map((curentval, index) => {
              console.log("AFTER PRESc===>");
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

            console.log("AFTER PRESc===>", this.prescData);
            if (this.prescData) {
              this.patientSelectedId = await this.prescData?.subscriberId;
            }
            console.log(this.patientSelectedId, "this.patientSelectedId");
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

        console.log("subsriber data", result);
      },
    });
  }
  private getPrimaryInsuredField() {
    // this.insuranceId = this.insuranceId[]
    console.log(this.insuranceId, "line no 474");

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
          console.log("primary insured field", result);

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
          console.log("primary field list", this.primaryFieldList);
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
          // console.log("accident insured field", result);

          if (result.status) {
            if (result.body.accidentData.length > 0) {
              this.accidentFieldJson = result.body.accidentData;
              console.log(this.accidentFieldJson, "check josn ");


              result.body.accidentData.forEach((element) => {
                this.accidentFieldList.push(Object.values(element));
              });
              this.addValidationInAccident();
            } else {
              this.accidentFieldJson = null;
              this.accidentFieldList = [];
            }
          }
          // console.log("accident field list", this.accidentFieldList);
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      },
    });
  }

  private addValidationInAccident() {
    this.accidentFieldJson.forEach((element) => {
      console.log(element, "check elelement");

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
    console.log("getpatientIdgetpatientId", event);

    if (event != undefined) {
      console.log("getPatientIdEvent", event);
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
    console.log("secondId", secondId);
    this.patientDetailList.forEach((element) => {
      if (element._id == secondId) {
        console.log("patchSecondaryValue", element._id);

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
    console.log("third form group", this.thirdFormGroup);
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

    console.log("second form group", this.secondFormGroup);
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
    console.log(insPortalId);
  }

  private getAllInsurance() {
    const param = {
      page: 1,
      limit: 1000,
      searchText: "",
      startDate: "",
      endDate: "",
    };
    this.pharmacyService.getApprovedInsurance(param).subscribe({
      next: async (res) => {
        const encryptedData = await res;

        let result = this.coreService.decryptObjectData(encryptedData);
        console.log("insurance details", result);



        if (result.status) {
          console.log(this.insuraneList, "this.insuraneList this.insuraneList ");

          result.body.result.forEach((currentVal, index) => {
            console.log(currentVal, "898989");

            if (this.insuranceiD?.includes(currentVal.for_portal_user._id)) {
              this.insuranceselectedname = currentVal.company_name
            }
          });

          this.firstFormGroup.patchValue({
            insuranceId: this.insuranceselectedname
          })

          this.getInsuranceId(this.insuranceiD)

        } else {
          this.coreService.showError(result.message, "");
        }
        console.log(this.insuraneList);
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      },
    });
  }


  private getInsuranceAcceptedListDoctor() {
    console.log(this.adminData, "check data admin");
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
        console.log(res, "resoinsehchc");

        const encryptedData = await res;


        let result = this.coreService.decryptObjectData({ data: encryptedData });
        console.log("insurance details", result);
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
        console.log(this.insuraneList);
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      },
    });
  }



  public saveStepOne(formVal: any, stepper: MatStepper) {
    this.isSubmitted = true;
    if (this.firstFormGroup.invalid) {
      const invalid = [];
      const controls = this.firstFormGroup.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid, "invalidinvalid");
      return;
    }
    formVal.pharmacyId = "";
    formVal.createdById = this.loggedId;
    formVal.claimId = "";
    formVal.created_by = "patient";
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
    console.log("REQUEST DATA STEP ONE==>", formVal);
    // return;

    this.pharmacyService.commoninformationStep1HospitalClaim(formVal).subscribe({
      next: async (res) => {
        // this.ngxService.stop();
        const encData = await res;
        console.log(encData);
        let result = this.coreService.decryptContext(encData);
        console.log("stepone result", result);

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
      console.log("invalid");
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

    console.log("REQUEST DATA STEP TWO==>", finalReqData);

    // return;

    this.pharmacyService.commoninformationStep2HospitalClaim(finalReqData).subscribe({
      next: (res) => {
        console.log(res);

        let result = this.coreService.decryptContext(res);
        console.log(result);
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
    console.log(finalReqData);
    // stepper.next();
    // stepper.next();
  }

  saveStepThree(formVal: any, stepper: MatStepper) {
    this.isSubmitted = true;
    if (this.thirdFormGroup.invalid) {
      console.log("invalid");
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

    console.log("SAVE STEP THREE===>", finalReqData);

    this.pharmacyService.commoninformationStep3HospitalClaim(finalReqData).subscribe({
      next: (res) => {
        console.log(res);
        let result = this.coreService.decryptContext(res);
        console.log("stepthree result", result);
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
    console.log(finalReqData);
  }

  onPrescriberCenterChange(selectedLocation: any) {
    console.log(selectedLocation, "c4444", this.locationList12);
    let filterObject = this.locationList12.filter(obj => obj['hospital_name'] === selectedLocation);
    console.log(`filterObject`, filterObject);
    this.locationFor = filterObject[0].locationFor;
    this.locationSlected = filterObject[0].hospital_name
    this.locationId = filterObject[0]?.for_portal_user?._id;
    let hospitalId = filterObject[0]?._id;
    this.locationHospital = filterObject[0]?.location;
    this.getAssociationdetails(hospitalId)
    if (this.loggedRole != "INDIVIDUAL_DOCTOR" && this.loggedRole != "HOSPITAL_DOCTOR") {
      this.getDoctorList();
    }
    console.log(this.locationFor, "test location");

    // this.fourthFormGroup.patchValue({
    //   hospitalName: filterObject[0]?.hospital_name,
    //   hospitalIfuNumber: filterObject[0]?.ifu_number,
    //   hospitalAddress: filterObject[0]?.location,
    //   hospitalRccmNumber: filterObject[0]?.rccm_number,
    //   hospitalPhoneNumber: filterObject[0]?.main_phone_number,
    //   hospitalEmail: filterObject[0]?.for_portal_user.email,
    //   hospitalFaxNo: filterObject[0]?.fax_number,
    //   // hospitalRccmNumber:
    // });
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
      console.log("hospitaldetails", this.hospitalDetails);
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
        prescriberCenter: "",
        prescriberFirstName: "",
        prescriberMiddleName: "",
        prescriberLastName: "",
        prescriberTitle: "",
        prescriberSpecialty: "",
        doctorList: "",
        hospitalCenter: this.locationSlected,
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

    console.log("SAVE STEP FOUR===>", reqData);
    // return;

    this.pharmacyService.commoninformationStep4HospitalClaim(reqData).subscribe({
      next: (res) => {
        console.log(res);
        let result = this.coreService.decryptContext(res);
        console.log("stepFive result", result);
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
      console.log("in previousStep if");

      stepper.previous();
    } else {
      console.log("in previousStep else");
      stepper.previous();
      stepper.previous();
    }
  }

  radioonChange(event: MatRadioChange) {
    console.log(event, "radion event");

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
      console.log("invalid");
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

    console.log("STEP FIVE REQUEST DATA===>", finalReqData);

    this.pharmacyService.commoninformationStep5HospitalClaim(finalReqData).subscribe({
      next: (res) => {
        console.log(res);
        let result = this.coreService.decryptContext(res);
        console.log("stepFive result", result);
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
    console.log(finalReqData);
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
    console.log("EPRESCRIPTION NUMBER===>", ePrescriptionNumber);

    if (ePrescriptionNumber) {
      let reqData = {
        ePrescriptionNumber: ePrescriptionNumber,
      };

      this._pharmacyService
        .getEprescriptionDetailsForMedicineClaim(reqData)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });

          console.log("PRESCRIPTION DATA FETCHED--->", response);
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
            console.log(response?.body?.prescriberCenterInfo?.hospitalCenter, "  response?.body?.prescriberCenterInfo?.prescriberCenter,");

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
    console.log(param, "check param");

    this.hospitalservice.getLocations(param.doctorId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("LOCATIONS LIST===>", response);
      this.locationList = response?.data[0]?.hospital_or_clinic_location;
      console.log(this.locationList, "check param");

      this.locations.emit(response?.data[0]?.hospital_or_clinic_location);
    });
  }




  getAllHospitalList(sort: any = '') {
    // this.pushColumns();
    let reqData = {
      page: this.page,
      limit: 0,
      status: 'APPROVED',
      sort: sort
    };

    console.log("REQUEST DATA===>", reqData);

    this.hospitalservice.hospitalList(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RESPONSE LIST====>", response);
      this.locationList12 = response?.data.data;

      this.locationList12Data = [];
      response?.data.data.map((curentval) => {
        console.log(curentval, "curentval");

        this.locationList12Data.push({
          value: curentval.hospital_name,
          label: curentval?.hospital_name
        });
      });
      

      // this.locationListAllData = [];
      // this.locationList12.map((curentval, index) => {
      //   if (this.locationListAllData.indexOf({
      //     label: curentval?.hospital_name,
      //     value: curentval?.hospital_name,
      //   }) == -1) {
      //     this.locationListAllData.push({
      //       label: curentval?.hospital_name,
      //       value: curentval?.hospital_name,
      //     });
      //   }
      // });

      if (this.editClaimData != "") {
        this.onPrescriberCenterChange(this.editClaimData?.prescriberCenterInfo?.hospitalCenter);

      }
    });
  }



  getDoctorList() {
    let reqData = {
      page: this.page,
      limit: 1000,
      hospital_portal_id: this.locationId,
      searchText: "",
    };
    this.hospitalservice.getDoctorsList(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RESPONSE==========>", response);
      this.doctorList = response?.data?.data;
      if (this.editClaimData != "") {
        // this.onPrescriberDoctorList(this.editClaimData.prescriberCenterInfo?.prescriberFirstName + '-' + this.editClaimData.prescriberCenterInfo?.prescriberMiddleName + '-' + this.editClaimData.prescriberCenterInfo?.prescriberLastName)
        this.fourthFormGroup.patchValue({
          // hospitalCenter: this.editClaimData?.prescriberCenterInfo?.hospitalCenter,
          prescriberTitle: this.editClaimData?.prescriberCenterInfo?.prescriberTitle,
          prescriberSpecialty: this.editClaimData?.prescriberCenterInfo?.prescriberSpecialty,
          doctorList: this.editClaimData?.prescriberCenterInfo?.doctorList
        });
      }
      // this.dataSourceRequests = response?.data?.data;
      this.totalLength = response?.data?.totalCount;
    });
  }
  getAllDetails() {
    let params = {
      patient_id: this.loggedId
    }
    this.patientService.profileDetails(params).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      let patientData = response.body.insuranceDetails;
      console.log(patientData, "patientData");
      this.patientDataAll = patientData.all_subscriber_ids;
      console.log(this.patientDataAll, "PROFILE DETAILS=====>", response.body);
      if (patientData != "") {
        this.insuranceiD = patientData?.insurance_id
        console.log(this.insuranceiD, "this check");
        // this.listAllPharmacy();
        this.getAllInsurance();
      }
      else {
        this.modalService.open(this.requestedamountAll);
      }
    });


  }

  async allDoctorsHopitalizationList() {
    this.patientService.allDoctorsHopitalizationList().subscribe({
      next: async (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        let uniqueDoctorSet = new Set();

        this.hospitalPharmacyList = []
        let array2 = result.data;
        console.log('array2___', array2);

        array2.map((curentval) => {
          if (this.hospitalPharmacyList.indexOf({
            label: curentval?.for_portal_user?.full_name,
            value: curentval?.for_portal_user?._id
          }) == -1) {
            this.hospitalPharmacyList.push({
              label: curentval?.for_portal_user?.full_name,
              value: curentval?.for_portal_user?._id
            });
          }
        });

        // this.doctorlist = result?.data?.filter((currentVal) => {
        //   const label = currentVal?.for_portal_user?.full_name;
        //   const value = currentVal?.for_portal_user?._id;
        //   if (label && label.trim() !== '' && !uniqueDoctorSet.has(label + value)) {
        //     uniqueDoctorSet.add(label + value);
        //     return true;
        //   }
        //   return false;
        // }).map((currentVal) => ({
        //   label: currentVal?.for_portal_user?.full_name,
        //   value: currentVal?.for_portal_user?._id,
        // }));

        console.log("result", this.doctorlist);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
