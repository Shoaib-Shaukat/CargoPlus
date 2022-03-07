import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ApiService } from "src/app/Services/API/api.service";
import { GvarService } from "src/app/Services/Globel/gvar.service";
import { responseAirLines } from "../../AdminArea/Models/airLines";
import { agencyRequestModel } from "../../../Pages/AdminArea/Agency/AgencyModel";
import { DatePipe } from "@angular/common";
import { responseAircraftCategory } from '../../AdminArea/AirCraftCat/CraftModel';
import { thisMonth } from "@igniteui/material-icons-extended";
import { stringify } from "querystring";
import { requestSearch, searchResponse } from '../Search/searchModel'
import { v4 as uuid } from 'uuid';
import { flatten } from "@angular/compiler";
import { gseCateRequestModel, hireoutModel, hireinViewModel, removeDetailModel, stationResponse, UOMTypeResponse, gseCateMasterModel, gseMasterResponse } from "./HireOutModel";

@Component({
  selector: 'app-hire-out',
  templateUrl: './hire-out.component.html',
  styleUrls: ['./hire-out.component.css']
})
export class HireOutComponent implements OnInit {
  duplicateRecord:boolean=false;
  gseMasterResponse: gseMasterResponse;
  gseCateMasterModel: gseCateMasterModel;
  isNew: boolean = true;
  defaultUOMResponse: UOMTypeResponse;
  UOMTypeResponse: UOMTypeResponse[];
  hireindetailID: any;
  removeDetailModel: removeDetailModel;
  addMode: boolean = true;
  enableStaton: boolean = false;
  id: number;
  private sub: any;
  hireinViewModel: hireinViewModel;
  hireoutModel: hireoutModel[];
  hireoutModelSingle:hireoutModel;
  validForm: boolean = false;
  hireoutDetailNew: hireoutModel;
  labelText: string;
  gseCateResponseModel: gseCateRequestModel[];
  defaultGSECat: gseCateRequestModel;
  @ViewChildren("popupModal") popupModal: ElementRef;
  defaultCat: responseAircraftCategory;
  responseAircraftCategory: responseAircraftCategory[];
  agencyResponseModel: agencyRequestModel[];
  defaultAgency: agencyRequestModel;
  stationResponse: stationResponse[];
  defaultAirline: responseAirLines;
  defaultStation: stationResponse;
  responseAirLines: responseAirLines[];
  HireOutForm: FormGroup;

  searchResponse: searchResponse[];
  requestSearch: requestSearch;
  constructor(public API: ApiService,
    public GV: GvarService,
    private route: ActivatedRoute,
    public datepipe: DatePipe) {
      this.InitializeForm();
    this.gseCateResponseModel = [];
    this.hireoutModelSingle=new hireoutModel();
    this.defaultGSECat = new gseCateRequestModel();
    this.stationResponse = [];
    this.InitializeForm();
    this.responseAirLines = [];
    this.agencyResponseModel = [];
    this.defaultAirline = new responseAirLines();
    this.defaultAgency = new agencyRequestModel();
    this.defaultStation = new stationResponse();
    this.responseAircraftCategory = [];
    this.defaultCat = new responseAircraftCategory();
    this.hireoutModel = [];
    this.hireoutDetailNew = new hireoutModel();
    this.hireinViewModel = new hireinViewModel();
    this.removeDetailModel = new removeDetailModel();
    this.UOMTypeResponse = [];
    this.defaultUOMResponse = new UOMTypeResponse();
    this.gseCateMasterModel = new gseCateMasterModel();
    this.gseMasterResponse = new gseMasterResponse();
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.getUOMTypes();
    this.getagency();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      if (this.id != null && this.id > 0) {
        this.HireOutForm.controls.hireoutID.setValue(this.id);
        this.getHireoutData();
        this.isNew=false;
      }
    });
  }

  InitializeForm(): any {
    this.HireOutForm = new FormGroup({
      hireoutID: new FormControl(""),
      rasID: new FormControl(""),
      flightNo: new FormControl(""),
      Remarks: new FormControl(""),
      agencyID: new FormControl(""),
      qty: new FormControl(""),
      UOMTypeID: new FormControl(""),
      Units: new FormControl(""),
      Total: new FormControl(""),
      airportID: new FormControl(""),
      gseMasterID: new FormControl(""),
      fromDatetime: new FormControl(""),
      toDateTime: new FormControl(""),
      UOMType: new FormControl(""),
      agencyName: new FormControl(""),
      gseCategory: new FormControl(""),
      StationName: new FormControl(""),
      isNewRow: new FormControl(""),
      description: new FormControl(""),
    });
  }
  getAirLines() {
    this.API.getdata("/Setups/getAirLines").subscribe(
      (c) => {
        if (c != null) {
          this.responseAirLines = c;
          this.defaultAirline.ALCode = 0;
          this.defaultAirline.ALName = "Select Airline";
          this.responseAirLines.push(this.defaultAirline);
          this.HireOutForm.controls.ALCode.setValue(0);
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
          this.defaultStation.StationName = "Select Station";
          this.stationResponse.push(this.defaultStation);
          this.HireOutForm.controls.airportID.setValue(0);
          var station = localStorage.getItem("StationName");
          if (station != null) {
            var Userstation = this.stationResponse.find(c => c.StationName == station);
            this.HireOutForm.controls.airportID.setValue(Userstation.airportID);
            this.enableStaton = true;
          }
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
  getagency() {
    this.API.getdata('/Setups/getAgenciesList').subscribe(c => {
      if (c != null) {
        this.agencyResponseModel = c;
        this.defaultAgency.agencyID = 0;
        this.defaultAgency.agencyName = "Select Agency";
        this.agencyResponseModel.push(this.defaultAgency);
        this.HireOutForm.controls.agencyID.setValue(0);

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
  getCatData() {
    this.API.getdata('/Flights/getAircraftCategory').subscribe(c => {
      if (c != null) {
        this.responseAircraftCategory = c;
        this.defaultCat.catID = 0;
        this.defaultCat.catName = "Select Category";
        this.responseAircraftCategory.push(this.defaultCat);
        this.HireOutForm.controls.catID.setValue(0);
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

  pushInArr() {
    this.hireinDetailValidations();
    if (this.validForm && this.duplicateRecord==false) {
      this.hireoutDetailNew = this.HireOutForm.value;
      if (this.isNew) {
        this.hireoutDetailNew.hireoutID = null;
      }
      if (this.HireOutForm.controls.UOMTypeID.value != null) {
        var uomTypes = this.UOMTypeResponse.find(c => c.UOMTypeID == this.HireOutForm.controls.UOMTypeID.value)
        this.hireoutDetailNew.UOMType = uomTypes.UOMType;
      }
      if (this.gseMasterResponse != null) {
        this.hireoutDetailNew.gseCategory = this.gseMasterResponse.gseCategory;
      }
      var agency = this.agencyResponseModel.find(c => c.agencyID == this.HireOutForm.controls.agencyID.value)
      if (agency != null) {
        this.hireoutDetailNew.agencyName = agency.agencyName;
      }
      if (+(this.HireOutForm.controls.qty.value) > 0) {
        this.hireoutDetailNew.qty = +(this.HireOutForm.controls.qty.value);
      }
      else {
        this.hireoutDetailNew.qty = 0;
      }
      var gseCat = this.gseCateResponseModel.find(c => c.gsecatID == this.HireOutForm.controls.gsecatID.value);
      if (gseCat != null) {
        this.hireoutDetailNew.gseCategory = gseCat.gseCategory;
      }
      var station = this.stationResponse.find(c => c.airportID == this.HireOutForm.controls.airportID.value);
      if (station != null) {
        this.hireoutDetailNew.StationName = station.StationName;
      }
      if (this.hireoutDetailNew.hireoutID == "" || this.hireoutDetailNew.hireoutID == undefined || this.hireoutDetailNew.hireoutID == null) {
        this.hireoutDetailNew.hireoutID = uuid();
      }
      this.hireoutDetailNew.isNewRow = true;
      if (this.isNew == false) {
        var index = this.hireoutModel.findIndex(c => c.hireoutID == this.hireoutDetailNew.hireoutID);
        if (index != null) {
          this.hireoutModel[index] = this.hireoutDetailNew;
          // Swal.fire({
          //   text: 'Data updated in draft, do you want to save it?',
          //   icon: 'warning',
          //   showCancelButton: true,
          //   confirmButtonColor: '#3085d6',
          //   cancelButtonColor: '#d33',
          //   confirmButtonText: 'Save',
      
          // }).then((result) => {
          //   if (result.isConfirmed) {
          //     this.saveHireOut();
          //   }
          // })
          Swal.fire({
            text: "Record Updated in Draft.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      }
      else {
        this.hireoutModel.push(this.hireoutDetailNew);
        // Swal.fire({
        //   text: 'Data added in draft, do you want to save it?',
        //   icon: 'warning',
        //   showCancelButton: true,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#d33',
        //   confirmButtonText: 'Save',
    
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     this.saveHireOut();
        //   }
        // })
        Swal.fire({
          text: "Record added in Draft.",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.hireoutDetailNew = new hireoutModel();
      }

    }
  }

  getTime() {
    var dateOne = new Date(this.HireOutForm.controls.fromDatetime.value).getTime();
    var dateTwo = new Date(this.HireOutForm.controls.toDateTime.value).getTime();
    var Time = dateTwo - dateOne;
    var Days = Time / (1000 * 3600 * 24);
    var time = (Time / 3.6e+6);
    if (this.HireOutForm.controls.UOMTypeID.value == 2) {
      var Roundup = Math.ceil(time);
      this.HireOutForm.controls.Units.setValue(Roundup)
    }
  }
  uomChanged() {
    var text = this.UOMTypeResponse.find(c => c.UOMTypeID == this.HireOutForm.controls.UOMTypeID.value);
    if (text != null) {
      this.labelText = text.UOMType;
    }
  }
  hireinDetailValidations() {
    if (this.HireOutForm.controls.rasID.value == "" || this.HireOutForm.controls.rasID.value == undefined || this.HireOutForm.controls.rasID.value == null || this.HireOutForm.controls.airportID.value == "0") {
      Swal.fire({
        text: "Enter RAS No.!",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireOutForm.controls.gseCategory.value == "" || this.HireOutForm.controls.gseCategory.value == undefined || this.HireOutForm.controls.gseCategory.value == null || this.HireOutForm.controls.gseCategory.value == "0") {
      Swal.fire({
        text: "GSE Master not found against RAS ID",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireOutForm.controls.agencyID.value == "" || this.HireOutForm.controls.agencyID.value == undefined || this.HireOutForm.controls.agencyID.value == null || this.HireOutForm.controls.agencyID.value == "0") {
      Swal.fire({
        text: "Select Agency.", 
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireOutForm.controls.fromDatetime.value == "" || this.HireOutForm.controls.fromDatetime.value == undefined || this.HireOutForm.controls.fromDatetime.value == null) {
      Swal.fire({
        text: "Enter From Date.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireOutForm.controls.toDateTime.value == "" || this.HireOutForm.controls.toDateTime.value == undefined || this.HireOutForm.controls.toDateTime.value == null) {
      Swal.fire({
        text: "Enter To Date.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireOutForm.controls.qty.value == "" || this.HireOutForm.controls.qty.value == undefined || this.HireOutForm.controls.qty.value == null) {
      Swal.fire({
        text: "Ente Quantity",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireOutForm.controls.Total.value == "" || this.HireOutForm.controls.Total.value == undefined || this.HireOutForm.controls.Total.value == null) {
      Swal.fire({
        text: "Enter Total",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }

    if (this.hireoutModel.length > 0) {
      var checkDup = this.hireoutModel.find(c => c.rasID == this.HireOutForm.controls.rasID.value &&
        c.Total == this.HireOutForm.controls.Total.value &&
        c.flightNo == this.HireOutForm.controls.flightNo.value &&
        c.gseCategory == this.HireOutForm.controls.gseCategory.value &&
        c.agencyID == this.HireOutForm.controls.agencyID.value &&
        c.fromDatetime == this.HireOutForm.controls.fromDatetime.value &&
        c.toDateTime == this.HireOutForm.controls.toDateTime.value &&
        c.Units == this.HireOutForm.controls.Units.value &&
        c.qty == this.HireOutForm.controls.qty.value &&
        c.Total == this.HireOutForm.controls.Total.value &&
        c.UOMTypeID == this.HireOutForm.controls.UOMTypeID.value &&
        c.airportID == this.HireOutForm.controls.airportID.value);
      if (this.isNew == false && checkDup != null) {
        if (checkDup.hireoutID != this.HireOutForm.controls.hireoutID.value) {
          if (checkDup != null) {
            Swal.fire({
              text: "Record Already Added.",
              icon: "error",
              confirmButtonText: "OK",
            });
            this.duplicateRecord = true;
            return;
          }
        }
      }
      else {
        if (checkDup != null) {
          Swal.fire({
            text: "Record Already Added.",
            icon: "error",
            confirmButtonText: "OK",
          });
          this.duplicateRecord = true;
          return;
        }
      }

    }
    this.validForm = true;
  }
  closeHirInModal() {
    this.HireOutForm.reset();
    this.HireOutForm.controls.gsecatID.setValue(0);
    this.HireOutForm.controls.UOMType.setValue("Per Hrs");
    this.labelText = "No. of Hours";
  }

  // validations() {

  //   if (this.hireoutModel.length == 0) {
  //     Swal.fire({
  //       text: "Enter atleast 1 Hire-In Detail",
  //       icon: 'error',
  //       confirmButtonText: 'OK'
  //     });
  //     this.validForm = false;
  //     return;
  //   }
  //   this.validForm = true;
  // }

  saveHireOut() {
    //  this.hireinDetailValidations();
    if (this.validForm == true) {
      this.API.PostData('/Hire/SaveHireout', this.hireoutModel).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Hire-out Saved Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
        this.resetHireOut();
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

  resetHireOut() {
    this.HireOutForm.reset();
    this.HireOutForm.reset();
    // this.hireoutModel = new hireoutModel();
    this.hireoutModel = [];
    this.HireOutForm.controls.agencyID.setValue(0);;
    this.removeDetailModel = new removeDetailModel();
    this.isNew = true;
  }
  getHireoutData() {
    this.API.getdata("/Hire/getHireoutSingle?hireoutID=" + this.HireOutForm.controls.hireoutID.value).subscribe(c => {
      if (c != null) {
        this.hireoutModelSingle = c;
        this.HireOutForm.patchValue(this.hireoutModelSingle);
        this.uomChanged();
        this.edithireout(this.hireoutModelSingle.hireoutID);
        this.hireoutModel.push(this.hireoutModelSingle);
        var Desc = this.gseMasterResponse.gseCategory + ", MRAS No: " + this.gseMasterResponse.rasID;
          this.HireOutForm.controls.description.setValue(Desc);
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
  calculateTotal() {
    if (this.HireOutForm.controls.Units.value != "" && this.HireOutForm.controls.qty.value != "") {
      var num1 = Number(this.HireOutForm.controls.Units.value);
      var num2 = Number(this.HireOutForm.controls.qty.value);
      var result = num1 * num2;
      this.HireOutForm.controls.Total.setValue(result);
    }
    else {
      if (this.HireOutForm.controls.qty.value != "") {
        this.HireOutForm.controls.Total.setValue(this.HireOutForm.controls.qty.value);
      }
    }
  }

  editDetail(p) {
    this.HireOutForm.patchValue(p);
    this.addMode = false;
  }


  addNewDetail() {
    this.HireOutForm.reset();
    this.HireOutForm.controls.gsecatID.setValue(0);
    this.addMode = true;
  }
  updatePower() {
    if (this.HireOutForm.controls.gsecatID.value != null && this.HireOutForm.controls.gsecatID.value != 0) {
      var catData = this.gseCateResponseModel.find(c => c.gsecatID == this.HireOutForm.controls.gsecatID.value);
      if (catData != null) {
        this.HireOutForm.controls.isPOW.setValue(catData.isPower);
      }
    }
  }
  getUOMTypes() {
    this.API.getdata("/Generic/getUOMTypes").subscribe(
      (c) => {
        if (c != null) {
          this.UOMTypeResponse = c;
          this.defaultUOMResponse.UOMTypeID = 0;
          this.defaultUOMResponse.UOMType = "Select Type";
          this.UOMTypeResponse.push(this.defaultUOMResponse);
          this.HireOutForm.controls.UOMTypeID.setValue(0);
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
  removeData(hireinId) {
    Swal.fire({
      text: 'Are you sure you want to remove ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove',

    }).then((result) => {
      if (result.isConfirmed) {
        this.removeHireIn(hireinId);
      }
    })
  }
  edithireout(hireoutID) {
    var hireoutData = this.hireoutModel.find(c => c.hireoutID == hireoutID);
    if (hireoutData != null) {
      this.isNew = false;
      this.HireOutForm.patchValue(hireoutData);
    }

  }
  removeHireIn(hireoutID) {
    var index = this.hireoutModel.findIndex(c => c.hireoutID == hireoutID);
    if (index != null) {
      this.hireoutModel.splice(index, 1);
      Swal.fire({
        text: "Removed Successfully!",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
    else {
      Swal.fire({
        text: "Data not Removed , Kindly contact IT Team.",
        icon: 'fail',
        confirmButtonText: 'OK'
      });
    }
  }
  addNew() {
    this.isNew = true;
  }

  getInfo() {
    this.API.getdata("/Hire/getgseMaster?rasID=" + this.HireOutForm.controls.rasID.value).subscribe(
      (c) => {
        if (c != null) {
          this.gseMasterResponse = c;
          this.HireOutForm.controls.gseCategory.setValue(this.gseMasterResponse.gseCategory);
          this.HireOutForm.controls.StationName.setValue(this.gseMasterResponse.StationName);
          this.HireOutForm.controls.gseMasterID.setValue(this.gseMasterResponse.gseMasterID);
          var Desc = this.gseMasterResponse.gseCategory + ", MRAS No: " + this.gseMasterResponse.rasID;
          this.HireOutForm.controls.description.setValue(Desc);
        }
        else {
          Swal.fire({
            text: "MRAS ID not correct!",
            icon: 'fail',
            confirmButtonText: 'OK'
          });
          this.HireOutForm.controls.gseCategory.setValue("");
          this.HireOutForm.controls.StationName.setValue("");
        }
      },
      (error) => {
        this.HireOutForm.controls.gseCategory.setValue("");
        this.HireOutForm.controls.StationName.setValue("");
        Swal.fire({
          text: error.error.Message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }
}

