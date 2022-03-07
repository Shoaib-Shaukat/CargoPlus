import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../../../Services/API/api.service';
import { responseAirLines } from '../../AdminArea/Models/airLines';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { DatePipe } from '@angular/common'
import { aircraftCategoryResponse, aircraftTypesResponse, requestFlight, responseFlight } from './Model/flightsModel';
import { timeStamp } from 'console';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  dateRequired: boolean = false;
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
  FlightForm: FormGroup;
  tableForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showFlights: boolean = true;
  addnewFlight: boolean = false;
  public date: Date = new Date();
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {
    this.aircraftTypesResponse = [];
    this.defaultFlight = new responseFlight();
    this.defaultAirline = new responseAirLines();
    this.responseFlightTypes = [];
    this.responseFlight = [];
    this.requestFlight = new requestFlight();
    this.responseAirLines = [];
    this.aircraftCategoryResponse = [];
  }
  InitializeForm(): any {
    this.FlightForm = new FormGroup({
      flightID: new FormControl("", [Validators.required]),
      flightType: new FormControl("", [Validators.required]),
      ALCode: new FormControl("", [Validators.required]),
      regNo: new FormControl("", [Validators.required, Validators.minLength(6)]),
      depDate: new FormControl("", [Validators.required]),
      depTime: new FormControl("", [Validators.required]),
      Destination: new FormControl("", [Validators.required]),
      isDepartured: new FormControl("", [Validators.required]),
      flightInfo: new FormControl("", [Validators.required]),
      arrivalDate: new FormControl("", [Validators.required]),
      arrivalTime: new FormControl("", [Validators.required]),
      isArrived: new FormControl("", [Validators.required]),
      flightStatus: new FormControl("", [Validators.required]),
      arrivalFlightNo: new FormControl("", [Validators.required]),
      depFlightNo: new FormControl("", [Validators.required]),
      depDestination: new FormControl("", [Validators.required]),
      isNew: new FormControl("", [Validators.required]),
      aircraftTypeID: new FormControl("", [Validators.required]),
      aircraftCategoryName: new FormControl("", [Validators.required]),
    });
    this.tableForm = new FormGroup({
      ALCodeForTable: new FormControl(""),
    });
  }
  ngOnInit(): void {
    window.scroll(0,0);
    this.InitializeForm();
    this.getAirLines();
    this.getFlightTypes();
    this.getAircraftTypes();
    this.submitted = false;
  }

  validationForALCode() {
    if (this.tableForm.controls.ALCodeForTable.value == "" || this.tableForm.controls.ALCodeForTable.value == null) {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormForTable = false;
      return;
    }
    this.validFormForTable = true;
  }
  getFlights() {
    this.validationForALCode();
    if (this.validFormForTable == true) {
      this.API.getdata('/Flights/getALLFlights?ALCode=' + this.tableForm.controls.ALCodeForTable.value).subscribe(c => {
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
      this.addnewFlight = true;
      this.showFlights = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.FlightForm.reset();
      this.FlightForm.controls.isNew.setValue(true);
      this.FlightForm.controls.ALCode.setValue(0);
      let latest_date = this.datepipe.transform(this.date, 'HH:mm');
      this.FlightForm.controls.arrivalTime.setValue(latest_date);
      this.FlightForm.controls.depTime.setValue(latest_date);
      this.FlightForm.controls.depDate.setValue(this.formatDate(new Date()));
      this.FlightForm.controls.arrivalDate.setValue(this.formatDate(new Date()));
    }
    if (callfrm == "Cancel") {
      this.submitted = false;
      this.addnewFlight = false;
      this.showFlights = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.FlightForm.controls.isNew.setValue(false);
    }
    if (callfrm == "Edit") {
      this.addnewFlight = true;
      this.showFlights = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.FlightForm.controls.isNew.setValue(false);
    }
  }
  resetForm(value: any = undefined) {
    this.dateRequired = false;
    this.FlightForm.reset(value);
    let latest_date = this.datepipe.transform(this.date, 'HH:mm');
    this.FlightForm.controls.arrivalTime.setValue(latest_date);
    this.FlightForm.controls.depTime.setValue(latest_date);
    this.FlightForm.controls.depDate.setValue(this.formatDate(new Date()));
    this.FlightForm.controls.arrivalDate.setValue(this.formatDate(new Date()));
    this.submitted = false;
    this.FlightForm.controls.ALCode.setValue(0);
  }
  get f() { return this.FlightForm.controls; }
  saveFlights() {
    // this.submitted = true;
    // if (this.FlightForm.invalid) {
    //   return;
    // }
    this.validations();
    if (this.validForm == true) {
      this.requestFlight.ALCode = this.FlightForm.controls.ALCode.value;
      this.requestFlight.flightID = this.FlightForm.controls.flightID.value;
      this.requestFlight.regNo = this.FlightForm.controls.regNo.value;
      this.requestFlight.depDate = this.FlightForm.controls.depDate.value;
      this.requestFlight.depTime = this.FlightForm.controls.depTime.value;
      this.requestFlight.Destination = this.FlightForm.controls.Destination.value;
      if (this.FlightForm.controls.isDepartured.value != null) {
        this.requestFlight.isDepartured = this.FlightForm.controls.isDepartured.value;
      }
      else {
        this.requestFlight.isDepartured = false;
      }
      this.requestFlight.flightInfo = this.FlightForm.controls.flightInfo.value;
      this.requestFlight.arrivalDate = this.FlightForm.controls.arrivalDate.value;
      this.requestFlight.arrivalTime = this.FlightForm.controls.arrivalTime.value;
      if (this.FlightForm.controls.isArrived.value != null) {
        this.requestFlight.isArrived = this.FlightForm.controls.isArrived.value;
      }
      else {
        this.requestFlight.isArrived = false;
      }
      this.requestFlight.flightStatus = this.FlightForm.controls.flightStatus.value;
      this.requestFlight.arrivalFlightNo = this.FlightForm.controls.arrivalFlightNo.value;
      this.requestFlight.flightStatus = this.FlightForm.controls.flightStatus.value;
      this.requestFlight.depFlightNo = this.FlightForm.controls.depFlightNo.value;
      this.requestFlight.depDestination = this.FlightForm.controls.depDestination.value;
      this.requestFlight.isNew = this.FlightForm.controls.isNew.value;
      this.requestFlight.flightType = this.FlightForm.controls.flightType.value;
      this.requestFlight.aircraftTypeID = this.FlightForm.controls.aircraftTypeID.value;
      this.API.PostData('/Flights/saveArrivalFlights', this.requestFlight).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Flight added successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.responseFlight = [];
          this.showhide("Cancel");
          this.getAirLines();
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
    if (this.FlightForm.controls.ALCode.value == "" || this.FlightForm.controls.ALCode.value == null) {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.FlightForm.controls.flightType.value == "" || this.FlightForm.controls.flightType.value == null) {
      Swal.fire({
        text: "Select Flight Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.FlightForm.controls.aircraftTypeID.value == "" || this.FlightForm.controls.aircraftTypeID.value == null) {
      Swal.fire({
        text: "Select Aircraft Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.FlightForm.controls.regNo.value == "" || this.FlightForm.controls.regNo.value == null) {
      Swal.fire({
        text: "Enter Aircraft Reg No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.dateRequired == true) {
      if (this.FlightForm.controls.arrivalDate.value == "" || this.FlightForm.controls.arrivalDate.value == null) {
        Swal.fire({
          text: "Select Arrival Date",
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.validForm = false;
        return;
      }
      if (this.FlightForm.controls.arrivalTime.value == "" || this.FlightForm.controls.arrivalTime.value == null) {
        Swal.fire({
          text: "Select Arrival Time",
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.validForm = false;
        return;
      }
    }

    if (this.FlightForm.controls.Destination.value == "" || this.FlightForm.controls.Destination.value == null) {
      Swal.fire({
        text: "Enter Arrival Destination",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.FlightForm.controls.depDate.value == "" || this.FlightForm.controls.depDate.value == null) {
      Swal.fire({
        text: "Select Departure Date",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.FlightForm.controls.depTime.value == "" || this.FlightForm.controls.depTime.value == null) {
      Swal.fire({
        text: "Select Departure Time",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.FlightForm.controls.depDestination.value == "" || this.FlightForm.controls.depDestination.value == null) {
      Swal.fire({
        text: "Enter Departure Destination",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.FlightForm.controls.arrivalFlightNo.value == "" || this.FlightForm.controls.arrivalFlightNo.value == null) {
      Swal.fire({
        text: "Enter Arrival Flight No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.FlightForm.controls.depFlightNo.value == "" || this.FlightForm.controls.depFlightNo.value == null) {
      Swal.fire({
        text: "Enter Departure Flight No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editAirLines(p) {
    this.showhide("Edit");
    this.FlightForm.patchValue(p);
    this.FlightForm.controls.arrivalDate.setValue(p.arrivalDate.substring(0, p.arrivalDate.length - 9));
    this.FlightForm.controls.depDate.setValue(p.depDate.substring(0, p.depDate.length - 9));
    this.getAircraftTypes();
    this.FlightForm.controls.aircraftTypeID.setValue(p.aircraftTypeID);
  }
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
        this.defaultAirline.ALCode = 0;
        this.defaultAirline.ALName = "Select Airline";
        this.responseAirLines.push(this.defaultAirline);
        this.FlightForm.controls.ALCode.setValue(0);
        this.tableForm.controls.ALCodeForTable.setValue(0);
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
  public rowEditEnter(evt) {
    var p = evt.newValue
    this.editAirLines(p);
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
  public rowEditDone(evt) {
    var p = evt.newValue
    this.FlightForm.setValue({
      flightID: p.flightID,
      flightNo: p.flightNo,
      ALCode: p.ALCode,
      regNo: p.regNo,
      arrivalDate: p.arrivalDate,
      arrivalTime: p.arrivalTime,
      Destination: p.Destination,
      isArrived: p.isArrived,
    })
    this.saveFlights();
  }
  public rowEditExit() {
  }

  getFlightTypes() {
    this.API.getdata('/Flights/getFlightType').subscribe(c => {
      if (c != null) {
        this.responseFlightTypes = c;
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
  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  resetALL() {
    var index = this.responseAirLines.find((x) => x.ALCode == this.FlightForm.controls.ALCode.value);
    if (index.hub == "KHI" || index.hub == "LHR") {
      this.dateRequired = false;
      this.FlightForm.controls.arrivalDate.reset();
      this.FlightForm.controls.arrivalTime.reset();
    }
    else {
      this.dateRequired = true;
    }
    this.submitted = false;
    let latest_date = this.datepipe.transform(this.date, 'HH:mm');
    this.FlightForm.controls.flightType.reset();
    this.FlightForm.controls.regNo.reset();
    this.FlightForm.controls.depDate.setValue(this.formatDate(new Date()));
    this.FlightForm.controls.depTime.setValue(latest_date);
    this.FlightForm.controls.Destination.reset();
    this.FlightForm.controls.isDepartured.reset();
    this.FlightForm.controls.flightInfo.reset();
    this.FlightForm.controls.isArrived.reset();
    this.FlightForm.controls.flightStatus.reset();
    this.FlightForm.controls.arrivalFlightNo.reset();
    this.FlightForm.controls.depFlightNo.reset();
    this.FlightForm.controls.depDestination.reset();
    this.FlightForm.controls.isNew.setValue(true);
    this.FlightForm.controls.aircraftTypeID.reset();
    this.requestFlight = this.FlightForm.value;
  }
  selectCategory() {
    var categortDetail = this.aircraftTypesResponse.find(x => x.aircraftTypeID == this.FlightForm.controls.aircraftTypeID.value);
    if (categortDetail != undefined) {
      this.FlightForm.controls.aircraftCategoryName.setValue(categortDetail.aircraftCategoryName);
    }
  }
}
