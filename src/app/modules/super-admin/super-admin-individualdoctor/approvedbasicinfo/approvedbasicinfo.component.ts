import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminIndividualdoctorService } from "../../super-admin-individualdoctor.service";
import { SuperAdminService } from "../../super-admin.service";

@Component({
  selector: "app-approvedbasicinfo",
  templateUrl: "./approvedbasicinfo.component.html",
  styleUrls: ["./approvedbasicinfo.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ApprovedbasicinfoComponent implements OnInit {
  doctorId: any = "";
  superAdminId: any = "";
  profileDetails: any;
  doctorDetails: any;
  profileImage: any = "";

  availabilityArray: any;
  subscriptionPlans: any=[];
  locationData: any;
  inHospitalLocations: any = [];
  selectedLocation: any = "";
  country: any = "";
  appointmenType: any = "ONLINE";
  selected: any = "ONLINE";

  availability: any = null;
  @ViewChild("reasoneforblock") reasoneforblock: TemplateRef<any>;

  blockModal: any;

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private doctorService: SuperAdminIndividualdoctorService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private route: Router,
    private sadminService: SuperAdminService
  ) {}

  ngOnInit(): void {
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.doctorId = paramId;
    let adminData = JSON.parse(localStorage.getItem("loginData"));
    this.superAdminId = adminData?._id;
    console.log("DOCTOR ID=====>", this.doctorId);
    this.getDoctorDetails();
  }

  getDoctorDetails() {
    this.doctorService.getDoctorDetails(this.doctorId).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("DOCTOR DETAILS=========>", response);

      this.profileDetails = response?.data?.result[0];
      this.profileImage = this.profileDetails?.profile_picture?.url;
      this.availabilityArray = response?.data?.availabilityArray;
      this.subscriptionPlans = response?.data?.subscriptionPlans;

      this.locationData = response?.data?.result[0]?.in_location;
      this.inHospitalLocations =
        response?.data?.result[0]?.in_hospital_location?.hospital_or_clinic_location;
        this.selectedLocation = this.inHospitalLocations != null ? this.inHospitalLocations[0]?.hospital_id : '';
        if (this.locationData) {
        this.getCountryList();
        // this.getRegionList(this.locationData?.country);
        // this.getProvienceList(this.locationData?.region);
        // this.getDepartmentList(this.locationData?.province);
        // this.getCityList(this.locationData?.department);
      }

      // let week_days = [];
      response?.data?.availabilityArray.forEach((element) => {
        if (
          element.appointment_type === this.appointmenType &&
          element?.location_id === this.selectedLocation
        ) {
          console.log(element);
          this.arrangAvailability(element?.week_days);
        }
      });
    });
  }

  activeLockDeleteDoctor(action: string, value: boolean) {
    let reqData = {
      doctor_portal_id: this.doctorId,
      action_name: action,
      action_value: value,
    };

    console.log("REQUEST DATA=========>", reqData);

    this.doctorService.activeLockDeleteDoctor(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RESPONSE================>", response);
        if (response.status) {
          this.toastr.success(response.message);
          this.modalService.dismissAll("close");
          this.route.navigate(["/super-admin/individualdoctor"]);
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
  }

  handleBlockDoctor(reason: any) {
    console.log("BLOCKED REASON===>", reason);
  }

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  //  Delete modal
  openVerticallyCentereddetale(addsecondsubsriber: any) {
    this.modalService.open(addsecondsubsriber, { centered: true, size: "md" });
  }

  //  Block modal
  openVerticallyCenteredblock(block: any) {
    this.blockModal = this.modalService.open(block, {
      centered: true,
      size: "md",
    });
  }

  //  Reasone for block modal
  openVerticallyCenteredreasoneforblockblock(reasoneforblock: any) {
    this.modalService.open(reasoneforblock, { centered: true, size: "md" });
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

  getCountryList() {
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        result.body?.list.forEach((element) => {
          if (element?._id === this.locationData?.country) {
            this.country = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
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
}
