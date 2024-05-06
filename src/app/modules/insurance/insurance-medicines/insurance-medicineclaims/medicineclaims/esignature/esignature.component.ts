import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PharmacyPlanService } from "../../../../../pharmacy/pharmacy-plan.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { PharmacyService } from "../../../../../pharmacy/pharmacy.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import html2canvas from "html2canvas"; // UAB1 table
import { SignaturePad } from "angular2-signaturepad";
import { jsPDF } from "jspdf";
import { environment } from "src/environments/environment";

// UAB1 table
export interface TempletElement {
  dateofmedicalproceduresduplicate: string;
  designationofthecatesduplicate: string;
  totalamount: string;
  amoutpaidbyinsured: string;
  signatureofthedoctorduplicate: string;
  issuingprescriptionduplicate: string;
  dotorstampduplicate: string;
}
const TEMPLET_DATA: TempletElement[] = [
  {
    dateofmedicalproceduresduplicate: "",
    designationofthecatesduplicate: "",
    totalamount: "",
    amoutpaidbyinsured: "",
    signatureofthedoctorduplicate: "",
    issuingprescriptionduplicate: "",
    dotorstampduplicate: "",
  },
  {
    dateofmedicalproceduresduplicate: "",
    designationofthecatesduplicate: "",
    totalamount: "",
    amoutpaidbyinsured: "",
    signatureofthedoctorduplicate: "",
    issuingprescriptionduplicate: "",
    dotorstampduplicate: "",
  },
  {
    dateofmedicalproceduresduplicate: "",
    designationofthecatesduplicate: "",
    totalamount: "",
    amoutpaidbyinsured: "",
    signatureofthedoctorduplicate: "",
    issuingprescriptionduplicate: "",
    dotorstampduplicate: "",
  },
];

// UAB2 table
export interface ExecutionElement {
  prescribed: string;
  quantity: string;
  medicinesdelivered: string;
  totalcost: string;
  paidbyinsured: string;
  signaturepharmacist: string;
}
const EXECUTION_DATA: ExecutionElement[] = [
  {
    prescribed: "",
    quantity: "",
    medicinesdelivered: "",
    totalcost: "",
    paidbyinsured: "",
    signaturepharmacist: "",
  },
  {
    prescribed: "",
    quantity: "",
    medicinesdelivered: "",
    totalcost: "",
    paidbyinsured: "",
    signaturepharmacist: "",
  },
  {
    prescribed: "",
    quantity: "",
    medicinesdelivered: "",
    totalcost: "",
    paidbyinsured: "",
    signaturepharmacist: "",
  },
  {
    prescribed: "",
    quantity: "",
    medicinesdelivered: "",
    totalcost: "",
    paidbyinsured: "",
    signaturepharmacist: "",
  },
];

// UAB3 table
export interface analysis_examination_Element {
  prescribed: string;
  totalcost: string;
  paidbyinsured: string;
  signaturepharmacist: string;
}
const ANALYSIS_EXAMINATION_DATA: analysis_examination_Element[] = [
  { prescribed: "", totalcost: "", paidbyinsured: "", signaturepharmacist: "" },
  { prescribed: "", totalcost: "", paidbyinsured: "", signaturepharmacist: "" },
  { prescribed: "", totalcost: "", paidbyinsured: "", signaturepharmacist: "" },
  { prescribed: "", totalcost: "", paidbyinsured: "", signaturepharmacist: "" },
];

// UAB4 table
export interface data_nomenclature_Element {
  prescribed: string;
  prescribed1: string;
  totalcost: string;
  paidbyinsured: string;
  signaturepharmacist: string;
}
const NOMENCLATURE_DATA: data_nomenclature_Element[] = [
  {
    prescribed: "",
    prescribed1: "",
    totalcost: "",
    paidbyinsured: "",
    signaturepharmacist: "",
  },
  // { prescribed: '', prescribed1: '', totalcost: "", paidbyinsured: '', signaturepharmacist: '' },
  // { prescribed: '', prescribed1: '', totalcost: "", paidbyinsured: '', signaturepharmacist: '' },
];

interface data_transactions_Element {
  prescription: string;
  amount: string;
  paidinsured: string;
}
const TRANSACTIONS_DATA: data_transactions_Element[] = [
  { prescription: "", amount: "", paidinsured: "" },
  { prescription: "", amount: "", paidinsured: "" },
  { prescription: "", amount: "", paidinsured: "" },
  { prescription: "", amount: "", paidinsured: "" },
  { prescription: "", amount: "", paidinsured: "" },
  { prescription: "", amount: "", paidinsured: "" },
];

@Component({
  selector: 'app-esignature',
  templateUrl: './esignature.component.html',
  styleUrls: ['./esignature.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class EsignatureComponent implements OnInit {
  // UAB1 table
  @Input() public mstepper: MatStepper;
  @ViewChild("claimsubmittedcontent", { static: false })
  claimsubmittedcontent: any;
  @ViewChild("previewdiv", { static: false }) previewdiv: any;

  signatureImg: string;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = {
    minWidth: 2,
    canvasWidth: 700,
    canvasHeight: 300,
  };

  medical_fees_disply_Columns: string[] = [
    "dateofmedicalproceduresduplicate",
    "designationofthecatesduplicate",
    "totalamount",
    "amoutpaidbyinsured",
    "signatureofthedoctorduplicate",
    "issuingprescriptionduplicate",
    "dotorstampduplicate",
  ];
  medical_fees_dataSource = TEMPLET_DATA;

  // UAB2 table
  dataExecution_displayedColumns: string[] = [
    "prescribed",
    "quantity",
    "medicinesdelivered",
    "totalcost",
    "paidbyinsured",
    "signaturepharmacist",
  ];
  dataExecution = EXECUTION_DATA;

  // UAB3 table
  analysis_examination_x_ray_displayedColumns: string[] = [
    "prescribed",
    "totalcost",
    "paidbyinsured",
    "signaturepharmacist",
  ];
  data_analysis_examination_x_ray = ANALYSIS_EXAMINATION_DATA;

  // UAB4 table
  nomenclaturey_displayedColumns: string[] = [
    "prescribed",
    "prescribed1",
    "totalcost",
    "paidbyinsured",
    "signaturepharmacist",
  ];
  data_nomenclature = NOMENCLATURE_DATA;

  transactions_displayedColumns: string[] = [
    "prescription",
    "amount",
    "paidinsured",
  ];
  data_transactions = TRANSACTIONS_DATA;

  userId: any;
  signatureForm: any = FormGroup;
  signatureURL: any = "";
  signatureFile: any;
  claimId: string = "";
  insuranceId: any;
  insuranceObjectId: any;
  stepOneId: any;
  templateId: any;
  insuranceObjectSub: Subscription;
  claim_number: any = "";

  sub_name: any = "";
  sub_first_name: any = "";
  sub_policy_number: any = "";
  sub_insurance_id: any = "";
  sub_age: any = "";

  code_assignment: any = "";
  claim_date: any = "";
  name_of_doctor: any = "";
  pharm_signature: any = "";
  doc_sign_stamp: any = "";
  marital_status: any = "";
  claimMedicine: any;

  totalCostOfAllMedicine: any = "";
  totalRequestedAmount: any = "";
  totalCoPayment: any = "";
  gender: any = "";
  isClaimSubmitted: boolean = false;
  ClaimData: any;
  selectclaimid: any = "";
  priscriberFullName: any = "";
  consultationDateTime: Date;
  pharmacyName: any;
  patientAge: any = "";
  cardId: any = "";
  previewtemplate: any = "";

  sec_pri_firstName: any = "";
  sec_pri_middleName: any = "";
  sec_pri_lastName: any = "";

  pri_firstName: any = "";
  pri_middleName: any = "";
  pri_lastName: any = "";
  pri_dob: any = "";
  pri_age: any = "";
  pri_gender: any = "";
  pri_insuranceId: any = "";
  pri_policyId: any = "";
  pri_employeeId: any = "";
  pri_cardId: any = "";
  pri_insHolderName: any = "";
  pri_insToValidiDate: any = "";

  sec_firstName: any = "";
  sec_middleName: any = "";
  sec_dob: any = "";
  sec_age: any = "";
  sec_gender: any = "";
  sec_insuranceId: any = "";
  sec_policyId: any = "";
  sec_employeeId: any = "";
  sec_cardId: any = "";
  sec_insHolderName: any = "";
  sec_insToValidiDate: any = "";
  sec_relationWithPrimary: any = "";

  claimDeclartion: any = "";

  @ViewChild("full_name") full_name: ElementRef;
  @ViewChild("currentDate") currentDate: ElementRef;
  // @ViewChild('currentTime') currentTime: ElementRef;
  defaultValue: Date;
  teamplatesignurl: any;
  pdfSrc: any;
  orderId: any = "";
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private coreService: CoreService,
    private service: PharmacyService,
    private toastr: ToastrService,
    private pharmacyPlanService: PharmacyPlanService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.insuranceId = this.coreService.getSessionStorage("InsuranceId");
    this.stepOneId = JSON.parse(sessionStorage.getItem("stepOneId"));
    this.claimId = JSON.parse(sessionStorage.getItem("claimId"));

    const d = new Date();
    // d.setDate()
    // d.setMonth(2);
    // d.setHours();
    // d.setMinutes(0);
    // d.setSeconds(1);
    // d.setMilliseconds(10);
    this.defaultValue = d;

    this.insuranceObjectSub = this.coreService.SharingInsObjectId.subscribe(
      (res) => {
        console.log("esignature subscribe", res);

        if (res != "default") {
          this.insuranceObjectId = res;
          this.stepOneId = JSON.parse(sessionStorage.getItem("stepOneId"));
          this.claimId = JSON.parse(sessionStorage.getItem("claimId"));
          this.getInsuranceTemplate();
          console.log(this.claimId, "esignaturecalls claim Id");
          this.getClaimDetails();
        }
      }
    );

    this.route.queryParams.subscribe((params: any) => {

      this.orderId = params.orderId
    });

    this.signatureForm = this.fb.group({
      fullName: ["", [Validators.required]],
      current_date: ["", [Validators.required]],
      current_time: ["", [Validators.required]],
      signature: ["", [Validators.required]],
    });
  }
  getBasePath() {
    return environment.apiUrl;
  }
  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem("loginData"));
    this.userId = user?._id;
  }

  ngAfterViewInit() {
    console.log("esignature ng after view init");
    console.log(this.insuranceObjectId);

    this.full_name.nativeElement.value =
      this.coreService.getLocalStorage("loginData").user_name;
    this.currentDate.nativeElement.value = moment().format("MM-DD-YYYY");
    // this.currentTime.nativeElement.value = moment().format('MM-DD-YYYY');
    this.signatureForm.patchValue({
      fullName: this.full_name.nativeElement.value,
      current_date: this.currentDate.nativeElement.value,
      current_time: this.defaultValue,
    });
  }

  ngOnChanges() {
    console.log("ng on chnage call aesignature", this.mstepper);
  }

  private getInsuranceTemplate() {
    let param = {
      insuranceId: this.insuranceObjectId,
    };
    this.pharmacyPlanService.getInsuranceTemplate(param).subscribe({
      next: async (res) => {
        let encData = await res;
        let result = this.coreService.decryptContext(encData);
        console.log("template iD", result);
        this.templateId = result.body?.template_id?._id;
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      },
    });
  }

  private getClaimDetails() {
    console.log(this.claimId, "check claim ID");

    this.pharmacyPlanService.medicineClaimDetails(this.claimId).subscribe({
      next: async (res) => {
        let encData = await res;
        let result = await this.coreService.decryptContext(encData);
        console.log("CLAIM DETAIS===>", result);
        let claimData = result.data[0];
        console.log("e signature getClaimDetails1111", claimData);

        //         claim_number:any='';
        // sub_name:any='';
        // sub_first_name:any='';
        // sub_policy_number:any='';
        // sub_insurance_id:any='';
        // sub_age:any='';
        // code_assignment:any='';
        // claim_date:any='';
        // name_of_doctor:any='';
        // pharm_signature:any='';
        // doc_sign_stamp:any='';

        if (claimData.insurerType === "primaryInsurer") {
          if (claimData.primaryInsuredIdentity.length > 0) {
            claimData.primaryInsuredIdentity.forEach((element) => {
              if (element.fieldName === "First Name") {
                this.pri_firstName = element.fieldValue;
              }
              if (element.fieldName === "Middle Name") {
                this.pri_middleName = element.fieldValue;
              }
              if (element.fieldName === "Last Name") {
                this.pri_lastName = element.fieldValue;
              }
              if (element.fieldName === "Date Of Birth") {
                this.pri_lastName = element.fieldValue;
              }
              if (element.fieldName === "Age") {
                this.pri_age = element.fieldValue;
              }
              if (element.fieldName === "Gender") {
                this.pri_gender = element.fieldValue;
              }
              if (element.fieldName === "Insurance ID") {
                this.pri_insuranceId = element.fieldValue;
              }

              if (element.fieldName === "Policy ID") {
                this.pri_policyId = element.fieldValue;
              }
              if (element.fieldName === "Employee ID") {
                this.pri_employeeId = element.fieldValue;
              }
              if (element.fieldName === "Card ID") {
                this.pri_cardId = element.fieldValue;
              }
              if (element.fieldName === "Insurance Holder Name") {
                this.pri_insHolderName = element.fieldValue;
              }
              if (element.fieldName === "Insurance Validity") {
                this.pri_insToValidiDate = element.fieldValue;
              }
            });
          }
        }

        if (claimData.insurerType === "secondaryInsurer") {
          if (claimData.secondaryInsuredIdentity.length > 0) {
            claimData.secondaryInsuredIdentity.forEach((element) => {
              if (element.fieldName === "First Name") {
                this.pri_firstName = element.fieldValue;
              }
              if (element.fieldName === "Middle Name") {
                this.pri_middleName = element.fieldValue;
              }
              if (element.fieldName === "Last Name") {
                this.pri_lastName = element.fieldValue;
              }
              if (element.fieldName === "Date Of Birth") {
                this.pri_lastName = element.fieldValue;
              }
              if (element.fieldName === "Age") {
                this.pri_age = element.fieldValue;
              }
              if (element.fieldName === "Gender") {
                this.pri_gender = element.fieldValue;
              }
              if (element.fieldName === "Insurance ID") {
                this.pri_insuranceId = element.fieldValue;
              }

              if (element.fieldName === "Policy ID") {
                this.pri_policyId = element.fieldValue;
              }
              if (element.fieldName === "Employee ID") {
                this.pri_employeeId = element.fieldValue;
              }
              if (element.fieldName === "Card ID") {
                this.pri_cardId = element.fieldValue;
              }
              if (element.fieldName === "Insurance Holder Name") {
                this.pri_insHolderName = element.fieldValue;
              }
              if (element.fieldName === "Insurance Validity") {
                this.pri_insToValidiDate = element.fieldValue;
              }
            });
          }
        }

        if (claimData.accidentRelatedField.length > 0) {
          claimData.accidentRelatedField.forEach((element) => {
            if (element.fieldName == "Additional Information") {
              this.claimDeclartion = element.fieldValue;
            }
          });
        }

        if (claimData.insurerType === "primaryInsurer") {
          if (claimData.primaryInsuredIdentity.length > 0) {
            claimData.primaryInsuredIdentity.forEach((element) => {
              if (element.fieldName === "First Name") {
                this.sec_pri_firstName = element.fieldValue;
              }
              if (element.fieldName === "Middle Name") {
                this.sec_pri_middleName = element.fieldValue;
              }
              if (element.fieldName === "Last Name") {
                this.sec_pri_lastName = element.fieldValue;
              }
            });
          }
        }

        this.claim_number = claimData.claimNumber;

        this.claimMedicine = claimData?.medicinedetailsonclaims;
        this.totalRequestedAmount = claimData.totalRequestedAmount;
        this.totalCoPayment = claimData.totalCoPayment;
        this.totalCostOfAllMedicine = claimData.totalCostOfAllMedicine;
        console.log(
          claimData?.eSignature?.signature,
          "signature_signed_url"
        );
        if (claimData?.eSignature?.signature != "" && claimData?.eSignature?.signature != undefined) {
          this.pharm_signature = `${this.getBasePath()}/healthcare-crm-insurance/esignature/${claimData?.eSignature?.signature}`;
        } else {
          this.pharm_signature = "";
        }
        // this.patientAge =

        if (claimData?.eSignature?.signature != "" && claimData?.eSignature?.signature != undefined) {
          this.signatureURL = `${this.getBasePath()}/healthcare-crm-insurance/esignature/${claimData?.eSignature?.signature}`;
        } else {
          this.signatureURL = "";
        }
        this.ClaimData = claimData;
        this.priscriberFullName = `${claimData.prescriberCenterInfo.prescriberFirstName} ${claimData.prescriberCenterInfo.prescriberMiddleName} ${claimData.prescriberCenterInfo.prescriberLastName} `;
        if (this.signatureURL != "") {
          this.isClaimSubmitted = true;
        }
      },
      error: (err: ErrorEvent) => {
        console.log(err.message);
      },
    });
  }

  async onSubmit(event: any = "") {
    console.log("check log submit");

    if (event) {
      console.log("EVENT FOUND");
      await this.onSignatureChange(event);
    }



    if (this.signatureFile) {
      const formdata: any = new FormData();
      formdata.append("file", this.signatureFile);

      this.service
        .addClaimEsignature(formdata)
        .subscribe((res) => {
          let response = this.coreService.decryptObjectData({ data: res });

          console.log(response, "check file upload");
          if (response.status) {
            this.signatureForm.get("signature").setValue(response.body);
            let signature;
            if (response.body != "" && response.body != undefined) {
              signature = `${this.getBasePath()}/healthcare-crm-insurance/esignature/${response.body}`;
            } else {
              signature = ""
            }
            // this.toastr.success(response.message);
            // this.modalService.dismissAll("close");
            // this.getEprescription();
            let maadoVariables = {
              claim_number: this.claim_number,
              pri_firstName: this.pri_firstName,
              pri_middleName: this.pri_middleName,
              pri_lastName: this.pri_lastName,
              pri_cardId: this.pri_cardId,
              pri_age: this.pri_age,
              priscriberFullName: this.priscriberFullName,
              marital_status: this.marital_status,
              pri_gender: this.pri_gender,
              // array
              claimMedicine: this.claimMedicine,
              ClaimData: this.ClaimData,
              // array
              totalCostOfAllMedicine: this.totalCostOfAllMedicine,
              totalCoPayment: this.totalCoPayment,
              totalRequestedAmount: this.totalRequestedAmount,
              pharm_signature: this.signatureURL,
              pri_policyId: this.pri_policyId,
              claimDeclartion: this.claimDeclartion,
              sec_pri_firstName: this.sec_pri_firstName,
              sec_pri_middleName: this.sec_pri_middleName,
              sec_pri_lastName: this.sec_pri_lastName,
              pri_insuranceId: this.pri_insuranceId,
              code_assignment: this.code_assignment,
            };

            console.log(this.stepOneId, "stepOneId");
            let reqData = {
              eSignature: {
                fullName: this.signatureForm.value.fullName,
                date: this.signatureForm.value.current_date,
                time: this.signatureForm.value.current_time,
                signature: this.signatureForm.value.signature,
              },
              pharmacyId: '',
              loggedInPatientId: "",
              claimObjectId: this.stepOneId,
              userId: this.userId,
              maadoVariables: maadoVariables,
              templateId: this.templateId,
              loggedInInsuranceId: this.userId,
            };

            console.log("Req Data ESIGNATURE---->", reqData);

            this.pharmacyPlanService.eSignature(reqData).subscribe(
              async (res) => {
                let result = await res;
                let response = this.coreService.decryptObjectData({ data: result });
                console.log("Response ------->", response);
                if (response.status) {
                  // this.toastr.success(response.message);
                  // this.getClaimDetails();
                  // this.isClaimSubmitted = true;
                  this.toastr.success(response.message);
                  console.log(response.data);

                  this.teamplatesignurl = response.data;
                  this.pdfSrc = this.teamplatesignurl;
                  console.log(this.teamplatesignurl, "check ddivv");

                  this.openVerticallyCenteredMaado(this.previewdiv)
                  // return;
                  // this.getClaimDetails();
                  // this.finalSubmitClaimandPdf();
                  this.isClaimSubmitted = true;
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
        });
    }
  }



  uploadSignature(file) {

    let cliamEsign = 'ClaimEsign-' + this.claimId;

    let formData: any = new FormData();
    formData.append("userId", this.userId);
    formData.append("docType", "image");
    formData.append("multiple", "false");
    formData.append("docName", file);
    formData.append("fileName", cliamEsign);

    return new Promise((resolve, reject) => {
      this.service.uploadBase64(formData).subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        resolve(response);
        if (response.status) {
          this.toastr.success(response.message);
        }
      });
    });
  }

  uploadPreviewTemplate(file) {

    let formData: any = new FormData();
    formData.append("userId", this.userId);
    formData.append("docType", "image");
    formData.append("multiple", "false");
    formData.append("docName", file);

    return new Promise((resolve, reject) => {
      this.service.uploadDocument(formData).subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        resolve(response);
        if (response.status) {
          this.toastr.success(response.message);
        }
      });
    });
  }

  async onSignatureChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.signatureFile = file;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.signatureURL = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  submitClaim() {
    const data = {
      pharmacyId: '',
      loggedInPatientId: "",
      claimObjectId: JSON.parse(sessionStorage.getItem("stepOneId")),
      orderId: this.orderId,
      loggedInInsuranceId: this.userId,
    };

    this.pharmacyPlanService.finalSubmitClaim(data).subscribe({
      next: async (res) => {
        const encData = await res;
        let result = this.coreService.decryptContext(encData);
        if (result.status) {
          this.coreService.showSuccess(result.message, "");
          this.closePopUp();
          this.router.navigate(["/insurance/insurance-makemedicineclaim"]);
        } else {
          this.coreService.showError(result.message, "");
        }
      },
      error: (err: ErrorEvent) => {
        console.log("error in submit claim", err.message);
      },
    });
  }

  getConfirmation() {
    this.openVerticallyCenteredClaim(this.claimsubmittedcontent);
  }

  private closePopUp() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  // Prescription Details modal
  async openVerticallyCenteredClaim(claimsubmittedcontent: any) {
    await this.getClaimDetails();
    this.modalService.open(claimsubmittedcontent, {
      centered: true,
      size: "md",
      windowClass: "claim_successfully",
    });
  }

  //  UAB modal
  async openVerticallyCenteredUab(uabcontent: any) {
    await this.getClaimDetails();
    this.modalService.open(uabcontent, {
      centered: true,
      size: "xl",
      windowClass: "templet",
    });
  }

  //  MAADO modal
  async openVerticallyCenteredMaado(maadocontent: any) {
    await this.getClaimDetails();
    this.modalService.open(maadocontent, {
      centered: true,
      size: "xl",
      windowClass: "maado",
    });
  }

  //  Coversure modal
  openVerticallyCenteredCoversure(coversure: any) {
    this.modalService.open(coversure, {
      centered: true,
      size: "xl",
      windowClass: "coversure templet",
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
    if (this.insuranceObjectSub) {
      this.insuranceObjectSub.unsubscribe();
    }
    // this._coreService.SharingData.
  }

  drawStart() {
  }

  drawComplete() {

    const base64Data: any = this.signaturePad.toDataURL();


    const base64String = base64Data.replace(/^data:.*,/, '');

    // Decode the Base64 string into a byte array
    const byteCharacters = atob(base64String);

    // Create an array buffer from the byte array
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob object from the byte array
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    // Create a File object from the Blob
    const file = new File([blob], 'file_name_here', { type: 'application/octet-stream' });


    this.signatureFile = file;
    this.signatureURL = base64Data;

    console.log("FILE==>", this.signatureFile)
    console.log("FILE URL==>", this.signatureURL)
  }

  clearSignature() {
    this.signaturePad.clear();
    this.signatureURL = "";
  }


}
