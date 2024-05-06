import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from 'src/app/modules/patient/patient.service';
import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';

@Component({
  selector: 'app-availibility-complete',
  templateUrl: './availibility-complete.component.html',
  styleUrls: ['./availibility-complete.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class AvailibilityCompleteComponent implements OnInit {

  order_id: string = "";
  patient_details: any;
  orderDetails = null;
  displayedColumns: string[] = [
    "medicinename",
    "quantityprescribed",
    "quantitydelivered",
    "frequency",
    "duration",
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
  availableMedicineList: string[] = [];
  userId: any;
  userRole: any;
  userType: any;

  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private patienService: PatientService
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
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
      this.getOrderDetails();
    });
  }

  getPatientDetails(patient_id: string) {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    this.pharmacyService.patientProfile(patient_id, insuranceNo).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
      }
    });
  }

  public getOrderDetails(): void {
    const orderDetailRequest = {
      for_portal_user: this.userId,
      for_order_id: this.order_id,
      portal_type: this.userType
    };
    this.patienService.fetchOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          console.log(">>>>>>>>>>>77",result);
          
          this.orderDetails = result.data;
          this.getPatientDetails(result.data.orderData.patient_details.user_id)
      
          result.data.testDetails.forEach((element) => {
            const available = element.available ? "yes" : "no";
            console.log("available===",available);
            
            const newRow = {
              name: element.name,
              prescribed: element.quantity_data.prescribed,
              delivered: 
                element.quantity_data.delivered || "",
              frequency: element.frequency,
              duration: element.duration,
              available
            };
            this.availableMedicineList.push(available);
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

  medicineAvailabilityChange(e: { value: string }, i: number) {
    this.availableMedicineList[i] = e.value;
  }
 

  gotoOrderList() {
    this.router.navigate([`/portals/availibility-request/${this.userType}`]);
  }  

}