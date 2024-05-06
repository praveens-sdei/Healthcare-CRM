import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/shared/core.service';
import { MatTableDataSource } from "@angular/material/table";
import { SuperAdminService } from '../../super-admin/super-admin.service';
import * as XLSX from "xlsx";
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
  selector: 'app-individual-doctor-medicalproductstests',
  templateUrl: './individual-doctor-medicalproductstests.component.html',
  styleUrls: ['./individual-doctor-medicalproductstests.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IndividualDoctorMedicalproductstestsComponent implements OnInit {
  isTabSelected: boolean = false;

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
  userRole: any;
  innerMenuPremission:any=[];



  constructor(
    private toastr: ToastrService,
    private _coreService: CoreService,
    private service: SuperAdminService,
    private modalService: NgbModal,
    private loader: NgxUiLoaderService
  ) {
    let userData = this._coreService.getLocalStorage('loginData')

    this.userId = userData._id;
    this.userRole = userData?.role;
  }
  onSortData(column:any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getMedicines(`${column}:${this.sortOrder}`);
    this.getlabList(`${column}:${this.sortOrder}`);
    this.getAllImagingList(`${column}:${this.sortOrder}`);
    this.getAllOther(`${column}:${this.sortOrder}`);
    this.getAllVaccination(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {
    this.getMedicines(`${this.sortColumn}:${this.sortOrder}`);
    this.getlabList(`${this.sortColumn}:${this.sortOrder}`);
    this.getAllImagingList(`${this.sortColumn}:${this.sortOrder}`);
    this.getAllOther(`${this.sortColumn}:${this.sortOrder}`);
    this.getAllVaccination(`${this.sortColumn}:${this.sortOrder}`);
    setTimeout(() => {
      this.checkInnerPermission();
    }, 2000);
  }


  findObjectByKey(array, key, value) {
    return array.find(obj => obj[key] === value);
  }

  checkInnerPermission(){

    let userPermission = this._coreService.getLocalStorage("loginData").permissions;

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

    if (type == "other") {
      /* generate worksheet */
      this.loader.start();
      var data: any = [];
      this.pageSize = 0;
      this.service.othersTestTestMasterListforexport(this.page, this.pageSize, this.searchText)
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

          var fileName = 'SheetJS.xlsx';

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


}
