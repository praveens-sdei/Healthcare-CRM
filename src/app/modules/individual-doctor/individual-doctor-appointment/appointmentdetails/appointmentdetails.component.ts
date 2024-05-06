import { IFileUploadResult } from "./../../../pharmacy/pharmacy-creatprofile/pharmacy-creatprofile.type";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CoreService } from "src/app/shared/core.service";
import { PatientService } from "src/app/modules/patient/patient.service";
import { SuperAdminService } from "src/app/modules/super-admin/super-admin.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { IndiviualDoctorService } from "../../indiviual-doctor.service";

@Component({
  selector: "app-appointmentdetails",
  templateUrl: "./appointmentdetails.component.html",
  styleUrls: ["./appointmentdetails.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AppointmentdetailsComponent implements OnInit {
  doctorId: any = "";
  appointmentId: any = "";
  patient_id: any = "";
  appointmentDetails: any;
  profile: any;
  country: any = "";
  serachText: any = "";
  innerMenuPremission:any=[];
  staffList: any[] = [];

  selectedStaff: any[] = [];
  userRole: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private coreService: CoreService,
    private toastr: ToastrService,
    private sadminService: SuperAdminService,
    private modalService: NgbModal,
    private route: Router,
    private indiviualDoctorService: IndiviualDoctorService
  ) {}

  ngOnInit(): void {
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.doctorId = loginData?._id;
    this.userRole = loginData?.role;
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.appointmentId = paramId;
    this.getAppointmentDetails();
    this.getStaffList()
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
    if(this.userRole === "INDIVIDUAL_DOCTOR_STAFF" || this.userRole === "HOSPITAL_STAFF"){
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else{
      return true;
    }

  
  }

  acceptOrRejectAppointment(status: any, reason: any) {
    let reqData = {
      appointment_id: this.appointmentId,
      cancelReason: reason,
      status: status,
      cancelledOrAcceptedBy: this.doctorId,
    };

    console.log("REQDATA", reqData);

    this.indiviualDoctorService.cancelSingleAppoinmentApi(reqData).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("RESPONSE===>", response);
        if (response.status) {
          this.modalService.dismissAll("close");
          this.toastr.success(response.message);
          this.route.navigate(["/individual-doctor/appointment"]);
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

  getAppointmentDetails() {
    this.indiviualDoctorService
      .viewAppointmentDetails(this.appointmentId)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        this.appointmentDetails = response?.data?.result;
        this.patient_id = response?.data?.result?.patientId;
        console.log("APPOINTMENT DETAILS====>", response);
        this.getPatientDetails();
      });
  }

  getPatientDetails() {
    let params={
      patient_id:this.patient_id,
      doctor_id:this.doctorId
    }
    this.patientService.profileDetails(params).subscribe(
      (res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        this.profile = {
          ...response?.body?.personalDetails,
          ...response?.body?.portalUserDetails,
          ...response?.body?.locationDetails,
        };

        this.getCountryList();
      },
      (err) => {
        let errResponse = this.coreService.decryptObjectData({
          data: err.error,
        });
        this.toastr.error(errResponse.message);
      }
    );
  }

  assignHeathCareProvider() {
    let reqData = {
      appointment_id: this.appointmentId,
      staff_id: this.selectedStaff,
    };

    this.indiviualDoctorService
      .assignHealthCareProvider(reqData)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.modalService.dismissAll("close");
        }
      });
  }

  getCountryList() {
    this.sadminService.getcountrylist().subscribe({
      next: (res) => {
        let result = this.coreService.decryptObjectData({ data: res });
        result.body?.list.forEach((element) => {
          if (element?._id === this.profile?.country) {
            this.country = element?.name;
          }
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //  Approved modal
  openVerticallyCenteredapproved(approved: any) {
    this.modalService.open(approved, {
      centered: true,
      size: "md",
      windowClass: "approved_data",
      keyboard: false,
      backdrop: false,
    });
  }

  //  Reject modal
  rejectModal: any;
  openVerticallyCenteredreject(reject: any) {
    this.rejectModal = this.modalService.open(reject, {
      centered: true,
      size: "md",
      windowClass: "reject_data",
      keyboard: false,
      backdrop: false,
    });
  }

  // Assign Healthcare Provider Model
  openVerticallyCenteredAssignhealthcare(assignhealthcare_content: any) {
    this.modalService.open(assignhealthcare_content, {
      centered: true,
      windowClass: "assign_healthcare",
    });
  }

  // Reason Modal
  openVerticallyCenteredcancelappointment(cancelappintmentcontent: any) {
    this.rejectModal.close();
    this.modalService.open(cancelappintmentcontent, {
      centered: true,
      size: "lg",
      windowClass: "cancel_appointment",
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

  getStaffList() {
    let reqData = {
      hospitalId: this.doctorId,
      page: 1,
      limit: 1000000,
      searchText: this.serachText,
      role: "",
    };

    this.indiviualDoctorService.getAllStaff(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      this.staffList = [];
      response?.body[0]?.paginatedResults.forEach((element) => {
        this.staffList.push({
          name: element?.profileinfos?.name,
          role: element?.roles?.name,
          id: element?.profileinfos?._id,
        });
      });
    });
  }

  returnClass(id: string) {
    let isPresent = this.selectedStaff.filter((ele) => ele == id);
    if (isPresent.length === 0) {
      return "";
    } else {
      return "active";
    }
  }

  handleSearch(text: any) {
    console.log(text);
    this.serachText = text;
    this.getStaffList();
  }

  handleSelectStaff(id: any) {
    let result = this.selectedStaff.filter((ele, index) => ele == id);

    if (result.length === 0) {
      this.selectedStaff.push(id);
    } else {
      this.selectedStaff.forEach((element, index) => {
        if (element == id) {
          this.selectedStaff.splice(index, 1);
        }
      });
    }

    console.log("Array==>", this.selectedStaff);
  }
}
