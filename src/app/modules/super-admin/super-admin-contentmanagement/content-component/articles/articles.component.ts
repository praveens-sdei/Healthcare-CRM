import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AnyAaaaRecord } from "dns";
import { Validators, Editor, Toolbar } from "ngx-editor";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import jsonDoc from "../../../../../../assets/doc/doc";
import { SuperAdminService } from "../../../super-admin.service";
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
  selector: "app-articles",
  templateUrl: "./articles.component.html",
  styleUrls: ["./articles.component.scss"],
})
export class ArticlesComponent implements OnInit {
  articleForm!: FormGroup;
  prepopulatedData: any;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  showData: any;
  articleId: any;
  userID: any;
  attachmentFile: any;
  attachmentToUpload: any;
  attachmentType: any;
  displayedColumns: string[] = [];
  innerMenuPremission:any=[];
  loginrole: any;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  textValue: any;
  selectedImage: string | ArrayBuffer | null = null;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SuperAdminService,
    private _coreService: CoreService,
    private modalService: NgbModal,
    private pservice: PatientService,
    private loader : NgxUiLoaderService
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData._id;
    this.loginrole = this._coreService.getLocalStorage("adminData").role;

    this.articleForm = this.fb.group({
      text: ["", [Validators.required]],
      articleId: [""],
      language: [""],
      image:[""]
    });
  }
  editordoc = jsonDoc;
  // Articles editor
  articleseditoren!: Editor;
  articleseditor!: Editor;
  language: any = "en";
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
    this.articleseditoren = new Editor();
    this.articleseditor = new Editor();
    this.articleList();
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
        if (checkSubmenu.hasOwnProperty("articles")) {
          this.innerMenuPremission = checkSubmenu['articles'].inner_menu;
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
    this.articleseditoren.destroy();
    this.articleseditor.destroy();
  }

  langClick(event: any) {
    console.log(event);
    if (event.tab.textLabel === "English") {
      this.language = "en";
      this.articleList();
      console.log(this.language);
    } else {
      this.language = "fr";
      this.articleList();
      console.log(this.language);
    }
  }
  articleList() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      language: this.language,
    };
    this.service.articleListApi(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.showData = response?.body?.result;
      this.totalLength = response?.body?.totalCount;

      this.showData = response?.body?.result?.map(item => ({
        ...item,
        cleanText: item.text
      }));
      console.log("this.showData>>>>",this.showData)
    });
  }
  async addArticle() {

    if(this.articleForm.invalid){
      console.log("=======INVALID=======");
      this._coreService.showError('Add Article Content','')
      return;
    }

    if (this.attachmentToUpload != null) {
      await this.uploadDocuments(this.attachmentToUpload).then((res: any) => {
        this.articleForm.patchValue({
          image : res.data[0].Key,
        });
      });
    }
    this.loader.start();
    let reqData = {
      text: this.articleForm.value.text,
      language: this.language,
      image:this.articleForm.get('image').value
    };
    console.log("addblogreqData", reqData);
    this.service.addArticleApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("addblogresponse", response);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.articleList();
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
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
    formData.append("docType", "image");
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
    console.log("file.type===>", file.type)
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
  // async editArticle() {
  //   console.log("this.articleForm.value", this.articleForm.value);
  //   if (this.attachmentToUpload != null) {
  //     await this.uploadDocuments(this.attachmentToUpload).then((res: any) => {
  //       console.log("res=>>>>>>>>>>>",res)
  //       this.articleForm.patchValue({
  //         image : res.data[0].Key,
  //       });
  //     });
  //   }
  //   this.service.editArticleApi(this.articleForm.value).subscribe((res: any) => {
  //     let encryptedData = { data: res };
  //     let response = this._coreService.decryptObjectData(encryptedData);
  //     console.log("blog=>", response);
  //     if (response.status) {
  //       this.articleList();
  //       this.toastr.success(response.message);
  //       this.closePopup();
  //     } else {
  //       this.toastr.error(response.message);
  //     }
  //   });
  // }
  async editArticle() {
    console.log("this.articleForm.value", this.articleForm.value);
    
    try {
      if (this.attachmentToUpload != null) {
        await this.uploadDocuments(this.attachmentToUpload).then((res: any) => {
          this.articleForm.patchValue({
            image: res.data[0].Key,
          })
        });
      }
      this.loader.start();
      console.log("this.articleForm.value", this.articleForm.value);
      // Now, after updating the image in the form, proceed with the API call
      this.service.editArticleApi(this.articleForm.value).subscribe((res: any) => {
        let encryptedData = { data: res };
        let response = this._coreService.decryptObjectData(encryptedData);
        console.log("blog=>", response);
        if (response.status) {
          this.loader.stop();
          this.articleList();
          this.toastr.success(response.message);
          this.closePopup();
        } else {
          this.loader.stop();
          this.toastr.error(response.message);
        }
      });
    } catch (error) {
      console.error("Error editing article:", error);
      // Handle the error as needed, e.g., show an error message to the user
    }
  }
  
  deleteArticle() {
    this.loader.start();
    let reqData = {
      articleId: this.articleId,
    };
    console.log("delete======>", reqData);
    this.service.deleteArticleApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      console.log("delete======>", response);

      if (response.status) {
        this.loader.stop();
        this.articleList();
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
    this.articleList();
  }
  closePopup() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.articleForm.reset();
  }
  addopenEditorTap(addopenEditor: any) {
    this.modalService.open(addopenEditor, {
      centered: true,
      size: "xl",
      windowClass: "master_modal Import",
    });
  }
  editopenEditorTap(editEditor: any, data: any) {
    // let data = this.showData;
    console.log("data", data);
    this.prepopulatedData = data;
    this.articleForm.patchValue({
      text: data?.text,
      articleId: data?._id,
      language: data?.language,
      image:data?.image
    });
    this.modalService.open(editEditor, {
      centered: true,
      size: "xl",
      windowClass: "master_modal Import",
    });
  }
  openTab(openEditor: any) {
    this.modalService.open(openEditor, {
      centered: true,
      size: "xl",
      windowClass: "master_modal Import",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, articleId: any) {
    this.articleId = articleId;
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
