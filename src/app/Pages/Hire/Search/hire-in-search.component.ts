import { Component, OnInit } from '@angular/core';
import { agencyRequestModel } from '../../../Pages/AdminArea/Agency/AgencyModel'
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ApiService } from "src/app/Services/API/api.service";
import { GvarService } from "src/app/Services/Globel/gvar.service";
import { FormGroup, FormControl } from "@angular/forms";
import { responseAircraftCategory } from '../../AdminArea/AirCraftCat/CraftModel';
import { responseAirLines } from "../../AdminArea/Models/airLines";
import { stationResponse } from "../Hirein/hireModel";
import { requestSearch, searchResponse } from './searchModel'
import { Router } from '@angular/router';
import { timeStamp } from 'console';

@Component({
  selector: 'app-hire-in-search',
  templateUrl: './hire-in-search.component.html',
  styleUrls: ['./hire-in-search.component.css']
})
export class HireInSearchComponent implements OnInit {
  searchResponse: searchResponse[];
  requestSearch: requestSearch;
  validForm: boolean = false;
  stationResponse: stationResponse[];
  defaultStation: stationResponse;
  defaultAirline: responseAirLines;
  responseAirLines: responseAirLines[];
  defaultCat: responseAircraftCategory;
  responseAircraftCategory: responseAircraftCategory[];
  HireInSearchForm: FormGroup;
  defaultAgency: agencyRequestModel;
  agencyResponseModel: agencyRequestModel[];

  constructor(public router: Router, public API: ApiService, public GV: GvarService) {
    this.searchResponse = [];
    this.requestSearch = new requestSearch();
    this.InitializeForm();
    this.agencyResponseModel = [];
    this.defaultAgency = new agencyRequestModel();
    this.responseAircraftCategory = [];
    this.defaultCat = new responseAircraftCategory();
    this.responseAirLines = [];
    this.defaultAirline = new responseAirLines();
    this.stationResponse = [];
    this.defaultStation = new stationResponse();
  }

  ngOnInit(): void {
    window.scroll(0,0);
    this.getagency();
    this.getAirLines();
    this.getStations();
    this.getCatData();
    if (this.GV.requestSearch != undefined) {
      this.HireInSearchForm.patchValue(this.GV.requestSearch)
      this.searchHireIn();
    }
  }
  InitializeForm(): any {
    this.HireInSearchForm = new FormGroup({
      ALCode: new FormControl(""),
      ALName: new FormControl(""),
      airportID: new FormControl(""),
      StationName: new FormControl(""),
      agencyID: new FormControl(""),
      agencyName: new FormControl(""),
      fromDate: new FormControl(""),
      ToDate: new FormControl(""),
      catID: new FormControl(""),
      catName: new FormControl(""),
      Remarks: new FormControl(""),
      hireinDate: new FormControl(""),
      flightNo: new FormControl(""),
      hireinId: new FormControl(""),
    });
  }
  getagency() {
    this.API.getdata('/Setups/getAgenciesList').subscribe(c => {
      if (c != null) {
        this.agencyResponseModel = c;
        this.defaultAgency.agencyID = 0;
        this.defaultAgency.agencyName = "ALL";
        this.agencyResponseModel.push(this.defaultAgency);
        this.HireInSearchForm.controls.agencyID.setValue(0);
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
  resetHireIn() {
    this.HireInSearchForm.reset();
    this.HireInSearchForm.controls.agencyID.setValue(0);
  }
  getAirLines() {
    this.API.getdata("/Setups/getAirLines").subscribe(
      (c) => {
        if (c != null) {
          this.responseAirLines = c;
          this.defaultAirline.ALCode = 0;
          this.defaultAirline.ALName = "ALL";
          this.responseAirLines.push(this.defaultAirline);
          this.HireInSearchForm.controls.ALCode.setValue(0);
        }
      },
      (error) => {
        Swal.fire({
          text: error.error.Message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }
  getStations() {
    this.API.getdata("/Generic/getStations").subscribe(
      (c) => {
        if (c != null) {
          this.stationResponse = c;
          this.defaultStation.airportID = 0;
          this.defaultStation.StationName = "ALL";
          this.stationResponse.push(this.defaultStation);
          this.HireInSearchForm.controls.airportID.setValue(0);
        }
      },
      (error) => {
        Swal.fire({
          text: error.error.Message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }
  validations() {
    if (this.HireInSearchForm.controls.fromDate.value == "" || this.HireInSearchForm.controls.fromDate.value == undefined || this.HireInSearchForm.controls.fromDate.value == null) {
      Swal.fire({
        text: "Select From Date.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireInSearchForm.controls.ToDate.value == "" || this.HireInSearchForm.controls.ToDate.value == undefined || this.HireInSearchForm.controls.ToDate.value == null) {
      Swal.fire({
        text: "Select To Date.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  searchHireIn() {
    this.validations();
    if (this.validForm == true) {
      this.requestSearch.agencyID = this.HireInSearchForm.controls.agencyID.value;
      this.requestSearch.ALCode = this.HireInSearchForm.controls.ALCode.value;
      this.requestSearch.airportID = this.HireInSearchForm.controls.airportID.value;
      this.requestSearch.catID = this.HireInSearchForm.controls.catID.value;
      this.requestSearch.fromDate = this.HireInSearchForm.controls.fromDate.value;
      this.requestSearch.ToDate = this.HireInSearchForm.controls.ToDate.value;
      this.GV.requestSearch = this.requestSearch;
      // this.GV.requestSearch.
      this.API.PostData('/Hire/searchHireIn', this.requestSearch).subscribe(c => {
        if (c != null) {
          this.searchResponse = c;
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
  getCatData() {
    this.API.getdata('/Flights/getAircraftCategory').subscribe(c => {
      if (c != null) {
        this.responseAircraftCategory = c;
        this.defaultCat.catID = 0;
        this.defaultCat.catName = "ALL";
        this.responseAircraftCategory.push(this.defaultCat);
        this.HireInSearchForm.controls.catID.setValue(0);
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
  viewHireIn(id) {
    this.router.navigate(['Hire/HireInDetail', id]);
  }
}
