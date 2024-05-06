import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { Validators, Editor, Toolbar } from "ngx-editor";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import jsonDoc from "../../../../../../assets/doc/doc";
import { SuperAdminService } from "../../../super-admin.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-termandcondition",
  templateUrl: "./termandcondition.component.html",
  styleUrls: ["./termandcondition.component.scss"],
})
export class TermandconditionComponent implements OnInit {
  tNcEnForm!: FormGroup;
  tNcFrForm!: FormGroup;
  showEnData: any;
  showFrData: any;
  showData: any;
  langType:any='en';
  showText: any;
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private loader : NgxUiLoaderService
  ) {
    this.loginrole = this._coreService.getLocalStorage("adminData").role;

    this.tNcEnForm = this.fb.group({
      editorContentEn: ["", [Validators.required]],
    });
    this.tNcFrForm = this.fb.group({
      editorContentFr: ["", [Validators.required]],
    });
  }
  editordoc = jsonDoc;

  // Terms & conditions editor
  termandconditioneditor!: Editor;
  termandconditioneditoren!: Editor;

  toolbar: Toolbar = [
    ["bold", "italic", "underline", "text_color", "background_color", "strike"],
    ["align_left", "align_center", "align_right", "align_justify"],
    ["ordered_list", "bullet_list"],
    ["code", "blockquote"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["link", "image"],
  ];

  form = new FormGroup({
    editorContent: new FormControl(
      { value: jsonDoc, disabled: false },
      Validators.required()
    ),
  });

  ngOnInit(): void {
    this.termandconditioneditoren = new Editor();
    this.termandconditioneditor = new Editor();
    // this.listEn();
    // this.listFr();

    this.getTermslist();
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
        if (checkSubmenu.hasOwnProperty("terms_condition")) {
          this.innerMenuPremission = checkSubmenu['terms_condition'].inner_menu;
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
  ngOnDestroy(): void {
    this.termandconditioneditoren.destroy();
    this.termandconditioneditor.destroy();
  }
  // listEn() {
  //   this.service.getlistTNCEn().subscribe((res) => {
  //     let encryptedData = { data: res };
  //     let response = this._coreService.decryptObjectData(encryptedData);
  //     this.showEnData = response?.body;
  //     // console.log("TNCEN", this.showEnData);
  //     this.updateValueEN();
  //   });
  // }
  updateValueEN() {
    let data = this.showData;
    this.tNcEnForm.patchValue({
      editorContentEn: data.text,
    });
  }
  // listFr() {
  //   this.service.getlistTNCFr().subscribe((res) => {
  //     let encryptedData = { data: res };
  //     let response = this._coreService.decryptObjectData(encryptedData);
  //     this.showFrData = response?.body;
  //     // console.log("TNCFR", response);
  //     this.updateValueFr();
  //   });
  // }
  updateValueFr() {
    let data = this.showData;
    this.tNcFrForm.patchValue({
      editorContentFr: data.text,
    });
  }

  handleLanguageType(event: any) {
    console.log("event", event);
    let obj = {
      0: "en",
      1: "fr"
    }
    this.langType = obj[event.index];
    this.getTermslist();
  }

  getTermslist() {
    const params={
      langType:this.langType
    }
    this.service.getlistTNC(params).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.showData = response?.body;
      console.log("TNCFR", this.showData);
      this.updateValueFr();
      this.updateValueEN();
    });
  }

  editEn() {
    this.loader.start();
    let reqData ={ 
      text : this.tNcEnForm.value.editorContentEn
    }
    this.service.editTNCEn(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      if(response.status){
        this.loader.stop();
        this.toastr.success(response.message);
        // this.listEn();
        this.getTermslist();
        this._coreService.setCategoryForService(1)
      }else{
        this.loader.stop();
        this.toastr.error(response.message)
      }
    });
  }
  editFr() {
    let reqData ={
      text: this.tNcFrForm.value.editorContentFr
    }
    this.loader.start();
    this.service.editTNCFr(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      if(response.status){
        this.loader.stop();
        this.toastr.success(response.message);
        // this.listFr();
        this.getTermslist();

        this._coreService.setCategoryForService(1)
      }
      else{
        this.loader.stop();
        this.toastr.error(response.message)
      }
    });
  }
}
