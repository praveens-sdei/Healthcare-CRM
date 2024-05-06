import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PharmacyPlanService } from "./../../pharmacy-plan.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { PharmacyService } from "../../pharmacy.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";

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
  selector: 'app-esignature-preauth',
  templateUrl: './esignature-preauth.component.html',
  styleUrls: ['./esignature-preauth.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EsignaturePreauthComponent implements OnInit {

  // UAB1 table
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

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private coreService: CoreService,
    private service: PharmacyService,
    private toastr: ToastrService,
    private pharmacyPlanService: PharmacyPlanService
  ) {
    this.signatureForm = this.fb.group({
      fullName: ["", [Validators.required]],
      date: ["", [Validators.required]],
      time: ["", [Validators.required]],
      signature: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem("loginData"));
    this.userId = user?._id;
  }

  async onSubmit() {
    if (this.signatureFile) {
      await this.uploadSignature(this.signatureFile).then((res: any) => {
        this.signatureForm.get("signature").setValue(res.data[0].Key);
      });
    }

    let time = moment(this.signatureForm.value.time).format("hh:mm");
    let date = moment(this.signatureForm.value.date).format("MM/DD/YYYY");

    let reqData = {
      eSignature: {
        fullName: this.signatureForm.value.fullName,
        date: date,
        time: time,
        signature: this.signatureForm.value.signature,
      },
      pharmacyId: this.userId,
      claimObjectId: "63c1caba8b4284a268856d0c",
    };

    console.log("Req Data ---->", reqData);
    this.pharmacyPlanService.eSignature(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("Response ------->", response);
        if (response.status) {
          this.toastr.success(response.message);
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

  uploadSignature(file) {
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

  onSignatureChange(event: any) {
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

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  // Prescription Details modal
  openVerticallyCenteredClaim(claimsubmittedcontent: any) {
    this.modalService.open(claimsubmittedcontent, {
      centered: true,
      size: "md",
      windowClass: "claim_successfully",
    });
  }

  //  UAB modal
  openVerticallyCenteredUab(uabcontent: any) {
    this.modalService.open(uabcontent, {
      centered: true,
      size: "xl",
      windowClass: "templet",
    });
  }

  //  MAADO modal
  openVerticallyCenteredMaado(maadocontent: any) {
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
}
