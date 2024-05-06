import { SuperAdminIndividualdoctorService } from "./../../super-admin-individualdoctor.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { SuperAdminService } from "../../super-admin.service";
import { HospitalService } from "src/app/modules/hospital/hospital.service";
import { LabimagingdentalopticalService } from "../../labimagingdentaloptical.service";

@Component({
  selector: 'app-pendinglabbasicinfo',
  templateUrl: './pendinglabbasicinfo.component.html',
  styleUrls: ['./pendinglabbasicinfo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PendinglabbasicinfoComponent implements OnInit {

  superAdminId: any = "";
  labId: any = "";
  doctorDetails: any;
  availability: any = null;


  profileDetails: any;
  profileImage: any = "";

  availabilityArray: any;
  subscriptionPlans: any=[];
  locationData: any;
  inHospitalLocations: any = [];
  selectedLocation: any = "";
  country: any = "";
  appointmenType: any = "ONLINE";
  selected: any = "ONLINE";
  team: any;
  locationList: any;
  selected_hospitalLocation: any="";
  selectedData: any;
  feeDetails: any;
  verifyStatus: any;
  hospitalId: any;
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private doctorService: SuperAdminIndividualdoctorService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private route: Router,
    private sadminService: SuperAdminService,
    private service: HospitalService,
    private labimagingdentaloptical :LabimagingdentalopticalService
  ) {
    this.loginrole = this.coreService.getLocalStorage("adminData").role;
  }

  ngOnInit(): void {
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.labId = paramId;
    let adminData = JSON.parse(localStorage.getItem("loginData"));
    this.superAdminId = adminData?._id;
    console.log("LAB ID=====>", this.labId);
    this.getLabDetails();
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
        if (checkSubmenu.hasOwnProperty("pharmacy")) {
          this.innerMenuPremission = checkSubmenu['pharmacy'].inner_menu;
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

  getLabDetails() {
    let reqData={
      portal_user_id:this.labId,
      type: "Paramedical-Professions"
    }
    this.labimagingdentaloptical.getLabimagingdentalopticalDetails(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("LAB DETAILS=========>", response);

      this.profileDetails = response?.data?.result[0];
      this.profileImage = this.profileDetails?.profile_picture?.url;
      this.availabilityArray = response?.data?.availabilityArray;
      this.subscriptionPlans = response?.data?.subscriptionPlans;
      this.feeDetails = response?.data?.feeMAnagementArray;
      this.locationData = response?.data;
      this.inHospitalLocations =
        response?.data?.result[0]?.in_hospital_location?.hospital_or_clinic_location;
      this.selectedLocation = this.inHospitalLocations != null ? this.inHospitalLocations[0]?.hospital_id : '';
      this.verifyStatus = response?.data?.result[0]?.verify_status;
      // let team_id = response?.data?.result[0].team;
      // this.hospitalId = this.inHospitalLocations[0]?.hospital_id
      // this.getTeam(team_id,this.hospitalId);
      if (this.locationData) {
        this.getCountryList();
      }
      this.getLocations(this.feeDetails);

    console.log("AVAILABILITY==>",this.availability , typeof(this.availability))


      // let week_days = [];
      // response?.data?.availabilityArray.forEach((element) => {

        // if (
        //   element.appointment_type === this.appointmenType &&
        //   element?.location_id === this.selectedLocation
        // ) {
        //   console.log(element);
        //   this.arrangAvailability(element?.week_days);
        // }
      // });
    });
  }

  approveOrRejectLab(action: any) {
    let reqData = {
      verify_status: action,
      approved_or_rejected_by: this.superAdminId,
      doctor_portal_id: this.labId,
    };

    console.log("REQUEST DATA FOR APPROVE OR REJECT===>", reqData);

    this.labimagingdentaloptical.approveOrRejectLabimagingdentaloptical(reqData).subscribe(
      (res) => {
        console.log("RESPONSE FOR REJECT OR APPROVED====>", res);
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RESPONSE FOR REJECT OR APPROVED====>", response);
        if (response.status) {
          this.toastr.success(response.message);
          this.closePopup();
          if (action === "APPROVED") {
            this.route.navigate([
              "/super-admin/individualparamedical-professions/permission",
              this.labId,
            ]);
          } else {
            this.route.navigate(["/super-admin/individualparamedical-professions"]);
          }
        }
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }

  handleLocationChange(locationId) {
    console.log(locationId);
    this.selectedLocation = locationId;

    this.availabilityArray.forEach((element) => {
      if (
        element.appointment_type === this.appointmenType &&
        element?.location_id === locationId
      ) {
        console.log(element);
        this.arrangAvailability(element?.week_days);
      }
    });
  }

  handleSelectAvailabilty(event) {
    let obj: any;
    this.appointmenType = event.value;
    console.log(event.value, this.selectedLocation);

    this.availabilityArray.forEach((element) => {
      if (
        element.appointment_type === event.value &&
        element?.location_id === this.selectedLocation
      ) {
        console.log(element);

        this.arrangAvailability(element?.week_days);
      }
    });
  }

  arrangAvailability(weekArray: any) {

    console.log("CALLED===>",weekArray)

    let Sun = [];
    let Mon = [];
    let Tue = [];
    let Wed = [];
    let Thu = [];
    let Fri = [];
    let Sat = [];

    console.log("Patch Data===>", weekArray);
    weekArray.forEach((element) => {
      let data = this.arrangeWeekDaysForPatch(element);
      Sun.push({
        start_time: data?.sun_start_time,
        end_time: data?.sun_end_time,
      });
      Mon.push({
        start_time: data?.mon_start_time,
        end_time: data?.mon_end_time,
      });
      Tue.push({
        start_time: data?.tue_start_time,
        end_time: data?.tue_end_time,
      });
      Wed.push({
        start_time: data?.wed_start_time,
        end_time: data?.wed_end_time,
      });
      Thu.push({
        start_time: data?.thu_start_time,
        end_time: data?.thu_end_time,
      });
      Fri.push({
        start_time: data?.fri_start_time,
        end_time: data?.fri_end_time,
      });
      Sat.push({
        start_time: data?.sat_start_time,
        end_time: data?.sat_end_time,
      });
    });

    let obj = {
      Sun: Sun,
      Mon: Mon,
      Tue: Tue,
      Wed: Wed,
      Thu: Thu,
      Fri: Fri,
      Sat: Sat,
    };

    this.availability = obj;


    console.log("AVAILABILITY==>",this.availability , typeof(this.availability))
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  //  Approved modal
  openVerticallyCenteredapproved(approved: any) {
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
    });
  }
  //  Reject modal
  openVerticallyCenteredreject(reject: any) {
    this.modalService.open(reject, {
      centered: true,
      size: "md",
      windowClass: "reject_data",
      keyboard: false,
      backdrop: false,
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


  arrangeWeekDaysForPatch(element: any) {
    // console.log("ARRANGE===>",element)
    let wkD = {
      sun_start_time:
        element.sun_start_time.slice(0, 2) +
        ":" +
        element.sun_start_time.slice(2, 4),

      sun_end_time:
        element.sun_end_time.slice(0, 2) +
        ":" +
        element.sun_end_time.slice(2, 4),

      mon_start_time:
        element.mon_start_time.slice(0, 2) +
        ":" +
        element.mon_start_time.slice(2, 4),

      mon_end_time:
        element.mon_end_time.slice(0, 2) +
        ":" +
        element.mon_end_time.slice(2, 4),

      tue_start_time:
        element.tue_start_time.slice(0, 2) +
        ":" +
        element.tue_start_time.slice(2, 4),

      tue_end_time:
        element.tue_end_time.slice(0, 2) +
        ":" +
        element.tue_end_time.slice(2, 4),

      wed_start_time:
        element.wed_start_time.slice(0, 2) +
        ":" +
        element.wed_start_time.slice(2, 4),

      wed_end_time:
        element.wed_end_time.slice(0, 2) +
        ":" +
        element.wed_end_time.slice(2, 4),

      thu_start_time:
        element.thu_start_time.slice(0, 2) +
        ":" +
        element.thu_start_time.slice(2, 4),

      thu_end_time:
        element.thu_end_time.slice(0, 2) +
        ":" +
        element.thu_end_time.slice(2, 4),

      fri_start_time:
        element.fri_start_time.slice(0, 2) +
        ":" +
        element.fri_start_time.slice(2, 4),

      fri_end_time:
        element.fri_end_time.slice(0, 2) +
        ":" +
        element.fri_end_time.slice(2, 4),

      sat_start_time:
        element.sat_start_time.slice(0, 2) +
        ":" +
        element.sat_start_time.slice(2, 4),

      sat_end_time:
        element.sat_end_time.slice(0, 2) +
        ":" +
        element.sat_end_time.slice(2, 4),
    };

    return wkD;
  }



  getCountryList() {
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        console.log("result=>>>>>",result)
        result.body?.list.forEach((element) => {
          if (element?._id === this.locationData?.country) {
            this.country = element?.name;
            console.log("this.country",this.country)
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  checkForExpiry = (expiry_date: any) => {
    let d = new Date();
    var g1 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    // (YYYY, MM, DD)
    let statusData;
    var g2 = new Date(expiry_date);
    if (g1.getTime() < g2.getTime()) statusData = "active";
    else if (g1.getTime() > g2.getTime()) statusData = "expired";

    // this.globalStatus = statusData;
    return statusData;
  };

  planServiceStatement(services: any) {
    let statements = [];
    for (let service of services) {
      let statement = "";
      if (!service?.is_unlimited) {
        statement = `Manage ${service?.max_number} Staff`;
      } else {
        statement = `Manage Unlimited Staff`;
      }

      statements.push(statement);
    }

    return statements;
  }
  getTeam(id: any,hospitalId) {
    let reqData ={
     _id:id,
     hospitalId:hospitalId
    }
    console.log("result", reqData);
     
     this.service.getByIdTeam(reqData).subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        this.team = result?.body?.list?.team

        console.log("team", this.team);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getLocations(data: any) {
    let reqdata={
      portal_user_id:this.labId,
      type: "Paramedical-Professions"
    }

    this.labimagingdentaloptical.getLocations(reqdata).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("MATHING ID===>", response);
      if (response.status == true) {
        if (response.data.length != 0) {
          this.locationList = response?.data[0]?.hospital_or_clinic_location;
          this.handleSelectedLocationChangeFees(this.locationList[0].hospital_id)
          console.log("this.locationList", this.locationList);
        }
      }
    });
  }

  selected_Location: any
  handleSelectedLocationChangeFees(location_id) {
    this.selected_Location = location_id
    this.selected_hospitalLocation = this.feeDetails.filter(ele => ele.location_id === location_id)
    this.handleSelectConsulation('online')
  }

  handleSelectConsulation(event: any) {
    this.selected = event
    this.selectedData = this.selected_hospitalLocation[0][event]
    console.log(this.selectedData,">>>>>>>>---selectedData")
  }

  backpage(){
    this.route.navigate(["/super-admin/individualparamedical-professions"]);
  }
}
