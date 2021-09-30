import { Component, OnInit ,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import{GvarService} from '../../../Services/Globel/gvar.service'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(router:Router,public Gvars:GvarService,private cdref: ChangeDetectorRef) { 
    router.navigate(['/Dashboard']);
  }

  ngOnInit(): void {
    
  }
  ngAfterContentChecked(){
    this.cdref.detectChanges();
  }
}
