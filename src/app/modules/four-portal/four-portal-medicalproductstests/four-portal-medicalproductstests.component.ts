import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/shared/core.service';
import { MatTableDataSource } from "@angular/material/table";
import { SuperAdminService } from '../../super-admin/super-admin.service';
import * as XLSX from "xlsx";
import { FormBuilder, FormGroup,Validators,FormControl, FormArray } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';


export interface PeriodicElement {
  medicinename: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];


export interface LabtestElement {
  labtest: string;
}

const LAB_TEST: LabtestElement[] = [];


export interface ImaginNAme {
  imagingname: string;
}

const IMAGIN_NAME: ImaginNAme[] = [];

export interface VaccinationName {
  vaccinationname: string;
}

const VACCINATION_NAME: VaccinationName[] = [];

export interface OtherName {
  othername: string;
}

const OTHER_NAME: OtherName[] = [];

@Component({
  selector: 'app-four-portal-medicalproductstests',
  templateUrl: './four-portal-medicalproductstests.component.html',
  styleUrls: ['./four-portal-medicalproductstests.component.scss']
})
export class FourPortalMedicalproductstestsComponent implements OnInit {

  eyeglassesdisplayedColumns: string[] = [
    "eyeglassesname",
    //"addedby",
    //"status",
    //"action",
  ];

  isTabSelected: boolean = false;


  eyeglassesdataSource: any = [];
  editEyeGlassesForm!: FormGroup;
  eyeGlassesForm!: FormGroup;
  isSubmitted: boolean = false;
  eyeGlassesId: any;
  eyeglass_name: any;

  loading: boolean = false;
  displayedColumns: string[] = ['medicinename'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  page: any = 1;
  pageSize: number = 20;
  totalLength: number = 0;
  searchText: string = '';
  userId: string;
  medicineDataSource: any;
  medicineName: string;
  inn: string;
  dossage: string;
  pharmaFormulation: string;
  adminRoute: string;
  therapeuticClass: string;
  manuFacturer: string;
  presciptionDelivery: string;
  other: string;
  webLink: string;
  medicineId: string;
  allMedicineDetails: any[] = [];
  @ViewChild('medicinecontent', { static: false }) medicinecontent: any;

  displayedColumnsone: string[] = ['labtest'];
  dataSourceone = new MatTableDataSource<LabtestElement>(LAB_TEST);
  lab_test: any;
  contributing_factors_to_abnormal_values: any;
  description: any;
  blood: any;
  urine: any;
  clinical_warning: any;
  lab_other: any;
  link: any;
  blood_low: any;
  blood_high: any;
  bloodprocess_before: any;
  blood_process_during: any;
  blood_process_after: any;
  urine_process_before: any;
  urine_process_during: any;
  urine_process_after: any;
  urine_high: any;
  urine_low: any;
  allLabDetails: any[] = [];
  labtotalLength: any;
  category: any;
  labDataSource: any;

  displayedColumnstwo: string[] = ['imagingname'];
  dataSourcetwo = new MatTableDataSource<ImaginNAme>(IMAGIN_NAME);
  imagingtotalLength: any;
  imagingdataSource: any;
  infoDetails: any;
  @ViewChild("imagingcontent", { static: false }) imagingcontent: any;

  selectedFiles: any;
  displayedColumnsthree: string[] = ['vaccinationname'];
  dataSourcethree = new MatTableDataSource<VaccinationName>(VACCINATION_NAME);

  displayedColumnsfour: string[] = ['othername'];
  dataSourcefour = new MatTableDataSource<OtherName>(OTHER_NAME);
  otherdataSource: any;
  otherstotalLength: any;
  @ViewChild("othercontent", { static: false }) othercontent: any;
  vaccinationdataSource: any;
  vaccinationtotalLength: any;

  sortColumn: string = 'medicine_name';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';

  loginUserInfo: any = '';
  loginPortalId: any = '';
  portalType: any = '';

  isDentel:boolean = false;
  isOptical:boolean = false;
  isParamedicalProfessions:boolean = false;
  isLabImaging:boolean = false;
  innerMenuPremission: any=[];
  userRole: any;

  constructor(
    private toastr: ToastrService,
    private _coreService: CoreService,
    private service: SuperAdminService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private superAdminService:SuperAdminService,
    private loader: NgxUiLoaderService
  ) {
    this.editEyeGlassesForm = this.fb.group({
      id: [""],
      eyeglass_name: ["", [Validators.required]],
      status: [""],
    });

    this.eyeGlassesForm = this.fb.group({
      eyeglassesss: this.fb.array([]),
    });

    let userData = this._coreService.getLocalStorage('loginData')
    this.portalType = userData?.type
    this.userRole= userData?.role;
    this.userId = userData._id
  }
  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    //this.getMedicines(`${column}:${this.sortOrder}`);
    
    this.getlabList(`${column}:${this.sortOrder}`);
    this.getAllImagingList(`${column}:${this.sortOrder}`);
    this.getAllOther(`${column}:${this.sortOrder}`);
    this.getAllVaccination(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {

    this.loginUserInfo = localStorage.getItem('loginData')

    if (this.loginUserInfo) {
      const loginUserInfo = JSON.parse(this.loginUserInfo);
      this.loginPortalId = loginUserInfo._id
      console.log(this.portalType,"LoginPortalIddd_____", this.loginPortalId);
    }

    if(this.portalType === 'Paramedical-Professions'){
      console.log("PPPPPPPPPPPPPPPPPPPP");
      
      this.isParamedicalProfessions = true;
      this.getlabList(`${this.sortColumn}:${this.sortOrder}`);
    }
    if(this.portalType === 'Dental'){
      this.isDentel = true;
      this.getAllOther(`${this.sortColumn}:${this.sortOrder}`);
    }
    if(this.portalType === 'Laboratory-Imaging'){
      this.isLabImaging = true
      this.getAllImagingList(`${this.sortColumn}:${this.sortOrder}`);
    }
    if(this.portalType === 'Optical'){
      this.isOptical = true;
      this.getAllEyeGlassess(`${this.sortColumn}:${this.sortOrder}`);
    }

    //this.getMedicines(`${this.sortColumn}:${this.sortOrder}`);
    //this.getAllVaccination(`${this.sortColumn}:${this.sortOrder}`);
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
        if (checkSubmenu.hasOwnProperty("about_us")) {
          this.innerMenuPremission = checkSubmenu['about_us'].inner_menu;
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

  eyeGlassesExcleForm: FormGroup = new FormGroup({
    eyeGlasses_csv: new FormControl("", [Validators.required]),
  });

  // tabChange
  tabChanged(event: any) {
    console.log("event", event);

    this.isTabSelected = true;
    console.log("this.isTabSelected", this.isTabSelected);

  }

  export(type) {
    console.log(type, "check");
    if (type == "medicine") {
      this.loader.start();
      var data: any = [];
      this.pageSize = 0;
      this.service.listMedicineforexport(this.page, this.pageSize, this.searchText)
        .subscribe((res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          this.loader.stop();
          var array = [
            "MedicineNumber",
            "MedicineName",
            "INN",
            "Dosage",
            "PharmaceuticalFormulation",
            "AdministrationRoute",
            "TherapeuticClass",
            "Manufacturer",
            "ConditionOfPrescription",
            "Other",
            "Link"
          ];
          data = result.data.array
          data.unshift(array);
          console.log("data", data);
          var fileName = 'SheetJS.xlsx';
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        });
    }

    if (type == "lab") {
      /* generate worksheet */
      this.loader.start();
      var data: any = [];
      this.pageSize = 0;
      this.service
        .getLabListDataexport(this.page, this.pageSize, this.searchText)
        .subscribe((res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          this.loader.stop();
          var array = ["category",
            "lab_test", "description", "contributing_factors_to_abnormal_values",
            "normal_value_blood",
            "normal_value_urine",
            "possible_interpretation_of_abnormal_blood_value_high_levels",
            "possible_interpretation_of_abnormal_blood_value_low_levels",
            "possible_interpretation_of_abnormal_urine_value_high_levels",
            "possible_interpretation_of_abnormal_urine_value_low_levels",
            "blood_procedure_before",
            "blood_procedure_during",
            "blood_procedure_after",
            "urine_procedure_before",
            "urine_procedure_during",
            "urine_procedure_after",
            "clinical_warning",
            "other",
            "link"];

          data = result.data.array

          data.unshift(array);
          console.log("data", data);

          var fileName = 'SheetJS.xlsx';

          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        });

    }

    if (type == "imaging") {
      /* generate worksheet */
      this.loader.start();
      var data: any = [];
      this.pageSize = 0;
      this.service.imagingTestMasterListforexport(this.page, this.pageSize, this.searchText)
        .subscribe((res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          this.loader.stop();
          var array = ["category",
            "imaging",
            "description",
            "clinical_consideration",
            "normal_values",
            "abnormal_values",
            "contributing_factors_to_abnormal",
            "procedure_before",
            "procedure_during",
            "procedure_after",
            "clinical_warning",
            "contraindications",
            "other",
            "link"];

          data = result.data.array

          data.unshift(array);
          console.log("data", data);

          var fileName = 'SheetJS.xlsx';

          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        });

    }
    if (type == "vaccination") {
      /* generate worksheet */
      this.loader.start();
      var data: any = [];
      this.pageSize = 0;
      this.service.vaccinationTestMasterListforexport(this.page, this.pageSize, this.searchText)
        .subscribe((res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          this.loader.stop();
          var array = [
            "name",
          ];

          data = result.data.array

          data.unshift(array);
          console.log("data", data);

          var fileName = 'SheetJS.xlsx';

          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        });
    }

    if (type == "optical") {
      this.loader.start();
      var data: any = [];
      this.pageSize = 0;
      this.superAdminService.listEyeglassMasterforexport(this.page, this.pageSize, this.searchText)
        .subscribe((res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          this.loader.stop();
          var array = [
            "eyeglass_name",
          ];
  
          data = result.data.array
  
          data.unshift(array);
          console.log("data", data);
  
          var fileName = 'EyeglassesFile.xlsx';
  
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        });

    }

    if (type == "other") {
      this.loader.start();
      var data: any = [];
      this.pageSize = 0;
      this.superAdminService.othersTestTestMasterListforexport(this.page, this.pageSize, this.searchText)
        .subscribe((res) => {
          let result = this._coreService.decryptObjectData({ data: res });
          this.loader.stop();
          var array = [
            "category",
            "others",
            "description",
            "clinical_consideration",
            "normal_values",
            "abnormal_values",
            "contributing_factors_to_abnormal",
            "procedure_before",
            "procedure_during",
            "procedure_after",
            "clinical_warning",
            "contraindications",
            "other",
            "link"
          ];
  
          data = result.data.array
  
          data.unshift(array);
          console.log("data", data);
  
          var fileName = 'OtherFile.xlsx';
  
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        });

    }
  }

  //-------------------------->Medicine
  getMedicines(sort:any='') {
    this.loading = true;
    this.service.getmedicineList(
      this.page,
      this.pageSize,
      this.userId,
      this.searchText,
      sort
    ).subscribe((res) => {
      let result = this._coreService.decryptObjectData({ data: res });
      // this.allMedicineDetails = [];
      this.dataSource = result?.body?.data;
      this.medicineDataSource = result?.body?.data
      this.allMedicineDetails = [];
      this.totalLength = result?.body?.totalRecords;

      let pendingData: any = [];

      result.body.data.forEach((val: any, index: number) => {
        let medicineData = {
          medicinename: val.medicine_name,
          id: val._id
        }
        pendingData.push(medicineData);
        this.allMedicineDetails.push(val);
      });
      this.loading = false;
      this.dataSource = pendingData;
    });
  }

  handleMedicinePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getMedicines();
  }
  // medicine info modal
  openVerticallyCenteredmedicine(medicinecontent: any) {
    this.modalService.open(medicinecontent, { centered: true, size: 'lg', windowClass: "master_modal medicine" });
  }
  getMedicineDetails(medId: any) {

    let filterData = this.allMedicineDetails.filter(i => medId.includes(i._id));

    this.medicineName = filterData[0].medicine_name ? filterData[0].medicine_name : '';
    this.inn = filterData[0].inn ? filterData[0].inn : '';
    this.dossage = filterData[0].dosage ? filterData[0].dosage : '';
    this.pharmaFormulation = filterData[0].pharmaceutical_formulation ? filterData[0].pharmaceutical_formulation : '';
    this.adminRoute = filterData[0].administration_route ? filterData[0].administration_route : '';
    this.therapeuticClass = filterData[0].therapeutic_class ? filterData[0].therapeutic_class : '';
    this.manuFacturer = filterData[0].manufacturer ? filterData[0].manufacturer : '';
    this.presciptionDelivery = filterData[0].condition_of_prescription ? filterData[0].condition_of_prescription : '';
    this.other = filterData[0].other ? filterData[0].other : '';
    this.webLink = filterData[0].link ? filterData[0].link : '';

    this.openVerticallyCenteredmedicine(this.medicinecontent);

  }

  //-------------------------->Lab
  getlabList(sort:any='') {
    // this.loading = true;
    this.service
      .getLabListData(this.page, this.pageSize, this.searchText,sort)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        this.dataSourceone = result?.data?.result;
        this.labDataSource = result?.data?.result
        this.allLabDetails = [];

        let pendingData: any = [];

        result.data.result.forEach((val: any, index: number) => {
          let labData = {
            labtest: val.lab_test,
            id: val._id,
            urine_procedure: val.urine_procedure,
            possible_interpretation_of_abnormal_blood_value:
              val.possible_interpretation_of_abnormal_blood_value,
            possible_interpretation_of_abnormal_urine_value:
              val.possible_interpretation_of_abnormal_urine_value,
            other: val.other,
            normal_value: val.normal_value,
            link: val.link,
            is_deleted: val.is_deleted,
            description: val.description,
            contributing_factors_to_abnormal_values:
              val.contributing_factors_to_abnormal_values,
            clinical_warning_val: val.clinical_warning,
            category: val.category,
            blood_procedure: val.blood_procedure,
            added_by: val.added_by,
          };
          pendingData.push(labData);
          this.allLabDetails.push(val);
        });
        // this.loading = false;
        this.dataSourceone = pendingData;
        this.labtotalLength = result.data.count;
      });
  }
  handleLabPageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getlabList();
  }
  // labtest modal
  openVerticallyCenteredlabtest(labtestcontent: any, element: any) {
    this.category = element.category;
    this.lab_test = element.labTest;
    this.description = element.description;
    this.contributing_factors_to_abnormal_values =
      element.contributing_factors_to_abnormal_values;
    //this.active= element.status,

    this.blood = element.normal_value.blood;
    this.urine = element.normal_value.urine;

    this.blood_high =
      element.possible_interpretation_of_abnormal_blood_value.high_levels;
    this.blood_low =
      element.possible_interpretation_of_abnormal_blood_value.low_levels;

    this.urine_high =
      element.possible_interpretation_of_abnormal_urine_value.high_levels;
    this.urine_low =
      element.possible_interpretation_of_abnormal_urine_value.low_levels;

    this.bloodprocess_before = element.blood_procedure.before;
    this.blood_process_during = element.blood_procedure.during;
    this.blood_process_after = element.blood_procedure.after;

    this.urine_process_before = element.urine_procedure.before;
    this.urine_process_during = element.urine_procedure.during;
    this.urine_process_after = element.urine_procedure.after;

    this.clinical_warning = element.clinical_warning_val;
    this.lab_other = element.other;
    this.link = element.link;

    this.modalService.open(labtestcontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }

  //---------------------------->Imaging
  getAllImagingList(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      status: null,
      sort:sort
    };
    this.service.listImagingApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.imagingtotalLength = response?.data?.count;
      this.imagingdataSource = response?.data?.result;
      this.dataSourcetwo = response?.data?.result;

    });
  }

  handleImagingPageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllImagingList();
  }

  getImagingDetails(id: any) {
    let imagingID = id;
    this.service.otherImagingDetailsApi(imagingID).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.infoDetails = response?.data;
      // console.log("this.imagingID==========>", this.infoDetails);
    });
    this.openVerticallyCenteredimaging(this.imagingcontent);
  }
  // Imaging modal
  openVerticallyCenteredimaging(imagingcontent: any) {
    this.modalService.open(imagingcontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }

  // ----------------------------->Others
  getAllOther(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      sort:sort
    };
    this.service.listOthersApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.otherstotalLength = response?.data?.count;
      this.dataSourcefour = response?.data?.result;
    });
  }

  handleOthersPageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllOther();
  }
  // info-details
  getOthersDetails(id) {
    let otherID = id;
    this.service.otherInfoDetailsApi(otherID).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
      this.infoDetails = response?.data;
    });
    this.openVerticallyCenteredother(this.othercontent);
  }
  //Othermodal
  openVerticallyCenteredother(othercontent: any) {
    this.modalService.open(othercontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }


  // --------------------------->Vaccinations
  getAllVaccination(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      sort:sort
    };
    this.service.listVaccinationApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("vaccination====>", response);
      this.vaccinationtotalLength = response?.data?.count;
      this.vaccinationdataSource = response?.data?.result;
      this.dataSourcethree = response?.data?.result;

    });
  }

  handleVaccinationPageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllOther();
  }


  handleSearchFilterForMedicine(event: any) {
    this.searchText = event.target.value;
    console.log(this.searchText,"searchTextMedicine______");
    this.getMedicines();
  }

  handleSearchFilterForLabTest(event: any) {
    this.searchText = event.target.value;
    console.log(this.searchText,"searchTextLab______");
    this.getlabList();
  }

  handleSearchFilterForImaging(event: any) {
    this.searchText = event.target.value;
    console.log(this.searchText,"searchTextImaging______");
    this.getAllImagingList();
  }

  handleSearchFilterForVaccination(event: any) {
    this.searchText = event.target.value;
    console.log(this.searchText,"searchTextVaccnitation______");
    this.getAllVaccination();
  }

  handleSearchFilterForOtherName(event: any) {
    this.searchText = event.target.value;
    console.log(this.searchText,"searchTextOtherName______");
    this.getAllOther();
  }






  excleSubmit() {
    this.isSubmitted = true;
    if (this.eyeGlassesExcleForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append("user_id", this.userId);
    formData.append("file", this.selectedFiles);
    // console.log("formdata", formData);
    // uploadExcelMedicine
    this.service.uploadExcelEyeGlasses(formData).subscribe(
      (res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        // console.log("formData======>", response);
        if (response.status) {
          this.selectedFiles=null;
          this.getAllEyeGlassess();
          this.toastr.success(response.message);
          this.closePopup();
          this._coreService.setCategoryForService(1);
        } else {
          this.selectedFiles=null;

          this.toastr.error(response.message);
        }
      },
      (error: any) => {
        let encryptedData = { data: error.error };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (!response.status) {
          this.toastr.error(response.message);
        }
      }
    );
  }

  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/eyeGlassMaster.xlsx");
    link.setAttribute("download", `eyeGlassSampleFile.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.selectedFiles = file;
    }
  }

  // exportEyeGlasses() {
  //   window.location.href =
  //     "https://mean.stagingsdei.com:451/healthcare-crm-hospital/hospital/export-eyeglass-master";
  // }

  exportEyeGlasses() {
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this.service.listEyeglassMasterforexport(this.page, this.pageSize, this.searchText)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        var array = [
          "eyeglass_name",
        ];

        data = result.data.array

        data.unshift(array);
        console.log("data", data);

        var fileName = 'EyeglassesFile.xlsx';

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, fileName);
      });
  }
  
  getAllEyeGlassess(sort:any='') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      userId: this.userId,
      searchText: this.searchText,
      status: null,
      sort:sort
    };
    this.service.listEyeglassessApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.totalLength = response?.data?.totalRecords;
      this.eyeglassesdataSource = response?.data?.result;
      console.log(this.eyeglassesdataSource, "eyeglassesdataSource");
    });
  }

  addEyeGlassess() {
    let reqData = {
      eyeglassData: this.eyeGlassesForm.value.eyeglassesss,
      added_by: this.userId,
    };

    this.service.addEyeglassessApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.toastr.success(response.message);
        this.getAllEyeGlassess();
        this.closePopup();
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  updateEyeGlassess() {
    this.service
      .updateEyeglassessApi(this.editEyeGlassesForm.value)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        // console.log("eyeglassess======>", response);
        if (response.status) {
          this.getAllEyeGlassess();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.toastr.error(response.message);
        }
      });
  }

  selectedEyeglasses: any = [];

  deleteEyeglassess(isDeleteAll: any = "") {
    let reqData = {
      id: this.eyeGlassesId,
      action_name: "delete",
      action_value: true,
    };

    if (isDeleteAll === "all") {
      reqData.id = "";
    } else {
      reqData.id = this.selectedEyeglasses;
    }

    console.log("REQ DATA Delete --->", reqData);

    this.service
      .deleteEyeglassessApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.getAllEyeGlassess();
          this.toastr.success(response.message);
          this.closePopup();
          this.selectedEyeglasses = [];
        } else {
          this.toastr.error(response.message);
        }
      });
  }

  handleSearchEyeGlasses(event: any) {
    this.searchText = event.target.value;
    this.getAllEyeGlassess();
  }

  closePopup() {
    this.isSubmitted = false;
    this.eyeGlassesForm.reset();
    this.eyeGlassesExcleForm.reset();
    this.eyeglassesss.clear();
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.addNewEyeGlasses();
  }

  handlePageEvent(data: any) {
    console.log(data);
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllEyeGlassess();
  }

  handletoggleChange(event: any, data: any) {
    let reqData = {
      id: data?._id,
      action_name: "active",
      action_value: event.checked,
    };

    this.service
      .deleteEyeglassessApi(reqData)
      .subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.getAllEyeGlassess();
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
      });
  }

  //-------Form Array Handling----------------
  newEyeGlassesForm(): FormGroup {
    return this.fb.group({
      eyeglass_name: ["", [Validators.required]],
      status: [false],
    });
  }

  get eyeglassesss(): FormArray {
    return this.eyeGlassesForm.get("eyeglassesss") as FormArray;
  }

  addNewEyeGlasses() {
    this.eyeglassesss.push(this.newEyeGlassesForm());
  }

  removeEyeGlasses(i: number) {
    this.eyeglassesss.removeAt(i);
  }
  //  Add Eyeglasses modal
  openVerticallyCenteredAddeyeglasses(addeyeglassescontent: any) {
    this.modalService.open(addeyeglassescontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal add_lab",
    });
  }

  //  Edit Eyeglasses modal

  openVerticallyCenteredediteyeglasses(editeyeglassescontent: any, data: any) {
    this.editEyeGlassesForm.patchValue({
      id: data?._id,
      eyeglass_name: data?.eyeglass_name,
      status: data?.status,
    });
    this.modalService.open(editeyeglassescontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal edit_lab",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, eyeGlassesId: any) {
    this.eyeGlassesId = eyeGlassesId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }

  //add import modal
  openVerticallyCenteredimport(imporMedicine: any) {
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "lg",
      windowClass: "master_modal import",
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

  makeSelectAll(event: any) {
    if (event.checked == true) {
      this.eyeglassesdataSource?.map((element) => {
        if (!this.selectedEyeglasses.includes(element?._id)) {
          this.selectedEyeglasses.push(element?._id);
        }
      });
    } else {
      this.selectedEyeglasses = [];
    }
  }

  handleCheckBoxChange(event, medicineId) {
    if (event.checked == true) {
      this.selectedEyeglasses.push(medicineId);
    } else {
      const index = this.selectedEyeglasses.indexOf(medicineId);
      if (index > -1) {
        this.selectedEyeglasses.splice(index, 1);
      }
    }
  }

  isAllSelected() {
    let allSelected = false;
    if (
      this.selectedEyeglasses?.length === this.eyeglassesdataSource?.length &&
      this.selectedEyeglasses?.length != 0
    ) {
      allSelected = true;
    }
    return allSelected;
  }

}
