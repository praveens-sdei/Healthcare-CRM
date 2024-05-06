import { ToastrService } from "ngx-toastr";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PatientService } from "src/app/modules/patient/patient.service";
import { CoreService } from "src/app/shared/core.service";
import { OutletContext } from "@angular/router";

@Component({
  selector: "app-medicaldocument",
  templateUrl: "./medicaldocument.component.html",
  styleUrls: ["./medicaldocument.component.scss"],
})
export class MedicaldocumentComponent implements OnInit {
  @Input() fromParent: any;
  @Output() refreshDetails = new EventEmitter<string>();

  patient_id: any = "";
  medicalDocuments: any[] = [];
  setDocToView: any = "";
  isSubmitted: any = false;

  medicalDocumentForm: any = FormGroup;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private patientService: PatientService,
    private coreService: CoreService,
    private toastr: ToastrService
  ) {
    this.medicalDocumentForm = this.fb.group({
      medical_document: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.patient_id = this.fromParent?.patient_id;
    this.medicalDocuments = this.fromParent?.documents;
  }

  ngOnChanges() {
    this.medicalDocuments = this.fromParent?.documents;
  }

  handleAddMedicalDocuments() {
    this.isSubmitted = true;
    if (this.medicalDocumentForm.invalid) {
      return;
    }
    this.isSubmitted = false;

    let medical_document = [];

    if (this.medicalDocuments != undefined) {
      medical_document = [...this.medicalDocuments];
    }

    this.medicalDocumentForm.value.medical_document.forEach((element) => {
      medical_document.push(element);
    });

    let reqData = {
      patient_id: this.patient_id,
      medical_document: medical_document,
    };

    this.patientService.medicalDocuments(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData(res);
      if (response.status) {
        this.closePopup();
        this.refreshDetails.emit("refresh");
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  async onMedicalDocChange(event: any, index: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let formData: any = new FormData();
      formData.append("userId", this.patient_id);
      formData.append("docType", index);
      formData.append("multiple", "false");
      formData.append("docName", file);

      await this.uploadDocuments(formData).then((res: any) => {
        this.medical_document.at(index).patchValue({
          image: res.data[0].Key,
        });
      });
    }
  }

  uploadDocuments(doc: FormData) {
    return new Promise((resolve, reject) => {
      this.patientService.uploadFile(doc).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData(res);
          resolve(response);
        },
        (err) => {
          let errResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          this.toastr.error(errResponse.messgae);
        }
      );
    });
  }

  //--------------------------Medical Documnets Form Handling------------------------
  medDocValidation(index) {
    let docs = this.medicalDocumentForm.get("medical_document") as FormArray;
    const formGroup = docs.controls[index] as FormGroup;
    return formGroup;
  }

  get medical_document() {
    return this.medicalDocumentForm.controls["medical_document"] as FormArray;
  }

  addNewMedicalDocument() {
    const newMedicalDoc = this.fb.group({
      name: ["", [Validators.required]],
      issue_date: ["", [Validators.required]],
      expiration_date: [""],
      image: ["", [Validators.required]],
    });
    this.medical_document.push(newMedicalDoc);
  }

  deleteMedicalDoc(index: number) {
    this.medical_document.removeAt(index);
  }

  // Quick view modal
  openVerticallyCenteredquickview(quick_view: any, url: any) {
    this.setDocToView = url;
    this.modalService.open(quick_view, {
      centered: true,
      size: "lg",
      windowClass: "quick_view",
    });
  }

  // Add Documents Model
  openDocumentModal(documentModal: any) {
    this.addNewMedicalDocument();
    this.modalService.open(documentModal, {
      centered: true,
      size: "xl",
      windowClass: "add_immunization",
    });
  }

  closePopup() {
    this.medicalDocumentForm.reset();
    this.medical_document.clear();

    this.modalService.dismissAll("close");
  }
}
