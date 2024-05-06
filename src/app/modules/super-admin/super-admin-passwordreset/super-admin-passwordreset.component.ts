import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-super-admin-passwordreset',
  templateUrl: './super-admin-passwordreset.component.html',
  styleUrls: ['./super-admin-passwordreset.component.scss']
})
export class SuperAdminPasswordresetComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  
  constructor() { }

  ngOnInit(): void {
  }

}

