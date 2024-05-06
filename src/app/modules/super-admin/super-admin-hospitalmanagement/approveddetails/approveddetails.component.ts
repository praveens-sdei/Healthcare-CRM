import { SuperAdminHospitalService } from "./../../super-admin-hospital.service";
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-approveddetails",
  templateUrl: "./approveddetails.component.html",
  styleUrls: ["./approveddetails.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ApproveddetailsComponent implements OnInit {
  @ViewChild("reasoneforblock") reasoneforblock: TemplateRef<any>;

  blockModal: any;
  superAdminId: any;
  hospitalId: any = "";
  for_portal_userId:any=""

  hospitalDetails:any;

  subscriptionPlans: any = [];

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private service: SuperAdminHospitalService,
    private toastr: ToastrService,
    private coreService: CoreService
  ) {}

  ngOnInit(): void {
    let paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.hospitalId = paramId;
    console.log("HOSPITAL ID=====>", this.hospitalId);
    this.getHospitalDetails()
  }

  getHospitalDetails() {
    this.service
      .getHospitalDetails(this.hospitalId)
      .subscribe((res) => {
        let response = this.coreService.decryptObjectData({ data: res });
        console.log("GET HOSPITAL DETAILS=======>", response);
        this.hospitalDetails=response?.body
        this.subscriptionPlans = response?.body?.subscriptionPlans;
       

        this.for_portal_userId = response?.body?.for_portal_user?._id
      });
  }

  activeLockDeleteHospital(action: any) {
    let reqData = {
      hospital_portal_id: this.for_portal_userId,
      action_name: "delete",
      action_value: true,
    };

    console.log("REQUEST DATA======>", reqData);

    this.service.activeLockDeleteHospital(reqData).subscribe((res) => {
      let response = this.coreService.decryptObjectData({ data: res });
      console.log("RESPONSE=====>", response);
      if (response.status) {
        this.toastr.success(response.messgae);
        this.closePopup()
      }
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
        statement = `Manage ${service?.max_number} ${service?.name}`;
      } else {
        statement = `Manage Unlimited Staff`;
      }

      statements.push(statement);
    }

    return statements;
  }

  closePopup(){
    this.modalService.dismissAll('close')
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
