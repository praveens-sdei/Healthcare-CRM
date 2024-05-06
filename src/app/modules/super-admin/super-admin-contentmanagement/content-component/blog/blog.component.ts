import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup,Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {  Editor, Toolbar } from "ngx-editor";
import jsonDoc from "../../../../../../assets/doc/doc";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { SuperAdminService } from "../../../super-admin.service";
import { CoreService } from "src/app/shared/core.service";
import { ToastrService } from "ngx-toastr";
import {PatientService} from "src/app/modules/patient/patient.service"
import { NgxUiLoaderService } from "ngx-ui-loader";
export interface PeriodicElement {
  text: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { text: "Hydrogen" },
  { text: "Helium" },
];
@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit {
  blogEnForm!: FormGroup;

  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  userID: any;
  attachmentFile: any;
  attachmentToUpload: any;
  attachmentType: any;
  displayedColumns: string[] = [
    "text","action"
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  textValue: any;
  prepopulatedData: any;
  loginrole: any;
  innerMenuPremission: any=[];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private toastr: ToastrService,
    private pservice: PatientService,
    private loader : NgxUiLoaderService
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;
    
    this.blogEnForm = this.fb.group({
      text: ["", [Validators.required]],
      blogId: [""],
      language:[""],
      attachments: [""], // Initialize attachments as an empty form array
    });
  }

  editordoc = jsonDoc;

  // Privacy & Condition editor
  blogeditoren!: Editor;
  blogeditorfr!: Editor;
  language: any = "en";
  allBlogdata: any;
  blogId: any;
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
      { value: jsonDoc, disabled: false }
    ),
  });

  ngOnInit(): void {
    this.blogeditoren = new Editor();
    this.blogeditorfr = new Editor();
    this.listBlog();
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
        if (checkSubmenu.hasOwnProperty("blog")) {
          this.innerMenuPremission = checkSubmenu['blog'].inner_menu;
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
    this.blogeditoren.destroy();
    this.blogeditorfr.destroy();
  }

  langClick(event: any) {
    console.log(event);
    if (event.tab.textLabel === "English") {
      this.language = "en";
      this.listBlog();
      console.log(this.language);
    } else {
      this.language = "fr";
      this.listBlog();
      console.log(this.language);
    }
  }

  listBlog() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      language: this.language,
    };
  
    console.log("listBlogreq", reqData);
    this.service.blogListApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.allBlogdata = response?.body?.result;  
      this.totalLength = response?.body?.totalCount;
      this.allBlogdata = response?.body?.result?.map(item => ({
        ...item,
        cleanText: item.text
      }));
    });
  }

  async addBlog() {
    if(this.blogEnForm.invalid){
      console.log("=======INVALID=======");
      this._coreService.showError('Add Blog Text','')
      return;
    }
    this.loader.start();
    let reqData = {
      text: this.blogEnForm.value.text,
      language: this.language,
      attachments: this.attachmentFile,
    };
    if (this.attachmentToUpload != undefined) {
      await this.uploadDocuments(this.attachmentToUpload).then((res: any) => {
        let imagetype = res.data[0].Key.split('.')[1]
        reqData.attachments = { type: imagetype, path: res.data[0].Key }
      });
    }

    this.service.addBlogApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.listBlog();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    }
    );
  }

  openFileSelector() {
    let element: HTMLElement = document.getElementsByClassName('file-upload')[0] as HTMLElement;
    element.click();
    // this.scrollToBottom();
  }

  fileChange(event: any) {
    const file = event.target.files[0];
    let formData: any = new FormData();
    formData.append("userId", this.userID);
    formData.append("docType", "videos");
    formData.append("multiple", "false");
    formData.append("docName", file);

    this.attachmentToUpload = formData;
    if (event.target.files && file) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.attachmentFile = event.target.result;
      };
      reader.readAsDataURL(file);
    }
    let allowedType = ['image/jpeg', 'image/jpg', 'image/png', 'audio/mp3', 'video/mp4'];
    if (allowedType.indexOf(file.type) != -1) {
      this.attachmentType = file.type;
    } else {
      this.attachmentFile = this.attachmentToUpload = undefined;
      this.toastr.error('File selected is not allowed');
    }
  }

  uploadDocuments(doc: FormData) {
    return new Promise((resolve, reject) => {
      this.pservice.uploadFile(doc).subscribe(
        (res) => {
          let response = this._coreService.decryptObjectData(res);
          resolve(response);
        },
        // (err) => {
        //   let errResponse = this._coreService.decryptObjectData({
        //     data: err.error,
        //   });
        //   this.toastr.error(errResponse.messgae);
        // }
      );
    });
  }

  async editBlog() {
    if (this.attachmentToUpload != null) {
      await this.uploadDocuments(this.attachmentToUpload).then((res: any) => {
        let imagetype = res.data[0].Key.split('.')[1]
        const attachments = { type: imagetype, path: res.data[0].Key }
        this.blogEnForm.patchValue({
          attachments:attachments
        })
      });
    }
    this.loader.start();
    this.service.editBlogApi(this.blogEnForm.value).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.listBlog();
        this.toastr.success(response.message);
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  deleteBlog() {
    this.loader.start();
    let reqData = {
      blogId: this.blogId,
    };
    this.service.deleteBlogApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        this.listBlog();
        this.toastr.success(response.message);
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }
  
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.listBlog();
  }
  closePopup() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.blogEnForm.reset();
  }

  addopenEditorTap(addopenEditor: any) {
    this.modalService.open(addopenEditor, {
      centered: true,
      size: "xl",
      windowClass: "master_modal Import",
    });
  }
  editopenEditorTap(editEditor: any, data: any) {
    this.prepopulatedData = data;
    this.blogEnForm.patchValue({
      text: data?.text,
      blogId: data?._id,
      language:data?.language,
      attachments:data?.attachments[0]
    });
    
    this.modalService.open(editEditor, {
      centered: true,
      size: "xl",
      windowClass: "master_modal Import",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, blogId: any) {
    this.blogId = blogId;
    console.log(this.blogId);
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
}
