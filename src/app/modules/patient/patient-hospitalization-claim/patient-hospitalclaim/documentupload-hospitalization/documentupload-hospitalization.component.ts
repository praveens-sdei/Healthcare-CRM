import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PharmacyPlanService } from 'src/app/modules/pharmacy/pharmacy-plan.service';
import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';
import { CoreService } from 'src/app/shared/core.service';
@Component({
  selector: 'app-documentupload-hospitalization',
  templateUrl: './documentupload-hospitalization.component.html',
  styleUrls: ['./documentupload-hospitalization.component.scss']
})
export class DocumentuploadHospitalizationComponent implements OnInit {


  @Input() public mstepper: MatStepper;
  userId: any = "";
  selectedType: any = "";
  uploadTypeFormat: any = "Invoice";
  // invoiceUrl: SafeResourceUrl[] = [];
  previousinvoiceUrl: number = 0;
  previoushospitalUrl: number = 0;
  previousreceiptUrl: number = 0;
  previouspresciptionUrl: number = 0;
  previousothersUrl: number = 0;
  invoiceUrl: any = [];
  recieptUrl: any = [];
  prescriptionUrl: any = [];
  hospitalReportUrl: any = [];
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
  reportFileName: any = "";
  otherFileName: any = [];
  @ViewChild('pharmacyPicUpload') pharmacyPicUpload: ElementRef;
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

    // this.invoiceDocs = new FormData();

  }

  async claimDocumentsUpload() {
    let metaData = [];
    let invoiceKeyArray = [];
    let recieptKeyArray = [];
    let prescriptionKeyArray = [];
    let hospitalReportKeyArray = [];
    let otherKeyArray = [];

    // this.invoiceDocs.forEach((value, key) => {
    //   console.log(value, "check value", key);

    //   // formDataEntries.push({ key, value });
    // });

    if (this.invoiceDocs) {
      await this.uploadDocs(this.invoiceDocs).then((res: any) => {
        console.log("invoiceDocs Files uploaded---->", res);
        res.data.forEach((element) => {
          metaData.push({
            document_url: element.Key,
            documentType: 'invoice',
            fileName: 'invoice',
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
            documentType: 'reciept',
            fileName: 'reciept',
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
            documentType: 'prescription',
            fileName: 'prescription',
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
            documentType: 'hospital_report',
            fileName: 'hospital_report',
          });
        });
      });
    }
    if (this.OthersDocs) {
      await this.uploadDocs(this.OthersDocs).then((res: any) => {
        console.log("otherDocs Files uploaded---->", res);
        res.data.forEach((element, i) => {
          metaData.push({
            document_url: element.Key,
            documentType: 'others',
            fileName: this.otherFileName[i],
          });
        });

      });
    }




    let reqData = {
      documentData: metaData,
      createdById: this.userId,
      claimObjectId: JSON.parse(sessionStorage.getItem('stepOneId')),
    };

    console.log("UPLOAD DOCS REQUEST DATA====>", reqData);

    // return;
    if (metaData.length > 0) {
      this.planService.documentUploadDoctor(reqData).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            this.mstepper.next();
            this.toastr.success(response.message);
          } else {
            this.toastr.error(response.message);
          }

          // recieptDocs  prescriptionDocs hospitalReportDocs OthersDocs
          this.invoiceDocs = null;
          this.recieptDocs = null;
          this.prescriptionDocs = null;
          this.hospitalReportDocs = null;
          this.OthersDocs = null;
          // this.clearFormData(this.invoiceDocs);
          // this.clearFormData(this.recieptDocs);
          // this.clearFormData(this.prescriptionDocs);
          // this.clearFormData(this.hospitalReportDocs);
          // this.clearFormData(this.OthersDocs);
          this.insuranceId = this.coreService.getSessionStorage("InsuranceId");
          this.coreService.setInsObjectid(this.insuranceId);
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
      this.coreService.setInsObjectid(this.insuranceId);
      this.mstepper.next();
    }
    this.reportFileName = '';
  }


  clearFormData(formData: FormData) {
    // Manually clear the FormData object by deleting its properties
    formData.forEach((value, key) => {
      formData.delete(key);
    });
  }

  uploadDocs(docs: any) {
    return new Promise((resolve, reject) => {
      console.log(docs, "check docs page");

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
      console.log(this.OthersDocs, "check other doc")
      if (this.OthersDocs) {
        formData = this.OthersDocs;
        formData.delete('multiple');
        formData.set('multiple', "true");
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
    console.log(files.length, "gfgf");

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
        console.log("inside other");

        formData.append("docType", type);
        formData.append("docName", file);
        const imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(file)
        );
        console.log(this.reportFileName, "1234file");

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
              this.previousinvoiceUrl++;
              this.invoiceUrl.push({
                "signedUrl": element.document_signed_url,
                "imageId": element._id
              })

            }
            if (element.documentType === "hospital_report") {
              this.previoushospitalUrl++;
              this.hospitalReportUrl.push({
                "signedUrl": element.document_signed_url,
                "imageId": element._id
              })

            }
            if (element.documentType === "reciept") {
              this.previousreceiptUrl++;
              this.recieptUrl.push({
                "signedUrl": element.document_signed_url,
                "imageId": element._id
              })

            }
            if (element.documentType === "prescription") {
              this.previouspresciptionUrl++;
              this.prescriptionUrl.push({
                "signedUrl": element.document_signed_url,
                "imageId": element._id
              })

            }
            if (element.documentType === "others") {
              this.previousothersUrl++;
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


