import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { map, Observable, startWith } from "rxjs";
import { IUniqueId } from "src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type";
import { PatientService } from "src/app/modules/patient/patient.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { IResponse } from "src/app/shared/classes/api-response";
import { CoreService } from "src/app/shared/core.service";
import { Select2UpdateEvent } from "ng-select2-component";
import { PharmacyService } from "src/app/modules/pharmacy/pharmacy.service";
import { FourPortalService } from "../../four-portal.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { PharmacyPlanService } from "src/app/modules/pharmacy/pharmacy-plan.service";

@Component({
  selector: 'app-new-order-details',
  templateUrl: './new-order-details.component.html',
  styleUrls: ['./new-order-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewOrderDetailsComponent implements OnInit {
  order_id: string = "";
  orderDetails = null;
  patient_details: any;
  health_plan_details: any
  portal_user_id: any;
  patient_id: any;
  subscriberdetails: any;
  displayedColumns: string[] = [
    "medicinename",
    "category",
    "service",
    "quantityprescribed",
    "quantitydelivered",
    "frequency",
    "duration",
    "priceperunit",
    "comment",
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
  prescriptionUrl: Array<string> = [];
  filteredOptions!: Observable<any[]>;
  myControl = new FormControl('');
  testList: any = [];
  testName: string = "";
  prescriptionSignedUrl: string = "";
  iDObject: any = [];
  testNameObject: any = [];
  exludeMedicineAmount: any = {}
  newTestArray: any = {}
  availableTestList: string[] = [];
  @ViewChild("approved") approved: any;
  insuranceDetails: any;
  selectKeyPressValue: any = [];
  checkexclutiondata: any = [];
  overlay: false;
  checkexclutionDescription: any = [];
  checkpreAuthService: any = [];
  categoryObject: any = [];
  serviceObject: any = [];
  categoryData: any;
  planService: any = [];
  serviceArray: any = [];
  pre_authArray: any = [];
  reimbursmentRate: any = [];
  categoryList: any = [];
  subscriber_id: any;
  userRole: any;
  userType: any;
  innerMenuPremission:any=[];
  
  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private patientService: PatientService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private pharmacyPlanService: PharmacyPlanService,
    private _superAdminService: SuperAdminService,
    private fourPortalService: FourPortalService,
    private loader:NgxUiLoaderService
  ) {
    let userData = this.coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userType = userData?.type

    this.userRole = userData?.role;
    if(this.userRole === 'STAFF'){
      this.portal_user_id = adminData.creatorId;

    }else{
      this.portal_user_id = userData._id;

    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["orderId"];
    });
    this.getOrderDetails();
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
    console.log("checkData________",checkData);
    
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("order-request")) {
          this.innerMenuPremission = checkSubmenu['order-request'].inner_menu;
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

  getCategoryId(event: Select2UpdateEvent<any>, index) {
    if (event.component.option != null) {
      this.categoryObject[index] = event.options[0].label;
      this.serviceArray = [];
      if (this.health_plan_details?.planService.length > 0) {
        this.health_plan_details.planService.forEach((data) => {

          if (data.has_category.toLowerCase() == event.value.toLowerCase()) {

            this.serviceArray.push({
              label: data.service.toLowerCase(),
              value: data.service.toLowerCase(),
            })
          }
        })
      }
    }
  }

  getPatientDetails() {
    const insuranceNo = this.orderDetails.orderData.insurance_no
    const subscriber_id = this.orderDetails.orderData.subscriber_id
    this.pharmacyService.patientProfile(this.patient_id, insuranceNo, subscriber_id).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.patient_details = response?.body.profileData;
        this.health_plan_details = response?.body.health_plan_details;

        this.subscriberdetails = response?.body.health_plan_details?.resultData;

        if (this.subscriber_id !== null) {
          this.checkInsuranceExpiry();

        }
        this.checkAgreementWithInsurance();
       
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
      subscriber_id:
        this.orderDetails?.orderData?.subscriber_id
    };
    this.pharmacyService.checkSubscriptionExpiry(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.insuranceDetails = response.body;
    });
  }
 

  private getOrderField(...field: string[]) {
    return this.orderTest.get(field).value;
  }

  get testData(): FormArray {
    return this.orderTest.get("test_details") as FormArray;
  }
  update(key: string, event: Select2UpdateEvent<any>, index: any) {
    if (event.component.option != null) {
      this.testNameObject[index] = event.options[0].label;
      this.iDObject[index] = event.options[0].value;

      let excReimburmentRate = 1;

      this.health_plan_details?.planExclusion?.forEach((element, index1) => {
        const result =
          event.options[0].label.indexOf(element?.in_exclusion.name) == -1
            ? false
            : true;

        if (result) {
          excReimburmentRate = 0;
          return;
        }
      });

      if (excReimburmentRate == 0) {
        this.checkexclutiondata[index] = "1";
      } else {
        this.checkexclutiondata[index] = "";
      }
    }
  }

  search(key: string, event: any) {
  }

  onKeypressEvent(event: any, index: number) {
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
    if (event.key == "Backspace") {
      this.selectKeyPressValue[index] = this.selectKeyPressValue[
        index
      ].substring(0, this.selectKeyPressValue[index].length - 1);
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
  getSeriviceName(event, i) {
    // this.selectedservice = event.value;
    if (event.component.option != null) {
      this.serviceObject[i] = event.options[0].label;

      this.health_plan_details?.planService.forEach((element) => {

        if (element?.service.toLowerCase() === event.value.toLowerCase()) {
          this.pre_authArray[i] = (element.pre_authorization);
          this.reimbursmentRate[i] = element.reimbursment_rate;
          this.checkexclutionDescription[i] = element.comment;
          if (element.pre_authorization) {
            this.checkpreAuthService[i] = "This service required pre-authorization";
          } else {
            this.checkpreAuthService[i] = "";
          }


          return;
        }
      });
    }
  }

  async calCulatePrice(event: any, i: number) {

    let excReimburmentRate = 1;
    let reqAmt = 0;

    this.health_plan_details?.planExclusion?.forEach((element) => {


      const result =
        this.testNameObject[i]?.indexOf(element.in_exclusion.name) == -1
          ? false
          : true;

      if (result) {
        excReimburmentRate = 0;
        return;
      }
    });


    let prcPerunit = this.getOrderField("test_details")[i].priceperunit;
    let qtyDeliver = this.getOrderField("test_details")[i].delivered;

    let totalCost = prcPerunit * qtyDeliver;

    if (excReimburmentRate == 1) {
      if (this.reimbursmentRate[i] != undefined) {
        reqAmt = (this.reimbursmentRate[i] / 100) * totalCost;
      }
    } else {
      reqAmt = (excReimburmentRate / 100) * totalCost;
    }



    let copay = totalCost - reqAmt;



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
  public clearText() {
    this.testName = ''
  }

  public handleTestChange(target: any, index: any): void {
    if (target.value) {
      this.testName = target.value
    } else {
      delete this.newTestArray[index]
      delete this.testNameObject[index]
      delete this.iDObject[index]
    }
  }

  addNewTest(testName: string = "", testId: string = "", serviceName: string = "", categoryService: string = "") {

    this.testList.push([]);
    this.selectKeyPressValue.push("");
    this.checkexclutiondata.push("");
    this.checkexclutionDescription.push("");
    this.checkpreAuthService.push("");
    this.testNameObject.push([]);
    this.iDObject.push([]);
    this.serviceObject.push([]);
    this.categoryObject.push([]);


    const newRow: FormGroup = new FormGroup({
      testId: new FormControl("", []),
      categoryService: new FormControl("", [Validators.required]),
      serviceName: new FormControl("", [Validators.required]),
      name: new FormControl("", []),
      prescribed: new FormControl("", []),
      delivered: new FormControl("", []),
      frequency: new FormControl("", []),
      duration: new FormControl("", []),
      priceperunit: new FormControl("", []),
      comment: new FormControl("", []),
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
  getPortalTypeAndInsuranceId(insuranceId:any) {

    let data = {
      insuranceId: insuranceId,
      portalType: this.userType,

    };
    if (this.subscriberdetails?.for_user?.for_portal_user != null) {
      this.pharmacyService.getPortalTypeAndInsuranceId(data).subscribe({
        next: (res) => {

          let encryptedData = { data: res };
          let result = this.coreService.decryptObjectData(encryptedData);
          
          this.categoryData = result.body.result[0].categoryName;
          console.log("result____________",this.categoryData);

          this.categoryData.map((curentval: any) => {
            let checkCategoryData = this.categoryList.filter(obj => obj.lebel == curentval && obj.value == curentval);
            if (checkCategoryData.length == 0) {
              this.categoryList.push({
                label: curentval,
                value: curentval,
              });
            }


          });




        },
        error: (err: ErrorEvent) => {
          this.coreService.showError("", err.message);
        },
      });
    }

  }
  removeTest(index: number) {
    (this.orderTest.get("test_details") as FormArray).removeAt(index);
    this.availableTestList.splice(index, 1);
    this.dataSource = new MatTableDataSource(
      (this.orderTest.get("test_details") as FormArray).controls
    );
  }

  //  Approved modal
  openVerticallyCenteredapproved(approved: any) {
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
    });
  }

  public getOrderDetails(): void {
    const orderDetailRequest = {
      for_portal_user: this.portal_user_id,
      for_order_id: this.order_id,
      portal_type: this.userType
    };
    this.patientService.fetchOrderDetailsallPortal(orderDetailRequest).subscribe({
      next: (result) => {
        let response = this.coreService.decryptObjectData({ data: result });
console.log("response_____________",response);

        if (response.status === true) {
          this.orderDetails = response.data;
          this.subscriber_id = response?.data?.orderData?.subscriber_id

          if (this.orderDetails.testBill.prescription_url.length > 0) {
            this.addNewTest()
          }
          this.patient_id = response?.data?.orderData?.patient_details?.user_id;
          this.getPatientDetails();
          if (this.orderDetails.testBill.prescription_url) {
            this.prescriptionSignedUrl = this.orderDetails.testBill.prescription_url;
            // this.documentMetaDataURL();
          }
          if (this.orderDetails.testDetails.length > 0) {
            this.orderDetails.testDetails.forEach((element, index) => {
              console.log(element, "elementcheck ");

              this.testList.push([]);
              this.selectKeyPressValue.push("");
              this.checkexclutiondata.push("");
              this.checkexclutionDescription.push("");
              this.checkpreAuthService.push("");
              this.testNameObject.push([]);
              this.iDObject.push([]);
              this.serviceObject.push([]);
              this.categoryObject.push([]);
              const available = element.available ? "yes" : "no";
              const newRow: FormGroup = new FormGroup({
                testId: new FormControl("", []),
                categoryService: new FormControl("", [Validators.required]),
                serviceName: new FormControl("", [Validators.required]),
                name: new FormControl("", []),
                prescribed: new FormControl(element.quantity_data.prescribed, []),
                delivered: new FormControl(
                  element.quantity_data.delivered || "",
                  []
                ),
                frequency: new FormControl(element.frequency, []),
                duration: new FormControl(element.duration, []),
                priceperunit: new FormControl(element.price_per_unit || "", []),
                comment: new FormControl(element["comment"] || "", []),
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

/* ***********************Test-List************************ */
private addlabForSuperadmin() {
  return new Promise((resolve, reject) => {

    const labTestArray = [];
    for (const name of Object.values(this.newTestArray)) {
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
        user_id: this.portal_user_id,
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
            console.log(this.newTestArray, lab.lab_test);

            let index = this.coreService.getKeyByValue(
              this.newTestArray,
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
    for (const name of Object.values(this.newTestArray)) {
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
        user_id: this.portal_user_id,
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
              this.newTestArray,
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
    for (const name of Object.values(this.newTestArray)) {
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
        user_id: this.portal_user_id,
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
              this.newTestArray,
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
    for (const name of Object.values(this.newTestArray)) {
      eyeglassData.push({
        eyeglass_name:name,        
          status: false,          
      });
    }
    if (eyeglassData.length > 0) {
      let added_by = {
        user_id: this.portal_user_id,
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
              this.newTestArray,
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


  async updateOrderData() {

    if (Object.values(this.newTestArray).length > 0) {
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
    if (Object.values(this.iDObject).length <= 0) {
      this.coreService.showError("", 'Please add at least one test.');
      return
    }
    if (this.getOrderField("total_cost") == 0) {
      this.coreService.showError("", 'Please add test cost');
      return
    }
    if (this.subscriber_id == null) {
      this.loader.start();
      const orderDetailRequest = {
        for_portal_user: this.portal_user_id,
        for_order_id: this.order_id,
        in_ordertest_bill: this.orderDetails.testBill._id,
        test_bill: {
          co_pay: this.getOrderField("copay"),
          total_test_cost: this.getOrderField("total_cost"),
          insurance_paid: this.getOrderField("insurance_paid"),
        },

        test_details: this.getOrderField("test_details").map((data, index) => ({
          service: "",
          category: "",
          name: this.testNameObject[index],
          test_id: this.iDObject[index],
          quantity_data: {
            prescribed: data.prescribed,
            delivered: data.delivered,
          },
          frequency: data.frequency,
          duration: data.duration,
          price_per_unit: data.priceperunit,
          comment: data.comment,
          total_cost: data.totalcost,
          co_payment: data.co_payment,
          request_amount: data.request_amount,
          available: data.available === "yes",
        })),
        request_type: this.orderDetails.orderData.request_type,
        status: "accepted",
        portal_type:this.userType

      };
      this.fourPortalService.updateOrderDetailsallPortal(orderDetailRequest).subscribe({
        next: (result) => {
          let encryptedData = { data: result };
          let result1 = this.coreService.decryptObjectData(encryptedData);
          // this.coreService.showSuccess("", "Updated order details successfully");
          if (result1.status === true) {
            this.loader.stop();
            this.openVerticallyCenteredapproved(this.approved);
          }
        },
        error: (err: ErrorEvent) => {
          this.coreService.showError("", err.message);
          this.loader.stop();
          // if (err.message === "INTERNAL_SERVER_ERROR") {
          //   this.coreService.showError("", err.message);
          // }
        },
      });
    } else {
      console.log(this.serviceObject.length,"this.serviceObject_______",this.categoryObject.length);
      
      if(this.serviceObject.length === 0 ||this.categoryObject.length === 0 ){
        this.modalService.dismissAll("close");
        this.coreService.showInfo("", "Please contact to Insurance Company to add Category services.")
        return;
      }
      const orderDetailRequest = {
        for_portal_user: this.portal_user_id,
        for_order_id: this.order_id,
        in_ordertest_bill: this.orderDetails.testBill._id,
        test_bill: {
          co_pay: this.getOrderField("copay"),
          total_test_cost: this.getOrderField("total_cost"),
          insurance_paid: this.getOrderField("insurance_paid"),
        },

      
        test_details: this.getOrderField("test_details").map((data, index) => ({
          
          service: this.serviceObject[index] ,
          category: this.categoryObject[index] ,
          name: this.testNameObject[index],
          test_id: this.iDObject[index],
          quantity_data: {
            prescribed: data.prescribed,
            delivered: data.delivered,
          },
          frequency: data.frequency,
          duration: data.duration,
          price_per_unit: data.priceperunit,
          comment: data.comment,
          total_cost: data.totalcost,
          co_payment: data.co_payment,
          request_amount: data.request_amount,
          available: data.available === "yes",
        })),
        request_type: this.orderDetails.orderData.request_type,
        status: "accepted",
        portal_type:this.userType

      };
      console.log("orderDetailRequest_____________",orderDetailRequest);
      
      this.loader.start();
 
      this.fourPortalService.updateOrderDetailsallPortal(orderDetailRequest).subscribe({
        next: (result) => {
          let encryptedData = { data: result };
          let result1 = this.coreService.decryptObjectData(encryptedData);
          // this.coreService.showSuccess("", "Updated order details successfully");
          if (result1.status === true) {
            this.loader.stop();
            this.openVerticallyCenteredapproved(this.approved);
          }
        },
        error: (err: ErrorEvent) => {
          this.coreService.showError("", err.message);
          this.loader.stop();
          // if (err.message === "INTERNAL_SERVER_ERROR") {
          //   this.coreService.showError("", err.message);
          // }
        },
      });
    }



  }
  confirmamount(Confirmmodel: any) {
    this.modalService.open(Confirmmodel, {
      centered: true,
      size: "md",
      windowClass: "Confirmmodel_data",
    });
  }
  downloadPrescription() {

    for (const url of this.prescriptionSignedUrl) {
      window.open(url, '_blank')
    }
  }


  checkExcludeMedicine(index: any) {
    return index in this.exludeMedicineAmount
  }


  gotoOrderList() {
    this.modalService.dismissAll("close");
    this.router.navigate([`/portals/order-request/${this.userType}`]);
  }
  handleClose() {
    this.modalService.dismissAll("close");
  }

  cancelOrder() {
    const orderRequest = {
      _id: this.orderDetails.orderData._id,
      status: "cancelled",
      cancelled_by: this.userType,
      for_portal_user: this.portal_user_id,
      portal_type: this.userType
    };
    this.fourPortalService.cancelOrderFourPortal(orderRequest).subscribe({
      next: (result1) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "order details confirmed successfully");
        if (result.status === true) {
          this.gotoOrderList();
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

  checkAgreementWithInsurance() {
    this.categoryList = [];
    let data = {
      portal_id: this.portal_user_id,
     
    };
   
      this.pharmacyPlanService.getInsuranceAcceptedListForFourPortal(data).subscribe({
        next: (res) => {

          let encryptedData = { data: res };
          let result = this.coreService.decryptObjectData(encryptedData);
          console.log(this.subscriberdetails?.for_user?.for_portal_user,"result____________",result);
          
          if (result.status === true) {
            const matchingRecord = result.body.find(ele => ele.for_portal_user === this.subscriberdetails?.for_user?.for_portal_user);            
           
           if(this.subscriberdetails?.for_user?.for_portal_user !== undefined){

             if (matchingRecord) {
               console.log("result____________",matchingRecord);
               
               this.getPortalTypeAndInsuranceId(matchingRecord.for_portal_user)
           } else {
            console.log("categoryObject___________",this.categoryObject.length);
            this.serviceObject = this.serviceObject.length > 0 ? " ":''
            this.categoryObject =  this.categoryObject.length > 0 ? " ":''
               this.coreService.showInfo("", "You don't have an agreement with the patient's health plan insurance company. The patient have to pay the full fees.");
           }
           }
        }
        
          

        },
        error: (err: ErrorEvent) => {
          this.coreService.showError("", err.message);
        },
      });
    

  }
 
}

