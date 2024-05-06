import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuperAdminHospitalService } from 'src/app/modules/super-admin/super-admin-hospital.service';
import { SuperAdminIndividualdoctorService } from 'src/app/modules/super-admin/super-admin-individualdoctor.service';
import { PharmacyService } from 'src/app/modules/pharmacy/pharmacy.service';
import { SuperAdminService } from 'src/app/modules/super-admin/super-admin.service';
import { CoreService } from 'src/app/shared/core.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
export interface PeriodicElement {
  complaintype: string;
  complaintid: string;
  complaintreason: string;
  complaintagainsttype: string;
  complaintagainstname: string;
  status: string;
  dateandtimeofcomplaint: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  { complaintype: 'Found Difficulty', complaintid: 'Super Admin', complaintreason: 'Lorem Ipsum is simply dummy text of the printing and typesetting...', complaintagainsttype: 'Super Admin', complaintagainstname: 'Super Admin', status: 'Solved', dateandtimeofcomplaint: '08-21-2022 | 03:50Pm' },

];

@Component({
  selector: 'app-complaintlist',
  templateUrl: './complaintlist.component.html',
  styleUrls: ['./complaintlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComplaintlistComponent implements OnInit {

  displayedColumns: string[] = ['dateofcreation','complaintype', 'complaintid','complaintreason','complaintagainsttype','complaintagainstname','status', 'dateandtimeofcomplaint','action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  addComplaintForm!: FormGroup;
  selectedOption: string;
  pageSize: number = 10;
  totalLength: number = 0;
  page: any = 1;
  verifyStatus: any = "APPROVED";
  searchText = "";
  insuraneList: any[] = [];
  commonList: any[] = [];
  overlay: false;
  isSubmitted: any = false;
  compalintdataSource: any = [];
  userId: any;
  userName: any;
  loginRole: any;
  userRole: any;

  sortColumn: string = 'complaint_subject';
  sortOrder: 1 | -1 = 1;
  sortIconClass: string = 'arrow_upward';

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private modalService: NgbModal,
    private hospitalService: SuperAdminHospitalService,
    private _coreService: CoreService,
    private doctorService: SuperAdminIndividualdoctorService,
    private _superAdminService: SuperAdminService,
    private pharmacyService: PharmacyService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loader : NgxUiLoaderService


  ) {

    let loginData = JSON.parse(localStorage.getItem("loginData"));
    let profileData = JSON.parse(localStorage.getItem("profileData"));
    this.userId = loginData?._id;
    this.userRole = loginData?.role
    this.userName = profileData?.first_name + " " + profileData?.last_name;
    console.log("loginData", this.userName);
  }

  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 1? -1 : 1;
    this.sortIconClass = this.sortOrder === 1? 'arrow_upward' : 'arrow_downward';
    this.getComplaintList(`${column}:${this.sortOrder}`);
  }

  
  ngOnInit(): void {
    this.getComplaintList(`${this.sortColumn}:${this.sortOrder}`);


    this.addComplaintForm = this.fb.group({
      complaint_subject: ["", [Validators.required]],
      provider_type_to: ["", [Validators.required]],
      complaint_to_user_id: ["", [Validators.required]],
      complaint_to_user_name: ["",],
      complaint_body: ["", [Validators.required]],
      dateofcreation:[new Date()]


    });

  }


  closePopup() {
    this.modalService.dismissAll();
    this.addComplaintForm.reset();
  }
  get form(): { [key: string]: AbstractControl } {
    return this.addComplaintForm.controls;
  }
  getComplaintList(sort:any='') {
    let reqData = {
      page: this.page,
      limit: 0,
      searchText: this.searchText,
      type: 'patient',
      userId: this.userId,
      sort:sort
    };
    this._superAdminService.getComplaintList(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.dataSource = response?.body?.data;
      this.compalintdataSource = response?.body?.data;
      this.totalLength = response?.body?.totalRecords

      console.log("getComplaintList----------------->", response);
    });
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getComplaintList();
  }

  handleSelctionChange(event: any) {
    this.addComplaintForm.patchValue({
      complaint_to_user_name: event?.option?.label
    })
  }




  // function to generate random code

  generateCode(length) {
    const charset = "0123456789";

    let code = "";
    for (let i = 0; i < length; i++) {
      let randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    return code;
  }

  submitAddComplaint() {
    this.isSubmitted = true;
    if (this.addComplaintForm.invalid) {
      return;
    }
    let myreferalcode = this.generateCode(7);
    console.log("myreferalcode", myreferalcode);
    // return;
    this.isSubmitted = false;
    this.loader.start();
    let data = this.addComplaintForm.value
    data.complaint_from_user_id = this.userId,
      data.complaint_from_user_name = this.userName,
      data.provider_type_from = this.userRole
    data.complaint_id = myreferalcode
    this._superAdminService.addComplaint(data).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getComplaintList();
        this.closePopup();
        this._coreService.setCategoryForService(1);
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }


  async getInsuranceId(event: any) {
    console.log(event, "getInsuranceId Event");

    if (event != undefined) {
      this.addComplaintForm.value.complaint_to_user_id = event;


    }
  }

  onSelectChange(event: any) {
    this.selectedOption = event.value;
    if (this.selectedOption === "insurance") {
      this.getInsuranceList();
    } else if (this.selectedOption === "hospital") {
      this.getAllHospitalList();
    } else if (this.selectedOption === "doctor") {
      this.getDoctorsList();
    }  else if (this.selectedOption === "Dental") {
      this.getDentalList();
    } else if (this.selectedOption === "Optical") {
      this.getOpticalList();
    }else if (this.selectedOption === "Laboratory-Imaging") {
      this.getLaboratoryList();
    }else if (this.selectedOption === "Paramedical-Professions") {
      this.getParamedicalProfessionsList();
    }
    else {
      this.getPharmacyList();
    }
  }
  getPharmacyList() {
    let requestData = {
      name: this.searchText,
      status: this.verifyStatus,
    };
    this.pharmacyService.getlistApprovedPharmacyAdminUserparams(requestData).subscribe({
      next: (res) => {

        let encryptedData = { data: res };
        let result = this._coreService.decryptObjectData(encryptedData);
        console.log("getPharmacyList==>", result)

        if (result.status) {
          this.commonList = [];
          result.data.data.map((curentval, index) => {
            this.commonList.push({
              label: curentval.pharmacy_name,
              value: curentval.for_portal_user._id,
            });
          });
        } else {
          this._coreService.showError(result.message, "");
        }
      },
      error: (err: ErrorEvent) => {
        this._coreService.showError("", err.message);
      },
    });
  }
  getInsuranceList() {
    const param = {
      page: this.page,
      limit: 0,
      searchText: this.searchText,
      startDate: "",
      endDate: "",
    };
    this._superAdminService.getApprovedData(param).subscribe((res) => {
      let result = this._coreService.decryptObjectData(res);
      console.log("getInsuranceList==>", result)

      if (result.status) {
        this.commonList = [];
        result.body.result.map((curentval, index) => {
          this.commonList.push({
            label: curentval.company_name,
            value: curentval.for_portal_user._id,
          });
        });
      } else {
        this._coreService.showError(result.message, "");
      }
    });
  }
  getDoctorsList() {
    let reqData = {
      page: this.page,
      limit: 0,
      status: this.verifyStatus,
      searchText: this.searchText
    };
    this.doctorService.doctorsList(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("DOCTOR LIST RESPONSE==>", response)
      if (response.status) {
        this.commonList = [];
        response.data.data.map((curentval, index) => {
          this.commonList.push({
            label: curentval.full_name,
            value: curentval.for_portal_user._id,
          });
        });
      } else {
        this._coreService.showError(response.message, "");
      }


    });
  }
  getAllHospitalList() {
    let reqData = {
      page: this.page,
      limit: 0,
      status: this.verifyStatus,
      searchText: this.searchText,
      // sort:sort
    };
    this.hospitalService.hospitalList(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("getAllHospitalList==>", response)

      if (response.status) {
        this.commonList = [];
        response.data.data.map((curentval, index) => {
          this.commonList.push({
            label: curentval.hospital_name,
            value: curentval.for_portal_user._id,
          });
        });
      } else {
        this._coreService.showError(response.message, "");
      }
    });
  }

  //  Add Imaging modal
  openVerticallyCenteredAddComplaint(addcomplaintcontent: any) {
    this.modalService.open(addcomplaintcontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_lab",
    });
  }
  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };

  getDentalList() {
    let reqData = {
      type:"Dental"
    };
    this.doctorService.DentalList(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.commonList = [];
        response?.data?.map((curentval, index) => {
          this.commonList.push({
            label: curentval?.full_name,
            value: curentval?._id,
          });
        });
      } else {
        this._coreService.showError(response.message, "");
      }


    });
  }

  getOpticalList() {
    let reqData = {
      type:"Optical"
    };
    this.doctorService.DentalList(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.commonList = [];
        response?.data?.map((curentval, index) => {
          this.commonList.push({
            label: curentval?.full_name,
            value: curentval?._id,
          });
        });
      } else {
        this._coreService.showError(response.message, "");
      }


    });
  }

  getLaboratoryList() {
    let reqData = {
      type:"Laboratory-Imaging"
    };
    this.doctorService.DentalList(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.commonList = [];
        response?.data?.map((curentval, index) => {
          this.commonList.push({
            label: curentval?.full_name,
            value: curentval?._id,
          });
        });
      } else {
        this._coreService.showError(response.message, "");
      }


    });
  }

  getParamedicalProfessionsList() {
    let reqData = {
      type:"Paramedical-Professions"
    };
    this.doctorService.DentalList(reqData).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      console.log("response-----",response);
      
      if (response.status) {
        this.commonList = [];
        response?.data?.map((curentval, index) => {
          this.commonList.push({
            label: curentval?.full_name,
            value: curentval?._id,
          });
        });
      } else {
        this._coreService.showError(response.message, "");
      }


    });
  }
}
