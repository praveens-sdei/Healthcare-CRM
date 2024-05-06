import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { SuperAdminService } from "../../../super-admin.service";
import { Validators, Editor, Toolbar } from "ngx-editor";

import jsonDoc from "../../../../../../assets/doc/doc";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-privacyandcondition",
  templateUrl: "./privacyandcondition.component.html",
  styleUrls: ["./privacyandcondition.component.scss"],
})
export class PrivacyandconditionComponent implements OnInit {
  pncEnForm!: FormGroup;
  pncFrForm!: FormGroup;
  showEnData: any;
  showFrData: any;
  showData: any;
  langType:any='en';
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private fb: FormBuilder,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private loader : NgxUiLoaderService
  ) {
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
    this.pncEnForm = this.fb.group({
      editorContentEn: ["", [Validators.required]],
    });
    this.pncFrForm = this.fb.group({
      editorContentFr: ["", [Validators.required]],
    });
  }
  editordoc = jsonDoc;

  // Privacy & Condition editor
  privacyandconditioneditoren!: Editor;
  privacyandconditioneditor!: Editor;

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
    this.privacyandconditioneditor = new Editor();
    this.privacyandconditioneditoren = new Editor();
    // this.listEn();
    // this.listFr();
    this.getPrivacylist();
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
        if (checkSubmenu.hasOwnProperty("privacy_condition")) {
          this.innerMenuPremission = checkSubmenu['privacy_condition'].inner_menu;
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
    this.privacyandconditioneditor.destroy();
    this.privacyandconditioneditoren.destroy();
  }

  // listEn() {
  //   this.service.getlistpNcEn().subscribe((res) => {
  //     let encryptedData = { data: res };
  //     let response = this._coreService.decryptObjectData(encryptedData);
  //     this.showEnData = response?.body;
  //     // console.log("EnPNClist ", this.showEnData);
  //     this.updateValueEn();
  //   });
  // }

  updateValueEn() {
    let data = this.showData;
    this.pncEnForm.patchValue({
      editorContentEn: data.text,
    });
  }

  // listFr() {
  //   this.service.getlistpNcFr().subscribe((res) => {
  //     let encryptedData = { data: res };
  //     let response = this._coreService.decryptObjectData(encryptedData);
  //     this.showFrData = response?.body;
  //     // console.log("FrPNClist ", this.showFrData);
  //     this.updateValueFr();
  //   });
  // }

  getPrivacylist() {
    const params={
      langType:this.langType
    }
    this.service.getlistpNc(params).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.showData = response?.body;
      // console.log("FrPNClist ", this.showFrData);
      this.updateValueFr();
      this.updateValueEn();
    });
  }

  handleLanguageType(event: any) {
    console.log("event", event);
    let obj = {
      0: "en",
      1: "fr"
    }
    this.langType = obj[event.index];
    this.getPrivacylist();
  }

  updateValueFr() {
    let data = this.showData;
    this.pncFrForm.patchValue({
      editorContentFr: data.text,
    });
  }
  
  editEn() {
    this.loader.start();
    let reqData = {
      text: this.pncEnForm.value.editorContentEn,
      langType: this.langType
    };
    console.log(reqData);
    this.service.editpNcEn(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        // this.listEn();
        this.getPrivacylist();
        this._coreService.setCategoryForService(1);
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  editFr() {
    this.loader.start();
    let reqData = {
      text: this.pncFrForm.value.editorContentFr,
      langType: this.langType
    };
    this.service.editpNcFr(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log(response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        // this.listFr();
        this.getPrivacylist();
        this._coreService.setCategoryForService(1);
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }
  
}
