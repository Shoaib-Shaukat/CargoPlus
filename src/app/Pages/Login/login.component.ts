import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserModel, TokenRequestModel } from './Model/Users'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GvarService } from '../../Services/Globel/gvar.service';
import { ApiService } from '../../Services/API/api.service'
import { Locations } from './Model/locations'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AuthService } from '../../Services/Auth/auth.service'
import { templateJitUrl } from '@angular/compiler';
import { ReCaptcha2Component } from 'ngx-captcha';
declare var jQuery: any;
const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  @ViewChild('langInput') langInput: ElementRef;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';


  TokenRequestModel: TokenRequestModel;
  validForm: boolean = false;
  isReadOnly = true;
  loginForm: FormGroup;
  loginViewModel: UserModel
  clicked = false;
  Locations: Locations[];
  InvalidLogin: boolean;
  errorMessage: string;
  Roles: any = [];
  returnUrl: string;
  constructor(private _el: ElementRef,
    public API: ApiService,
    public route: Router,
    private activatedRoute: ActivatedRoute,
    private GV: GvarService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.TokenRequestModel = new TokenRequestModel();
    this.loginViewModel = new UserModel();
    this.Locations = [];
  }
  ngOnInit() {
    setTimeout(() => {
      this.isReadOnly = false;
    }, 2000);
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
    //this.authService.Logout();
    this.InitializeForm();
    this.getLocations();
  }
  InitializeForm(): any {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      //location: new FormControl('Head Office', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
      recaptcha: new FormControl('', [Validators.required]),
    });
  }
  onLoginClick() {
    this.validations();
    if (this.validForm == true) {
      if (this.loginForm.valid) {
        this.GV.locationID = 1;
        this.clicked = true;
        this.loginForm.disable({ emitEvent: true });
        this.TokenRequestModel.ClientId = "";
        this.TokenRequestModel.Grant_Type = "password";
        this.TokenRequestModel.Refresh_Token = "";
        this.TokenRequestModel.Username = this.loginForm.get('username').value
        this.TokenRequestModel.Password = this.loginForm.get('password').value
        this.API.LoginUser('/api/Token/Auth', this.TokenRequestModel).subscribe(
          data => {
            localStorage.setItem('access_token', data.Access_Token);
            localStorage.setItem('userRoles', data.Roles);
            localStorage.setItem('userName', data.empName);
            localStorage.setItem('UserId', data.UserId);
            localStorage.setItem('StationName', data.StationName);
            localStorage.setItem('isDefault', data.isDefault);
            sessionStorage.setItem('loggedinUser', data.UserId);
            this.route.navigate([this.returnUrl]);
          },
          error => {
            this.InvalidLogin = true;
            this.clicked = false;
            this.loginForm.enable({ emitEvent: true });
            if (error.error.Message != undefined) {
              Swal.fire('CargoPlus', error.error.Message, 'error')
            }
            else {
              Swal.fire('CargoPlus', 'Network Error.', 'error')
            }

          });
      }
    }
  }
  getLocations() {
    this.API.getdata('/Generic/getLocations').subscribe(data => {
      if (data != null) {
        this.Locations = data;
      }
    })
  }
  changeLocations(event) {

  }
  validations() {
    // if (this.loginForm.controls.location.value == "" || this.loginForm.controls.location.value == null) {
    //   Swal.fire({
    //     text: "Please select location.",
    //     icon: 'error',
    //     confirmButtonText: 'OK'
    //   });
    //   this.validForm = false;
    //   return;
    // }
    if (this.loginForm.controls.username.value == "" || this.loginForm.controls.username.value == null) {
      Swal.fire({
        text: "Please enter username.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.loginForm.controls.password.value == "" || this.loginForm.controls.password.value == null) {
      Swal.fire({
        text: "Please enter password.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.loginForm.controls.recaptcha.value == "" || this.loginForm.controls.recaptcha.value == null) {
      Swal.fire({
        text: "Please verify that you’re a human!",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }

  handleSuccess(data) {
    console.log(data);
  }
}


