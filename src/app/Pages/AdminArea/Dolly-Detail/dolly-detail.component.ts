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
import { DollyRequestModel, DollyResponseModel } from './Dolly.Model';

@Component({
  selector: 'app-dolly-detail',
  templateUrl: './dolly-detail.component.html',
  styleUrls: ['./dolly-detail.component.css']
})
export class DollyDetailComponent implements OnInit {
  DollyRequestModel: DollyRequestModel;
  DollyResponseModel: DollyResponseModel[];
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
  DollyForm: FormGroup;
  tableForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showDolly: boolean = true;
  addNewDolly: boolean = false;
  public date: Date = new Date();
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {
    this.DollyRequestModel = new DollyRequestModel();
    this.DollyResponseModel = [];

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
    this.getDolly();
    this.submitted = false;
  }

  InitializeForm(): any {
    this.DollyForm = new FormGroup({
      dollyID: new FormControl(""),
      dollyName: new FormControl("", [Validators.required]),
      dollyWeight: new FormControl("", [Validators.required]),
      isActive: new FormControl(""),
    });
  }

  searchDolly() {
    if (this.validFormForTable == true) {
      this.API.getdata('/Setups/getDollyByDollyName?DollyName=' + this.tableForm.controls.DollyNameForTable.value).subscribe(c => {
        if (c != null) {
          this.responseFlight = c;
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

  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addNewDolly = true;
      this.showDolly = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.DollyForm.reset();
    }
    if (callfrm == "Cancel") {
      this.submitted = false;
      this.addNewDolly = false;
      this.showDolly = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
    }
    if (callfrm == "Edit") {
      this.addNewDolly = true;
      this.showDolly = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
    }
  }

  get f() { return this.DollyForm.controls; }

  saveDolly() {
    this.validations();
    if (this.validForm == true) {
      if (this.DollyForm.controls.isActive.value == "" || this.DollyForm.controls.isActive.value == null) {
        this.DollyForm.controls.isActive.setValue(false);
      }
      this.DollyRequestModel = this.DollyForm.value;
      this.API.PostData('/Setups/AddEditDolly', this.DollyRequestModel).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Dolly Added Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.DollyResponseModel = [];
          this.showhide("Cancel");
          this.getDolly();
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
    if (this.DollyForm.controls.dollyName.value == "" || this.DollyForm.controls.dollyName.value == null) {
      Swal.fire({
        text: "Enter Dolly Name",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.DollyForm.controls.dollyWeight.value == "" || this.DollyForm.controls.dollyWeight.value == null) {
      Swal.fire({
        text: "Enter Dolly Weight",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }

  editDolly(p) {
    this.showhide("Edit");
    this.DollyForm.patchValue(p);
  }

  getDolly() {
    this.API.getdata('/Setups/getDolly').subscribe(c => {
      if (c != null) {
        this.DollyResponseModel = c;
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
      this.DollyForm.controls.isActive.setValue(true);
    } else {
      this.DollyForm.controls.isActive.setValue(false);
    }
  }
}