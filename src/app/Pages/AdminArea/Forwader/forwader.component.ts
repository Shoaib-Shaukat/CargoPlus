import { Component, OnInit, ViewChildren,QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { forwaderResponse,requestForwader } from '../Models/forwader';
import { ApiService } from '../../../Services/API/api.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {GvarService} from '../../../Services/Globel/gvar.service'

@Component({
  selector: 'app-forwader',
  templateUrl: './forwader.component.html',
  styleUrls: ['./forwader.component.css']
})
export class ForwaderComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  viewForwader:forwaderResponse;
  validForm: boolean = false;
  requestForwader: requestForwader;
  selectedRegion: number;
  selectedCountry: number;
  forwaderForm: FormGroup;
  responseRegions: responseRegions[];
  responseCountries: responseCountries[];
  responseCity: responseCity[];
  requestCity: requestCity;
  requestStRegions: requestStRegions;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showForwader: boolean = true;
  addnewForwader: boolean = false;
  forwaderResponse: forwaderResponse[];
  constructor(public API: ApiService,public GV:GvarService) {
    this.requestCity = new requestCity();
    this.requestStRegions = new requestStRegions();
    this.responseCity = [];
    this.responseCountries = [];
    this.responseRegions = [];
    this.requestForwader = new requestForwader();
    this.viewForwader=new forwaderResponse();
  }
  InitializeForm(): any {
    this.forwaderForm = new FormGroup({
      country: new FormControl("", [Validators.required]),
      region: new FormControl("", [Validators.required]),
      cityid: new FormControl("", [Validators.required]),
      mobile: new FormControl(""),
      fax: new FormControl(""),
      email: new FormControl(""),
      cnic: new FormControl('', [
        Validators.pattern("^[0-9]{13}$")]),
      ph: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      forwaderId:new FormControl(),
      forwaderName: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.forwaderResponse = [];
    this.getCountries();
    this.getForwader();

  }
  getForwader(){
    this.API.getdata('/Setups/getForwader').subscribe(c => {
      if (c != null) {
        
        this.destroyDT(0, false).then(destroyed => {
          
          this.forwaderResponse = c;
          this.dtTrigger.next();
        });
      
      }
    },
      error => {
        
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  getCountries() {
    this.API.getdata('/Generic/getCountries').subscribe(c => {
      if (c != null) {
        this.responseCountries = c;
      }
    },
      error => {
        Swal.fire({
          text: error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addnewForwader = true;
      this.showForwader = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.requestForwader.isNew=true;
    }
    if (callfrm == "Cancel") {
      this.addnewForwader = false;
      this.showForwader = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.forwaderForm.reset(this.forwaderForm.value);
      this.resetForm();
      this.requestForwader.isNew=false;
    }
    if (callfrm == "Edit") {
      this.addnewForwader = true;
      this.showForwader = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.requestForwader.isNew=false;
    }
  }
  changeCountry(event) {
    this.selectedCountry = event;
    this.responseRegions = [];
    this.responseCity = [];
    this.getRegions();
  }
  changeRegion(event) {
    this.selectedRegion = event;
    this.responseCity = [];
    this.getCities();
  }
  getRegions() {
    this.requestStRegions.CountryId = this.selectedCountry;
    this.API.PostData('/Generic/getRegions', this.requestStRegions).subscribe(c => {
      if (c != null) {
        this.responseRegions = c;
      }
    },
      error => {
        Swal.fire({
          text: error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  getCities() {
    this.requestCity.RegionId = this.selectedRegion;
    this.API.PostData('/Generic/getCities', this.requestCity).subscribe(c => {
      if (c != null) {
        this.responseCity = c;
      }
    },
      error => {
        Swal.fire({
          text: error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  resetForm(value:any=undefined){
    this.forwaderForm.reset(value);
   // (this as {submitted:boolean}.submitted=false);
  }
  saveForwader() {
    this.validations();
    if (this.validForm == true) {
      this.requestForwader.forwaderId=this.forwaderForm.controls.forwaderId.value;
      this.requestForwader.CNIC = this.forwaderForm.controls.cnic.value;
      this.requestForwader.PhoneNo = this.forwaderForm.controls.ph.value;
      this.requestForwader.cityID = this.forwaderForm.controls.cityid.value;
      this.requestForwader.countryID = this.forwaderForm.controls.country.value;
      this.requestForwader.emailAddress = this.forwaderForm.controls.email.value;
      this.requestForwader.faxNo = this.forwaderForm.controls.fax.value;
      this.requestForwader.mobileNo = this.forwaderForm.controls.mobile.value;
      this.requestForwader.stateID = this.forwaderForm.controls.region.value;
      this.requestForwader.forwaderAddress = this.forwaderForm.controls.address.value;
      this.requestForwader.forwaderName = this.forwaderForm.controls.forwaderName.value;
      this.requestCity.RegionId = this.selectedRegion;
      this.API.PostData('/Setups/saveForwader', this.requestForwader).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Forwader saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getForwader();
        }
      },
        error => {
          Swal.fire({
            text: error.error.Message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });

    }
  }
  validations() {
    if (this.forwaderForm.controls.forwaderName.value == "" || this.forwaderForm.controls.forwaderName.value == null) {
      Swal.fire({
        text: "Please enter forwader name.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.forwaderForm.controls.country.value == "" || this.forwaderForm.controls.country.value == null) {
      Swal.fire({
        text: "Please select country.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.forwaderForm.controls.region.value == "" || this.forwaderForm.controls.region.value == null) {
      Swal.fire({
        text: "Please select region.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.forwaderForm.controls.cityid.value == "" || this.forwaderForm.controls.cityid.value == null) {
      Swal.fire({
        text: "Please select city.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.forwaderForm.controls.mobile.value == "" || this.forwaderForm.controls.mobile.value == null) {
      Swal.fire({
        text: "Please enter mobile number.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.forwaderForm.controls.address.value == "" || this.forwaderForm.controls.address.value == null) {
      Swal.fire({
        text: "Please enter forwader address.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editForwader(p,i){
    this.showhide("Edit");
    this.selectedCountry=Number(p.countryID);
    this.selectedRegion= Number(p.stateID);
    this.forwaderForm.setValue({
      forwaderId:p.forwaderId,
      forwaderName: p.forwaderName,
      country:p.countryID,
      region:p.stateID,
      cityid:p.cityID,
      mobile:p.mobileNo,
      fax:p.mobileNo,
      email:p.emailAddress,
      cnic:p.CNIC,
      ph:p.PhoneNo,
      address:p.forwaderAddress,
    })
    this.getRegions();
    this.getCities();
  }
  forwaderDetail(p){
    this.viewForwader.CNIC=p.CNIC;
    this.viewForwader.PhoneNo=p.PhoneNo;
    this.viewForwader.countryName=p.countryName;
    this.viewForwader.regionName=p.regionName;
    this.viewForwader.cityName=p.cityName;
    this.viewForwader.emailAddress=p.emailAddress;
    this.viewForwader.mobileNo=p.mobileNo;
    this.viewForwader.forwaderAddress=p.forwaderAddress;
    this.viewForwader.forwaderName=p.forwaderName;

  }
  destroyDT = (tableIndex, clearData): Promise<boolean> => {
    return new Promise((resolve) => {
      if(this.datatableElement)
      this.datatableElement.forEach((dtElement: DataTableDirective, index) => {

        if (index == tableIndex) {
          if (dtElement.dtInstance) {

            if (tableIndex == 0) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });

            }
            else if (tableIndex == 1) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });

            } else if (tableIndex == 2) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });

            }
            else if (tableIndex == 3) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });

            }
            else if (tableIndex == 4) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });

            }

          }
          else {
            resolve(true);
          }

        }
      });
    });
  };
}
