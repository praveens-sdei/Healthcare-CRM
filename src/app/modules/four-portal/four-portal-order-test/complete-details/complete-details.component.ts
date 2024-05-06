import { Component, OnInit,ViewEncapsulation,ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IUniqueId } from 'src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type';
import { PatientService } from 'src/app/modules/patient/patient.service';
import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';
import { IResponse } from 'src/app/shared/classes/api-response';
import { CoreService } from 'src/app/shared/core.service';
import { FourPortalService } from '../../four-portal.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-complete-details',
  templateUrl: './complete-details.component.html',
  styleUrls: ['./complete-details.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class CompleteDetailsComponent implements OnInit {
  importPDFForm: any = FormGroup;
  order_id: string = "";
  patient_details: any;
  health_plan_details: any;
  insuranceDetails: any;
  orderDetails = null;
  displayedColumns: string[] = [
    "medicinename",
    "quantityprescribed",
    "quantitydelivered",
    "frequency",
    "duration",
    "priceperunit",
    "totalcost",
    "available"
  ];
  dataSource: MatTableDataSource<AbstractControl>;
  public orderTest = {
    test_details: [],
    total_cost: "",
    copay: "",
    insurance_paid: "",
  };
  prescriptionUrl: string = "";
  prescriptionSignedUrl: string = "";
  availableTestList: string[] = [];
  subscriberdetails: any;
  subscriber_id: any;
  userId: any;
  userRole: any;
  userType: any;
  pdFFileData: FormData = null;
  pdfData: any = "";
  uploadedPdf: any;
  viewPDFData: any;
  isSubmitted: boolean = false;

  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private fourPortalService: FourPortalService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private loader: NgxUiLoaderService
  ) {
     let userData = this.coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userType = userData?.type

    this.userRole = userData?.role;
    if(this.userRole === 'STAFF'){
      this.userId = adminData.creatorId;

    }else{
      this.userId = userData._id;

    }

    this.importPDFForm = this.fb.group({
      importpdf: ["",[Validators.required]],
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
      this.getOrderDetails();
    });
  }
  getPatientDetails(patient_id: string) {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    const subscriber_id = this.orderDetails.orderData.subscriber_id

    this.pharmacyService.patientProfile(patient_id, insuranceNo,subscriber_id).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
        this.health_plan_details = response?.body.health_plan_details;
        this.subscriberdetails = response?.body.health_plan_details?.resultData;
        console.log(this.subscriberdetails,"subscriberdetails");
        console.log(this.health_plan_details,"health_plan_details");
        console.log(this.patient_details,"patient_details");
        this.checkInsuranceExpiry();
       }
    });
  }

  checkInsuranceExpiry() {
    let reqData = {
      insurance_id:
        this.patient_details?.in_insurance?.primary_insured?.insurance_id,
      policy_id: this.patient_details?.in_insurance?.primary_insured?.policy_id,
      card_id: this.patient_details?.in_insurance?.primary_insured?.card_id,
      employee_id:
        this.patient_details?.in_insurance?.primary_insured?.employee_id,
    };
    this.pharmacyService.checkSubscriptionExpiry(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.insuranceDetails = response.body;
    });
  }

  public getOrderDetails(): void {
    const orderDetailRequest = {
      for_portal_user: this.userId,
      for_order_id: this.order_id,
      portal_type: this.userType
    };
    this.patientService.fetchOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result1) => {
        let encryptedData = { data: result1 };
        let result = this.coreService.decryptObjectData(encryptedData);
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          this.orderDetails = result.data;
          console.log("this.orderDetails==>>>>>>",this.orderDetails)
          this.viewPDFData =  result.data?.orderData?.online_pdf;
          this.getPatientDetails(result.data.orderData.patient_details.user_id)
          this.subscriber_id = result?.data?.orderData?.subscriber_id
          if (this.orderDetails.testBill.prescription_url) {
            this.prescriptionSignedUrl=this.orderDetails.testBill.prescription_url;
          }
          result.data.testDetails.forEach((element) => {
            const available = element.available ? "yes" : "no";
            const newRow = {
              name: element.name,
              prescribed: element.quantity_data.prescribed,
              delivered: 
                element.quantity_data.delivered || "",
              frequency: element.frequency,
              duration: element.duration,
              priceperunit: element.price_per_unit || "",
              totalcost: element.total_cost || "",
              available
            };
            this.availableTestList.push(available);
            (this.orderTest.test_details).push(
              newRow
            );
          });
          this.orderTest["total_cost"] = result.data.testBill.total_test_cost || "";
          this.orderTest["copay"] = result.data.testBill.co_pay || "";
          this.orderTest["insurance_paid"] = result.data.testBill.insurance_paid || "";
          this.dataSource = new MatTableDataSource(
            (this.orderTest["test_details"])
          );
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

  testAvailabilityChange(e: { value: string }, i: number) {
    this.availableTestList[i] = e.value;
  }

  public updateOrderData(): void {

    const orderDetailRequest = {
      for_portal_user: this.userId,
      for_order_id: this.order_id,
      in_medicine_bill: this.orderDetails.testBill._id,
      medicine_bill: {
        co_pay: this.orderTest["copay"],
        total_medicine_cost: this.orderTest["total_cost"],
        insurance_paid: this.orderTest["insurance_paid"],
      },
      test_details: this.orderTest["test_details"].map((data) => ({
        name: data.name,
        medicine_id: null,
        quantity_data: {
          prescribed: data.prescribed,
          delivered: data.delivered,
        },
        frequency: data.frequency,
        duration: data.duration,
        price_per_unit: data.priceperunit,
        total_cost: data.totalcost,
        available: data.available === "yes",
      })),
      request_type: this.orderDetails.orderData.request_type,
      status: "completed",
      portal_type:this.userType
    };
    this.loader.start();
    this.fourPortalService.updateOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result1) => {
        let encryptedData = { data: result1 };
        let result = this.coreService.decryptObjectData(encryptedData);
        if (result.status === true) {
          this.loader.stop();
          this.gotoOrderList();
        }
      },
      error: (err: ErrorEvent) => {
        this.loader.stop();
        this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }
 

  gotoOrderList() {
    this.router.navigate([`/portals/order-request/${this.userType}`])
  }

  openPDFPopup(importPDF: any) {
    this.modalService.open(importPDF, {
      centered: true,
      size: "lg",
      windowClass: "master_modal Import",
    });
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }

  onFileSelected(event) {
    let file = event.target.files[0];
    console.log("file-->", file);

    const formData: FormData = new FormData();
    formData.append("portal_user_id", this.userId);
    formData.append("docType", "pdf");
    formData.append("portalType", this.userType);
    formData.append("multiple", "false");
    formData.append("documents", file);

    this.pdFFileData = formData;
    // console.log("this.pdFFileData>>>>>>",this.pdFFileData)
    var reader = new FileReader();
    reader.onload = (event: any) => {
    this.pdfData = event.target.result;
      // console.log("this.pdfData>>>>>>",this.pdfData)
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  private uploadDocument(doc: FormData) {
    return new Promise((resolve, reject) => {
      this.fourPortalService.uploadFileForPortal(doc).subscribe(
        (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log(res,"response>>>>>>>>>>>>>",response)
          resolve(response);
        },
        (err) => {
          let errResponse = this.coreService.decryptObjectData({
            data: err.error,
          });
          console.log("errResponse>>>>>>",errResponse)

          this.toastr.error(errResponse.messgae);
        }
      );
    });
  }

  get f() {
    return this.importPDFForm.controls;
  }

  async handleSavePdf() {
    this.isSubmitted=true;
    if (this.importPDFForm.invalid) {
      // If form is invalid, do not proceed with submission
      this.coreService.showError("","Please Select any file")
      return;
    }
    this.isSubmitted=false;

    if (this.pdFFileData) {
      await this.uploadDocument(this.pdFFileData).then((res: any) => {
        console.log("res>>>>>>>>>",res)
        this.uploadedPdf = res.data[0]
      });
    }

    var reqData = {
      online_pdf: this.uploadedPdf,
      order_id:this.order_id,
      fourPortalId: this.userId,
      portalType:this.userType
    };
    
    this.loader.start();

    this.fourPortalService.fourPortal_orderflowPdf(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status == true) {
          this.loader.stop();
         this.toastr.success(response.message)
         this.getOrderDetails();
         this.closePopup();
        }else{
          this.loader.stop();
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.toastr.error(errResponse.message);
      }
    );
  }

  handleDownloadPDF() {
    console.log("this.viewPDFData===>>>", this.viewPDFData)
    window.location.href = this.viewPDFData;
  }
}