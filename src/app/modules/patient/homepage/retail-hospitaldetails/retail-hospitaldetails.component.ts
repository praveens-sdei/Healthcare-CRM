import { CoreService } from "src/app/shared/core.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { IndiviualDoctorService } from "../../../individual-doctor/indiviual-doctor.service";
import { type } from "os";

@Component({
  selector: "app-retail-hospitaldetails",
  templateUrl: "./retail-hospitaldetails.component.html",
  styleUrls: ["./retail-hospitaldetails.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class RetailHospitaldetailsComponent implements OnInit {
  currentRate = 1;

  hospitalId: any;
  data: any;
  hospitalDetails: any = "";
  doctorProfile: any = "";
  hospitalProfile: any = "";
  numberofDoctors: any = "";
  hospitalDoctorList: any[] = [];
  commentorsProfile: any[] = [];
  obj1: any = {};
  x: any[] = [];
  hospitalRating_Reviwe: any[] = [];
  ratingCount: any = {};
  getAverage: any = {};
  comment: any = "";
  rating: any;
  loginuser_id: any = "";
  acceptedInsuranceList: any = [];

  pathologyTests:any = [];
  updatedPathologyTests:any = [];

  selectedIndex: number = 0;
  @ViewChild("loginRequiredWarningModal", { static: false }) loginRequiredWarningModal: any;
  @ViewChild("loginRequiredAppointmentWarningModal", { static: false }) loginRequiredAppointmentWarningModal: any;
  doctorsList: any=[];
  groupedDoctors: any=[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private _IndiviualDoctorService: IndiviualDoctorService,
    private service: HospitalService,
    private coreService: CoreService,
    private modalService: NgbModal,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    let userInfo = this.coreService.getLocalStorage("loginData");
    console.log(userInfo,"userInfooooo");
    if(userInfo){
      this.loginuser_id = userInfo._id;
    }
    console.log(this.loginuser_id, "userInfoooo");


    window.scroll({
      top: 0,
    });
    this.hospitalId = this.activatedRoute.snapshot.paramMap.get("id");
    this.gethospitalDetails();
    this.gethospitalDoctorlist();
    this.gethospitalRaviweandRating();


    let tabIndex = parseInt(sessionStorage.getItem("teamIndex"));
    console.log("teamIndex", tabIndex);

    this.selectedIndex = tabIndex;
  }

  gethospitalDetails() {
    this.service.hospitalDetailsApi(this.hospitalId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      // console.log("hospitaldetails", response);
      this.hospitalDetails = response?.body?.data;
      console.log("hospitalDetailssssss", response?.body);
      console.log(response ,"ggggg");
      
      this.pathologyTests = response.body.pathology_tests;

        const groupedTests = {};

        this.pathologyTests.forEach(test => {
          if (!groupedTests[test.typeOfTest]) {
            groupedTests[test.typeOfTest] = [];
          }
          groupedTests[test.typeOfTest].push(test.nameOfTest);
        });

        this.updatedPathologyTests = Object.keys(groupedTests).map(typeOfTest => {
          return {
            typeOfTest,
            nameOfTests: groupedTests[typeOfTest]
          };
        });

        console.log(this.updatedPathologyTests,"pathologyTeststt_____", this.pathologyTests);

      this.hospitalProfile = response?.body?.data?.profile_picture;
      console.log(this.hospitalProfile,"hospitalProfileee");
      
      this.numberofDoctors = response?.body?.doctorCount;
      this.acceptedInsuranceList = response?.body?.accepted_insurance_company;
    });
  }

  gethospitalDoctorlist() {
    let reqData = {
      hospital_portal_id: this.hospitalId,
      doctor_name:"",
    };
    console.log("reqDataSearch----------->", reqData);
    this.service.hospitalDoctorListApi(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({data:res});
      console.log("response----------->", response);

      this.hospitalDoctorList = response?.body?.result;
      this.doctorsList = response?.body?.result;
      console.log(" this.hospitalDoctorList==============>", this.doctorsList);
      this.groupDoctorsBySpeciality(this.doctorsList)
    });
  }
  
  groupDoctorsBySpeciality(doctorsList: any[]) {
    console.log("doctorsList>>>>>>>",doctorsList)
    doctorsList.forEach(doctor => {
      doctor.speciality1.forEach(speciality => {
        let index = this.groupedDoctors.findIndex(group => group.speciality === speciality);
        if (index === -1) {
          this.groupedDoctors.push({ speciality: speciality, doctors: [doctor] });
        } else {
          this.groupedDoctors[index].doctors.push(doctor);
        }
      });
    });
    return this.groupedDoctors;
  }
  // gethospitalDoctorlist() {
  //   let param = {
  //     hospital_portal_id: this.hospitalId,
  //     doctor_name: "",
  //   };
  //   // console.log("param----------->", param);
  //   this.service.hospitalDoctorListApi(param).subscribe((res) => {
  //     let response = this.coreService.decryptObjectData({ data: res });
  //     this.hospitalDoctorList = response?.body?.result;
  //     // console.log("hospitalDoctorList----------->", this.hospitalDoctorList);
  //     this.doctorProfile = response?.body?.result?.profile_picture;
  //     this.specialities();
  //   });
  // }
  // specialities() {
  //   this.hospitalDoctorList.map((data) => {
  //     const result = this.x.includes(data.speciality1);
  //     // console.log("result----->", result);
  //     if (!result) {
  //       this.x.push(data.speciality1);
  //     }
  //   });

  //   this.x.map((ele) => {
  //     const result = this.hospitalDoctorList.filter(
  //       (el) => el.speciality1 == ele
  //     );
  //     this.obj1[ele] = result;
  //   });

  //   console.log("object", this.obj1);
  // }
  gethospitalRaviweandRating() {
    let param = {
      portal_user_id: this.hospitalId,
      page: 1,
      limit: 10,
      reviewBy: 'patient'
    };

    this._IndiviualDoctorService.getDoctorReviweAndRating(param).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        console.log("result----------", result);

        // this.doctorRating_Reviwe = result?.body?.ratingArray
        this.ratingCount = result?.body?.ratingCount;
        this.getAverage = parseFloat(
          result?.body?.getAverage?.average_rating
        ).toFixed(1);
        // console.log(
        //   "reviwe and reating ",
        //   parseFloat(result?.body?.getAverage?.average_rating).toFixed(1)
        // );
        let data = [];
        for (let reviwe of result?.body?.ratingArray) {
          data.push({
            rating: reviwe.rating,
            comment: reviwe.comment,
            patientName: reviwe.patientName,
            date: this.coreService.createDate(new Date(reviwe.createdAt))
              ? this.coreService.createDate(new Date(reviwe.createdAt))
              : "NA",
            firsttlatterofname: this.getShortName(
              reviwe.patientName ? reviwe.patientName : "shivam"
            ),
          });
        }
        this.hospitalRating_Reviwe = data;
        console.log("this.hospitalRating_Reviwe---------------", this.hospitalRating_Reviwe);

      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getShortName(fullName: any) {
    return fullName?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("");
  }

  handelReviweRating(data: any) {
    if (data.comment) {
      this.comment = data.comment.target.value;
    }

    // console.log("textarea", )
  }
  postRatingAndReviwe() {
    const userData = this.coreService.getLocalStorage("loginData");
    if (!userData) {
      this.modalService.open(this.loginRequiredWarningModal, {
        centered: true,
        size: "lg",
        windowClass: "order_medicine",
      });
      return
      // this.coreService.showError("Please login first", " ")
      // return
    }
    this.loginuser_id = userData._id;
    let pararm = {
      for_portal_user: this.hospitalId,
      patient_login_id: this.loginuser_id,
      rating: this.currentRate,
      comment: this.comment,
      reviewBy: 'patient',
      reviewTo: 'hospital'
    };

    this._IndiviualDoctorService.DoctorReviweandRating(pararm).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.modalService.dismissAll('close')
        this.gethospitalRaviweandRating();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  returnInitial(name: string) {
    let initial = name.substring(0, 1);
    return initial;
  }

  //  Review modal
  openVerticallyCenteredreview(reviewcontent: any) {
    this.modalService.open(reviewcontent, {
      centered: true,
      size: "md",
      windowClass: "review",
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


  adjustRatingStar(rating) {
    let roundedNum = Math.floor(rating);
    return roundedNum;
  }
  public handleBtnClick() {
    localStorage.setItem("status","true")
    this.modalService.dismissAll();
    this.router.navigate(["/patient/login"]);
  }

  createAlert(hospitalId: string) {
    console.log(this.loginuser_id, "loginuser_iddd");

    if (!this.loginuser_id) {
      this.modalService.open(this.loginRequiredAppointmentWarningModal, {
        centered: true,
        size: "lg",
        windowClass: "order_medicine",
      });
      return
    } else {
      this.router.navigate([
        "/patient/homepage/retailhospitalinfo",
        hospitalId,
      ]);
    }
  }

  getDirection(direction:any ) {
    if (!direction)
    {
      this.coreService.showError("","Location coordinates not found")
      return 
    }
    const lat = direction[1];
    const lng = direction[0];
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapUrl, "_blank");  
  
  }
}
