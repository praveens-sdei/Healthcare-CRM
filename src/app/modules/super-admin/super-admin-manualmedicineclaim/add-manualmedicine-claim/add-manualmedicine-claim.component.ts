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

@Component({
  selector: 'app-add-manualmedicine-claim',
  templateUrl: './add-manualmedicine-claim.component.html',
  styleUrls: ['./add-manualmedicine-claim.component.scss']
})
export class AddManualmedicineClaimComponent implements OnInit {
  groupData: any;
  addClaimForm: any = FormGroup;
  isSubmitted: any;
  groupIcon: any;
  searchText: any;
  groupType: any = "";
  villageList: any[] = [];
   today = new Date();
   profileIcon:any;
 formattedDate = this.today.toISOString().substr(0, 10);
  userId: any;
  myformattedDate:any;
  constructor(  private activatedRoute: ActivatedRoute,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router,
    private sadminService: SuperAdminService) {  this.addClaimForm = this.fb.group({
      referenceofFile:[""],
      dateofFilling: [this.formattedDate,[Validators.required]],
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

    return this.addClaimForm.controls;

  }
  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
     this.myformattedDate = `${year}-${month}-${day}`;
    

  }
  handleSubmit() {
    let data = this.addClaimForm.value;
    this.isSubmitted = true;
    if (this.addClaimForm.invalid) {
      this.addClaimForm.markAllAsTouched();
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
    formData.append("createdBy", this.userId);


    this.service.addmanualMedicinClaim(formData).subscribe(
      async(res) => {
        try {
          let response = await this._coreService.decryptObjectData({data:res});
          console.log(response,"response");
          
          if (response.status) {
            this.toastr.success(response.message);
            this.router.navigate(["super-admin/manualmedicineclaimlist"]);
            this.closePopup();
          } else {
            this.toastr.error(response.message,"thisis");
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
  closePopup() {
    this.modalService.dismissAll("close");
  }
    //  Order Medicine modal
    openVerticallyCenteredaddpharmacy(addpharmacycontent: any) {
      this.isSubmitted = true;
      if (this.addClaimForm.invalid) {
        this.addClaimForm.markAllAsTouched();
        return;
      }
      this.isSubmitted = false;
      this.modalService.open(addpharmacycontent, {
        centered: true,
        windowClass: "add_pharmacy",
      });
    }

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    if (this.groupType === 'pharmacy') {
      // this.listAllPharmacy();
    } else {
      // this.listAllHospital()
    }
  }
  get f() {
    return this.addClaimForm.controls;
  }
  myFilter = (d: Date | null): boolean => {

    return true;
  };

  onGroupIconChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.addClaimForm.patchValue({
        referenceofFile: file,
      });
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profileIcon = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
