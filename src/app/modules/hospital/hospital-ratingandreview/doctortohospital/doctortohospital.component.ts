import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { SlicePipe } from "@angular/common";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";

export interface PeriodicElement {
  doctorname: string;
  dateandtime: string;
  hospitalname: string;
  review: string;
  id: Number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    doctorname: "Dr. Cameron Williamson",
    dateandtime: "08-21-2022 |  03:50Pm",
    hospitalname: "Venus Care Hospital",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting...",
    id: 1,
  },
  {
    doctorname: "Dr. Cameron Williamson",
    dateandtime: "08-21-2022 |  03:50Pm",
    hospitalname: "Venus Care Hospital",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting...",
    id: 2,
  },
  {
    doctorname: "Dr. Cameron Williamson",
    dateandtime: "08-21-2022 |  03:50Pm",
    hospitalname: "Venus Care Hospital",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting...",
    id: 3,
  },
  {
    doctorname: "Dr. Cameron Williamson",
    dateandtime: "08-21-2022 |  03:50Pm",
    hospitalname: "Venus Care Hospital",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting...",
    id: 4,
  },
  {
    doctorname: "Dr. Cameron Williamson",
    dateandtime: "08-21-2022 |  03:50Pm",
    hospitalname: "Venus Care Hospital",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting...",
    id: 5,
  },
];
// console.log(ELEMENT_DATA, "element")

@Component({
  selector: "app-doctortohospital",
  templateUrl: "./doctortohospital.component.html",
  styleUrls: ["./doctortohospital.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DoctortohospitalComponent implements OnInit {
  ratingForm: FormGroup;
  displayedColumns: string[] = [
    "doctorname",
    "dateandtime",
    // "hospitalname",
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
    let loginData = JSON.parse(localStorage.getItem("loginData")); 

    let admindata = JSON.parse(localStorage.getItem("adminData"));

    this.userRole = loginData?.role;

    if(this.userRole === "HOSPITAL_STAFF"){
      this.hospitalId = admindata?.in_hospital;

    }else{
      this.hospitalId = loginData?._id;
    }
    this.userPermission = loginData?.permissions;

    config.max = 1;
    config.readonly = true;
    this.ratingForm = this.fb.group({
      review: [""],
      id: [""],
    });
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
      reviewBy: "doctor",
      sort:sort
    };

    this.service.getDoctorReviweAndRating(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RATING LIST DOCTOR===>", response);
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
