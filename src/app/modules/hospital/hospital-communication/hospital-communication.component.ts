import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy ,HostListener} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { CoreService } from "src/app/shared/core.service";
import intlTelInput from "intl-tel-input";
import { SuperAdminService } from "../../super-admin/super-admin.service";
import { IEncryptedResponse } from "src/app/shared/classes/api-response";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { WebSocketService } from "../../../shared/web-socket.service"
import { environment } from "src/environments/environment"
import { Subscription } from 'rxjs';
import { PatientService } from '../../patient/patient.service';
// import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { AudioRecordingService } from 'src/app/shared/audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';
import FileSaver from 'file-saver'
import { HospitalService } from '../hospital.service';
import { SuperAdminStaffResponse } from "src/app/modules/super-admin/super-admin-staffmanagement/addstaff/addstaff.component.type";
export interface PeriodicElement {
  staffname: string;
  staffImage
  role: string;
  phone: string;
  datejoined: string;
  isOnline: boolean;
  portalType: string;
}
const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-hospital-communication',
  templateUrl: './hospital-communication.component.html',
  styleUrls: ['./hospital-communication.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class HospitalCommunicationComponent implements OnInit {

  
  dataSource = ELEMENT_DATA;
  userID: string = "";
  pageSize: number = 100;
  totalLength: number = 0;
  page: any = 1;
  staff_name: any = "";
  role: string = "";
  searchKey: any = "";
  searchText: any = "";
  searchQuery: any = "";
  list: any = [];
  listData: any = [];
  chatRoomID: any;
  chatRoom: boolean;
  receiverID: any = [];
  userChat: any;
  getmessage: void;
  typeMessageForm: FormGroup;
  messageData: any = [];
  messages: any;
  groupForm: any;
  minAllowedUsers: number = 2;
  chatHeaderName: any;
  isSubmitted: boolean = false;
  latestMessages: any;
  loggedInUserName: any;
  filterByrole: any = "";

  attachmentFile: any;
  attachmentToUpload: any = '';
  imageObject: Array<object> = [];
  currentIndex: any = -1;
  showFlag: any = false;
  baseUrl: any = environment.apiUrl;
  selectedImage: string | ArrayBuffer | null = null;
  selectedreceiver: any = '';
  selectedreceiverID: any = [];
  selectedrecieverimage: any = '';

  isAudioRecording = false;
  isAudioSent = false;
  audioRecordedTime;
  audioBlobUrl;
  audioBlob;
  audioName;
  audioConf = { audio: true };
  audioBase64: string;

  attachmentType: any;
  groupNmaeInputblock: boolean = false;

  newMembers: any[] = [];
  buttonTypeToOpenModal: any;

  checkGroup: any;
  groupProfileImage: any = "";
  groupProfilePicFile: any = null;
  groupImage: any;
  private Getchatmessage: Subscription = Subscription.EMPTY;
  private newMessageReceivedata: Subscription = Subscription.EMPTY;
  private Roomcreated: Subscription = Subscription.EMPTY;
  private groupRoomcreated: Subscription = Subscription.EMPTY;
  private addMembersToRoom: Subscription = Subscription.EMPTY;

  chatWithName: any;
  senderName: any;
  groupMember: any;
  status: boolean;
  isOnline: boolean;
  userRole: any;
  userlistForChat:any=[];
  adminId: any;
  messageID_todelete: any;
  fourPortalRole: any;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _coreService: CoreService,
    private _hospitalService: HospitalService,
    private service: PatientService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _webSocketService: WebSocketService,
    private audioRecordingService: AudioRecordingService,
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {
    const userData = this._coreService.getLocalStorage("loginData");
    this.userID = userData?._id;
    this.loggedInUserName = userData?.full_name;
    console.log("this.loggedInUserName>>>>", this.loggedInUserName)
    this.userRole = userData?.role;
    console.log("userRole",this.userRole);
    const adminData = this._coreService.getLocalStorage("adminData");
    this.adminId = adminData?.in_hospital;

    this._webSocketService.newMessageReceivedata().subscribe((data: any) => {
      console.log("dhanshreeeeeeeeee", data)
      this.messageData.push(data);
      console.log("this.messageData", this.messageData)
    });

    this.typeMessageForm = this.fb.group({
      message: ['', []]
    })

    //--------------Audio Recording--------------
    this.audioRecordingService.recordingFailed().subscribe((res: any) => {
      this.toastr.error(res);
      this.isAudioRecording = false;
      this.ref.detectChanges();
    });
    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });
    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      var file = new File([data.blob], data.title);
      console.log("file===========>", file)
      let formData: any = new FormData();
      formData.append("userId", this.userID);
      formData.append("docType", "chat_images");
      formData.append("multiple", "false");
      formData.append("docName", file);

      this.attachmentToUpload = formData;
      // this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      console.log("this.audioBlobUrl", this.audioBlobUrl)
      //this.addBase64audio();
      this.ref.detectChanges();
    });


  }

  //  Start chat modal
  openVerticallyCenteredstartchat(startchatcontent: any) {
    this.modalService.open(startchatcontent, { centered: true, size: 'md', windowClass: "start_chat", backdrop: false });
    this.getAllStaff();
  }

  //  Create Group modal
  openVerticallyCenteredcreategroup(creategroupcontent: any, type: any) {
    this.buttonTypeToOpenModal = type;
    // console.log("typeeeeeeeeeeeeee", this.buttonTypeToOpenModal)
    this.modalService.open(creategroupcontent, { centered: true, size: 'md', windowClass: "start_chat", backdrop: false });
    this.getAllStaff();

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  closePopup() {
    let modalDespose = this.getDismissReason(1);
    this.modalService.dismissAll(modalDespose);
    this.status = false;
    this.receiverID = [];
    this.newMembers = [];
    this.groupForm.reset();
    console.log("this.receiverID close-->", this.receiverID);
    return this.status

  }
  openVerticallyCenteredsecond(deleteNotification: any, data: any) {
    this.messageID_todelete = data?._id;
    this.modalService.open(deleteNotification, { centered: true, size: "sm" });
  }
  openVerticallyCenteredsecondDelete(deleteAllMessages: any) {
    this.modalService.open(deleteAllMessages, { centered: true, size: "sm" });
  }
  // isScrolledToBottom = false;
  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe((val: any) => {
        this.chatRoomID = val.type;
    });

    let data = {
      userId: this.userID,
      token: "Bearer " + localStorage.getItem("token"),
      type:'Hospital'
    }
    this._webSocketService.joinChatRoom(data);

    this._webSocketService.Roomcreated().subscribe((res: any) => {
      console.log("resssssssssssss", res.body._id)
      this.getRoomList(res.body._id);
    });

    this._webSocketService.groupRoomcreated().subscribe((res: any) => {
      console.log("res.body._id", res.body._id)
      this.getRoomList(res.body._id);
    });

    this._webSocketService.addMembersToRoom().subscribe((res: any) => {
      console.log("addMembersToRoom==", res)
      this.getRoomList(res.body._id);
    });

    this.getRoomList();

    this.groupForm = this.fb.group({
      groupName: ['', Validators.required],
      profile_pic: [""],
      members: this.fb.array([])
    });

  }

  ngOnDestroy(): void {
    let data = {
      userId: this.userID,
      token: "Bearer " + localStorage.getItem("token"),
      type:'Hospital'
    }
    this._webSocketService.leaveChatRoom(data);
  }

  get groupMembers() {
    return this.groupForm.get('members') as FormArray;
  }

  private getAllStaff() {
    const params = {
      loggedInId: this.userID,
      page: this.page,
      limit: this.pageSize,
      searchText: this.searchText,
      role: this.filterByrole,
      adminId:this.adminId ? this.adminId : this.userID
    };
    console.log("params", params);

    this._hospitalService.getHospitalChatUser(params).subscribe({
      next: (result: IEncryptedResponse<SuperAdminStaffResponse>) => {
        const staffDetails = this._coreService.decryptObjectData({
          data: result,
        });
        console.log("staff all data====", staffDetails);

        const data = [];
        if (staffDetails?.body?.length > 0) {
          for (const staff1 of staffDetails?.body) {
            let staff = JSON.parse(JSON.stringify(staff1));
            data.push({
              staffname: staff.name,
              staffImage:staff?.profile_pic ? staff?.profile_pic : '../../../../assets/img/default_user.png',
              isOnline:staff?.isOnline,
              id:staff?.id,
              role:staff?.role,
              portalType:staff?.type
              // id:staff?.map((ele:any)=>{
              //   return ele.id
              // })
            });
          }
        }
        this.dataSource = data;
        this.totalLength = staffDetails?.body?.length

        // console.log(" this.totalLength",  this.totalLength);
        // console.log("staff all data====", staffDetails);
      },
    });
  }

  handlePageEvent(data: any) {
    this.page = data.pageIndex + 1;
    this.pageSize = data.pageSize;
    this.getAllStaff();
  }

  handleSearchFilter(event: any) {
    this.searchText = event.target.value;
    console.log("staff_name", this.searchText);
    this.getAllStaff();
  }

  createRoom(data: any) {
    console.log("_id>>>>>>>>>>>>>", data);
    const params = {
      sender: this.userID,
      receiver: data.id,
      // loggedINUserId: this.userID,
      token: "Bearer " + localStorage.getItem("token"),
      type:'Hospital',
      portalType:data?.portalType
    };
    console.log("params->>>",params)
    this._webSocketService.createChatRoom(params);
    this.closePopup();
    // this.getRoomList();
  }

  checkstaff(data) {
    this.status = false;
    // console.log(this.receiverID.length);

    if (this.receiverID.length > 0) {
      const idExists = this.receiverID.some((ele: any) => ele === data.id);
      if (idExists) {
        this.status = true;
      }
    } else {
      this.status = false;
    }
    return this.status;
  }

  addGroupMember(data: any) {
    const idIndex = this.receiverID.findIndex((ele: any) => ele === data.id);
    if (idIndex !== -1) {
      // ID exists, remove it
      this.receiverID.splice(idIndex, 1);
      console.log("this.receiverID after removal", this.receiverID);
  
      // Add code to remove the member control from form control array
      const memberIndex = this.groupMembers.controls.findIndex(control => control.value.id === data.id);
      if (memberIndex !== -1) {
        this.groupMembers.removeAt(memberIndex);
      }
    } else {
      // ID doesn't exist, add it
      this.receiverID.push(data.id);
      console.log("this.receiverID after addition", this.receiverID);
  
      // Add code to update the form control array
      const memberControl = this.fb.control(data);
      this.groupMembers.push(memberControl);
    }
  }

  // addGroupMember(data: any) {
  //   const idExists = this.receiverID.some((ele: any) => ele === data.id);
  //   if (!idExists) {
  //     this.receiverID.push(data.id);
  //     console.log("this.receiverID", this.receiverID)

  //     // Add the following code to update the form control array
  //     const memberControl = this.fb.control(data);
  //     this.groupMembers.push(memberControl);
  //   }
  // }

  async createGroupRoom() {
    this.isSubmitted = true;
    if (this.groupForm.invalid || this.groupMembers.length < 2) {
      return;
    }

    if (this.groupProfilePicFile != null) {
      console.log("------------", this.groupProfilePicFile)
      await this.uploadDocuments(this.groupProfilePicFile).then((res: any) => {
        this.groupForm.patchValue({
          profile_pic: res.data[0].Key,
        });
      });
    }
    this.isSubmitted = false;
    const params = {
      profile_pic: this.groupForm.get('profile_pic').value,
      receiver: this.receiverID,
      groupName: this.groupForm.get('groupName').value,
      sender: this.userID,
      isGroupChat: true,
      token: 'Bearer ' + localStorage.getItem('token'),
      type:'Hospital'
    };
    console.log('params===>', params);
    this._webSocketService.createGroupChatRoom(params);
    this.closePopup();
  }

  checkUser(data) {
    // return false
    let status = false;
    // console.log(this.newMembers.length);

    if (this.newMembers.length > 0) {
      const idExists = this.newMembers.some((ele: any) => ele === data.id);
      if (idExists) {
        status = true;
      }
    } else {
      status = false;
    }
    return status;
  }

  addIndividualMemberForExistingGroup(data: any) {
    const idExists = this.newMembers.some((ele: any) => ele === data.id);
    if (!idExists) {
      this.newMembers.push(data.id);
      // Add the following code to update the form control array
      const memberControl = this.fb.control(data);
      this.groupMembers.push(memberControl);
    }
  }

  addMemberToexistingGroup() {
    const params = {
      chatroomId: this.chatRoomID,
      newMembers: this.newMembers,
      senderID: this.userID,
      token: "Bearer " + localStorage.getItem("token"),
      notitype: "chat",
      message: `${this.loggedInUserName} has added you to the group ${this.chatHeaderName}`,
      created_by_type: 'hospital',
      type:'Hospital'
    };
    console.log('params===dfdf>', params);
    this._webSocketService.addMemberToExistingGroup(params);
    this.closePopup();
    // this.handleroute(this.listData[0], true)
  }

  getRoomList(chatId: any = '') {
    const params = {
      id: this.userID,
      searchQuery: this.searchQuery,
      token: "Bearer " + localStorage.getItem("token"),
      type:'Hospital'
    };
    this._hospitalService.getRoomlistService(params).subscribe((res: any) => {
      const decryptedData = this._coreService.decryptObjectData({ data: res });
      if (decryptedData.status == true) {
        this.listData = decryptedData?.body;
        console.log("=============>>>>>",this.listData )
        if (this.listData?.length > 0) {
          if (chatId != '') {
            let data = this.listData.filter((ele: any) => {
              return ele?._id == chatId
            })
            this.handleroute(data[0], true)
          } else {
            this.handleroute(this.listData[0], true)
          }
        }
        console.log(this.listData, "this.listData")
      } else {
        this._coreService.showError(decryptedData.message, "")
      }
    })
  }

  handleSearchFilterForRoom(event: any) {
    this.searchQuery = event.target.value;
    this.getRoomList();
  }

  handleroute(data: any, openDiv: boolean) {
    console.log("data---------->>>>>>>>", data);
    this.selectedreceiver = data?._id;

    this.isOnline = (this.userID === data?.senderDetails?._id) ? data?.receiverDetails[0]?.isOnline : data?.senderDetails?.isOnline;
    let selectedreceiverID = [];

    let groupParticipant = data?.receiverDetails.map((data) => {
      return data?.full_name === this.loggedInUserName ? "You" : data?.full_name;
    });

    this.checkGroup = data?.isGroupChat;
    if (data?.isGroupChat) {
      this.selectedrecieverimage = data?.profile_pic ? data?.profile_pic : "../../../../assets/img/GroupIcon.png";
    }
    else {
      if(this.userID !== data?.senderDetails?._id){
        this.selectedrecieverimage = data?.senderDetails?.profile_picture ? data?.senderDetails?.profile_picture : "../../../../assets/img/default_user.png";
      }else{
        this.selectedrecieverimage = data?.receiverDetails[0]?.profile_picture ? data?.receiverDetails[0]?.profile_picture : "../../../../assets/img/default_user.png";
      }
      // this.selectedrecieverimage =(this.userID !== data?.senderDetails?._id) 
      // ? (data?.senderDetails?.profile_picture
      // || '../../../../assets/img/default_user.png')
      // : (data?.receiverDocumentImage[0]?.url || '../../../../assets/img/default_user.png')
    }

    let recciverdata = data?.receiverDetails.map((data) => {
      return data?._id
    })
    recciverdata.push(data?.senderID);
    recciverdata.splice(recciverdata.indexOf(this.userID), 1);

    this.selectedreceiverID = recciverdata;

    this.fourPortalRole = (this.userID === data?.senderDetails?._id) ? data?.receiverDetails[0]?.role : data?.senderDetails?.role;
    console.log("this.fourPortalRole---->>>>>",this.fourPortalRole)
    this.chatRoom = openDiv;
    this.chatRoomID = data?._id;
    this.latestMessages = data?.latestMessage?.message;
    if (data?.isGroupChat == true) {
      this.chatHeaderName = data?.groupName;
      this.chatWithName = `${groupParticipant}`;
    }
    else {
      let headerName = (this.userID === data?.senderDetails?._id) ? data?.receiverDetails[0]?.full_name : data?.senderDetails?.full_name;
      let data2 = (this.userID === data?.senderDetails?._id) ? data?.senderDetails?.full_name : data?.receiverDetails[0]?.full_name;
      this.chatHeaderName = headerName;
      this.chatWithName = `Chat with ${data2}`
    }
    this.getAllmessages();
  }

  // async sendMessage() {
  //   let messageData = {
  //     chatId: this.chatRoomID,
  //     senderID: this.userID,
  //     receiverID: this.selectedreceiverID,
  //     message: this.typeMessageForm.value.message,
  //     token: "Bearer " + localStorage.getItem("token"),
  //     attachments: this.attachmentFile,
  //     notitype: "chat",
  //     created_by_type: 'hospital',
  //     type:'Hospital',
  //     fourPortalRole: this.fourPortalRole
  //   };

  //   console.log("======messageData======", messageData)

  //   if (this.attachmentToUpload != '') {
  //     await this.uploadDocuments(this.attachmentToUpload).then((res: any) => {
  //       console.log("resresresresres", res)
  //       // messageData.attachments=res.data[0].Key
  //       let imagetype = res?.data[0]?.Key.split('.')[1]
  //       messageData.attachments = { type: imagetype, path: res?.data[0]?.Key }
  //     });
  //   }

  //   this._webSocketService.sendChatMessage(messageData);
  //   this.attachmentToUpload = '';
  //   this.typeMessageForm.reset();
  //   this.removeAttachedImage();
  // }

  async sendMessage() {
    this.isSubmitted = true;
  
    // const hasMessage = this.typeMessageForm.get('message').value.trim() !== '';
    const messageValue = this.typeMessageForm.get('message').value;
    const hasMessage = messageValue && messageValue.trim() !== '';
    const hasAttachment = this.attachmentToUpload !== '';
  
    if (!hasMessage && !hasAttachment) {
      console.log("Invaliddd_______");
      this.toastr.error("Please write a something or attach a file", "Error");
      return;
    }
  
    this.isSubmitted = false;
  
    let messageData = {
      chatId: this.chatRoomID,
      senderID: this.userID,
      receiverID: this.selectedreceiverID,
      message: hasMessage ? this.typeMessageForm.value.message : '',
      token: "Bearer " + localStorage.getItem("token"),
      attachments: null, // Initialize attachments to null
      notitype: "chat",
      created_by_type: 'hospital',
      type:'Hospital',
      fourPortalRole: this.fourPortalRole
    };
    
    if (hasAttachment) {
      // Proceed with attachment upload only if there is an attachment
      await this.uploadDocuments(this.attachmentToUpload).then((res: any) => {
        let imagetype = res?.data[0]?.Key.split('.')[1]
        messageData.attachments = { type: imagetype, path: res?.data[0]?.Key }
      });
    }
  
    this._webSocketService.sendChatMessage(messageData);
    this.attachmentToUpload = '';
    this.typeMessageForm.reset();
    this.removeAttachedImage();
  }

  uploadDocuments(doc: FormData) {
    return new Promise((resolve, reject) => {
      this._hospitalService.uploadDoc(doc).subscribe(
        (res) => {
          console.log("respo1=====", res)
          let response = this._coreService.decryptObjectData({data:res});
          console.log("response=====", response)
          resolve(response);
        },
        (err) => {
          let errResponse = this._coreService.decryptObjectData({
            data: err.error,
          });
          this.toastr.error(errResponse.messgae);
        }
      );
    });
  }

  getAllmessages() {
    let params = {
      chatId: this.chatRoomID,
      page: this.page,
      limit: this.pageSize,
      loggedINId: this.userID
    };

    this._hospitalService.getAllMessagesService(params).subscribe((res) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if (response.status) {
        this.messageData = response?.body;
        console.log(response?.body, "this.messageData")
      }
      else {
        // this._coreService.showError(response.message, "")
        this.messageData = []
      }
    })
  }

  showLightbox(index) {
    this.currentIndex = index;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }

  previewImage(path: any, type?: any) {
    let title: string;
    if (type != 1) {
      path = path;
      title = path.split('upload').slice(-1)[0].slice(1);
    }
    let obj = {image: path, title: title};
    this.imageObject = []; // Fix: Use array assignment to clear the imageObject array
    // this.imageObject.splice(0, this.imageObject.length);
    this.imageObject.push(obj);
    this.showLightbox(0);
  }

  downloadPDF(path: any, pdfName: any) {
    let obj = { image: path, title: pdfName };
    console.log("objjjjjjjjjj", obj)
    FileSaver.saveAs(obj.image, obj.title);
  }

  openFileSelector() {
    let element: HTMLElement = document.getElementsByClassName('file-upload')[0] as HTMLElement;
    element.click();
    // this.scrollToBottom();
  }

  openFileSelector1() {
    let element: HTMLElement = document.getElementsByClassName('file-upload1')[0] as HTMLElement;
    element.click();
    // this.scrollToBottom();
  }

  fileChange(event: any) {
    const file = event.target.files[0];
    // this.attachmentToUpload = file;
    let formData: any = new FormData();
    formData.append("userId", this.userID);
    formData.append("docType", "chat_images");
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
    let allowedType = ['image/jpeg', 'image/jpg', 'image/png', 'audio/mp3', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (allowedType.indexOf(file.type) != -1) {
      this.attachmentType = file.type;
    } else {
      this.attachmentFile = this.attachmentToUpload = '';
      this.toastr.error('File selected is not allowed');
    }
  }

  async onGroupImageChange(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let formData: any = new FormData();
      formData.append("userId", this.userID);
      formData.append("docType", "profile_pic");
      formData.append("multiple", "false");
      formData.append("docName", file);

      this.groupProfilePicFile = formData;

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.groupProfileImage = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  deleteAllmessages() {
    let params = {
      chatId: this.chatRoomID,
      deletedBy: this.userID
    };

    this._hospitalService.clearAllMessages(params).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(response?.status){
        this.closePopup();
        this.getAllmessages();
      }
    })
  }

  deleteSingleMessage(){
    let params = {
      chatId:this.chatRoomID,
      deletedBy: this.userID,
      messageId:this.messageID_todelete
    };
    this._hospitalService.clearSingleMessages(params).subscribe((res: any) => {
      let encryptedData = { data: res };
      let response = this._coreService.decryptObjectData(encryptedData);
      if(response.status){
        this.closePopup();
        this.getAllmessages();
      }
    })
  }

  removeAttachedImage() {
    this.imageObject = this.attachmentFile = undefined;
  }

  onScrollDown() {
    console.log("scrolled down!!");
  }

  onScrollUp() {
    console.log("scrolled up!!");
  }


  //------------Audio Recording Functions--------------

  startAudioRecording() {
    this.isAudioRecording = false;
    this.audioBlobUrl = null;
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      console.log("this.isAudioRecording", this.isAudioRecording)
      this.audioRecordingService.startRecording();
    }
  }

  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
    }
  }

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
    } else {
      this.isAudioRecording = false;
      this.audioBlobUrl = null;
      this.audioRecordingService.abortRecording();
    }
    this.audioBase64 = undefined;
  }


  async addBase64audio() {
    await this.handleAudioBlob(this.audioBlob).then((res: string) => {
      this.audioBase64 = res;
    });
  }

  clearAudioRecordedData() {
    this.audioBlobUrl = null;
  }

  downloadAudioRecordedData() {
    this._downloadFile(this.audioBlob, 'audio/mp3', this.audioName);
  }

  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    //this.video.srcObject = stream;
    //const url = data;
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  handleAudioBlob(evt: any) {
    return new Promise((resolve) => {
      let f = evt; // FileList object
      let reader = new FileReader();
      reader.onload = (function (theFile) {
        return function (e) {
          let binaryData: any = e.target.result;
          let base64String = window.btoa(binaryData);
          resolve(base64String);
        };
      })(f);
      reader.readAsBinaryString(f);
    });
  }

  fixBinary(bin: any) {
    let length = bin.length;
    let buf = new ArrayBuffer(length);
    let arr = new Uint8Array(buf);
    for (let i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return buf;
  }

  getAudioBlob(base64: any) {
    return new Promise((resolve) => {
      let binary = this.fixBinary(atob(base64));
      let blob = new Blob([binary], { type: 'audio/mp3' });
      let url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
      resolve(url);
    });
  }

}
