import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { AuthService } from '../../../Services/Auth/auth.service'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(private authService: AuthService, public router: Router, public Gvars: GvarService, private cdref: ChangeDetectorRef) {
    var session = sessionStorage.getItem('loggedinUser');
    if (session == null || session == undefined) {
      this.onClickLogout()
      return;
    }
    router.navigate(['/Dashboard']);
  }
  onClickLogout() {
    this.authService.Logout();
    this.router.navigateByUrl('/login');
  }
  ngOnInit(): void {
    window.scroll(0,0);
    var isDefault = localStorage.getItem('isDefault');
    if (isDefault == "true") {
      this.router.navigate(['/changePassword']);
    }

  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
