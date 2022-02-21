
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ApiService } from '../../../Services/API/api.service'
import {AuthService} from '../../../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  isReadOnly = true;
  submitted = false;
  public frmSignup: FormGroup;
  countryCode:number;
  constructor(private fb: FormBuilder,private authService: AuthService,private api: ApiService,public route: Router,) {
    this.frmSignup = this.createSignupForm();
    setTimeout(() => {
      this.isReadOnly = false;
    }, 2000);
  }
 
  
  createSignupForm(): FormGroup {
    return this.fb.group(
      {
        password: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8)
          ])
        ],
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  submit() {
    // do signup or something
    console.log(this.frmSignup.value);
    if(this.frmSignup.valid){
      this.api.PostData('/Profile/ChangeDefaultPwd' ,
      {Password : this.frmSignup.controls.password.value}).subscribe(data => {
        Swal.fire("Profile updated.").then(x=>{
          localStorage.setItem('isDefault',"false");
          this.route.navigate(['/Dashboard']);
        });
      },
      error=>{
        Swal.fire({
          text: 'An error occured',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
      });
    }
  }

  logout(){
    this.authService.Logout();
    this.route.navigateByUrl('/login');
  }

  numericOnly(event) {    
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
}
