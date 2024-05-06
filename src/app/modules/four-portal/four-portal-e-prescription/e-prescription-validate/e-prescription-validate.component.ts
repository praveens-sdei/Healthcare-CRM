import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PatientService } from "src/app/modules/patient/patient.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { CoreService } from "src/app/shared/core.service";
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
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../four-portal.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { PharmacyService } from "src/app/modules/pharmacy/pharmacy.service";
import { INewOrderRequest, INewOrderResponse } from "src/app/modules/patient/homepage/retailpharmacy/retailpharmacy.type";
import { IResponse } from "src/app/shared/classes/api-response";

@Component({
  selector: 'app-e-prescription-validate',
  templateUrl: './e-prescription-validate.component.html',
  styleUrls: ['./e-prescription-validate.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EPrescriptionValidateComponent implements OnInit, AfterViewInit {
  signatureImg: string = "";
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
  sendtoPharmacy_form!: FormGroup;
  commonList: any[] = [];
  overlay: false;
  appointmentId: any = "";
  patient_id: any = "";
  patientDetails: any;
  doctorDetails: any;
  isSubmitted: any = false;
  eprescriptionDetails: any;
  ePrescriptionId: any = "";

  dosages: any[] = [];
  labs: any[] = [];
  imaging: any[] = [];
  vaccination: any[] = [];
  eyeglasses: any[] = [];
  others: any[] = [];

  totalCounts: any = 0;
  seletedtSignature: any;
  seletedtSignatureFile: any;
  @ViewChild("approved", { static: false }) approved: any;

  date: any;

  setTime: any;
  setDate: any;
  hideSignatureButton: boolean = false;
  doctorLocationDetails: any;
  doctorRole: any = "";

  locationForClinic: any;
  locationForHospital: any;
  patient_email: any;
  portal_email: any;
  portal_name: any;
  userType: any;
  ePrescription_number: any;
  userId: any;
  innerMenuPremission: any = [];
  selectedPharmacyId: any;
  appointmentDetails: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fourPortalService: FourPortalService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private route: Router,
    private fb: FormBuilder,
    private indiviualDoctorService: IndiviualDoctorService,
    private datepipe: DatePipe,
    private pharmacyService: PharmacyService,
    private loader: NgxUiLoaderService,
    private patientService: PatientService,
  ) {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.doctorRole = loginData?.role;
    this.userType = loginData?.type

    if (this.doctorRole === 'STAFF') {
      this.userId = adminData.creatorId;
      this.portal_name = loginData?.full_name;


    } else {
      this.userId = loginData._id;
      this.portal_email = loginData?.email;
      this.portal_name = loginData?.full_name;
      this.doctorDetails = adminData;
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
    console.log("complete");

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
    this.seletedtSignatureFile = file;
    this.signatureImg = base64Data;
  }


  drawStart() {
    console.log("draw");
    
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
    const imgFile = new File([base64Data], 'MyFileName.png');
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
    this.value = environment.apiUrl + `/healthcare-crm-labimagingdentaloptical/labimagingdentaloptical/four-portal-get-eprescription-template-url?appointmentId=${this.appointmentId}&portal_type=${this.userType}`;


    this.getAppointmentDetails();
    this.getEprescription();
    this.getAllEprescriptionsTests();
    this.getLocationInfo();
    this.getHospitalOrClinicLocations()
    this.getPharmacyList();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission() {

    let userPermission = this.coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(userPermission, "parent_id", menuID)

    if (checkData) {
      if (checkData.isChildKey == true) {

        var checkSubmenu = checkData.submenu;

        if (checkSubmenu.hasOwnProperty("claim-process")) {
          this.innerMenuPremission = checkSubmenu['claim-process'].inner_menu;

        } else {
          console.log(`does not exist in the object.`);
        }

      } else {
        var checkSubmenu = checkData.submenu;

        let innerMenu = [];

        for (let key in checkSubmenu) {

          innerMenu.push({ name: checkSubmenu[key].name, slug: key, status: true });
        }

        this.innerMenuPremission = innerMenu;
        console.log("this.innerMenuPremission_______________-", this.innerMenuPremission);

      }
    }


  }
  giveInnerPermission(value) {
    if (this.doctorRole === "STAFF" || this.doctorRole === "HOSPITAL_STAFF") {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    } else {
      return true;
    }


  }

  async getAppointmentDetails() {
    let reqData = {
      appointment_id: this.appointmentId,
      portal_type: this.userType
    }
    this.fourPortalService
      .fourPortal_appointment_deatils(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        this.patientDetails = response?.data?.patinetDetails;
        this.appointmentDetails = response?.data;
        this.patient_email = this.patientDetails?.patient_email

        if (response.status) {
        }
      });
  }
  isPrescriptionValidate: boolean = false;

  async getEprescription() {
    let reqData = {
      appointmentId: this.appointmentId,
      portal_type: this.userType


    };

    this.fourPortalService
      .fourPortal_get_ePrescription(reqData)
      .subscribe(async (res) => {
        let response = await this.coreService.decryptObjectData({ data: res });
        console.log("response-------", response);

        if (response.status == true) {
          this.ePrescriptionId = await response?.body?._id;
          this.eprescriptionDetails = await response?.body;
          this.seletedtSignature = await response?.body?.eSignature;
          this.ePrescription_number = await response?.body?.ePrescriptionNumber
          this.isPrescriptionValidate = await response?.body?.isValidate;
        } else {
          this.coreService.showError("", response.message)
        }
      });
  }

  listMedicineDosages: any[] = [];
  allDosages: any[] = [];

  getAllEprescriptionsTests() {
    let reqData = {
      appointmentId: this.appointmentId,
      portal_type: this.userType

    };
    this.fourPortalService
      .fourPortal_get_all_testEprescription(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
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
    this.seletedtSignatureFile = event.target.files[0];

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.seletedtSignature = event.target.result;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.sendtoPharmacy_form.reset();
  }

  handleAddSignature() {

    const formdata: any = new FormData();
    formdata.append("file", this.seletedtSignatureFile);
    formdata.append("ePrescriptionId", this.ePrescriptionId);
    formdata.append("previewTemplate", this.previewtemplate);
    formdata.append("portal_type", this.userType);
    formdata.append("appointmentId", this.appointmentId);


    for (let [key, value] of formdata) {
      console.log(key, "----->" + value);
    }
    this.fourPortalService
      .fourPortal_addEprescriptionSignature(formdata)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });

        if (response.status) {
          this.toastr.success(response.message);
          this.modalService.dismissAll("close");
          this.getEprescription();
        }
      });
  }

  uploadTemplate(file) {
    let formData: any = new FormData();
    formData.append("portal_user_id", this.ePrescriptionId);
    formData.append("docType", "image");
    formData.append("multiple", "false");
    formData.append("documents", file);
    formData.append("portalType", this.userType);

    for (let [key, value] of formData) {
      console.log(key, "----->" + value);
    }
    return new Promise((resolve, reject) => {
      this.fourPortalService.uploadFileForPortal(formData).subscribe((res) => {
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
        var file = new File(
          [pdfdata],
          this.eprescriptionDetails?.ePrescriptionNumber + ".pdf"
        );
        //----------------------------------
        await this.uploadTemplate(file).then((res: any) => {
          //for template upload s3
          this.previewtemplate = res.data[0].url;
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
      portalId: this.userId, //doctorId
      type: this.userType
    };

    this.fourPortalService.fourPortal_getlocationbyid(params).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
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
          resolve(response?.body);
          reject(response?.body);
        });
    });
  }

  async getHospitalOrClinicLocations() {
    let params = {
      portal_user_id: this.userId,
      type: this.userType

    };
    this.fourPortalService
      .getLocations(params)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        let locationList = response?.data[0]?.hospital_or_clinic_location;

        locationList.forEach(async (element) => {
          if (
            element?.locationFor === "clinic" &&
            this.doctorRole === "INDIVIDUAL"
          ) {
            await this.getLocationInfoWithNames(element).then((res: any) => {
              this.locationForClinic = {
                clinicName: element?.hospital_name,
                ...res,
              };
            });

            return;
          }

          if (
            element?.locationFor === "hospital" &&
            this.doctorRole === "HOSPITAL"
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
  // handlePrint() {
  //   const originalContents = document.body.innerHTML;
  //   const printContent = document.getElementById('previewdiv') as HTMLElement;

  //   if (!window.matchMedia || !window.matchMedia('print').matches) {
  //     console.log("insideee_______");
  //     document.body.innerHTML = printContent.outerHTML;
  //   }

  //   window.print();
  //   document.body.innerHTML = originalContents;

  //   if (!window.matchMedia || !window.matchMedia('print').matches) {
  //     this.route.navigate([`/portals/eprescription/${this.userType}`])
  //     .then(() => window.location.reload());

  //     // this.route.navigate([`/portals/eprescription/${this.userType}`]);

  //     // Subscribe to the NavigationEnd event and reload after navigation
  //     // const subscription = this.route.events.pipe(
  //     //   filter(event => event instanceof NavigationEnd),
  //     //   take(1) // Take only the first NavigationEnd event
  //     // ).subscribe(() => {
  //     //   subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
  //       // window.location.reload();
  //     // });
  //   }
  // }

  sendMAiltoPatient() {
    let reqData = {
      patient_data: this.patientDetails,
      portal_email: this.portal_email,
      portal_name: this.portal_name,
      appointment_Id: this.appointmentId,
      portal_type: this.userType
    }
    this.loader.start();
    this.fourPortalService.fourPortal_sendMailToPatient(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });

      if (response.status == true) {
        this.loader.stop();
        this.coreService.showSuccess(response.message, '');
      } else {
        this.loader.stop();
        this.coreService.showError(response.message, '');

      }
    });
  }

  routeBack() {
    console.log("isPrescriptionValidate-----", this.isPrescriptionValidate);

    if (this.isPrescriptionValidate === true) {
      this.route.navigate([`/portals/eprescription/${this.userType}`])
      console.log("ifffff");
    } else {
      this.route.navigate([`/portals/eprescription/${this.userType}/preview-ePrescription/${this.appointmentId}`])

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
        user_id: this.userId,
        user_name: this.portal_name
      }
    };


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
      },
    });
  }



}
