import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { SuperAdminService } from "../super-admin.service";
import * as XLSX from "xlsx";
import { ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";

// Medicines table data
export interface PeriodicElement {
  medicinename: string;
  addedby: string;
  status: string;
  action: string;
  id: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  // { medicinename: 'Augmentin 625 Duo Tablet', addedby: 'healthcare-crm' },
];

@Component({
  selector: "app-super-admin-master",
  templateUrl: "./super-admin-master.component.html",
  styleUrls: ["./super-admin-master.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SuperAdminMasterComponent implements OnInit {
  loading: boolean = false;
  // Medicines table data
  displayedColumns: string[] = ["createdAt","medicinename", "addedby", "status", "action"];
  // dataSource = ELEMENT_DATA;
  dataSource:any=[];
  // Exclusion table data

  medicineForm: FormGroup;
  medicineExcelForm: FormGroup;
  isSubmitted: boolean;
  userId: string;
  medicineList: any;
  userData: any;
  page: any = 1;
  pageSize: number = 10;
  totalLength: number = 0;
  selectedFiles: any;
  allMedicineDetails: any[] = [];
  @ViewChild("medicinecontent", { static: false }) medicinecontent: any;
  @ViewChild("addmedicinecontent", { static: false }) addmedicinecontent: any;
  @ViewChild("editmedicinecontent", { static: false }) editmedicinecontent: any;
  activetab:number=0;
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
  searchText: string = "";
  sortColumn: string = 'medicine.medicine_name';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';
  selectedMedicines: any = [];
  innerMenuPremission:any=[];
  loginrole: any;
  selectedIndex: number = 0;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _coreService: CoreService,
    private service: SuperAdminService,
    private _superAdminService: SuperAdminService,
    private activatedRoute : ActivatedRoute,
    private loader : NgxUiLoaderService
  ) {
    let admin = this._coreService.getLocalStorage("loginData");
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
    this.userId = admin._id;

    this.medicineForm = this.fb.group({
      medicine: this.fb.array([]),
    });
    this.dataSource = [];
  }
onSortData(column:any) {
  this.sortColumn = column;
  this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
  this.getmedicinesList(`${column}:${this.sortOrder}`);
}
  ngOnInit(): void {
    this.addNewMedicine();
    this.getmedicinesList(`${this.sortColumn}:${this.sortOrder}`);
    setTimeout(() => {
      this.checkInnerPermission();
    }, 300);


    this.activatedRoute.queryParams.subscribe((params) => {
     
        this.activetab = params["activeTab"];
      
    });
   

    
    
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
        if (checkSubmenu.hasOwnProperty("medicines")) {
          this.innerMenuPremission = checkSubmenu['medicines'].inner_menu;
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

  public medicineExcleForm: FormGroup = new FormGroup({
    medicine_csv: new FormControl("", [Validators.required]),
  });

  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, medicineId: any) {
    this.medicineId = medicineId;
    this.modalService.open(deletePopup, { centered: true, size: "sm" });
  }

  public excleSubmit() {
    this.isSubmitted = true;
    if (this.medicineExcleForm.invalid) {
      return;
    }
    this.isSubmitted = false;
    this.loader.start();
    const formData = new FormData();
    formData.append("userId", this.userId);
    formData.append("medicine_csv", this.selectedFiles);
    // uploadExcelMedicine
    this._superAdminService.uploadExcelMedicine(formData).subscribe({
      next: (res) => {
        let encryptedData = { data: res };
      let result = this._coreService.decryptObjectData(encryptedData);
        // console.log(result, 'result');
        
        if (result.status) {
          this.loader.stop();
          this.selectedFiles='';
          this.closePopup();
          this.toastr.success(result.message);
          this.getmedicinesList();
        } else {
          this.loader.stop();
          this.toastr.error(result.message);
        }
      },
      error: (err) => {
        this.loader.stop();
        console.log(err);
      },
      complete: () => {
        this.loader.stop();
        console.log("request done");
      },
    });
  }
  selectedTab(event:any){
console.log("SElect",event.index);
this.activetab=event.index
  }


  downLoadExcel() {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", "assets/doc/medicines.xlsx");
    link.setAttribute("download", `medicine.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  public fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.selectedFiles = file;
    }
  }

  //..............AddMedicine.....................

  closePopup() {
    this.medicine.clear();
    this.medicineForm.reset();
    this.modalService.dismissAll("close");
    this.isSubmitted = false;
    this.addNewMedicine();
  }

  get medicine() {
    return this.medicineForm.controls["medicine"] as FormArray;
  }

  addNewMedicine() {
    const newMedicine = this.fb.group({
      number: [""],
      medicine_name: ["",[Validators.required]],
      inn: [""],
      dosage: [""],
      pharmaceutical_formulation: [""],
      administration_route: [""],
      therapeutic_class: [""],
      manufacturer: [""],
      condition_prescrip: [""],
      other: [""],
      status: [true],
    });
    this.medicine.push(newMedicine);
    // console.log(newMedicine)
  }

  get medicineControls() {
    return this.medicine.controls;
  }

  deleteMedicine(index: number) {
    this.medicine.removeAt(index);
  }

  addMedicines() {
    this.isSubmitted = true;
    if (this.medicineForm.invalid) {
      console.log("runnnnnnnnnnnnnn")
      this._coreService.showError("","Please Fill All the Fields")
      return;
    }
    this.isSubmitted = false;

    let medicineArray = [];
    for (const med of this.medicineForm.value.medicine) {
      medicineArray.push({
        medicine: med,
      });
    }
    this.loader.start();
    let reqData = {
      userId: this.userId,
      medicines: medicineArray,
    };
    this._superAdminService.addMedicine(reqData).subscribe((res: any) => {
      let response = this._coreService.decryptObjectData({ data: res });
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getmedicinesList();
        this.closePopup();
      } else if(response.status == false){
        this.loader.stop();
        this.toastr.error(response.message);
        this.closePopup();
      }
    });
  }

  public editMedicineForm: FormGroup = new FormGroup({
    // medicine_csv: new FormControl("",[Validators.required]),
    number: new FormControl(""),
    medicine_name: new FormControl("",[Validators.required]),
    inn: new FormControl(""),
    dosage: new FormControl(""),
    pharmaceutical_formulation: new FormControl(""),
    administration_route: new FormControl(""),
    therapeutic_class: new FormControl(""),
    manufacturer: new FormControl(""),
    condition_prescrip: new FormControl(""),
    other: new FormControl(""),
    link: new FormControl(""),
    status: new FormControl(""),
    _id: new FormControl(""),
  });

  public editMedcine(medId: any) {
    let filterData = this.allMedicineDetails.filter((i) =>
      medId.includes(i._id)
    );
    this.editMedicineForm.patchValue(filterData[0]);
    this.openVerticallyCenteredmedicine(this.editmedicinecontent);
  }

  public updateEditMedicines() {
    // console.log(this.editMedicineForm.value);
    this.isSubmitted = true;
    if (this.editMedicineForm.invalid) {
      this._coreService.showError("","Please Fill All the fields")
      return;
    } 
      this.isSubmitted = false;
    let medicienId = this.editMedicineForm.value._id;
    delete this.editMedicineForm.value._id;
    this.loader.start();
    let reqData = {
      medicineId: medicienId,
      medicines: this.editMedicineForm.value,
      // medicines: this.medicineForm.value.medicine
    };

    this._superAdminService.updateMedicine(reqData).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({data: res});
        // console.log('medicine updates', result);
        if (result.status) {
          this.loader.stop();
          this._coreService.showSuccess(result.message, "");
          this.closePopup();
          this.getmedicinesList();
        } else if(result.status == false){
          this.loader.stop();
          this._coreService.showError(result.message, "");
          this.closePopup();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    // console.log(reqData);
  }

  exportMedicine() {
    // this.loader.start();
    /* generate worksheet */
    var data: any = [];
    this.pageSize = 0;
    this.service.listMedicineforexport(this.page, this.pageSize, this.searchText)
      .subscribe((res) => {
        let result = this._coreService.decryptObjectData({ data: res });
        if(result.status.true){
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
          var fileName = 'MedicineExcel.xlsx';
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          /* generate workbook and add the worksheet */
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          /* save to file */
          XLSX.writeFile(wb, fileName);
        }
      });
  }

  getmedicinesList(sort: string='') {
    this.loading = true;
    this.service
      .getmedicineList(this.page, this.pageSize, this.userId, this.searchText,sort)
      .subscribe((res) => {
        // console.log("res",res)
        let result = this._coreService.decryptObjectData({data:res});
        console.log("---------MEDICINE LIST---------------------------->",result);
        this.allMedicineDetails = [];
        // this.allMedicineDetails = result.body.data.medicine;
        this.totalLength = result.body.totalRecords;

        let pendingData: any = [];

        result.body.data.forEach((val: any, index: number) => {
          let medicineData = {
            medicinename: val.medicine_name,
            addedby: val.added_by_name,
            status: val?.status,
            action: "",
            id: val._id,
            createdAt:val?.updatedAt
          };
          pendingData.push(medicineData);
          this.allMedicineDetails.push(val);
        });
        this.loading = false;
        this.dataSource = pendingData;
      });
  }

  getMedicineDetails(medId: any) {
    let filterData = this.allMedicineDetails.filter((i) =>
      medId.includes(i._id)
    );

    this.medicineName = filterData[0].medicine_name
      ? filterData[0].medicine_name
      : "";
    this.inn = filterData[0].inn ? filterData[0].inn : "";
    this.dossage = filterData[0].dosage ? filterData[0].dosage : "";
    this.pharmaFormulation = filterData[0].pharmaceutical_formulation
      ? filterData[0].pharmaceutical_formulation
      : "";
    this.adminRoute = filterData[0].administration_route
      ? filterData[0].administration_route
      : "";
    this.therapeuticClass = filterData[0].therapeutic_class
      ? filterData[0].therapeutic_class
      : "";
    this.manuFacturer = filterData[0].manufacturer
      ? filterData[0].manufacturer
      : "";
    this.presciptionDelivery = filterData[0].condition_of_prescription
      ? filterData[0].condition_of_prescription
      : "";
    this.other = filterData[0].other ? filterData[0].other : "";
    this.webLink = filterData[0].link ? filterData[0].link : "";

    this.openVerticallyCenteredmedicine(this.medicinecontent);
  }

  updateMedicineStatus(data: { checked: boolean }, index) {
    // console.log('databoolean',data.checked);

    // console.log(index);
    let filterData = this.allMedicineDetails.filter((i) =>
      index.includes(i._id)
    );
    this.loader.start();
    let reqData = {
      medicineId: index,
      medicines: {
        number: filterData[0].number ? filterData[0].number : "",
        medicine_name: filterData[0].medicine_name
          ? filterData[0].medicine_name
          : "",
        inn: filterData[0].inn ? filterData[0].inn : "",
        dosage: filterData[0].dosage ? filterData[0].dosage : "",
        pharmaceutical_formulation: filterData[0].pharmaceutical_formulation
          ? filterData[0].pharmaceutical_formulation
          : "",
        administration_route: filterData[0].administration_route
          ? filterData[0].administration_route
          : "",
        therapeutic_class: filterData[0].therapeutic_class
          ? filterData[0].therapeutic_class
          : "",
        manufacturer: filterData[0].manufacturer
          ? filterData[0].manufacturer
          : "",
        condition_prescrip: filterData[0].condition_of_prescription
          ? filterData[0].condition_of_prescription
          : "",
        other: filterData[0].other ? filterData[0].other : "",
        link: filterData[0].link ? filterData[0].link : "",
        status: data.checked,
      },
    };

    this._superAdminService.updateMedicine(reqData).subscribe({
      next: (res) => {
        let result = this._coreService.decryptObjectData({ data: res });

        if (result.status) {
          this.loader.stop();
          this._coreService.showSuccess(result.message, "");
          this.closePopup();
          this.getmedicinesList();
        } else {
          this.loader.stop();
          this.toastr.error(result.message);
        }
      },
      error: (err) => {
        this.loader.stop();
        console.log(err);

      }
    })
    // console.log(reqData);
  }

  handleSearch(event: any) {
    this.searchText = event.target.value;
    this.getmedicinesList();
  }

  deleteMed(isDeleteAll: any = "") {
    this.loader.start();
    let reqData = {
      medicineId: "",
    };

    if (isDeleteAll === "all") {
      reqData.medicineId = "";
    } else {
      reqData.medicineId = this.selectedMedicines;
    }

    console.log("DELETE REQUEST ===>", reqData);

    this._superAdminService.deleteMedicine(reqData).subscribe({
      next: (res) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        if (response.status) {
          this.loader.stop();
          this.toastr.success(response.message);
          this.closePopup();
          this.getmedicinesList();
          this.selectedMedicines = []
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public handlePageEventMedicine(data: {
    pageIndex: number;
    pageSize: number;
  }): void {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getmedicinesList();
  }

  reset() {
    this.medicineForm.reset();
  }

  handleClose() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
  }

  //  Add medicine modal
  openVerticallyCenteredAddmedicine(addmedicinecontent: any) {
    // console.log('add medicine popup open');

    this.modalService.open(this.addmedicinecontent, {
      centered: true,
      size: "xl",
      windowClass: "master_modal add_medicine",
    });
  }

  //add medicine import modal
  openVerticallyCenteredimport(imporMedicine: any) {
    this.modalService.open(imporMedicine, {
      centered: true,
      size: "md",
      windowClass: "master_modal import",
    });
  }
  // medicine modal
  openVerticallyCenteredmedicine(medicinecontent: any) {
    this.modalService.open(medicinecontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal medicine",
    });
  }

  //  Choose Insurance Company modal
  openVerticallyCenteredchooseinsurance(chooseinsurancecontent: any) {
    this.modalService.open(chooseinsurancecontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal choose_insurance",
    });
  }

  //  Add Type of Services  modal
  openVerticallyCenteredAddtypeofservicecontent(addtypeofservicecontent: any) {
    this.modalService.open(addtypeofservicecontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_typeofservice",
    });
  }

  //  Edit Type of Services  modal
  openVerticallyCenterededittypeofservice(edittypeofservicecontent: any) {
    this.modalService.open(edittypeofservicecontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal edit_typeofservice",
    });
  }

  //  Choose Insurance Company modal
  openVerticallyCenteredchooseinsurancetoscontent(
    chooseinsurance_toscontent: any
  ) {
    this.modalService.open(chooseinsurance_toscontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal choose_insurance",
    });
  }

  //  Add Category of Exclusion modal
  openVerticallyCenteredAddcatexclusioncontent(addcatexclusioncontent: any) {
    this.modalService.open(addcatexclusioncontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal add_lab",
    });
  }

  //  Edit Category of Exclusion modal
  openVerticallyCenterededitcatexclusion(editcatexclusioncontent: any) {
    this.modalService.open(editcatexclusioncontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal edit_lab",
    });
  }

  //  Choose Insurance Company modal
  openVerticallyCenteredchhosecatexcontent(chooseinsurance_catexcontent: any) {
    this.modalService.open(chooseinsurance_catexcontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal choose_insurance",
    });
  }

  //  Choose Insurance Company modal in exclusion
  openVerticallyCenteredexclusion(chooseinsurance_excontent: any) {
    this.modalService.open(chooseinsurance_excontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal choose_insurance",
    });
  }

  //  Add type of service modal
  openVerticallyCenteredaddexclusion(addexclusioncontent: any) {
    this.modalService.open(addexclusioncontent, {
      centered: true,
      size: "xl",
      windowClass: "master_modal add_exclusion",
    });
  }

  //  Edit type of service modal
  openVerticallyCenterededitexclusion(editexclusioncontent: any) {
    this.modalService.open(editexclusioncontent, {
      centered: true,
      size: "md",
      windowClass: "master_modal edit_exclusion",
    });
  }

  //  Add Field modal
  openVerticallyCenteredaddfield(addfieldcontent: any) {
    this.modalService.open(addfieldcontent, {
      centered: true,
      size: "lg",
      windowClass: "master_modal add_field",
    });
  }

  // // Edit Primary Insured Fields modal
  // openVerticallyCenterededitprimaryfield(editprimaryfieldcontent: any) {
  //   this.modalService.open(editprimaryfieldcontent, { centered: true,size: 'lg',windowClass : "master_modal edit_field" });
  // }

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
    console.log(this.dataSource,"gjhgk");
    
    if (event.checked == true) {
      this.dataSource.map((element) => {
        if (!this.selectedMedicines.includes(element?.id)) {
          this.selectedMedicines.push(element?.id);
        }
      });
    } else {
      this.selectedMedicines = [];
    }
  }

  handleCheckBoxChange(event, medicineId) {
    if (event.checked == true) {
      this.selectedMedicines.push(medicineId);
    } else {
      const index = this.selectedMedicines.indexOf(medicineId);
      if (index > -1) {
        this.selectedMedicines.splice(index, 1);
      }
    }
  }

  isAllSelected() {
    let allSelected = false;
    if (this.selectedMedicines?.length === this.dataSource?.length && this.selectedMedicines?.length!=0) {
      allSelected = true;
    }
    return allSelected;
  }
}
