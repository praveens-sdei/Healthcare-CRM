import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pharmacy-passwordreset',
  templateUrl: './pharmacy-passwordreset.component.html',
  styleUrls: ['./pharmacy-passwordreset.component.scss']
})
export class PharmacyPasswordresetComponent implements OnInit {
  login_logo: string = "assets/img/logo_login.png";
  logo: string = "assets/img/logo.svg";
  
  constructor() { }

  ngOnInit(): void {
  }

}
