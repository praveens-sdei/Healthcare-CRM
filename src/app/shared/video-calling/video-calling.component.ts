import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { WebSocketService } from "src/app/shared/web-socket.service"
import AgoraRTC, { IAgoraRTCClient, LiveStreamingTranscodingConfig, ICameraVideoTrack, IMicrophoneAudioTrack, ScreenVideoTrackInitConfig, VideoEncoderConfiguration, AREAS, IRemoteAudioTrack, ClientRole } from "agora-rtc-sdk-ng";
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IndiviualDoctorService } from '../../modules/individual-doctor/indiviual-doctor.service';
import { environment } from "src/environments/environment"
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../core.service';
import { PatientService } from '../../modules/patient/patient.service'
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FourPortalService } from 'src/app/modules/four-portal/four-portal.service';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
export interface IRtc {
  client: IAgoraRTCClient,
  localAudioTrack: IMicrophoneAudioTrack,
  localVideoTrack: ICameraVideoTrack
}
export interface IUser {
  uid: number;
  name?: string;
}
@Component({
  selector: 'app-video-calling',
  templateUrl: './video-calling.component.html',
  styleUrls: ['./video-calling.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class VideoCallingComponent implements OnInit {
  private callStartedSubscribe: Subscription = Subscription.EMPTY;
  private openCallerPopup: Subscription = Subscription.EMPTY;
  private notifyCall: Subscription = Subscription.EMPTY;
  private openCallingDialog: Subscription = Subscription.EMPTY;
  private callStatusSubscription: Subscription = Subscription.EMPTY;
  private callReceiveddSubscribe: Subscription = Subscription.EMPTY;
  private ringingStarted: Subscription = Subscription.EMPTY;
  private callPicked: Subscription = Subscription.EMPTY;
  private endCallSubscription: Subscription = Subscription.EMPTY;
  private participantLeft: Subscription = Subscription.EMPTY;
  private closeRingerDialogSubscribe: Subscription = Subscription.EMPTY;
  private muteSubscriptionHandle: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];
  private userSubscription: Subscription = Subscription.EMPTY;
  @Input() loggedInUserName: string;
  @Input() portaltype: string;
  baseUrl: any = environment.apiUrl;
  dialogDetails: any = {};
  isCallingStarted: boolean = false;
  isCallReceived: boolean = false;
  isCallPickedByAnyone: boolean = false;
  isRingingStarted: boolean = false;
  setTimeOutTime: any = 20000;
  //Timer
  hours: number;
  mins: number;
  seconds: number;
  isAudioMuted: boolean = false;
  isVideoMuted: boolean = false;
  remoteParticipants: number = 0;
  activeRoomParticipantsData: any = [];
  isCallRecieved: boolean = false;
  dialogRef: any;
  loggedInUserId: any;
  caller: boolean;
  isJoining: boolean;
  //Agora RTC
  rtc: IRtc = {
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  };
  localTracks = {
    videoTrack: null,
    audioTrack: null
  };
  audio = new Audio();
  audioSetTime: any;
  connectingAudio = new Audio();
  connectingAudioSetTime: any;
  showMuteOptions: boolean = false;
  callStatus: string;
  remoteUsers: IUser[] = [];
  updateUserInfo = new BehaviorSubject<any>(null);
  ringingStartedAudio = new Audio();
  ringingStartedAudioSetTime: any;
  clearTimeOutVar: any;
  timeoutId: any;
  activerole = '';
  appointmentId: any = {};
  videocall: any = "videocall";
  assessmentsList: any
  message: any;
  allmessages: any = [];
  patientId: any = {}
  showchat: any = true;
  showvideo: any = true;
  showExternalUser:any = true;
  userType: any;
  fourportal = 'fourportal';
  form: FormGroup;
  portalType:any = "";
  @Input() callby:any='';
  @Input() roomName:any='';
  @Input() details:any='';
  submitting: boolean = false;
  showMessageCount= 0;

  constructor(private webSocketService: WebSocketService, private ngxLoader: NgxUiLoaderService,
    private readonly renderer: Renderer2, private doctoreservice: IndiviualDoctorService
    , private toastr: ToastrService, private dialog: MatDialog, private modalService: NgbModal, private route: Router, private router: ActivatedRoute, private coreservice: CoreService, private patientservice: PatientService,
    private fourPortalService: FourPortalService,
    private formBuilder: FormBuilder
  ) {
      
  }
  @ViewChild('callingDialog', { static: true }) callingDialog: TemplateRef<any>;
  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;
  @ViewChild('groupDialog', { static: true }) groupDialog: TemplateRef<any>;
  @ViewChild("soap_notes", { static: false }) soap_notes: any;
  ngOnInit(): void {
    console.log(this.router.url, "currenrturl", this.portaltype, this.loggedInUserName);
    this.form = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]]
    });

    if(this.callby == 'external'){
      this.loggedInUserId = this.details.loggedInUserId
    }else{
      
    let loginData = JSON.parse(localStorage.getItem("loginData"));
    this.loggedInUserId = loginData._id
    this.activerole = loginData.role;
    this.userType = loginData?.type 
    
    console.log(localStorage.getItem("opencall"), "opencall");
    localStorage.removeItem("opencall");
    localStorage.removeItem("type");
    }

    let data = JSON.parse(localStorage.getItem("loginData"));
    if(data?.type != undefined){
      this.portalType = data?.type
    }
    console.log(`activerole===========`, this.activerole);
    if(this.activerole === 'PATIENT')
      this.showExternalUser = false;
 
    if (localStorage.getItem("opencall") != null) {
      this.endCall('');
    }
    if(this.callby!='')
    {
 
      this.dialogDetails=this.details;
      this.isCallReceived=true;
      this.isCallPickedByAnyone=true;
      this.startCall();
    }

    this.webSocketService.connect();
    AgoraRTC.setLogLevel(4);
    this.callStartedSubscribe = this.webSocketService.callStartedSubscribe().subscribe((res: any) => {
      console.log("isCallingStarted", this.isCallingStarted);

      this.isCallingStarted = res;
      console.log("isCallingStarted", this.isCallingStarted);

    });
    if (this.userType !== undefined) {
      let req = {
        room: this.loggedInUserId,
        portal_type: this.userType
      }
      this.webSocketService.joinRoom(req)

    } else {
      this.webSocketService.joinRoom({ room: this.loggedInUserId })

    }

    this.openCallerPopup = this.webSocketService.openCallerPopup().subscribe((res: any) => {
      if (res.messageID == 200) {
        this.webSocketService.addDialogDetails(res.data.userData);
        this.webSocketService.changeCallingStatus('Calling');
      }
    });
    this.notifyCall = this.webSocketService.notifyCall().subscribe((res: any) => {
      if (res.messageID == 200) {
        if (!this.isCallReceived) {
          this.dialogDetails = res.data.userData;
          console.log("KUNAL____________________",this.dialogDetails);
          
          this.dialogRef = this.dialog.open(this.callingDialog, {
            panelClass: 'videocallingclass',
            disableClose: true,
          });
          this.playAudio();
          this.clearTimeOutVar = setTimeout(() => { this.dialogRef.close(); this.clearAllSetTimeOut(); this.initializeLocalVariables(); }, this.setTimeOutTime);
          this.appointmentId = this.dialogDetails.chatId
          const ringStartedData = {
            chatId: this.dialogDetails.chatId,
            senderId: this.loggedInUserId,
            roomName: this.dialogDetails.roomName,
            authtoken: "Bearer " + localStorage.getItem("token"),
            portal_type: this.dialogDetails?.portal_type
          };
          this.webSocketService.ringingStart(ringStartedData);
          this.isVideoMuted = false;
        } else {
          this.toastr.info(`Call from ${res.data.userData.name}`, '', { timeOut: 3000 });
        }
      }
    });
    this.openCallingDialog = this.webSocketService.openCallingDialog().subscribe((res: any) => {
      this.dialogDetails = res;
      this.caller = true;
      if (this.isCallingStarted) {
        this.dialogRef = this.dialog.open(this.callingDialog, {
          panelClass: 'common-modal-padding',
          disableClose: true,
        });
        this.playConectingAudio();
        this.clearTimeOutVar = setTimeout(() => { this.dialogRef.close(); this.clearAllSetTimeOut(); this.initializeLocalVariables(); this.clearConnectingTimeOut(); this.clearRingingTimeOut(); }, this.setTimeOutTime);
      }
      this.isVideoMuted = false;
    });
    this.callStatusSubscription = this.webSocketService.callStatusSubscription().subscribe((res: any) => {
      // console.log("callstatus",res);
      // console.log("callstatus",this.callStatus);


      this.callStatus = res;
      // console.log("callstatus",this.callStatus);

    });
    this.callReceiveddSubscribe = this.webSocketService.callReceiveddSubscribe().subscribe((res: any) => {
      this.isCallReceived = res;
    });
    this.ringingStarted = this.webSocketService.ringingStarted().subscribe((res: any) => {
      console.log("");

      if (this.isCallingStarted && res.roomName == this.dialogDetails.roomName && !this.isRingingStarted) {
        console.log("testttt");

        this.isRingingStarted = true;
        this.clearConnectingTimeOut();
        this.ringingStartedAudioFun();
        this.webSocketService.changeCallingStatus('Ringing');
      }
    });
    this.callPicked = this.webSocketService.callPicked().subscribe((res: any) => {
      this.isCallPickedByAnyone = true;
      this.startCall();
    });
    this.webSocketService.newMessageReceived().subscribe((data: any) => {
      console.log("dhgfhgsdfkjsdfhsdfhdslfhsd==",data);

      if (data.room == this.loggedInUserId && this.dialogDetails.chatId == data.chatId) {
        // data.message.attachments.map(async (el) => {
        //   if(el.type == 'audio'){
        //     await this.getAudioBlob(el.path).then((res: any) => {
        //       el.path = res;
        //     });
        //   }
        // });
        // // data.message.content = this.decrypt(data.message.content);
        // data.message.content = data.message.content;

        // this.allMessages.push(data.message);
        this.allmessages.push({ message: data.message, createdAt: data.createdAt, type: data.type });
        this.showMessageCount = data.unread_count;
        // this.markMessageAsRead();
        // setTimeout(() => {
        //   this.scrollToBottom();
        // }, 500);
      }
    });
    this.subscriptions = [this.callStartedSubscribe, this.userSubscription, this.openCallerPopup, this.notifyCall, this.openCallingDialog, this.callStatusSubscription, this.callReceiveddSubscribe, this.ringingStarted, this.callPicked];
    this.endCallSubscribe();
    this.participantLeftSubscribe();
    this.closeRingerDialog();
    this.muteSubscription();
  }
  playAudio() {
    this.audio.src = '../../../../assets/audio/ringer.mp3';
    this.audio.autoplay = true;
    this.audio.load();
    this.audioSetTime = setTimeout(() => { this.playAudio(); }, 8000);
  }
  playConectingAudio() {
    this.connectingAudio.src = '../../../assets/audio/connecting.mp3';
    this.connectingAudio.autoplay = true;
    this.connectingAudio.load();
    this.connectingAudioSetTime = setTimeout(() => { this.playConectingAudio(); }, 2000);
  }
  closeRingerDialog() {
    this.closeRingerDialogSubscribe = this.webSocketService.closeRingerDialogSubscribe().subscribe((res: any) => {
      if (res.roomName == this.dialogDetails.roomName) {
        if (this.dialogRef && !this.isCallReceived) {
          this.dialogRef.close();
          this.clearAllSetTimeOut();
          this.initializeLocalVariables();
        }
      }
    });
    this.subscriptions.push(this.closeRingerDialogSubscribe);
  }

  muteSubscription() {
    this.muteSubscriptionHandle = this.webSocketService.muteSubscription().subscribe((res: any) => {
      if (res.roomName == this.dialogDetails.roomName) {
        if (res.roomName == this.dialogDetails.roomName) {
          if (this.dialogDetails.type == 'video') {
            let trackName = res.identity;
            if (trackName) {
              let element = document.getElementsByClassName('video-' + trackName)[0];
              let imgElement = document.getElementsByClassName('img-identity-' + trackName)[0];
              if (element) {
                if (res.isVideoMuted) {
                  element.classList.contains('d-none') ? '' : element.classList.add('d-none');
                  imgElement.classList.contains('d-none') ? imgElement.classList.remove('d-none') : '';
                } else {
                  element.classList.contains('d-none') ? element.classList.remove('d-none') : '';
                  imgElement.classList.contains('d-none') ? '' : imgElement.classList.add('d-none');
                }
              }
            }
          }
          if (this.dialogDetails.type == 'audio' || this.dialogDetails.type == 'video') {
            let trackName = res.identity;
            if (trackName) {
              let element = document.getElementsByClassName('mic-' + trackName)[0];
              if (element) {
                if (res.isAudioMuted) {
                  element.classList.remove('fa-microphone');
                  element.classList.add('fa-microphone-slash');
                } else {
                  element.classList.remove('fa-microphone-slash');
                  element.classList.add('fa-microphone');
                }
              }
            }
          }
        }
      }
    });
    this.subscriptions.push(this.muteSubscriptionHandle);
  }

  async endCallSubscribe() {
    this.endCallSubscription = this.webSocketService.endCall().subscribe(async (res: any) => {
      console.log("isCallReceivedelse1111111111");
      if (res.roomName == this.dialogDetails.roomName) {
        console.log("tesjhjhjkh", this.isCallReceived, this.isCallingStarted, this.isCallPickedByAnyone);
        // if((this.isCallReceived || this.isCallingStarted) && this.isCallPickedByAnyone){
        //   console.log("isCallReceived");
        //   // window.location.reload();
        // } else {
        console.log("isCallReceivedelse");
        if (this.dialogRef) {
          this.dialogRef.close();
          this.rtc.localVideoTrack.close();
          this.rtc.localAudioTrack.close();
          await this.rtc.client.leave();

          this.localTracks.videoTrack = null;
          this.localTracks.audioTrack = null;
          clearTimeout(this.timeoutId)
          this.webSocketService.changeCallingStatus('');
          // this.isCallPickedByAnyone=false;
          this.isVideoMuted = false;
          this.isAudioMuted = false;
          this.isCallPickedByAnyone = false;
          this.isCallingStarted = false;
          this.isCallReceived = false;
          this.allmessages = [];
          this.showchat = true;
          this.showvideo = true;
          // this.ngOnInit();
          localStorage.removeItem("type");
          // localStorage.removeItem("dialogdetails")
          if (localStorage.getItem("role") == "individual-doctor") {
            console.log(this.dialogDetails.chatId);

            let reqData = {
              appointment_id: this.dialogDetails.chatId,
              columnData: {
                status: "PAST",
                callstatus: "DONE",
              }
            };

            console.log("REQDATA", reqData);

            this.doctoreservice.updateConsultation(reqData).subscribe(
              (res) => {
                let response = this.coreservice.decryptObjectData({ data: res });
                console.log("RESPONSE===>", response);
                if (response.status) {
                  this.modalService.dismissAll("close");
                  this.toastr.success(response.message);
                  if (localStorage.getItem("role") == "individual-doctor") {
                    this.openVerticallyCenteredshopnotes(this.soap_notes);
                  }
                  else {

                  }



                }
              },
              (err) => {
                let errResponse = this.coreservice.decryptObjectData({
                  data: err.error,
                });
                this.toastr.error(errResponse.message);
              }
            );


          }

          if (localStorage.getItem("role") == "portals") {
            console.log(this.dialogDetails.chatId);

            let reqData = {
              appointment_id: this.dialogDetails.chatId,
              columnData: {
                status: "PAST",
                callstatus: "DONE",
              }
            };

            console.log("REQDATA", reqData);

            this.fourPortalService.fourPortal_paymentReceived(reqData).subscribe(
              (res) => {
                let response = this.coreservice.decryptObjectData({ data: res });
                console.log("RESPONSE===>", response);
                if (response.status) {
                  this.modalService.dismissAll("close");
                  this.toastr.success(response.message);
                  if (localStorage.getItem("role") == "portals") {
                    this.openVerticallyCenteredshopnotes(this.soap_notes);
                  }
                  else {

                  }



                }
              },
              (err) => {
                let errResponse = this.coreservice.decryptObjectData({
                  data: err.error,
                });
                this.toastr.error(errResponse.message);
              }
            );


          }
          // else
          // {
          //   console.log("hghdfjshdfjkshdf11111111");

          //   if(localStorage.getItem("role")=="individual-doctor")
          //   {
          //     console.log("hghdfjshdfjkshdf222222222222",localStorage.getItem('opencall'));
          //     // if(localStorage.getItem('opencall')=='call')
          //     // {
          //   this.openVerticallyCenteredshopnotes(this.soap_notes);
          //     // }
          //   }
          // }
          console.log("hghdfjshdfjkshdf222222222222");
          localStorage.removeItem("opencall")

        }
        if (this.isCallReceived || this.isCallingStarted) {
          this.clearRingingTimeOut();
        }
        // }
        this.clearAllSetTimeOut();
        this.clearConnectingTimeOut();
        this.initializeLocalVariables();
      }
    });
    this.subscriptions.push(this.endCallSubscription);
  }
  closesoapnote() {
    this.route.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.route.navigate(["/individual-doctor/appointment/appointmentdetails/" + this.dialogDetails.chatId]).then(() => {
        // console.log(`After navigation I am on:${this.router.url}`)
      })
    })
  }
  participantLeftSubscribe() {
    console.log("patient");
    this.participantLeft = this.webSocketService.participantLeft().subscribe((res: any) => {
      console.log("patient", res, "gggggggg", this.dialogDetails.roomName);
      if (res.roomName == this.dialogDetails.roomName) {
        console.log(Object.keys(this.activeRoomParticipantsData).length, "activeuserlength");
        let participantSid;
        for (const key of Object.keys(this.activeRoomParticipantsData)) {
          if (this.activeRoomParticipantsData[key].identity == res.identity) {
            participantSid = this.activeRoomParticipantsData[key].uid;
          }
        }
        if (this.activeRoomParticipantsData && this.activeRoomParticipantsData.hasOwnProperty(participantSid)) {
          this.getParticipantName(res.identity);
          this.remoteParticipants--;
          delete (this.activeRoomParticipantsData[participantSid]);
          this.checkActiveUsers();
        }
      }
    });
    this.subscriptions.push(this.participantLeft);
  }
  clearAllSetTimeOut() {
    this.audio.pause();
    clearTimeout(this.clearTimeOutVar);
    clearTimeout(this.audioSetTime);
  }
  clearRingingTimeOut() {
    this.ringingStartedAudio.pause();
    this.isRingingStarted = false;
    clearTimeout(this.ringingStartedAudioSetTime);
  }
  ringingStartedAudioFun() {
    this.ringingStartedAudio.src = '../../../../assets/audio/ringer.mp3';
    this.ringingStartedAudio.autoplay = true;
    this.ringingStartedAudio.load();
    this.ringingStartedAudioSetTime = setTimeout(() => { this.ringingStartedAudioFun(); }, 8000);
  }

  clearConnectingTimeOut() {
    this.connectingAudio.pause();
    clearTimeout(this.connectingAudioSetTime);
  }
  muteAudio() {
    if (!this.isAudioMuted) {
      this.isAudioMuted = true;
      this.rtc.localAudioTrack.setMuted(true);
    } else {
      this.isAudioMuted = false;
      this.rtc.localAudioTrack.setMuted(false);
    }
    const data = { roomName: this.dialogDetails.roomName, userId: this.loggedInUserId, isAudioMuted: this.isAudioMuted, isVideoMuted: this.isVideoMuted, authtoken: "Bearer " + localStorage.getItem("token"), portal_type: this.dialogDetails.portal_type };
    this.webSocketService.muteTrack(data);
  }
  endCall(type = '') {
    console.log("endCall");
    console.log("isCallingStarted", this.isCallingStarted);
    if (type == 'caller') {
      localStorage.setItem('type', type);
    }
    this.webSocketService.endCallEmit({ roomName: this.dialogDetails.roomName, loggedInUserId: this.loggedInUserId, authtoken: "Bearer " + localStorage.getItem("token"), portal_type: this.dialogDetails.portal_type });
    // this.route.navigateByUrl('/patient/myappointment/list');
  }

  initializeLocalVariables() {
    console.log("initializeLocalVariables", this.isCallingStarted);

    this.isCallRecieved = false;
    this.caller = false;
    this.webSocketService.isCallReceived(false);
    this.webSocketService.isCallStarted(false);
  }
  joinCall(parameter = '') {

    //     if(parameter!='')
    //     {
    //       this.isCallPickedByAnyone=true;
    //       this.isCallingStarted=true;
    //       this.isCallReceived=true;
    //       console.log(localStorage.getItem("opencall"),this.isCallPickedByAnyone,"joincalll");
    // this.dialogDetails=JSON.parse(localStorage.getItem("dialogdetails"))
    // console.log(localStorage.getItem("opencall"),this.isCallPickedByAnyone,"joincalll",this.dialogDetails,this.dialogDetails.roomName);
    //     }
    console.log("joincall", this.isCallPickedByAnyone);
    this.webSocketService.changeCallingStatus('Connecting...');
    this.webSocketService.isCallReceived(true);
    let mediaPermission;
    mediaPermission = { audio: true };
    if (this.dialogDetails.type == 'video') {
      mediaPermission = { ...mediaPermission, video: true };
    }
    // navigator.mediaDevices.getUserMedia(mediaPermission).then((res: any) => {
    if (!this.isCallPickedByAnyone) {
      console.log("picked1", this.dialogDetails);

      this.webSocketService.callPickEmit(this.dialogDetails);
    } else {
      console.log("picked");
      this.startCall();
    }
    console.log("joincall", this.isCallingStarted);
    // }).catch((err: any) => {
    //   this.toastr.error(this.commonServ.handleUserMediaError(err));
    // });
  }


  async startCall() {
    console.log("isCallingStarted", this.isCallingStarted);

    if (this.isCallingStarted) {
      console.log("isCallingStarted", this.isCallingStarted);

      this.clearRingingTimeOut();
    }
    if (this.isCallReceived || this.isCallingStarted) {
      console.log(localStorage.getItem("opencall"), localStorage.getItem("dialogdetails"), this.dialogDetails, this.dialogDetails.roomName, "joincalll");
      await this.getAccessToken().then(async (response: any) => {
        // if(localStorage.getItem("opencall")==null)
        // {
        //this.dialogRef.close();
        // }

        if(this.callby=='')
        {
          this.dialogRef.close();
        }
        let res = await this.coreservice.decryptObjectData({ data: response });
        console.log("resolve" + res, res.status);
        this.clearAllSetTimeOut();
        if (res.status) {
          console.log("res.body?.token, res.body?.uid", res.body?.token, res.body?.uid);

          this.connect(res.body?.token, res.body?.uid);
          console.log(this.activerole, "activerole");

          // if(this.activerole=='INDIVIDUAL_DOCTOR')
          // {
          // this.route.navigateByUrl("/individual-doctor/appointment/videocall?id="+this.dialogDetails.chatId)

          //  }
          //  else{

          // this.route.navigateByUrl("/patient/waitingroom/calender/"+this.dialogDetails.chatId)

          //  }
          if (localStorage.getItem("opencall") == null) {
            localStorage.setItem("opencall", "call")
            // localStorage.setItem("dialogdetails",JSON.stringify(this.dialogDetails))
          }


          this.dialogRef = this.dialog.open(this.groupDialog, { panelClass: 'groupcalldiolog', disableClose: true });
          this.hours = this.mins = this.seconds = 0;
          console.log("isCallingStarted", this.isCallingStarted);
          if (!this.isCallingStarted) {
            this.webSocketService.closeRingerDialog({ loggedInUserId: this.loggedInUserId, roomName: this.dialogDetails.roomName });
          }
        } else {
          // this.webSocketService.callPickEmit(this.dialogDetails);
          this.toastr.error(res.message);
        }
      });
    } else {
      if (this.dialogRef && !this.isCallReceived) {
      }
    }
  }
  async connect(token: any, uid: any) {
    AgoraRTC.getDevices().then(async (devices) => {
      this.isJoining = true;
      let audioDevices, videoDevices;
      var selectedMicrophoneId, selectedCameraId
      audioDevices = devices.filter(function (device) {
        return device.kind === "audioinput";
      });
      selectedMicrophoneId = audioDevices[0].deviceId;
      this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      if (this.dialogDetails.type == 'video') {
        videoDevices = devices.filter(function (device) {
          return device.kind === "videoinput";
        });
        selectedCameraId = videoDevices[0].deviceId;
        this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
          cameraId: selectedCameraId, encoderConfig: "720p",
        });
      }
      return Promise.all([
        this.rtc
      ]);
    }).then(res => {
      let options = { appId: environment.appIds, channel: this.dialogDetails.roomName, token: token, uid: uid };
      this.startBasicCall(options);
    }).catch(e => {
      this.toastr.error('Something went wrong', e);
      console.log(e, "error")
    });
  }

  async startBasicCall(options) {
    console.log("options", options);

    this.rtc.client = await AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    await this.rtc.client.join(options.appId, options.channel, options.token, options.uid).then(() => {
      console.log("startjoin");

      this.publishLocalTRacks();
      this.isJoining = false;
      this.calculateCallDuration();
      this.publishedRemoteTracks();
    }).catch(e => {
      console.log(e);

      this.toastr.error('Something went wrong', e);
      this.endCall();
    });
  }
  publishLocalTRacks() {
    this.localTracks.audioTrack = this.rtc.localAudioTrack;
    this.localTracks.videoTrack = this.rtc.localVideoTrack;
    let dataTracks = [this.localTracks.audioTrack, ...(this.localTracks.videoTrack) ? [this.localTracks.videoTrack] : []];
    console.log(dataTracks, "dataTracks");

    this.attachLocalTrack();
    this.rtc.client.publish(dataTracks);
  }
  private attachLocalTrack() {
    (this.rtc.localVideoTrack) ? this.rtc.localVideoTrack.play('localVideo') : '';
  }

  private calculateCallDuration() {
    let timer: string = "";
    this.timeoutId = setTimeout(() => {
      this.seconds++;
      if (this.seconds > 59) {
        this.mins++;
        this.seconds = 0;
        if (this.mins > 59) {
          this.mins = 0;
          this.hours++;
        }
      }
      //Format time
      if (this.hours > 0) {
        timer += (this.hours < 10) ? '0' + this.hours : this.hours;
        timer += ':';
      }
      timer += (this.mins < 10) ? '0' + this.mins : this.mins;
      timer += ':';
      timer += (this.seconds < 10) ? '0' + this.seconds : this.seconds;
      this.webSocketService.changeCallingStatus(timer);
      this.calculateCallDuration();
    }, 1000);

  }

  muteVideo() {
    console.log(this.isVideoMuted);

    if (!this.isVideoMuted) {
      this.isVideoMuted = true;
      this.rtc.localVideoTrack.setMuted(true);
    } else {
      this.isVideoMuted = false;
      this.rtc.localVideoTrack.setMuted(false);
    }
    const data = { roomName: this.dialogDetails.roomName, userId: this.loggedInUserId, isAudioMuted: this.isAudioMuted, isVideoMuted: this.isVideoMuted };
    this.webSocketService.muteTrack(data);
  }

  publishedRemoteTracks() {
    this.rtc.client.on("user-published", async (user, mediaType) => {
      console.log("user", user);

      await this.rtc.client.subscribe(user, mediaType);
      if (mediaType === "video") {
        this.attachRemoteTrack(mediaType, user);
      }
      if (mediaType === "audio") {
        this.attachRemoteTrack(mediaType, user);
      }
    });
    this.rtc.client.on("user-unpublished", user => {

    });
    this.rtc.client.on("user-left", user => {
      console.log("user111111111111", user);

      this.remove(user);
    });


    this.rtc.client.on("user-joined", (user) => {
      let id = user.uid;
      this.remoteUsers.push({ 'uid': +id });
      this.updateUserInfo.next(id);
    });
  }

  private getParticipantDetails(identity: string) {
    const data = { roomName: this.dialogDetails.roomName, identity: identity };
    if (this.dialogDetails.portal_type) {
      this.fourPortalService.fourPortal_participantDetails(data).subscribe(async (response: any) => {
        console.log(response, "testttttttttttt");
        let res = await this.coreservice.decryptObjectData({
          data: response,
        });
        if (res.status) {
          console.log(res, "testttttttttttt");

          let nameElement = document.getElementsByClassName('username-' + res.body?.userIdentity)[0];
          if (nameElement) {
            nameElement.innerHTML = res.body?.userName;
          }
          let imgElement = document.getElementsByClassName('img-identity-' + res.body?.userIdentity)[0];
          if (imgElement) {
            imgElement.setAttribute('src',res.body?.userImage ? this.baseUrl + res.body?.userImage: "../../../assets/img/default_user.png");
          }
          this.addParticipantName(res.body?.userIdentity, res.body?.userName);
        } else {
          let nameElement = document.getElementsByClassName('username-' + identity)[0];
          if (nameElement) {
            nameElement.innerHTML = this.dialogDetails.name;
          }
        }
      });
    } else {
      this.doctoreservice.getParticipantDetails(data).subscribe(async (response: any) => {
        console.log(response, "testttttttttttt");
        let res = await this.coreservice.decryptObjectData({
          data: response,
        });
        if (res.status) {
          console.log(res, "testttttttttttt");

          let nameElement = document.getElementsByClassName('username-' + res.body?.userIdentity)[0];
          if (nameElement) {
            nameElement.innerHTML = res.body?.userName;
          }
          let imgElement = document.getElementsByClassName('img-identity-' + res.body?.userIdentity)[0];
          if (imgElement) {
            imgElement.setAttribute('src', res.body?.userImage ? this.baseUrl + res.body?.userImage: "../../../assets/img/default_user.png");
          }
          this.addParticipantName(res.body?.userIdentity, res.body?.userName);
        } else {
          let nameElement = document.getElementsByClassName('username-' + identity)[0];
          if (nameElement) {
            nameElement.innerHTML = this.dialogDetails.name;
          }
        }
      });
    }

  }
  private addParticipantName(identity: string, name: string) {
    for (const key of Object.keys(this.activeRoomParticipantsData)) {
      if (this.activeRoomParticipantsData[key].identity == identity) {
        this.activeRoomParticipantsData[key].participantName = name;
      }
    }
  }
  openchatdiv() {
    if (this.showchat) {
      this.showchat = false;
      this.showvideo = false;
    }
    else {
      this.showchat = true;
      this.showvideo = true;
    }

    this.doctoreservice.updateUnreadMessage(this.dialogDetails.chatId,this.loggedInUserId,'Bearer ' + localStorage.getItem("token"),this.dialogDetails.portal_type).subscribe((res)=>{
      this.showMessageCount =0; 
    });
  }
  private attachRemoteTrack(track: any, user: any) {
    this.remoteParticipants = 0;
    let dataTrack = 0;
    console.log(this.rtc.client.remoteUsers, "client", user);

    this.rtc.client.remoteUsers.forEach((element) => {
      dataTrack++;
      this.activeRoomParticipantsData[element.uid] = { uid: element.uid, identity: element.uid, participantName: '' };
    });
    this.remoteParticipants = dataTrack;

    if (this.dialogDetails.type === 'video') {
      if (track == 'video') {
        console.log(this.remoteVideo.nativeElement, "remotevideo", document.getElementsByClassName('sid-' + user.uid).length);
        if (document.getElementsByClassName('sid-' + user.uid).length == 0) {
          const div = this.renderer.createElement('div');
          const img = this.renderer.createElement('img');
          if (!this.dialogDetails.isGroup) {
            this.renderer.setAttribute(img, 'src',this.dialogDetails.image ? this.baseUrl + this.dialogDetails.image : "../../../assets/img/default_user.png" );
          } else {
            this.renderer.setAttribute(img, 'src', "../../../assets/img/default_user.png");
          }
          this.renderer.addClass(img, 'img-fluid');
          this.renderer.addClass(img, 'd-none');
          this.renderer.addClass(img, 'img-' + user.uid);
          this.renderer.addClass(img, 'img-identity-' + user.uid);
          this.renderer.appendChild(div, img);
          const videoBox = this.renderer.createElement('div');
          this.renderer.addClass(videoBox, 'video_box');
          this.renderer.addClass(videoBox, 'video-' + user.uid);
          this.renderer.addClass(div, 'user');
          this.renderer.addClass(div, 'sid-' + user.uid);
          this.renderer.addClass(div, 'identity-' + user.uid);
          this.renderer.setProperty(videoBox, 'id', 'remote-video-' + user.uid);
          // this.renderer.appendChild(videoBox, element);
          this.renderer.appendChild(div, videoBox);
          const userBtn = this.renderer.createElement('div');
          this.renderer.addClass(userBtn, 'user-buttons');
          //getting anchor data
          const anchor = this.getUserNameOption(user);
          this.renderer.appendChild(userBtn, anchor);
          this.renderer.appendChild(div, userBtn);
          this.renderer.appendChild(this.remoteVideo.nativeElement, div);

        }
        user.videoTrack.play('remote-video-' + user.uid);
        if (this.dialogDetails.isGroup) {
          this.getParticipantDetails(user.uid);
        } else {
          this.addParticipantName(user.uid, this.dialogDetails.name);
        }
      } else {
        const audioBox = this.renderer.createElement('div');
        this.renderer.addClass(audioBox, 'audio_box');
        this.renderer.addClass(audioBox, 'audio-' + user.uid);
        this.renderer.setProperty(audioBox, 'id', 'remote-audio-' + user.uid);
        user.audioTrack.play('remote-audio-' + user.uid);
      }
    }
    if (this.dialogDetails.type === 'audio') {
      if (track == 'audio') {
        const div = this.renderer.createElement('div');
        const img = this.renderer.createElement('img');
        if (!this.dialogDetails.isGroup) {
          this.renderer.setAttribute(img, 'src', this.dialogDetails.image ? this.baseUrl + this.dialogDetails.image: "../../../assets/img/default_user.png");
        } else {
          this.renderer.setAttribute(img, 'src', "../../../assets/img/default_user.png");
        }
        this.renderer.addClass(img, 'img-fluid');
        this.renderer.addClass(img, 'img-' + user.uid);
        this.renderer.addClass(img, 'img-identity-' + user.uid);
        this.renderer.appendChild(div, img);
        const audioBox = this.renderer.createElement('div');
        this.renderer.addClass(audioBox, 'audio_box');
        this.renderer.addClass(audioBox, 'audio-' + user.uid);
        this.renderer.addClass(div, 'user');
        this.renderer.addClass(div, 'sid-' + user.uid);
        this.renderer.addClass(div, 'identity-' + user.uid);
        this.renderer.setProperty(audioBox, 'id', 'remote-audio-' + user.uid);
        this.renderer.appendChild(div, audioBox);
        const userBtn = this.renderer.createElement('div');
        this.renderer.addClass(userBtn, 'user-buttons');
        const anchor = this.getUserNameOption(user);
        this.renderer.appendChild(userBtn, anchor);
        this.renderer.appendChild(div, userBtn);
        this.renderer.appendChild(this.remoteVideo.nativeElement, div);
        user.audioTrack.play('remote-audio-' + user.uid);
        if (this.dialogDetails.isGroup) {
          this.getParticipantDetails(user.uid);
        } else {
          this.addParticipantName(user.uid, this.dialogDetails.name);
        }
      }
    }
  }

  private getUserNameOption(user: any) {
    const anchor = this.renderer.createElement('a');
    this.renderer.addClass(anchor, 'userName');
    const span = this.renderer.createElement('span');
    this.renderer.addClass(span, 'username-' + user.uid);
    // if(!this.dialogDetails.isGroup){
    // const text = this.renderer.createText(this.dialogDetails.name);
    // this.renderer.appendChild(span, text);
    // }
    this.renderer.appendChild(anchor, span);
    const btnDiv = this.renderer.createElement('div');
    this.renderer.addClass(btnDiv, 'flt_btn');
    const btn = this.renderer.createElement('button');
    this.renderer.addClass(btn, 'btn');
    const mic = this.renderer.createElement('i');
    this.renderer.addClass(mic, 'fas');
    this.renderer.addClass(mic, 'fa-microphone');
    this.renderer.addClass(mic, 'mic-' + user.uid);
    this.renderer.appendChild(btn, mic);
    this.renderer.appendChild(btnDiv, btn);
    this.renderer.appendChild(anchor, btnDiv);
    return anchor;
  }

  remove(participant: any) {

    if (this.activeRoomParticipantsData && this.activeRoomParticipantsData.hasOwnProperty(participant.uid)) {
      this.getParticipantName(participant.uid);
      this.remoteParticipants--;
      delete (this.activeRoomParticipantsData[participant.uid]);
      this.checkActiveUsers();
    }
  }
  private checkActiveUsers() {
    console.log(Object.keys(this.activeRoomParticipantsData).length, "activeuserlength");
    console.log(this.activeRoomParticipantsData, "activeuserdata");

    if (Object.keys(this.activeRoomParticipantsData).length == 0 && localStorage.getItem('role') != 'individual-doctor') {
      this.endCall();
    }
  }

  private getParticipantName(id: string): void {
    let elemMatch;
    for (const key of Object.keys(this.activeRoomParticipantsData)) {
      if (this.activeRoomParticipantsData[key].identity == id) {
        elemMatch = this.activeRoomParticipantsData[key];
      }
    }
    this.toastr.info(`${(elemMatch.participantName != "") ? elemMatch.participantName : this.dialogDetails.name}  left`, '', { timeOut: 3000 });
    let divElement = document.getElementsByClassName('identity-' + id)[0];
    if (divElement) {
      divElement.remove();
    }
  }
  getAccessToken() {
    return new Promise((resolve) => {
      const data = { roomName: this.dialogDetails.roomName, loginname: this.dialogDetails.ownname, chatId: this.dialogDetails.chatId, authtoken: "Bearer " + localStorage.getItem("token"), loggedInUserId: this.loggedInUserId, uid: this.generateUid(), portal_type: this.dialogDetails.portal_type };
      console.log("AAAA", data);
      if (this.dialogDetails.portal_type) {
        this.fourPortalService.fourPortal_fetchRoomcall(data).subscribe(async (res) => {
          console.log("resolve" + res);

          resolve(res);
        });
      } else {
        this.doctoreservice.getAccessToken(data).subscribe(async (res) => {
          console.log("resolve" + res);

          resolve(res);
        });
      }

    });
  }
  generateUid() {
    const length: number = 5;
    const randomNo = (Math.floor(Math.pow(10, length) + Math.random() * 9 * Math.pow(10, length)));
    return randomNo;
  }

  getAssessmentList() {
    let reqData = {
      appointmentId: this.dialogDetails.chatId,
    };
    if (this.dialogDetails?.portal_type) {

      this.fourPortalService.fourPortal_listAssesment_Appointment(reqData).subscribe((res) => {
        let response = this.coreservice.decryptObjectData({ data: res });
        console.log("ASSESSMENT LIST====>", response);
        if (response.status) {
          if (response?.body != null) {
            this.assessmentsList = response?.body?.assessments;
          }
        }
      });
    } else {
      this.patientservice.getAssessmentList(reqData).subscribe((res) => {
        let response = this.coreservice.decryptObjectData({ data: res });
        console.log("ASSESSMENT LIST====>", response);
        if (response.status) {
          if (response?.body != null) {
            this.assessmentsList = response?.body?.assessments;
          }
        }
      });
    }

  }
  // Assessment modal
  openVerticallyCenteredassessment(assessment: any) {
    this.getAssessmentList();
    this.modalService.open(assessment, {
      centered: true,
      size: "lg",
      windowClass: "assessment",
    });
  }

  // Assessment modal
  viewprofilepopup(viewprofile: any) {
    this.ngxLoader.start();
    if (this.dialogDetails.portal_type) {
      let reqData = {
        appointment_id: this.dialogDetails.chatId, portal_type: this.dialogDetails.portal_type
      }
      this.fourPortalService
        .fourPortal_appointment_deatils(reqData)
        .subscribe((res) => {
          let response = this.coreservice.decryptObjectData({ data: res });
          console.log("responseappointment", response);

          this.patientId = {
            appointmentId: this.dialogDetails.chatId,
            patientId: response?.data?.patientAllDetails?.portalUserDetails?._id,
            openbyvideo: true
          }
          this.modalService.open(viewprofile, {
            centered: true,
            size: "xl",
            windowClass: "viewprofile",
            backdrop: "static",
          });
          this.ngxLoader.stop();
        });
    } else {
      this.doctoreservice
        .viewAppointmentDetails(this.dialogDetails.chatId)
        .subscribe((res) => {
          let response = this.coreservice.decryptObjectData({ data: res });
          console.log("responseappointment", response);

          this.patientId = {
            appointmentId: this.dialogDetails.chatId,
            patientId: response?.data?.patientAllDetails?.portalUserDetails?._id,
            openbyvideo: true
          }
          this.modalService.open(viewprofile, {
            centered: true,
            size: "xl",
            windowClass: "viewprofile",
            backdrop: "static",
          });
          this.ngxLoader.stop();
        });
    }




  }

  //  Approved modal
  openVerticallyCenteredstop(stop: any) {
    this.modalService.open(stop, {
      centered: true,
      size: "md",
      windowClass: "stop_consultation",
      backdrop: "static",

    });
  }

  //  Shop Notes modal
  openVerticallyCenteredshopnotes(soap_notes: any) {
    this.modalService.open(soap_notes, {
      centered: true,
      size: "md",
      windowClass: "soap_notes",
      backdrop: "static",
    });
  }

  //  Add ePrescription modal
  openVerticallyCenteredaddeprescription(add_eprescription: any) {
    this.modalService.open(add_eprescription, {
      centered: true,
      size: "md",
      windowClass: "eprescription viewprofile",
      backdrop: "static",
    });
  }

  openVerticallyCenteredaddeexternaluser(add_eprescription: any){
    this.modalService.open(add_eprescription, {
      centered: true,
      size: "md",
      windowClass: "eprescription viewprofile",
      backdrop: "static",
    });
  }

  redirectprescription() {
    this.modalService.dismissAll('close')
    if (this.dialogDetails?.portal_type) {
      this.route.navigate([`/portals/eprescription/${this.userType}/details/${this.dialogDetails.chatId}`])
    } else {

      this.route.navigate(["/individual-doctor/eprescription/details/" + this.dialogDetails.chatId])
    }
  }
  redirectpast() {
    if (this.dialogDetails?.portal_type) {
      this.route.navigate([`/portals/appointment/${this.userType}/appointment-details/` + this.dialogDetails.chatId])

    } else {

      this.route.navigate(["/individual-doctor/appointment/appointmentdetails/" + this.dialogDetails.chatId])
    }
  }

  //  Claim modal
  openVerticallyCenteredmakeclaim(make_claim: any) {
    this.modalService.open(make_claim, {
      centered: true,
      size: "md",
      windowClass: "make_claim",
      backdrop: "static",
    });
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
  openmodal() {
    this.dialog.open(this.groupDialog, { panelClass: 'groupcalldiolog', disableClose: true });
  }
  async sendMessage() {
    if ((this.message == undefined || this.message == '')) {
      this.toastr.error('Please type a message to continue.');
      return;
    }

    this.allmessages.push({ message: this.message, createdAt: new Date(), type: "sender" });
    let read = false;
    console.log(`showchat`,this.showchat );
    this.webSocketService.sendMessage({
      message: this.message, createdAt: new Date(), type: "recieve"
      ,senderId: this.loggedInUserId, chatId: this.dialogDetails.chatId, authtoken: 'Bearer ' + localStorage.getItem("token"), portal_type: this.dialogDetails.portal_type
    });
    this.message = "";
  }

  handleRouting() {
    this.route.navigate(
      ["/individual-doctor/patientmanagement/counsultPatientDetails"],
      {
        queryParams: {
          appointmentId: "64019d756fae087b83d679c0",
          patientId: "63e1f567a825766f5c52b0de",
        },
      }
    );
  }

  sendExternalUser(){
    if(this.form){
      this.submitting = true;
      let appointmentId= btoa(this.dialogDetails?.chatId);   
      this.doctoreservice.sendExternalUserEmail(this.form.value.email,appointmentId,this.portalType)
      .subscribe(
        (res)=>{
          let response = this.coreservice.decryptObjectData({ data: res });
            console.log("responseappointment", response);
            if(response.status){
              this.form.reset();
              this.modalService.dismissAll('close');
              this.toastr.success("Successfully send Email.")
              this.submitting = false;
            }else{
              this.toastr.error("Invalid Email.")
              this.form.reset();
              this.submitting = false;
            }
        },
        (err)=>{
          this.toastr.error("Invalid Email.")
          this.submitting = false;
        }
        
      )
    }
  }

  closePopup(){
    this.form.reset();
    this.modalService.dismissAll('close');
  }

  closeChatPopup(){
     this.showchat = true;
     this.showvideo = true;
     this.doctoreservice.updateUnreadMessage(this.dialogDetails.chatId,this.loggedInUserId,'Bearer ' + localStorage.getItem("token"),this.dialogDetails.portal_type).subscribe((res)=>{
      this.showMessageCount =0; 
    });
  }
}

