import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { SuperAdminService } from "../../../super-admin.service";
import { Validators, Editor, Toolbar } from "ngx-editor";
import { AbstractControl, FormControl } from "@angular/forms";

import jsonDoc from "../../../../../../assets/doc/doc";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-aboutus",
  templateUrl: "./aboutus.component.html",
  styleUrls: ["./aboutus.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AboutusComponent implements OnInit {
  aboutUsEnForm!: FormGroup;
  aboutUsFrForm!: FormGroup;
  showEnData: any;
  showFrData: any;

  langType:any='en';
  showData:any;

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

    this.aboutUsEnForm = this.fb.group({
      editorContentEn: ["", [Validators.required]],
      // text: ["", [Validators.required]],
    });

    this.aboutUsFrForm = this.fb.group({
      editorContentFr: [""],
    });
  }
  editordoc = jsonDoc;

  // About us editor
  abouteditorEn!: Editor;
  abouteditor!: Editor;

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
    this.abouteditor = new Editor();
    this.abouteditorEn = new Editor();
    // this.listFr();
    // this.listEn();

    this.getList();
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
    this.abouteditor.destroy();
    this.abouteditorEn.destroy();
  }

  // listEn() {
  //   this.service.getAboutUsen().subscribe((res) => {
  //     let encryptedData = { data: res };
  //     let response = this._coreService.decryptObjectData(encryptedData);
  //     this.showEnData = response?.body;
  //     console.log("showEnData", this.showEnData);
  //     this.updateValueEn();
  //   });
  // }

  getList() {
    const params = {
      langType: this.langType
    };
    console.log("params->>",params)

       this.service.getAboutUs(params).subscribe((res) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        this.showData = response?.body;
        console.log("showData", this.showData);
        this.updateValueEn();
        this.updateValueFr();
      });
  
  }


  handleLanguageType(event: any) {
    console.log("event", event);
    let obj = {
      0: "en",
      1: "fr"
    }
    this.langType = obj[event.index];
    this.getList();
  }
  
  updateValueEn() {
    let data = this.showData;
    console.log(data.text,"===data");
    
    this.aboutUsEnForm.patchValue({
      editorContentEn: data.text,
    });
  }


  // listFr() {
  //   this.service.getAboutUsfr().subscribe((res) => {
  //     let encryptedData = { data: res };
  //     let response = this._coreService.decryptObjectData(encryptedData);
  //     this.showFrData = response?.body;
  //     // console.log("showFrData", this.showFrData);
  //     this.updateValueFr();
  //   });
  // }

  updateValueFr() {
    let data = this.showData;
    // console.log(data.text,"===data");
    this.aboutUsFrForm.patchValue({
      editorContentFr: data.text,
    });
  }

  editEn() {
    this.loader.start();
    let reqData = {
      // image: this.aboutUsEnForm.value.editorContentEn,
      text: this.aboutUsEnForm.value.editorContentEn,
      langType: this.langType
    };
    console.log("faq reqdata============>", reqData);
    this.service.editAboutusEn(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("faq response============>", response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        // this.listEn();
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
      // text: this.aboutUsFrForm.value.editorContentFr,
      langType: this.langType
    };
    console.log("faq reqdata============>", reqData);
    this.service.editAboutusFr(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("faq response============>", response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.getList();
        this._coreService.setCategoryForService(1);
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }
}
