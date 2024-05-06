import { SubscribersdetailComponent } from "./../../../../insurance/insurance-subscribers/subscribersdetail/subscribersdetail.component";
import { PharmacyPlanService } from "./../../../../pharmacy/pharmacy-plan.service";
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  AbstractControl,
  FormControl,
} from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { map, Observable, startWith, Subscription } from "rxjs";
import { PatientService } from "src/app/modules/patient/patient.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import { Select2Data, Select2UpdateEvent } from "ng-select2-component";
import { DatePipe } from "@angular/common";
import { PharmacyService } from "../../../../pharmacy/pharmacy.service";
import { log } from "console";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";

export interface PeriodicElement {
  medicinename: string;
  quantityprescribed: string;
  quantitydelivered: string;
  frequency: string;
  duration: string;
  priceperunit: string;
  copayment: string;
  requestamount: string;
  totalcost: string;
  comment: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    medicinename: "",
    quantityprescribed: "",
    quantitydelivered: "",
    frequency: "",
    duration: "",
    priceperunit: "",
    copayment: "",
    requestamount: "",
    totalcost: "",
    comment: "",
  },
];

// Prescription Table

export interface PrescriptionPeriodicElement {

  medicinename: string;
  quantityprescribed: string;
  quantitydelivered: string;
  frequency: string;
  duration: string;
  priceperunit: string;
  copayment: string;
  requestamount: string;
  totalcost: string;
  comment: string;

}

const PRESCRIPTION_ELEMENT_DATA: PrescriptionPeriodicElement[] = [
  {
    medicinename: "Vitamin C",
    quantityprescribed: "3 Pack",
    quantitydelivered: "3 Pack",
    frequency: "Morning 2, MidDay 2",
    duration: "3",
    priceperunit: "15,000 CFA",
    copayment: "12 000 CFA",
    requestamount: "12 000 CFA",
    totalcost: "15 000 CFA",
    comment: "test",
  },
];

@Component({
  selector: 'app-servicetype-four-portal-make-insurance',
  templateUrl: './servicetype-four-portal-make-insurance.component.html',
  styleUrls: ['./servicetype-four-portal-make-insurance.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServicetypeFourPortalMakeInsuranceComponent implements OnInit {



  @Input() public mstepper: MatStepper;
  @ViewChild("delete_medicine") delete_medicine: ElementRef;
  selectedDate: any = new Date();

  displayedColumns: string[] = [
    "categoryService",
    "serviceName",
    "serviceCode",
    "description",
    "medicinename",
    "quantityprescribed",
    "quantitydelivered",
    "frequency",
    "duration",
    "priceperunit",
    "copayment",
    "requestamount",
    "totalcost",
    "comment",
    "action",
  ];
  dataSource: MatTableDataSource<AbstractControl>;

  // Prescription Table
  prescriptiondisplayedColumns: string[] = [
    "medicinename",
    "quantityprescribed",
    "quantitydelivered",
    "frequency",
    "duration",
    "priceperunit",
    "copayment",
    "requestamount",
    "totalcost",
    "comment",
  ];
  prescriptiondataSource = PRESCRIPTION_ELEMENT_DATA;
  medicineForm: any = FormGroup;
  medicineList: Select2Data[] = [];
  planExclusion: any[] = [];
  medicineName: string = "";
  medicineIDObject: any = [];
  medicineNameObject: any = [];
  categoryObject: any = [];
  serviceObject: any = [];
  newMedicineArray: any = {};
  exludeMedicineAmount: any;
  serviceCount: any = [];
  filteredOptions!: Observable<any>;
  // myControl = new FormControl("");
  pharmacyId: any;
  stepper: MatStepper;
  stepOneId: string;
  selectedservice: any;
  requestDisable: boolean = false;
  selectedsubscriberid: any;
  insuranceId: any;
  insuranceSubcription: Subscription;
  ePrescriptionData: Subscription;
  reimbursmentRate: any = [];
  selectclaimid: any = "";
  waitingCount: any = [];
  type: any = '';
  selectedMedicine: any[] = [];
  redeemed: any = [];
  overlay: false;
  selectKeyPressValue: any = [];
  checkexclutiondata: any = [];
  checkexclutionDescription: any = [];
  serviceCode: any = [];
  checkpreAuthService: any = [];
  categoryList: any = [];
  esPresciptionIdNumber: any;
  loggedType: any;
  planServicePrimary: any;
  planValidityFrom: any;
  planValidityTo: any;
  planValidity: string;
  categoryCondition: any = [];
  dataofJoining: any;
  healthPlanId: any;
  serviceLimit: any = [];
  removeMedicineServiceType: any = [];
  deleted_id: any;
  deleteIndex: any;
  isSubmitted: boolean = false;
  orderId: any = "";
  logginIdOrder: any = ""
  page: any = 1;
  checkbreak: any = [];
  pageSize: number = 10000;
  searchText: any = "";
  famiyTotalLimit: any;
  primaryTotalLimit: any;
  secondaryTotalLimit: any;
  ownLimit: any;
  // // options = {
  // //     displaySearchStatus: 'default',
  // //     minCountForSearch: 0,
  // //     minCharForSearch: 1
  // //   };
  //   minCountForSearch = 1;

  ePrescriptionMedicines: any = [];
  categoryData: any;
  planService: any = [];
  categoryLimit: any = [];
  serviceArray: any = [];
  serviceCodeArray: any = [];
  costForService: any = {};
  pre_authArray: any = [];
  primary_and_secondary_category_limit: any = [];
  primary_and_secondary_service_limit: any = [];
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private patientService: PatientService,
    private coreService: CoreService,
    private pharmacyPlanService: PharmacyPlanService,
    private pharmacySerivice: PharmacyService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private _superAdminService: SuperAdminService,
  ) {
    this.insuranceId = this.coreService.getSessionStorage("InsuranceId");


    this.stepOneId = this.coreService.getSessionStorage("stepOneId");
    this.selectedservice = this.coreService.getSessionStorage("service");
    this.selectedsubscriberid =
      this.coreService.getSessionStorage("subscriberid");

    this.insuranceSubcription = this.coreService.SharingInsId.subscribe(
      (res) => {
        if (res != "default") {
          this.insuranceId = res;
          this.stepOneId = this.coreService.getSessionStorage("stepOneId");

          // this.selectedservice = this.coreService.getSessionStorage("service");
          this.costForService = {};
          this.selectedsubscriberid =
            this.coreService.getSessionStorage("subscriberid");
          this.coreService.setSessionStorage(0, "step");



          this.route.queryParams.subscribe((params: any) => {
            this.selectclaimid = params.claim_id;
            this.type = params.type;
            this.orderId = params.orderId
            this.logginIdOrder = params.logginId
          });
          console.log("selectclaimid", this.selectclaimid);

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

          if (this.selectclaimid != "" && this.selectclaimid != undefined) {
            //   console.log("in if");
            // const formControlsLength = Object.keys(this.medicineForm.controls).length;
            // console.log(this.medicines.length, "removeMedicine(index: number)");
            // for (let i = 0; i < this.medicines.length - 1; i++) {
            // this.removeMedicine(i)
            this.medicineForm.reset();
            this.medicines.clear()
            // }
            this.getClaimDetails();
          }
          else {
            this.medicineForm.reset();
            this.medicines.clear()
            this.getPlanDetails();
            this.getPortalTypeAndInsuranceId();
          }
        }
      }
    );

    this.ePrescriptionData =
      this.coreService.SharingEprescriptionData.subscribe((res: any) => {

        if (res != "default") {
          let medicines: any = res?.medicines;
          this.ePrescriptionMedicines = res?.medicines;
          if (this.ePrescriptionMedicines != "") {
            this.ePrescriptionMedicines.forEach(element => {
              this.esPresciptionIdNumber = element.ePrescriptionId;
            });
          }


          this.patchEprescriptionMedicines(medicines);
        }
      });
    if (this.stepOneId == null || this.insuranceId == null) {
      this.router.createUrlTree([`/insurance/make-order-claim/submitclaim/${this.loggedType}`]);
    }
    this.medicineForm = this.fb.group({
      medicines: this.fb.array([]),
      totalCoPayment: [0],
      totalRequestedAmount: [0],
      totalCostOfAllMedicine: [0],
    });

  }

  private getClaimDetails(type = '') {
    if (type != "") {
    
      this.pharmacyPlanService
        .medicineClaimDetailsPharmacyByClaimObjectId(this.stepOneId)
        .subscribe({
          next: async (res) => {
            this.getPlanDetails();
            this.getPortalTypeAndInsuranceId();
            let encData = await res;
            let result = await this.coreService.decryptContext(encData);
            let claimData = result.data[0];
            this.removeMedicineServiceType = [];
            let obj = [];
            if (claimData?.medicinedetailsonclaims.length > 0) {
              claimData?.medicinedetailsonclaims.forEach(
                (element: any, index: any) => {
                  this.addNewMedicine(element.medicineName, element.medicineId, element.serviceName, element.categoryService, element.serviceCode, index);
                  this.selectedMedicine[index].name = element.medicineName;
                  this.removeMedicineServiceType.push(element._id);
                  if (this.type != '') {
                    obj.push({
                      date_of_service: element?.date_of_service,
                      categoryService: element?.categoryService,
                      medicineId: element?.medicineId,
                      medicine_name: element?.medicineName,
                      serviceName: element?.serviceName,
                      serviceCode: element?.serviceCode,
                      quantity_prescribed: element?.quantityPrescribed,
                      quantity_delivered: element?.quantityDelivered,
                      frequency: element?.frequency,
                      duration: element?.duration,
                      price_per_unit: element?.pricePerUnit,
                      co_payment: element?.coPayment,
                      request_amount: element?.requestAmount,
                      total_cost: element?.totalCost,
                      comment: element?.comment,
                      existingId: ""
                    });
                  }
                  else {
                    obj.push({
                      date_of_service: element?.date_of_service,
                      categoryService: element?.categoryService,
                      medicineId: element?.medicineId,
                      medicine_name: element?.medicineName,
                      serviceName: element?.serviceName,
                      serviceCode: element?.serviceCode,
                      quantity_prescribed: element?.quantityPrescribed,
                      quantity_delivered: element?.quantityDelivered,
                      frequency: element?.frequency,
                      duration: element?.duration,
                      price_per_unit: element?.pricePerUnit,
                      co_payment: element?.coPayment,
                      request_amount: element?.requestAmount,
                      total_cost: element?.totalCost,
                      comment: element?.comment,
                      existingId: element._id
                    });
                  }
                }
              );
            } else {
              this.addNewMedicine('', '', '', '', '', 0);
            }

            this.medicineForm.patchValue({
              totalCoPayment: claimData?.totalCoPayment,
              totalRequestedAmount: claimData?.totalRequestedAmount,
              totalCostOfAllMedicine: claimData?.totalCostOfAllMedicine,
              medicines: obj,
            });
           
          },
          error: (err: ErrorEvent) => {
            console.log(err.message);
          },
        });
    } else {
      this.pharmacyPlanService
        .medicineClaimDetails(this.selectclaimid)
        .subscribe({
          next: async (res) => {
            this.getPlanDetails();
            this.getPortalTypeAndInsuranceId();
            let encData = await res;
            let result = await this.coreService.decryptContext(encData);
            let claimData = result.data[0];
            this.removeMedicineServiceType = [];
            let obj = [];
            if (claimData?.medicinedetailsonclaims.length > 0) {
              claimData?.medicinedetailsonclaims.forEach(
                (element: any, index: any) => {
                  this.addNewMedicine(element.medicineName, element.medicineId, element.serviceName, element.categoryService, element.serviceCode, index);
                  this.selectedMedicine[index].name = element.medicineName;
                  this.removeMedicineServiceType.push(element._id);
                  obj.push({
                    date_of_service: element?.date_of_service,
                    categoryService: element?.categoryService,
                    medicineId: element?.medicineId,
                    medicine_name: element?.medicineName,
                    serviceName: element?.serviceName,
                    serviceCode: element?.serviceCode,
                    quantity_prescribed: element?.quantityPrescribed,
                    quantity_delivered: element?.quantityDelivered,
                    frequency: element?.frequency,
                    duration: element?.duration,
                    price_per_unit: element?.pricePerUnit,
                    co_payment: element?.coPayment,
                    request_amount: element?.requestAmount,
                    total_cost: element?.totalCost,
                    comment: element?.comment,
                    existingId: element._id

                  });
                }
              );
            } else {
              this.addNewMedicine('', '', '', '', '', 0);
            }

            if (this.type != '') {
              this.medicineForm.patchValue({
                totalCoPayment: parseFloat(claimData?.totalCoPayment) + (parseFloat(claimData?.totalRequestedAmount) - parseFloat(claimData?.totalApprovedAmount)),
                totalRequestedAmount: claimData?.totalApprovedAmount,
                totalCostOfAllMedicine: claimData?.totalCostOfAllMedicine,
                medicines: obj,
              });
            }
            else {
              this.medicineForm.patchValue({
                totalCoPayment: claimData?.totalCoPayment,
                totalRequestedAmount: claimData?.totalRequestedAmount,
                totalCostOfAllMedicine: claimData?.totalCostOfAllMedicine,
                medicines: obj,
              });
            }
          },
          error: (err: ErrorEvent) => {
            console.log(err.message);
          },
        });
    }

  }

  patchEprescriptionMedicines(medicines) {
    this.medicineForm.reset();
    this.medicines.clear()

    let obj = [];
    if (medicines?.length > 0) {
      medicines.forEach((element: any, index: any) => {
        this.addNewMedicine(element?.medicine_name, element?.medicineId);
        this.selectedMedicine[index].name = element?.medicine_name;
        let frequency = element?.frequency?.every_quantity
        obj.push({
          quantity_prescribed: element?.quantities?.quantity,
          duration: element?.take_for?.quantity,
          frequency: frequency,
        });
      });
    } else {
      this.addNewMedicine();
    }
    this.medicineForm.patchValue({
      medicines: obj,
    });
  }

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem("loginData"));
    this.route.paramMap.subscribe(params => {
      this.loggedType = params.get('path');

    });
    this.pharmacyId = user?._id;
    this.insuranceSubcription = this.coreService.SharingInsId.subscribe(
      (res) => {
        if (res != "default") {
          if ((this.selectclaimid == undefined || this.selectclaimid == '') && this.orderId == '') {
            this.addNewMedicine('', '', '', '', '', 0);         
          }
        }
      });
  }

  private async getPlanDetails() {
    let param = {
      subscriber_id: this.selectedsubscriberid,
    };

    this.pharmacyPlanService
      .getInsurancePlanDetailsbysubscriber(param)
      .subscribe({
        next: async (res) => {

          const encData = await res;
          let result = this.coreService.decryptContext(encData);
          if (result.status) {
            this.planExclusion = result.body?.planExclusion;
            this.planService = result.body?.planService;
            this.planServicePrimary = result?.body?.planServicePrimary;
            this.planValidityFrom = result?.body?.primaryValidityFrom;
            this.planValidityTo = result?.body?.primaryValidityTo;
            this.planValidity = `${this.planValidityFrom} - ${this.planValidityTo}`;
            this.dataofJoining = result?.body?.resultData?.dateofjoining

            if (result?.body?.resultData?.subscription_for == "Secondary") {
              this.ownLimit = result?.body?.resultData?.health_plan_for?.total_care_limit?.secondary_care_limit
            } else {
              this.ownLimit = result?.body?.resultData?.health_plan_for?.total_care_limit?.primary_care_limit

            }
          } else {
            this.reimbursmentRate = 0;
            this.coreService.showInfo(
              "Given Insurance Id is not applicable for Reimbursment",
              ""
            );
          }
        },
      });
  }

  update(key: string, event: Select2UpdateEvent<any>, index: any) {
    if (event.component.option != null) {
      this.medicineNameObject[index] = event.options[0].label;
      var label = event.options[0].label.toLowerCase();
      this.medicineIDObject[index] = event.options[0].value;

      this.medicines.at(index).patchValue({ medicine_name: event.options[0].value });
      let excReimburmentRate = 1;

      this.planExclusion.forEach((element, index1) => {
        element.in_exclusion.name = element.in_exclusion.name.toLowerCase();
        const result =
          label.indexOf(element.in_exclusion.name) == -1
            ? false
            : true;

        if (result) {
          excReimburmentRate = 0;
          return;
        }
      });
      if (excReimburmentRate == 0) {
        this.checkexclutiondata[index] = "1";
      } else {
        this.checkexclutiondata[index] = "";
      }
    }
  }

  search(key: string, event: any) {
  
  }

  onKeypressEvent(event: any, index: number) {
    if (event.key != "Backspace") {
      this.selectKeyPressValue[index] += event.key;
      this.getMedicineList(this.selectKeyPressValue[index], index);
    }
  }

  onKeyDownEvent(event: any, index: number) {
    if (event.key == "Backspace") {  
      this.selectKeyPressValue[index] = this.selectKeyPressValue[
        index
      ].substring(0, this.selectKeyPressValue[index].length - 1);
      this.getMedicineList(this.selectKeyPressValue[index], index);
    }
  }

  onValueChnage() {
    let total_co_payment: any = 0;
    let total_request_amount: any = 0;
    let total_cost: any = 0;

    this.medicineForm.value.medicines.forEach((element) => {
      total_co_payment =
        parseFloat(total_co_payment) + parseFloat(element?.co_payment);
      total_request_amount =
        parseFloat(total_request_amount) + parseFloat(element?.request_amount);
      total_cost = parseFloat(total_cost) + parseFloat(element?.total_cost);
    });

    this.medicineForm.patchValue({
      totalCoPayment: total_co_payment.toFixed(2),
      totalRequestedAmount: total_request_amount.toFixed(2),
      totalCostOfAllMedicine: total_cost.toFixed(2),
    });


    if (this.medicineForm.get("totalRequestedAmount").value > 0) {
      this.requestDisable = true
    } else {
      this.requestDisable = false

    }
  }

  onSubmit() {
    const allSame = this.pre_authArray.every(value => value === this.pre_authArray[0]);
    this.isSubmitted = true;
    if (this.medicines.invalid) {
      this.coreService.showError("Please enter all fields", "");
      return
    }
    if (allSame) {
      let medicineArray = [];
      this.medicineForm.value.medicines.map((data, index) => {
          medicineArray.push({
          indexNumber: index,
          date_of_service: data.date_of_service,
          categoryService: data.categoryService,
          serviceName: data.serviceName,
          serviceCode: data.serviceCode,
          medicineId: data.medicineId,
          medicineName: this.medicineNameObject[index],
          quantityPrescribed: data.quantity_prescribed,
          quantityDelivered: data.quantity_delivered,
          frequency: data.frequency,
          duration: data.duration,
          pricePerUnit: data.price_per_unit,
          coPayment: data.co_payment,
          requestAmount: data.request_amount,
          totalCost: data.total_cost,
          comment: data.comment,
          reimbursmentRate: this.reimbursmentRate[index],
          existingId: data.existingId
        });
      });
      let requestType;
      if (this.type != '') {
        requestType = "medical-products"
      }
      else {
        if (this.pre_authArray[0] == true) {
          requestType = "pre-auth"
        } else {
          requestType = "medical-products"
        }
      }
      let reqData = {
        medicineDetails: medicineArray,
        totalCoPayment: this.medicineForm.value.totalCoPayment,
        totalRequestedAmount: this.medicineForm.value.totalRequestedAmount,
        totalCostOfAllMedicine: this.medicineForm.value.totalCostOfAllMedicine,
        pharmacyId: this.pharmacyId,
        claimObjectId: this.stepOneId,
        reimbursmentRate: this.reimbursmentRate[0],
        requestType: requestType,
        createdById: this.pharmacyId,
      };


      this.pharmacyPlanService.serviceTypeFourPortal(reqData).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            this.toastr.success(response.message);
            this.insuranceId = this.coreService.getSessionStorage("InsuranceId");
            this.medicineForm.reset();
            this.medicines.clear()            
            this.getClaimDetails("claimId");
            this.coreService.setDocumentData(this.insuranceId);
            this.mstepper.next();
          }
        },
        (err: ErrorEvent) => {
          this.toastr.error(err.message);
        }
      );
    } else {
      this.toastr.error("The services for which you wish to submit a claim, this one requires prior authorization. Please submit this service separately for prior authorization.");
    }


  }

  getMedicineList(query: any = "", index: any = 0, medicneId: string = "", serviceName: string = '', categoryService: string = '', serviceCode: string = '') {
    if (this.loggedType == "Paramedical-Professions") {
      this._superAdminService.getLabListData(this.page, this.pageSize, this.searchText).subscribe(
        (res) => {
          let result = this.coreService.decryptObjectData({ data: res });

          const medicineArray = [];
          for (const medicine of result.data.result) {
            medicineArray.push({
              label: medicine.lab_test,
              medicine_number: "",
              value: medicine._id,
            });
          }
          if (medicineArray.length > 0) {
            this.medicineList[index] = medicineArray;
            if (medicneId != "") {
              this.medicineIDObject[index] = medicneId;
              this.medicineNameObject[index] = query;
            }
            if (serviceName != "") {
              this.serviceObject[index] = serviceName;
            }
            if (serviceCode != "") {
              this.serviceCode[index] = serviceCode;
            }
            if (categoryService != "") {
              this.categoryObject[index] = categoryService;
            }
          } 
        },
        (err: ErrorEvent) => {
          console.log(err.message, "error");
        }
      );

    }

    else if (this.loggedType == "Laboratory-Imaging") {
      let reqData = {
        page: this.page,
        limit: this.pageSize,
        userId: this.pharmacyId,
        searchText: this.searchText,
        status: null,
        // sort: sort
      };
      this._superAdminService.listImagingApi(reqData).subscribe(
        (res) => {
          let result = this.coreService.decryptObjectData({ data: res });
          const medicineArray = [];
          for (const medicine of result.data.result) {
            medicineArray.push({
              label: medicine.imaging,
              medicine_number: "",
              value: medicine._id,
            });
          }
          if (medicineArray.length > 0) {
            this.medicineList[index] = medicineArray;
            if (medicneId != "") {
              this.medicineIDObject[index] = medicneId;
              this.medicineNameObject[index] = query;
            }
            if (serviceName != "") {
              this.serviceObject[index] = serviceName;
            }
            if (serviceCode != "") {
              this.serviceCode[index] = serviceCode;
            }
            if (categoryService != "") {
              this.categoryObject[index] = categoryService;
            }
          } 
        },
        (err: ErrorEvent) => {
          console.log(err.message, "error");
        }
      );
    }

    else if (this.loggedType == "Dental") {
      let reqData = {
        page: this.page,
        limit: this.pageSize,
        userId: this.pharmacyId,
        searchText: this.searchText,
        status: null,
        // sort: sort
      };
      this._superAdminService.listOthersApi(reqData).subscribe(
        (res) => {
          let result = this.coreService.decryptObjectData({ data: res });
          const medicineArray = [];
          for (const medicine of result.data.result) {
            medicineArray.push({
              label: medicine.others,
              medicine_number: "",
              value: medicine._id,
            });
          }
          if (medicineArray.length > 0) {
            this.medicineList[index] = medicineArray;
            if (medicneId != "") {
              this.medicineIDObject[index] = medicneId;
              this.medicineNameObject[index] = query;
            }
            if (serviceName != "") {
              this.serviceObject[index] = serviceName;
            }
            if (serviceCode != "") {
              this.serviceCode[index] = serviceCode;
            }
            if (categoryService != "") {
              this.categoryObject[index] = categoryService;
            }
          } 
        },
        (err: ErrorEvent) => {
          console.log(err.message, "error");
        }
      );
    }

    else if (this.loggedType == "Optical") {
      let reqData = {
        page: this.page,
        limit: this.pageSize,
        userId: this.pharmacyId,
        searchText: this.searchText,
        status: null,
        // sort: sort
      };
      this._superAdminService.listEyeglassessApi(reqData).subscribe(
        (res) => {
          let result = this.coreService.decryptObjectData({ data: res });        
          const medicineArray = [];
          for (const medicine of result.data.result) {
            medicineArray.push({
              label: medicine.eyeglass_name,
              medicine_number: "",
              value: medicine._id,
            });
          }
          if (medicineArray.length > 0) {
            this.medicineList[index] = medicineArray;
            if (medicneId != "") {
              this.medicineIDObject[index] = medicneId;
              this.medicineNameObject[index] = query;
            }
            if (serviceName != "") {
              this.serviceObject[index] = serviceName;
            }
            if (serviceCode != "") {
              this.serviceCode[index] = serviceCode;
            }
            if (categoryService != "") {
              this.categoryObject[index] = categoryService;
            }
          } 
        },
        (err: ErrorEvent) => {
          console.log(err.message, "error");
        }
      );
    }
  }

  async calCulatePrice(event: any, i: number) {
    if (this.serviceObject[i] != undefined && this.serviceObject[i].length>0) {
      let excReimburmentRate = 1;
      let reqAmt = 0;
      this.planExclusion.forEach((element) => {
        if (this.medicineNameObject[i]) {
          this.medicineNameObject[i] = this.medicineNameObject[i].toLowerCase();

          const result =
            this.medicineNameObject[i].indexOf(element.in_exclusion.name) == -1
              ? false
              : true;

          if (result) {
            excReimburmentRate = 0;
            return;
          }
        }
      });


      let prcPerunit = this.medicineForm.value.medicines[i].price_per_unit;
      let qtyDeliver = this.medicineForm.value.medicines[i].quantity_delivered;

      let totalCost = prcPerunit * qtyDeliver;
      let copay = 0;
      copay = totalCost;

      var currentdate = new Date();
      const planValidityToDate = new Date(this.planValidityTo);
      var currentDateTimestamp = currentdate.getTime();
      var planValidityToTimestamp = planValidityToDate.getTime();
    
      if (planValidityToTimestamp >= currentDateTimestamp) {
        if (excReimburmentRate == 1) {
          if (this.redeemed[i] === "no") {

            await this.checkServiceCount(this.selectedsubscriberid, this.healthPlanId, this.serviceObject[i], this.planValidity, this.serviceCount[i]?.max_no, totalCost, excReimburmentRate, i, this.categoryObject[i])
              .then(async (result1: any) => {
                if (result1?.status) { //while use limit is less than or equal to provided by insurnace(total limit) count
                  copay = result1?.data?.copay;
                  reqAmt = result1?.data?.reqAmt;
                  this.checkbreak[i] = result1?.data?.checkbreak;
                } else {
                  copay = totalCost
                  reqAmt = 0
                }

              });
          } else { // if redeemed is yes than need to check the waiting period time from date of joining of the subscriber

            var duration = this.waitingCount[i]?.duration?.unit;
            var min_no = this.waitingCount[i]?.duration?.min_no;

            var dateofJoining = new Date(this.dataofJoining);         

            if (duration == "Month") {
              dateofJoining.setMonth(dateofJoining.getMonth() + min_no);
            } else if (duration == "Year") {
              dateofJoining.setFullYear(dateofJoining.getFullYear() + min_no);
            } else {
              dateofJoining.setDate(dateofJoining.getFullYear() + min_no);
            }
            var currentDate = new Date()
            // if today date is grater than waiting period time
            if (currentDate > dateofJoining) {

              await this.checkServiceCount(this.selectedsubscriberid, this.healthPlanId, this.serviceObject[i], this.planValidity, this.serviceCount[i]?.max_no, totalCost, excReimburmentRate, i, this.categoryObject[i])
                .then(async (result1: any) => {

                  if (result1?.status) { //while use limit is less than or equal to provided by insurnace(total limit) count
                    copay = result1?.data?.copay;
                    reqAmt = result1?.data?.reqAmt;
                    this.checkbreak[i] = result1?.data?.checkbreak;
                  } else {
                    copay = totalCost
                    reqAmt = 0
                  }

                });

            } else { // if today date is less than or equal to waiting period time
              this.checkbreak[i] = 'As per your health plan, your selected waiting period is remaining so you need to pay 100% amount';
              copay = totalCost
              reqAmt = 0
            }
          }
        }
        else {
          this.checkbreak[i] = "Your Current Service name selection is excluded in your health plan.";
        }
      }
      else {
        this.checkbreak[i] = "Your Health plan has been expired now. please connect with your insurance company and renew your health plan. please try again";
      }

      if (this.type == '') {
        await this.medicines.controls[i].patchValue({
          total_cost: totalCost,
          co_payment: copay.toFixed(2),
          request_amount: reqAmt.toFixed(2),
        });
        this.onValueChnage();
      }
    }
  }

  public clearText() {
    this.medicineName = "";
  }

  get medicines() {
    return this.medicineForm.controls["medicines"] as FormArray;
  }

  waitingPeriodTimeCheck(totalCost) {
    return new Promise((resolve, reject) => {
      let data = {
        data: true,
        copay: 0,
        reqAmt: 0
      };

      this.pharmacyPlanService.getWaitingTime(this.selectedsubscriberid, this.healthPlanId, this.selectedservice, this.waitingCount).subscribe({
        next: async (res) => {
          let encryptedData = { data: res };
          let result = this.coreService.decryptObjectData(encryptedData);

          if (result?.data.length <= 0) {
            data["copay"] = 0;
            data["reqAmt"] = totalCost;
            data["data"] = true;
            resolve(data);
          } else {
            data["copay"] = totalCost;
            data["reqAmt"] = 0;
            data["data"] = false;
            resolve(data);
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  findObjectByKeyValue(arr, key, value) {
    return arr.filter(obj =>
      obj[key] === value
    );
  }

  checkFamilyServiceLimit(result, i, excReimburmentRate, totalCost, callby) {
    return new Promise((resolve, reject) => {
      var reqAmt = 0;
      var copay = 0;
      var requestedAmount1 = 0;
      if (callby == "ifcondition") {
        copay = ((100 - this.reimbursmentRate[i]) / 100) * totalCost;
        requestedAmount1 = (this.reimbursmentRate[i] / 100) * totalCost;
      } else {
        requestedAmount1 = (this.reimbursmentRate[i] / 100) * this.serviceLimit[i];
        copay = (((100 - this.reimbursmentRate[i]) / 100) * this.serviceLimit[i]) + (totalCost - this.serviceLimit[i]);

      }

      let medicineForm = this.medicineForm.value.medicines;
      let newmedicineForm = medicineForm.map((obj, index) => {
        if (index === i) {
          return { ...obj, request_amount: Number(requestedAmount1) };
        } else {
          return obj;
        }
      })     

      const resultObject = this.findObjectByKeyValue(newmedicineForm, "serviceName", this.serviceObject[i]);
      const totalCostaLL = resultObject.reduce((sum, item) => sum + Number(item.request_amount), 0);
      var usefamilyServiceLimit = result?.data.family_service_limit + totalCostaLL
      if (usefamilyServiceLimit <= this.primary_and_secondary_service_limit[i]) {

        //use limit is  less than of equal to provided family service by insurance
        if (this.categoryCondition[i] == "yes") { // if categoryCondition is yes 
        
          var useCategoryLimit = result?.data.category_limit + totalCostaLL
          if (useCategoryLimit <= this.categoryLimit[i]) { // use category limit is less than or equal to provided by category limit by insurance 

            var usefamilyCategoryLimit = result?.data.family_category_limit + totalCostaLL
            if (usefamilyCategoryLimit <= this.primary_and_secondary_category_limit[i]) { //use Limit is less than or equal to provided family category by insurance

              if (callby == "ifcondition") {

                if (excReimburmentRate == 1) {
                  if (this.reimbursmentRate[i] != undefined) {
                    reqAmt = (this.reimbursmentRate[i] / 100) * totalCost;

                  }
                } else {
                  reqAmt = (excReimburmentRate / 100) * totalCost;
                }

                if (totalCost <= reqAmt) {
                  reqAmt = totalCost;
                }
                var remainingOwnLimit;
                var remainingFamilyTotalLimit;
                copay = (totalCost - reqAmt)
                // copay = totalCost;
                if (this.ownLimit < (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))) {
                  remainingOwnLimit = 0
                } else {
                  remainingOwnLimit = this.ownLimit - (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))
                }

                if (this.famiyTotalLimit < (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))) {
                  remainingFamilyTotalLimit = 0
                } else {
                  remainingFamilyTotalLimit = this.famiyTotalLimit - (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))

                }
                if (remainingOwnLimit <= reqAmt) {
                  copay += reqAmt - remainingOwnLimit;
                  reqAmt = remainingOwnLimit;
                }

                if (remainingFamilyTotalLimit <= reqAmt) {

                  copay += reqAmt - remainingFamilyTotalLimit;
                  reqAmt = remainingFamilyTotalLimit;
                }

              }
              else {
                if (excReimburmentRate == 1) {
                  if (this.reimbursmentRate[i] != undefined) {
                    reqAmt = (this.reimbursmentRate[i] / 100) * this.serviceLimit[i];
                  }
                } else {
                  reqAmt = (excReimburmentRate / 100) * this.serviceLimit[i];
                }
                copay = totalCost - reqAmt;
                remainingOwnLimit = this.ownLimit - (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))
                remainingFamilyTotalLimit = this.famiyTotalLimit - (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))
                if (remainingOwnLimit <= reqAmt) {
                  copay += reqAmt - remainingOwnLimit;
                  reqAmt = remainingOwnLimit;
                }

                if (remainingFamilyTotalLimit <= reqAmt) {
                  copay += reqAmt - remainingFamilyTotalLimit;
                  reqAmt = remainingFamilyTotalLimit;
                }
              }
              resolve({
                status: true,
                data: {
                  checkbreak: "",
                  copay: copay,
                  reqAmt: reqAmt
                }
              })

            } else { //use Limit is grater than to provided family category by insurance
              var previousUsedLimit = result?.data.family_category_limit + (totalCostaLL - requestedAmount1)
              var TotalLimit = this.primary_and_secondary_category_limit[i];
              var remainingLimit = TotalLimit - previousUsedLimit;

              if (this.ownLimit < (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))) {
                remainingOwnLimit = 0
              } else {
                remainingOwnLimit = this.ownLimit - (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))
              }

              if (this.famiyTotalLimit < (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))) {
                remainingFamilyTotalLimit = 0
              } else {
                remainingFamilyTotalLimit = this.famiyTotalLimit - (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))

              }
              if (remainingOwnLimit <= remainingLimit) {
                remainingLimit = remainingOwnLimit;
              }

              if (remainingFamilyTotalLimit <= remainingLimit) {
                remainingLimit = remainingFamilyTotalLimit;

              }

              if (remainingLimit > 0) {
                if (requestedAmount1 >= remainingLimit) {
                  copay += (requestedAmount1 - remainingLimit);
                  requestedAmount1 = remainingLimit;
                }
              } else {
                copay += requestedAmount1
                requestedAmount1 = 0;
              }
              resolve({
                status: true,
                data: {
                  checkbreak: "As per your health plan, your family category limit for your current selected category has been exceeded so you need to pay remaining amount ",
                  copay: copay,
                  reqAmt: requestedAmount1
                }
              })
            }
          } else {// use category limit is greater than provided by category limit by insurance 

            var previousUsedLimit = result?.data.category_limit + (totalCostaLL - requestedAmount1)
            var TotalLimit = this.categoryLimit[i];
            var remainingLimit = TotalLimit - previousUsedLimit;
            if (this.ownLimit < (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))) {
              remainingOwnLimit = 0
            } else {
              remainingOwnLimit = this.ownLimit - (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))
            }

            if (this.famiyTotalLimit < (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))) {
              remainingFamilyTotalLimit = 0
            } else {
              remainingFamilyTotalLimit = this.famiyTotalLimit - (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))

            }
            if (remainingOwnLimit <= remainingLimit) {
              remainingLimit = remainingOwnLimit;
            }

            if (remainingFamilyTotalLimit <= remainingLimit) {
              remainingLimit = remainingFamilyTotalLimit;

            }
            if (remainingLimit > 0) {
              if (requestedAmount1 >= remainingLimit) {

                copay += (requestedAmount1 - remainingLimit);
                requestedAmount1 = remainingLimit;
              }
            } else {
              copay += requestedAmount1
              requestedAmount1 = 0;
            }

            resolve({
              status: true,
              data: {
                checkbreak: "As per your health plan, your category limit for your current selected category has been exceeded so you need to pay remaining amount ",
                copay: copay,
                reqAmt: requestedAmount1
              }
            })
          }
        } else { // if categoryCondition is no 


          if (callby == "ifcondition") {

            if (excReimburmentRate == 1) {
              if (this.reimbursmentRate[i] != undefined) {
                reqAmt = (this.reimbursmentRate[i] / 100) * totalCost;
              }
            } else {
              reqAmt = (excReimburmentRate / 100) * totalCost;
            }

            if (totalCost <= reqAmt) {
              reqAmt = totalCost;
            }
            copay = (totalCost - reqAmt)
            if (this.ownLimit < (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))) {
              remainingOwnLimit = 0
            } else {
              remainingOwnLimit = this.ownLimit - (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))
            }

            if (this.famiyTotalLimit < (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))) {
              remainingFamilyTotalLimit = 0
            } else {
              remainingFamilyTotalLimit = this.famiyTotalLimit - (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))

            }
            // remainingOwnLimit = this.ownLimit - (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))
            // remainingFamilyTotalLimit = this.famiyTotalLimit - (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))
            if (remainingOwnLimit <= reqAmt) {
              copay += reqAmt - remainingOwnLimit;
              reqAmt = remainingOwnLimit;
            }

            if (remainingFamilyTotalLimit <= reqAmt) {
              copay += reqAmt - remainingFamilyTotalLimit;
              reqAmt = remainingFamilyTotalLimit;
            }
          }
          else {
            if (excReimburmentRate == 1) {
              if (this.reimbursmentRate[i] != undefined) {
                reqAmt = (this.reimbursmentRate[i] / 100) * this.serviceLimit[i];

              }

            } else {
              reqAmt = (excReimburmentRate / 100) * this.serviceLimit[i];
            }
           
            copay = totalCost - reqAmt;
            if (this.ownLimit < (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))) {
              remainingOwnLimit = 0
            } else {
              remainingOwnLimit = this.ownLimit - (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))
            }

            if (this.famiyTotalLimit < (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))) {
              remainingFamilyTotalLimit = 0
            } else {
              remainingFamilyTotalLimit = this.famiyTotalLimit - (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))

            }
            // remainingOwnLimit = this.ownLimit - (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))
            // remainingFamilyTotalLimit = this.famiyTotalLimit - (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))
            if (remainingOwnLimit <= reqAmt) {
              copay += reqAmt - remainingOwnLimit;
              reqAmt = remainingOwnLimit;
            }

            if (remainingFamilyTotalLimit <= reqAmt) {
              copay += reqAmt - remainingFamilyTotalLimit;
              reqAmt = remainingFamilyTotalLimit;
            }
          }
          resolve({
            status: true,
            data: {
              checkbreak: "",
              copay: copay,
              reqAmt: reqAmt
            }
          })
        }

      } else {
        //use limit is  greater than  provided family service by insurance
        var previousUsedLimit = result?.data.family_service_limit + (totalCostaLL - requestedAmount1)
        var TotalLimit = this.primary_and_secondary_service_limit[i];
        var remainingLimit = TotalLimit - previousUsedLimit;
        if (this.ownLimit < (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))) {
          remainingOwnLimit = 0
        } else {
          remainingOwnLimit = this.ownLimit - (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))
        }

        if (this.famiyTotalLimit < (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))) {
          remainingFamilyTotalLimit = 0
        } else {
          remainingFamilyTotalLimit = this.famiyTotalLimit - (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))

        }
        // remainingOwnLimit = this.ownLimit - (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))
        // remainingFamilyTotalLimit = this.famiyTotalLimit - (parseFloat(result?.data.family_total_limit) + (totalCostaLL - requestedAmount1))
        if (remainingOwnLimit <= remainingLimit) {
          remainingLimit = remainingOwnLimit;

        }

        if (remainingFamilyTotalLimit <= remainingLimit) {
          remainingLimit = remainingFamilyTotalLimit;

        }
        if (remainingLimit > 0) {
          if (requestedAmount1 >= remainingLimit) {
            copay += (requestedAmount1 - remainingLimit);
            requestedAmount1 = remainingLimit;
          }
        } else {
          copay += requestedAmount1
          requestedAmount1 = 0;
        }



        resolve({
          status: true,
          data: {
            checkbreak: "As per your health plan, your family service limit for your current selected service has been exceeded so you need to pay remaining amount ",
            copay: copay,
            reqAmt: requestedAmount1
          }
        })
      }
    });
  }
  checkServiceCount(subscriber_id, health_plan_id, service_name, plan_validity, totalCount, totalCost, excReimburmentRate, i, category_name) {
    return new Promise((resolve, reject) => {
      this.pharmacyPlanService.getServiceClaimCount(subscriber_id, health_plan_id, service_name, plan_validity, category_name).subscribe({
        next: async (res) => {
          let encryptedData = { data: res };
          let result = this.coreService.decryptObjectData(encryptedData);
          var serviceCount = 0;
          var copay = 0;
          var reqAmt = 0;
          var checkbreak = '';
          if (result.status) {
            if (result?.data) {
              serviceCount = result?.data?.service_count + 1
              if (serviceCount <= totalCount) {
                if (this.serviceLimit[i] >= totalCost) { // if service limit(provided by insurance) greater than equal to total cost(fees) 

                  await this.checkFamilyServiceLimit(result, i, excReimburmentRate, totalCost, "ifcondition")
                    .then(async (result1: any) => {
                      if (result1?.status) { //while use limit is less than or equal to provided by insurnace(total limit) count
                        checkbreak = result1?.data?.checkbreak
                        copay = result1?.data?.copay;
                        reqAmt = result1?.data?.reqAmt;
                      } else {
                        copay = totalCost
                        reqAmt = 0
                      }

                      resolve({
                        status: true,
                        data: {
                          checkbreak: checkbreak,
                          copay: copay,
                          reqAmt: reqAmt
                        }
                      })

                    });
                } else {
                  await this.checkFamilyServiceLimit(result, i, excReimburmentRate, totalCost, "elsecondition")
                    .then(async (result1: any) => {
                      if (result1?.status) { //while use limit is less than or equal to provided by insurnace(total limit) count
                        checkbreak = result1?.data?.checkbreak
                        copay = result1?.data?.copay;
                        reqAmt = result1?.data?.reqAmt;

                      } else {
                        copay = totalCost
                        reqAmt = 0
                      }
                      resolve({
                        status: true,
                        data: {
                          checkbreak: checkbreak,
                          copay: copay,
                          reqAmt: reqAmt
                        }
                      })


                    });
                }

              } else {
                resolve({
                  status: true,
                  data: {
                    checkbreak: "As per your health plan, your number of service count is exceed ",
                    copay: totalCost,
                    reqAmt: 0
                  }
                })
              }
            }
            else {
              resolve({
                status: false,
                data: {}
              })
            }
          }
          else {
            resolve({
              status: false,
              data: {}
            })
          }
        },
        error: (err) => {
          reject({
            status: false,
            data: err
          });
        },
      });
    });
  }

  checkFamilyServiceCount(totalCost, categoryLimit, familycount) {
    return new Promise((resolve, reject) => {
      let data = {
        data: true,
        copay: 0,
        reqAmt: 0
      };

      this.pharmacyPlanService.getAllDetailsPlanCalculate(this.selectedsubscriberid, this.healthPlanId, this.selectedservice, this.serviceCount, familycount).subscribe({
        next: async (res) => {
          let encryptedData = { data: res };
          let result = this.coreService.decryptObjectData(encryptedData);
          if (result?.data.length <= 0) {
          } else {
            data["copay"] = totalCost;
            data["reqAmt"] = 0;
            data["data"] = false;
            resolve(data)
          }
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  newMedicineForm(): FormGroup {
    return this.fb.group({
      date_of_service: [new Date(), [Validators.required]],
      categoryService: ["", [Validators.required]],
      serviceName: ["", [Validators.required]],
      serviceCode: [""],
      medicineId: ["", [Validators.required]],
      medicine_name: ["", [Validators.required]],
      quantity_prescribed: [0, [Validators.required]],
      quantity_delivered: [0, [Validators.required]],
      frequency: [0, [Validators.required]],
      duration: [0, [Validators.required]],
      price_per_unit: [0, [Validators.required]],
      co_payment: [0, [Validators.required]],
      request_amount: [0, [Validators.required]],
      total_cost: [0, [Validators.required]],
      comment: [""],
      existingId: [""]
    });
  }

  addNewMedicine(medicineName: string = "", medicineId: string = "", serviceName: string = "", categoryService: string = "", serviceCode: string = "", index: any = "") {
    this.selectedMedicine.splice(index, 0, {
      name: "",
    });
    if (medicineName == "") {
      this.removeMedicineServiceType.splice(index, 0, '');
    }
    this.serviceArray.splice(index, 0, []);
    this.serviceCodeArray.splice(index, 0, []);
    this.medicineList.splice(index, 0, []);
    this.selectKeyPressValue.splice(index, 0, '');
    this.checkexclutiondata.splice(index, 0, '');
    this.checkexclutionDescription.splice(index, 0, '');
    this.serviceCode.splice(index, 0, '');
    this.checkpreAuthService.splice(index, 0, '');
    this.medicineNameObject.splice(index, 0, []);
    this.medicineIDObject.splice(index, 0, []);
    this.serviceObject.splice(index, 0, []);
    this.primary_and_secondary_category_limit.splice(index, 0, []);
    this.primary_and_secondary_service_limit.splice(index, 0, []);
    this.categoryLimit.splice(index, 0, []);
    this.categoryObject.splice(index, 0, []);
    this.serviceLimit.splice(index, 0, []);
    this.redeemed.splice(index, 0, []);
    this.checkbreak.splice(index, 0, []);
    this.serviceCount.splice(index, 0, []);
    this.waitingCount.splice(index, 0, []);
    this.categoryCondition.splice(index, 0, []);

    if (index >= 0) {

      this.medicines.insert(index, this.newMedicineForm());
    }   
    
    this.getMedicineList(medicineName, this.medicines.length - 1, medicineId, serviceName, categoryService, serviceCode);

  }

  removeMedicine(index: number) {
    let existing_id = this.removeMedicineServiceType[index]
    // api call after api call success then remove
    if (existing_id == "" || existing_id == undefined) {
      this.medicines.removeAt(index);
      this.medicineList.splice(index, 1);

      this.medicineIDObject.splice(index, 1);
      this.medicineNameObject.splice(index, 1);
      this.selectKeyPressValue.splice(index, 1);
      this.checkexclutiondata.splice(index, 1);
      this.checkexclutionDescription.splice(index, 1);
      this.serviceCode.splice(index, 1);

      this.checkpreAuthService.splice(index, 1);
      this.serviceObject.splice(index, 1);
      this.primary_and_secondary_category_limit.splice(index, 1);
      this.primary_and_secondary_service_limit.splice(index, 1);
      this.categoryLimit.splice(index, 1);
      this.categoryObject.splice(index, 1);
      this.pre_authArray.splice(index, 1);
      this.serviceLimit.splice(index, 1);
      this.redeemed.splice(index, 1);
      this.checkbreak.splice(index, 1);
      this.serviceCount.splice(index, 1);
      this.waitingCount.splice(index, 1);
      this.categoryCondition.splice(index, 1);
      if (this.type == '') {
        this.onValueChnage();
      }
    } else {
      this.openVerticallyCentereddetale(this.delete_medicine, existing_id, index);
    }
  }

  openVerticallyCentereddetale(delete_medicine: any, existing_id: any, index: any) {
    this.deleted_id = existing_id;
    this.deleteIndex = index;
    this.modalService.open(delete_medicine, { centered: true, size: "md" });
  }


  delete_medicineById() {
    let reqData = {
      medicineId: this.deleted_id,
    }
    this.pharmacyPlanService.deleteMedicineExisting(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status == true) {
        this.toastr.success(response.message);
        this.modalService.dismissAll();
        this.removeMedicineServiceType.splice(this.deleteIndex, 1)
        this.medicines.removeAt(this.deleteIndex);
        this.medicineList.splice(this.deleteIndex, 1);

        this.medicineIDObject.splice(this.deleteIndex, 1);
        this.medicineNameObject.splice(this.deleteIndex, 1);
        this.selectKeyPressValue.splice(this.deleteIndex, 1);
        this.checkexclutiondata.splice(this.deleteIndex, 1);
        this.checkexclutionDescription.splice(this.deleteIndex, 1);
        this.serviceCode.splice(this.deleteIndex, 1);

        this.checkpreAuthService.splice(this.deleteIndex, 1);
        this.serviceObject.splice(this.deleteIndex, 1);
        this.primary_and_secondary_category_limit.splice(this.deleteIndex, 1);
        this.primary_and_secondary_service_limit.splice(this.deleteIndex, 1);
        this.categoryLimit.splice(this.deleteIndex, 1)
        this.serviceLimit.splice(this.deleteIndex, 1);
        this.categoryObject.splice(this.deleteIndex, 1);
        this.pre_authArray.splice(this.deleteIndex, 1);
        this.redeemed.splice(this.deleteIndex, 1);
        this.checkbreak.splice(this.deleteIndex, 1);
        this.serviceCount.splice(this.deleteIndex, 1);
        this.waitingCount.splice(this.deleteIndex, 1);
        this.categoryCondition.splice(this.deleteIndex, 1);
        this.onValueChnage();
      } else {
        this.toastr.error(response.message);
      }
    });
  }





  // Prescription Details modal
  openVerticallyCenteredPrescription(prescriptioncontent: any) {
    this.modalService.open(prescriptioncontent, {
      centered: true,
      size: "xl",
      windowClass: "prescription_de",
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

  ngOnDestroy(): void {
    if (this.insuranceSubcription) {
      this.insuranceSubcription.unsubscribe();
    }

    if (this.ePrescriptionData) {
      this.ePrescriptionData.unsubscribe();
    }
  }


  getPortalTypeAndInsuranceId() {
    this.categoryList = [];
    let data = {
      insuranceId: this.insuranceId,
      portalType: this.loggedType,
    };
    if (this.insuranceId != null) {
      this.pharmacySerivice.getPortalTypeAndInsuranceId(data).subscribe({
        next: (res) => {

          let encryptedData = { data: res };
          let result = this.coreService.decryptObjectData(encryptedData);

          this.categoryData = result.body.result[0]?.categoryName;

          if( this.categoryData !== undefined){

            this.categoryData.map((curentval: any) => {
              let checkCategoryData = this.categoryList.filter(obj => obj.label == curentval && obj.value == curentval);
              if (checkCategoryData.length == 0) {
                this.categoryList.push({
                  label: curentval,
                  value: curentval,
                });
              }
  
  
            });
          }
          if (this.orderId != "" && this.orderId != undefined) {
            this.getOrderDetails();
          }

        },
        error: (err: ErrorEvent) => {
          this.coreService.showError("", err.message);
        },
      });
    }

  }

  getCategoryId(event: any, i: any) {
    if (event.value != undefined) {
      this.serviceArray[i] = [];
      this.serviceCodeArray[i] = [];
      this.categoryObject[i] = event.value
      this.serviceObject[i] = "";
      this.serviceCode[i] = "";
      if (this.planService.length > 0) {

        this.planService.forEach((data) => {
          if ((data.has_category)?.toLowerCase() == (event.value)?.toLowerCase()) {


            this.serviceArray[i].push({
              label: data.service,
              value: data.service,
            })

            this.serviceCodeArray[i].push({
              label: data.service_code,
              value: data.service_code,
            })
            // const inputField = document.getElementById(`serviceCodeInput_${i}`) as HTMLInputElement;
            // if (inputField) {
            //   inputField.value = this.serviceCode;
            // }
          }
        })
      }
    }
  }

  getSeriviceName(event, i) {
    this.selectedservice = event.value;
    this.serviceObject[i] = event.value
    if (!event || !event.value) {
      // Handle the case where event or event.value is undefined
      return;
    } else {
      this.planService.forEach((element) => {
        if ((element?.service)?.toLowerCase() === (this.selectedservice)?.toLowerCase()) {
          this.pre_authArray[i] = (element.pre_authorization);
          this.reimbursmentRate[i] = element.reimbursment_rate;
          this.serviceCode[i] = element.service_code;
          this.checkexclutionDescription[i] = element.comment;
          if (element.pre_authorization) {
            this.checkpreAuthService[i] = "This service required pre-authorization";
          } else {
            this.checkpreAuthService[i] = "";
          }
          return;
        }
      });
    }


  }

  getServiceCode(event, i) {
    this.selectedservice = event.value;
    this.serviceCode[i] = event.value

    this.planService.forEach((element) => {
      if ((element?.service_code)?.toLowerCase() === (this.selectedservice)?.toLowerCase()) {
        this.pre_authArray[i] = (element.pre_authorization);
        this.reimbursmentRate[i] = element.reimbursment_rate;
        this.serviceObject[i] = element.service;
        this.checkexclutionDescription[i] = element.comment;
        this.serviceLimit[i] = element.in_limit.service_limit;
        this.categoryLimit[i] = element.in_limit.category_limit;
        this.healthPlanId = element.for_plan;
        this.serviceCount[i] = element.has_conditions.repayment_condition;
        this.redeemed[i] = element?.waiting_period?.redeemed;
        this.waitingCount[i] = element?.waiting_period;
        this.categoryCondition[i] = element?.has_conditions?.category_condition;
        this.checkbreak[i] = '';


        if (element.pre_authorization) {
          this.checkpreAuthService[i] = "This service required pre-authorization";
        } else {
          this.checkpreAuthService[i] = "";
        }
        return;
      }
    });

    if (this.planServicePrimary && this.planServicePrimary.length > 0) {

    this.planServicePrimary.forEach((element: any) => {
      if ((element?.service_code)?.toLowerCase() === (this.selectedservice)?.toLowerCase()) {
        this.primary_and_secondary_category_limit[i] = element.primary_and_secondary_category_limit;
        this.primary_and_secondary_service_limit[i] = element.primary_and_secondary_service_limit
        return;
      }
    });
  }
  }

  isExclusionActive(i: number): boolean {

    return this.checkexclutiondata[i] === '1';
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

        if (result.status === true) {
          let obj = [];

          var totalCoPayment = 0;
          var totalRequestedAmount = 0;
          var totalCostOfAllMedicine = 0;
          if (result?.data?.testDetails.length > 0) {
            result?.data?.testDetails.forEach(
              (element: any, index: any) => {

                totalCoPayment += element?.co_payment;
                totalRequestedAmount += element?.request_amount;
                totalCostOfAllMedicine += element?.total_cost
                this.addNewMedicine(element.name, element.medicine_id, element.service, element.category, '', index);
                this.selectedMedicine[index].name = element.name;
                obj.push({
                  date_of_service: element?.createdAt,
                  categoryService: element?.category,
                  medicineId: element?.medicine_id,
                  medicine_name: element?.name,
                  serviceName: element?.service,
                  serviceCode: '',
                  quantity_prescribed: element?.quantity_data?.prescribed,
                  quantity_delivered: element?.quantity_data?.delivered,
                  frequency: element?.frequency,
                  duration: element?.duration,
                  price_per_unit: element?.price_per_unit,
                  co_payment: element?.co_payment,
                  request_amount: element?.request_amount,
                  total_cost: element?.total_cost,
                  comment: '',
                  existingId: ""
                });
              }

            );
            this.medicineForm.patchValue({
              totalCoPayment: totalCoPayment,
              totalRequestedAmount: totalRequestedAmount,
              totalCostOfAllMedicine: totalCostOfAllMedicine,
              medicines: obj,
            });
          } else {
            this.addNewMedicine('', '', '', '', '', 0);
          }

        }
      },
      error: (err: ErrorEvent) => {
        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }


}
