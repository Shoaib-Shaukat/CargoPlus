import { Component, OnInit, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../../../Services/API/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { notifyResponse } from './Notify-model';
import { requestStRegions, responseCity, responseCountries } from '../../AdminArea/Models/cityState';


@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {
  editMode: boolean = false;
  notifyResponse: notifyResponse;
  responseCountries: responseCountries[];
  responseCity: responseCity[];
  requestStRegions: requestStRegions;
  @Output() notifyNotify = new EventEmitter<string>();
  selectNotify(value: string) {
    this.notifyNotify.emit(value);
  }
  @Output() notifyConsignee = new EventEmitter<string>();
  selectConsignee(value: string) {
    this.notifyConsignee.emit(value);
  }
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject();
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  validForm: boolean = false;
  selectedRegion: number;
  selectedCountry: number;
  NotifyForm: FormGroup;
  shownewButton: boolean = true;
  cid: number;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showNotify: boolean = true;
  AddNewNotify: boolean = false;
  constructor(public API: ApiService, public GV: GvarService) {
    this.responseCountries = [];
    this.responseCity = [];
    this.requestStRegions = new requestStRegions();
    this.notifyResponse = new notifyResponse();
  }
  InitializeForm(): any {
    this.NotifyForm = new FormGroup({
      notifyID: new FormControl(""),
      airportID: new FormControl(""),
      notifyName: new FormControl(""),
      countryID: new FormControl(""),
      cityID: new FormControl(""),
      ZIPCode: new FormControl(""),
      contactNo: new FormControl(""),
      createdBy: new FormControl(""),
      createdDate: new FormControl(""),
      modifiedBy: new FormControl(""),
      modifiedDate: new FormControl(""),
      isDeleted: new FormControl(""),
      isNew: new FormControl(""),
      notifyAddress: new FormControl(""),
    });
  }
  ngOnInit(): void {
    window.scroll(0,0);
    this.InitializeForm();
    this.getCountries();
    this.getNotifyData();
  }

  getNotifyData() {
    this.API.getdata('/Setups/getNotify').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.notifyResponse = c;
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
  changeCountry(event) {
    this.selectedCountry = event;
    this.responseCity = [];
    this.getCities();
  }
  getCountries() {
    this.API.getdata('/Generic/getCountries').subscribe(c => {
      if (c != null) {
        this.responseCountries = c;
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
  getCities() {
    this.requestStRegions.CountryId = this.selectedCountry;
    this.API.PostData('/Generic/getCitiesbyCountry', this.requestStRegions).subscribe(c => {
      if (c != null) {
        this.responseCity = c;
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
  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.AddNewNotify = true;
      this.showNotify = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.editMode = false;
      this.responseCity = [];
    }
    if (callfrm == "Cancel") {
      this.AddNewNotify = false;
      this.showNotify = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.NotifyForm.reset(this.NotifyForm.value);
      this.editMode = false;
      this.resetForm();
    }
    if (callfrm == "Edit") {
      this.AddNewNotify = true;
      this.showNotify = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
    }
  }
  resetForm(value: any = undefined) {
    this.NotifyForm.reset(value);
  }

  validations() {
    if (this.NotifyForm.controls.notifyName.value == "" || this.NotifyForm.controls.notifyName.value == null) {
      Swal.fire({
        text: "Enter Notifier Name",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.NotifyForm.controls.ZIPCode.value == "" || this.NotifyForm.controls.ZIPCode.value == null) {
      Swal.fire({
        text: "Enter Zip Code",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.NotifyForm.controls.countryID.value == "" || this.NotifyForm.controls.countryID.value == null) {
      Swal.fire({
        text: "Select Country",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.NotifyForm.controls.cityID.value == "" || this.NotifyForm.controls.cityID.value == null) {
      Swal.fire({
        text: "Select City",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }

  editNotify(p) {
    this.showhide("Edit");
    this.NotifyForm.patchValue(p);
    this.editMode = true;
    this.selectedCountry = Number(p.countryID);
    this.selectedRegion = Number(p.stateID);
    this.getCities();
  }

  saveNotify() {
    this.validations();
    if (this.validForm == true) {
      if (this.editMode == true) {
        this.NotifyForm.controls.isNew.setValue(false);
      }
      else {
        this.NotifyForm.controls.isNew.setValue(true);
      }
      this.notifyResponse = this.NotifyForm.value;
      this.API.PostData('/Setups/AddNotify', this.notifyResponse).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Saved Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getNotifyData();
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
  setNotify(value) {
    if (this.GV.GoodsCallFrom == "NotifyDetail") {
      this.notifyNotify.emit(value);
    }
  }
}
