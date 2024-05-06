import { Component, OnInit } from "@angular/core";
import * as uuid from "uuid";
import { CoreService } from "./shared/core.service";
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from "./shared/auth.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "healthcare-crm";
  constructor(private auth: AuthService, private _coreService: CoreService, private bnIdle : BnNgIdleService) {
    this.getDeviceId();
  }
  ngOnInit(): void {
    this.bnIdle.startWatching(900).subscribe((isTimedOut: boolean) => {
      console.log("isTimedOut____________", isTimedOut);

      this.logout()
      this._coreService.showWarning("", "Session Expired")
      console.log('session expired');
    });

    if (!localStorage.getItem("uuid")) {
      const deviceId = uuid.v4();
      localStorage.setItem("uuid", deviceId);
    }

    if (!navigator.onLine) {
      alert('Check Your Internet Connection')
    }


  }

  async getDeviceId() {
    await this._coreService.getUUID().then((res) => {
      if (!localStorage.getItem("deviceId")) {
        const deviceId = res;
        localStorage.setItem("deviceId", deviceId);
      }
    })
  }
  logout() {
    this.auth.logout(`/patient/homepage`);
  }
}
