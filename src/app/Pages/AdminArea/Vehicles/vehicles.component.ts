import { Component, OnInit, ViewChildren,QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {vehicleRequest,vehicleResponse } from '../Models/vehicles';
import { ApiService } from '../../../Services/API/api.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {GvarService} from '../../../Services/Globel/gvar.service'

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  viewVehilce:vehicleResponse;
  validForm: boolean = false;
  vehicleRequest: vehicleRequest;
  selectedRegion: number;
  selectedCountry: number;
  vehicleForm: FormGroup;
  responseRegions: responseRegions[];
  responseCountries: responseCountries[];
  responseCity: responseCity[];
  requestCity: requestCity;
  requestStRegions: requestStRegions;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showVehicle: boolean = true;
  addnewVehicle: boolean = false;
  vehicleResponse: vehicleResponse[];
  constructor(public API: ApiService,public GV:GvarService) {
    this.requestCity = new requestCity();
    this.requestStRegions = new requestStRegions();
    this.responseCity = [];
    this.responseCountries = [];
    this.responseRegions = [];
    this.vehicleRequest = new vehicleRequest();
    this.viewVehilce=new vehicleResponse();
  }
  InitializeForm(): any {
    this.vehicleForm = new FormGroup({
      vehicleType: new FormControl("", [Validators.required]),
      vehicleID: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.vehicleResponse = [];
    this.getVehicleTypes();

  }
  getVehicleTypes(){
    this.API.getdata('/Setups/getVehicles').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.vehicleResponse = c;
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
  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addnewVehicle = true;
      this.showVehicle = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.vehicleRequest.isNew=true;
    }
    if (callfrm == "Cancel") {
      this.addnewVehicle = false;
      this.showVehicle = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.vehicleForm.reset(this.vehicleForm.value);
      this.resetForm();
      this.vehicleRequest.isNew=false;
    }
    if (callfrm == "Edit") {
      this.addnewVehicle = true;
      this.showVehicle = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.vehicleRequest.isNew=false;
    }
  }
  resetForm(value:any=undefined){
    this.vehicleForm.reset(value);
   // (this as {submitted:boolean}.submitted=false);
  }
  saveAgentTypes() {
    this.validations();
    if (this.validForm == true) {
      this.vehicleRequest.vehicleType=this.vehicleForm.controls.vehicleType.value;
      this.vehicleRequest.vehicleID = this.vehicleForm.controls.vehicleID.value;
      this.API.PostData('/Setups/saveVehicles', this.vehicleRequest).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Vehicle type saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getVehicleTypes();
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
    if (this.vehicleForm.controls.vehicleType.value == "" || this.vehicleForm.controls.vehicleType.value == null) {
      Swal.fire({
        text: "Please enter vehicle type.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editVehicle(p,i){
    this.showhide("Edit");
    this.vehicleForm.setValue({
      vehicleID:p.vehicleID,
      vehicleType: p.vehicleType,
    })
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


