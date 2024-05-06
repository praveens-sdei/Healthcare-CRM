import { SlicePipe } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { CoreService } from "src/app/shared/core.service";

export interface PeriodicElement {
  patientname: string;
  dateandtime: string;
  doctorname: string;
  review: string;
  id: Number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    patientname: "Dr. Cameron Williamson",
    dateandtime: "08-21-2022 |  03:50Pm",
    doctorname: "Ronald Richards",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting...",
    id: 1,
  },
  {
    patientname: "Dr. Cameron Williamson",
    dateandtime: "08-21-2022 |  03:50Pm",
    doctorname: "Ronald Richards",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting...",
    id: 2,
  },
  {
    patientname: "Dr. Cameron Williamson",
    dateandtime: "08-21-2022 |  03:50Pm",
    doctorname: "Ronald Richards",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting...",
    id: 3,
  },
  {
    patientname: "Dr. Cameron Williamson",
    dateandtime: "08-21-2022 |  03:50Pm",
    doctorname: "Ronald Richards",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting...",
    id: 4,
  },
  {
    patientname: "Dr. Cameron Williamson",
    dateandtime: "08-21-2022 |  03:50Pm",
    doctorname: "Ronald Richards",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting...",
    id: 5,
  },
];

@Component({
  selector: "app-patienttodoctor",
  templateUrl: "./patienttodoctor.component.html",
  styleUrls: ["./patienttodoctor.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PatienttodoctorComponent implements OnInit {
  ratingForm: FormGroup;
  displayedColumns: string[] = [
    "patientname",
    "dateandtime",
    "doctorname",
    "review",
    "rating",
    "action",
  ];
  dataSource: any = [];

  hospitalId: any = "";
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  selectedReview: any = "";
  reviewId: any = "";

  sortColumn: string = 'patientName.full_name';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  userRole: any;
  userPermission: any;
  innerMenuPremission:any=[];
  constructor(
    config: NgbRatingConfig,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private coreService: CoreService,
    private slicePipe: SlicePipe,
    private service: IndiviualDoctorService
  ) {
    // customize default values of ratings used by this component tree
    config.max = 1;
    config.readonly = true;

    let loginData = JSON.parse(localStorage.getItem("loginData")); 

    let admindata = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role;

    if(this.userRole === "HOSPITAL_STAFF"){
      this.hospitalId = admindata?.in_hospital;

    }else{
      this.hospitalId = loginData?._id;
    }
    this.userPermission = loginData?.permissions;
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getAllRatingReviews(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {

    this.getAllRatingReviews(`${this.sortColumn}:${this.sortOrder}`);
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
        if (checkSubmenu.hasOwnProperty("health_plan")) {
          this.innerMenuPremission = checkSubmenu['health_plan'].inner_menu;  
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
    if(this.userRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;

    }    
  }


  getAllRatingReviews(sort:any='') {
    let reqData = {
      portal_user_id: [this.hospitalId],
      page: this.page,
      limit: this.pageSize,
      reviewBy: "patient",
      requestFrom: "hospital",
      sort:sort
    };

    this.service.getDoctorReviweAndRating(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RATING LIST PATIENT->TO->DOCTOR===>", response);
      if (response.status) {
        this.dataSource = response?.body?.ratingArray;
        this.totalLength = response?.body?.totalCount;
      }
    });
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllRatingReviews();
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

  //  Review modal
  openVerticallyCenteredreview(reviewcontent: any, review: any) {
    this.selectedReview = review;
    this.modalService.open(reviewcontent, {
      centered: true,
      size: "md",
      windowClass: "review",
    });
  }

  adjustRatingStar(rating) {
    let roundedNum = Math.floor(rating);
    return roundedNum;
  }
}
