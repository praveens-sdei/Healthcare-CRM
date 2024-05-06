import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IUniqueId } from 'src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type';
import { IResponse } from 'src/app/shared/classes/api-response';
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from '../../patient.service';
import { IDocumentMetaDataResponse, IMedicineUpdateResponse, IOrderDetailsRequest, IOrderDetailsResponse, IOrderUpdateRequest, ISignedUrlRequest } from '../../patient-prescriptionorder/neworder/neworder.type';
import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';


@Component({
  selector: 'app-newpricerequest',
  templateUrl: './newpricerequest.component.html',
  styleUrls: ['./newpricerequest.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class NewpricerequestComponent implements OnInit {
  portal_id: string = "";
  order_id: string = "";
  patient_details: any;
  health_plan_details: any;
  insuranceDetails: any
  orderDetails= null;
  displayedColumns: string[] = ['medicinename', 'packorunit', 'frequency', 'duration'];
  dataSource: MatTableDataSource<AbstractControl>;
  public orderTest = {
    test_details: [],
    total_cost: "",
    copay: "",
    insurance_paid: "",
  };
  prescriptionUrl: string = "";
  prescriptionSignedUrl: string = "";
  availabletestList: string[] = [];
  subscriberdetails: any;
  subscriber_id:any='';
  profileData: any;
  portal_Profile: any;
  portal_type: any;

  constructor(
    private modalService: NgbModal,
    private patientService: PatientService,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
      this.portal_id = params["portal_id"];
      this.portal_type = params["portal_type"]
      this.getOrderDetails();
    });
  }
  downloadPrescription() {
    for (const url of this.prescriptionSignedUrl) {
      console.log("urllllllllllllllll",url);
      
      window.open(url, '_blank')
    }
  }
  getPatientDetails() {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    const patientID = this.orderDetails.orderData.patient_details.user_id
    this.pharmacyService.patientProfile(patientID, null,this.subscriber_id).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
        console.log("response------------------",response);
        
        this.subscriberdetails = response?.body.health_plan_details?.resultData;
        if(this.subscriber_id!=null)
        {
        this.checkInsuranceExpiry()
        }
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
        subscriber_id:this.subscriber_id
    };
    this.pharmacyService.checkSubscriptionExpiry(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.insuranceDetails = response.body;
    });
  }
  public getOrderDetails(): void {
    const orderDetailRequest = {
      for_portal_user: this.portal_id,
      for_order_id: this.order_id,
      portal_type : this.portal_type
    };

    this.patientService.fetchOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        console.log("result=======",result);
        
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          this.orderDetails = result.data;
          this.profileData=result?.data?.portal_Details
          this.portal_Profile=result?.data?.portal_Profile

          this.subscriber_id = result?.data?.orderData?.subscriber_id
// console.log("this.orderDetails------105---",result );

          this.getPatientDetails()
          if (this.orderDetails.testBill.prescription_url) {
            this.prescriptionSignedUrl=this.orderDetails?.testBill?.prescription_url;
            console.log("this.prescriptionSignedUrl======",this.prescriptionSignedUrl);
            
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
            this.availabletestList.push(available);
            (this.orderTest.test_details).push(
              newRow
            );
          });
          this.orderTest["total_cost"] = result.data.testBill.total_medicine_cost || "";
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
    this.availabletestList[i] = e.value;
  }

  gotoOrderList() {
    if(this.portal_type === "Paramedical-Professions"){
      this.router.navigate(['/patient/paramedical-profession-price-request']);
    } else if(this.portal_type === "Dental"){
      this.router.navigate(['/patient/dental-price-request']);

    } else if(this.portal_type === "Optical"){
      this.router.navigate(['/patient/optical-price-request']);

    } else if(this.portal_type === "Laboratory-Imaging"){
      this.router.navigate(['/patient/lab-imaging-price-request']);

    }
  }

}
