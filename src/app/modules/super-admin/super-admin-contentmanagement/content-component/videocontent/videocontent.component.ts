import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Validators, Editor, Toolbar } from "ngx-editor";
import { ToastrService } from "ngx-toastr";
import { CoreService } from "src/app/shared/core.service";
import jsonDoc from "../../../../../../assets/doc/doc";
import { SuperAdminService } from "../../../super-admin.service";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PatientService } from "src/app/modules/patient/patient.service"
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: "app-videocontent",
  templateUrl: "./videocontent.component.html",
  styleUrls: ["./videocontent.component.scss"],
})
export class VideocontentComponent implements OnInit {
  videoForm!: FormGroup;
  page: any = 1;
  pageSize: number = 5;
  totalLength: number = 0;
  language: any = "en";
  showData: any;
  videoId: any;
  userID: any;
  attachmentFile: any;
  attachmentToUpload: any;
  attachmentType: any;
  prepopulatedData: any;
  innerMenuPremission:any=[];
  loginrole: any;
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

    this.videoForm = this.fb.group({
      text: ["", [Validators.required]],
      videoId: [""],
      language: [""],
      videos: [""]
    });
  }
  editordoc = jsonDoc;

  // Video editor
  videoeditoren!: Editor;
  videoeditor!: Editor;

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
    this.videoeditoren = new Editor();
    this.videoeditor = new Editor();
    this.videoList();
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
        if (checkSubmenu.hasOwnProperty("video")) {
          this.innerMenuPremission = checkSubmenu['video'].inner_menu;
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
    this.videoeditoren.destroy();
    this.videoeditor.destroy();
  }
  langClick(event: any) {
    console.log(event);
    if (event.tab.textLabel === "French") {
      this.language = "fr";
      this.videoList();
      console.log(this.language);
    } else {
      this.language = "en";
      this.videoList();
      console.log(this.language);
    }
  }

  videoList() {
    let reqData = {
      page: this.page,
      limit: this.pageSize,
      language: this.language,
    };
    this.service.listVideo(reqData).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      this.showData = response?.body?.result;
      this.totalLength = response?.body?.totalCount;
    });
  }

  async addVideo() {
    if (this.attachmentToUpload != null) {
      await this.uploadDocuments(this.attachmentToUpload).then((res: any) => {
        this.videoForm.patchValue({
          videos: res.data[0].Key,
        });
      });
    }
    this.loader.start();
    let reqData = {
      text: this.videoForm.value.text,
      language: this.language,
      videos: this.videoForm.get('videos').value
    };

    this.service.addVideoApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.toastr.success(response.message);
        this.videoList();
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
  
  async editVideo() {
    if (this.attachmentToUpload != null) {
      await this.uploadDocuments(this.attachmentToUpload).then((res: any) => {
        this.videoForm.patchValue({
          videos: res.data[0].Key,
        })
      });
    }
    this.loader.start();
    this.service.editVideoApi(this.videoForm.value).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.loader.stop();
        this.videoList();
        this.toastr.success(response.message);
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }

  deleteVideo() {
    this.loader.start();
    let reqData = {
      videoId: this.videoId,
    };
    this.service.deleteVideoApi(reqData).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);

      if (response.status) {
        this.loader.stop();
        this.videoList();
        this.toastr.success(response.message);
        this.closePopup();
      } else {
        this.loader.stop();
        this.toastr.error(response.message);
      }
    });
  }
  closePopup() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.videoForm.reset();
  }
  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.videoList();
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
    this.videoForm.patchValue({
      text: data?.text,
      videoId: data?._id,
      language: data?.language,
      videos: data?.videos
    });
    this.modalService.open(editEditor, {
      centered: true,
      size: "xl",
      windowClass: "master_modal Import",
    });
  }
  //delete popup
  openVerticallyCenteredsecond(deletePopup: any, videoId: any) {
    this.videoId = videoId;
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
