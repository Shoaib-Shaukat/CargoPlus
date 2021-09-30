import { Component, OnInit, ViewChildren,QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { agentTypeRequest,agentTypeResponse } from '../Models//agentTypes';
import { ApiService } from '../../../Services/API/api.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {GvarService} from '../../../Services/Globel/gvar.service'

@Component({
  selector: 'app-agent-type',
  templateUrl: './agent-type.component.html',
  styleUrls: ['./agent-type.component.css']
})
export class AgentTypeComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  viewAgentType:agentTypeResponse;
  validForm: boolean = false;
  agentTypeRequest: agentTypeRequest;
  selectedRegion: number;
  selectedCountry: number;
  agentTypeFrom: FormGroup;
  responseRegions: responseRegions[];
  responseCountries: responseCountries[];
  responseCity: responseCity[];
  requestCity: requestCity;
  requestStRegions: requestStRegions;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showAgentTypes: boolean = true;
  addnewAgentType: boolean = false;
  agentTypeResponse: agentTypeResponse[];
  constructor(public API: ApiService,public GV:GvarService) {
    this.requestCity = new requestCity();
    this.requestStRegions = new requestStRegions();
    this.responseCity = [];
    this.responseCountries = [];
    this.responseRegions = [];
    this.agentTypeRequest = new agentTypeRequest();
    this.viewAgentType=new agentTypeResponse();
  }
  InitializeForm(): any {
    this.agentTypeFrom = new FormGroup({
      agentType: new FormControl("", [Validators.required]),
      typeid: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.agentTypeResponse = [];
    this.getAgentTypes();

  }
  getAgentTypes(){
    this.API.getdata('/Setups/getAgentTypes').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.agentTypeResponse = c;
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
      this.addnewAgentType = true;
      this.showAgentTypes = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.agentTypeRequest.isNew=true;
    }
    if (callfrm == "Cancel") {
      this.addnewAgentType = false;
      this.showAgentTypes = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.agentTypeFrom.reset(this.agentTypeFrom.value);
      this.resetForm();
      this.agentTypeRequest.isNew=false;
    }
    if (callfrm == "Edit") {
      this.addnewAgentType = true;
      this.showAgentTypes = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.agentTypeRequest.isNew=false;
    }
  }
  resetForm(value:any=undefined){
    this.agentTypeFrom.reset(value);
   // (this as {submitted:boolean}.submitted=false);
  }
  saveAgentTypes() {
    this.validations();
    if (this.validForm == true) {
      this.agentTypeRequest.agentType=this.agentTypeFrom.controls.agentType.value;
      this.agentTypeRequest.typeid = this.agentTypeFrom.controls.typeid.value;
      this.API.PostData('/Setups/saveAgentTypes', this.agentTypeRequest).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Agent type saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getAgentTypes();
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
    if (this.agentTypeFrom.controls.agentType.value == "" || this.agentTypeFrom.controls.agentType.value == null) {
      Swal.fire({
        text: "Please enter agent type.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editAgentType(p,i){
    this.showhide("Edit");
    this.agentTypeFrom.setValue({
      typeid:p.typeid,
      agentType: p.agentType,
    })
  }
  agentTypeDetail(p){
    this.viewAgentType.agentType=p.agentType;
    this.viewAgentType.typeid=p.typeid;
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
