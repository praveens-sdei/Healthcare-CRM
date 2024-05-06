import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AbstractControl, FormControl, Validators } from "@angular/forms";
import { Editor, Toolbar } from "ngx-editor";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import { SuperAdminService } from "../../../super-admin.service";
import jsonDoc from "../../../../../../assets/doc/doc";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class FaqComponent implements OnInit {
  // FAQ editor
  faqeditor!: Editor;
  faqForm!: FormGroup;
  userId: any;
  language: any = "en";
  showData: any;
  showdata: any;
  isSubmitted: boolean = false;
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

    this.faqForm = this.fb.group({
      faqq: this.fb.array([]),
    });
    let userData = this._coreService.getLocalStorage("loginData");
    this.userId = userData?._id;
  }

  ngOnInit(): void {
    this.faqeditor = new Editor();
    this.listfaq();
    this.addNew();
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
        if (checkSubmenu.hasOwnProperty("faq")) {
          this.innerMenuPremission = checkSubmenu['faq'].inner_menu;
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

  langClick(event: any) {
    this.isSubmitted = false;
    if (event.tab.textLabel === "French") {
      this.language = "fr";
      this.listfaq();
      this.addNew();
    } else {
      this.language = "en";
      this.listfaq();
      this.addNew();
    }
  }
  ngOnDestroy(): void {
    this.faqeditor.destroy();
  }

  listfaq() {
    this.faqForm.reset();
    this.faqq.clear();
    let reqData = {
      language: this.language,
    };
    console.log("faqlistreq", reqData);
    this.service.getallFaq(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("faqlistres>", response);
      this.showData = response?.body[0]?.faqs;
      this.updateValue();
    });
  }
  
  updateValue() {
    let data = this.showData;
    if(data?.length === 0){
      this.addNew();
    }

    data?.forEach((element: any) => {
      this.showdata = element?.length;
      this.addNew();
    });

    this.faqForm.patchValue({
      faqq: data,
    });
  }

  addfaq() {
    this.isSubmitted = true;
    if (this.faqForm.invalid) {
      console.log("=======INVALID=========");
      return;
    }
    this.loader.start();
    this.isSubmitted = false;

    let reqData = {
      faqs: this.faqForm.value.faqq,
      language: this.language,
    };
    console.log("faq reqdata============>", reqData);
    this.service.addfaqApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("faq response============>", response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.listfaq();
        this._coreService.setCategoryForService(1);
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  faqqValidations(index) {
    let faqs = this.faqForm.get("faqq") as FormArray;
    const formGroup = faqs.controls[index] as FormGroup;
    return formGroup;
  }

  newForm(): FormGroup {
    return this.fb.group({
      question: ["", [Validators.required]],
      answer: ["", [Validators.required]],
    });
  }
  get faqq(): FormArray {
    return this.faqForm.get("faqq") as FormArray;
  }

  addNew() {
    this.faqq.push(this.newForm());
  }

  remove(index: number) {
    this.faqq.removeAt(index);
  }
}
