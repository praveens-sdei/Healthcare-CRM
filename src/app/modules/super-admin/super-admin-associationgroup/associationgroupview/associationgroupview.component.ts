import { SuperAdminService } from "./../../super-admin.service";
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { CoreService } from "src/app/shared/core.service";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface PeriodicElement {
  associationname: string;
  username: string;
  type: string;
  number: string;
  datejoined: string;
  active: string;
  lockuser: string;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: "app-associationgroupview",
  templateUrl: "./associationgroupview.component.html",
  styleUrls: ["./associationgroupview.component.scss"],
})
export class AssociationgroupviewComponent implements OnInit {
  displayedColumns: string[] = [
    "associationname",
    // "username",
    "type",
    "number",
    "datejoined",
    "active",
    "lockuser",
    "action",
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  adminId: any = "639968db111475532b9c5d07";
  searchText: any;
  groupID: any;
  page: any = 1;
  pageSize: number = 20;
  totalLength: number = 0;
  action: any = "delete";
  associationGroupData: any = [];

  sortColumn: string = 'superadmin_id.fullName';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private service: SuperAdminService,
    private _coreService: CoreService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private loader: NgxUiLoaderService
  ) {
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getAllAssociationGroup(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getAllAssociationGroup(`${this.sortColumn}:${this.sortOrder}`);
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    let userPermission = this._coreService.getLocalStorage("adminData").permissions;
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

  getAllAssociationGroup(sort:any='') {
    this.service
      .listAssociationGroup(this.page, this.pageSize,this.searchText,sort)
      .subscribe((res) => {
        let response = this._coreService.decryptObjectData(res);
        this.dataSource = response?.data?.data;
        this.associationGroupData = response?.data?.data;
        console.log("All Association Group--->",response?.data?.data)
        this.totalLength = response.data?.totalCount;
      });
  }

  handleDeleteGroup(actionValue: boolean, action: any) {
    let reqData = {
      action: action,
      actionValue: actionValue,
      id: this.groupID,
    };
    this.loader.start();
    this.service.deleteAssociationGeroup(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData(res);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getAllAssociationGroup();
        this.closePopup();
      } else {
        this.toastr.error(response.message);
        this.loader.stop();
      }
    });
  }

  handleToggeleChange(event: any, groupID: any) {
    this.groupID = groupID;
    this.handleDeleteGroup(event.checked, "lock");
  }

  handleCheckBoxChange(event: any, groupID: any) {
    this.groupID = groupID;
    this.handleDeleteGroup(event.checked, "active");
  }

  closePopup() {
    this.modalService.dismissAll("close");
  }

  handleSearchFilter(text: any) {
    this.searchText = text;
    this.getAllAssociationGroup()
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllAssociationGroup();
  }

  openVerticallyCenteredsecond(deleteModal: any, _id: any) {
    this.groupID = _id;
    this.modalService.open(deleteModal, { centered: true, size: "sm" });
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
}
