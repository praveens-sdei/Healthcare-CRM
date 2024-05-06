import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { IndiviualDoctorService } from 'src/app/modules/individual-doctor/indiviual-doctor.service';
import { CoreService } from 'src/app/shared/core.service';
import { FourPortalService } from '../../four-portal.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface PeriodicElement {
  reasonsname: string;
  status: string;
  locationname:string;
}
const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-appointment-reasons',
  templateUrl: './appointment-reasons.component.html',
  styleUrls: ['./appointment-reasons.component.scss']
})
export class AppointmentReasonsComponent implements OnInit {
  displayedColumns: string[] = ["dateofcreation","reasonsname","locationname", "status", "action"];
  dataSource = ELEMENT_DATA;
  appointmentReasonForm!: FormGroup;
  isSubmitted: boolean = false;
  editappointmentReasonForm!: FormGroup;
  appointmentReasonId: any;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  searchText: any = "";
  userId: any = "";
  selectedFiles: any;

  selectfilename: any = "";

  sortColumn: string = 'createdAt';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';

  portalType:any = '';
  loginUserInfo:any = '';
  loginPortalId:any = '';
  usertype: any;
  allLocations: any= [];
  overlay: false;
  selectedlocationvalue: any;
  selectedlocationId: any;
  innerMenuPremission: any=[];
  userRole:any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private router: Router,
    private fourPortalService: FourPortalService,
    private loader: NgxUiLoaderService
  ) {
    this.appointmentReasonForm = this.fb.group({
      appointmentReasonsss: this.fb.array([]),
      selectedlocation : ["",[Validators.required]]
    });

     this.loginUserInfo = this._coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.usertype = this.loginUserInfo?.type;
    this.userRole = this.loginUserInfo?.role;
    if(this.userRole === 'STAFF'){
      this.loginPortalId = adminData.creatorId;

    }else{
      this.loginPortalId = this.loginUserInfo._id;

    }
     
    this.editappointmentReasonForm = this.fb.group({
      appointmentReasonId: ["", [Validators.required]],
      name: ["", [Validators.required]],
      active: ["", [Validators.required]],
      loginPortalId: ["", [Validators.required]],
      selectedlocation:["", [Validators.required]],
    });
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    this.sortIconClass = this.sortOrder === 1 ? 'arrow_upward' : 'arrow_downward';
    this.getAllappointmentReason(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
  
    this.getLocationDetails();
  
    this.addnewappointmentReason();
    this.getAllappointmentReason(`${this.sortColumn}:${this.sortOrder}`);
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
        if (checkSubmenu.hasOwnProperty("appointmentreasons")) {
          this.innerMenuPremission = checkSubmenu['appointmentreasons'].inner_menu;
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

  clearAll() {
    this.searchText = "";
    this.selectedlocationId="";
    this.getAllappointmentReason();
  }
  getAllappointmentReason(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      loginPortalId: this.loginPortalId,
      listFor:this.usertype,
      sort:sort,
      selectedlocation:this.selectedlocationId 
    };
    console.log("appointmentReason", reqData);
    this.fourPortalService.listAppointmentReason(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
       console.log("appointmentReasonssss______", response);
      this.totalLength = response?.body?.totalCount;
      this.dataSource = response?.body?.data;
      // console.log("this.dataSource>>>>>>>",this.dataSource)
    });
  }
  appointmentReasonExcleForm: FormGroup = new FormGroup({
    // appointment_reason_excel: new FormControl("", [Validators.required]),
    appointment_reason_excel: new FormControl("", []),
    selectedlocation:new FormControl("", []),

  });
  
  excleSubmit() {
    this.isSubmitted = true;
    console.log("excelsubmittttt_______",this.appointmentReasonExcleForm.value);
    if (this.appointmentReasonExcleForm.value.selectedlocation == '' || this.appointmentReasonExcleForm.invalid) {
      this._coreService.showError("","Please enter required fields")
      return;
    }
    this.isSubmitted=false;
    const formData: any = new FormData();
    formData.append("loginPortalId", this.loginPortalId);
    formData.append("file", this.selectedFiles);
    formData.append('portalType',this.usertype)
    formData.append('selectedlocation',this.appointmentReasonExcleForm.value.selectedlocation)

   
    // uploadExcelMedicine
    this.fourPortalService
      .uploadExcelAppointmentReason(formData)
      .subscribe({
        next: (res) => {
          
          let encryptedData = { data: res };
          let response = this._coreService.decryptObjectData(encryptedData);
          console.log("uploadExcelAppointmentReason____", response);
          if (response.status) {
            this.getAllappointmentReason();
            this.toastr.success(response.message);
            this.closePopup();
          } else {
            this.toastr.error(response.message);
          }
        },
        error:(error: ErrorEvent) => {
          console.log(error.message,'error message');
          
          let encryptedData = { data: error.error };
          let response = this._coreService.decryptObjectData(encryptedData);
          if(!response.status) {
            this.toastr.error(response.message);
          }
        }
        
      
    });
  }

  addAppointmentReasons() {
    let creatorId = this._coreService.getLocalStorage("loginData")._id;
    this.isSubmitted = true;
    if (this.appointmentReasonForm.value.selectedlocation == '' || this.appointmentReasonForm.invalid) {
      this._coreService.showError("","Please enter required fields")
      return;
    }
    
    this.isSubmitted = false;
    this.loader.start();
    let reqData = {
      appointmentReasonArray:
        this.appointmentReasonForm.value.appointmentReasonsss,
        loginPortalId: this.loginPortalId,
        portalType:this.usertype,
        selectedlocation: this.appointmentReasonForm.value.selectedlocation,
        createdBy: creatorId,
    };
    console.log(reqData,"reqDataaaa______");
    
    this.fourPortalService
      .addAppointmentReason(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          console.log(response,"responseeeee______");
          this.loader.stop();
          this.toastr.success(response.message);
          this.appointmentReasonForm.reset();
          //this.getAllappointmentReason();
          this.closePopup();
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }
  
  updateAppointmentReasons() {
    this.isSubmitted = true
    const formValues = this.editappointmentReasonForm.value;
    
    if(!formValues.name)
    {
      this._coreService.showError("", "Please fill all required fields");
      return
    }
     
    this.isSubmitted = false;
    this.loader.start();
     console.log(this.editappointmentReasonForm.value,"valuesssss_______");
    this.fourPortalService
      .updateAppointmentReason(this.editappointmentReasonForm.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        console.log(response,"responseresponseee_____");
        

        if (response.status) {
          this.loader.stop();
          this.getAllappointmentReason();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  deleteAppointmentReasons() {
    this.loader.start();
    let reqData = {
      appointmentReasonId: this.appointmentReasonId,
      action_name: "delete",
      action_value: true,
    };
    this.fourPortalService
      .deleteAppointmentReason(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        console.log(response,"statusUpdated_______");
        
        if (response.status) {
          this.loader.stop();
          this.getAllappointmentReason();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
  }

  handleSearch(event: any) {
    this.searchText = event.target.value;
    this.getAllappointmentReason();
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllappointmentReason();
  }
  handletoggleChange(event: any, data: any) {
    this.editappointmentReasonForm.patchValue({
      appointmentReasonId: data._id,
      name: data?.name,
      active: event.checked,
      loginPortalId: data?.added_by_portal,
    });
    this.updateAppointmentReasons();
  }

  closePopup() {
    this.modalService.dismissAll("close");
    this.isSubmitted = false;
    this.appointmentReasonForm.reset();
    this.appointmentReasonsss.clear();
    this.appointmentReasonExcleForm.reset();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.getAllappointmentReason();
    this.addnewappointmentReason()
    this.selectfilename = "";
    this.selectedFiles = null;
  }

  //-------Form Array Handling----------------
  newappointmentReasonForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required]],
      active: [true, [Validators.required]],
    });
  }

  get appointmentReasonsss(): FormArray {
    return this.appointmentReasonForm.get("appointmentReasonsss") as FormArray;
  }

  addnewappointmentReason() {
    this.appointmentReasonsss.push(this.newappointmentReasonForm());
  }

  removeappointmentReason(i: number) {
    this.appointmentReasonsss.removeAt(i);
  }
  // add
  openVerticallyCenteredaddreason(addreasoncontent: any) {
    // this.getLocationDetails();
    this.modalService.open(addreasoncontent, {
      centered: true,
      size: "lg",
      windowClass: "add_reasons",
    });
  }
  //  Edit appointmentReason service modal
  openVerticallyCenterededitappointmentReasonservice(
    editappointmentReasonservicecontent: any,
    data: any
  ) {

    console.log(data,"datttttt_______");
    // this.getLocationDetails();

    this.selectedlocationvalue =data?.locationDetails?.hospital_or_clinic_location?.hospital_id;

    this.editappointmentReasonForm.patchValue({
      appointmentReasonId: data._id,
      name: data?.name,
      active: data?.active,
      loginPortalId: data?.added_by_portal,
      // selectedlocation:data?.locationDetails?.hospital_or_clinic_location?.location
    });
    // console.log("editappointmentReasonForm>>>>>>",this.editappointmentReasonForm.value)
    this.modalService.open(editappointmentReasonservicecontent, {
      centered: true,
      size: "md",
      windowClass: "edit_appointmentReason_service",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, appointmentReasonId: any) {
    this.appointmentReasonId = appointmentReasonId;
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

  downloadSampleExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");

    link.setAttribute("href", "assets/doc/appointment-reasons.xlsx");
    link.setAttribute("download", `appointment-reasons.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  selectFile(event) {
    console.log(event,"eventtt______");
    
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.selectedFiles = file;
      console.log(this.selectedFiles,"selectedFilessss_____");
      
    }
  }

  openVerticallyCenteredEditplan(imporsubscriber: any) {
    // this.csvFor = csvFor;
    // this.getLocationDetails();
    this.modalService.open(imporsubscriber, {
      centered: true,
      windowClass: "import_subscribes",
      size: "lg"
    });
  }

  getLocationDetails() {
    let reqData = {
      portal_user_id: this.loginPortalId,
      type:this.usertype
    }
    this.fourPortalService.getLocationDetailsById(reqData).subscribe(
      (res) => {
        let response = this._coreService.decryptObjectData({ data: res });
        let arr= response.body[0]?.hospital_or_clinic_location;
        arr.map((curentval: any) => {
          this.allLocations.push({
            label: curentval?.hospital_name,
            value: curentval?.hospital_id,
          });
        });
        console.log("allLocations details------->", this.allLocations);
      },
    );
  }

  handleLocationFilter(value: any) {
    console.log("this.value",value);
    this.selectedlocationId = value.value;
    console.log("this.role",this.selectedlocationId);
    this.getAllappointmentReason();
  }
}
