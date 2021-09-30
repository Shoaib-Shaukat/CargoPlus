import { Component, OnInit, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { shippereResponse, requestShipper } from '../Models/shipper';
import { ApiService } from '../../../Services/API/api.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
@Component({
  selector: 'app-shipper',
  templateUrl: './shipper.component.html',
  styleUrls: ['./shipper.component.css']
})
export class ShipperComponent implements OnInit {
  fileToUpload: File = null;
  imageUrl: string;
  @Output() notifyShipper = new EventEmitter<string>();
  selectShipper(value) {
    this.notifyShipper.emit(value);
  }
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  viewShipper: shippereResponse;
  validForm: boolean = false;
  requestShipper: requestShipper;
  selectedRegion: number;
  selectedCountry: number;
  shipperForm: FormGroup;
  responseRegions: responseRegions[];
  responseCountries: responseCountries[];
  responseCity: responseCity[];
  requestCity: requestCity;
  requestStRegions: requestStRegions;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showShipper: boolean = true;
  addnewShipper: boolean = false;
  shippereResponse: shippereResponse[];
  constructor(public API: ApiService, public GV: GvarService) {
    this.requestCity = new requestCity();
    this.requestStRegions = new requestStRegions();
    this.responseCity = [];
    this.responseCountries = [];
    this.responseRegions = [];
    this.requestShipper = new requestShipper();
    this.viewShipper = new shippereResponse();
  }
  InitializeForm(): any {
    this.shipperForm = new FormGroup({
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
      shipperId: new FormControl(),
      shipperName: new FormControl("", [Validators.required]),
     // attachCNIC: new FormControl(""),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.shippereResponse = [];
    this.getCountries();
    this.getShippers();
    this.shipperForm.controls['country'].setValue(167);
    this.changeCountry(167);

  }
  getShippers() {
    this.API.getdata('/Setups/getShipper').subscribe(c => {
      if (c != null) {

        this.destroyDT(0, false).then(destroyed => {

          this.shippereResponse = c;
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
      this.addnewShipper = true;
      this.showShipper = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.requestShipper.isNew = true;
    }
    if (callfrm == "Cancel") {
      this.addnewShipper = false;
      this.showShipper = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.shipperForm.reset(this.shipperForm.value);
      this.resetForm();
      this.requestShipper.isNew = false;
    }
    if (callfrm == "Edit") {
      this.addnewShipper = true;
      this.showShipper = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.requestShipper.isNew = false;
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
    this.shipperForm.reset(value);
    // (this as {submitted:boolean}.submitted=false);
  }
  saveShipper() {
    this.validations();
    if (this.validForm == true) {
      this.requestShipper.shipperId = this.shipperForm.controls.shipperId.value;
      this.requestShipper.CNIC = this.shipperForm.controls.cnic.value;
      this.requestShipper.PhoneNo = this.shipperForm.controls.ph.value;
      this.requestShipper.cityID = this.shipperForm.controls.cityid.value;
      this.requestShipper.countryID = this.shipperForm.controls.country.value;
      this.requestShipper.emailAddress = this.shipperForm.controls.email.value;
      this.requestShipper.faxNo = this.shipperForm.controls.fax.value;
      this.requestShipper.mobileNo = this.shipperForm.controls.mobile.value;
      this.requestShipper.stateID = this.shipperForm.controls.region.value;
      this.requestShipper.shipperAddress = this.shipperForm.controls.address.value;
      this.requestShipper.shipperName = this.shipperForm.controls.shipperName.value;
      this.requestCity.RegionId = this.selectedRegion;
      this.API.PostData('/Setups/saveShipper', this.requestShipper).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Shipper saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getShippers();
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
    if (this.shipperForm.controls.shipperName.value == "" || this.shipperForm.controls.shipperName.value == null) {
      Swal.fire({
        text: "Please enter shipper name.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.shipperForm.controls.country.value == "" || this.shipperForm.controls.country.value == null) {
      Swal.fire({
        text: "Please select country.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.shipperForm.controls.region.value == "" || this.shipperForm.controls.region.value == null) {
      Swal.fire({
        text: "Please select region.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.shipperForm.controls.cityid.value == "" || this.shipperForm.controls.cityid.value == null) {
      Swal.fire({
        text: "Please select city.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.shipperForm.controls.mobile.value == "" || this.shipperForm.controls.mobile.value == null) {
      Swal.fire({
        text: "Please enter mobile number.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.shipperForm.controls.address.value == "" || this.shipperForm.controls.address.value == null) {
      Swal.fire({
        text: "Please enter shipper address.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editShipper(p, i) {
    this.showhide("Edit");
    this.selectedCountry = Number(p.countryID);
    this.selectedRegion = Number(p.stateID);
    this.shipperForm.setValue({
      shipperId: p.shipperId,
      shipperName: p.shipperName,
      country: p.countryID,
      region: p.stateID,
      cityid: p.cityID,
      mobile: p.mobileNo,
      fax: p.mobileNo,
      email: p.emailAddress,
      cnic: p.CNIC,
      ph: p.PhoneNo,
      address: p.shipperAddress,
    })
    this.getRegions();
    this.getCities();
  }
  shipperDetail(p) {
    this.viewShipper.CNIC = p.CNIC;
    this.viewShipper.PhoneNo = p.PhoneNo;
    this.viewShipper.countryName = p.countryName;
    this.viewShipper.regionName = p.regionName;
    this.viewShipper.cityName = p.cityName;
    this.viewShipper.emailAddress = p.emailAddress;
    this.viewShipper.mobileNo = p.mobileNo;
    this.viewShipper.shipperAddress = p.shipperAddress;
    this.viewShipper.shipperName = p.shipperName;

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

  setShipper(value) {
    if (this.GV.GoodsCallFrom == "ShipperDetail") {
      this.notifyShipper.emit(value);
    }
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }
  Uploadimage() {

    this.API.PostData('/Attachment/uploadFile', this.fileToUpload).subscribe(c => {
      if (c != null) {
        //this.RequestID = c.RequestID;
        Swal.fire({
          text: "ULD type saved successfully.",
          icon: 'success',
          confirmButtonText: 'OK'
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
    // this.restaurantService.postFile(this.fileToUpload).subscribe(
    //   data => {
    //     //  Caption.value = null;
    //     // Image.value = null;
    //     this.imageUrl = data['Imageurl'];
    //   }
    // );
  }
}