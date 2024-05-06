import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { InsuranceSubscriber } from "src/app/modules/insurance/insurance-subscriber.service";
import { InsuranceManagementService } from "../../../super-admin-insurance.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import { InsuranceService } from "src/app/modules/insurance/insurance.service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { environment } from "src/environments/environment";
import { NavigationEnd } from "@angular/router";
import { filter, take } from "rxjs/operators";
import * as html2pdf from "html2pdf.js";
import { NgxUiLoaderConfig, NgxUiLoaderService } from "ngx-ui-loader";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "red",
  bgsPosition: "bottom-left",
  bgsSize: 40,
  // Add other configuration options as needed
};

@Component({
  selector: "app-subscriber-preview-card-admin",
  templateUrl: "./subscriber-preview-card-admin.component.html",
  styleUrls: ["./subscriber-preview-card-admin.component.scss"],
})
export class SubscriberPreviewCardAdminComponent implements OnInit {
  @ViewChild("previewdiv") previewdiv: ElementRef;
  @ViewChild("completedownload") completedownload: ElementRef;
  subscribersInfoToPrintCard: any = [];
  assignCardId: any = "";
  page = 1;
  name: string;
  loaderLabel: string;
  //maadoCardFields:any =["Card ID","Last Name","Middle Name/First Name","Date Of Birth","Gender","Relationship","Validity"]

  maadoCardFields: any = [
    "Code ID",
    "Nom",
    "Prénoms",
    "Date naissance",
    "Genre",
    "Qualité",
    "Validité",
  ];

  //maadoAdherent:any = ['Full Name',"Employee ID","Mobile Phone"]

  maadoAdherent: any = ["Nom et Prénoms", "Matricule", "Téléphone"];

  constructor(
    private modalService: NgbModal,
    private ngxLoader: NgxUiLoaderService,
    private insuranceSubscriber: InsuranceSubscriber,
    private _coreService: CoreService,
    private insuranceManService: InsuranceManagementService,
    private insuranceService: InsuranceService,
    private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private loader : NgxUiLoaderService
  ) {
    this.route.params.subscribe((params) => {
      // if (params['id']) {
      //   const combinedSubscribersInfoString = atob(params['id']);
      //   this.subscribersInfoToPrintCard = JSON.parse(combinedSubscribersInfoString);
      // }
      // if (params['userId']) {
      //   const combinedSubscribersInfoString1 = atob(params['userId']);
      //   const userInfoObject = JSON.parse(combinedSubscribersInfoString1);
      //   this.insuranceCompanyId = userInfoObject.insuranceCompanyId;
      //   this.assignCardId = userInfoObject.insuranceCardPreviewId;
      //   console.log(this.assignCardId, "insuranceCompanyId______");
      //   this.getCardFields();
      // }
    });
    console.log(
      this.subscribersInfoToPrintCard,
      "subscribersInfoToPrintCard___"
    );
  }
  uploadedImageUrl: any =
    "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg";
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
  cardBackSideLimit: any = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];
  cardPreviewTemplates: any = [];
  baseUrl: any = environment.apiUrl;
  isButtonClicked: boolean = false;
  selectedsubscriber: any = "";
  categories: any[] = [
    {
      name: "Category 1",
      reimbursementRate: "$50",
      limit: "500",
      expanded: false,
    },
    {
      name: "Category 2",
      reimbursementRate: "$75",
      limit: "750",
      expanded: false,
    },
    // Add more categories as needed
  ];

  ngOnInit(): void {
    const splitArray = window.location.href.split("/");
    this.subscriberID = splitArray[splitArray.length - 1];
    this.adminInfo = JSON.parse(localStorage.getItem("loginData"));
    this.insuranceCompanyId = this.adminInfo._id;
    console.log(this.insuranceCompanyId, "insuranceCompanyId______");

    var enmc = localStorage.getItem("printCard");
    if (enmc != "") {
      const combinedSubscribersInfoString = atob(enmc);
      this.selectedsubscriber = JSON.parse(combinedSubscribersInfoString).join(
        ","
      );
    }
    var userId = localStorage.getItem("insuranceId");

    if (userId != "") {
      const combinedSubscribersInfoString1 = atob(userId);
      const userInfoObject = JSON.parse(combinedSubscribersInfoString1);
      console.log(userInfoObject, "insuranceCompanyId______");

      this.insuranceCompanyId = userInfoObject.insuranceCompanyId;
      this.assignCardId = userInfoObject.insuranceCardPreviewId;
      console.log(this.assignCardId, "insuranceCompanyId______");
      this.getCardFields();
    }
    this.getCardTemplates();

    this.primaryInsured();
    //this.subscriberDetail();
    //this.getCardFields();
  }

  getCardTemplates() {
    this.insuranceService.getCardTemplates().subscribe((res: any) => {
      this.cardPreviewTemplates = this._coreService.decryptObjectData({
        data: res,
      }).body;
      //console.log(this.cardPreviewTemplates, "cardPreviewTemplatesss_______");
    });
  }
  getdetails(callby: any = "") {
    this.loader.start();
    this.subscribersInfoToPrintCard = [];
    this.insuranceSubscriber
      .getPriSubscriberWithItsSecondarylist(
        this.insuranceCompanyId,
        25,
        this.page,
        this.selectedsubscriber
      )
      .subscribe(async (res: any) => {
        let decryptedData = this._coreService.decryptContext(JSON.parse(res));
        console.log(decryptedData, "decryptedDataaa______");
        this.loader.stop();
        let data = [];
        let primarySubInfo: any;
        for (const value of decryptedData.body.data) {
          if (value.subscription_for === "Secondary") {
            primarySubInfo = {
              name: value.subscriber_full_name,
              first_name: value.subscriber_first_name,
              middle_name: value.subscriber_middle_name,
              last_name: value.subscriber_last_name,
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
              insurance_id: value.insurance_id,
              employee_id: value.employee_id,
              healthplan: value.health_plan_for.name,
              id: value._id,
              mobile: value.mobile,
              primarySubscriberId: primarySubInfo,
              reimbursment_rate: value.health_plan_for.reimbursment_rate,
              age: value.age,
              card_id: value.card_id,
              policy_id: value.policy_id,
            };
          }

          const uniqueHasCategories = new Set();
          const extractedPlanServices = [];

          for (const planService of value.plan_services) {
            if (!uniqueHasCategories.has(planService.has_category)) {
              extractedPlanServices.push({
                has_category: planService.has_category,
                services: [
                  {
                    service: planService.service,
                    reimbursment_rate: planService.reimbursment_rate,
                    cat_in_limit: planService.in_limit.category_limit,
                    ser_in_limit: planService.in_limit.service_limit,
                    checkservice: planService.service,
                    checkcatgory: planService.has_category,
                    primarySecondaryCategoryLimit:
                      planService.primary_and_secondary_category_limit,
                    primarySecondaryServiceLimit:
                      planService.primary_and_secondary_service_limit,
                  },
                ],
              });

              uniqueHasCategories.add(planService.has_category);
            } else {
              const existingObject = extractedPlanServices.find(
                (obj) => obj.has_category === planService.has_category
              );

              if (existingObject) {
                existingObject.services.push({
                  service: planService.service,
                  reimbursment_rate: planService.reimbursment_rate,
                  cat_in_limit: planService.in_limit.category_limit,
                  ser_in_limit: planService.in_limit.service_limit,
                  checkservice: planService.service,
                  checkcatgory: planService.has_category,
                  primarySecondaryCategoryLimit:
                    planService.primary_and_secondary_category_limit,
                  primarySecondaryServiceLimit:
                    planService.primary_and_secondary_service_limit,
                });
              }
            }
          }

          var newPlanService1 = [];
          var k = 1;
          for (const planService of extractedPlanServices) {
            newPlanService1.push({
              checkservice: "",
              checkcatgory: planService.has_category,
              service: planService.has_category,
              cat_in_limit: planService.services[0].cat_in_limit,
              ser_in_limit: "",
              reimbursment_rate: "",
              primarySecondaryCategoryLimit:
                planService.primary_and_secondary_category_limit,
              primarySecondaryServiceLimit:
                planService.primary_and_secondary_service_limit,
            });
            newPlanService1.push(...planService.services);
          }

          var newPlanService2 = [];
          var k = 1;
          for (const planServic11e of newPlanService1) {
            //console.log(planServic11e, "planServic11e");

            if (
              this.isBackFieldExist(
                planServic11e.checkcatgory,
                planServic11e.checkservice
              )
            ) {
              newPlanService2.push({ ...planServic11e, seq: k });
              if (planServic11e.checkservice == "") {
                k++;
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
            totalCareLimitPrimSec:
              value.health_plan_for.total_care_limit.grand_total,
            plan_services: newPlanService2,
            subscriberImage: value.insurance_card_id_proof,
            dateofcreation: value.dateofcreation,
          });
        }

        this.subscribersInfoToPrintCard = data;
        console.log(this.subscribersInfoToPrintCard, "test");
        if (callby != "") {
          this.handleSavePdf1();
        }
      });
  }
  Close() {
    localStorage.removeItem("printCard");
    localStorage.removeItem("insuranceId");

    window.close();
  }
  primaryInsured() {
    let datatoPass = "Primary Insured Field";
    this.insuranceManService
      .insuranceGetFields(datatoPass)
      .subscribe((res: any) => {
        this.insuranceFields = this._coreService.decryptObjectData({
          data: res,
        }).body;
        console.log(this.insuranceFields, "insuranceFieldssss");
      });
  }

  subscriberDetail() {
    this.insuranceSubscriber
      .viewSubscriberDetails(this.subscriberID)
      .subscribe((res: any) => {
        const decryptedData = this._coreService.decryptObjectData(
          JSON.parse(res)
        );
        this.subscriberInfo = decryptedData.body.subscriber_details;
        console.log(decryptedData.body, "decryptedDataaaa");
        //  console.log(this.insuranceFields, "insuranceFieldsss");
        this.catgServcList = decryptedData.body.plan_services;
        console.log(this.catgServcList, "catgServcListttttt");
      });
  }

  getCardFields() {
    console.log(this.insuranceCompanyId);
    this.insuranceService
      .getCardFields(this.insuranceCompanyId)
      .subscribe((res: any) => {
        this.companyCardFieldsList = this._coreService.decryptObjectData({
          data: res,
        }).body;
        console.log(this.companyCardFieldsList, " this.companyCardFieldsList");
        this.fontFieldsExist = this.companyCardFieldsList[0].frontSideFields;
        this.primaryInsuredFields =
          this.companyCardFieldsList[0].primaryInsuredFields;
        this.backFieldsExist = this.companyCardFieldsList[0].backSideFields;
        console.log(
          this.fontFieldsExist,
          "companyCardFieldsListttt___",
          this.backFieldsExist
        );
        this.getdetails();
      });
  }
  isFieldExistFrontSide(fieldName: string): boolean {
    return this.fontFieldsExist.some(
      (field) => field.fieldId.fieldName === fieldName
    );
  }
  isFieldExistPrimaryInsured(fieldName: string): boolean {
    return this.primaryInsuredFields.some(
      (field) => field.fieldId.fieldName === fieldName
    );
  }
  isBackFieldExist(category: string, service: string): boolean {
    //console.log("category=", category, "service=", service);

    return this.backFieldsExist.some((field) => {
      return field.category === category && field.service === service;
    });
  }

  handlePrint() {
    const originalContents = document.body.innerHTML;
    const printContent = document.getElementById("previewdiv") as HTMLElement;

    if (!window.matchMedia || !window.matchMedia("print").matches) {
      // Only change the content if not in print preview mode
      document.body.innerHTML = printContent.outerHTML;
    }

    window.print();
    document.body.innerHTML = originalContents;

    if (!window.matchMedia || !window.matchMedia("print").matches) {
      this.router.navigate(["/super-admin/master"]);

      // Subscribe to the NavigationEnd event and reload after navigation
      const subscription = this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          take(1) // Take only the first NavigationEnd event
        )
        .subscribe(() => {
          subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
          window.location.reload();
        });
    }
  }

  async handleSavePdf() {
    /*     var divElementFront = this.el.nativeElement.querySelector('#frontId');
    
      // Set height and width (replace '300px' and '400px' with your desired values)
      divElementFront.style.height = 'UNSET';
      divElementFront.style.width = 'UNSET';
    
      var divElementBack = this.el.nativeElement.querySelector('#backId');
    
      // Set height and width (replace '30UNSET' and '40UNSET' with your desired values)
      divElementBack.style.height = 'UNSET';
      divElementBack.style.width = 'UNSET'; */

    var elements3 = this.el.nativeElement.getElementsByClassName("space-block");

    if (elements3.length > 0) {
      for (let i = 0; i < elements3.length; i++) {
        this.renderer.setStyle(elements3[i], "height", "0");
      }
    }

    var elements =
      this.el.nativeElement.getElementsByClassName("front-card-table");
    var elements2 =
      this.el.nativeElement.getElementsByClassName("back-card-table");

    if (elements.length > 0) {
      for (let i = 0; i < elements.length; i++) {
        this.renderer.setStyle(elements[i], "width", "UNSET");
        this.renderer.setStyle(elements[i], "height", "UNSET");
      }
      // Use Renderer2 to set the style
    }

    if (elements2.length > 0) {
      for (let i = 0; i < elements2.length; i++) {
        this.renderer.setStyle(elements2[i], "width", "UNSET");
        this.renderer.setStyle(elements2[i], "height", "UNSET");
      }
    }

    const input = document.getElementById("previewdiv");
    html2canvas(input, {
      useCORS: true,
      allowTaint: true,
      scrollY: 0,
      scale: 3,
    }).then(async (canvas) => {
      const image = { type: "jpeg", quality: 1 };
      const margin = [0, 0];
      const filename = "myfile.pdf";

      var imgWidth = 3.621875;
      var pageHeight = 2.2788541667;

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
          pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
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

      pdf.save("card.pdf");

      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          this.renderer.setStyle(elements[i], "width", "1056px");
          this.renderer.setStyle(elements[i], "height", "816px");
        }
        // Use Renderer2 to set the style
      }

      if (elements2.length > 0) {
        for (let i = 0; i < elements2.length; i++) {
          this.renderer.setStyle(elements2[i], "width", "1056px");
          this.renderer.setStyle(elements2[i], "height", "816px");
        }
      }

      if (elements3.length > 0) {
        for (let i = 0; i < elements3.length; i++) {
          this.renderer.setStyle(elements3[i], "height", "300px");
        }
      }

      /*  divElementFront.style.height = '816px';
            divElementFront.style.width = '1056px';
                
            // Set height and width (replace '30UNSET' and '40UNSET' with your desired values)
            divElementBack.style.height = '816px';
            divElementBack.style.width = '1056px'; */
    });
  }

  async handleSavePdf1() {
    console.log(
      "subscribersInfoToPrintCard-----------",
      this.subscribersInfoToPrintCard
    );

    const uniqueIds = Array.from(
      new Set(this.subscribersInfoToPrintCard.map((obj) => obj.uniqueId))
    );

    this.name = uniqueIds.join("_");
    let uniquedIddata = uniqueIds.join(",");
    this.loaderLabel =
      "Downloading the pdf of uniqueIds- " + uniquedIddata + " at this time.";

    if (this.subscribersInfoToPrintCard.length > 0) {
      this.ngxLoader.startBackground("loader-01", ngxUiLoaderConfig);
      this.isButtonClicked = true;
      const content = this.previewdiv.nativeElement;
      const pdfOptions = {
        margin: 0,
        filename: "card_uniqueId-" + this.name + ".pdf",
        image: { type: "jpeg", quality: 2 },
        html2canvas: { scale: 5, useCORS: true },
        jsPDF: { unit: "mm", format: [85.6, 54], orientation: "l" },
      };
      await html2pdf().set(pdfOptions).from(content).save();
      this.isButtonClicked = false;
      this.ngxLoader.stopBackground("loader-01");
      this.page = this.page + 1;
      this.getdetails("auto");
    } else {
      this._coreService.showSuccess("All Pdf downloaded successfully", "");
      // localStorage.removeItem("printCard")
      this.modalService.open(this.completedownload, {
        centered: true,
        size: "lg",
        windowClass: "Update__subscriber_plan_validity",
        backdrop: "static",
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

  getNumericRange(length: number): any[] {
    const arrayLength = Math.max(length, 0);
    //console.log(arrayLength, "arrayLength");
    return new Array(arrayLength);
  }
}
