import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-mat-checkbox',
  template: `
  <mat-checkbox [checked]="" class="example-margin"></mat-checkbox>
  `
})

export class appMatCheckbox implements OnInit{

    @Input() onDataLoad: any;

    ngOnInit(){
        console.log(this.onDataLoad);
    }


}