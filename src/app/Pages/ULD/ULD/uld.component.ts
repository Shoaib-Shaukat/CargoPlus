import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ULDResponseModel, ULDData } from './Model';
import { ApiService } from '../../../Services/API/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { responseAirLines } from '../../AdminArea/Models/airLines';
import { retry } from 'rxjs/operators';
import { ULDResponse } from '../ULD/Model';

@Component({
  selector: 'app-uld',
  templateUrl: './uld.component.html',
  styleUrls: ['./uld.component.css']
})
export class ULDComponent implements OnInit {
  defaultAirline: responseAirLines;
  defaultULD: ULDResponse;
  ALCode: string;
  ULDData: ULDData[];
  responseAirLines: responseAirLines[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;

  dtOptions0: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();
  ULDForm: FormGroup;
  validForm: boolean = false;
  ULDResponseModel: ULDResponseModel;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showGrid: boolean = true;
  showNewSection: boolean = false;
  constructor(public API: ApiService, public GV: GvarService) {
    this.InitializeForm();
    this.defaultAirline = new responseAirLines();
    this.defaultULD = new ULDResponse();
    this.ULDResponseModel = new ULDResponseModel();
    this.responseAirLines = [];
    this.ULDData = [];
  }
  InitializeForm(): any {
    this.ULDForm = new FormGroup({
      ULDID: new FormControl(""),
      ALCode: new FormControl(""),
      ULDTypeID: new FormControl(""),
      ULDType: new FormControl(""),
      ULDNo: new FormControl(""),
      taraWeight: new FormControl(""),
      maxGrossWeight: new FormControl(""),
      status: new FormControl(""),
      serviceAbility: new FormControl(""),
      isNew: new FormControl(""),
    });
  }
  ngOnInit(): void {
    window.scroll(0,0);
    this.getAirLines();

  }
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
        this.defaultAirline.ALCode = -1;
        this.defaultAirline.ALName = "Select Airline";
        this.responseAirLines.push(this.defaultAirline);
        this.ULDForm.controls.ALCode.setValue("-1");
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
  getULDTypes() {
    if (this.ULDForm.controls.ALCode.value == "" || this.ULDForm.controls.ALCode.value == null) {
      return;
    }
    this.API.getdata('/ULD/getULDTypesByAirLine?Alcode=' + this.ULDForm.controls.ALCode.value).subscribe(c => {
      if (c != null) {
        this.ULDResponseModel.ULDResponse = c;
        this.defaultULD.ULDTypesID = "-1";
        this.defaultULD.ULDType = "Select ULD Type";
        this.ULDResponseModel.ULDResponse.push(this.defaultULD);
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
  getULD() {
    if (this.ALCode == "" || this.ALCode == null) {
      return;
    }
    this.API.getdata('/ULD/getULD?Alcode=' + this.ALCode).subscribe(c => {
      if (c != null) {
        this.ULDData = c;
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
      this.showNewSection = true;
      this.showGrid = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.ULDForm.reset(true);
      this.ULDForm.controls.isNew.setValue(true);
      this.ULDForm.controls.ALCode.setValue("-1");
      this.ULDForm.controls.serviceAbility.setValue("Available");
      this.ULDForm.controls.status.setValue("Ready");
    }
    if (callfrm == "Cancel") {
      this.showNewSection = false;
      this.showGrid = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.ULDForm.reset(true);
      this.ULDForm.controls.isNew.setValue(false);
      this.ULDForm.controls.ALCode.setValue("-1");
      this.ULDForm.controls.serviceAbility.setValue("Available");
      this.ULDForm.controls.status.setValue("Ready");
    }
    if (callfrm == "Edit") {
      this.showNewSection = true;
      this.showGrid = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.ULDForm.controls.isNew.setValue(false);
    }
  }

  saveData() {
    this.validations();
    if (this.validForm == true) {
      this.API.PostData('/ULD/saveULD', this.ULDForm.value).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "ULD type saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getULDTypes();
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

    if (this.ULDForm.controls.ALCode.value == "" || this.ULDForm.controls.ALCode.value == null) {
      Swal.fire({
        text: "Select AirLine.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ULDForm.controls.ULDTypeID.value == "" || this.ULDForm.controls.ULDTypeID.value == null) {
      Swal.fire({
        text: "Select ULD Type.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ULDForm.controls.ULDNo.value == "" || this.ULDForm.controls.ULDNo.value == null) {
      Swal.fire({
        text: "Enter ULD Number.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ULDForm.controls.taraWeight.value == "" || this.ULDForm.controls.taraWeight.value == null) {
      Swal.fire({
        text: "Enter Tare Weight.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ULDForm.controls.maxGrossWeight.value == "" || this.ULDForm.controls.maxGrossWeight.value == null) {
      Swal.fire({
        text: "Enter Max Goss Weight.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ULDForm.controls.status.value == "" || this.ULDForm.controls.status.value == null) {
      Swal.fire({
        text: "Select Status.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ULDForm.controls.serviceAbility.value == "" || this.ULDForm.controls.serviceAbility.value == null) {
      Swal.fire({
        text: "Select Service Avility.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ULDForm.controls.maxGrossWeight.value == "" || this.ULDForm.controls.maxGrossWeight.value == null) {
      Swal.fire({
        text: "Enter Max Gross Weight.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editULDType(p) {
    this.ULDForm.patchValue(p);
    this.showhide('Edit');
    this.getULDTypes();
    this.ULDForm.controls.ULDTypeID.setValue(p.ULDTypeID);
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
}
