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
import { catRequestModel,responseAircraftCategory } from './CraftModel';


@Component({
  selector: 'app-air-craft-cat',
  templateUrl: './air-craft-cat.component.html',
  styleUrls: ['./air-craft-cat.component.css']
})
export class AirCraftCatComponent implements OnInit {

  catRequestModel: catRequestModel;
  responseAircraftCategory: responseAircraftCategory[];
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
  CatForm: FormGroup;
  tableForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showData: boolean = true;
  addNewData: boolean = false;
  public date: Date = new Date();
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {
    this.catRequestModel = new catRequestModel();
    this.responseAircraftCategory = [];

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
    window.scroll(0,0);
    this.InitializeForm();
    this.getData();
    this.submitted = false;
  }

  InitializeForm(): any {
    this.CatForm = new FormGroup({
      catID: new FormControl(""),
      catName: new FormControl("", [Validators.required]),
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
      this.CatForm.reset();
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

  get f() { return this.CatForm.controls; }

  saveDolly() {
    this.validations();
    if (this.validForm == true) {
      this.catRequestModel = this.CatForm.value;
      this.API.PostData('/Flights/SaveCat', this.catRequestModel).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Aircraft category has been added Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.responseAircraftCategory = [];
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
    if (this.CatForm.controls.catName.value == "" || this.CatForm.controls.catName.value == null) {
      Swal.fire({
        text: "Enter category name",
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
    this.CatForm.patchValue(p);
  }

  getData() {
    this.API.getdata('/Flights/getAircraftCategory').subscribe(c => {
      if (c != null) {
        this.responseAircraftCategory = c;
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
      this.CatForm.controls.isActive.setValue(true);
    } else {
      this.CatForm.controls.isActive.setValue(false);
    }
  }
}
