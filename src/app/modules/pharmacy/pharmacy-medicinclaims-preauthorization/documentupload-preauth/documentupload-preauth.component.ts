import { CoreService } from "./../../../../shared/core.service";
import { PharmacyPlanService } from "./../../pharmacy-plan.service";
import { Component, OnInit } from "@angular/core";
import { PharmacyService } from "../../pharmacy.service";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: 'app-documentupload-preauth',
  templateUrl: './documentupload-preauth.component.html',
  styleUrls: ['./documentupload-preauth.component.scss']
})
export class DocumentuploadPreauthComponent implements OnInit {

  userId: any = "";
  selectedType: any = "";
  invoiceUrl: SafeResourceUrl[] = [];
  recieptUrl: SafeResourceUrl[] = [];
  prescriptionUrl: SafeResourceUrl[] = [];
  hospitalReportUrl: SafeResourceUrl[] = [];
  invoiceDocs: FormData = null;
  recieptDocs: FormData = null;
  prescriptionDocs: FormData = null;
  hospitalReportDocs: FormData = null;

  constructor(
    private coreService: CoreService,
    private planService: PharmacyPlanService,
    private pharmacyService: PharmacyService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem("loginData"));
    this.userId = user?._id;
  }

  async claimDocumentsUpload() {
    let metaData = [];
    let invoiceKeyArray = [];
    let recieptKeyArray = [];
    let prescriptionKeyArray = [];
    let hospitalReportKeyArray = [];

    if (this.invoiceDocs) {
      await this.uploadDocs(this.invoiceDocs).then((res: any) => {
        console.log("invoiceDocs Files uploaded---->", res);
        res.data.forEach((element) => {
          invoiceKeyArray.push({
            document: element.Key,
          });
        });
      });
    }

    if (this.recieptDocs) {
      await this.uploadDocs(this.recieptDocs).then((res: any) => {
        console.log("recieptDocs Files uploaded---->", res);
        res.data.forEach((element) => {
          recieptKeyArray.push({
            document: element.Key,
          });
        });
      });
    }

    if (this.prescriptionDocs) {
      await this.uploadDocs(this.prescriptionDocs).then((res: any) => {
        console.log("prescriptionDocs Files uploaded---->", res);
        res.data.forEach((element) => {
          prescriptionKeyArray.push({
            document: element.Key,
          });
        });
      });
    }

    if (this.hospitalReportDocs) {
      await this.uploadDocs(this.hospitalReportDocs).then((res: any) => {
        console.log("hospitalReportDocs Files uploaded---->", res);
        res.data.forEach((element) => {
          hospitalReportKeyArray.push({
            document: element.Key,
          });
        });
      });
    }

    if (invoiceKeyArray.length > 0) {
      metaData.push({
        documentType: "invoice",
        documents: invoiceKeyArray,
      });
    }
    if (recieptKeyArray.length > 0) {
      metaData.push({
        documentType: "reciept",
        documents: recieptKeyArray,
      });
    }
    if (prescriptionKeyArray.length > 0) {
      metaData.push({
        documentType: "prescription",
        documents: prescriptionKeyArray,
      });
    }
    if (hospitalReportKeyArray.length > 0) {
      metaData.push({
        documentType: "hospital report",
        documents: hospitalReportKeyArray,
      });
    }

    let reqData = {
      documentData: metaData,
      pharmacyId: this.userId,
      claimObjectId: "63c1caba8b4284a268856d0c",
    };

    console.log("Request Data---->", reqData);

    this.planService.claimDocumentUpload(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
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

  uploadDocs(docs: any) {
    return new Promise((resolve, reject) => {
      this.pharmacyService.uploadDocument(docs).subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        resolve(response);
        if (response.status) {
          this.toastr.success(response.message);
        }
      });
    });
  }

  handleSelectType(event: any) {
    this.selectedType = event.value;
  }

  onFileSelected(
    event,
    type: "invoice" | "reciept" | "prescription" | "hospital report"
  ) {
    const files: File[] = event.target.files;
    const formData: FormData = new FormData();
    formData.append("userId", this.userId);
    if (files.length > 1) {
      formData.append("multiple", "true");
    } else {
      formData.append("multiple", "false");
    }

    for (const file of files) {
      if (type === "invoice") {
        formData.append("docType", type);
        formData.append("docName", file);
        const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        );
        this.invoiceUrl.push(imgUrl);
        this.invoiceDocs = formData;
      }

      if (type === "reciept") {
        formData.append("docType", type);
        formData.append("docName", file);
        const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        );
        this.recieptUrl.push(imgUrl);
        this.recieptDocs = formData;
      }

      if (type === "prescription") {
        formData.append("docType", type);
        formData.append("docName", file);
        const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        );
        this.prescriptionUrl.push(imgUrl);
        this.prescriptionDocs = formData;
      }

      if (type === "hospital report") {
        formData.append("docType", type);
        formData.append("docName", file);
        const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        );
        this.hospitalReportUrl.push(imgUrl);
        this.hospitalReportDocs = formData;
      }
    }
  }

}
