import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { IUniqueId } from "src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import { map, Observable, startWith } from 'rxjs';
import { PatientService } from 'src/app/modules/patient/patient.service';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { Select2UpdateEvent } from "ng-select2-component";
import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';
import { FourPortalService } from '../../four-portal.service';

@Component({
  selector: 'app-availibility-details',
  templateUrl: './availibility-details.component.html',
  styleUrls: ['./availibility-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AvailibilityDetailsComponent implements OnInit {
  order_id: string = "";
  orderDetails = null;
  patient_details: any;
  health_plan_details: any
  portal_user_id: any;
  patient_id: any;
  overlay: false;
  displayedColumns: string[] = [
    "medicinename",
    "quantityprescribed",
    "quantitydelivered",
    "frequency",
    "duration",
    "priceperunit",
    "totalcost",
    "available",
    "action",
  ];
  dataSource: MatTableDataSource<AbstractControl>;
  public orderTest: FormGroup = new FormGroup({
    test_details: new FormArray([], []),
    total_cost: new FormControl("", []),
    copay: new FormControl("", []),
    insurance_paid: new FormControl("", []),
  });
  prescriptionUrl: string = "";
  prescriptionSignedUrl: string = "";
  filteredOptions!: Observable<any[]>;
  myControl = new FormControl('');
  testList: any = [];
  testName: string = "";
  iDObject: any = []
  testNameObject: any = []
  exludeTestAmount: any = {}
  newlistArray: any = {}
  availableTestList: string[] = [];
  @ViewChild("approved") approved: any;
  subscriberdetails: any;
  checkexclutiondata: any;
  checkexclutionDescription: any;
  checkpreAuthService: any;
  serviceObject: any;
  categoryObject: any;
  userId: any;
  userRole: any;
  userType: any;
  innerMenuPremission:any=[]

  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private _superAdminService: SuperAdminService,
    private patientService: PatientService,
    private fourPortalService: FourPortalService
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

  getPatientDetails() {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    this.pharmacyService.patientProfile(this.patient_id, insuranceNo).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
        this.health_plan_details = response?.body.health_plan_details;
        this.subscriberdetails = response?.body.health_plan_details?.resultData;

        if (this.orderDetails.testDetails.length > 0) {
          this.orderDetails.testDetails.forEach((element, index) => {
            this.testList.push([]);

            this.testNameObject.push([]);
            this.iDObject.push([]);
            const available = element.available ? "yes" : "no";
            const newRow: FormGroup = new FormGroup({
              testId: new FormControl("", []),
              categoryService: new FormControl("", []),
              serviceName: new FormControl("", []),
              name: new FormControl(element.name, []),
              prescribed: new FormControl(element.quantity_data.prescribed, []),
              delivered: new FormControl(
                element.quantity_data.delivered || "",
                []
              ),
              frequency: new FormControl(element.frequency, []),
              duration: new FormControl(element.duration, []),
              priceperunit: new FormControl(element.price_per_unit || "", []),
              totalcost: new FormControl(element.total_cost || "", []),
              request_amount: new FormControl(element.request_amount, []),
              co_payment: new FormControl(element.co_payment, []),
              available: new FormControl(available, []),
              action: new FormControl("", []),
            });
            this.availableTestList.push(available);
            (this.orderTest.get("test_details") as FormArray).push(
              newRow
            );

            if(this.userType === "Paramedical-Professions"){
              this.getLabList(element?.name, (this.orderTest.get("test_details") as FormArray).length - 1, element?.test_id, element?.service, element?.category);
        
            }else if(this.userType === "Dental"){
              this.getDentalList(element?.name, (this.orderTest.get("test_details") as FormArray).length - 1, element?.test_id, element?.service, element?.category);
        
            }else if(this.userType === "Optical"){
              this.getOpticalList(element?.name, (this.orderTest.get("test_details") as FormArray).length - 1, element?.test_id, element?.service, element?.category);
        
            } else if(this.userType === "Laboratory-Imaging"){
              this.getImagingList(element?.name, (this.orderTest.get("test_details") as FormArray).length - 1, element?.test_id, element?.service, element?.category);
        
            }

            // this.addNewTest();
          });
          this.orderTest
            .get("total_cost")
            .setValue(this.orderDetails.testBill.total_test_cost || "");
          this.orderTest
            .get("copay")
            .setValue(this.orderDetails.testBill.co_pay || "");
          this.orderTest
            .get("insurance_paid")
            .setValue(this.orderDetails.testBill.insurance_paid || "");
          if (this.orderDetails.testDetails.length === 0) {
          }

          this.dataSource = new MatTableDataSource(
            (this.orderTest.get("test_details") as FormArray).controls
          );
          this.dataSource.filterPredicate = (
            data: FormGroup,
            filter: string
          ) => {
            return Object.values(data.controls).some((x) => x.value == filter);
          };

        }
      }
    });
  }

  private getOrderField(...field: string[]) {
    return this.orderTest.get(field).value;
  }

  get testData(): FormArray {
    return this.orderTest.get("test_details") as FormArray;
  }

  addNewTest(testName: string = "", testId: string = "", serviceName: string = "", categoryService: string = "") {

    this.testList.push([]);

    this.testNameObject.push([]);
    this.iDObject.push([]);



    const newRow: FormGroup = new FormGroup({
      testId: new FormControl("", []),
      categoryService: new FormControl("", []),
      serviceName: new FormControl("", []),
      name: new FormControl("", []),
      prescribed: new FormControl("", []),
      delivered: new FormControl("", []),
      frequency: new FormControl("", []),
      duration: new FormControl("", []),
      priceperunit: new FormControl("", []),
      totalcost: new FormControl("", []),
      request_amount: new FormControl("", []),
      co_payment: new FormControl("", []),
      available: new FormControl("no", []),
      action: new FormControl("", []),
    });
    (this.orderTest.get("test_details") as FormArray).push(newRow);
    // this.availableTestList.push("no");
    this.dataSource = new MatTableDataSource(
      (this.orderTest.get("test_details") as FormArray).controls
    );
    console.log((this.orderTest.get("test_details") as FormArray).length);

    if(this.userType === "Paramedical-Professions"){
      this.getLabList(testName, (this.orderTest.get("test_details") as FormArray).length - 1, testId, serviceName, categoryService);

    }else if(this.userType === "Dental"){
      this.getDentalList(testName, (this.orderTest.get("test_details") as FormArray).length - 1, testId, serviceName, categoryService);

    }else if(this.userType === "Optical"){
      this.getOpticalList(testName, (this.orderTest.get("test_details") as FormArray).length - 1, testId, serviceName, categoryService);

    } else if(this.userType === "Laboratory-Imaging"){
      this.getImagingList(testName, (this.orderTest.get("test_details") as FormArray).length - 1, testId, serviceName, categoryService);

    }

  }
  removeTest(index: number) {
    (this.orderTest.get("test_details") as FormArray).removeAt(index);
    this.availableTestList.splice(index, 1);
    this.dataSource = new MatTableDataSource(
      (this.orderTest.get("test_details") as FormArray).controls
    );
  }

  ngOnInit(): void {  
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

   
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
      this.getOrderDetails();
    });
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this.coreService.getLocalStorage("loginData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)  
    
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("price-availibility")) {
          this.innerMenuPremission = checkSubmenu['price-availibility'].inner_menu;
          console.log(`exist in the object.`);
        } else {
          console.log(`does not exist in the object.`);
        }
      }else{
        var checkSubmenu = checkData.submenu;
        let innerMenu = [];
        for (let key in checkSubmenu) {
          innerMenu.push({name: checkSubmenu[key].name, slug: key, status: true});
        }
        this.innerMenuPremission = innerMenu;
        
      }
    }  
  }

  giveInnerPermission(value) {
    if (this.userRole === 'STAFF' || this.userRole === 'HOSPITAL_STAFF') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

/* *******************TEST_LIST***************** */

getLabList(query: any = "", index: any = 0, testId: string = "", serviceName: string = '', categoryService: string = '') {
  let param = {
    query: query,
  };
  this.patientService.getLabListDataWithoutPagination(param).subscribe(
    (res) => {
      let result = this.coreService.decryptObjectData({ data: res });
      console.log("result====",result);
      
      if(result.status)
      {
        
      const testArray = [];
      for (const lab of result.body.labtestArray
        ) {

        testArray.push({
          label: lab.lab_test,
          test_number: lab.number,
          value: lab._id,
        });
      }
      console.log(testArray,"testArray");

      if (testArray.length > 0) {
        this.testList[index] = testArray;
        if (testId != "") {
          this.iDObject[index] = testId;
          this.testNameObject[index] = query;
        }
        if (serviceName != "") {
          this.serviceObject[index] = serviceName;
        }
        if (categoryService != "") {
          this.categoryObject[index] = categoryService;
        }
      } else {
      }
    }
    else
    {
      this.testList=[];
    }
    },
    (err: ErrorEvent) => {
      console.log(err.message, "error");
    }
  );
}

getDentalList(query: any = "", index: any = 0, testId: string = "", serviceName: string = '', categoryService: string = '') {
  let param = {
    query: query,
  };
  this.patientService.getOthersListDataWithoutPagination(param).subscribe(
    (res) => {
      let result = this.coreService.decryptObjectData({ data: res });
      console.log("result====",result);
      
      if(result.status)
      {
        
      const testArray = [];
      for (const other of result.body.othersTestArray
        ) {

        testArray.push({
          label: other.others,
          test_number: other.number,
          value: other._id,
        });
      }
      console.log(testArray,"testArray");

      if (testArray.length > 0) {
        this.testList[index] = testArray;
        if (testId != "") {
          this.iDObject[index] = testId;
          this.testNameObject[index] = query;
        }
        if (serviceName != "") {
          this.serviceObject[index] = serviceName;
        }
        if (categoryService != "") {
          this.categoryObject[index] = categoryService;
        }
      } else {
      }
    }
    else
    {
      this.testList=[];
    }
    },
    (err: ErrorEvent) => {
      console.log(err.message, "error");
    }
  );
}


getOpticalList(query: any = "", index: any = 0, testId: string = "", serviceName: string = '', categoryService: string = '') {
  let param = {
    query: query,
  };
  this.patientService.getEyeglassesListDataWithoutPagination(param).subscribe(
    (res) => {
      let result = this.coreService.decryptObjectData({ data: res });
      console.log("result====",result);
      
      if(result.status)
      {
        
      const testArray = [];
      for (const eye of result.body.eyeTestArray
        ) {

        testArray.push({
          label: eye.eyeglass_name,
          test_number: eye.number,
          value: eye._id,
        });
      }
      console.log(testArray,"testArray");

      if (testArray.length > 0) {
        this.testList[index] = testArray;
        if (testId != "") {
          this.iDObject[index] = testId;
          this.testNameObject[index] = query;
        }
        if (serviceName != "") {
          this.serviceObject[index] = serviceName;
        }
        if (categoryService != "") {
          this.categoryObject[index] = categoryService;
        }
      } else {
      }
    }
    else
    {
      this.testList=[];
    }
    },
    (err: ErrorEvent) => {
      console.log(err.message, "error");
    }
  );
}


getImagingList(query: any = "", index: any = 0, testId: string = "", serviceName: string = '', categoryService: string = '') {
  let param = {
    query: query,
  };
  this.patientService.getIamgingListDataWithoutPagination(param).subscribe(
    (res) => {
      let result = this.coreService.decryptObjectData({ data: res });
      console.log("result====",result);
      
      if(result.status)
      {
        
      const testArray = [];
      for (const img of result.body.imagingArray
        ) {

        testArray.push({
          label: img.imaging,
          test_number: img.number,
          value: img._id,
        });
      }
      console.log(testArray,"testArray");

      if (testArray.length > 0) {
        this.testList[index] = testArray;
        if (testId != "") {
          this.iDObject[index] = testId;
          this.testNameObject[index] = query;
        }
        if (serviceName != "") {
          this.serviceObject[index] = serviceName;
        }
        if (categoryService != "") {
          this.categoryObject[index] = categoryService;
        }
      } else {
      }
    }
    else
    {
      this.testList=[];
    }
    },
    (err: ErrorEvent) => {
      console.log(err.message, "error");
    }
  );
}

  //Start medicine filter
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.testList.length > 0) {
      var result = this.testList
        .filter((option: any) => {
          return (
            option.test_name.toLowerCase().includes(filterValue)
          )
        })
      return (result != '') ? result : ['No data'];
    }
    return ['No data'];

  }
  // End medicine filter
  public updateMySelection(option: any, i: any) {
    this.iDObject[i] = option.test_id
    this.testNameObject[i] = option.test_name
  }
  //Add new medcine for the superadmin
  public handleAddMedicineClick(idx: any) {
    this.newlistArray[idx] = this.testName
    this.testNameObject[idx] = this.testName
    this.testList.push({ test_name: this.testName })
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    const value = this.getOrderField("test_details")[idx].totalcost
    if (this.health_plan_details) {
      if (value) {
        this.handleMedicineExclusionCost({ value }, idx)
      } else {
        this.handleMedicineExclusionCost({ value: 0 }, idx)
      }
    }
    if (this.orderTest.get("total_cost").value) {
      this.calculateCost({ value: this.orderTest.get("total_cost").value })
    }
  }

  public clearText() {
    this.testName = ''
  }

  public handleMedicineChange(target: any, index: any): void {
    if (target.value) {
      this.testName = target.value
      const value = this.getOrderField("test_details")[index].totalcost
      if (value && this.health_plan_details) {
        this.handleMedicineExclusionCost({ value }, index)
      }
    } else {
      this.newlistArray = []
      this.iDObject = {}
    }
  }

  handleMedicineExclusionCost(target: any, index: number): void {
    const testName = this.testNameObject[index]
    if (this.health_plan_details) {
      for (const exclusion of this.health_plan_details.planExclusion) {
        if (testName == exclusion.in_exclusion.exclusion_inn) {
          this.exludeTestAmount[index] = target.value
        } else {
          delete this.exludeTestAmount[index]
        }
      }
    }
  }

  //Calculate medicine cost based on medicines and insurance
  calculateCost(taget: any) {
    if (this.health_plan_details) {
      let reimbusment_rate = 0
      for (const planService of this.health_plan_details.planService) {
        if (planService?.has_category?.in_category.name === "Medical Product" && (planService?.has_category.name === "Classical Medicine" || planService?.has_category.name === "Medicine")) {
          reimbusment_rate = planService.reimbursment_rate;
        }
      }
      let totalAmount = 0
      let excludedAmount = 0
      if (Object.values(this.exludeTestAmount).length > 0) {
        const array = Object.values(this.exludeTestAmount)
        const sum: any = array.reduce((acc: any, cur: any) => acc + Number(cur), 0);
        excludedAmount = sum
        totalAmount = taget.value - sum;
      } else {
        totalAmount = taget.value
      }
      const calculateInsuranceAmount = totalAmount * reimbusment_rate / 100
      this.orderTest.controls['copay'].setValue(excludedAmount + totalAmount - calculateInsuranceAmount)
      this.orderTest.controls['insurance_paid'].setValue(calculateInsuranceAmount)
    } else {
      this.orderTest.controls['copay'].setValue(taget.value)
      this.orderTest.controls['insurance_paid'].setValue(0)
    }
    this.orderTest.controls['copay'].disable();
    this.orderTest.controls['insurance_paid'].disable();
  }

  //  Approved modal
  openVerticallyCenteredapproved(approved: any) {
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
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

  downloadPrescription() {
    for (const url of this.prescriptionSignedUrl) {
      window.open(url, '_blank')
    }
  }

  public getOrderDetails(): void {
    const orderDetailRequest = {
      for_portal_user: this.userId,
      for_order_id: this.order_id,
      portal_type: this.userType
    };

    this.patientService.fetchOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });


        if (result.status === true) {
          console.log("result.status", result);

          this.orderDetails = result.data;
          if (this.orderDetails.testBill.prescription_url.length > 0) {
            this.addNewTest()
          }
          this.patient_id = result?.data?.orderData?.patient_details?.user_id;
          this.getPatientDetails();
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>", this.orderDetails.testBill.prescription_url);

          if (this.orderDetails.testBill.prescription_url) {
            this.prescriptionSignedUrl = this.orderDetails.testBill.prescription_url;

            // this.documentMetaDataURL();
          }

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

 /* ***********************Test-List************************ */
 private addlabForSuperadmin() {
  return new Promise((resolve, reject) => {

    const labTestArray = [];
    for (const name of Object.values(this.newlistArray)) {
      labTestArray.push({

        category: "",
        lab_test: name,
        description: "",
        contributing_factors_to_abnormal_values:
          "",
        normal_value: {
          blood: "",
          urine: "",
        },
        possible_interpretation_of_abnormal_blood_value: {
          high_levels: "",
          low_levels: "",
        },
        possible_interpretation_of_abnormal_urine_value: {
          high_levels: "",
          low_levels: "",
        },
        blood_procedure: {
          before: "",
          during: "",
          after: "",
        },
        urine_procedure: {
          before: "",
          during: "",
          after: "",
        },

        clinical_warning: "",
        other: "",
        link: "",
        active: false,

      });
    }
    if (labTestArray.length > 0) {
      let added_by = {
        user_id: this.userId,
        user_type: this.userType,
      };

      let reqData = {
        labTestArray: labTestArray,
        added_by: added_by,
      };

      this._superAdminService.labAddTest(reqData).subscribe((res: any) => {
        let response = this.coreService.decryptObjectData({ data: res });         

        if (response.status) {
          for (const lab of response.data) {
            console.log(this.newlistArray, lab.lab_test);

            let index = this.coreService.getKeyByValue(
              this.newlistArray,
              lab.lab_test
            );
            console.log(index, "index");

            this.iDObject[index] = lab._id;
          }
          resolve(true);
        } else {
          // this.toastr.error("Somthing went wrong while adding medicine");
          resolve(false);
        }
      });
    }
  });
}
private addimagingForSuperadmin() {
  return new Promise((resolve, reject) => {

    const ImagingTestArray = [];
    for (const name of Object.values(this.newlistArray)) {
      ImagingTestArray.push({         
          imaging:name,
          category:"",     
          description:"",
          clinical_consideration:"",
          normal_values:"",
          abnormal_values:"",
          contributing_factors_to_abnormal:"",
          procedure: {
            before:"",
            during:"",
            after:"",
          },
          clinical_warning:"",
          contraindications:"",
          other:"",
          link:"",
          active: false,          
      });
    }
    if (ImagingTestArray.length > 0) {
      let added_by = {
        user_id: this.userId,
        user_type: this.userType,
      };

      let reqData = {
        ImagingTestArray: ImagingTestArray,
        added_by: added_by,
      };

      this._superAdminService.addImagingApi(reqData).subscribe((res: any) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log(response, 'added successfully');

        if (response.status) {
          for (const img of response.data) {              

            let index = this.coreService.getKeyByValue(
              this.newlistArray,
              img.imaging
            );
            console.log(index, "index");

            this.iDObject[index] = img._id;
          }
          resolve(true);
        } else {
          // this.toastr.error("Somthing went wrong while adding medicine");
          resolve(false);
        }
      });
    }
  });
}
private adddentalForSuperadmin() {
  return new Promise((resolve, reject) => {

    const OthersTestArray = [];
    for (const name of Object.values(this.newlistArray)) {
      OthersTestArray.push({

          category: "",
          others: name,
          description: "",
          clinical_consideration: "",
          normal_values: "",
          abnormal_values: "",
          contributing_factors_to_abnormal: "",
          procedure: {
            before: "",
            during:"",
            after: "",
          },
          clinical_warning: "",
          contraindications: "",
          other: "",
          link: "",           
          active: false,
        
      });
    }
    if (OthersTestArray.length > 0) {
      let added_by = {
        user_id: this.userId,
        user_type: this.userType,
      };

      let reqData = {
        OthersTestArray: OthersTestArray,
        added_by: added_by,
      };

      this._superAdminService.addOthersApi(reqData).subscribe((res: any) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log(response, 'added successfully');

        if (response.status) {
          for (const img of response.data) {              

            let index = this.coreService.getKeyByValue(
              this.newlistArray,
              img.imaging
            );
            console.log(index, "index");

            this.iDObject[index] = img._id;
          }
          resolve(true);
        } else {
          // this.toastr.error("Somthing went wrong while adding medicine");
          resolve(false);
        }
      });
    }
  });
}
private addOpticalForSuperadmin() {
  return new Promise((resolve, reject) => {

    const eyeglassData = [];
    for (const name of Object.values(this.newlistArray)) {
      eyeglassData.push({
        eyeglass_name:name,        
          status: false,          
      });
    }
    if (eyeglassData.length > 0) {
      let added_by = {
        user_id: this.userId,
        user_type: this.userType,
      };

      let reqData = {
        eyeglassData: eyeglassData,
        added_by: added_by,
      };

      this._superAdminService.addEyeglassessApi(reqData).subscribe((res: any) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log(response, 'added successfully');

        if (response.status) {
          for (const img of response.data) {              

            let index = this.coreService.getKeyByValue(
              this.newlistArray,
              img.imaging
            );
            console.log(index, "index");

            this.iDObject[index] = img._id;
          }
          resolve(true);
        } else {
          // this.toastr.error("Somthing went wrong while adding medicine");
          resolve(false);
        }
      });
    }
  });
}

  testAvailabilityChange(e: { value: string }, i: number) {
    this.availableTestList[i] = e.value;
  }

  async updateOrderData() {
    if (Object.values(this.newlistArray).length > 0) {
      if(this.userType === "Paramedical-Professions"){
        const addlab = await this.addlabForSuperadmin();
      }else if(this.userType === "Dental"){
        const addlab = await this.adddentalForSuperadmin();
      }else if(this.userType === "Optical"){
        const addeye = await this.addOpticalForSuperadmin();
      }else if(this.userType === "Laboratory-Imaging"){
        const addimg = await this.addimagingForSuperadmin();
      }
    }
    if (Object.values(this.iDObject).length <= 0 || !this.getOrderField("test_details")[0].delivered || !this.getOrderField("test_details")[0].totalcost) {
      this.coreService.showError("", 'Please add at least one test.');
      return
    }
    console.log("this.testNameObject", this.testNameObject);

    const orderDetailRequest = {
      for_portal_user: sessionStorage.getItem("portal-user-id"),
      for_order_id: this.order_id,
      in_ordertest_bill: this.orderDetails.testBill._id,
      test_bill: {
        co_pay: this.getOrderField("copay"),
        total_test_cost: this.getOrderField("total_cost"),
        insurance_paid: this.getOrderField("insurance_paid"),
      },
      test_details: this.getOrderField("test_details").map((data, index) => (
        {
          name: this.testNameObject[index],
          test_id: this.iDObject[index],
          quantity_data: {
            prescribed: data.prescribed,
            delivered: data.delivered,
          },
          frequency: data.frequency,
          duration: data.duration,
          price_per_unit: data.priceperunit,
          total_cost: data.totalcost,
          available: data.available === "yes",
        }

      )),
      request_type: this.orderDetails.orderData.request_type,
      status: "accepted",
      portal_type:this.userType

    };
    console.log("orderDetailRequest-------------", orderDetailRequest);


    this.fourPortalService.updateOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Updated order details successfully");
        if (result.status === true) {
          console.log(result, "resultdatatatatatatatatt");

          this.openVerticallyCenteredapproved(this.approved);
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

 

  gotoOrderList() {
    this.modalService.dismissAll('close');
    this.router.navigate([`/portals/availibility-request/${this.userType}`]);
  }



  update(key: string, event: Select2UpdateEvent<any>, index: any) {
    if (event.component.option != null) {
      this.testNameObject[index] = event.options[0].label;
      this.iDObject[index] = event.options[0].value;

      let excReimburmentRate = 1;

    }
  }
  selectKeyPressValue: any = [];

  onKeypressEvent(event: any, index: number) {
    console.log("event------------ >0", event.key);

    if (event.key != "Backspace") {
      this.selectKeyPressValue[index] += event.key;


      if(this.userType === "Paramedical-Professions"){
        this.getLabList(this.selectKeyPressValue[index], index);
  
      }else if(this.userType === "Dental"){
        this.getDentalList(this.selectKeyPressValue[index], index);
  
      }else if(this.userType === "Optical"){
        this.getOpticalList(this.selectKeyPressValue[index], index);
  
      } else if(this.userType === "Laboratory-Imaging"){
        this.getImagingList(this.selectKeyPressValue[index], index);  
      }
    }
  }
  onKeyDownEvent(event: any, index: number) {
    console.log("event", event);

    if (event.key == "Backspace") {
      this.selectKeyPressValue[index] = this.selectKeyPressValue[
        index
      ].substring(0, this.selectKeyPressValue[index].length - 1);
      console.log("onKeypressEvent", this.selectKeyPressValue[index]);

      if(this.userType === "Paramedical-Professions"){
        this.getLabList(this.selectKeyPressValue[index], index);
  
      }else if(this.userType === "Dental"){
        this.getDentalList(this.selectKeyPressValue[index], index);
  
      }else if(this.userType === "Optical"){
        this.getOpticalList(this.selectKeyPressValue[index], index);
  
      } else if(this.userType === "Laboratory-Imaging"){
        this.getImagingList(this.selectKeyPressValue[index], index);  
      }
    }
  }
  reimbursmentRate: any = [];

  async calCulatePrice(event: any, i: number) {

    let excReimburmentRate = 1;
    let reqAmt = 0;


    console.log(excReimburmentRate, "excReimburmentRate");

    let prcPerunit = this.getOrderField("test_details")[i].priceperunit;
    let qtyDeliver = this.getOrderField("test_details")[i].delivered;
    console.log("copay", prcPerunit, qtyDeliver);

    let totalCost = prcPerunit * qtyDeliver;
    console.log("copay", totalCost);

    if (excReimburmentRate == 1) {
      console.log(this.reimbursmentRate[i]);
      if (this.reimbursmentRate[i] != undefined) {
        reqAmt = (this.reimbursmentRate[i] / 100) * totalCost;
      }
    } else {
      reqAmt = (excReimburmentRate / 100) * totalCost;
    }



    let copay = totalCost - reqAmt;

    console.log("totalCost", totalCost);
    console.log("copay", copay);
    console.log("reqAmt", reqAmt);

    await this.testData.controls[i].patchValue({
      totalcost: totalCost.toFixed(2),
      co_payment: copay.toFixed(2),
      request_amount: reqAmt.toFixed(2),
    });

    this.onValueChnage();
  }
  onValueChnage() {
    let total_co_payment: any = 0;
    let total_request_amount: any = 0;
    let total_cost: any = 0;

    this.orderTest.value.test_details.forEach((element) => {
      total_co_payment =
        parseFloat(total_co_payment) + parseFloat(element?.co_payment);
      total_request_amount =
        parseFloat(total_request_amount) + parseFloat(element?.request_amount);

      total_cost = parseFloat(total_cost) + parseFloat(element?.totalcost);
    }
    );

    this.orderTest.patchValue({
      copay: total_co_payment.toFixed(2),
      insurance_paid: total_request_amount.toFixed(2),
      total_cost: total_cost.toFixed(2),
    });



  }

  search(key: string, event: any) {
    console.log(key, event);
  }

  confirmamount(Confirmmodel: any) {
    this.modalService.open(Confirmmodel, {
      centered: true,
      size: "md",
      windowClass: "Confirmmodel_data",
    });
  }

  handleClose() {
    this.modalService.dismissAll("close");
  }
}