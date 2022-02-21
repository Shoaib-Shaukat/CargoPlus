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
import { agencyRequestModel } from './AgencyModel';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit {
  agencyRequestModel: agencyRequestModel;
  agencyResponseModel: agencyRequestModel[];
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
  AgencyForm: FormGroup;
  tableForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showData: boolean = true;
  addNewData: boolean = false;
  public date: Date = new Date();
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {
    this.agencyRequestModel = new agencyRequestModel();
    this.agencyResponseModel = [];

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
  }

  InitializeForm(): any {
    this.AgencyForm = new FormGroup({
      agencyID: new FormControl(""),
      agencyName: new FormControl("", [Validators.required]),
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
      this.AgencyForm.reset();
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

  get f() { return this.AgencyForm.controls; }

  saveDolly() {
    this.validations();
    if (this.validForm == true) {
      this.agencyRequestModel = this.AgencyForm.value;
      this.API.PostData('/Setups/SaveAgency', this.agencyRequestModel).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Agency Added Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.agencyResponseModel = [];
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
    if (this.AgencyForm.controls.agencyName.value == "" || this.AgencyForm.controls.agencyName.value == null) {
      Swal.fire({
        text: "Enter Agency Name",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }

  editAgency(p) {
    this.showhide("Edit");
    this.AgencyForm.patchValue(p);
  }

  getData() {
    this.API.getdata('/Setups/getAgenciesList').subscribe(c => {
      if (c != null) {
        this.agencyResponseModel = c;
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
      this.AgencyForm.controls.isActive.setValue(true);
    } else {
      this.AgencyForm.controls.isActive.setValue(false);
    }
  }
}
