import { SuperAdminService } from "./../../super-admin.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { CoreService } from "src/app/shared/core.service";
import { ActivatedRoute } from "@angular/router";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-associationgroupdetail",
  templateUrl: "./associationgroupdetail.component.html",
  styleUrls: ["./associationgroupdetail.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AssociationgroupdetailComponent implements OnInit {
  groupID: any;
  groupData: any;
  isSubmitted: any;
  searchText: any = "";
  pharmacyList: any[] = [];
  relatedPharmacies: any[] = [];
  selectedPharmacy: any[] = [];
  association_group_selected_pharmacy: any; //coma seperated
  groupIcon: any = "";

  constructor(
    private modalService: NgbModal,
    private _coreService: CoreService,
    private service: SuperAdminService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get("groupID");
    this.groupID = id;
    this.viewAssociationGroup();
    this.listAllPharmacy();
  }

  viewAssociationGroup() {
    this.service.viewAssociationGroup(this.groupID).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      this.groupData = response.data[0];
      console.log("Group Details-->", response.data);
      this.groupIcon = response?.data[0]?.association_group_icon?.url;
      this.relatedPharmacies = response.data[1]?.pharmacy_details;
      for (let pharmacy of this.relatedPharmacies) {
        this.selectedPharmacy.push(pharmacy.portal_user_id);
      }
      this.association_group_selected_pharmacy = this.selectedPharmacy.join(',')
    });
  }

  listAllPharmacy() {
    this.service.listPharmacy(this.searchText).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      console.log(response?.data, 'response?.data');

      this.pharmacyList = response?.body;

    });
  }

  handleUpdatePharmacy() {
    this.isSubmitted = true;
    if (this.association_group_selected_pharmacy?.length < 1) {
      this.toastr.error("Select Any Pharmacy");
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      association_group_data: this.association_group_selected_pharmacy,
      id: this.groupID,
    };

    // console.log(reqData,'handleUpdatePharmacy');
    // return;
    console.log(reqData, "check reqdata123");

    this.service.editPharmacyForAssociationGroup(reqData).subscribe(
      (res) => {
        console.log(res, "check res of edit");

        let response = this._coreService.decryptObjectData({ data: res });
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.closePopup()
          this.viewAssociationGroup()
        }
      },
      (err) => {
        let errorResponse = this._coreService.decryptObjectData({
          data: err.error,
        });
        this.loader.stop();
        this.toastr.error(errorResponse.message);
      }
    );
  }

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    this.listAllPharmacy();
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.selectedPharmacy.splice(0);
    this.association_group_selected_pharmacy = null;

    for (let pharmacy of this.relatedPharmacies) {
      this.selectedPharmacy.push(pharmacy.portal_user_id);
    }
  }

  //  Order Medicine modal
  openVerticallyCenterededitpharmacy(editpharmacycontent: any) {
    this.modalService.open(editpharmacycontent, {
      centered: true,
      windowClass: "add_pharmacy",
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

  //-------------Pharmacy selection handling-------------
  toggle(item, event: MatCheckboxChange) {
    // console.log('toggle called',item);

    if (event.checked) {
      this.selectedPharmacy.push(item?.for_portal_user);
    } else {
      const index = this.selectedPharmacy.indexOf(item?.for_portal_user);
      if (index >= 0) {
        this.selectedPharmacy.splice(index, 1);
      }
    }
    this.association_group_selected_pharmacy = this.selectedPharmacy.join(",");
  }

  exists(id) {
    return this.selectedPharmacy.indexOf(id) > -1;
  }

  isIndeterminate() {
    return this.selectedPharmacy.length > 0 && !this.isChecked();
  }

  isChecked() {

    return this.selectedPharmacy.length === this.pharmacyList.length;
  }

  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.pharmacyList.forEach((pharmacy) => {
        this.selectedPharmacy.push(pharmacy?.portal_user_id);
      });
    } else {
      this.selectedPharmacy.length = 0;
    }
  }
}
