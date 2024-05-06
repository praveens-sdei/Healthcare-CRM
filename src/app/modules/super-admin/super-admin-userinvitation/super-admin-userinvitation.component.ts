import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../super-admin.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

export interface PeriodicElement {
  _id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  invitedate: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-super-admin-userinvitation',
  templateUrl: './super-admin-userinvitation.component.html',
  styleUrls: ['./super-admin-userinvitation.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class SuperAdminUserinvitationComponent implements OnInit {
  adminID: any;
  creatorID: any;
  userRole: any;

  @HostListener("document:keydown", ["$event"]) //On pressing Escape
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.closePopup();
    }
  }

  displayedColumns: string[] = [
    "name",
    "email",
    "phone",
    "location",
    "invitedate",
    "status",
    "action",
  ];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userID: any = "";

  isSubmitted: any = false;
  newInvitationForm!: FormGroup;
  invitation_id: any;
  searchKey: any = "";
  searchWithDate: any = "";
  pageSize: number = 5;
  totalLength: number = 0;
  page: any = 1;
  dataSource: any = [];
  startDateFilter: any="";
  endDateFilter: any="";

  sortColumn: string = 'first_name';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  innerMenuPremission:any=[];
  loginrole: any;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: SuperAdminService,
    private toastr: ToastrService,
    private datepipe: DatePipe,
    private _coreService: CoreService,
    private loader: NgxUiLoaderService
  ) {
    this.newInvitationForm = this.fb.group({
      first_name: ["", [Validators.required]],
      middle_name: [""],
      last_name: ["", [Validators.required]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      phone: ["", [Validators.required]],
      address: ["", [Validators.required]],
    });

    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.userRole = userData?.role;
    const userAdminData = this._coreService.getLocalStorage("adminData");
    this.adminID = userAdminData?.for_staff;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getInvitationsList(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getInvitationsList(`${this.sortColumn}:${this.sortOrder}` );
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

  getInvitationsList(sort: any ='') {
    const params={
      for_portal_user: this.userID,
      page: this.page,
      limit: this.pageSize,
      searchKey: this.searchKey,
      createdDate:this.startDateFilter,
      updatedDate:this.endDateFilter,
      sort:sort
    }
    console.log("paramssssss",params)
    this.service.invitationList(params).subscribe((res) => {
      console.log("res=============",res)
      let data = this._coreService.decryptObjectData({ data: res });
      // console.log("data=============",data)
      this.dataSource = data?.body?.listdata;
      // console.log("this.dataSource",this.dataSource)
      this.totalLength = data?.body?.totalRecords;
      console.log(" this.totalLength", this.totalLength)
    });
  }

  newInvitation() {
    this.isSubmitted = true;
    if (this.newInvitationForm.invalid) {
      return;
    }
    this.isSubmitted = false;
    if(this.userRole === 'STAFF_USER'){
      this.creatorID = this.adminID
    }else{
      this.creatorID = this.userID
    }
    this.loader.start();
    let formData={
      created_By:this.creatorID,
      first_name:this.newInvitationForm.value.first_name,
      middle_name:this.newInvitationForm.value.middle_name,
      last_name:this.newInvitationForm.value.last_name,
      email:this.newInvitationForm.value.email,
      phone:this.newInvitationForm.value.phone,
      address:this.newInvitationForm.value.address,
      invitationId: this.invitation_id,
      addedBy:this.userID
      
    }
    this.service
      .inviteUser(formData)
      .subscribe((res: any) => {
        let result = this._coreService.decryptObjectData({ data: res });
        // console.log("result=====>",result)
        if (result.status) {
          this.loader.stop();
          this.toastr.success(result.message);
          this.closePopup();
          this.getInvitationsList();
        } else {
          this.toastr.error(result.message);
          this.loader.stop();
        }
      });
  }

  getInvitationById(){
    const params={
      id:this.invitation_id ,
    }
    this.service.invitationListById(params).subscribe((res) => {
      let data = this._coreService.decryptObjectData({ data: res });
      // console.log("data=============",data)

    this.newInvitationForm.patchValue({
      first_name:data?.data?.first_name,
      middle_name:data?.data?.middle_name,
      last_name:data?.data?.last_name,
      email:data?.data?.email,
      phone:data?.data?.phone,
      address:data?.data?.address,
    })
    });
  }

  handleDeleteInvitation() {
    const reqData={
      id:this.invitation_id
    }
    this.loader.start();
    this.service.deleteInvitation(reqData).subscribe((res: any) => {
      let data = this._coreService.decryptObjectData({ data: res });
      if (data?.status) {
        this.loader.stop();
        this.toastr.success(data?.message);
        this.getInvitationsList();
      }
    });
    this.modalService.dismissAll("close");
  }

  closePopup() {
    this.newInvitationForm.reset();
    this.modalService.dismissAll("close");
  }

  handleSearchFilter(event: any) {
    console.log("event", event)
    this.searchKey = event.target.value;
    this.getInvitationsList();
  }

  handleSelectStartDateFilter(event: any) {    
    const originalDate = new Date(event.value);
    console.log("originalDate",originalDate);   
    this.extendDateFormat(originalDate) 
    const formattedDate = originalDate.toISOString();
    this.startDateFilter = formattedDate
    this.getInvitationsList();
  }

  handleSelectEndDateFilter(event: any) {    
    const originalDate = new Date(event.value);
    this.extendDateFormat(originalDate)     
    const formattedDate = originalDate.toISOString();
    this.endDateFilter = formattedDate
    this.getInvitationsList();
  } 
    extendDateFormat(mydate){
    mydate.setHours(mydate.getHours() + 5); // Add 5 hours
    mydate.setMinutes(mydate.getMinutes() + 30); 
    return mydate
  }

  // handleSearchWithDate(event: any) {
  //   let latest_date = this.datepipe.transform(event.target.value, "MM-dd-yyyy");
  //   console.log(latest_date);
  //   this.searchWithDate = latest_date;
  //   this.getInvitationsList();
  // }

  clearFilter() {
    this.searchKey = "";
    // this.searchWithDate = "";
    this.startDateFilter="";
    this.endDateFilter="";
    this.getInvitationsList();
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getInvitationsList();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.newInvitationForm.controls;
  }

  openVerticallyCenterednewinvite(newinvitecontent: any) {
    this.modalService.open(newinvitecontent, {
      centered: true,
      size: "lg",
      windowClass: "new_invite",
    });
  }

  openVerticallyCenteredsecond(deleteInvitation: any, id: any) {
    this.invitation_id = id;
    this.modalService.open(deleteInvitation, { centered: true, size: "md" });
  }

  openVerticallyEdit(newinvitecontent: any, id: any) {
    this.invitation_id = id;
    console.log("this.invitation_id",this.invitation_id)
    this.modalService.open(newinvitecontent, { centered: true, size: "lg" });
    this.getInvitationById();
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
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };
}
