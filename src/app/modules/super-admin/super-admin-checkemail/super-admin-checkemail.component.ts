import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-super-admin-checkemail',
  templateUrl: './super-admin-checkemail.component.html',
  styleUrls: ['./super-admin-checkemail.component.scss']
})
export class SuperAdminCheckemailComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";

  constructor() { }

  ngOnInit(): void {
  }

}
