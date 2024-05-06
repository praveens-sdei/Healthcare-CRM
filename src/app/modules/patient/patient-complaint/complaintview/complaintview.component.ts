import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";

import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { CoreService } from 'src/app/shared/core.service';

@Component({
  selector: 'app-complaintview',
  templateUrl: './complaintview.component.html',
  styleUrls: ['./complaintview.component.scss']
})
export class ComplaintviewComponent implements OnInit {
  paginator!: MatPaginator;
  selectedOption: string;
  pageSize: number = 20;
  totalLength: number = 0;
  page: any = 1;
  verifyStatus: any = "APPROVED";
  searchText = "";
  insuraneList: any[] = [];
  commonList: any[] = [];
  overlay: false;
  complaint_to_user_id: any;
  complaint_from_user_id: any;
  provider_type: any;
  complaint_id: any;
  paramId: string;
  complaintData: any;
  userData: any;
  profilePic: any;

  constructor(
    private modalService: NgbModal,
    private _coreService: CoreService,
    private _superAdminService: SuperAdminService,
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.paramId = this.activatedRoute.snapshot.paramMap.get("id");
    this.getViewDetails();

  }
  closePopup() {
    this.modalService.dismissAll();
  }

  getViewDetails() {
    let reqData = {
      _id: this.paramId
    }
    this._superAdminService.getUserComplaint(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });

      this.complaintData = response?.data?.complaintReason
      this.userData = response?.data?.userData
      this.profilePic=response?.data?.profilePic

    });
  }

  userName(ele:any) {
    let obj = {
      insurance: 'Insurance',
      hospital: 'Hospital',
      pharmacy: 'Pharmacy',
      doctor: 'Doctor',
      Optical:"Optical",
      Dental:"Dental",

    }
    return obj[ele]
  }


}
