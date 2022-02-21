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
import { hireinModel, stationResponse, hireinViewModel, removeDetailModel, UOMTypeResponse } from "./hireModel";
import { DatePipe } from "@angular/common";
import { responseAircraftCategory } from '../../AdminArea/AirCraftCat/CraftModel';
import { gseCateRequestModel, } from '../../AdminArea/GSECat/gseCatModel'
import { thisMonth } from "@igniteui/material-icons-extended";
import { stringify } from "querystring";
import { requestSearch, searchResponse } from '../Search/searchModel'
import { v4 as uuid } from 'uuid';
import { flatten } from "@angular/compiler";

@Component({
  selector: 'app-hirein',
  templateUrl: './hirein.component.html',
  styleUrls: ['./hirein.component.css']
})
export class HireinComponent implements OnInit {
  isNew: boolean = true;
  defaultUOMResponse: UOMTypeResponse;
  UOMTypeResponse: UOMTypeResponse[];
  GSEcatID: any;
  hireindetailID: any;
  removeDetailModel: removeDetailModel;
  addMode: boolean = true;
  enableStaton: boolean = false;
  id: number;
  private sub: any;
  hireinViewModel: hireinViewModel;
  hireinModel: hireinModel[];
  validForm: boolean = false;
  hireinDetailNew: hireinModel;
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
  HireInForm: FormGroup;
  HireInSearchForm: FormGroup;

  searchResponse: searchResponse[];
  requestSearch: requestSearch;
  constructor(public API: ApiService,
    public GV: GvarService,
    private route: ActivatedRoute,
    public datepipe: DatePipe) {
    this.gseCateResponseModel = [];
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
    //this.hireinModel = new hireinModel();
    this.hireinModel = [];
    this.hireinDetailNew = new hireinModel();
    this.hireinViewModel = new hireinViewModel();
    this.removeDetailModel = new removeDetailModel();
    this.UOMTypeResponse = [];
    this.defaultUOMResponse = new UOMTypeResponse();
  }

  ngOnInit(): void {
    this.getUOMTypes();
    this.getAirLines();
    this.getStations();
    this.getagency();
    this.getCatData();
    this.getGSECatData();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      if (this.id != null && this.id > 0) {
        this.HireInForm.controls.hireinId.setValue(this.id);
        this.getHireIn();
      }
    });
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

  InitializeForm(): any {
    this.HireInForm = new FormGroup({
      ALCode: new FormControl(""),
      ALName: new FormControl(""),
      airportID: new FormControl(""),
      StationName: new FormControl(""),
      agencyName: new FormControl(""),
      catID: new FormControl(""),
      catName: new FormControl(""),
      hireinDate: new FormControl(""),
      flightNo: new FormControl(""),
      hireinId: new FormControl(""),
      gsecatID: new FormControl(""),
      fromDatetime: new FormControl(),
      toDateTime: new FormControl(),
      qty: new FormControl(""),
      Total: new FormControl(""),
      Remarks: new FormControl(""),
      isPOW: new FormControl(""),
      hireindetailID: new FormControl(""),
      hireinID: new FormControl(""),
      gseCategory: new FormControl(""),
      UOMTypeID: new FormControl(""),
      Units: new FormControl(""),
      agencyID: new FormControl(""),
      isNewRow: new FormControl(""),
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
          this.HireInForm.controls.ALCode.setValue(0);
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
          this.HireInForm.controls.airportID.setValue(0);
          var station = localStorage.getItem("StationName");
          if (station != null) {
            var Userstation = this.stationResponse.find(c => c.StationName == station);
            this.HireInForm.controls.airportID.setValue(Userstation.airportID);
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
        this.HireInForm.controls.agencyID.setValue(0);

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
        this.HireInForm.controls.catID.setValue(0);
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
    if (this.validForm) {

      this.hireinDetailNew = this.HireInForm.value;
      if (this.isNew) {
        this.hireinDetailNew.hireinId = null;
      }
      if (this.HireInForm.controls.UOMTypeID.value != null) {
        var uomTypes = this.UOMTypeResponse.find(c => c.UOMTypeID == this.HireInForm.controls.UOMTypeID.value)
        this.hireinDetailNew.UOMType = uomTypes.UOMType;
      }
      var agency = this.agencyResponseModel.find(c => c.agencyID == this.HireInForm.controls.agencyID.value)
      if (agency != null) {
        this.hireinDetailNew.agencyName = agency.agencyName;
      }
      if (+(this.HireInForm.controls.qty.value) > 0) {
        this.hireinDetailNew.qty = +(this.HireInForm.controls.qty.value);
      }
      else {
        this.hireinDetailNew.qty = 0;
      }
      var gseCat = this.gseCateResponseModel.find(c => c.gsecatID == this.HireInForm.controls.gsecatID.value);
      if (gseCat != null) {
        this.hireinDetailNew.gseCategory = gseCat.gseCategory;
      }
      var station = this.stationResponse.find(c => c.airportID == this.HireInForm.controls.airportID.value);
      if (station != null) {
        this.hireinDetailNew.StationName = station.StationName;
      }
      var Airline = this.responseAirLines.find(c => c.ALCode == this.HireInForm.controls.ALCode.value);
      if (Airline != null) {
        this.hireinDetailNew.ALName = Airline.ALName;
      }
      if (this.hireinDetailNew.hireinId == "" || this.hireinDetailNew.hireinId == undefined || this.hireinDetailNew.hireinId == null) {
        this.hireinDetailNew.hireinId = uuid();
      }
      this.hireinDetailNew.isNewRow = true;
      if (this.isNew == false) {
        var index = this.hireinModel.findIndex(c => c.hireinId == this.hireinDetailNew.hireinId);
        if (index != null) {
          this.hireinModel[index] = this.hireinDetailNew;
          Swal.fire({
            text: "Record Updated in Draft.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      }
      else {
        this.hireinModel.push(this.hireinDetailNew);
        Swal.fire({
          text: "Record Added in Draft.",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.hireinDetailNew = new hireinModel();
      }

    }
  }

  getGSECatData() {
    this.API.getdata('/Setups/getGSECat').subscribe(c => {
      if (c != null) {
        this.gseCateResponseModel = c;
        this.defaultGSECat.gsecatID = 0;
        this.defaultGSECat.gseCategory = "Select Category";
        this.gseCateResponseModel.push(this.defaultGSECat);
        this.HireInForm.controls.gsecatID.setValue(0);
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
  getTime() {
    var dateOne = new Date(this.HireInForm.controls.fromDatetime.value).getTime();
    var dateTwo = new Date(this.HireInForm.controls.toDateTime.value).getTime();
    var Time = dateTwo - dateOne;
    var Days = Time / (1000 * 3600 * 24);
    var time = (Time / 3.6e+6);
    if (this.HireInForm.controls.UOMTypeID.value == 2) {
      var Roundup = Math.ceil(time);
      this.HireInForm.controls.Units.setValue(Roundup)
    }
  }
  uomChanged() {
    var text = this.UOMTypeResponse.find(c => c.UOMTypeID == this.HireInForm.controls.UOMTypeID.value);
    if (text != null) {
      this.labelText = text.UOMType;
    }
  }
  hireinDetailValidations() {
    if (this.HireInForm.controls.airportID.value == "" || this.HireInForm.controls.airportID.value == undefined || this.HireInForm.controls.airportID.value == null || this.HireInForm.controls.airportID.value == "0") {
      Swal.fire({
        text: "Select Station.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireInForm.controls.ALCode.value == "" || this.HireInForm.controls.ALCode.value == undefined || this.HireInForm.controls.ALCode.value == null || this.HireInForm.controls.ALCode.value == "0") {
      Swal.fire({
        text: "Select Airline.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }

    if (this.HireInForm.controls.catID.value == "" || this.HireInForm.controls.catID.value == undefined || this.HireInForm.controls.catID.value == null || this.HireInForm.controls.catID.value == "0") {
      Swal.fire({
        text: "Select Aircraft Category.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireInForm.controls.flightNo.value == "" || this.HireInForm.controls.flightNo.value == undefined || this.HireInForm.controls.flightNo.value == null) {
      Swal.fire({
        text: "Enter flight number.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireInForm.controls.gsecatID.value == "" || this.HireInForm.controls.gsecatID.value == undefined || this.HireInForm.controls.gsecatID.value == null || this.HireInForm.controls.gsecatID.value == "0") {
      Swal.fire({
        text: "Select GSE-Category.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireInForm.controls.agencyID.value == "" || this.HireInForm.controls.agencyID.value == undefined || this.HireInForm.controls.agencyID.value == null || this.HireInForm.controls.agencyID.value == "0") {
      Swal.fire({
        text: "Select Agency.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireInForm.controls.fromDatetime.value == "" || this.HireInForm.controls.fromDatetime.value == undefined || this.HireInForm.controls.fromDatetime.value == null) {
      Swal.fire({
        text: "Enter From Date.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireInForm.controls.toDateTime.value == "" || this.HireInForm.controls.toDateTime.value == undefined || this.HireInForm.controls.toDateTime.value == null) {
      Swal.fire({
        text: "Enter To Date.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireInForm.controls.qty.value == "" || this.HireInForm.controls.qty.value == undefined || this.HireInForm.controls.qty.value == null) {
      Swal.fire({
        text: "Ente Quantity",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.HireInForm.controls.Total.value == "" || this.HireInForm.controls.Total.value == undefined || this.HireInForm.controls.Total.value == null) {
      Swal.fire({
        text: "Enter Total",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }

    if (this.hireinModel.length > 0) {
      var checkDup = this.hireinModel.find(c => c.ALCode == this.HireInForm.controls.ALCode.value &&
        c.catID == this.HireInForm.controls.catID.value &&
        c.flightNo == this.HireInForm.controls.flightNo.value &&
        c.gsecatID == this.HireInForm.controls.gsecatID.value &&
        c.agencyID == this.HireInForm.controls.agencyID.value &&
        c.fromDatetime == this.HireInForm.controls.fromDatetime.value &&
        c.toDateTime == this.HireInForm.controls.toDateTime.value &&
        c.Units == this.HireInForm.controls.Units.value &&
        c.qty == this.HireInForm.controls.qty.value &&
        c.Total == this.HireInForm.controls.Total.value &&
        c.UOMTypeID == this.HireInForm.controls.UOMTypeID.value &&
        c.airportID == this.HireInForm.controls.airportID.value);
      if (this.isNew == false && checkDup != null) {
        if (checkDup.hireinId != this.HireInForm.controls.hireinId.value) {
          if (checkDup != null) {
            Swal.fire({
              text: "Record Already Added.",
              icon: "error",
              confirmButtonText: "OK",
            });
            this.validForm = false;
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
          this.validForm = false;
          return;
        }
      }

    }
    this.validForm = true;
  }
  closeHirInModal() {
    this.HireInForm.reset();
    this.HireInForm.controls.gsecatID.setValue(0);
    this.HireInForm.controls.UOMType.setValue("Per Hrs");
    this.labelText = "No. of Hours";
  }

  // validations() {

  //   if (this.hireinModel.length == 0) {
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

  saveHireIn() {
  //  this.hireinDetailValidations();
    if (this.validForm == true) {
      this.API.PostData('/Hire/SaveHirein', this.hireinModel).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Hire-In Saved Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
        this.resetHireIn();
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

  resetHireIn() {
    this.HireInForm.reset();
    this.HireInForm.reset();
    this.HireInForm.controls.gsecatID.setValue(0);
    // this.hireinModel = new hireinModel();
    this.hireinModel = [];
    this.getGSECatData();
    this.HireInForm.controls.gsecatID.setValue(0);
    this.HireInForm.controls.catID.setValue(0);
    this.HireInForm.controls.agencyID.setValue(0);
    this.HireInForm.controls.airportID.setValue(0);
    this.HireInForm.controls.ALCode.setValue(0);
    this.GSEcatID = null;
    this.hireindetailID = null;
    this.removeDetailModel = new removeDetailModel();
    this.isNew=true;
  }
  getHireIn() {
    this.API.getdata("/Hire/hireinViewModel?hireinId=" + this.HireInForm.controls.hireinId.value).subscribe(c => {
      if (c != null) {
        this.hireinModel = c;
        this.HireInForm.patchValue(this.hireinModel);
        this.hireinViewModel.hireinModel.hireinDate = this.hireinViewModel.hireinModel.hireinDate.substring(0, this.hireinViewModel.hireinModel.hireinDate.length - 9);
        this.HireInForm.controls.hireinDate.setValue(this.hireinViewModel.hireinModel.hireinDate);
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
    if (this.HireInForm.controls.Units.value != "" && this.HireInForm.controls.qty.value != "") {
      var num1 = Number(this.HireInForm.controls.Units.value);
      var num2 = Number(this.HireInForm.controls.qty.value);
      var result = num1 * num2;
      this.HireInForm.controls.Total.setValue(result);
    }
    else {
      if (this.HireInForm.controls.qty.value != "") {
        this.HireInForm.controls.Total.setValue(this.HireInForm.controls.qty.value);
      }
    }
  }

  editDetail(p) {
    this.HireInForm.patchValue(p);
    this.addMode = false;
  }

  // removeDetailNotConfirm(p) {
  //   this.GSEcatID = p.gsecatID;
  //   this.hireindetailID = p.hireindetailID;

  //   var data = this.hireinModel.find(
  //     (c) => c.gsecatID == this.GSEcatID
  //   );
  //   if (data != null) {
  //     if (
  //       this.hireindetailID == undefined ||
  //       this.hireindetailID == null ||
  //       this.hireindetailID == ""
  //     ) {
  //       var index = this.hireinModel.findIndex(
  //         (c) => c.gsecatID == this.GSEcatID
  //       );
  //       this.hireinModel.splice(index, 1);
  //       this.GSEcatID = null;
  //       this.hireindetailID = null;
  //       Swal.fire({
  //         text: "Removed Successfully",
  //         icon: "success",
  //         confirmButtonText: "OK",
  //       });
  //     }
  //     else {
  //       Swal.fire({
  //         text: 'Are you sure you want to remove ' + data.gseCategory + '?',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: 'Remove',

  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           this.removeDetailConfirm();
  //         }
  //       })
  //     }
  //   }
  // }

  // removeDetailConfirm() {
  //   var data = this.hireinModel.find(
  //     (c) => c.gsecatID == this.GSEcatID
  //   );
  //   if (data != null) {
  //     // this.removeDetailModel = data;
  //     if (this.removeDetailModel != null || this.removeDetailModel != undefined) {
  //       this.API.getdata('/Hire/deleteDetail?hireindetailID=' + this.removeDetailModel.hireindetailID).subscribe(c => {
  //         if (c != null) {
  //           Swal.fire({
  //             text: "Removed Successfully",
  //             icon: 'success',
  //             confirmButtonText: 'OK'
  //           });
  //           var Index = this.hireinModel.findIndex(x => x.gsecatID == this.GSEcatID);
  //           this.hireinModel.splice(Index, 1);
  //           this.removeDetailModel = new removeDetailModel();
  //         }
  //       },
  //         error => {
  //           Swal.fire({
  //             text: error.error.Message,
  //             icon: 'error',
  //             confirmButtonText: 'OK'
  //           });
  //         });
  //     }
  //   }
  //   else {
  //     Swal.fire({
  //       text: "Hire-In detail not found",
  //       icon: 'error',
  //       confirmButtonText: 'OK'
  //     });
  //     return
  //   }
  // }

  addNewDetail() {
    this.HireInForm.reset();
    this.HireInForm.controls.gsecatID.setValue(0);
    this.addMode = true;
  }
  updatePower() {
    if (this.HireInForm.controls.gsecatID.value != null && this.HireInForm.controls.gsecatID.value != 0) {
      var catData = this.gseCateResponseModel.find(c => c.gsecatID == this.HireInForm.controls.gsecatID.value);
      if (catData != null) {
        this.HireInForm.controls.isPOW.setValue(catData.isPower);
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
          this.HireInForm.controls.UOMTypeID.setValue(0);
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
  searchHireIn() {
    this.validations();
    if (this.validForm == true) {
      // this.requestSearch.agencyID = this.HireInSearchForm.controls.agencyID.value;
      this.requestSearch.ALCode = this.HireInSearchForm.controls.ALCode.value;
      this.requestSearch.airportID = this.HireInSearchForm.controls.airportID.value;
      this.requestSearch.catID = this.HireInSearchForm.controls.catID.value;
      this.requestSearch.fromDate = this.HireInSearchForm.controls.fromDate.value;
      this.requestSearch.ToDate = this.HireInSearchForm.controls.ToDate.value;
      this.GV.requestSearch = this.requestSearch;
      debugger
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
  edithireIn(hireinId) {
    var hireinData = this.hireinModel.find(c => c.hireinId == hireinId);
    if (hireinData != null) {
      this.isNew = false;
      this.HireInForm.patchValue(hireinData);
    }

  }
  removeHireIn(hireinId) {
    var index = this.hireinModel.findIndex(c => c.hireinId == hireinId);
    if (index != null) {
      this.hireinModel.splice(index, 1);
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
}
