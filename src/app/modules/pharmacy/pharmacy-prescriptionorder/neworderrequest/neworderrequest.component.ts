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
import { PharmacyService } from "../../pharmacy.service";
import {
  IDocumentMetaDataResponse,
  IMedicineUpdateResponse,
  IOrderCancelResponse,
  IOrderConfimRequest,
  IOrderDetailsRequest,
  IOrderDetailsResponse,
  IOrderUpdateRequest,
  ISignedUrlRequest,
} from "../neworder/neworder.type";
import { Select2UpdateEvent } from "ng-select2-component";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-neworderrequest",
  templateUrl: "./neworderrequest.component.html",
  styleUrls: ["./neworderrequest.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class NeworderrequestComponent implements OnInit {
  order_id: string = "";
  orderDetails: IOrderDetailsResponse = null;
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
  public orderMedicine: FormGroup = new FormGroup({
    medicine_details: new FormArray([], []),
    total_cost: new FormControl("", []),
    copay: new FormControl("", []),
    insurance_paid: new FormControl("", []),
  });
  prescriptionUrl: Array<string> = [];
  filteredOptions!: Observable<any[]>;
  myControl = new FormControl('');
  medicineList: any = [];
  medicineName: string = "";
  prescriptionSignedUrl: string = "";
  medicineIDObject: any = [];
  medicineNameObject: any = [];
  exludeMedicineAmount: any = {}
  newMedicineArray: any = {}
  availableMedicineList: string[] = [];
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
  userPermission: any;
  userRole: any;
  innerMenuPremission:any=[];
  constructor(
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private patientService: PatientService,
    private coreService: CoreService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private _superAdminService: SuperAdminService,
    private loader: NgxUiLoaderService

  ) {
    let portalUser = this.coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    this.userPermission =portalUser.permissions;

    this.userRole = portalUser.role;
    if(this.userRole === "PHARMACY_STAFF"){
      this.portal_user_id = adminData?.for_staff;
    }else{
      this.portal_user_id = portalUser._id;

    }
  }

  ngOnInit(): void {





    // this.getMedicineList();
    //Start medicine filter


    //end medicine filter
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
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(this.userPermission, "parent_id",menuID)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;     
        if (checkSubmenu.hasOwnProperty("order_request")) {
          this.innerMenuPremission = checkSubmenu['order_request'].inner_menu;  
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
        console.log("innerMenuPremission________",this.innerMenuPremission);
        
      }    
    }     
  }

  giveInnerPermission(value){   
    if(this.userRole === "PHARMACY_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
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

        this.getPortalTypeAndInsuranceId();

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
  // patient_id(patient_id: any) {
  //   throw new Error("Method not implemented.");
  // }

  private getOrderField(...field: string[]) {
    return this.orderMedicine.get(field).value;
  }

  get medicineData(): FormArray {
    return this.orderMedicine.get("medicine_details") as FormArray;
  }
  update(key: string, event: Select2UpdateEvent<any>, index: any) {
    if (event.component.option != null) {
      this.medicineNameObject[index] = event.options[0].label;
      this.medicineIDObject[index] = event.options[0].value;

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


      this.getMedicineList(this.selectKeyPressValue[index], index);
    }
  }
  onKeyDownEvent(event: any, index: number) {
    if (event.key == "Backspace") {
      this.selectKeyPressValue[index] = this.selectKeyPressValue[
        index
      ].substring(0, this.selectKeyPressValue[index].length - 1);
      this.getMedicineList(this.selectKeyPressValue[index], index);
    }
  }
  getMedicineList(query: any = "", index: any = 0, medicneId: string = "", serviceName: string = '', categoryService: string = '') {
    let param = {
      query: query,
    };
    this.patientService.getmedicineListWithParam(param).subscribe(
      (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        if (result.status) {

          const medicineArray = [];
          for (const medicine of result.body.medicneArray) {

            medicineArray.push({
              label: medicine.medicine_name,
              medicine_number: medicine.number,
              value: medicine._id,
            });
          }

          if (medicineArray.length > 0) {
            this.medicineList[index] = medicineArray;
            if (medicneId != "") {
              this.medicineIDObject[index] = medicneId;
              this.medicineNameObject[index] = query;
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
        else {
          this.medicineList = [];
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

    if (this.medicineList.length > 0) {
      var result = this.medicineList
        .filter((option: any) => {
          return (
            option.medicine_name.toLowerCase().includes(filterValue)
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
        this.medicineNameObject[i]?.indexOf(element.in_exclusion.name) == -1
          ? false
          : true;

      if (result) {
        excReimburmentRate = 0;
        return;
      }
    });


    let prcPerunit = this.getOrderField("medicine_details")[i].priceperunit;
    let qtyDeliver = this.getOrderField("medicine_details")[i].delivered;

    let totalCost = prcPerunit * qtyDeliver;

    if (excReimburmentRate == 1) {
      if (this.reimbursmentRate[i] != undefined) {
        reqAmt = (this.reimbursmentRate[i] / 100) * totalCost;
      }
    } else {
      reqAmt = (excReimburmentRate / 100) * totalCost;
    }



    let copay = totalCost - reqAmt;



    await this.medicineData.controls[i].patchValue({
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

    this.orderMedicine.value.medicine_details.forEach((element) => {
      total_co_payment =
        parseFloat(total_co_payment) + parseFloat(element?.co_payment);
      total_request_amount =
        parseFloat(total_request_amount) + parseFloat(element?.request_amount);

      total_cost = parseFloat(total_cost) + parseFloat(element?.totalcost);
    }
    );

    this.orderMedicine.patchValue({
      copay: total_co_payment.toFixed(2),
      insurance_paid: total_request_amount.toFixed(2),
      total_cost: total_cost.toFixed(2),
    });



  }
  public clearText() {
    this.medicineName = ''
  }

  public handleMedicineChange(target: any, index: any): void {
    if (target.value) {
      this.medicineName = target.value
    } else {
      delete this.newMedicineArray[index]
      delete this.medicineNameObject[index]
      delete this.medicineIDObject[index]
    }
  }

  addNewMedicine(medicineName: string = "", medicineId: string = "", serviceName: string = "", categoryService: string = "") {

    this.medicineList.push([]);
    this.selectKeyPressValue.push("");
    this.checkexclutiondata.push("");
    this.checkexclutionDescription.push("");
    this.checkpreAuthService.push("");
    this.medicineNameObject.push([]);
    this.medicineIDObject.push([]);
    this.serviceObject.push([]);
    this.categoryObject.push([]);


    const newRow: FormGroup = new FormGroup({
      medicineId: new FormControl("", []),
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
    (this.orderMedicine.get("medicine_details") as FormArray).push(newRow);
    // this.availableMedicineList.push("no");
    this.dataSource = new MatTableDataSource(
      (this.orderMedicine.get("medicine_details") as FormArray).controls
    );

    this.getMedicineList(medicineName, (this.orderMedicine.get("medicine_details") as FormArray).length - 1, medicineId, serviceName, categoryService);

  }
  getPortalTypeAndInsuranceId() {

    let data = {
      insuranceId: this.subscriberdetails?.for_user?.for_portal_user,
      portalType: "Pharmacy",
    };
    if (this.subscriberdetails?.for_user?.for_portal_user != null) {
      this.pharmacyService.getPortalTypeAndInsuranceId(data).subscribe({
        next: (res) => {

          let encryptedData = { data: res };
          let result = this.coreService.decryptObjectData(encryptedData);

          this.categoryData = result.body.result[0].categoryName;

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
  removemedicine(index: number) {
    (this.orderMedicine.get("medicine_details") as FormArray).removeAt(index);
    this.availableMedicineList.splice(index, 1);
    this.dataSource = new MatTableDataSource(
      (this.orderMedicine.get("medicine_details") as FormArray).controls
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
    const orderDetailRequest: IOrderDetailsRequest = {
      for_portal_user: this.portal_user_id,
      for_order_id: this.order_id,
    };
    this.pharmacyService.getOrderDetails(orderDetailRequest).subscribe({
      next: (result: IResponse<IOrderDetailsResponse>) => {
        let response = this.coreService.decryptObjectData({ data: result });

        if (response.status === true) {
          this.orderDetails = response.data;
          this.subscriber_id = response?.data?.orderData?.subscriber_id

          if (this.orderDetails.medicineBill.prescription_url.length > 0) {
            this.addNewMedicine()
          }
          this.patient_id = response?.data?.orderData?.patient_details?.user_id;
          this.getPatientDetails();
          if (this.orderDetails.medicineBill.prescription_url) {
            this.prescriptionSignedUrl = this.orderDetails.medicineBill.prescription_url;
            // this.documentMetaDataURL();
          }
          if (this.orderDetails.medicineDetails.length > 0) {
            this.orderDetails.medicineDetails.forEach((element, index) => {
              console.log(element, "elementcheck ");

              this.medicineList.push([]);
              this.selectKeyPressValue.push("");
              this.checkexclutiondata.push("");
              this.checkexclutionDescription.push("");
              this.checkpreAuthService.push("");
              this.medicineNameObject.push([]);
              this.medicineIDObject.push([]);
              this.serviceObject.push([]);
              this.categoryObject.push([]);
              const available = element.available ? "yes" : "no";
              const newRow: FormGroup = new FormGroup({
                medicineId: new FormControl("", []),
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
              this.availableMedicineList.push(available);
              (this.orderMedicine.get("medicine_details") as FormArray).push(
                newRow
              );

              this.getMedicineList(element?.name, (this.orderMedicine.get("medicine_details") as FormArray).length - 1, element?.medicine_id, element?.service, element?.category);

              // this.addNewMedicine();
            });
            this.orderMedicine
              .get("total_cost")
              .setValue(this.orderDetails.medicineBill.total_medicine_cost || "");
            this.orderMedicine
              .get("copay")
              .setValue(this.orderDetails.medicineBill.co_pay || "");
            this.orderMedicine
              .get("insurance_paid")
              .setValue(this.orderDetails.medicineBill.insurance_paid || "");
            if (this.orderDetails.medicineDetails.length === 0) {
            }

            this.dataSource = new MatTableDataSource(
              (this.orderMedicine.get("medicine_details") as FormArray).controls
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

  medicineAvailabilityChange(e: { value: string }, i: number) {
    this.availableMedicineList[i] = e.value;
  }

  private addMedicineForSuperadmin() {
    return new Promise((resolve, reject) => {
      const medicineArray = []
      for (const medicine of Object.values(this.newMedicineArray)) {
        medicineArray.push({
          medicine: {
            number: "",
            medicine_name: medicine,
            inn: "",
            dosage: "",
            pharmaceutical_formulation: "",
            administration_route: "",
            therapeutic_class: "",
            manufacturer: "",
            condition_of_prescription: "",
            other: "",
            link: "",
            status: false
          }
        })
      }
      if (medicineArray.length > 0) {
        const reqData = {
          medicines: medicineArray,
          isNew: true,
          userId: this.portal_user_id
        }
        this._superAdminService.addMedicine(reqData).subscribe((res: any) => {
          let response = this.coreService.decryptObjectData({ data: res });
          if (response.status) {
            for (const med of response.body.result) {
              let index = this.coreService.getKeyByValue(this.newMedicineArray, med.medicine.medicine_name)
              this.medicineIDObject[index] = med._id
              this.medicineNameObject[index] = med._id
            }
            resolve(true)
          } else {
            this.toastr.error("Somthing went wrong while adding medicine");
            resolve(false)
          }
        });
      }

    })
  }


  async updateOrderData() {

    if (Object.values(this.newMedicineArray).length > 0) {
      const addmed = await this.addMedicineForSuperadmin()
    }
    if (Object.values(this.medicineIDObject).length <= 0) {
      this.coreService.showError("", 'Please add at least one medicine');
      return
    }
    if (this.getOrderField("total_cost") == 0) {
      this.coreService.showError("", 'Please add medicine cost');
      return
    }
    if (this.subscriber_id == null) {
      this.loader.start();
      const orderDetailRequest: IOrderUpdateRequest = {
        for_portal_user: sessionStorage.getItem("portal-user-id"),
        for_order_id: this.order_id,
        in_medicine_bill: this.orderDetails.medicineBill._id,
        medicine_bill: {
          co_pay: this.getOrderField("copay"),
          total_medicine_cost: this.getOrderField("total_cost"),
          insurance_paid: this.getOrderField("insurance_paid"),
        },

        medicine_details: this.getOrderField("medicine_details").map((data, index) => ({
          service: "",
          category: "",
          name: this.medicineNameObject[index],
          medicine_id: this.medicineIDObject[index],
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
      };
      this.pharmacyService.updateOrderDetails(orderDetailRequest).subscribe({
        next: (result: IResponse<IMedicineUpdateResponse>) => {
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
      this.loader.start();
      const orderDetailRequest: IOrderUpdateRequest = {
        for_portal_user: sessionStorage.getItem("portal-user-id"),
        for_order_id: this.order_id,
        in_medicine_bill: this.orderDetails.medicineBill._id,
        medicine_bill: {
          co_pay: this.getOrderField("copay"),
          total_medicine_cost: this.getOrderField("total_cost"),
          insurance_paid: this.getOrderField("insurance_paid"),
        },

        medicine_details: this.getOrderField("medicine_details").map((data, index) => ({
          service: this.serviceObject[index],
          category: this.categoryObject[index],
          name: this.medicineNameObject[index],
          medicine_id: this.medicineIDObject[index],
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
      };
      this.pharmacyService.updateOrderDetails(orderDetailRequest).subscribe({
        next: (result: IResponse<IMedicineUpdateResponse>) => {
          let encryptedData = { data: result };
          let result1 = this.coreService.decryptObjectData(encryptedData);
          // this.coreService.showSuccess("", "Updated order details successfully");
          if (result1.status === true) {
            this.loader.stop();
            this.openVerticallyCenteredapproved(this.approved);
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

  documentMetaDataURL(): void {
    const docRequest: IUniqueId = {
      id: this.orderDetails.medicineBill.prescription_url,
    };
    this.pharmacyService.getDocumentMetadata(docRequest).subscribe({
      next: (result1: IResponse<IDocumentMetaDataResponse>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order details successfully");
        const urlArray = []
        if (result.status === true) {
          for (const url of result.data) {
            urlArray.push(url.url);
          }
          this.prescriptionUrl = urlArray;
          this.generateSignedUrl();
        }
      },
      error: (err: ErrorEvent) => {
        // this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

  generateSignedUrl() {
    const docRequest: ISignedUrlRequest = {
      url: this.prescriptionUrl,
    };
    this.pharmacyService.signedUrl(docRequest).subscribe({
      next: (result1: IResponse<string>) => {
        let result = this.coreService.decryptObjectData({ data: result1 });
        // this.coreService.showSuccess("", "Fetched order details successfully");
        if (result.status === true) {
          this.prescriptionSignedUrl = result.data;
        }
      },
      error: (err: ErrorEvent) => {
        // this.coreService.showError("", err.message);
        // if (err.message === "INTERNAL_SERVER_ERROR") {
        //   this.coreService.showError("", err.message);
        // }
      },
    });
  }

  // handleMedicineExclusionCost(price: any, index: number): void {
  //   const medicineName = this.medicineNameObject[index]

  //   if (this.health_plan_details) {
  //     for (const exclusion of this.health_plan_details.planExclusion) {
  //       if (medicineName == exclusion.in_exclusion.name) {
  //         this.exludeMedicineAmount[index] = price
  //       } else {
  //         delete this.exludeMedicineAmount[index]
  //       }
  //     }
  //   }
  //   this.calculateCost()
  // }

  checkExcludeMedicine(index: any) {
    return index in this.exludeMedicineAmount
  }

  //Calculate medicine cost based on medicines and insurance
  // calculateCost() {
  //   let totalMedicineCost = 0
  //   for (const value of this.getOrderField("medicine_details")) {
  //     totalMedicineCost += parseFloat(value.totalcost)
  //   }
  //   if (this.health_plan_details && totalMedicineCost) {
  //     // let reimbusment_rate = 0
  //     // for (const planService of this.health_plan_details.planService) {
  //     //   if(planService?.has_category?.in_category.name ==="Medical Product" && (planService?.has_category.name ==="Classical Medicine" || planService?.has_category.name ==="Medicine")){
  //     //     reimbusment_rate = planService.reimbursment_rate;
  //     //   }
  //     // }
  //     let totalAmount = 0
  //     let excludedAmount = 0
  //     if (Object.values(this.exludeMedicineAmount).length > 0) {
  //       const array = Object.values(this.exludeMedicineAmount)
  //       const sum: any = array.reduce((acc: any, cur: any) => acc + Number(cur), 0);
  //       excludedAmount = sum
  //       totalAmount = totalMedicineCost - sum;
  //     } else {
  //       totalAmount = totalMedicineCost
  //     }
  //     const calculateInsuranceAmount =  totalAmount * this.reimbursmentRate[index] / 100
  //     this.orderMedicine.controls['copay'].setValue(excludedAmount + totalAmount - calculateInsuranceAmount)
  //     this.orderMedicine.controls['insurance_paid'].setValue(calculateInsuranceAmount)
  //   } else {
  //     this.orderMedicine.controls['copay'].setValue(totalMedicineCost)
  //     this.orderMedicine.controls['insurance_paid'].setValue(0)
  //   }
  //   this.orderMedicine.controls['total_cost'].setValue(totalMedicineCost)
  // }

  gotoOrderList() {
    this.modalService.dismissAll("close");
    this.router.navigate(["/pharmacy/presciptionorder"]);
  }
  handleClose() {
    this.loader.stop();
    
    this.modalService.dismissAll("close");
  }

  cancelOrder() {
    const orderRequest: IOrderConfimRequest = {
      _id: this.orderDetails.orderData._id,
      status: "cancelled",
      cancelled_by: "pharmacy",
      for_portal_user: sessionStorage.getItem("portal-user-id")
    };
    this.pharmacyService.cancelOrderDetails(orderRequest).subscribe({
      next: (result1: IResponse<IOrderCancelResponse>) => {
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
}
