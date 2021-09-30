import { Component, OnInit, ViewChildren,QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {requestUDM,responseUDM } from '../Models/udmMaster';
import { ApiService } from '../../../Services/API/api.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {GvarService} from '../../../Services/Globel/gvar.service'

@Component({
  selector: 'app-udm-master',
  templateUrl: './udm-master.component.html',
  styleUrls: ['./udm-master.component.css']
})
export class UdmMasterComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  viewUDM:responseUDM;
  validForm: boolean = false;
  requestUDM: requestUDM;
  selectedRegion: number;
  selectedCountry: number;
  UDMForm: FormGroup;
  responseRegions: responseRegions[];
  responseCountries: responseCountries[];
  responseCity: responseCity[];
  requestCity: requestCity;
  requestStRegions: requestStRegions;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showUDM: boolean = true;
  addnewUDMMAster: boolean = false;
  responseUDM: responseUDM[];
  constructor(public API: ApiService,public GV:GvarService) {
    this.requestCity = new requestCity();
    this.requestStRegions = new requestStRegions();
    this.responseCity = [];
    this.responseCountries = [];
    this.responseRegions = [];
    this.requestUDM = new requestUDM();
    this.viewUDM=new responseUDM();
  }
  InitializeForm(): any {
    this.UDMForm = new FormGroup({
      description: new FormControl("", [Validators.required]),
      udmid: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.responseUDM = [];
    this.getUDMMaster();

  }
  getUDMMaster(){
    this.API.getdata('/Setups/getUDMMaster').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.responseUDM = c;
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
      this.addnewUDMMAster = true;
      this.showUDM = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.requestUDM.isNew=true;
    }
    if (callfrm == "Cancel") {
      this.addnewUDMMAster = false;
      this.showUDM = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.UDMForm.reset(this.UDMForm.value);
      this.resetForm();
      this.requestUDM.isNew=false;
    }
    if (callfrm == "Edit") {
      this.addnewUDMMAster = true;
      this.showUDM = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.requestUDM.isNew=false;
    }
  }
  resetForm(value:any=undefined){
    this.UDMForm.reset(value);
   // (this as {submitted:boolean}.submitted=false);
  }
  saveAgentTypes() {
    this.validations();
    if (this.validForm == true) {
      this.requestUDM.description=this.UDMForm.controls.description.value;
      this.requestUDM.udmid = this.UDMForm.controls.udmid.value;
      this.API.PostData('/Setups/saveUDMMaster', this.requestUDM).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "UDM Master saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getUDMMaster();
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
    if (this.UDMForm.controls.description.value == "" || this.UDMForm.controls.description.value == null) {
      Swal.fire({
        text: "Please enter UDM Master detail.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editUDMMaster(p,i){
    this.showhide("Edit");
    this.UDMForm.setValue({
      udmid:p.udmid,
      description: p.description,
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

