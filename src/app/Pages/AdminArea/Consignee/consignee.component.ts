import { Component, OnInit, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { consigneeResponse, requestConsignee } from '../Models/consignee';
import { ApiService } from '../../../Services/API/api.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { agentsResponse } from '../Models/agents';

@Component({
  selector: 'app-consignee',
  templateUrl: './consignee.component.html',
  styleUrls: ['./consignee.component.css']
})
export class ConsigneeComponent implements OnInit {
  @Output() notifyConsignee = new EventEmitter<string>();
  selectConsignee(value: string) {
    this.notifyConsignee.emit(value);
  }
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject();
  agentsResponse: agentsResponse[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  viewConsignee: consigneeResponse;
  validForm: boolean = false;
  requestConsignee: requestConsignee;
  selectedRegion: number;
  selectedCountry: number;
  consigneeForm: FormGroup;
  responseRegions: responseRegions[];
  responseCountries: responseCountries[];
  responseCity: responseCity[];
  requestCity: requestCity;
  requestStRegions: requestStRegions;
  shownewButton: boolean = true;
  cid: number;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showConsignee: boolean = true;
  addnewConsignee: boolean = false;
  consigneeResponse: consigneeResponse[];
  constructor(public API: ApiService, public GV: GvarService) {
    this.agentsResponse = [];
    this.requestCity = new requestCity();
    this.requestStRegions = new requestStRegions();
    this.responseCity = [];
    this.responseCountries = [];
    this.responseRegions = [];
    this.requestConsignee = new requestConsignee();
    this.viewConsignee = new consigneeResponse();
  }
  InitializeForm(): any {
    this.consigneeForm = new FormGroup({
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
      cid: new FormControl(),
      consigneeName: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.consigneeResponse = [];
    this.getCountries();
    this.getConsignees();
    this.consigneeForm.controls['country'].setValue(167);
    this.changeCountry(167);

  }
  getConsignees() {
    this.API.getdata('/Setups/getConsignee').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.consigneeResponse = c;
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
      this.addnewConsignee = true;
      this.showConsignee = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.requestConsignee.isNew = true;
    }
    if (callfrm == "Cancel") {
      this.addnewConsignee = false;
      this.showConsignee = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.consigneeForm.reset(this.consigneeForm.value);
      this.resetForm();
      this.requestConsignee.isNew = false;
    }
    if (callfrm == "Edit") {
      this.addnewConsignee = true;
      this.showConsignee = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.requestConsignee.isNew = false;
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
  resetForm(value: any = undefined) {
    this.consigneeForm.reset(value);
    // (this as {submitted:boolean}.submitted=false);
  }
  saveConsignee() {
    this.validations();
    if (this.validForm == true) {
      this.requestConsignee.cid = this.consigneeForm.controls.cid.value;
      this.requestConsignee.CNIC = this.consigneeForm.controls.cnic.value;
      this.requestConsignee.PhoneNo = this.consigneeForm.controls.ph.value;
      this.requestConsignee.cityID = this.consigneeForm.controls.cityid.value;
      this.requestConsignee.countryID = this.consigneeForm.controls.country.value;
      this.requestConsignee.emailAddress = this.consigneeForm.controls.email.value;
      this.requestConsignee.faxNo = this.consigneeForm.controls.fax.value;
      this.requestConsignee.mobileNo = this.consigneeForm.controls.mobile.value;
      this.requestConsignee.stateID = this.consigneeForm.controls.region.value;
      this.requestConsignee.consigneeAddress = this.consigneeForm.controls.address.value;
      this.requestConsignee.consigneeName = this.consigneeForm.controls.consigneeName.value;
      this.requestCity.RegionId = this.selectedRegion;
      this.API.PostData('/Setups/saveConsignee', this.requestConsignee).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Consignee saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getConsignees();
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
    if (this.consigneeForm.controls.consigneeName.value == "" || this.consigneeForm.controls.consigneeName.value == null) {
      Swal.fire({
        text: "Please enter Consignee name.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.consigneeForm.controls.country.value == "" || this.consigneeForm.controls.country.value == null) {
      Swal.fire({
        text: "Please select country.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.consigneeForm.controls.region.value == "" || this.consigneeForm.controls.region.value == null) {
      Swal.fire({
        text: "Please select region.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.consigneeForm.controls.cityid.value == "" || this.consigneeForm.controls.cityid.value == null) {
      Swal.fire({
        text: "Please select city.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.consigneeForm.controls.mobile.value == "" || this.consigneeForm.controls.mobile.value == null) {
      Swal.fire({
        text: "Please enter mobile number.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.consigneeForm.controls.address.value == "" || this.consigneeForm.controls.address.value == null) {
      Swal.fire({
        text: "Please enter consignee address.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editConsignee(p, i) {
    this.showhide("Edit");
    this.selectedCountry = Number(p.countryID);
    this.selectedRegion = Number(p.stateID);
    this.consigneeForm.setValue({
      cid: p.cid,
      consigneeName: p.consigneeName,
      country: p.countryID,
      region: p.stateID,
      cityid: p.cityID,
      mobile: p.mobileNo,
      fax: p.mobileNo,
      email: p.emailAddress,
      cnic: p.CNIC,
      ph: p.PhoneNo,
      address: p.consigneeAddress,
    })
    this.getRegions();
    this.getCities();
  }
  consigneeDetail(p) {
    this.viewConsignee.CNIC = p.CNIC;
    this.viewConsignee.PhoneNo = p.PhoneNo;
    this.viewConsignee.countryName = p.countryName;
    this.viewConsignee.regionName = p.regionName;
    this.viewConsignee.cityName = p.cityName;
    this.viewConsignee.emailAddress = p.emailAddress;
    this.viewConsignee.mobileNo = p.mobileNo;
    this.viewConsignee.consigneeAddress = p.consigneeAddress;
    this.viewConsignee.consigneeName = p.consigneeName;

  }
  destroyDT = (tableIndex, clearData): Promise<boolean> => {
    return new Promise((resolve) => {
      if (this.datatableElement)
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
  getAgents(cid: number) {
    this.API.getdata('/Setups/getConAgents?cid=' + cid).subscribe(c => {
      if (c != null) {
        this.destroyDT(1, false).then(destroyed => {
          this.agentsResponse = c;
          this.dtTrigger2.next();
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
  setConsignee(value) {
    if (this.GV.GoodsCallFrom == "ConsigneeDetail") {
      this.notifyConsignee.emit(value);
    }
  }
}
