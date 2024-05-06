import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hospital-passwordreset',
  templateUrl: './hospital-passwordreset.component.html',
  styleUrls: ['./hospital-passwordreset.component.scss']
})
export class HospitalPasswordresetComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  
  constructor() { }

  ngOnInit(): void {
  }

}
