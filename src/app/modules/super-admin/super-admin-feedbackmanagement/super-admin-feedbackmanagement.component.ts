import { PharmacyService } from "src/app/modules/pharmacy/pharmacy.service";
import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { CoreService } from "src/app/shared/core.service";
import { SlicePipe } from "@angular/common";
import { IndiviualDoctorService } from "../../individual-doctor/indiviual-doctor.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { FourPortalService } from "../../four-portal/four-portal.service";

export interface PeriodicElement {
  patientname: string;
  dateandtime: string;
  feedbackby: string;
  review: string;
}
@Component({
  selector: "app-super-admin-feedbackmanagement",
  templateUrl: "./super-admin-feedbackmanagement.component.html",
  styleUrls: ["./super-admin-feedbackmanagement.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SuperAdminFeedbackmanagementComponent implements OnInit {
  displayedColumnsPharmacy: string[] = [
    "patientname",
    "dateandtime",
    "pharmacyname",
    "review",
    "rating",
    "action",
  ];
  dataSourcePharmacy: any = [];

  displayedColumnsDoctor: string[] = [
    "patientname",
    "dateandtime",
    "doctorname",
    "review",
    "rating",
    "action",
  ];
  dataSourceDoctor: any = [];

  displayedColumnsHospital: string[] = [
    "patientname",
    "dateandtime",
    "hospitalname",
    "review",
    "rating",
    "action",
  ];
  dataSourceHospital: any = [];

  displayedColumnsHospital2: string[] = [
    "doctorname",
    "dateandtime",
    "hospitalname",
    "review",
    "rating",
    "action",
  ];
  dataSourceHospital2: any = [];

  displayedColumnsLaboratory: string[] = [
    "doctorname",
    "dateandtime",
    "hospitalname",
    "review",
    "rating",
    "action",
  ];
  dataSourcLaboratory: any = [];

  displayedColumnsDental: string[] = [
    "doctorname",
    "dateandtime",
    "hospitalname",
    "review",
    "rating",
    "action",
  ];
  dataSourcDental: any = [];

  displayedColumnsOptical: string[] = [
    "doctorname",
    "dateandtime",
    "hospitalname",
    "review",
    "rating",
    "action",
  ];
  dataSourcOptical: any = [];

  displayedColumnsParamedical: string[] = [
    "doctorname",
    "dateandtime",
    "hospitalname",
    "review",
    "rating",
    "action",
  ];
  dataSourcParamedical: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  tabFor: any = "Pateint_To_Pharmacy";
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  selectedReview: any = "";
  reviewId: any = "";
  innerMenuPremission:any=[];
  loginrole: any;

  sortColumn: string = 'patientName';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';

  constructor(
    config: NgbRatingConfig,
    private modalService: NgbModal,
    private pharmacyService: PharmacyService,
    private coreService: CoreService,
    private slicePipe: SlicePipe,
    private doctorService: IndiviualDoctorService,
    private fourPortal : FourPortalService,
    private loader: NgxUiLoaderService
  ) {
    config.max = 1;
    config.readonly = true;
    this.loginrole = this.coreService.getLocalStorage("adminData").role;
  }


  onSortData(column: any, tab: string) {
    this.tabFor = tab;
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';

    if (this.tabFor === "Pateint_To_Pharmacy") {
      this.getPatientToPharmacyRatings(`${column}:${this.sortOrder}`);
    }

    if (this.tabFor === "Pateint_To_Doctor") {
      this.getOtherTabsRatingAndReview("patient", "doctor", `${column}:${this.sortOrder}`);
    }

    if (this.tabFor === "Pateint_To_Hospital") {

      this.getOtherTabsRatingAndReview("patient", "hospital", `${column}:${this.sortOrder}`);
    }

    if (this.tabFor === "Doctor_To_Hospital") {
      this.getOtherTabsRatingAndReview("doctor", "hospital", `${column}:${this.sortOrder}`);

    }
    
    if (this.tabFor === "laboratory_and_imaging_to_hospital")
    this.getFourPortalToHospitalRatings("Laboratory-Imaging", "hospital", `${this.sortColumn}:${this.sortOrder}`); 
    
    if (this.tabFor === "dental_to_hospital")
    this.getFourPortalToHospitalRatings("Dental", "hospital", `${this.sortColumn}:${this.sortOrder}`);

    if (this.tabFor === "optical_to_hospital")
    this.getFourPortalToHospitalRatings("Optical", "hospital", `${this.sortColumn}:${this.sortOrder}`);

    if (this.tabFor === "paramedical_professions_to_hospital")
    this.getFourPortalToHospitalRatings("Paramedical-Professions", "hospital", `${this.sortColumn}:${this.sortOrder}`);

  }

  ngOnInit(): void {
    this.getPatientToPharmacyRatings(`${this.sortColumn}:${this.sortOrder}`);
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this.coreService.getLocalStorage("adminData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    // console.log(menuID,userPermission,"checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("lab")) {
          this.innerMenuPremission = checkSubmenu['lab'].inner_menu;
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
      console.log("this.innerMenuPremission----------",this.innerMenuPremission);
      
    }  
  }

  giveInnerPermission(value) {
    if (this.loginrole === 'STAFF_USER') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }

  onTabChange(tab: string) {
    this.tabFor = tab;

    if (this.tabFor === "Pateint_To_Pharmacy")
      this.getPatientToPharmacyRatings(`${this.sortColumn}:${this.sortOrder}`);
    if (this.tabFor === "Pateint_To_Doctor")
      this.getOtherTabsRatingAndReview("patient", "doctor", `${this.sortColumn}:${this.sortOrder}`);
    if (this.tabFor === "Pateint_To_Hospital")
      this.getOtherTabsRatingAndReview("patient", "hospital", `${this.sortColumn}:${this.sortOrder}`);
    if (this.tabFor === "Doctor_To_Hospital")
      this.getOtherTabsRatingAndReview("doctor", "hospital", `${this.sortColumn}:${this.sortOrder}`);

    if (this.tabFor === "laboratory_and_imaging_to_hospital")
    this.getFourPortalToHospitalRatings("Laboratory-Imaging", "hospital", `${this.sortColumn}:${this.sortOrder}`); 
    
    if (this.tabFor === "dental_to_hospital")
    this.getFourPortalToHospitalRatings("Dental", "hospital", `${this.sortColumn}:${this.sortOrder}`);

    if (this.tabFor === "optical_to_hospital")
    this.getFourPortalToHospitalRatings("Optical", "hospital", `${this.sortColumn}:${this.sortOrder}`);

    if (this.tabFor === "paramedical_professions_to_hospital")
    this.getFourPortalToHospitalRatings("Paramedical-Professions", "hospital", `${this.sortColumn}:${this.sortOrder}`);
  }

  getPatientToPharmacyRatings(sort: any = '') {
    let reqData = {
      portal_user_id: "",
      page: this.page,
      limit: this.pageSize,
      requestFrom: "superadmin",
      sort: sort
    };

    this.pharmacyService.getPharmcyRaviweandRating(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RATING LIST PATIENT TO PHARMACY===>", response);
      if (response.status) {
        this.dataSourcePharmacy = response?.body?.ratingArray;
        this.totalLength = response?.body?.totalCount;
      }
    });
  }

  getOtherTabsRatingAndReview(reviewBy: any = "", reviewTo: any = "", sort: any = '') {
    let reqData = {
      portal_user_id: "",
      page: this.page,
      limit: this.pageSize,
      reviewBy: reviewBy,
      reviewTo: reviewTo,
      sort: sort
    };

    this.doctorService
      .getReviweAndRatingForSuperAdmin(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log(
          "RATING LIST PATIENT/DOCTOR TO DOCTOR/HOSPITAL===>",
          response
        );
        if (response.status) {
          if (this.tabFor === "Pateint_To_Doctor")
            this.dataSourceDoctor = response?.body?.ratingArray;
          if (this.tabFor === "Pateint_To_Hospital")
            this.dataSourceHospital = response?.body?.ratingArray;
          if (this.tabFor === "Doctor_To_Hospital")
            this.dataSourceHospital2 = response?.body?.ratingArray;
          this.totalLength = response?.body?.totalCount;
        }
      });
  }
  deleteReviewAndRating() {
    if (this.tabFor === "Pateint_To_Pharmacy") {
      this.deletePharmacyReview();
    } else {
      this.deleteOtherTabReview();
      this.deleteFourPortalTabReview();
    }
  }

  deletePharmacyReview() {
    let reqData = {
      _id: this.reviewId,
    };
    this.loader.start();
    this.pharmacyService
      .deletePharmcyRaviweandRating(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.loader.stop();
          this.coreService.showSuccess(response.message, "");
          this.modalService.dismissAll("");
          this.getPatientToPharmacyRatings();
        }
      });
  }

  deleteOtherTabReview() {
    let reqData = {
      _id: this.reviewId,
    };
    this.loader.start();
    this.doctorService.deleteRatingAndReview(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.loader.stop();
        this.coreService.showSuccess(response.message, "");
        this.modalService.dismissAll("");

        if (this.tabFor === "Pateint_To_Doctor")
          this.getOtherTabsRatingAndReview("patient", "doctor");
        if (this.tabFor === "Pateint_To_Hospital")
          this.getOtherTabsRatingAndReview("patient", "hospital");
        if (this.tabFor === "Doctor_To_Hospital")
          this.getOtherTabsRatingAndReview("doctor", "hospital");
      }
    });
  }

  deleteFourPortalTabReview() {
    let reqData = {
      _id: this.reviewId,
    };
    this.loader.start();
    this.fourPortal.deleteRatingAndReview(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.loader.stop();
        this.coreService.showSuccess(response.message, "");
        this.modalService.dismissAll("");
        
        if (this.tabFor === "laboratory_and_imaging_to_hospital")
        this.getFourPortalToHospitalRatings("Laboratory-Imaging", "hospital"); 
        
        if (this.tabFor === "dental_to_hospital")
        this.getFourPortalToHospitalRatings("Dental", "hospital");
    
        if (this.tabFor === "optical_to_hospital")
        this.getFourPortalToHospitalRatings("Optical", "hospital");
    
        if (this.tabFor === "paramedical_professions_to_hospital")
        this.getFourPortalToHospitalRatings("Paramedical-Professions", "hospital");
      
      }
    });
  }

  //  Review modal
  openVerticallyCenteredreview(reviewcontent: any, review: any = "") {
    this.selectedReview = review;
    this.modalService.open(reviewcontent, {
      centered: true,
      size: "md",
      windowClass: "review",
    });
  }

  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, reviewId: any) {
    this.reviewId = reviewId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;

    if (this.tabFor === "Pateint_To_Pharmacy")
      this.getPatientToPharmacyRatings();
    if (this.tabFor === "Pateint_To_Doctor")
      this.getOtherTabsRatingAndReview("patient", "doctor");
    if (this.tabFor === "Pateint_To_Hospital")
      this.getOtherTabsRatingAndReview("patient", "hospital");
    if (this.tabFor === "Doctor_To_Hospital")
      this.getOtherTabsRatingAndReview("doctor", "hospital");
    
      if (this.tabFor === "laboratory_and_imaging_to_hospital")
      this.getFourPortalToHospitalRatings("Laboratory-Imaging", "hospital"); 
      
      if (this.tabFor === "dental_to_hospital")
      this.getFourPortalToHospitalRatings("Dental", "hospital");
  
      if (this.tabFor === "optical_to_hospital")
      this.getFourPortalToHospitalRatings("Optical", "hospital");
  
      if (this.tabFor === "paramedical_professions_to_hospital")
      this.getFourPortalToHospitalRatings("Paramedical-Professions", "hospital");

  }

  dateAndTime(date) {
    const dateTimeString = date;
    const dateTime = new Date(dateTimeString);
    const datee = dateTime.toISOString().split("T")[0];
    const time = dateTime.toISOString().split("T")[1].split(".")[0];

    return { date: datee, time: time };
  }

  trimComment(comment) {
    let trimedComment = this.slicePipe.transform(comment, 0, 50);

    if (comment?.length > 50) {
      return trimedComment + ".....";
    } else {
      return trimedComment;
    }
  }
  adjustRatingStar(rating) {
    let roundedNum = Math.floor(rating);
    return roundedNum;
  }

  getFourPortalToHospitalRatings(reviewBy: any = "", reviewTo: any = "", sort: any = '') {
    let reqData = {
      portal_user_id: "",
      page: this.page,
      limit: this.pageSize,
      reviewBy: reviewBy,
      reviewTo: reviewTo,
      sort: sort
    };

    this.fourPortal.fourPortalRatingBySuperAdmin(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.dataSourcLaboratory = response?.body?.ratingArray?.filter(type=>type.reviewBy === "Laboratory-Imaging")
        this.dataSourcDental = response?.body?.ratingArray?.filter(type=>type.reviewBy === "Dental") 
        this.dataSourcOptical = response?.body?.ratingArray?.filter(type=>type.reviewBy === "Optical")
        this.dataSourcParamedical = response?.body?.ratingArray?.filter(type=>type.reviewBy === "Paramedical-Professions")
        this.totalLength = response?.body?.totalCount;
      }

      console.log(response , "hhhh");
      
      
    });
  }
}
