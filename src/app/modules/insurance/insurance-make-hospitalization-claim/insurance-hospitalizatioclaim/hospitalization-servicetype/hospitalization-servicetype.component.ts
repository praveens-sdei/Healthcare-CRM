import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { log } from 'console';
import { Select2Data, Select2UpdateEvent } from 'ng-select2-component';
import { Validators, Toolbar, Editor } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { PatientService } from 'src/app/modules/patient/patient.service';
import { PharmacyPlanService } from 'src/app/modules/pharmacy/pharmacy-plan.service';
import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';
import { CoreService } from 'src/app/shared/core.service';
import { IndiviualDoctorService } from "../../../../individual-doctor/indiviual-doctor.service";
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
  selector: 'app-hospitalization-servicetype',
  templateUrl: './hospitalization-servicetype.component.html',
  styleUrls: ['./hospitalization-servicetype.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HospitalizationServicetypeComponent implements OnInit {
  @Input() public mstepper: MatStepper;
  @ViewChild("delete_medicine") delete_medicine: ElementRef;
  selectedDate: any = new Date();

  displayedColumns: string[] = [
    "pregnancyRelated",
    "requestType",
    "hospitalizationCategory",
    "reasonOfHopitalization",
    "provisionalDiagnosis",
    "fromHospitalizationDate",
    "fromHospitalizationTime",
    "toHospitaldate",
    "toHospitaltime",
    "numberOfNights",
    "comment",
    "hospitalizatinDetails",


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
    "pregnancyRelated",
    "requestType",
    "hospitalizationCategory",
    "reasonOfHopitalization",
    "provisionalDiagnosis",
    "fromHospitalizationDate",
    "fromHospitalizationTime",
    "toHospitaldate",
    "toHospitaltime",
    "numberOfNights",
    "comment",
    "hospitalizatinDetails",



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
  serviceDataFrom: any = FormGroup;
  medicineList: Select2Data[] = [];
  planExclusion: any[] = [];
  medicineName: string = "";
  medicineIDObject: any = [];
  medicineNameObject: any = [];
  categoryObject: any = [];
  serviceObject: any = [];
  newMedicineArray: any = {};
  exludeMedicineAmount: any;
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
  selectedMedicine: any[] = [];
  overlay: false;
  selectKeyPressValue: any = [];
  checkexclutiondata: any = [];
  checkexclutionDescription: any = [];
  serviceCode: any = [];
  checkpreAuthService: any = [];
  categoryList: any = []; appointmentReasonArray: any;
  requestedTypeData;
  hostpitalizationcategoryChange: any;
  removeMedicineServiceType: any = [];
  deleted_id: any;
  deleteIndex: any;
  isSubmitted: boolean = false;
  page: any = 1;
  pageSize: number = 100000;
  totalLength: number = 0;
  searchText: any = "";
  userId: any = "";
  type: any = '';
  showPregnancyRelatedDateField: boolean = false;
  minDate: Date;
  // // options = {
  // //     displaySearchStatus: 'default',
  // //     minCountForSearch: 0,
  // //     minCharForSearch: 1
  // //   };
  //   minCountForSearch = 1;

  ePrescriptionMedicines: any = [];
  categoryData: any;
  planService: any = [];
  serviceArray: any = [];
  serviceCodeArray: any = [];
  redeemed: any = [];
  serviceCount: any = [];
  primary_and_secondary_category_limit: any = [];
  primary_and_secondary_service_limit: any = [];
  pre_authArray: any = [];
  serviceLimit: any = [];
  checkbreak: any = [];
  categoryCondition: any = [];
  waitingCount: any = [];
  categoryLimit: any = [];
  orderId: any = "";
  costForService: any = {};
  checkHospitalizationValidate: any;
  loggedInuserId: any;
  hospitalizationCategoryValue: any;
  checkHospitalcategoryVal: any;
  claimtype: any;
  public dateControl = new FormControl(new Date());
  requestTypeCheck: any;
  checkOtherService: any;
  abouteditorEn!: Editor;
  extensionEditiorEn!: Editor;
  finalEditiorEn!: Editor;
  abouteditor!: Editor;
  famiyTotalLimit: any;
  primaryTotalLimit: any;
  secondaryTotalLimit: any;
  ownLimit: any;
  toolbar: Toolbar = [
    ["bold", "italic", "underline", "text_color", "background_color", "strike"],
    ["align_left", "align_center", "align_right", "align_justify"],
    ["ordered_list", "bullet_list"],
    ["code", "blockquote"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["link", "image"],
  ];

  toolbar1: Toolbar = [
    ["bold", "italic", "underline", "text_color", "background_color", "strike"],
    ["align_left", "align_center", "align_right", "align_justify"],
    ["ordered_list", "bullet_list"],
    ["code", "blockquote"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["link", "image"],
  ];

  toolbar3: Toolbar = [
    ["bold", "italic", "underline", "text_color", "background_color", "strike"],
    ["align_left", "align_center", "align_right", "align_justify"],
    ["ordered_list", "bullet_list"],
    ["code", "blockquote"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["link", "image"],
  ];
  planServicePrimary: any;
  planValidityFrom: any;
  planValidity: string;
  planValidityTo: any;
  dataofJoining: any;
  healthPlanId: any;
  DateOfPregnanacy: any;
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
    private doctorService: IndiviualDoctorService,
  ) {
    // throw new Error('This will prevent component initialization');

    this.insuranceId = this.coreService.getSessionStorage("InsuranceId");


    // this.stepOneId = this.coreService.getSessionStorage("stepOneId");
    this.costForService = {};
    this.selectedservice = this.coreService.getSessionStorage("service");
    this.selectedsubscriberid =
      this.coreService.getSessionStorage("subscriberid");



    this.insuranceSubcription = this.coreService.SharingInsId.subscribe(
      (res) => {
        if (res != "default") {
          this.insuranceId = res;
          this.stepOneId = this.coreService.getSessionStorage("stepOneId");

          // this.selectedservice = this.coreService.getSessionStorage("service");
          this.selectedsubscriberid =
            this.coreService.getSessionStorage("subscriberid");
          this.coreService.setSessionStorage(0, "step");



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
         
          if (this.claimtype === "Hospitalization Extention") {
            this.hostpitalizationcategoryChange = "Hospitalization Extention";

          }
          if (this.claimtype === "Hospitalization Final Claim") {
            this.hostpitalizationcategoryChange = "Hospitalization Final Claim";

          }
          if (this.selectclaimid != "" && this.selectclaimid != undefined) {           
            this.medicineForm.reset();
            this.medicines.clear()
       
            this.getClaimDetails();

          }
          else {
            this.medicineForm.patchValue({
              hospitalizationCategory: "Hospitalization Statement",
              requestType: "hospitalization"
            })
           
            this.getPlanDetails();
            this.getPortalTypeAndInsuranceId();
          }
        }
      }
    );


    if (this.stepOneId == null || this.insuranceId == null) {
      this.router.createUrlTree(["/insurance/make-hospitalization-claim"]);
    }
    this.medicineForm = this.fb.group({
      medicines: this.fb.array([]),
      totalCoPayment: [0],
      totalRequestedAmount: [0],
      totalCostOfAllMedicine: [0],
      pregnancyRelated: ["No"],
      reasonOfHopitalization: [""],
      provisionalDiagnosis: [""],
      fromHospitalizationDate: [""],
      fromHospitalizationTime: [""],
      toHospitaldate: [""],
      toHospitaltime: [""],
      numberOfNights: [0],
      hospitalizatinDetails: [""],
      reasonOfHopitalizationExtension: [""],
      updateDiagnosis: [""],
      fromHospitalizationExtensionDate: [""],
      fromHospitalizationExtensionTime: [""],
      toHospitalExtensiondate: [""],
      toHospitalExtensiontime: [""],
      hospitalizatinExtensionDetails: [""],
      extensionComment: [""],
      reasonOfFinalHopitalization: [""],
      finalDiagnosis: [""],
      fromFinalHospitalizationDate: [""],
      fromFinalHospitalizationTime: [""],
      toFinalHospitaldate: [""],
      toFinalHospitaltime: [""],
      hospitalizationFinalDetails: [""],
      FinalComment: [""],
      fromPreauthDate: [""],
      reasonOfPreauth: [""],
      fromPreauthTime: [""],
      toPreauthdate: [""],
      toPreauthtime: [""],
      PreauthDetails: [""],
      provisionalDiagnosisPreauth: [""],
      hospitalizationCategory: ["", Validators.required],
      date_of_Pregnancy: [""],
      comment: [""],
      requestType: ["", Validators.required]


    });

    this.requestedTypeData = 'hospitalization';
    this.hostpitalizationcategoryChange = "Hospitalization Statement";
    const initialCategory = 'Hospitalization Statement';
    this.updateValidatorsBasedOnCategory(initialCategory);
    this.medicineForm.get('toHospitalExtensiondate').setValidators(this.validateDateRange.bind(this));
    this.medicineForm.get('toFinalHospitaldate').setValidators(this.validateDateRange.bind(this));
  }

  private getClaimDetails(type = '') {
    if (type != "") {
      this.pharmacyPlanService
        .medicineClaimDetailsPharmacyByClaimObjectIdHopitalization(this.stepOneId)
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
                  console.log(element.serviceName, "check log for elelemnt", element._id);
                  this.addNewMedicine(element.medicineName, element.medicineId, element.serviceName, element.categoryService, element.serviceCode, index);
                  this.selectedMedicine[index].name = element.medicineName;
                  this.removeMedicineServiceType.push(element._id);
                  // if (this.type != '') {
                  //   obj.push({
                  //     date_of_service: element?.date_of_service,
                  //     categoryService: element?.categoryService,
                  //     medicineId: element?.medicineId,
                  //     medicine_name: element?.medicineName,
                  //     serviceName: element?.serviceName,
                  //     serviceCode: element?.serviceCode,
                  //     quantity_prescribed: element?.quantityPrescribed,
                  //     quantity_delivered: element?.quantityDelivered,
                  //     frequency: element?.frequency,
                  //     duration: element?.duration,
                  //     price_per_unit: element?.pricePerUnit,
                  //     co_payment: element?.coPayment,
                  //     request_amount: element?.requestAmount,
                  //     total_cost: element?.totalCost,
                  //     comment: element?.comment,
                  //     existingId: ""
                  //   });
                  // }
                  // if (this.claimtype != '') {
                  //   obj.push({
                  //     date_of_service: element?.date_of_service,
                  //     categoryService: element?.categoryService,
                  //     medicineId: element?.medicineId,
                  //     medicine_name: element?.medicineName,
                  //     serviceName: element?.serviceName,
                  //     serviceCode: element?.serviceCode,
                  //     quantity_prescribed: element?.quantityPrescribed,
                  //     quantity_delivered: element?.quantityDelivered,
                  //     frequency: element?.frequency,
                  //     duration: element?.duration,
                  //     price_per_unit: element?.pricePerUnit,
                  //     co_payment: element?.coPayment,
                  //     request_amount: element?.requestAmount,
                  //     total_cost: element?.totalCost,
                  //     comment: element?.comment,
                  //     existingId: ""
                  //   });
                  // }
                  // if (this.claimtype == '' && this.type=='') 
                  //  {
                  obj.push({
                    date_of_service: element?.date_of_service,
                    categoryService: element?.categoryService,
                    medicineId: element?.medicineId,
                    medicine_name: element?.medicineName,
                    serviceName: element?.serviceName,
                    serviceCode: element?.serviceCode,
                    other_service_name: element?.other_service_name,
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
                  // }
                }
              );
            } else {

              this.addNewMedicine('', '', '', '', '', 0);
            }
            this.medicineForm.patchValue({
              totalCoPayment: claimData?.totalCoPayment,
              totalRequestedAmount: claimData?.totalRequestedAmount,
              totalCostOfAllMedicine: claimData?.totalCostOfAllMedicine,
              reasonOfHopitalization: claimData?.hospitalservicedatas[0]?.reasonOfHopitalization,
              reasonOfPreauth: claimData?.hospitalservicedatas[0]?.reasonOfPreauth,
              provisionalDiagnosisPreauth: claimData?.hospitalservicedatas[0]?.provisionalDiagnosisPreauth,
              provisionalDiagnosis: claimData?.hospitalservicedatas[0]?.provisionalDiagnosis,
              fromHospitalizationDate: claimData?.hospitalservicedatas[0]?.fromHospitalizationDate,
              fromHospitalizationTime: claimData?.hospitalservicedatas[0]?.fromHospitalizationTime,
              toHospitaldate: claimData?.hospitalservicedatas[0]?.toHospitaldate,
              toHospitaltime: claimData?.hospitalservicedatas[0]?.toHospitaltime,
              numberOfNights: claimData?.hospitalservicedatas[0]?.numberOfNights ? claimData?.hospitalservicedatas[0]?.numberOfNights : 0,
              hospitalizatinDetails: claimData?.hospitalservicedatas[0]?.hospitalizatinDetails,
              comment: claimData?.hospitalservicedatas[0]?.comment,
              hospitalizationCategory: claimData?.hospitalservicedatas[0]?.hospitalizationCategory,
              pregnancyRelated: claimData?.hospitalservicedatas[0]?.pregnancyRelated,
              requestType: claimData?.hospitalservicedatas[0]?.requestType,
              reasonOfHopitalizationExtension: claimData?.hospitalservicedatas[0]?.reasonOfHopitalizationExtension,
              reasonOfFinalHopitalization: claimData?.hospitalservicedatas[0]?.reasonOfFinalHopitalization,
              updateDiagnosis: claimData?.hospitalservicedatas[0]?.updateDiagnosis,
              finalDiagnosis: claimData?.hospitalservicedatas[0]?.finalDiagnosis,
              fromHospitalizationExtensionDate: claimData?.hospitalservicedatas[0]?.fromHospitalizationExtensionDate,
              fromHospitalizationExtensionTime: claimData?.hospitalservicedatas[0]?.fromHospitalizationExtensionTime,
              fromFinalHospitalizationDate: claimData?.hospitalservicedatas[0]?.fromFinalHospitalizationDate,
              fromFinalHospitalizationTime: claimData?.hospitalservicedatas[0]?.fromFinalHospitalizationTime,
              toHospitalExtensiondate: claimData?.hospitalservicedatas[0]?.toHospitalExtensiondate,
              toHospitalExtensiontime: claimData?.hospitalservicedatas[0]?.toHospitalExtensiontime,
              toFinalHospitaldate: claimData?.hospitalservicedatas[0]?.toFinalHospitaldate,
              toFinalHospitaltime: claimData?.hospitalservicedatas[0]?.toFinalHospitaltime,
              hospitalizatinExtensionDetails: claimData?.hospitalservicedatas[0]?.requestType,
              extensionComment: claimData?.hospitalservicedatas[0]?.extensionComment,
              hospitalizationFinalDetails: claimData?.hospitalservicedatas[0]?.hospitalizationFinalDetails,
              FinalComment: claimData?.hospitalservicedatas[0]?.FinalComment,
              fromPreauthDate: claimData?.hospitalservicedatas[0]?.fromPreauthDate,
              fromPreauthTime: claimData?.hospitalservicedatas[0]?.fromPreauthTime,
              toPreauthdate: claimData?.hospitalservicedatas[0]?.toPreauthdate,
              toPreauthtime: claimData?.hospitalservicedatas[0]?.toPreauthtime,
              PreauthDetails: claimData?.hospitalservicedatas[0]?.PreauthDetails,

              medicines: obj,
            });
            // if (this.medicineForm.get("totalRequestedAmount").value > 0) {
            //   this.requestDisable = true
            // } else {
            //   this.requestDisable = false
            //   console.log("log else check", this.requestDisable);
            // }
          },
          error: (err: ErrorEvent) => {
            console.log(err.message);
          },
        });
    }   
    else {
      this.pharmacyPlanService
        .medicineClaimDetailswithHospitalData(this.selectclaimid)
        .subscribe({
          next: async (res) => {
            this.getPlanDetails();
            this.getPortalTypeAndInsuranceId();
            let encData = await res;
            let result = await this.coreService.decryptContext(encData);
            let claimData = result.data[0];
            console.log(claimData, "claimDataclaimData");
            this.requestTypeCheck = claimData?.requestType;
            console.log(this.requestTypeCheck, "check requesttyp");

            this.removeMedicineServiceType = [];
            let obj = [];
            if (claimData?.medicinedetailsonclaims.length > 0) {
              claimData?.medicinedetailsonclaims.forEach(
                (element: any, index: any) => {
                  console.log(element, "check log for elelemnt123", element._id);

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
                      existingId: '',
                      medicalConsultationFees: element.medicalConsultationFees,
                      reasonOfConsultation: element.reasonOfConsultation

                    });
                  }
                  if (this.claimtype != '') {
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
                      existingId: '',
                      medicalConsultationFees: element.medicalConsultationFees,
                      reasonOfConsultation: element.reasonOfConsultation

                    });
                  }
                  if (this.claimtype == '' && this.type == '') {
                    obj.push({
                      date_of_service: element?.date_of_service,
                      categoryService: element?.categoryService,
                      medicineId: element?.medicineId,
                      medicine_name: element?.medicineName,
                      serviceName: element?.serviceName,
                      serviceCode: element?.serviceCode,
                      other_service_name: element?.other_service_name,
                      quantity_prescribed: element?.quantityPrescribed,
                      quantity_delivered: element?.quantityDelivered,
                      frequency: element?.frequency,
                      duration: element?.duration,
                      price_per_unit: element?.pricePerUnit,
                      co_payment: element?.coPayment,
                      request_amount: element?.requestAmount,
                      total_cost: element?.totalCost,
                      comment: element?.comment,
                      existingId: element._id,
                      medicalConsultationFees: element.medicalConsultationFees,
                      reasonOfConsultation: element.reasonOfConsultation

                    });
                  }
                }
              );
            } else {
              this.addNewMedicine('', '', '', '', '', 0);
            }

            if (this.type != '') {
              console.log(claimData?.totalApprovedAmount, "type11111111111111111" + this.type, "type11111111111111111", (parseFloat(claimData?.totalRequestedAmount) - parseFloat(claimData?.totalApprovedAmount)));
              // this.checkRequestedType(claimData?.hospitalservicedatas[0]?.requestType)
              // if (this.claimtype == "Hospitalization Extention") {
              //   this.hostpitalizationcategoryChange = "Hospitalization Extention";
              // }

              this.medicineForm.patchValue({
                totalCoPayment: parseFloat(claimData?.totalCoPayment) + (parseFloat(claimData?.totalRequestedAmount) - parseFloat(claimData?.totalApprovedAmount)),
                totalRequestedAmount: claimData?.totalApprovedAmount,
                totalCostOfAllMedicine: claimData?.totalCostOfAllMedicine,
                reasonOfHopitalization: claimData?.hospitalservicedatas[0]?.reasonOfHopitalization,

                provisionalDiagnosisPreauth: claimData?.hospitalservicedatas[0]?.provisionalDiagnosisPreauth,
                reasonOfPreauth: claimData?.hospitalservicedatas[0]?.reasonOfPreauth,
                provisionalDiagnosis: claimData?.hospitalservicedatas[0]?.provisionalDiagnosis,
                fromHospitalizationDate: claimData?.hospitalservicedatas[0]?.fromHospitalizationDate,
                fromHospitalizationTime: claimData?.hospitalservicedatas[0]?.fromHospitalizationTime,
                toHospitaldate: claimData?.hospitalservicedatas[0]?.toHospitaldate,
                toHospitaltime: claimData?.hospitalservicedatas[0]?.toHospitaltime,
                numberOfNights: claimData?.hospitalservicedatas[0]?.numberOfNights,
                hospitalizatinDetails: claimData?.hospitalservicedatas[0]?.hospitalizatinDetails,
                comment: claimData?.hospitalservicedatas[0]?.comment,
                hospitalizationCategory: claimData?.hospitalservicedatas[0]?.hospitalizationCategory,
                pregnancyRelated: claimData?.hospitalservicedatas[0]?.pregnancyRelated,
                requestType: claimData?.hospitalservicedatas[0]?.requestType,

                reasonOfHopitalizationExtension: claimData?.hospitalservicedatas[0]?.reasonOfHopitalizationExtension,
                reasonOfFinalHopitalization: claimData?.hospitalservicedatas[0]?.reasonOfFinalHopitalization,
                updateDiagnosis: claimData?.hospitalservicedatas[0]?.updateDiagnosis,
                finalDiagnosis: claimData?.hospitalservicedatas[0]?.finalDiagnosis,
                fromHospitalizationExtensionDate: claimData?.hospitalservicedatas[0]?.fromHospitalizationExtensionDate,
                fromHospitalizationExtensionTime: claimData?.hospitalservicedatas[0]?.fromHospitalizationExtensionTime,
                fromFinalHospitalizationDate: claimData?.hospitalservicedatas[0]?.fromFinalHospitalizationDate,
                fromFinalHospitalizationTime: claimData?.hospitalservicedatas[0]?.fromFinalHospitalizationTime,
                toHospitalExtensiondate: claimData?.hospitalservicedatas[0]?.toHospitalExtensiondate,
                toHospitalExtensiontime: claimData?.hospitalservicedatas[0]?.toHospitalExtensiontime,
                toFinalHospitaldate: claimData?.hospitalservicedatas[0]?.toFinalHospitaldate,
                toFinalHospitaltime: claimData?.hospitalservicedatas[0]?.toFinalHospitaltime,
                hospitalizatinExtensionDetails: claimData?.hospitalservicedatas[0]?.requestType,
                extensionComment: claimData?.hospitalservicedatas[0]?.extensionComment,
                hospitalizationFinalDetails: claimData?.hospitalservicedatas[0]?.hospitalizationFinalDetails,
                FinalComment: claimData?.hospitalservicedatas[0]?.FinalComment,
                fromPreauthDate: claimData?.hospitalservicedatas[0]?.fromPreauthDate,
                fromPreauthTime: claimData?.hospitalservicedatas[0]?.fromPreauthTime,
                toPreauthdate: claimData?.hospitalservicedatas[0]?.toPreauthdate,
                toPreauthtime: claimData?.hospitalservicedatas[0]?.toPreauthtime,
                PreauthDetails: claimData?.hospitalservicedatas[0]?.PreauthDetails,
                medicines: obj,
              });
              console.log(this.hostpitalizationcategoryChange, "this.hostpitalizationcategoryChange ");


            }


            if (this.claimtype != '') {

              // this.checkRequestedType(claimData?.hospitalservicedatas[0]?.requestType)
              // if (this.claimtype == "Hospitalization Extention") {
              //   this.hostpitalizationcategoryChange = "Hospitalization Extention";
              //   // this.requestedTypeData = "hospitalization" 
              // }
              this.updateMinDate(claimData?.hospitalservicedatas[0]?.toHospitaldate);


              if (claimData?.hospitalservicedatas[0]?.fromHospitalizationExtensionDate != "" && claimData?.hospitalservicedatas[0]?.fromHospitalizationExtensionTime != "") {
                this.medicineForm.patchValue({
                  fromFinalHospitalizationDate: claimData?.hospitalservicedatas[0]?.toHospitalExtensiondate,
                  fromFinalHospitalizationTime: claimData?.hospitalservicedatas[0]?.toHospitalExtensiontime,
                })
                this.updateMinDateFinalDate(claimData?.hospitalservicedatas[0]?.fromHospitalizationExtensionDate);
              } else {
                this.medicineForm.patchValue({
                  fromFinalHospitalizationDate: claimData?.hospitalservicedatas[0]?.toHospitaldate,
                  fromFinalHospitalizationTime: claimData?.hospitalservicedatas[0]?.toHospitaltime,
                })
                this.updateMinDateFinalDate(claimData?.hospitalservicedatas[0]?.toHospitaldate);
              }

              this.medicineForm.patchValue({
                totalCoPayment: claimData?.totalCoPayment,
                totalRequestedAmount: claimData?.totalRequestedAmount,
                totalCostOfAllMedicine: claimData?.totalCostOfAllMedicine,
                reasonOfHopitalization: claimData?.hospitalservicedatas[0]?.reasonOfHopitalization,
                provisionalDiagnosisPreauth: claimData?.hospitalservicedatas[0]?.provisionalDiagnosisPreauth,
                reasonOfPreauth: claimData?.hospitalservicedatas[0]?.reasonOfPreauth,
                provisionalDiagnosis: claimData?.hospitalservicedatas[0]?.provisionalDiagnosis,
                fromHospitalizationDate: claimData?.hospitalservicedatas[0]?.fromHospitalizationDate,
                fromHospitalizationTime: claimData?.hospitalservicedatas[0]?.fromHospitalizationTime,
                toHospitaldate: claimData?.hospitalservicedatas[0]?.toHospitaldate,
                toHospitaltime: claimData?.hospitalservicedatas[0]?.toHospitaltime,
                numberOfNights: claimData?.hospitalservicedatas[0]?.numberOfNights,
                hospitalizatinDetails: claimData?.hospitalservicedatas[0]?.hospitalizatinDetails,
                comment: claimData?.hospitalservicedatas[0]?.comment,
                hospitalizationCategory: claimData?.hospitalservicedatas[0]?.hospitalizationCategory,
                pregnancyRelated: claimData?.hospitalservicedatas[0]?.pregnancyRelated,
                requestType: claimData?.hospitalservicedatas[0]?.requestType,

                reasonOfHopitalizationExtension: claimData?.hospitalservicedatas[0]?.reasonOfHopitalizationExtension,
                reasonOfFinalHopitalization: claimData?.hospitalservicedatas[0]?.reasonOfFinalHopitalization,
                updateDiagnosis: claimData?.hospitalservicedatas[0]?.updateDiagnosis,
                finalDiagnosis: claimData?.hospitalservicedatas[0]?.finalDiagnosis,
                fromHospitalizationExtensionDate: claimData?.hospitalservicedatas[0]?.toHospitaldate,
                fromHospitalizationExtensionTime: claimData?.hospitalservicedatas[0]?.toHospitaltime,

                toHospitalExtensiondate: claimData?.hospitalservicedatas[0]?.toHospitalExtensiondate,
                toHospitalExtensiontime: claimData?.hospitalservicedatas[0]?.toHospitalExtensiontime,
                toFinalHospitaldate: claimData?.hospitalservicedatas[0]?.toFinalHospitaldate,
                toFinalHospitaltime: claimData?.hospitalservicedatas[0]?.toFinalHospitaltime,
                hospitalizatinExtensionDetails: claimData?.hospitalservicedatas[0]?.requestType,
                extensionComment: claimData?.hospitalservicedatas[0]?.extensionComment,
                hospitalizationFinalDetails: claimData?.hospitalservicedatas[0]?.hospitalizationFinalDetails,
                FinalComment: claimData?.hospitalservicedatas[0]?.FinalComment,
                fromPreauthDate: claimData?.hospitalservicedatas[0]?.fromPreauthDate,
                fromPreauthTime: claimData?.hospitalservicedatas[0]?.fromPreauthTime,
                toPreauthdate: claimData?.hospitalservicedatas[0]?.toPreauthdate,
                toPreauthtime: claimData?.hospitalservicedatas[0]?.toPreauthtime,
                PreauthDetails: claimData?.hospitalservicedatas[0]?.PreauthDetails,
                medicines: obj,
              });

              this.medicineForm.patchValue({
                hospitalizationCategory: this.claimtype
              })
            }

            if (this.claimtype == '' && this.type == '') {
              this.medicineForm.patchValue({
                totalCoPayment: claimData?.totalCoPayment,
                totalRequestedAmount: claimData?.totalRequestedAmount,
                totalCostOfAllMedicine: claimData?.totalCostOfAllMedicine,
                reasonOfHopitalization: claimData?.hospitalservicedatas[0]?.reasonOfHopitalization,
                provisionalDiagnosisPreauth: claimData?.hospitalservicedatas[0]?.provisionalDiagnosisPreauth,
                reasonOfPreauth: claimData?.hospitalservicedatas[0]?.reasonOfPreauth,
                provisionalDiagnosis: claimData?.hospitalservicedatas[0]?.provisionalDiagnosis,
                fromHospitalizationDate: claimData?.hospitalservicedatas[0]?.fromHospitalizationDate,
                fromHospitalizationTime: claimData?.hospitalservicedatas[0]?.fromHospitalizationTime,
                toHospitaldate: claimData?.hospitalservicedatas[0]?.toHospitaldate,
                toHospitaltime: claimData?.hospitalservicedatas[0]?.toHospitaltime,
                numberOfNights: claimData?.hospitalservicedatas[0]?.numberOfNights,
                hospitalizatinDetails: claimData?.hospitalservicedatas[0]?.hospitalizatinDetails,
                comment: claimData?.hospitalservicedatas[0]?.comment,
                hospitalizationCategory: claimData?.hospitalservicedatas[0]?.hospitalizationCategory,
                pregnancyRelated: claimData?.hospitalservicedatas[0]?.pregnancyRelated,
                requestType: claimData?.hospitalservicedatas[0]?.requestType,

                reasonOfHopitalizationExtension: claimData?.hospitalservicedatas[0]?.reasonOfHopitalizationExtension,
                reasonOfFinalHopitalization: claimData?.hospitalservicedatas[0]?.reasonOfFinalHopitalization,
                updateDiagnosis: claimData?.hospitalservicedatas[0]?.updateDiagnosis,
                finalDiagnosis: claimData?.hospitalservicedatas[0]?.finalDiagnosis,
                fromHospitalizationExtensionDate: claimData?.hospitalservicedatas[0]?.fromHospitalizationExtensionDate,
                fromHospitalizationExtensionTime: claimData?.hospitalservicedatas[0]?.fromHospitalizationExtensionTime,
                fromFinalHospitalizationDate: claimData?.hospitalservicedatas[0]?.fromFinalHospitalizationDate,
                fromFinalHospitalizationTime: claimData?.hospitalservicedatas[0]?.fromFinalHospitalizationTime,
                toHospitalExtensiondate: claimData?.hospitalservicedatas[0]?.toHospitalExtensiondate,
                toHospitalExtensiontime: claimData?.hospitalservicedatas[0]?.toHospitalExtensiontime,
                toFinalHospitaldate: claimData?.hospitalservicedatas[0]?.toFinalHospitaldate,
                toFinalHospitaltime: claimData?.hospitalservicedatas[0]?.toFinalHospitaltime,
                hospitalizatinExtensionDetails: claimData?.hospitalservicedatas[0]?.requestType,
                extensionComment: claimData?.hospitalservicedatas[0]?.extensionComment,
                hospitalizationFinalDetails: claimData?.hospitalservicedatas[0]?.hospitalizationFinalDetails,
                FinalComment: claimData?.hospitalservicedatas[0]?.FinalComment,
                fromPreauthDate: claimData?.hospitalservicedatas[0]?.fromPreauthDate,
                fromPreauthTime: claimData?.hospitalservicedatas[0]?.fromPreauthTime,
                toPreauthdate: claimData?.hospitalservicedatas[0]?.toPreauthdate,
                toPreauthtime: claimData?.hospitalservicedatas[0]?.toPreauthtime,
                PreauthDetails: claimData?.hospitalservicedatas[0]?.PreauthDetails,
                medicines: obj,
              });

            }


            // if (this.medicineForm.get("totalRequestedAmount").value > 0) {
            //   this.requestDisable = true
            // } else {
            //   this.requestDisable = false

            //   console.log("log else check", this.requestDisable);

            // }
          },
          error: (err: ErrorEvent) => {
            console.log(err.message);
          },
        });
    }

  }

  // patchEprescriptionMedicines(medicines) {
  //   console.log("EPRESCRIPTION MEDICINES", medicines);

  //   this.medicineForm.reset();
  //   this.medicines.clear()

  //   let obj = [];
  //   if (medicines?.length > 0) {
  //     medicines.forEach((element: any, index: any) => {
  //       console.log("ELEMENT EPRESCRIPTION SERVICE TYPE===>", element);
  //       this.addNewMedicine(element?.medicine_name, element?.medicineId);

  //       this.selectedMedicine[index].name = element?.medicine_name;

  //       let frequency = element?.frequency?.every_quantity
  //       obj.push({
  //         quantity_prescribed: element?.quantities?.quantity,
  //         duration: element?.take_for?.quantity,
  //         frequency: frequency,
  //       });
  //     });
  //   } else {
  //     this.addNewMedicine();
  //   }

  //   this.medicineForm.patchValue({
  //     medicines: obj,
  //   });
  // }

  ngOnInit(): void {
    this.abouteditor = new Editor();
    this.abouteditorEn = new Editor();
    this.abouteditorEn = new Editor();
    this.extensionEditiorEn = new Editor();
    this.finalEditiorEn = new Editor();
    this.stepOneId = this.coreService.getSessionStorage("stepOneId");
    let user = JSON.parse(localStorage.getItem("loginData"));
    this.pharmacyId = user?._id;
    this.loggedInuserId = user?._id;
    if (this.selectclaimid == undefined || this.selectclaimid == '') {
      this.addNewMedicine('', '', '', '', '', 0);

      // this.getMedicineList();
    }
    this.getAllappointmentReason();
    this.setupConditionalValidators();




  }

  private async getPlanDetails() {
    let param = {
      subscriber_id: this.selectedsubscriberid,
    };

    this.pharmacyPlanService
      .getInsurancePlanDetailsbysubscriber(param)
      .subscribe({
        next: async (res) => {
          console.log(res);

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
            this.famiyTotalLimit = result?.body?.resultData?.health_plan_for?.total_care_limit?.grand_total;

            if (result?.body?.resultData?.subscription_for == "Secondary") {
              this.ownLimit = result?.body?.resultData?.health_plan_for?.total_care_limit?.secondary_care_limit
            } else {
              this.ownLimit = result?.body?.resultData?.health_plan_for?.total_care_limit?.primary_care_limit

            }
            console.log(this.planService, " result.body?.planService");


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
        element.in_exclusion.name = element.in_exclusion.name?.toLowerCase();
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
    console.log(key, event);
  }

  onKeypressEvent(event: any, index: number) {
    if (event.key != "Backspace") {
      this.selectKeyPressValue[index] += event.key;


      this.getMedicineList(this.selectKeyPressValue[index], index);
    }
  }

  onKeyDownEvent(event: any, index: number) {
    if (event.key == "Backspace") {
      //   console.log(
      //     "before remove onKeyDownEvent",
      //     this.selectKeyPressValue[index]
      //   );
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

  updateNumberOfNights() {
    let fromHospitalizationDate;
    let fromHospitalizationTimeString;
    let toHospitalDate;
    let toHospitalTimeString;
    let fromHospitalizationTime;
    let toHospitalizationTime;

    if (this.claimtype == 'Hospitalization Extention') {
      fromHospitalizationDate = new Date(this.medicineForm.value.fromHospitalizationExtensionDate);
      fromHospitalizationTimeString = this.medicineForm.value.fromHospitalizationExtensionTime;
      toHospitalDate = new Date(this.medicineForm.value.toHospitalExtensiondate);
      toHospitalTimeString = this.medicineForm.value.toHospitalExtensiontime;
      fromHospitalizationTime = new Date(`${fromHospitalizationDate.toISOString().split('T')[0]} ${fromHospitalizationTimeString}`);
      toHospitalizationTime = new Date(`${toHospitalDate.toISOString().split('T')[0]} ${toHospitalTimeString}`);

    } else if (this.claimtype == 'Hospitalization Final Claim') {
      fromHospitalizationDate = new Date(this.medicineForm.value.fromFinalHospitalizationDate);
      fromHospitalizationTimeString = this.medicineForm.value.fromFinalHospitalizationTime;
      toHospitalDate = new Date(this.medicineForm.value.toFinalHospitaldate);
      toHospitalTimeString = this.medicineForm.value.toFinalHospitaltime;
      fromHospitalizationTime = new Date(`${fromHospitalizationDate.toISOString().split('T')[0]} ${fromHospitalizationTimeString}`);
      toHospitalizationTime = new Date(`${toHospitalDate.toISOString().split('T')[0]} ${toHospitalTimeString}`);
    } else {
      fromHospitalizationDate = new Date(this.medicineForm.value.fromHospitalizationDate);
      fromHospitalizationTimeString = this.medicineForm.value.fromHospitalizationTime;
      toHospitalDate = new Date(this.medicineForm.value.toHospitaldate);
      toHospitalTimeString = this.medicineForm.value.toHospitaltime;
      console.log(fromHospitalizationDate, "fromHospitalizationDate", fromHospitalizationTimeString, "fromHospitalizationTimeString", toHospitalDate, "toHospitalDate", toHospitalTimeString, "toHospitalTimeString")

    }

    fromHospitalizationTime = new Date(`${fromHospitalizationDate.toISOString().split('T')[0]} ${fromHospitalizationTimeString}`);
    toHospitalizationTime = new Date(`${toHospitalDate.toISOString().split('T')[0]} ${toHospitalTimeString}`);

    console.log(fromHospitalizationTime, "fromHospitalizationTime", toHospitalizationTime, "toHospitalizationTime")
    fromHospitalizationDate.setHours(fromHospitalizationTime.getHours(), fromHospitalizationTime.getMinutes());
    toHospitalDate.setHours(toHospitalizationTime.getHours(), toHospitalizationTime.getMinutes());

    const timeDifference = (toHospitalDate as any) - (fromHospitalizationDate as any);
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    const numberOfNights = Math.round(daysDifference);
    const result = isNaN(numberOfNights) ? 0 : numberOfNights;
    console.log(result, "numberOfNights");

    this.medicineForm.get('numberOfNights').setValue(result);
  }


  updateNumberOfNightsPreAuth() {
    let fromHospitalizationDate;
    let fromHospitalizationTimeString;
    let toHospitalDate;
    let toHospitalTimeString;
    let fromHospitalizationTime;
    let toHospitalizationTime;
    fromHospitalizationDate = new Date(this.medicineForm.value.fromPreauthDate);
    fromHospitalizationTimeString = this.medicineForm.value.fromPreauthTime;
    toHospitalDate = new Date(this.medicineForm.value.toPreauthdate);
    toHospitalTimeString = this.medicineForm.value.toPreauthtime;
    console.log(fromHospitalizationDate, "fromHospitalizationDate", fromHospitalizationTimeString, "fromHospitalizationTimeString", toHospitalDate, "toHospitalDate", toHospitalTimeString, "toHospitalTimeString")


    fromHospitalizationTime = new Date(`${fromHospitalizationDate.toISOString().split('T')[0]} ${fromHospitalizationTimeString}`);
    toHospitalizationTime = new Date(`${toHospitalDate.toISOString().split('T')[0]} ${toHospitalTimeString}`);

    console.log(fromHospitalizationTime, "fromHospitalizationTime", toHospitalizationTime, "toHospitalizationTime")
    fromHospitalizationDate.setHours(fromHospitalizationTime.getHours(), fromHospitalizationTime.getMinutes());
    toHospitalDate.setHours(toHospitalizationTime.getHours(), toHospitalizationTime.getMinutes());

    const timeDifference = (toHospitalDate as any) - (fromHospitalizationDate as any);
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    const numberOfNights = Math.round(daysDifference);
    const result = isNaN(numberOfNights) ? 0 : numberOfNights;
    console.log(result, "numberOfNights");

    this.medicineForm.get('numberOfNights').setValue(result);
  }


  onSubmit() {
    this.isSubmitted = true;
    console.log(this.medicines, "invalid");

    if (this.medicines.invalid) {
      const invalid = [];
      const controls = this.medicines.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid, 'addSubscriberForm invalid');
      return;
      this.coreService.showError("Please enter all fields", "");
      return
    }
    let medicineArray = [];
    this.medicineForm.value.medicines.map((data, index) => {
      console.log(data.existingId, "check existing data");
      console.log(index, "check index value", data);
      medicineArray.push({
        indexNumber: index,
        date_of_service: data.date_of_service,
        categoryService: data.categoryService,
        serviceName: data.serviceName,
        other_service_name: data.other_service_name,
        serviceCode: data.serviceCode,
        reasonOfConsultation: "",
        medicalConsultationFees: 0,
        medicineId: "",
        medicineName: "",
        quantityPrescribed: data.quantity_prescribed,
        quantityDelivered: "",
        frequency: "",
        duration: "",
        date_of_Pregnancy: this.medicineForm.value.date_of_Pregnancy ? this.medicineForm.value.date_of_Pregnancy : null,
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
    if (this.claimtype != '') {

      requestType = this.hostpitalizationcategoryChange

    }

    else {

      if (this.requestedTypeData == "pre-auth") {

        requestType = "pre-auth"

      }
      else {
        requestType = this.hostpitalizationcategoryChange
      }

    }
    let reqData = {
      medicineDetails: medicineArray,
      totalCoPayment: this.medicineForm.value.totalCoPayment,
      totalRequestedAmount: this.medicineForm.value.totalRequestedAmount,
      totalCostOfAllMedicine: this.medicineForm.value.totalCostOfAllMedicine,
      createdById: this.pharmacyId,
      claimObjectId: this.stepOneId,
      reimbursmentRate: this.reimbursmentRate[0],
      requestType: requestType
    };


    let reqService = {
      reasonOfHopitalization: this.medicineForm.value.reasonOfHopitalization,
      provisionalDiagnosisPreauth: this.medicineForm.value.provisionalDiagnosisPreauth,
      reasonOfPreauth: this.medicineForm.value.reasonOfPreauth,
      provisionalDiagnosis: this.medicineForm.value.provisionalDiagnosis,
      fromHospitalizationDate: this.medicineForm.value.fromHospitalizationDate,
      fromHospitalizationTime: this.medicineForm.value.fromHospitalizationTime,
      toHospitaldate: this.medicineForm.value.toHospitaldate,
      toHospitaltime: this.medicineForm.value.toHospitaltime,
      numberOfNights: this.medicineForm.value.numberOfNights,
      comment: this.medicineForm.value.comment,
      hospitalizatinDetails: this.medicineForm.value.hospitalizatinDetails,
      claimObjectId: this.stepOneId,
      pregnancyRelated: this.medicineForm.value.pregnancyRelated,
      requestType: this.medicineForm.value.requestType,
      hospitalizationCategory: this.medicineForm.value.hospitalizationCategory,

      reasonOfHopitalizationExtension: this.medicineForm.value.reasonOfHopitalizationExtension,
      reasonOfFinalHopitalization: this.medicineForm.value.reasonOfFinalHopitalization,
      updateDiagnosis: this.medicineForm.value.updateDiagnosis,
      finalDiagnosis: this.medicineForm.value.finalDiagnosis,
      fromHospitalizationExtensionDate: this.medicineForm.value.fromHospitalizationExtensionDate,
      fromHospitalizationExtensionTime: this.medicineForm.value.fromHospitalizationExtensionTime,
      fromFinalHospitalizationDate: this.medicineForm.value.fromFinalHospitalizationDate,
      fromFinalHospitalizationTime: this.medicineForm.value.fromFinalHospitalizationTime,
      toHospitalExtensiondate: this.medicineForm.value.toHospitalExtensiondate,
      toHospitalExtensiontime: this.medicineForm.value.toHospitalExtensiontime,
      toFinalHospitaldate: this.medicineForm.value.toFinalHospitaldate,
      toFinalHospitaltime: this.medicineForm.value.toFinalHospitaltime,
      hospitalizatinExtensionDetails: this.medicineForm.value.hospitalizatinExtensionDetails,
      extensionComment: this.medicineForm.value.extensionComment,
      hospitalizationFinalDetails: this.medicineForm.value.hospitalizationFinalDetails,
      FinalComment: this.medicineForm.value.FinalComment,
      fromPreauthDate: this.medicineForm.value.fromPreauthDate,
      fromPreauthTime: this.medicineForm.value.fromPreauthTime,
      toPreauthdate: this.medicineForm.value.toPreauthdate,
      toPreauthtime: this.medicineForm.value.toPreauthtime,
      PreauthDetails: this.medicineForm.value.PreauthDetails,
      // date_of_Pregnancy: this.medicineForm.value.date_of_Pregnancy,

    }


    this.pharmacyPlanService.serviceTypeDoctor(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          console.log(this.mstepper);
          this.toastr.success(response.message);
          // if (this.serviceDataFrom.valid) {
          this.pharmacyPlanService.hospitalServiceData(reqService).subscribe(
            response => {
              console.log('Successfully submitted:', response);
              // Handle success, reset form, show a success message, etc.
            },
            error => {
              console.error('Error submitting:', error);
              // Handle error, show an error message, etc.
            }
          );
          // }
          this.insuranceId = this.coreService.getSessionStorage("InsuranceId");
          this.medicineForm.reset();
          this.medicines.clear()
          // }
          this.getClaimDetails("claimId");

          this.coreService.setDocumentData(this.insuranceId);
          this.mstepper.next();
        }
      },
      (err: ErrorEvent) => {
        this.toastr.error(err.message);
      }
    );



  }

  getAllappointmentReason() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      doctorId: this.loggedInuserId,
      listFor: 'doctor'
    };
    this.doctorService.listAppointmentReason(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this.coreService.decryptObjectData(encryptedData);
      this.appointmentReasonArray = response.body.data;
      // for (const medicine of response.body.data) {
      //   appointmentReasonArray.push({
      //     label: medicine.name,
      //     // medicine_number: medicine.number,  
      //     value: medicine._id,
      //   });
      // }
      // console.log(appointmentReasonArray, "appointmentReasonArray");

      this.totalLength = response?.body?.totalCount;
      this.dataSource = response?.body?.data;
    });
  }

  getMedicineList(query: any = "", index: any = 0, medicneId: string = "", serviceName: string = '', categoryService: string = '', serviceCode: string = '') {
    let param = {
      query: query,
    };
    this.patientService.getmedicineListWithParam(param).subscribe(
      (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        const medicineArray = [];
        for (const medicine of result.body.medicneArray) {
          medicineArray.push({
            label: medicine.medicine_name,
            medicine_number: medicine.number,
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
        } else {
        }

      },
      (err: ErrorEvent) => {
        console.log(err.message, "error");
      }
    );
  }

  dateofPregnancy(event: any) {
    // Here, you can access the updated value through 'event'
    this.DateOfPregnanacy = event;
    console.log(event, "check envent pregrancy");
    // You can also perform further actions based on the updated value
  }


  async calCulatePrice(event: any, i: number) {
    console.log("medicine form name", this.medicineForm.value.medicines);
    if (this.serviceObject[i] != undefined) {
      let excReimburmentRate = 1;
      let reqAmt = 0;
      // this.planExclusion.forEach((element) => {
      //   // event.options[0].label = event.options[0].label.toLowerCase();

      //   if (this.medicineNameObject[i]) {
      //     this.medicineNameObject[i] = this.medicineNameObject[i].toLowerCase();

      //     const result =
      //       this.medicineNameObject[i].indexOf(element.in_exclusion.name) == -1
      //         ? false
      //         : true;

      //     if (result) {
      //       console.log("condition match", "swapppppp");
      //       excReimburmentRate = 0;
      //       return;
      //     }
      //   }
      // });

      console.log(excReimburmentRate, "excReimburmentRate");

      let prcPerunit = this.medicineForm.value.medicines[i].price_per_unit;
      let qtyDeliver = this.medicineForm.value.medicines[i].quantity_prescribed;

      let totalCost = prcPerunit * qtyDeliver;
      let copay = 0;
      copay = totalCost;
      // reqAmt = (this.reimbursmentRate[i] / 100) * totalCost;
      // if redeemed is no then no need to check waiting period time.
      var currentdate = new Date();
      const planValidityToDate = new Date(this.planValidityTo);
      var currentDateTimestamp = currentdate.getTime();
      var planValidityToTimestamp = planValidityToDate.getTime();

      console.log(currentDateTimestamp, "check plan validieyt", planValidityToTimestamp);
      // console.log(planValidityToDate instanceof Date, !isNaN(planValidityToDate.getTime()), currentdate.getTime(), planValidityToDate.getTime(), "dfsdfsdfsdf");

      // if (planValidityToDate instanceof Date && !isNaN(planValidityToDate.getTime()) && currentdate.getTime() <= planValidityToDate.getTime()) {

      // if (currentdate && this.planValidityTo && currentdate.getTime() <= this.planValidityTo.getTime()) {
      if (planValidityToTimestamp >= currentDateTimestamp) {
        if (excReimburmentRate == 1) {
          if (this.redeemed[i] === "no") {
            console.log(" this.redeemed[i] === no");

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
            console.log("this.redeemed[i] === yes");

            var duration = this.waitingCount[i]?.duration?.unit;
            var min_no = this.waitingCount[i]?.duration?.min_no;
            // if()
            if (this.showPregnancyRelatedDateField) {
              var dateofJoining = new Date(this.DateOfPregnanacy);
            } else {
              var dateofJoining = new Date(this.dataofJoining);
            }
            // var dateofJoining = new Date(this.dataofJoining);
            console.log(dateofJoining, "check joining date", this.dataofJoining);
            console.log(duration, "duration log", min_no);

            if (duration == "Month") {
              console.log("duration month");
              // dateofJoining.setFullYear(dateofJoining.getFullYear() + min_no);
              dateofJoining.setMonth(dateofJoining.getMonth() + min_no);
            } else if (duration == "Year") {
              console.log("duration year");
              dateofJoining.setFullYear(dateofJoining.getFullYear() + min_no);
            } else {
              console.log("duration else");
              dateofJoining.setDate(dateofJoining.getFullYear() + min_no);
            }
            var currentDate = new Date()
            // if today date is grater than waiting period time
            console.log("dateofJoining", dateofJoining, "currentDate", currentDate);
            if (currentDate > dateofJoining) {
              console.log("if inside date of jhoing", dateofJoining, currentDate);

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
              console.log("else date of joining");
              this.checkbreak[i] = 'As per your health plan, your selected waiting period is remaining so you need to pay 100% amount';
              copay = totalCost
              reqAmt = 0
            }
          }
        }
      }

      console.log(copay, "last copay", this.costForService);

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


  findObjectByKeyValue(arr, key, value) {
    return arr.filter(obj =>
      obj[key] === value
    );
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
      console.log(resultObject, "resultObject");
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
              console.log(copay, "resolve msgt", reqAmt);
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

              //  remainingOwnLimit = this.ownLimit - (parseFloat(result?.data.own_limit) + (totalCostaLL - requestedAmount1))
              //  remainingFamilyTotalLimit = this.famiyTotalLimit - (result?.data.family_total_limit + (totalCostaLL - requestedAmount1))

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
              reqAmt = remainingFamilyTotalLimit;
              copay += reqAmt - remainingFamilyTotalLimit;
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
                      console.log(copay, "checkfamily inside", reqAmt);

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

  onlyNumbers(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!/^\d+$/.test(value)) {
      return { 'onlyNumbers': true };
    }
    return null;
  }

  newMedicineForm(): FormGroup {
    return this.fb.group({
      date_of_service: [new Date(), [Validators.required]],
      categoryService: ["", [Validators.required]],
      serviceName: ["", [Validators.required]],
      serviceCode: [""],
      other_service_name: [""],
      medicalConsultationFees: [0, [Validators.required, this.onlyNumbers]],
      reasonOfConsultation: ["", [Validators.required]],
      medicineId: ["", []],
      medicine_name: ["",],
      quantity_prescribed: [0, []],
      quantity_delivered: [0, []],
      frequency: [0, []],
      duration: [0, []],
      price_per_unit: [0, []],
      co_payment: [0, []],
      request_amount: [0, []],
      total_cost: [0, []],
      comment: [""],
      existingId: [""],



    });
  }

  addNewMedicine(medicineName: string = "", medicineId: string = "", serviceName: string = "", categoryService: string = "", serviceCode: string = "", index: any = "") {
    this.selectedMedicine.splice(index, 0, {
      name: "",
    });
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
    this.categoryObject.splice(index, 0, []);
    this.serviceLimit.splice(index, 0, []);
    this.redeemed.splice(index, 0, []);
    this.checkbreak.splice(index, 0, []);
    this.serviceCount.splice(index, 0, []);
    this.waitingCount.splice(index, 0, []);
    this.categoryCondition.splice(index, 0, []);
    this.primary_and_secondary_category_limit.splice(index, 0, []);
    this.primary_and_secondary_service_limit.splice(index, 0, []);
    this.categoryLimit.splice(index, 1);
    console.log(index, "index");

    if (index >= 0) {

      this.medicines.insert(index, this.newMedicineForm());
    }
    else {

    }
    // this.medicines.push(this.newMedicineForm());
    this.getMedicineList(medicineName, this.medicines.length - 1, medicineId, serviceName, categoryService,serviceCode);
    
    // this.dataSource = new MatTableDataSource(
    //     (this.medicineForm.get("medicines") as FormArray).controls
    // );
  }

  removeMedicine(index: number) {
    this.medicines.removeAt(index);
    console.log(
      this.medicineList,
      "before splice",
      this.medicineIDObject,
      "",
      this.medicineNameObject
    );

    this.medicineList.splice(index, 1);

    this.medicineIDObject.splice(index, 1);
    this.medicineNameObject.splice(index, 1);
    // delete this.medicineIDObject[index];

    // delete this.medicineNameObject[index];
    this.selectKeyPressValue.splice(index, 1);
    this.checkexclutiondata.splice(index, 1);
    this.checkexclutionDescription.splice(index, 1);
    this.serviceCode.splice(index, 1);
    this.checkpreAuthService.splice(index, 1);
    this.serviceObject.splice(index, 1);
    this.categoryObject.splice(index, 1);
    this.pre_authArray.splice(index, 1);
    this.redeemed.splice(index, 1);
    this.checkbreak.splice(index, 1);
    this.serviceCount.splice(index, 1);
    this.waitingCount.splice(index, 1);
    this.categoryCondition.splice(index, 1);
    this.primary_and_secondary_category_limit.splice(index, 0, []);
    this.primary_and_secondary_service_limit.splice(index, 0, []);
    this.categoryLimit.splice(index, 1);
    // this.calCulatePrice('',index);
    if (this.type == '') {
      this.onValueChnage();
    }
    console.log(
      this.medicineList,
      "after splice",
      this.medicineIDObject,
      "",
      index,
      this.medicineNameObject
    );
    // this.dataSource = new MatTableDataSource(
    //     (this.medicineForm.get("medicines") as FormArray).controls
    // );
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
        this.categoryObject.splice(this.deleteIndex, 1);
        this.pre_authArray.splice(this.deleteIndex, 1);
        this.redeemed.splice(this.deleteIndex, 1);
        this.checkbreak.splice(this.deleteIndex, 1);
        this.serviceCount.splice(this.deleteIndex, 1);
        this.waitingCount.splice(this.deleteIndex, 1);
        this.categoryCondition.splice(this.deleteIndex, 1);
        this.primary_and_secondary_category_limit.splice(this.deleteIndex, 1);
        this.primary_and_secondary_service_limit.splice(this.deleteIndex, 1);
        this.categoryLimit.splice(this.deleteIndex, 1);
        // this.calCulatePrice('',index);
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
      portalType: "Doctor",
    };
    if (this.insuranceId != null) {
      this.pharmacySerivice.getPortalTypeAndInsuranceId(data).subscribe({
        next: (res) => {

          let encryptedData = { data: res };
          let result = this.coreService.decryptObjectData(encryptedData);

          this.categoryData = result.body.result[0].categoryName;

          this.categoryData.map((curentval: any) => {
            let checkCategoryData = this.categoryList.filter(obj => obj.lebel == curentval && obj.value == curentval);
            if (checkCategoryData.length == 0) {
              this.categoryList.push({
                label: curentval,
                value: curentval,
              });
            }


          });

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
      this.planServicePrimary.forEach((element) => {
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


  checkPregnancyRelated(event) {

    this.showPregnancyRelatedDateField = event.value === 'Yes';
  }


  checkRequestedType(event) {

    this.requestedTypeData = event?.value;

    this.medicineForm.get('requestType').valueChanges.subscribe((requestType) => {
      this.requestedTypeData = requestType;
      // if (requestType === 'hospitalization') {
      //   // Set default value for hospitalizationCategory based on requestType
      //   this.medicineForm.get('hospitalizationCategory').setValue('Hospitalization Statement');
      // }
    });

    // Subscribe to changes in hospitalizationCategory
    this.medicineForm.get('hospitalizationCategory').valueChanges.subscribe((value) => {
      this.hospitalizationCategoryValue = value;
      // Call any function or perform actions based on the selected hospitalization category
      // this.categoryChange(value);
    });
  }


  categoryChange(event) {
    // const selectedCategory = this.medicineForm.get('hospitalizationCategory').value;
    // this.updateValidatorsBasedOnCategory(selectedCategory);
    this.hostpitalizationcategoryChange = event?.value;


  }



  private setupConditionalValidators(): void {
    this.updateValidatorsBasedOnCategory(this.medicineForm.get('hospitalizationCategory').value);

    this.medicineForm.get('hospitalizationCategory').valueChanges.subscribe(category => {
      this.updateValidatorsBasedOnCategory(category);
      this.medicineForm.updateValueAndValidity();
    });
  }

  private updateValidatorsBasedOnCategory(category: string): void {
    // console.log(category, "456");

    const conditionalFields = [
      'reasonOfHopitalization',
      'provisionalDiagnosis',
      'fromHospitalizationDate',
      'fromHospitalizationTime',
      'toHospitaldate',
      'toHospitaltime',
      'numberOfNights',
      'comment'
    ];

    if (category === 'Hospitalization Statement') {
      conditionalFields.forEach(field => {
        // console.log(field, "field456");

        const control = this.medicineForm.get(field);
        // console.log(control, "7878");

        if (control) {
          // console.log(control, "7878");
          control.setValidators([Validators.required]);
          control.updateValueAndValidity(); // Update validation state
        }
      });
    } else {
      conditionalFields.forEach(field => {
        const control = this.medicineForm.get(field);
        if (control) {
          control.clearValidators();
          control.updateValueAndValidity(); // Update validation state
        }
      });
    }
  }

  validateDateRange(control: AbstractControl): ValidationErrors | null {
    const fromDate = this.medicineForm.get('fromHospitalizationExtensionDate').value;
    const fromDate2 = this.medicineForm.get('fromFinalHospitalizationDate').value;

    if (fromDate && control.value < fromDate) {
      return { minDate: true };
    }

    if (fromDate2 && control.value < fromDate2) {
      return { minDate: true };
    }

    return null;
  }
  // checkAccident(event) {
  // console.log(event, "check event 555");

  // this.checkHospitalcategoryVal = event.value;
  // if (event.value == "Hospitalization Statement") {
  //   this.addValidationInAccident();
  // } else {
  //   this.removeValidationInAccident();
  // }
  // }
  // conditionalFields = [
  //   'reasonOfHopitalization',
  //   'provisionalDiagnosis',
  //   'fromHospitalizationDate',
  //   'fromHospitalizationTime',
  //   'toHospitaldate',
  //   'toHospitaltime',
  //   'numberOfNights',
  //   'comment'
  // ];


  // private addValidationInAccident() {
  //   this.conditionalFields.forEach((fieldName) => {
  //     console.log(fieldName, "fieldName123");

  //     switch (fieldName) {
  //       case "reasonOfHopitalization":
  //         this.medicineForm.get("reasonOfHopitalization").setValidators(Validators.required);
  //         break;
  //       case "provisionalDiagnosis":
  //         this.medicineForm.get("provisionalDiagnosis").setValidators(Validators.required);
  //         break;
  //       case "fromHospitalizationDate":
  //         this.medicineForm.get("fromHospitalizationDate").setValidators(Validators.required);
  //         break;
  //       case "fromHospitalizationTime":
  //         this.medicineForm.get("fromHospitalizationTime").setValidators(Validators.required);
  //         break;
  //       case "toHospitaldate":
  //         this.medicineForm.get("toHospitaldate").setValidators(Validators.required);
  //         break;
  //       case "toHospitaltime":
  //         this.medicineForm.get("toHospitaltime").setValidators(Validators.required);
  //         break;
  //       case "numberOfNights":
  //         this.medicineForm.get("numberOfNights").setValidators(Validators.required);
  //         break;
  //       case "comment":
  //         this.medicineForm.get("comment").setValidators(Validators.required);
  //         break;
  //       // Add cases for other fields as needed
  //       default:
  //         break;
  //     }
  //   });
  // }

  // private removeValidationInAccident() {
  //   this.conditionalFields.forEach((element) => {
  //     switch (element) {
  //       case "reasonOfHopitalization":
  //         this.medicineForm.get("reasonOfHopitalization").clearValidators();
  //         this.medicineForm.get("reasonOfHopitalization").updateValueAndValidity();
  //         break;
  //       case "provisionalDiagnosis":
  //         this.medicineForm.get("provisionalDiagnosis").clearValidators();
  //         this.medicineForm.get("provisionalDiagnosis").updateValueAndValidity();
  //         break;
  //       case "fromHospitalizationDate":
  //         this.medicineForm.get("fromHospitalizationDate").clearValidators();
  //         this.medicineForm.get("fromHospitalizationDate").updateValueAndValidity();
  //         break;
  //       case "fromHospitalizationTime":
  //         this.medicineForm.get("fromHospitalizationTime").clearValidators();
  //         this.medicineForm.get("fromHospitalizationTime").updateValueAndValidity();
  //         break;
  //       case "toHospitaldate":
  //         this.medicineForm.get("toHospitaldate").clearValidators();
  //         this.medicineForm.get("toHospitaldate").updateValueAndValidity();
  //         break;
  //       case "numberOfNights":
  //         this.medicineForm.get("numberOfNights").clearValidators();
  //         this.medicineForm.get("numberOfNights").updateValueAndValidity();
  //         break;
  //       case "comment":
  //         this.medicineForm.get("comment").clearValidators();
  //         this.medicineForm.get("comment").updateValueAndValidity();
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  // }

  updateMinDate(value) {
    const fromDate = value;
    this.minDate = fromDate;
    console.log(this.minDate, "check log111");
    // Set the minimum date for the second datepicker
  }

  updateMinDateFinalDate(element) {
    const fromDate2 = element;
    this.minDate = fromDate2;
    console.log(this.minDate, "check log111");
  }

}
