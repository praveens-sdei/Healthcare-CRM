import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { InsuranceSubscriber } from '../../insurance-subscriber.service';
import { CoreService } from 'src/app/shared/core.service';
import { InsuranceService } from '../../insurance.service';
import { InsuranceManagementService } from 'src/app/modules/super-admin/super-admin-insurance.service';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
import { NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import * as html2pdf from 'html2pdf.js';
import { ToastrService } from 'ngx-toastr';

import { NgxUiLoaderConfig, NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { NgxUiLoaderService } from 'ngx-ui-loader';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsPosition: 'bottom-left',
  bgsSize: 40,
  "text": "test",
  // Add other configuration options as needed
};

@Component({
  selector: 'app-subscriber-preview-card',
  templateUrl: './subscriber-preview-card.component.html',
  styleUrls: ['./subscriber-preview-card.component.scss']
})
export class SubscriberPreviewCardComponent implements OnInit {

  sortArray: any = 'unique:1';

  subscribersInfoToPrintCard: any = [];
  page = 1;
  @ViewChild('completedownload') completedownload: ElementRef;
  @ViewChild('previewdiv') previewdiv: ElementRef;
  cardPreviewTemplatesId: any;
  name: string;
  loaderLabel: string;

  innerMenuPremission: any = [];
  constructor(private modalService: NgbModal, private ngxLoader: NgxUiLoaderService, private insuranceSubscriber: InsuranceSubscriber, private _coreService: CoreService,
    private insuranceManService: InsuranceManagementService, private insuranceService: InsuranceService,
    private route: ActivatedRoute, private el: ElementRef, private renderer: Renderer2,
    private router: Router,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService
  ) {
    this.route.params.subscribe(params => {
      if (params['id']) {
        console.log("sdfusdgfgsjk", params['id']);

        this.sortArray = atob(params['id']);
        console.log(this.sortArray, "combinedSubscribersInfoStringgg___");

        // this.subscribersInfoToPrintCard = JSON.parse(combinedSubscribersInfoString);
      }


    });
    console.log(this.subscribersInfoToPrintCard, "subscribersInfoToPrintCard___");


  }
  uploadedImageUrl: any = "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg"
  subscriberID: any;
  adminInfo: any;
  insuranceCompanyId: any;
  companyCardFieldsList: any;
  insuranceFields: any = [];
  fontFieldsExist: any = [];
  backFieldsExist: any = [];
  subscriberInfo: any;
  catgServcList: any = [];
  primaryInsuredFields: any = [];
  cardBackSideLimit: any = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  insuranceAdminInfo: any;
  assignCardId: any = '';
  cardPreviewTemplates: any = [];
  baseUrl: any = environment.apiUrl;
  isButtonClicked: boolean = false;
  //  maadoCardFields:any =["Card ID","Last Name","Middle Name/First Name","Date Of Birth","Gender","Relationship","Validity"] 
  selectedsubscriber: any = '';
  maadoCardFields: any = ["Code ID", "Nom", "Prénoms", "Date naissance", "Genre", "Qualité", "Validité"]

  //maadoAdherent:any = ['Full Name',"Employee ID","Mobile Phone"]

  maadoAdherent: any = ['Nom et Prénoms', "Matricule", "Téléphone"]

  categories: any[] = [
    { name: 'Category 1', reimbursementRate: '$50', limit: '500', expanded: false },
    { name: 'Category 2', reimbursementRate: '$75', limit: '750', expanded: false },
    // Add more categories as needed
  ];

  image: any = "https://d2ng8gz95cwpar.cloudfront.net/hospital/6513c36472a583b38066469e/profile/dr_m.jpg?Expires=1701665697199&Key-Pair-Id=AKIARAUGHQ6MZIPOR7SK&Signature=D63hpfvCFkUoPnV3jiBqJp~a88aXfzvUBh0wQRNuALeewtVSfFI9-kAqRuZXjJCJGckA0xD4HjWcPpoqZ0mKgVcX0ujvQnbpGPWsScT2rMHaAwzFyxjNymZZ7kMbbBUjbrnQ~sulBmz9rIgfaJK1sLo5t4dWHYn5VfM8K4CN7R8BtqPz9KmKVCP7Wl-6YUKlb1IGNTW8XiPAMT7FB4Lulxfz9YWkV23r-qC-RiN5cN01JZY328OeQJRFmkHoZFWYBF2rwO6sFp1s3fLa6uNW8tmlbnW0ed6maShGFjdE33Af1ELC817-uuIoK4bk1QUl36qYk4LYvdbSAGYOan4YCg__"

  ngOnInit(): void {



    this.adminInfo = JSON.parse(localStorage.getItem("loginData"));

    this.insuranceAdminInfo = JSON.parse(localStorage.getItem("adminData"));


    if (this.adminInfo.role === 'INSURANCE_STAFF') {

      this.getInsuranceData(this.insuranceAdminInfo?.for_user)
      this.insuranceCompanyId = this.insuranceAdminInfo?.for_user;


    } else {

      this.assignCardId = this.insuranceAdminInfo.card_preview_id;
      this.insuranceCompanyId = this.adminInfo._id;

    }
    console.log(this.assignCardId, "insuranceAdminInfooo______", this.subscribersInfoToPrintCard);



    if (this.assignCardId === undefined) {
      this.toastr.error("Unable to Print Card.As this Insurance Has No Access to Print Card")
    }

    // this.insuranceCompanyId = this.adminInfo._id;


    this.getCardFields();

    this.getCardTemplates();

    // this.primaryInsured();
    //this.subscriberDetail();

    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }



  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission() {

    let userPermission = this._coreService.getLocalStorage("loginData").permissions;

    let menuID = sessionStorage.getItem("currentPageMenuID");

    let checkData = this.findObjectByKey(userPermission, "parent_id", menuID)

    if (checkData) {
      if (checkData.isChildKey == true) {

        var checkSubmenu = checkData.submenu;

        if (checkSubmenu.hasOwnProperty("subscriber")) {
          this.innerMenuPremission = checkSubmenu['subscriber'].inner_menu;

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
      }
    }


  }

  giveInnerPermission(value) {
    if (this.adminInfo.role === 'INSURANCE_STAFF') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    } else {
      return true;
    }

  }

  getInsuranceData(id) {
    let reqData = {
      insuranceId: id
    }
    this.insuranceService.getInusranceAdminDataById(reqData).subscribe((res) => {
      let result = this._coreService.decryptObjectData({ data: res });
      if (result.status == true) {
        this.assignCardId = result?.cardId
        console.log("this.result-----", this.assignCardId);

      }

    })
  }


  getdetails(callby: any = '') {
    this.loader.start();
    var enmc = localStorage.getItem("printCard");
    if (enmc != '') {
      const combinedSubscribersInfoString = atob(enmc);
      this.selectedsubscriber = JSON.parse(combinedSubscribersInfoString).join(",");
    }
    this.subscribersInfoToPrintCard = [];
    this.insuranceSubscriber.getPriSubscriberWithItsSecondarylist(this.insuranceCompanyId, 25, this.page, this.selectedsubscriber, this.sortArray).subscribe(async (res: any) => {
      let decryptedData = this._coreService.decryptContext(JSON.parse(res));
      console.log(decryptedData, "decryptedDataaa______");
      this.loader.stop();

      let data = [];
      let primarySubInfo: any;
      for (const value of decryptedData.body.data) {

        if (value.subscription_for === "Secondary") {

          primarySubInfo = {
            name: value.primaryInsuredId.subscriber_full_name,
            first_name: value.primaryInsuredId.subscriber_first_name,
            middle_name: value.primaryInsuredId.subscriber_middle_name,
            last_name: value.primaryInsuredId.subscriber_last_name,
            uniqueId: value.primaryInsuredId.unique,
            creationDate: value.primaryInsuredId.createdAt,
            typeofinsurance: value.primaryInsuredId.subscriber_type,
            insuranceholder:
              value.primaryInsuredId.subscriber_type === "Individual"
                ? "Individual"
                : value.primaryInsuredId.company_name,
            insurance_holder_name: value.primaryInsuredId.insurance_holder_name,
            dateofbirth: value.primaryInsuredId.date_of_birth,
            gender: value.primaryInsuredId.gender,
            subscriptionisfor: value.primaryInsuredId.subscription_for,
            insurance_validity_to: value.primaryInsuredId.insurance_validity_to,
            insurance_id: value.primaryInsuredId.insurance_id,
            employee_id: value.primaryInsuredId.employee_id,
            healthplan: value.primaryInsuredId.health_plan_for.name,
            id: value.primaryInsuredId._id,
            mobile: value.primaryInsuredId.mobile,
            primarySubscriberId: primarySubInfo,
            reimbursment_rate: value.primaryInsuredId.health_plan_for.reimbursment_rate,
            age: value.primaryInsuredId.age,
            card_id: value.primaryInsuredId.card_id,
            policy_id: value.primaryInsuredId.policy_id
          }
        }

        const uniqueHasCategories = new Set();
        const extractedPlanServices = [];

        for (const planService of value.plan_services) {
          if (!uniqueHasCategories.has(planService.has_category)) {
            extractedPlanServices.push({
              has_category: planService.has_category,
              services: [{
                service: planService.service,
                reimbursment_rate: planService.reimbursment_rate,
                cat_in_limit: planService.in_limit.category_limit,
                ser_in_limit: planService.in_limit.service_limit,
                checkservice: planService.service,
                checkcatgory: planService.has_category,
                primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
                primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
              }],
            });

            uniqueHasCategories.add(planService.has_category);
          } else {
            const existingObject = extractedPlanServices.find(obj => obj.has_category === planService.has_category);

            if (existingObject) {
              existingObject.services.push({
                service: planService.service,
                reimbursment_rate: planService.reimbursment_rate,
                cat_in_limit: planService.in_limit.category_limit,
                ser_in_limit: planService.in_limit.service_limit,
                checkservice: planService.service,
                checkcatgory: planService.has_category,
                primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
                primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
              });
            }
          }
        }

        var newPlanService1 = [];
        var k = 1;
        for (const planService of extractedPlanServices) {

          newPlanService1.push({
            checkservice: '',
            checkcatgory: planService.has_category,
            service: planService.has_category,
            cat_in_limit: planService.services[0].cat_in_limit,
            ser_in_limit: '',
            reimbursment_rate: '',
            primarySecondaryCategoryLimit: planService.primary_and_secondary_category_limit,
            primarySecondaryServiceLimit: planService.primary_and_secondary_service_limit
          })
          newPlanService1.push(...planService.services)
        }

        var newPlanService2 = [];
        var k = 1;
        for (const planServic11e of newPlanService1) {
          //console.log(planServic11e, "planServic11e");

          if (this.isBackFieldExist(planServic11e.checkcatgory, planServic11e.checkservice)) {
            newPlanService2.push({ ...planServic11e, seq: k })
            if (planServic11e.checkservice == '') {
              k++
            }
          }
        }


        //console.log("dateeeeeee", value);
        data.push({
          name: value.subscriber_full_name,
          uniqueId: value.unique,
          creationDate: value.createdAt,
          typeofinsurance: value.subscriber_type,
          insuranceholder:
            value.subscriber_type === "Individual"
              ? "Individual"
              : value.company_name,
          insurance_holder_name: value.insurance_holder_name,
          dateofbirth: value.date_of_birth,
          gender: value.gender,
          subscriptionisfor: value.subscription_for,
          insurance_validity_to: value.insurance_validity_to,
          insurance_validity_from: value.insurance_validity_from,
          insurance_id: value.insurance_id,
          employee_id: value.employee_id,
          healthplan: value.health_plan_for.name,
          healthplanId: value.health_plan_for._id,
          id: value._id,
          primarySubscriberId: primarySubInfo,
          mobile: value.mobile,
          reimbursment_rate: value.health_plan_for.reimbursment_rate,
          age: value.age,
          card_id: value.card_id,
          policy_id: value.policy_id,
          first_name: value.subscriber_first_name,
          middle_name: value.subscriber_middle_name,
          last_name: value.subscriber_last_name,
          relationship: value.relationship_with_insure,
          totalCareLimitPrimSec: value.health_plan_for.total_care_limit.grand_total,
          plan_services: newPlanService2,
          subscriberImage: value.insurance_card_id_proof,
          dateofcreation: value.dateofcreation
        });
      }

      this.subscribersInfoToPrintCard = data;
      console.log(this.subscribersInfoToPrintCard, "testttttt________");
      if (callby != '') {
        this.handleSavePdf1();
      }
    });


  }
  Close() {
    localStorage.removeItem("printCard")
    window.close();
  }

  getCardTemplates() {
    this.insuranceService.getCardTemplates().subscribe((res: any) => {
      this.cardPreviewTemplates = this._coreService.decryptObjectData({
        data: res,
      }).body
      console.log(this.cardPreviewTemplates, "cardPreviewTemplatesss_______");
    })
  }

  // primaryInsured() {
  //   let datatoPass = "Primary Insured Field";
  //   this.insuranceManService
  //     .insuranceGetFields(datatoPass)
  //     .subscribe((res: any) => {
  //       this.insuranceFields = this._coreService.decryptObjectData({
  //         data: res,
  //       }).body;
  //       console.log(this.insuranceFields, "insuranceFieldssss");

  //     });
  // }

  subscriberDetail() {
    this.insuranceSubscriber.viewSubscriberDetails(this.subscriberID).subscribe((res: any) => {
      const decryptedData = this._coreService.decryptObjectData(JSON.parse(res))
      this.subscriberInfo = decryptedData.body.subscriber_details
      console.log(decryptedData.body, "decryptedDataaaa");
      //  console.log(this.insuranceFields, "insuranceFieldsss");
      this.catgServcList = decryptedData.body.plan_services;
      console.log(this.catgServcList, "catgServcListttttt");
      this.getCardFields();
    })
  }


  getCardFields() {
    this.insuranceService.getCardFields(this.insuranceCompanyId).subscribe((res: any) => {
      this.companyCardFieldsList = this._coreService.decryptObjectData({
        data: res,
      }).body
      if (this.companyCardFieldsList.length > 0) {
        this.fontFieldsExist = this.companyCardFieldsList[0].frontSideFields;
        this.primaryInsuredFields = this.companyCardFieldsList[0].primaryInsuredFields;
        this.backFieldsExist = this.companyCardFieldsList[0].backSideFields;

        this.getdetails();

      }
      console.log(this.fontFieldsExist, "companyCardFieldsListttt___", this.backFieldsExist);

    })
  }
  isFieldExistFrontSide(fieldName: string): boolean {
    return this.fontFieldsExist.some(field => field.fieldId.fieldName === fieldName);
  }
  isFieldExistPrimaryInsured(fieldName: string): boolean {
    return this.primaryInsuredFields.some(field => field.fieldId.fieldName === fieldName);
  }
  isBackFieldExist(category: string, service: string): boolean {
    console.log("category=", category, "service=", service);

    if (service == '') {
      return this.backFieldsExist.some((field) => {

        //console.log(field.category === category && field.service === service,"trueeeeeeee___");

        return field.category === category;
      });
    }
    return this.backFieldsExist.some((field) => {

      //console.log(field.category === category && field.service === service,"trueeeeeeee___");

      return field.category === category && field.service === service;
    });
  }

  handlePrint() {
    const originalContents = document.body.innerHTML;
    const printContent = document.getElementById('previewdiv') as HTMLElement;

    if (!window.matchMedia || !window.matchMedia('print').matches) {
      console.log("insideee_______");
      document.body.innerHTML = printContent.outerHTML;
    }

    window.print();
    document.body.innerHTML = originalContents;

    if (!window.matchMedia || !window.matchMedia('print').matches) {
      this.router.navigate(['/insurance/insurance-subscribers']);

      // Subscribe to the NavigationEnd event and reload after navigation
      const subscription = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        take(1) // Take only the first NavigationEnd event
      ).subscribe(() => {
        subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
        window.location.reload();
      });
    }
  }

  /*   async handleSavePdf() {
      const printContent = document.getElementById('previewdiv');
    
      const canvas = await html2canvas(printContent, { scale: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      //pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, 210, 297);
    
      pdf.save('document.pdf');
    } */

  async handleSavePdf() {

    /*     var divElementFront = this.el.nativeElement.querySelector('#frontId');
    
      // Set height and width (replace '300px' and '400px' with your desired values)
      divElementFront.style.height = 'UNSET';
      divElementFront.style.width = 'UNSET';
    
      var divElementBack = this.el.nativeElement.querySelector('#backId');
    
      // Set height and width (replace '30UNSET' and '40UNSET' with your desired values)
      divElementBack.style.height = 'UNSET';
      divElementBack.style.width = 'UNSET'; */

    var elements3 = this.el.nativeElement.getElementsByClassName('space-block');

    if (elements3.length > 0) {
      for (let i = 0; i < elements3.length; i++) {
        this.renderer.setStyle(elements3[i], 'height', '0');
      }
    }

    var elements = this.el.nativeElement.getElementsByClassName('front-card-table');
    var elements2 = this.el.nativeElement.getElementsByClassName('back-card-table');


    if (elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
        this.renderer.setStyle(elements[i], 'width', 'UNSET');
        this.renderer.setStyle(elements[i], 'height', 'UNSET');
      }
      // Use Renderer2 to set the style
    }

    if (elements2.length > 0) {
      for (let i = 0; i < elements2.length; i++) {
        this.renderer.setStyle(elements2[i], 'width', 'UNSET');
        this.renderer.setStyle(elements2[i], 'height', 'UNSET');
      }
    }

    const input = document.getElementById("previewdiv");
    html2canvas(input, { useCORS: true, allowTaint: true, scrollY: 0, scale: 5 }).then(
      async (canvas) => {
        const image = { type: "jpeg", quality: 1 };
        const margin = [0, 0];
        const filename = "myfile.pdf";

        var imgWidth = 3.621875;
        var pageHeight = 2.2766541667;

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
        var pdf = new jsPDF("l", "in", [imgWidth, pageHeight]);

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

        pdf.save('card.pdf');

        if (elements.length > 0) {
          for (let i = 0; i < elements.length; i++) {
            this.renderer.setStyle(elements[i], 'width', '1056px');
            this.renderer.setStyle(elements[i], 'height', '816px');
          }
          // Use Renderer2 to set the style
        }

        if (elements2.length > 0) {
          for (let i = 0; i < elements2.length; i++) {
            this.renderer.setStyle(elements2[i], 'width', '1056px');
            this.renderer.setStyle(elements2[i], 'height', '816px');
          }
        }

        if (elements3.length > 0) {
          for (let i = 0; i < elements3.length; i++) {
            this.renderer.setStyle(elements3[i], 'height', '300px');
          }
        }

        /*  divElementFront.style.height = '816px';
         divElementFront.style.width = '1056px';
             
         // Set height and width (replace '30UNSET' and '40UNSET' with your desired values)
         divElementBack.style.height = '816px';
         divElementBack.style.width = '1056px'; */

      }
    );
  }

  async handleSavePdf1() {
    console.log("subscribersInfoToPrintCard-----------", this.subscribersInfoToPrintCard);

    const uniqueIds = Array.from(new Set(this.subscribersInfoToPrintCard.map(obj => obj.uniqueId)));


    this.name = uniqueIds.join('_')
    let uniquedIddata = uniqueIds.join(',')
    this.loaderLabel = 'Downloading the pdf of uniqueIds- ' + uniquedIddata + ' at this time.'

    if (this.subscribersInfoToPrintCard.length > 0) {
      // this.ngxLoader.startBackground('loader-01', ngxUiLoaderConfig);
      this.isButtonClicked = true;
      const content = this.previewdiv.nativeElement;
      const pdfOptions = {
        margin: 0,
        filename: 'card_uniqueId-' + this.name + '.pdf',
        image: { type: 'jpeg', quality: 2 },
        html2canvas: { scale: 5, useCORS: true },
        jsPDF: { unit: 'mm', format: [85.6, 54], orientation: 'l' }
      };
      await html2pdf().set(pdfOptions).from(content).save();
      this.isButtonClicked = false;
      // this.ngxLoader.stopBackground('loader-01');
      this.page = this.page + 1;
      this.getdetails('auto')
    }
    else {
      this._coreService.showSuccess("All Pdf downloaded successfully", "")
      // localStorage.removeItem("printCard")
      this.modalService.open(this.completedownload, {
        centered: true,
        size: "lg",
        windowClass: "Update__subscriber_plan_validity",
        backdrop: 'static',
      });
      // window.close();
    }
  }
  checkAssignCardId(assignCardId: string): boolean {
    for (let i = 1; i <= 9; i++) {
      if (this.cardPreviewTemplates[i]?._id === assignCardId) {
        return true;
      }
    }
    return false;
  }

  cardBackSideLimitFunction(pServiceLength: any) {
    console.log(pServiceLength, "pServiceLengthhh____");
    return this.cardBackSideLimit.length - pServiceLength
  }

  getNumericRange(length: number): any[] {
    const arrayLength = Math.max(length, 0);
    //console.log(arrayLength, "arrayLength");
    return new Array(arrayLength);
  }


}
