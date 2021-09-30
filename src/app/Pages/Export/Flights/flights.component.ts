import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../../../Services/API/api.service';
import { responseAirLines } from '../../AdminArea/Models/airLines';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { ThemeService } from 'ng2-charts';
import { DatePipe } from '@angular/common'
import { aircraftCategoryResponse, aircraftTypesResponse, requestFlight, responseFlight } from './Model/flightsModel';
import { timeStamp } from 'console';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
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
      flightID: new FormControl(""),
      flightType: new FormControl(""),
      ALCode: new FormControl(""),
      regNo: new FormControl(""),
      depDate: new FormControl(""),
      depTime: new FormControl(""),
      Destination: new FormControl(""),
      isDepartured: new FormControl(""),
      flightInfo: new FormControl(""),
      arrivalDate: new FormControl(""),
      arrivalTime: new FormControl(""),
      isArrived: new FormControl(""),
      flightStatus: new FormControl(""),
      arrivalFlightNo: new FormControl(""),
      depFlightNo: new FormControl(""),
      depDestination: new FormControl(""),
      isNew: new FormControl(""),
      aircraftTypeID: new FormControl(""),
      aircraftCategoryName: new FormControl(""),
    });
    this.tableForm = new FormGroup({
      ALCodeForTable: new FormControl(""),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.getAirLines();
    this.getFlightTypes();
    this.getAircraftTypes();
    let latest_date = this.datepipe.transform(this.date, 'HH:mm');
    this.FlightForm.controls.arrivalTime.setValue(latest_date);
    this.FlightForm.controls.depTime.setValue(latest_date);
    this.FlightForm.controls.depDate.setValue(this.formatDate(new Date()));
    this.FlightForm.controls.arrivalDate.setValue(this.formatDate(new Date()));
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
            text: error,
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
      this.getAirLines();
      this.FlightForm.controls.isNew.setValue(true);
      let latest_date = this.datepipe.transform(this.date, 'HH:mm');
      this.FlightForm.controls.arrivalTime.setValue(latest_date);
      this.FlightForm.controls.depTime.setValue(latest_date);
      this.FlightForm.controls.depDate.setValue(this.formatDate(new Date()));
      this.FlightForm.controls.arrivalDate.setValue(this.formatDate(new Date()));
    }
    if (callfrm == "Cancel") {
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
    this.FlightForm.reset(value);
    let latest_date = this.datepipe.transform(this.date, 'HH:mm');
    this.FlightForm.controls.arrivalTime.setValue(latest_date);
    this.FlightForm.controls.depTime.setValue(latest_date);
    this.FlightForm.controls.depDate.setValue(this.formatDate(new Date()));
    this.FlightForm.controls.arrivalDate.setValue(this.formatDate(new Date()));
  }
  saveFlights() {
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
          this.getAirLines();
          this.showhide("Cancel");

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
  editAirLines(p, i) {
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
    this.editAirLines(p, 1);
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
          text: error,
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
          text: error,
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
    let latest_date = this.datepipe.transform(this.date, 'HH:mm');
    this.FlightForm.controls.flightType.reset();
    this.FlightForm.controls.regNo.reset();
    this.FlightForm.controls.depDate.setValue(this.formatDate(new Date()));
    this.FlightForm.controls.depTime.setValue(latest_date);
    this.FlightForm.controls.Destination.reset();
    this.FlightForm.controls.isDepartured.reset();
    this.FlightForm.controls.flightInfo.reset();
    this.FlightForm.controls.arrivalDate.setValue(this.formatDate(new Date()));
    this.FlightForm.controls.arrivalTime.setValue(latest_date);
    this.FlightForm.controls.isArrived.reset();
    this.FlightForm.controls.flightStatus.reset();
    this.FlightForm.controls.arrivalFlightNo.reset();
    this.FlightForm.controls.depFlightNo.reset();
    this.FlightForm.controls.depDestination.reset();
    this.FlightForm.controls.isNew.setValue(true);
    this.FlightForm.controls.aircraftTypeID.reset();
    this.requestFlight = this.FlightForm.value;
  }
  selectCategory(){
    var categortDetail = this.aircraftTypesResponse.find(x => x.aircraftTypeID == this.FlightForm.controls.aircraftTypeID.value);
    if (categortDetail != undefined) {
      this.FlightForm.controls.aircraftCategoryName.setValue(categortDetail.aircraftCategoryName);
    }
  }
}
