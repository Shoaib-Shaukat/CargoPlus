import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../../../Services/API/api.service';
import { responseAirLines } from '../../AdminArea/Models/airLines';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { DatePipe } from '@angular/common'
import { aircraftCategoryResponse, aircraftTypesResponse, requestFlight, responseFlight } from '../../Export/Flights/Model/flightsModel';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { requestAircraftType } from './aircrafttype-Model';
@Component({
  selector: 'app-aircraft-types',
  templateUrl: './aircraft-types.component.html',
  styleUrls: ['./aircraft-types.component.css']
})
export class AircraftTypesComponent implements OnInit {
  requestAircraftType: requestAircraftType;
  submitted: boolean = false;
  aircraftTypesResponse: aircraftTypesResponse[];
  // aircraftCategoryResponse: aircraftCategoryResponse[];
  // defaultFlight: responseFlight;
  // defaultAirline: responseAirLines;
  public selectionMode = 'single';
  public $rowEditEnter = false;
  public $cellEditEnter = false;
  public $cellEdit = false;
  public $rowEdit = false;
  public data;
  // public departureDate: Date = new Date();
  // responseFlightTypes: responseFlight[];
  // responseAirLines: responseAirLines[];
  // responseFlight: responseFlight[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  // dataTable: any;
  // dateForDeparture: any;
  validForm: boolean = false;
  //validFormForTable: boolean = false;
  //requestFlight: requestFlight;
  AircraftTypeForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showAircraftTypes: boolean = true;
  addnewAircraftType: boolean = false;
  //public date: Date = new Date();
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {
    this.requestAircraftType = new requestAircraftType();
    this.aircraftTypesResponse = [];
    // this.defaultFlight = new responseFlight();
    // this.defaultAirline = new responseAirLines();
    // this.responseFlightTypes = [];
    // this.responseFlight = [];
    // this.requestFlight = new requestFlight();
    // this.responseAirLines = [];
    // this.aircraftCategoryResponse = [];
  }
  InitializeForm(): any {
    this.AircraftTypeForm = new FormGroup({
      aircraftCategoryName: new FormControl("", [Validators.required]),
      aircraftTypeID: new FormControl("", [Validators.required]),
      aircraftTypeName: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit(): void {
    window.scroll(0,0);
    this.InitializeForm();
    this.getAircraftTypes();
    this.submitted = false;
  }


  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addnewAircraftType = true;
      this.showAircraftTypes = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.AircraftTypeForm.reset();
    }
    if (callfrm == "Cancel") {
      this.submitted = false;
      this.addnewAircraftType = false;
      this.showAircraftTypes = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
    }
    if (callfrm == "Edit") {
      this.addnewAircraftType = true;
      this.showAircraftTypes = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
    }
  }
  resetForm(value: any = undefined) {
    this.AircraftTypeForm.reset(value);
    this.submitted = false;
  }
  get f() { return this.AircraftTypeForm.controls; }

  saveAircraftType() {
    this.AircraftTypeForm.markAllAsTouched();
    this.validations();
    if (this.validForm == true) {
      this.requestAircraftType = this.AircraftTypeForm.value;
      this.API.PostData('/Flights/AddaircraftType', this.requestAircraftType).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Added Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          //this.responseFlight = [];
          this.showhide("Cancel");
          this.getAircraftTypes();
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
    if (this.AircraftTypeForm.controls.aircraftTypeName.value == "" || this.AircraftTypeForm.controls.aircraftTypeName.value == null) {
      Swal.fire({
        text: "Enter Aircraft Type Name",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.AircraftTypeForm.controls.aircraftCategoryName.value == "" || this.AircraftTypeForm.controls.aircraftCategoryName.value == null) {
      Swal.fire({
        text: "Enter Aircraft Category Name",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editAircraftType(p) {
    this.showhide("Edit");
    this.AircraftTypeForm.patchValue(p);
    this.getAircraftTypes();
    this.AircraftTypeForm.controls.aircraftTypeID.setValue(p.aircraftTypeID);
  }

  public rowEditEnter(evt) {
    var p = evt.newValue
    this.editAircraftType(p);
  }
  public cellEditEnter(evt) {
    var p = evt.newValue
    evt.cancel = this.$cellEditEnter;
  }
  public cellEdit(evt) {
    evt.cancel = this.$cellEdit;
  }
  public cellEditDone() {
  }
  public cellEditExit() {
  }
  public rowEdit(evt) {
    evt.cancel = this.$rowEdit;
  }
  // public rowEditDone(evt) {
  //   var p = evt.newValue
  //   this.FlightForm.setValue({
  //     flightID: p.flightID,
  //     flightNo: p.flightNo,
  //     ALCode: p.ALCode,
  //     regNo: p.regNo,
  //     arrivalDate: p.arrivalDate,
  //     arrivalTime: p.arrivalTime,
  //     Destination: p.Destination,
  //     isArrived: p.isArrived,
  //   })
  //   this.saveFlights();
  // }
  public rowEditExit() {
  }

  getAircraftTypes() {
    this.API.getdata('/Flights/getAircraftType').subscribe(c => {
      if (c != null) {
        this.aircraftTypesResponse = c;
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
  // private formatDate(date) {
  //   const d = new Date(date);
  //   let month = '' + (d.getMonth() + 1);
  //   let day = '' + d.getDate();
  //   const year = d.getFullYear();
  //   if (month.length < 2) month = '0' + month;
  //   if (day.length < 2) day = '0' + day;
  //   return [year, month, day].join('-');
  // }

}

