import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Editor, Toolbar } from "ngx-editor";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import jsonDoc from "../../../../../../assets/doc/doc";
import { SuperAdminService } from "../../../super-admin.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-contactus",
  templateUrl: "./contactus.component.html",
  styleUrls: ["./contactus.component.scss"],
})
export class ContactusComponent implements OnInit {
  contactForm!: FormGroup;
  contactFormFr!: FormGroup;

  language: any = "en";
  userId: any;
  showData: any;
  isSubmitted: boolean = false;
  innerMenuPremission:any=[];
  loginrole: any;
  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private loader : NgxUiLoaderService
  ) {
    this.loginrole = this._coreService.getLocalStorage("adminData").role;

    this.contactForm = this.fb.group({
      phone: [
        "",
        [Validators.required, Validators.pattern(/^\d{1,100}$/)],
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      address: ["", [Validators.required]],
    });


    this.contactFormFr = this.fb.group({
      phone: [
        "",
        [Validators.required, Validators.pattern(/^\d{1,100}$/)],
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      address: ["", [Validators.required]],
    });

    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData._id;
  }

  // Contact us editor
  contactuseditor!: Editor;
  ngOnInit(): void {
    this.contactuseditor = new Editor();
    this.listContactUs();
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
        if (checkSubmenu.hasOwnProperty("contact_us")) {
          this.innerMenuPremission = checkSubmenu['contact_us'].inner_menu;
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
    this.contactuseditor.destroy();
  }

  langClick(event: any) {
    console.log("event", event);
    let obj = {
      0: "en",
      1: "fr"
    }
    this.language = obj[event.index];
    this.listContactUs();
    // console.log("event", event)
    // if (event.tab.textLabel === "English") {
    //   this.language = "en";
    //   console.log(this.language, "this.language");
    //   this.listContactUs();
    // } else {
    //   this.language = "fr";
    //   console.log(this.language, "this.language");
    //   this.listContactUs();
    // }
  }

  listContactUs() {
    const params = {
      langType: this.language,
    }
    console.log("params=======>>>>", params)
    this.superAdminService.getContactus(params).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("CONTACT RESPONSE", response);
      this.showData = response?.body;
      this.updateValue();
      this.updateValueFr();
    });
  }

  updateValue() {
    let data = this.showData;
    console.log("dataEnnnn",data)
    this.contactForm.patchValue({
      phone: data.phone,
      email: data.email,
      address: data.address,
    });
  }

  updateValueFr() {
    let data = this.showData;
    console.log("dataFrrrrrrr",data)
    this.contactFormFr.patchValue({
      phone: data.phone,
      email: data.email,
      address: data.address,
    });
  }


  addContactContent() {
    this.isSubmitted = true;
    if (this.contactForm.invalid) {
      console.log("=======INVALID======");
      return;
    }
    this.loader.start();
    this.isSubmitted = false;

    let reqData = {
      langtype: this.language,
      phone: this.contactForm.value.phone,
      email: this.contactForm.value.email,
      address: this.contactForm.value.address,
    };
    console.log("contatcus reqdata============>", reqData);
    this.superAdminService.addContactusApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      // console.log("contatcus response============>", response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        // this.listContactUs();
        this._coreService.setCategoryForService(1);
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  addContactContentFr() {
    this.isSubmitted = true;
    if (this.contactFormFr.invalid) {
      console.log("=======INVALID======");
      return;
    }
    this.loader.start();
    this.isSubmitted = false;
    console.log("this.contactFormFr.value", this.contactFormFr.value)
    let reqData = {
      langtype: this.language,
      phone: this.contactFormFr.value.phone,
      email: this.contactFormFr.value.email,
      address: this.contactFormFr.value.address,
    };
    console.log("contatcus contactFormFr reqdata============>", reqData);
    this.superAdminService.addContactusApiFr(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      // console.log("contatcus response============>", response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        // this.listContactUs();
        this._coreService.setCategoryForService(1);
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  get g() {
    return this.contactFormFr.controls;
  }

  get f() {
    return this.contactForm.controls;
  }
}
