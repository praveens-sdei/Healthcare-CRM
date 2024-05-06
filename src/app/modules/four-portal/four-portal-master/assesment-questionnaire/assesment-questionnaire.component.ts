import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { FormioOptions, FormioHookOptions } from "angular-formio";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import { error } from 'console';
import { IndiviualDoctorService } from "src/app/modules/individual-doctor/indiviual-doctor.service";
import { FourPortalService } from "../../four-portal.service";
import { NgxUiLoaderService } from "ngx-ui-loader";


export interface PeriodicElement {
  orderno: number;
  question: string;
  controlname: string;
  options: string;
  status: string;
  isrequired: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    orderno: 3,
    question: "Do you smoke?",
    controlname: "Radio Button",
    options: "yes, no",
    status: "Active",
    isrequired: "Yes",
  },
  {
    orderno: 4,
    question: "Do you smoke?",
    controlname: "Radio Button",
    options: "yes, no",
    status: "Active",
    isrequired: "Yes",
  },
  {
    orderno: 5,
    question: "Do you smoke?",
    controlname: "Radio Button",
    options: "yes, no",
    status: "Active",
    isrequired: "Yes",
  },
];

@Component({
  selector: 'app-assesment-questionnaire',
  templateUrl: './assesment-questionnaire.component.html',
  styleUrls: ['./assesment-questionnaire.component.scss']
})
export class AssesmentQuestionnaireComponent implements OnInit {
  Questionnaire: FormGroup
  loginUserId: any
  displayedColumns: string[] = [
    "dateofcreate",
    'orderno',
    'question',
    'controlname',
    'options',
    'status',
    'isrequired',
    'action'];


  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  userId: any;
  page: any = 1;
  searchText: any = "";
  pageSize: number = 5;
  totalLength: number = 0;
  submitted: boolean = false;
  questionnaireId: any;
  textFieldTypes: any[];
  controlsList: any[];
  selectedControlType: any;
  isShowAddOptions = false;
  controlsFormGroup: FormGroup;
  type: any
  isUpdate: boolean = false

  sortColumn: string = 'question';
  sortOrder: 'asc' | 'desc' = 'asc';
  sortIconClass: string = 'arrow_upward';

  loginUserInfo: any = '';
  loginPortalId: any = '';
  portalType: any = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  innerMenuPremission: any=[];
  userRole:any;
  usertype: any;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private modalService: NgbModal,
    private _coreService: CoreService,
    private activatedRoute: ActivatedRoute,
    private doctorService: IndiviualDoctorService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _individualdoctorSevice: IndiviualDoctorService,
    private fourPortalService: FourPortalService,
    private loader: NgxUiLoaderService,
    private coreService: CoreService) {

    const userData = this.coreService.getLocalStorage("loginData");
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.usertype = userData?.type;
    this.userRole = userData?.role;
    if(this.userRole === 'STAFF'){
      this.loginPortalId = adminData.creatorId;

    }else{
      this.loginPortalId = userData._id;

    }
    this.type = "";
    this.textFieldTypes = [{ name: 'Text', value: 'text' }, { name: 'Numeric', value: 'number' }];
    this.controlsList = [{ id: 'textbox', value: 'text', hasOptions: false }, { id: 'checkbox', value: 'text', hasOptions: true }, { id: 'selectlist', value: 'text', hasOptions: true }, { id: 'radiobutton', value: 'text', hasOptions: true }, { id: 'textarea', value: 'text', hasOptions: false }]
    this.createForm("");
  }

  onSortData(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortIconClass = this.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
    this.getlist(`${column}:${this.sortOrder}`);
  }

  ngOnInit(): void {    

    this.getlist(`${this.sortColumn}:${this.sortOrder}`);

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
        if (checkSubmenu.hasOwnProperty("questionnairemanagement")) {
          this.innerMenuPremission = checkSubmenu['questionnairemanagement'].inner_menu;
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


  createForm(providerQuestion: any | null) {

    this.controlsFormGroup = this.formBuilder.group({
      questionText: [providerQuestion ? providerQuestion.question : undefined, [Validators.required]],
      id: [providerQuestion ? providerQuestion.questionId : undefined],
      options: this.formBuilder.array([]),
      questionnaireTypeControlId: [providerQuestion ? providerQuestion.controller : undefined, [Validators.required]],
      order: [providerQuestion ? providerQuestion.questionId : undefined],
      isActive: [providerQuestion ? providerQuestion.active : true],
      isRequired: [providerQuestion ? providerQuestion.required : true],
      type: [(providerQuestion && providerQuestion.control && providerQuestion.control.type) ? providerQuestion.control.type : undefined],
    });

    if (providerQuestion && providerQuestion.controller && providerQuestion.options && providerQuestion.options.length > 0) {
      this.isShowAddOptions = true;
      const optionsObjs = [...providerQuestion.options];

      const options = [...optionsObjs.map(x => x.option)];
      console.log("optionsObjs", options)
      this.bindOptions(options);
    }
    if (providerQuestion) {
      this.selectedControlType = providerQuestion.controller;
    }

  }


  onControltypeChange(value: any) {

    const controlType = this.controlsList.find(x => x.id === value);

    this.isShowAddOptions = controlType.hasOptions;
    if (controlType.hasOptions) {
      if (this.optionsControlFormGroup.length == 0) {
        this.addQuestionnaireControlOption('');
      }
    } else {
      this.controlsFormGroup.controls['options'] = this.formBuilder.array([]);
    }


    const isShowType = controlType.id === 'textbox' ? true : false;
    console.log("isShowType", isShowType)



    if (isShowType) {
      if (!this.controlsFormGroup.controls['type'].value)
        this.controlsFormGroup.controls['type'].setValue('text');
    }
  }



  get optionsControlFormGroup() {
    return <FormArray>this.controlsFormGroup.controls['options'];
  }


  addQuestionnaireControlOption(option: string) {

    const control = this.formBuilder.group({
      option: [option ? option : undefined, [Validators.required]]
    })
    this.optionsControlFormGroup.push(control);
  }

  removeOption(index) {

    this.optionsControlFormGroup.removeAt(index);
  }


  get f() { return this.controlsFormGroup.controls; }

  get isShowType(): boolean {
    {
      if (this.controlsList && this.controlsList.length > 0 && this.selectedControlType) {
        const texTcontrol = this.controlsList.find(x => x.id === 'textbox');
        return (texTcontrol && texTcontrol.id == this.selectedControlType) ? true : false;
      } else {
        return false;
      }
    }
  }

  bindOptions(options: string[]) {
    options.forEach(o => {
      console.log("000000", o)
      this.addQuestionnaireControlOption(o);
    });
  }


  getlist(sort: any = '') {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      loginPortalId: this.loginPortalId,
      sort: sort
    };
    this.fourPortalService.questiinnaireList(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response,"response_Listtt______");
      
      this.totalLength = response?.body?.totalCount;
      this.dataSource = response?.body?.data;
      console.log(this.dataSource,"dataSourceee______");
    });
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getlist();
  }

  deleteQestionnaire(action_value: boolean, action_name: any) {
    this.loader.start();
    let reqData = {
      questionnaireId: this.questionnaireId,
      action_name: action_name,
      action_value: action_value,
    };
    console.log(reqData)
    this.fourPortalService.deleteQuestionnaire(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.getlist();
        this.toastr.success(response.message);
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }
  closePopup() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.controlsFormGroup.reset()
  }

  addQuestionnaire() {
    let param = {
      controller: this.controlsFormGroup.value.questionnaireTypeControlId,
      question: this.controlsFormGroup.value.questionText,
      type: this.controlsFormGroup.value.type,
      options: this.controlsFormGroup.value.options,
      active: this.controlsFormGroup.value.isActive ? this.controlsFormGroup.value.isActive : false,
      required: this.controlsFormGroup.value.isRequired ? this.controlsFormGroup.value.isRequired : false,
    }

    if (this.isUpdate) {
      this.loader.start();
      // console.log("this.controlsFormGroup.value", param)
      param['questionnaireId'] = this.questionnaireId
      this.fourPortalService.updateQuestionnaire(param).subscribe({
        next: (res) => {
          let result = this.coreService.decryptObjectData({ data: res })
          if(result.status){
          this.loader.stop();
          this.toastr.success(result.message)
          this.closePopup()
          this.getlist()
          this.controlsFormGroup.reset()
        }
        },

        error: (err) => {
          console.log(err)
          this.loader.stop();
        }
      })
    }
    else {
      this.loader.start();
      let creatorId = this._coreService.getLocalStorage("loginData")._id;
      param['loginPortalId'] = this.loginPortalId
      param['createdBy'] = creatorId
      param['portalType'] = this.portalType

      this.fourPortalService.addQuestionnaire(param).subscribe({
        next: (res) => {

          let result = this.coreService.decryptObjectData({ data: res })
          console.log(result,"resultttt_____");
          if(result.status){
          this.loader.stop();
          this.toastr.success(result.message)
          this.closePopup()
          this.getlist()
          this.controlsFormGroup.reset()
        }
        },

        error: (err) => {
          console.log(err)
          this.loader.stop();
        }
      })

    }

  }


  getquestionDetails(id: any) {
    let param = { questionnaireId: id }
    this.fourPortalService.getQuestionnaireDetails(param).subscribe({
      next: (res) => {

        let result = this.coreService.decryptObjectData({ data: res })
        this.createForm(result.body);
        console.log("resulttttt____", result)
      },

      error: (err) => {
        console.log(err)
      }
    })

  }












  //  Add Leave modal
  openVerticallyCenteredaddquestion(addquestioncontent: any) {
    this.isUpdate = false;
    this.modalService.open(addquestioncontent, {
      centered: true,
      size: "lg",
      windowClass: "add_question",
      backdrop: "static"
    });
  }
  //  Add Leave modal


  //  Update Leave modal
  openVerticallyCenteredupdatequestion(updatequestioncontent: any, id: any) {
    console.log("opennneeee___",id);
    
    this.getquestionDetails(id)
    this.questionnaireId = id
    this.isUpdate = true
    this.modalService.open(updatequestioncontent, {
      centered: true,
      size: "lg",
      windowClass: "add_question",
      backdrop: "static"
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, questionnaireId: any) {
    this.questionnaireId = questionnaireId;
    console.log("idddd____", this.questionnaireId)
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

  myFilter = (d: Date | null): boolean => {
    // const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 0 && day !== 6;
    return true;
  };


}
