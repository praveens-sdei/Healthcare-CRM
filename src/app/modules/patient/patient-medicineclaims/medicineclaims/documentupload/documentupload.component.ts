import { CoreService } from "../../../../../shared/core.service";

import { PharmacyPlanService } from "../../../../pharmacy/pharmacy-plan.service";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { PharmacyService } from "../../../../pharmacy/pharmacy.service";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-documentupload',
  templateUrl: './documentupload.component.html',
  styleUrls: ['./documentupload.component.scss']
})
export class DocumentuploadComponent implements OnInit {
  @Input() public mstepper: MatStepper;
  userId: any = "";
  selectedType: any = "";
  uploadTypeFormat: any = "Invoice";
  // invoiceUrl: SafeResourceUrl[] = [];
  invoiceUrl: any = [];
  recieptUrl: any = [];
  prescriptionUrl: any = [];
  hospitalReportUrl: any = [];
  previousinvoiceUrl: number = 0;
  previoushospitalUrl: number = 0;
  previousreceiptUrl: number = 0;
  previouspresciptionUrl: number = 0;
  previousothersUrl: number = 0;
  OthersUrl: any = [];
  invoiceDocs: FormData = null;
  recieptDocs: FormData = null;
  prescriptionDocs: FormData = null;
  hospitalReportDocs: FormData = null;
  OthersDocs: FormData = null;
  fileFormatType: any = [];
  insuranceId: any;
  stepOneId: any = "";
  selectclaimid: any = '';
  docSubcription: Subscription;
  @ViewChild('pharmacyPicUpload') pharmacyPicUpload: ElementRef;
  reportFileName: any;
  otherFileName: any;
  constructor(
    private coreService: CoreService,
    private planService: PharmacyPlanService,
    private pharmacyService: PharmacyService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {
    this.insuranceId = this.coreService.getSessionStorage('InsuranceId');
    this.stepOneId = this.coreService.getSessionStorage('stepOneId');
    this.docSubcription = this.coreService.SharingDocumentId.subscribe((res) => {
      console.log('service component subsribe', res);
      if (res != 'default') {

        this.route.queryParams.subscribe((params: any) => {
          this.selectclaimid = params.claim_id;
        }
        );
        console.log('selectclaimid', this.selectclaimid);

        if (this.selectclaimid != '' && this.selectclaimid != undefined) {
          console.log('in if');

          this.getClaimDetails();
        }
      }
    });
  }

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem("loginData"));
    this.userId = user?._id;
    this.insuranceId = this.coreService.getSessionStorage('InsuranceId');
    this.stepOneId = this.coreService.getSessionStorage('stepOneId');



  }

  async claimDocumentsUpload() {
    let metaData = [];
    let invoiceKeyArray = [];
    let recieptKeyArray = [];
    let prescriptionKeyArray = [];
    let hospitalReportKeyArray = [];
    let otherKeyArray = [];


    if (this.invoiceDocs) {
      await this.uploadDocs(this.invoiceDocs).then((res: any) => {
        console.log("invoiceDocs Files uploaded---->", res);
        res.data.forEach((element) => {
          metaData.push({
            document_url: element.Key,
            documentType: 'invoice'

          });
        });
      });
    }

    if (this.recieptDocs) {
      await this.uploadDocs(this.recieptDocs).then((res: any) => {
        console.log("recieptDocs Files uploaded---->", res);
        res.data.forEach((element) => {
          metaData.push({
            document_url: element.Key,
            documentType: 'reciept'

          });
        });
      });
    }

    if (this.prescriptionDocs) {
      await this.uploadDocs(this.prescriptionDocs).then((res: any) => {
        console.log("prescriptionDocs Files uploaded---->", res);
        res.data.forEach((element) => {
          metaData.push({
            document_url: element.Key,
            documentType: 'prescription'

          });
        });
      });
    }

    if (this.hospitalReportDocs) {
      await this.uploadDocs(this.hospitalReportDocs).then((res: any) => {
        console.log("hospitalReportDocs Files uploaded---->", res);
        res.data.forEach((element) => {
          metaData.push({
            document_url: element.Key,
            documentType: 'hospital_report'

          });
        });
      });
    }
    if (this.OthersDocs) {
      await this.uploadDocs(this.OthersDocs).then((res: any) => {
        console.log("otherDocs Files uploaded---->", res);
        res.data.forEach((element) => {
          metaData.push({
            document_url: element.Key,
            documentType: 'others'

          });
        });
      });
    }




    let reqData = {
      documentData: metaData,
      pharmacyId: '',
      loggedInPatientId: this.userId,
      claimObjectId: JSON.parse(sessionStorage.getItem('stepOneId')),
    };

    console.log("UPLOAD DOCS REQUEST DATA====>", reqData);

    // return;
    if (metaData.length > 0) {
      this.planService.claimDocumentUpload(reqData).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            this.mstepper.next();
            this.toastr.success(response.message);
          }
          this.invoiceDocs = null;
          this.recieptDocs = null;
          this.prescriptionDocs = null;
          this.hospitalReportDocs = null;
          this.OthersDocs = null;
          this.insuranceId = this.coreService.getSessionStorage("InsuranceId");
          this.coreService.setInsObjectid(this.insuranceId)
        },
        (err) => {
          let errorResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          this.toastr.error(errorResponse.message);
        }
      );
    } else {
      this.insuranceId = this.coreService.getSessionStorage("InsuranceId");
      this.coreService.setInsObjectid(this.insuranceId)

      this.mstepper.next();
    }
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

  uploadType(event: any) {
    this.uploadTypeFormat = event.value;
  }

  // onFileSelected(
  //   event,
  //   type: "Invoice" | "Receipt" | "Prescriptions" | "Hospital" | "Others"
  // ) {
  //   const files: File[] = event.target.files;
  //   const formData: FormData = new FormData();
  //   formData.append("userId", this.userId);
  //   if (files.length > 1) {
  //     formData.append("multiple", "true");
  //   } else {
  //     formData.append("multiple", "false");
  //   }

  //   for (const file of files) {
  //     if (type === "Invoice") {
  //       formData.append("docType", type);
  //       formData.append("docName", file);
  //       const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  //         window.URL.createObjectURL(file)
  //       );
  //       this.invoiceUrl.push({"signedUrl":imgUrl,"imageId":''});
  //       // this.invoiceUrl.push(imgUrl);
  //       this.invoiceDocs = formData;
  //       this.fileFormatType.push('1')
  //     }

  //     if (type === "Receipt") {
  //       formData.append("docType", type);
  //       formData.append("docName", file);
  //       const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  //         window.URL.createObjectURL(file)
  //       );
  //       this.recieptUrl.push({"signedUrl":imgUrl,"imageId":''});
  //       this.recieptDocs = formData;
  //       this.fileFormatType.push('2')
  //     }

  //     if (type === "Prescriptions") {
  //       formData.append("docType", type);
  //       formData.append("docName", file);
  //       const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  //         window.URL.createObjectURL(file)
  //       );
  //       this.prescriptionUrl.push({"signedUrl":imgUrl,"imageId":''});
  //       this.prescriptionDocs = formData;
  //       this.fileFormatType.push('3');
  //     }

  //     if (type === "Hospital") {
  //       formData.append("docType", type);
  //       formData.append("docName", file);
  //       const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  //         window.URL.createObjectURL(file)
  //       );
  //       this.hospitalReportUrl.push({"signedUrl":imgUrl,"imageId":''});
  //       this.hospitalReportDocs = formData;
  //       this.fileFormatType.push('4')
  //     }
  //     if (type === "Others") {
  //       formData.append("docType", type);
  //       formData.append("docName", file);
  //       const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
  //         window.URL.createObjectURL(file)
  //       );
  //       this.OthersUrl.push({"signedUrl":imgUrl,"imageId":''});
  //       this.OthersDocs = formData;
  //       this.fileFormatType.push('5')
  //     }
  //   }
  //   this.pharmacyPicUpload.nativeElement.value = "";

  // }

  onFileSelected(
    event,
    type: "Invoice" | "Receipt" | "Prescriptions" | "Hospital" | "Others"
  ) {
    const files: File[] = event.target.files;
    var formData: FormData;
    if (type === "Invoice") {
      if (this.invoiceDocs) {
        formData = this.invoiceDocs;
      }
      else {
        formData = new FormData();

        formData.append("userId", this.userId);

        if (files.length > 1) {
          formData.append("multiple", "true");

        }
        else {
          formData.append("multiple", "false");

        }

      }
    }

    if (type === "Receipt") {
      if (this.recieptDocs) {
        console.log("this side change");
        console.log("Before assignment - formData:", formData);
        formData = this.recieptDocs;
        formData['multiple'] = 'true';
        console.log("After assignment - formData:", formData);
      } else {
        formData = new FormData();

        formData.append("userId", this.userId);
        console.log(this.userId, "check userid receipt");

        if (files.length > 1) {
          formData.append("multiple", "true");

        }
        else {
          console.log("check log else");

          formData.append("multiple", "false");

        }

      }
    }

    if (type === "Prescriptions") {
      if (this.prescriptionDocs) {
        formData = this.prescriptionDocs;
      }
      else {
        formData = new FormData();

        formData.append("userId", this.userId);
        if (this.prescriptionDocs) {

          formData.append("multiple", "true");

        } else {
          if (files.length > 1) {
            formData.append("multiple", "true");

          }
          else {
            formData.append("multiple", "false");

          }
        }
      }
    }

    if (type === "Hospital") {
      if (this.hospitalReportDocs) {
        formData = this.hospitalReportDocs;
      }
      else {
        formData = new FormData();

        formData.append("userId", this.userId);
        if (this.hospitalReportDocs) {

          formData.append("multiple", "true");

        } else {
          if (files.length > 1) {
            formData.append("multiple", "true");

          }
          else {
            formData.append("multiple", "false");

          }
        }
      }
    }

    if (type === "Others") {
      if (this.OthersDocs) {
        formData = this.OthersDocs;
      }
      else {
        formData = new FormData();

        formData.append("userId", this.userId);
        if (this.OthersDocs) {

          formData.append("multiple", "true");

        } else {
          if (files.length > 1) {
            formData.append("multiple", "true");

          }
          else {
            formData.append("multiple", "false");

          }
        }
      }
    }




    if (this.invoiceDocs || this.recieptDocs || this.prescriptionDocs || this.hospitalReportDocs || this.OthersDocs) {

    }
    else {
      // formData = new FormData();

      // formData.append("userId", this.userId);
      // if (files.length > 1) {
      //   formData.append("multiple", "true");
      // } else {
      //   formData.append("multiple", "false");
      // }
    }
    for (const file of files) {
      if (type === "Invoice") {
        formData.append("docType", type);
        formData.append("docName", file);
        const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        );
        this.invoiceUrl.push({ "signedUrl": imgUrl, "imageId": '', "name": "Invoice" });
        // this.invoiceUrl.push(imgUrl);
        this.invoiceDocs = formData;
        this.fileFormatType.push('1')
      }

      if (type === "Receipt") {
        formData.append("docType", type);
        formData.append("docName", file);
        const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        );
        this.recieptUrl.push({ "signedUrl": imgUrl, "imageId": '', "name": "Receipt" });
        this.recieptDocs = formData;
        this.fileFormatType.push('2')
      }

      if (type === "Prescriptions") {
        formData.append("docType", type);
        formData.append("docName", file);
        const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        );
        this.prescriptionUrl.push({ "signedUrl": imgUrl, "imageId": '', "name": "Prescriptions" });
        this.prescriptionDocs = formData;
        this.fileFormatType.push('3');
      }

      if (type === "Hospital") {
        formData.append("docType", type);
        formData.append("docName", file);
        const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        );
        this.hospitalReportUrl.push({ "signedUrl": imgUrl, "imageId": '', "name": "Hospital" });
        this.hospitalReportDocs = formData;
        this.fileFormatType.push('4')
      }
      if (type === "Others") {
        formData.append("docType", type);
        formData.append("docName", file);
        const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        );
        this.otherFileName.push(this.reportFileName)
        this.OthersUrl.push({ "signedUrl": imgUrl, "imageId": '', "name": this.reportFileName });
        this.OthersDocs = formData;
        this.fileFormatType.push('5')
      }
    }
    this.pharmacyPicUpload.nativeElement.value = "";

  }

  private getClaimDetails() {
    this.previousinvoiceUrl = 0;
    this.previoushospitalUrl = 0;
    this.previousreceiptUrl = 0;
    this.previouspresciptionUrl = 0;
    this.previousothersUrl = 0;
    this.planService.medicineClaimDetails(this.selectclaimid).subscribe({
      next: async (res) => {

        this.invoiceUrl = [];
        this.recieptUrl = [];
        this.prescriptionUrl = [];
        this.hospitalReportUrl = [];
        this.OthersUrl = [];

        this.invoiceDocs = null;
        this.recieptDocs = null;
        this.prescriptionDocs = null;
        this.hospitalReportDocs = null;
        this.OthersDocs = null;

        let encData = await res;
        let result = await this.coreService.decryptContext(encData);
        console.log('document upload claimDetails', result);
        let claimData = result.data[0];
        console.log('document upload claimDetails', claimData);
        //this.getMedicineList();
        // this.filteredOptions = this.myControl.valueChanges.pipe(
        //     startWith(""),
        //     map((value) => this._filter(value || ""))
        // );
        let obj = [];
        if (claimData.medicineclaimdocs.length > 0) {
          claimData.medicineclaimdocs.forEach((element: any, index: any) => {
            // this.getMedicineList(element.medicineName);
            if (element.documentType === "invoice") {

              this.invoiceUrl.push({
                "signedUrl": element.document_signed_url,
                "imageId": element._id
              })

            }
            if (element.documentType === "hospital_report") {

              this.hospitalReportUrl.push({
                "signedUrl": element.document_signed_url,
                "imageId": element._id
              })

            }
            if (element.documentType === "reciept") {

              this.recieptUrl.push({
                "signedUrl": element.document_signed_url,
                "imageId": element._id
              })

            }
            if (element.documentType === "prescription") {

              this.prescriptionUrl.push({
                "signedUrl": element.document_signed_url,
                "imageId": element._id
              })

            }
            if (element.documentType === "others") {

              this.OthersUrl.push({
                "signedUrl": element.document_signed_url,
                "imageId": element._id
              })

            }

          })
        } else {

        }


      },
      error: (err: ErrorEvent) => {
        console.log(err.message);

      }
    })
  }


  removeImage(imageType: string, index: number, imageId: any = '') {
    if (imageType === 'invoice') {
      if (imageId == '') {

        var formDataEntries = [];

        let diff = this.invoiceUrl.length - this.previousinvoiceUrl;
        let indexVar = index - this.previousinvoiceUrl;

        this.invoiceDocs.forEach((value, key) => {

          formDataEntries.push({ key, value });
        });

        if (diff == 1) {
          formDataEntries = [];
        }
        else {
          formDataEntries.splice((indexVar * 2) + 2, 2);
          if (formDataEntries.length == 4) {
            formDataEntries[1].value = 'false';
          }
        }

        // Create a new FormData object with the updated data
        const updatedFormData = new FormData();

        formDataEntries.forEach((entry) => {
          updatedFormData.append(entry.key, entry.value);

        });
        this.invoiceDocs = updatedFormData;



        // this.invoiceDocs.removeAt(index)
        this.invoiceUrl.splice(index, 1);
      } else {
        let data = {
          "documentId": imageId
        }
        this.planService.removeImageFromClaim(data).subscribe({
          next: async (res) => {
            console.log("check remoceimage");

            let result = await this.coreService.decryptContext(res);
            if (result.status) {
              this.coreService.showSuccess(result.message, '');
              this.invoiceUrl.splice(index, 1);
            } else {
              this.coreService.showError(result.message, '');
            }

          },
          error: (err: ErrorEvent) => {
            this.coreService.showError(err.message, '');
            console.log('Eror', err.message)
          }
        })

      }

    } else if (imageType === 'hospital') {

      if (imageId == '') {

        var formDataEntries = [];

        let diff = this.invoiceUrl.length - this.previoushospitalUrl;
        let indexVar = index - this.previoushospitalUrl;

        this.hospitalReportDocs.forEach((value, key) => {

          formDataEntries.push({ key, value });
        });

        if (diff == 1) {
          formDataEntries = [];
        }
        else {
          formDataEntries.splice((indexVar * 2) + 2, 2);
          if (formDataEntries.length == 4) {
            formDataEntries[1].value = 'false';
          }
        }

        // Create a new FormData object with the updated data
        const updatedFormData = new FormData();

        formDataEntries.forEach((entry) => {
          updatedFormData.append(entry.key, entry.value);

        });
        this.hospitalReportDocs = updatedFormData;


        this.hospitalReportUrl.splice(index, 1);
      } else {
        let data = {
          "documentId": imageId
        }
        this.planService.removeImageFromClaim(data).subscribe({
          next: async (res) => {
            let result = await this.coreService.decryptContext(res);
            if (result.status) {
              this.coreService.showSuccess(result.message, '');
              this.hospitalReportUrl.splice(index, 1);
            } else {
              this.coreService.showError(result.message, '');
            }

          },
          error: (err: ErrorEvent) => {
            this.coreService.showError(err.message, '');
            console.log('Eror', err.message)
          }
        })

      }


    } else if (imageType === 'receipt') {

      if (imageId == '') {
        var formDataEntries = [];

        let diff = this.invoiceUrl.length - this.previousreceiptUrl;
        let indexVar = index - this.previousreceiptUrl;

        this.recieptDocs.forEach((value, key) => {

          formDataEntries.push({ key, value });
        });

        if (diff == 1) {
          formDataEntries = [];
        }
        else {
          formDataEntries.splice((indexVar * 2) + 2, 2);
          if (formDataEntries.length == 4) {
            formDataEntries[1].value = 'false';
          }
        }

        // Create a new FormData object with the updated data
        const updatedFormData = new FormData();

        formDataEntries.forEach((entry) => {
          updatedFormData.append(entry.key, entry.value);

        });
        this.recieptDocs = updatedFormData;
        this.recieptUrl.splice(index, 1);
      } else {
        let data = {
          "documentId": imageId
        }
        this.planService.removeImageFromClaim(data).subscribe({
          next: async (res) => {
            let result = await this.coreService.decryptContext(res);
            if (result.status) {
              this.coreService.showSuccess(result.message, '');
              this.recieptUrl.splice(index, 1);
            } else {
              this.coreService.showError(result.message, '');
            }

          },
          error: (err: ErrorEvent) => {
            this.coreService.showError(err.message, '');
            console.log('Eror', err.message)
          }
        })

      }

    } else if (imageType === 'presciption') {

      if (imageId == '') {

        var formDataEntries = [];

        let diff = this.invoiceUrl.length - this.previouspresciptionUrl;
        let indexVar = index - this.previouspresciptionUrl;

        this.prescriptionDocs.forEach((value, key) => {

          formDataEntries.push({ key, value });
        });

        if (diff == 1) {
          formDataEntries = [];
        }
        else {
          formDataEntries.splice((indexVar * 2) + 2, 2);
          if (formDataEntries.length == 4) {
            formDataEntries[1].value = 'false';
          }
        }

        // Create a new FormData object with the updated data
        const updatedFormData = new FormData();

        formDataEntries.forEach((entry) => {
          updatedFormData.append(entry.key, entry.value);

        });
        this.prescriptionDocs = updatedFormData;
        this.prescriptionUrl.splice(index, 1);
      } else {
        let data = {
          "documentId": imageId
        }
        this.planService.removeImageFromClaim(data).subscribe({
          next: async (res) => {
            let result = await this.coreService.decryptContext(res);
            if (result.status) {
              this.coreService.showSuccess(result.message, '');
              this.prescriptionUrl.splice(index, 1);
            } else {
              this.coreService.showError(result.message, '');
            }

          },
          error: (err: ErrorEvent) => {
            this.coreService.showError(err.message, '');
            console.log('Eror', err.message)
          }
        })

      }

    } else if (imageType === 'others') {

      if (imageId == '') {
        var formDataEntries = [];

        let diff = this.invoiceUrl.length - this.previousothersUrl;
        let indexVar = index - this.previousothersUrl;

        this.OthersDocs.forEach((value, key) => {

          formDataEntries.push({ key, value });
        });

        if (diff == 1) {
          formDataEntries = [];
        }
        else {
          formDataEntries.splice((indexVar * 2) + 2, 2);
          if (formDataEntries.length == 4) {
            formDataEntries[1].value = 'false';
          }
        }

        // Create a new FormData object with the updated data
        const updatedFormData = new FormData();

        formDataEntries.forEach((entry) => {
          updatedFormData.append(entry.key, entry.value);

        });
        this.OthersDocs = updatedFormData;
        this.OthersUrl.splice(index, 1);
      } else {
        let data = {
          "documentId": imageId
        }
        this.planService.removeImageFromClaim(data).subscribe({
          next: async (res) => {
            let result = await this.coreService.decryptContext(res);
            if (result.status) {
              this.coreService.showSuccess(result.message, '');
              this.OthersUrl.splice(index, 1);
            } else {
              this.coreService.showError(result.message, '');
            }

          },
          error: (err: ErrorEvent) => {
            this.coreService.showError(err.message, '');
            console.log('Eror', err.message)
          }
        })

      }

    }
  }

  ngOnDestroy(): void {
    if (this.docSubcription) {
      this.docSubcription.unsubscribe();
    }
    // this._coreService.SharingData.
  }
}