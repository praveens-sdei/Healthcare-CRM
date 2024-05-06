import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Editor } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/shared/core.service';
import { PatientService } from '../../patient.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqeditor!: Editor;
  faqForm!: FormGroup;
  userId: any;
  language: any = "en";
  showData: any;
  showdata: any;
  isSubmitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private service: PatientService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    public translate: TranslateService,
  ) {this.faqForm = this.fb.group({
    faqq: this.fb.array([]),
  });
  let userData = this._coreService.getLocalStorage("loginData");
  this.userId = userData?._id;
}

ngOnInit(): void {
  this.faqeditor = new Editor();
  this.listfaq();
  // this.addNew();
}

langClick(event: any) {
  this.isSubmitted = false;
  console.log("event", event);
  let obj = {
    0: "en",
    1: "fr"
  }
  this.language = obj[event.index];
  this.listfaq();
  // if (event.tab.textLabel === "French") {
  //   this.language = "fr";
  //   this.listfaq();
  // } else {
  //   this.language = "en";
  //   this.listfaq();
  // }
}
ngOnDestroy(): void {
  console.log("this.translate.currentLang",this.translate.currentLang)
  this.faqeditor.destroy();
}

listfaq() {
  this.faqForm.reset();
  this.faqq.clear();
  let reqData = {
    language: this.translate.currentLang,
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
  this.isSubmitted = false;

  let reqData = {
    faqs: this.faqForm.value.faqq,
    language: this.translate.currentLang,
  };
  console.log("faq reqdata============>", reqData);
  this.service.addfaqApi(reqData).subscribe((res: any) => {
    let encryptedData = { data: res };
    let response = this._coreService.decryptObjectData(encryptedData);
    console.log("faq response============>", response);
    if (response.status) {
      this.toastr.success(response.message);
      this.listfaq();
      this._coreService.setCategoryForService(1);
    } else {
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
