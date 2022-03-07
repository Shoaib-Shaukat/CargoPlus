import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../../../Services/API/api.service';
import { responseAirLines } from '../../AdminArea/Models/airLines';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { DatePipe } from '@angular/common'
import { aircraftCategoryResponse, aircraftTypesResponse, requestFlight, responseFlight } from '../../Export/Flights/Model/flightsModel';
import { gseMasterRequestModel,gseMasterResponse } from './gseMasterModel';
import {gseCateRequestModel} from '../GSECat/gseCatModel'

@Component({
  selector: 'app-gse-master',
  templateUrl: './gse-master.component.html',
  styleUrls: ['./gse-master.component.css']
})
export class GseMasterComponent implements OnInit {

  gseCateResponseModel:gseCateRequestModel[];
  gseMasterRequestModel: gseMasterRequestModel;
  gseMasterResponse: gseMasterResponse[];
  submitted: boolean = false;


  aircraftCategoryResponse: aircraftCategoryResponse[];
  aircraftTypesResponse: aircraftTypesResponse[];
  defaultFlight: responseFlight;
  defaultAirline: responseAirLines;
  public selectionMode = 'single';
  public $rowEditEnter = false;
  public $cellEditEnter = false;
  public $cellEdit = false;
  public $rowEdit = false;
  public data;
  public departureDate: Date = new Date();
  responseFlightTypes: responseFlight[];
  responseAirLines: responseAirLines[];
  responseFlight: responseFlight[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  dateForDeparture: any;
  validForm: boolean = false;
  validFormForTable: boolean = false;
  requestFlight: requestFlight;
  gseMasterForm: FormGroup;
  tableForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showData: boolean = true;
  addNewData: boolean = false;
  public date: Date = new Date();
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {
    this.gseMasterRequestModel = new gseMasterRequestModel();
    this.gseMasterResponse = [];
    this.gseCateResponseModel=[];
    this.aircraftTypesResponse = [];
    this.defaultFlight = new responseFlight();
    this.defaultAirline = new responseAirLines();
    this.responseFlightTypes = [];
    this.responseFlight = [];
    this.requestFlight = new requestFlight();
    this.responseAirLines = [];
    this.aircraftCategoryResponse = [];
  }

  ngOnInit(): void {
    this.InitializeForm();
    this.getData();
    this.submitted = false;
    this.getCatData();
  }

  InitializeForm(): any {
    this.gseMasterForm = new FormGroup({
      gseMasterID: new FormControl(""),
      gseMRasNo: new FormControl(""),
      PWD: new FormControl(""),
      gsecatID: new FormControl(""),
      gseName: new FormControl("", [Validators.required]),
    });
  }
  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addNewData = true;
      this.showData = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.gseMasterForm.reset();
    }
    if (callfrm == "Cancel") {
      this.submitted = false;
      this.addNewData = false;
      this.showData = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
    }
    if (callfrm == "Edit") {
      this.addNewData = true;
      this.showData = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
    }
  }

  get f() { return this.gseMasterForm.controls; }

  saveDolly() {
    this.validations();
    if (this.validForm == true) {
      this.gseMasterRequestModel = this.gseMasterForm.value;
      this.API.PostData('/Setups/SaveGSEMaster', this.gseMasterRequestModel).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "GSE Master has been saved Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.gseMasterResponse = [];
          this.showhide("Cancel");
          this.getData();
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
    this.submitted = true;
    if (this.gseMasterForm.controls.gseName.value == "" || this.gseMasterForm.controls.gseName.value == null) {
      Swal.fire({
        text: "Enter GSE Name",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.gseMRasNo.value == "" || this.gseMasterForm.controls.gseMRasNo.value == null) {
      Swal.fire({
        text: "Enter GSE Ras number",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.gsecatID.value == "" || this.gseMasterForm.controls.gsecatID.value == null) {
      Swal.fire({
        text: "Select GSE Category.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }

  editCategory(p) {
    this.showhide("Edit");
    this.gseMasterForm.patchValue(p);
  }

  getData() {
    this.API.getdata('/Setups/getGSEMaster').subscribe(c => {
      if (c != null) {
        this.gseMasterResponse = c;
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

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.gseMasterForm.controls.isActive.setValue(true);
    } else {
      this.gseMasterForm.controls.isActive.setValue(false);
    }
  }
  
  getCatData() {
    this.API.getdata('/Setups/getGSECat').subscribe(c => {
      if (c != null) {
        this.gseCateResponseModel = c;
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

