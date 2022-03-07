import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from '../../../Services/Auth/auth.service'
import { Router } from '@angular/router';
import { ShareService } from '../../../Services/ShareService/share.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { ApiService } from "src/app/Services/API/api.service";
import { thisYear } from '@igniteui/material-icons-extended';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  fileToUpload: any = null;
  imageUrl: string;
  @ViewChild("fileUpload") fileUpload: ElementRef; files = [];
  
  @ViewChildren("PictureModal") PictureModal: ElementRef;
  // this.PictureModal["first"].nativeElement.click();
  StationName: string = "";
  private setMini: boolean = false;
  UserName: any;
  UserId: any;
  empPic:string;

  constructor(public API: ApiService,private authService: AuthService, private router: Router, private shared: ShareService, public GV: GvarService) { }

  ngOnInit(): void {
    window.scroll(0,0);
    this.getempPIC();
    this.StationName = localStorage.getItem('StationName');
    this.UserName = localStorage.getItem('userName');
    this.UserId = localStorage.getItem('UserId');
  }
  onClickLogout() {
    this.authService.Logout();
    this.router.navigateByUrl('/login');
  }

  toggleSidebar() {
    this.setMini = !this.setMini;
    if (this.setMini) {
      this.shared.setSidemenu(true);
    }
    else {
      this.shared.setSidemenu(false);
    }
  }
  getempPIC() {
    this.API.getdata("/Generic/getempPIC").subscribe(
      (c) => {
        if (c != null) {
          this.empPic=c;
        }
      },
      (error) => {
      }
    );
  }

  changePic(file: any) {
    if (!file.target.files)
      return;
    this.fileToUpload = file.target.files[0];
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  uploadPicture(){
    if(this.imageUrl==""){
      alert("Select Image");
    }
    else {
      let body={
        empPIC:this.imageUrl
      }
      this.API.PostData("/Generic/changeProfileImage",body).subscribe(
        (c) => {
          if (c != null) {
            this.PictureModal["first"].nativeElement.click();
            this.getempPIC();
          }
        },
        (error) => {
          this.PictureModal["first"].nativeElement.click();
        }
      );
    }
  }
}
