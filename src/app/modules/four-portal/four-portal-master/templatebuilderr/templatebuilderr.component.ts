import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { CoreService } from "src/app/shared/core.service";
import { FourPortalService } from "../../four-portal.service";
// import { IndiviualDoctorService } from "../../indiviual-doctor.service";

export interface PeriodicElement {
  templatename: string;
  templatecategory: string;
}
const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-templatebuilderr',
  templateUrl: './templatebuilderr.component.html',
  styleUrls: ['./templatebuilderr.component.scss']
})
export class TemplatebuilderrComponent implements OnInit {
  displayedColumns: string[] = ["templatename", "templatecategory", "action"];
  dataSource = ELEMENT_DATA;
  page: any = 1;
  searchText: any = "";
  pageSize: number = 5;
  totalLength: number = 0;
  userId: any;
  templateData: any;
  templateId:any;
  sortColumn: string = 'template_name';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  userType: any;
  innerMenuPremission: any=[];
  userRole: any;

  constructor(
    private modalService: NgbModal,
    private _coreService: CoreService,
    private doctorService: IndiviualDoctorService,
    private fourPortalService: FourPortalService,
    private toastr: ToastrService,
    private router: Router
  ) { 

    let userData = this._coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userType = userData?.type

    this.userRole = userData?.role;
    if(this.userRole === 'STAFF'){
      this.userId = adminData.creatorId;

    }else{
      this.userId = userData._id;

    }
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getTemplateBuilderList(`${column}:${this.sortOrder}`);
 

  }

  ngOnInit(): void {
    this.getTemplateBuilderList();
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){
    console.log("chck_________________")
    let userPermission = this._coreService.getLocalStorage("loginData").permissions;
    let menuID = sessionStorage.getItem("currentPageMenuID");
    
    let checkData = this.findObjectByKey(userPermission, "parent_id",menuID)
    console.log(menuID,userPermission,"checkgasfsas",checkData)
    if(checkData){
      if(checkData.isChildKey == true){
        var checkSubmenu = checkData.submenu;      
        if (checkSubmenu.hasOwnProperty("templatebuilder")) {
          this.innerMenuPremission = checkSubmenu['templatebuilder'].inner_menu;
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
        console.log("this.innerMenuPremission ______________",this.innerMenuPremission );
        
      }
    }  
  }

  giveInnerPermission(value) {
    if (this.userRole === 'STAFF' || this.userRole === 'HOSPITAL_STAFF') {
      const checkRequest = this.innerMenuPremission.find(request => request.slug === value);
      return checkRequest ? checkRequest.status : false;
    }else {
      return true;
    }
  }
  
  getTemplateBuilderList(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      sort:sort,
      type:this.userType
    };
    this.fourPortalService.gettemplateBuilderListApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.totalLength = response?.body?.count;
      this.dataSource = response?.body?.result;
      this.templateData = response?.body?.result;
    });
  }

  deleteTemplate() {
    let data = {
      templateId: this.templateId,
      type:this.userType
    };
    this.fourPortalService.deleteTemplateBuilder(data).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status == true) {
        this.getTemplateBuilderList();
        this.toastr.success(response.message);
        this.closePopup();
      } else {
        this.toastr.error(response.message);
      }
    });
  }
  openEdit(id: any) {
    this.router.navigate([`/portals/addtemplate/${this.userType}`], {
      queryParams: { id: id },
    });
  }
  routeToAdd(){
    this.router.navigate([`/portals/addtemplate/${this.userType}`])
  }

  handleSearchdata(event: any) {
    this.searchText = event.target.value;
    this.getTemplateBuilderList();
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getTemplateBuilderList();
  }
  clearAll() {
    this.searchText = '';
    this.getTemplateBuilderList();
  }
  closePopup() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.getTemplateBuilderList();
  }

  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, templateId:any) {
    this.templateId = templateId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
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
