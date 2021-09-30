import { Component, OnInit, ViewChildren,QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ULDResponseModel } from './Model';
import { ApiService } from '../../../Services/API/api.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {GvarService} from '../../../Services/Globel/gvar.service'
import { responseAirLines } from '../../AdminArea/Models/airLines';

@Component({
  selector: 'app-uldtypes',
  templateUrl: './uldtypes.component.html',
  styleUrls: ['./uldtypes.component.css']
})
export class ULDTypesComponent implements OnInit {
  responseAirLines: responseAirLines[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;

  dtOptions0: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();
  ULDForm:FormGroup;
  validForm: boolean = false;
  ULDResponseModel: ULDResponseModel;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showGrid: boolean = true;
  showNewSection: boolean = false;
  constructor(public API: ApiService,public GV:GvarService) {
    this.ULDResponseModel = new ULDResponseModel();
    this.responseAirLines = [];
  }
  InitializeForm(): any {
    this.ULDForm = new FormGroup({
      ULDTypesID: new FormControl(""),
      ALCode: new FormControl(""),
      ULDType: new FormControl(""),
      taraWeight: new FormControl(""),
      maxGrossWeight: new FormControl(""),
      ALName:new FormControl(""),
      isNew:new FormControl(""),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.getULDTypes();
    this.getAirLines();

  }
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
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
  getULDTypes(){
    this.API.getdata('/ULD/getULDType').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.ULDResponseModel.ULDResponse = c;
          this.dtTrigger0.next();
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
      this.showNewSection = true;
      this.showGrid = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.ULDForm.reset(true);
      this.ULDForm.controls.isNew.setValue(true);
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
  
  saveULDTpes() {
    this.validations();
    if (this.validForm == true) {
            this.API.PostData('/ULD/saveULDType', this.ULDForm.value).subscribe(c => {
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
    if (this.ULDForm.controls.ULDType.value == "" || this.ULDForm.controls.ULDType.value == null) {
      Swal.fire({
        text: "Enter ULD type.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ULDForm.controls.taraWeight.value == "" || this.ULDForm.controls.taraWeight.value == null) {
      Swal.fire({
        text: "Enter tare weight.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    
    this.validForm = true;
  }
  editULDType(p){
    this.ULDForm.patchValue(p);
   this.showhide('Edit');
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
