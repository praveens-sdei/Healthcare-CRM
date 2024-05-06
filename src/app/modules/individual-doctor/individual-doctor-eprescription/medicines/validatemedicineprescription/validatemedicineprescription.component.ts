import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PatientService } from "src/app/modules/patient/patient.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { IndiviualDoctorService } from "../../../indiviual-doctor.service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DatePipe } from "@angular/common";
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from "@techiediaries/ngx-qrcode";
import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { SignaturePad } from 'angular2-signaturepad';
import { Observable, Observer } from "rxjs";
import { environment } from "src/environments/environment";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { PharmacyService } from "src/app/modules/pharmacy/pharmacy.service";
import { IResponse } from "src/app/shared/classes/api-response";
import { INewOrderRequest, INewOrderResponse } from "src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type";

@Component({
  selector: "app-validatemedicineprescription",
  templateUrl: "./validatemedicineprescription.component.html",
  styleUrls: ["./validatemedicineprescription.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ValidatemedicineprescriptionComponent implements OnInit, AfterViewInit {
  signatureImg: string ="";
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 700,
    'canvasHeight': 300
  };
  title = "angular10qrcodegeneration";
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.LOW;
  value: any = "";
  @ViewChild("approved", { static: false }) approved: any;
  selectedPharmacyId: any;
  appointmentDetails: any;
  commonList: any[] = [];

  appointmentId: any = "";
  patient_id: any = "";
  patientDetails: any;
  doctorDetails: any;
  isSubmitted: any = false;

  eprescriptionDetails: any;
  ePrescriptionId: any = "";
  overlay: false;

  dosages: any[] = [];
  labs: any[] = [];
  imaging: any[] = [];
  vaccination: any[] = [];
  eyeglasses: any[] = [];
  others: any[] = [];

  totalCounts: any = 0;
  seletedtSignature: any;
  seletedtSignatureFile: any;

  date: any;
  sendtoPharmacy_form!: FormGroup;
  setTime: any;
  setDate: any;
  hideSignatureButton: boolean = false;
  doctorLocationDetails: any;
  doctorRole: any = "";

  locationForClinic: any;
  locationForHospital: any;
  patient_email: any;
  doctor_email: any;
  doctor_name: any;
  ePrescription_number: any;
  doctorId: any;
  innerMenuPremission:any=[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private pharmacyService: PharmacyService,
    private modalService: NgbModal,
    private route: Router,
    private fb: FormBuilder,
    private indiviualDoctorService: IndiviualDoctorService,
    private datepipe: DatePipe,
    private hospitalService: HospitalService,
    private loader: NgxUiLoaderService
  ) {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.doctorRole = loginData?.role;
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    if(this.doctorRole === "HOSPITAL_STAFF"){
      this.doctorId = adminData?.for_doctor;
      this.doctor_name = loginData?.full_name

      
    }else if(this.doctorRole === "INDIVIDUAL_DOCTOR_STAFF"){
      this.doctorId = adminData?.in_hospital;
      this.doctor_name = loginData?.full_name

    }else{
      this.doctor_name = adminData?.full_name
      this.doctorId = loginData?._id;
      this.doctor_email = loginData?.email
      this.doctorDetails = adminData
    }

    this.sendtoPharmacy_form = this.fb.group({
      pharmacyID: ["", [Validators.required]],
      ePrescriptionNo: ["", [Validators.required]],
    });
   }
  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 2);
    this.signaturePad.clear();
  }

  drawComplete() {
    console.log('begin drawing');
    console.log('begin drawing',this.signaturePad.toDataURL());
    const base64Data: any = this.signaturePad.toDataURL();

    const base64String = base64Data.replace(/^data:.*,/, '');
    // Decode the Base64 string into a byte array

    const byteCharacters = atob(base64String);

    // Create an array buffer from the byte array

    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {

      byteNumbers[i] = byteCharacters.charCodeAt(i);

    }

    const byteArray = new Uint8Array(byteNumbers);



    // Create a Blob object from the byte array

    const blob = new Blob([byteArray], { type: 'application/octet-stream' });



    // Create a File object from the Blob

    const file = new File([blob], 'file_name_here', { type: 'application/octet-stream' });
    console.log(" this.seletedtSignatureFile________", file);

    this.seletedtSignatureFile = file;
    this.signatureImg = base64Data;

    
  }


  drawStart() {
    console.log("jnkj");
    
  }

  clearSignature() {
    this.signaturePad.clear();
    this.seletedtSignatureFile = '';
  }
  dataURItoBlob(dataURI: string): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: "image/jpeg" });
      observer.next(blob);
      observer.complete();
    });
  }
  getBase64Image(img: HTMLImageElement): string {
    // We create a HTML canvas object that will create a 2d image
    var canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    let dataURL: string = canvas.toDataURL("image/png");
    // this.base64DefaultURL = dataURL;
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }
  async savePad() {
    const base64Data: any = this.signaturePad.toDataURL();
    console.log(base64Data);
    const imgFile = new File([base64Data], 'MyFileName.png');
    console.log(imgFile);
    this.seletedtSignatureFile = imgFile;
    this.signatureImg = base64Data;
  }
  ngOnInit(): void {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });
    let day = date.getDate();
    let year = date.getFullYear();

    this.date = `${month} ${day},${year}`;

   

    this.appointmentId = this.activatedRoute.snapshot.paramMap.get("id");
    this.value = environment.apiUrl+`/healthcare-crm-hospital/hospital-doctor/get-eprescription-template-url?appointmentId=${this.appointmentId}`;
console.log("Status", this.value.status);


    this.getAppointmentDetails();
    this.getEprescription();
    this.getAllEprescriptionsTests();
    this.getLocationInfo();
    this.getHospitalOrClinicLocations()
    this.getPharmacyList();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
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

        if (checkSubmenu.hasOwnProperty("claim-process")) {
          this.innerMenuPremission = checkSubmenu['claim-process'].inner_menu;

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
        console.log("this.innerMenuPremission_______________-",this.innerMenuPremission);
        
      }      
    }  
    

  }
  giveInnerPermission(value){
    if(this.doctorRole === "INDIVIDUAL_DOCTOR_STAFF" || this.doctorRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;
    }

  
  }

  async getAppointmentDetails() {
    this.indiviualDoctorService
      .viewAppointmentDetails(this.appointmentId)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        this.patientDetails = response?.data?.patinetDetails;
        this.appointmentDetails = response?.data;
        console.log("DEtails====>", response);
        console.log("PATIENT  DETAILS====>", this.patientDetails);
        this.patient_email =  this.patientDetails?.patient_email

        if (response.status) {
        }
      });
  }
  isPrescriptionValidate: boolean = false;

  async getEprescription() {
    let reqData = {
      appointmentId: this.appointmentId,
    };

    this.indiviualDoctorService
      .getEprescription(reqData)
      .subscribe(async (res) => {
        let response = await this.coreService.decryptObjectData({ data: res });

        console.log("Eprescription Get====>", response);
        if (response.status == true) {
          this.ePrescriptionId = await response?.body?._id;
          this.eprescriptionDetails = await response?.body;
          this.seletedtSignature = await response?.body?.eSignature;     
          this.ePrescription_number = await response?.body?.ePrescriptionNumber
          this.isPrescriptionValidate = await response?.body?.isValidate;


        }else{
          this.coreService.showError("", response.message)
        }
      });
  }

  listMedicineDosages: any[] = [];
  allDosages: any[] = [];

  getAllEprescriptionsTests() {
    let reqData = {
      appointmentId: this.appointmentId,
    };
    this.indiviualDoctorService
      .getAllEprescriptionTests(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("All Tests---->", response);
        if (response.status) {
          let data = response?.body[0];
          //For MEdicine Dosage
          this.allDosages = data?.dosages;

          data?.dosages.forEach(async (element) => {
            let obj = {
              _id: element?.medicineId,
              medicine_name: element?.medicine_name,
            };

            let result = this.listMedicineDosages.filter((s) =>
              s?.medicine_name.includes(element.medicine_name)
            );
            if (result.length === 0) {
              this.listMedicineDosages.push(obj);
            }
          });

          this.labs = data?.labs;
          this.imaging = data?.imaging;
          this.vaccination = data?.vaccinations;
          this.eyeglasses = data?.eyeglasses;
          this.others = data?.others;

          this.totalCounts =
            this.listMedicineDosages?.length +
            this.labs?.length +
            this.vaccination?.length +
            this.others?.length +
            this.eyeglasses?.length +
            this.imaging?.length;
        }
      });
  }

  returnDosagesForMedicine(medicineName) {
    let doseArray = [];
    let statementArray = [];
    this.allDosages.forEach((dose) => {
      if (dose.medicine_name === medicineName) {
        doseArray.push(dose);
      }
    });

    doseArray.forEach((dose) => {
      if (
        dose?.quantities?.quantity_type === "Exact_Quantity" ||
        dose?.quantities?.quantity_type === "Enough_Quantity"
      ) {
        if (dose?.frequency?.frequency_type === "Moment") {
          let statement = "";

          if (dose?.quantities?.quantity === 0) {
            statement = `Morning(${dose?.frequency?.morning}), Midday(${dose?.frequency?.midday}), Evening(${dose?.frequency?.evening}), Night(${dose?.frequency?.night}) for ${dose?.take_for?.quantity} ${dose?.take_for?.type}`;
            statementArray.push(statement);

          } else {
            statement = `${dose?.quantities?.quantity} ${dose?.quantities?.type}, Morning(${dose?.frequency?.morning}), Midday(${dose?.frequency?.midday}), Evening(${dose?.frequency?.evening}), Night(${dose?.frequency?.night}) for ${dose?.take_for?.quantity} ${dose?.take_for?.type}`;
            statementArray.push(statement);

          }
        }

        if (
          dose?.frequency?.frequency_type === "Recurrence" ||
          dose?.frequency?.frequency_type === "Alternate_Taking"
        ) {
          let statement = `${dose?.quantities?.quantity} ${dose?.quantities?.type}, Medicines(${dose?.frequency?.medicine_quantity}) for every ${dose?.frequency?.every_quantity} ${dose?.frequency?.type},  ${dose?.take_for?.quantity} ${dose?.take_for?.type}`;
          statementArray.push(statement);
        }
      }
    });

    return statementArray;
  }

  // Imaging modal
  openVerticallyCenteredaddsignature(addsignature: any) {
    let currentDate = this.datepipe.transform(new Date(), "MM/dd/yyyy");
    let currentTime = this.datepipe.transform(new Date(), "h:mm:ss");
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    this.setTime = `${currentTime} ${ampm}`;
    this.setDate = currentDate;

    this.modalService.open(addsignature, {
      centered: true,
      size: "md",
      windowClass: "addsignature",
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

  handleSelectSignature(event) {
    console.log("seletedtSignature___________",event.target.files[0]);
    this.seletedtSignatureFile = event.target.files[0];

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.seletedtSignature = event.target.result;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }

  handleAddSignature() {
    console.log("AAAAAAAAA",this.seletedtSignatureFile);
    
    const formdata: any = new FormData();
    formdata.append("file", this.seletedtSignatureFile);
    formdata.append("ePrescriptionId", this.ePrescriptionId);
    formdata.append("previewTemplate", this.previewtemplate);
    formdata.append("appointmentId", this.appointmentId);


    for (let [key, value] of formdata) {
      console.log(key, "----->" + value);
    }

    this.indiviualDoctorService
      .addEprescriptionSignature(formdata)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        console.log(response);
        if (response.status) {
          this.toastr.success(response.message);
          this.modalService.dismissAll("close");
          this.getEprescription();
        }
      });
  }

  uploadTemplate(file) {
    let formData: any = new FormData();
    formData.append("userId", this.ePrescriptionId);
    formData.append("docType", "image");
    formData.append("multiple", "false");
    formData.append("docName", file);
    return new Promise((resolve, reject) => {
      this.indiviualDoctorService.uploadDoc(formData).subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        resolve(response);
        if (response.status) {
          this.toastr.success(response.message);
        }
      });
    });
  }

  previewtemplate: any;

  async handleSavePdf() {

    this.hideSignatureButton = true;

    const input = document.getElementById("previewdiv");
    html2canvas(input, { useCORS: true, allowTaint: true, scrollY: 0 }).then(
      async (canvas) => {
        const image = { type: "jpeg", quality: 1 };
        const margin = [0.3, 0.3];
        const filename = "myfile.pdf";

        var imgWidth = 8.5;
        var pageHeight = 11;

        var innerPageWidth = imgWidth - margin[0] * 2;
        var innerPageHeight = pageHeight - margin[1] * 2;

        // Calculate the number of pages.
        var pxFullHeight = canvas.height;
        var pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
        var nPages = Math.ceil(pxFullHeight / pxPageHeight);

        // Define pageHeight separately so it can be trimmed on the final page.
        var pageHeight = innerPageHeight;

        // Create a one-page canvas to split up the full image.
        var pageCanvas = document.createElement("canvas");
        var pageCtx = pageCanvas.getContext("2d");
        pageCanvas.width = canvas.width;
        pageCanvas.height = pxPageHeight;

        // Initialize the PDF.
        var pdf = new jsPDF("p", "in", [8.5, 11]);

        for (var page = 0; page < nPages; page++) {
          // Trim the final page to reduce file size.
          if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
            pageCanvas.height = pxFullHeight % pxPageHeight;
            pageHeight =
              (pageCanvas.height * innerPageWidth) / pageCanvas.width;
          }

          // Display the page.
          var w = pageCanvas.width;
          var h = pageCanvas.height;
          pageCtx.fillStyle = "white";
          pageCtx.fillRect(0, 0, w, h);
          pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

          // Add the page to the PDF.
          if (page > 0) pdf.addPage();
          var imgData = pageCanvas.toDataURL(
            "image/" + image.type,
            image.quality
          );
          pdf.addImage(
            imgData,
            image.type,
            margin[1],
            margin[0],
            innerPageWidth,
            pageHeight
          );
        }

        // pdf.save('eprescription.pdf');
        var pdfdata = pdf.output("blob");
        let element1: HTMLElement = document.getElementById(
          "closebtn"
        ) as HTMLElement;
        // element1.click();
        var file = new File(
          [pdfdata],
          this.eprescriptionDetails?.ePrescriptionNumber + ".pdf"
        );
        //----------------------------------
        await this.uploadTemplate(file).then((res: any) => {
          //for template upload s3
          console.log("After aws file upload---->", res);
          this.previewtemplate = res.data[0].Key;
        });

        this.handleAddSignature();
      }
    );
  }

  handleDownloadTemplate() {
    window.location.href = this.eprescriptionDetails?.previewTemplateSigendUrl;
  }

  getLocationInfo() {
    let params = {
      doctorId: this.doctorId, //doctorId
    };

    this.indiviualDoctorService.getLocationInfo(params).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("Location Info-->", response);
      if (response.status) {
        this.setDoctorLocation(response?.body);
      }
    });
  }

  async setDoctorLocation(data: any) {
    await this.getLocationInfoWithNames(data).then((res: any) => {
      this.doctorLocationDetails = res;
    });
  }

  async getLocationInfoWithNames(data: any) {
    let reqData = {
      location: {
        ...data,
      },
    };

    return new Promise((resolve, reject) => {
      this.indiviualDoctorService
        .getLocationInfoWithNames(reqData)
        .subscribe(async (res) => {
          let response = this.coreService.decryptObjectData({ data: res });
          console.log("Location with Names", response);
          resolve(response?.body);
          reject(response?.body);
        });
    });
  }

  async getHospitalOrClinicLocations() {
    this.hospitalService
      .getLocations(this.doctorId)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("LOCATIONS LIST CLINIC/HOSPITAL===>", response);
        let locationList = response?.data[0]?.hospital_or_clinic_location;

        locationList.forEach(async (element) => {
          if (
            element?.locationFor === "clinic" &&
            this.doctorRole === "INDIVIDUAL_DOCTOR"
          ) {
            await this.getLocationInfoWithNames(element).then((res: any) => {
              console.log("FOR CLINIC----->", res);
              this.locationForClinic = {
                clinicName: element?.hospital_name,
                ...res,
              };
            });

            return;
          }

          if (
            element?.locationFor === "hospital" &&
            this.doctorRole === "HOSPITAL_DOCTOR"
          ) {
            this.locationForHospital = element;
            return;
          }
        });
      });
  }

  handlePrint() {
    window.print();
  }

sendMAiltoPatient(){
  let reqData ={
    patient_data: this.patientDetails,
    doctor_email: this.doctor_email,
    doctor_name: this.doctor_name,
    appointment_Id: this.appointmentId
  }
  console.log("reqData--->",reqData);
  this.loader.start();
  this.indiviualDoctorService.sendMailToPAtient(reqData).subscribe((res) => {
    let response = this.coreService.decryptObjectData({ data: res });
    console.log("response=====>",response);
    
    if (response.status === true) {
      this.loader.stop();
      this.coreService.showSuccess(response.message,'');
    }else{
      this.loader.stop();
      this.coreService.showError(response.message,'');

    }
  });
}

routeBack(){
  if (this.isPrescriptionValidate === true){
    this.route.navigate([`/individual-doctor/eprescription`])

  }else{

    this.route.navigate([`/individual-doctor/eprescription/previeweprescription/${this.appointmentId}`])
  }
}
addComma(data: string): string {
  return data ? ', ' : '';
}


openVerticallypopup(sendPharmacy: any) {

  this.modalService.open(sendPharmacy, {
    centered: true,
    size: "md",
    windowClass: "sendPharmacy",
  });

  this.sendtoPharmacy_form.patchValue({
    ePrescriptionNo: this.ePrescription_number
  })
}


getPharmacyList() {
  let requestData = {
    status: 'APPROVED',
  };
  this.pharmacyService.getlistApprovedPharmacyAdminUserparams(requestData).subscribe({
    next: (res) => {

      let encryptedData = { data: res };
      let result = this.coreService.decryptObjectData(encryptedData);
      console.log("getPharmacyList==>", result)

      if (result.status == true) {
        this.commonList = [];
        result.data.data.map((curentval, index) => {
          this.commonList.push({
            label: curentval.pharmacy_name + " - " + curentval?.for_portal_user?.email,
            value: curentval.for_portal_user._id,
          });
        });
      } else {
        this.coreService.showError(result.message, "");
      }
    },
    error: (err: ErrorEvent) => {
      this.coreService.showError("", err.message);
    },
  });
}

handleSelctionChange(event: any) {
  this.selectedPharmacyId = event.value
}

get form(): { [key: string]: AbstractControl } {
  return this.sendtoPharmacy_form.controls;
}


openVerticallyCenteredapproved(approved: any) {
  this.modalService.open(approved, {
    centered: true,
    size: "md",
    windowClass: "approved_data",
  });
}


async createNewOrder() {
  this.isSubmitted = true;

  if (this.sendtoPharmacy_form.invalid) {
    this.coreService.showError("", "Please fill all required fields.");
    return;
  }
  console.log("this.sendtoPharmacy_form_______", this.sendtoPharmacy_form.value);
  this.isSubmitted = false;
  var pharmacyId = [];
  pharmacyId.push(this.sendtoPharmacy_form.value.pharmacyID)

  let orderRequest: INewOrderRequest = {
    for_portal_user: pharmacyId,
    eprescription_number: this.sendtoPharmacy_form.value.ePrescriptionNo,
    action: 'eprecription',
    request_type: 'order_request',
    subscriber_id: this.appointmentDetails?.appointmentDetails?.subscriberId ? this.appointmentDetails?.appointmentDetails?.subscriberId : null,
    patient_details: {
      user_id: this.appointmentDetails?.patientAllDetails?.personalDetails?.for_portal_user
      ,
      order_confirmation: false,
      user_name: this.appointmentDetails?.patientAllDetails?.personalDetails?.full_name ? this.appointmentDetails?.patientAllDetails?.personalDetails?.full_name : "healthcare-crm Patient",
    },
    from_user: {
      user_id: this.appointmentDetails?.patientAllDetails?.personalDetails?.for_portal_user
      ,
      user_name: this.appointmentDetails?.patientAllDetails?.personalDetails?.full_name ? this.appointmentDetails?.patientAllDetails?.personalDetails?.full_name : "healthcare-crm Patient",
    },
    medicine_list: [],
    prescription_url: [],
    orderBy: {
      user_id: this.doctorId,
      user_name: this.doctor_name
    }
  };

  console.log(orderRequest, "orderRequest");

  this.patientService.newOrder(orderRequest).subscribe({
    next: (res: IResponse<INewOrderResponse>) => {
      let result = this.coreService.decryptContext(res);
      console.log(result);
      if (result.status) {
        this.coreService.showSuccess("", "New Order placed successfully");
         this.openVerticallyCenteredapproved(this.approved);
      } else {
        this.coreService.showError("", result.message);
        this.closePopup();
      }
    },
    error: (err: ErrorEvent) => {
      this.coreService.showError("", err.message);
      this.closePopup();
      // if (err.message === "INTERNAL_SERVER_ERROR") {
      //   this.coreService.showError("", err.message);
      // }
    },
  });
}
}
