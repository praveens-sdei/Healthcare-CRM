import { SuperAdminService } from "./../../super-admin.service";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CoreService } from "src/app/shared/core.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import Validation from "src/app/utility/validation";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { MatCheckboxChange } from "@angular/material/checkbox";
import * as moment from "moment";
const ELEMENT_DATA: PeriodicElement[] = []
export interface PeriodicElement {
  pharmacy:string;
   dateofFilling: string;
   invoiceNumber: string;
   dateofClaimSubmittion: string;
   invoiceDate: string;
   insuranceCompany: string;
  // patient: string;
  // reimbursmentrate: string;
  // paidbypatient: string;
  // requestedamount: string;
  // totalamount: string;
  // approvedamount: string;
  // rejectamount: string;
  // // comments: string;

  // detail: string;

}
@Component({
  selector: 'app-edit-manualmedicine-claim',
  templateUrl: './edit-manualmedicine-claim.component.html',
  styleUrls: ['./edit-manualmedicine-claim.component.scss']
})
export class EditManualmedicineClaimComponent implements OnInit {
  groupData: any;
  editClaimForm: any = FormGroup;
  isSubmitted: any;
  groupIcon: any;
  searchText: any;
  groupType: any = "";
  dataSource = ELEMENT_DATA;
  pageSize: number = 10
  totalLength: number = 0;
  page: any = 1;
  patientId: any;
  id:any;
  userId: any;
  referenceofFile: any;
  profileIcon: any;
  myformattedDate:any;
  constructor(private activatedRoute: ActivatedRoute,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router,
    private route:ActivatedRoute,
    private sadminService: SuperAdminService) { this.editClaimForm = this.fb.group({
      referenceofFile: [""],
    dateofFilling: ["",[Validators.required]],
    pharmacyName: ["",[Validators.required]],
    pharmacyMobile: [""],
    pharmacyEmail: ["",[Validators.email]],
    dateofClaimSubmittion: ["",[Validators.required]],
    invoiceDate: ["",[Validators.required]],
    invoiceNumber: ["",[Validators.required]],
    claimNumber: [""],
    insuranceCompany: ["",[Validators.required]],
    expectedPaymentDate: ["",[Validators.required]],
    dateOfPayment: [""],
    methodOfPayment: [""],
    requestedAmount: [""],
    approvedAmount: [""],
    rejectedAmount: [""],
    paidbytheInsured: [""],
    reasonOfRejecting: [""],
    comments: [""],
    externalReimbursement: [""]
  })
  let admin = this._coreService.getLocalStorage("loginData");

  this.userId = admin._id;
}

  get formControls(): any {

    return this.editClaimForm.controls;

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.id = val.id;
    });
  
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
     this.myformattedDate = `${year}-${month}-${day}`;
    this.getviewofmanualmedicinClaim()
  }
  handleSubmit() {
    let data = this.editClaimForm.value;
    this.isSubmitted = true;
    if (this.editClaimForm.invalid) {
      this.editClaimForm.markAllAsTouched();
      return;
    }
    this.isSubmitted = false;
    let formData: any = new FormData();
    formData.append("referenceofFile", data.referenceofFile);
    formData.append("dateofFilling", data.dateofFilling);
    formData.append("pharmacyName", data.pharmacyName);
    formData.append("pharmacyMobile", data.pharmacyMobile);
    formData.append("pharmacyEmail", data.pharmacyEmail);
    formData.append("dateofClaimSubmittion", data.dateofClaimSubmittion);
    formData.append("invoiceDate", data.invoiceDate);
    formData.append("invoiceNumber", data.invoiceNumber);
    formData.append("claimNumber", data.claimNumber);
    formData.append("insuranceCompany", data.insuranceCompany);
    formData.append("expectedPaymentDate", data.expectedPaymentDate);
    formData.append("dateOfPayment", data.dateOfPayment);
    formData.append("methodOfPayment", data.methodOfPayment);
    formData.append("requestedAmount", data.requestedAmount);
    formData.append("approvedAmount", data.approvedAmount);
    formData.append("rejectedAmount", data.rejectedAmount);
    formData.append("paidbytheInsured", data.paidbytheInsured);
    formData.append("reasonOfRejecting", data.reasonOfRejecting);
    formData.append("comments", data.comments);
    formData.append("externalReimbursement", data.externalReimbursement);
    formData.append("id",this.id)
    formData.append("createdBy", this.userId);
    this.service.addmanualMedicinClaim(formData).subscribe(
      (res) => {
        try {
          let response = this._coreService.decryptObjectData({data:res});
          console.log(response,"response");
          
          if (response.status) {
            this.toastr.success(response.message);
            this.router.navigate(["/super-admin/manualmedicineclaimlist"]);
            this.closePopup();
          } else {
            this.toastr.error(response.message);
          }
        } catch (err) {
          throw err;
        }
      },
      (err) => {
        let response = this._coreService.decryptObjectData({ data: err.error });
        this.toastr.error(response.message);
      }
    );
  }
  onGroupIconChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.editClaimForm.patchValue({
        referenceofFile: file,
      });
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profileIcon = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  getviewofmanualmedicinClaim() {
    this.service.getviewofmanualmedicinClaim(this.id).subscribe((res) => {
      let response = this._coreService.decryptObjectData({ data: res });
       this.dataSource = response?.body;
       console.log(  this.dataSource,"MMMMMMMMMMMM");
       this.referenceofFile=response?.body.referenceofFile
       this.editClaimForm.patchValue({
        dateofFilling:moment(response?.body?.dateofFilling).format("YYYY-MM-DD"),
         pharmacyName: response?.body?.pharmacyName,
         pharmacyMobile: response?.body?.pharmacyMobile,
        pharmacyEmail: response?.body?.pharmacyEmail,
        dateofClaimSubmittion: moment(response?.body?.dateofClaimSubmittion).format("YYYY-MM-DD"),
        invoiceDate: moment(response?.body?.invoiceDate).format("YYYY-MM-DD"),
        invoiceNumber:response?.body?.invoiceNumber,
        claimNumber: response?.body?.claimNumber,
        insuranceCompany: response?.body?.insuranceCompany,
        expectedPaymentDate: moment(response?.body?.expectedPaymentDate).format("YYYY-MM-DD"),
       dateOfPayment: moment(response?.body?.dateOfPayment).format("YYYY-MM-DD"),
       methodOfPayment: response?.body?.methodOfPayment,
       requestedAmount: response?.body?.requestedAmount,
       approvedAmount:response?.body?.approvedAmount,
       rejectedAmount: response?.body?.rejectedAmount,
       paidbytheInsured: response?.body?.paidbytheInsured,
      reasonOfRejecting: response?.body?.reasonOfRejecting,
      comments: response?.body?.comments,
      externalReimbursement: response?.body?.externalReimbursement,
      });
    });
  }


  closePopup() {
    this.modalService.dismissAll("close");
  }
}
