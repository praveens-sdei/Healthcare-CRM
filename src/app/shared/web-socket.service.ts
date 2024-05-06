import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket = io(environment.apiUrl);
  isCallBtnClicked = new Subject<boolean>();
  dialogDetails = new Subject<any>();
  callStatus = new Subject<any>();
  isCallPicked = new Subject<boolean>();
  constructor() { }
  isCallStarted(status: boolean) {
    console.log("calluser", status);
    this.isCallBtnClicked.next(status);
  }

  callStartedSubscribe() {
    return this.isCallBtnClicked.asObservable();
  }
  callPickEmit(data) {
    this.socket.emit('call-pick-emit', data);
  }
  sendMessage(data) {
    this.socket.emit('message', data);
  }
  newMessageReceived() {
    const observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  callUser(data:any='') {
    this.socket.emit('call-user', data);
  }
  closeRingerDialog(data) {
    this.socket.emit('close-ringer', data);
  }
  callStatusSubscription() {
    return this.callStatus.asObservable();
  }
  muteTrack(data) {
    this.socket.emit('track-mute', data);
  }
  joinRoom(data) {
    this.socket.emit('join', data);
  }
  endCallEmit(data: any) {
    console.log("callend");

    this.socket.emit('end-call-emit', data);
  }

  endCall() {
    const observable = new Observable<{ user: String }>(observer => {
      this.socket.on('end-call', (data) => {
        console.log("testtttttttt", data);

        observer.next(data);
      });
      return () => {
        console.log("endcalllllllllll");

        this.socket.disconnect();
      };
    });
    return observable;
  }
  closeRingerDialogSubscribe() {
    const observable = new Observable<{ user: String }>(observer => {
      this.socket.on('close-ringer-dialog', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  muteSubscription() {
    const observable = new Observable<{ user: String }>(observer => {
      this.socket.on('track-mute-on', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  participantLeft() {
    const observable = new Observable<{ user: String }>(observer => {
      this.socket.on('participant-left', (data) => {
        console.log("participant-left", data);

        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  notifyCall() {
    const observable = new Observable<{ user: String }>(observer => {
      this.socket.on('notify-call', (data) => {
        console.log("test", data);

        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  
  callReceiveddSubscribe() {
    return this.isCallPicked.asObservable();
  }
  ringingStart(data) {
    this.socket.emit('ringing-start', data);
  }
  callPicked() {
    const observable = new Observable<{ user: String }>(observer => {
      this.socket.on('call-picked', (data) => {
        console.log(data, "call-picked");

        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  ringingStarted() {
    const observable = new Observable<{ user: String }>(observer => {
      this.socket.on('ringing-started', (data) => {
        console.log("start");

        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  openCallingDialog() {
    return this.dialogDetails.asObservable();
  }
  leaveRoom(data) {
    this.socket.off("new message");
    this.socket.emit('leave', data);
  }
  isCallReceived(status: boolean) {
    console.log("callreciedved");

    this.isCallPicked.next(status);
  }
  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }
  openCallerPopup() {
    console.log("datacallinfo");
    const observable = new Observable<{ user: String }>(observer => {
      console.log("datacallinfo");
      this.socket.on('caller-info', (data) => {
        console.log(data, "datacallinfo");

        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  addDialogDetails(data: any) {
    console.log("data", data);

    this.dialogDetails.next(data);
  }
  changeCallingStatus(status: any) {
    this.callStatus.next(status);
  }

  createChatRoom(data: any) {
    console.log("Servicedata---->", data)
    this.socket.emit('create-chat', data);
  }

  getCreateChat(data: any, cb: CallableFunction) {

    this.socket.emit('get-create-chat-room', data);

    // this.socket.on('get-chat-list', (data) => {
    //   console.log("getChatList===>", data)
    //   cb(data);
    // });
  }

  joinChatRoom(data: any) {
    // console.log("data--------------------------<<",data)
    this.socket.emit('joinChatRoom', data);
  }

  leaveChatRoom(data:any){
    this.socket.emit('leave-room',data)
  }
  
  Roomcreated(){
    const observable = new Observable<{ user: String, message: String }>((observer) => {
      this.socket.on('room-created', (data) => {
        console.log(data, "============......data")
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  groupRoomcreated(){
    const observable = new Observable<{ user: String, message: String }>((observer) => {
      this.socket.on('group-room-created', (data) => {
        console.log(data, "====>>>>>..data")
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  sendChatMessage(messageData: any) {
    // console.log("formData service", messageData);
    this.socket.emit('new-message', messageData);
  }

  createGroupChatRoom(data: any) {
    console.log("data=>>>>>>>>>>>", data);
    this.socket.emit('create-group-chat', data);
  }


  newMessageReceivedata() {
    const observable = new Observable<{ user: String, message: String }>((observer) => {
      this.socket.on('new-message-read', (sendMessagData) => {
        console.log(sendMessagData,"sendMessageData");
        
        observer.next(sendMessagData);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  receiveNotification() {
    const observable = new Observable<{ user: String }>((observer) => {
      this.socket.on('received-notification', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  // Getchatmessage() {
  //   const observable = new Observable<{ user: String }>(observer => {
  //     this.socket.on('get-chat-list', (data) => {
  //       observer.next(data);
  //     });
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   });
  //   return observable;
  // }

  addMemberToExistingGroup(data:any){
    this.socket.emit('add-member-to-group-chat', data);
  }

  addMembersToRoom(){
    const observable = new Observable<{ user: String, message: String }>((observer) => {
      this.socket.on('add-member-to-room', (data) => {
        // console.log(data, "data++++++++++")
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  // disconnect() {
  //   console.log("1111111111111",this.socket.connected)
  //   if (this.socket.connected) {
  //     console.log("222222222",this.socket.connected)
  //     this.socket.disconnect();
  //   }
  // }

  receivedNotificationInfo() {
    return new Observable<{ user: String }>((observer) => {
      this.socket.on("recievenoti", (data) => {
        console.log( "received notification");
        observer.next(data);
      });
 
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
