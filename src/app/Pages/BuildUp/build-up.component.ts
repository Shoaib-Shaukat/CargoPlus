import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { ActivatedRoute, RouterStateSnapshot, Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import {
  flightULDResponse,
  ULDNoCombo,
  employeeModel,
  AWBList,
  requestBuildUpModel,
  BuildUpDetail,
  buildupViewModel,
  buildULD,
  requestULDStatus,
  responseDeckLocation,
} from "./BuildUpModel";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { v4 as uuid } from "uuid";
import { ApiService } from "src/app/Services/API/api.service";
import { GvarService } from "src/app/Services/Globel/gvar.service";
import { responseAirLines } from "../AdminArea/Models/airLines";
import { responseFlight } from "../Export/Flights/Model/flightsModel";
import { ULDResponseModel } from "../ULD/ULD/Model";
import { ULDCombo, ULDTypeResponse } from "../../Pages/ULD/ULD/Model";
import { trim } from "jquery";
import { timeStamp } from "console";
import { contourTypeResponse } from "../AdminArea/ContourType/Contour-Model";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-build-up",
  templateUrl: "./build-up.component.html",
  styleUrls: ["./build-up.component.css"],
})
export class BuildUpComponent implements OnInit, AfterViewInit {
  canEnterDollyName: boolean = false;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  BulkStatus: boolean = false;
  contourTypeResponse: contourTypeResponse[];
  remPCS: number = 0;
  isEnabled: boolean = true;
  deckLocation: any;
  ContourType: any;
  forDeletion: any;
  AWBforDelete: any;
  BuildIDforDelete: any;
  BuildUPDetailIDforDelete: any;
  ULDNo: any;
  completeDate: Date;
  localCompleteDate: string;
  defaultDecklocation: responseDeckLocation;
  defaultContourType: contourTypeResponse;
  responseDeckLocation: responseDeckLocation[];
  ULDStatus: string;
  requestULDStatus: requestULDStatus;
  blnULDFound: boolean = false;
  buildULD: buildULD[];
  uldRequestID: string;
  buildupViewModel: buildupViewModel;
  BuildUPDetailID: string;
  AWBDetail: AWBList;
  requestBuildUpModel: requestBuildUpModel;
  blnPieces: boolean = false;
  AWBList: AWBList[];
  defaultFlight: responseFlight;
  defaultAirline: responseAirLines;
  employeeModel: employeeModel;
  flightULDResponse: flightULDResponse[];
  buildArray: any;
  editDetail: boolean = false;
  BuildID: any;
  addMode: boolean = true;
  validForm: boolean = false;
  validPopup: boolean = false;
  ULDTypeResponse: ULDTypeResponse[];
  ULDCombo: ULDCombo[];
  @ViewChildren("deleteModal") deleteModal: ElementRef;
  @ViewChildren("buildModel") buildModel: ElementRef;
  @ViewChildren("confirmDeleteULDModal") confirmDeleteULDModal: ElementRef;
  @ViewChildren("closeBuildUPDetailModal") closeBuildUPDetailModal: ElementRef;

  latestDate: any;
  responseFlight: responseFlight[];
  ALCode: string;
  responseAirLines: responseAirLines[];
  ULDNoCombo: ULDNoCombo[];
  ULDResponseModel: ULDResponseModel;
  userTable: FormGroup;
  mode: boolean;
  touchedRows: any;
  BuildUpForm: FormGroup;
  PopupForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showGrid: boolean = true;
  showNewSection: boolean = false;
  date: string;
  constructor(
    public API: ApiService,
    public GV: GvarService,
    private route: ActivatedRoute,
    public datepipe: DatePipe
  ) {
    this.contourTypeResponse = [];
    this.date = new Date().toLocaleString().slice(0, 17);
    this.forDeletion = [];
    this.defaultDecklocation = new responseDeckLocation();
    this.defaultContourType = new contourTypeResponse();
    this.responseDeckLocation = [];
    this.requestULDStatus = new requestULDStatus();
    this.buildULD = [];
    this.buildupViewModel = new buildupViewModel();
    this.AWBDetail = new AWBList();
    this.requestBuildUpModel = new requestBuildUpModel();
    this.AWBList = [];
    this.defaultFlight = new responseFlight();
    this.defaultAirline = new responseAirLines();
    this.employeeModel = new employeeModel();
    this.flightULDResponse = [];
    this.buildArray = [];
    this.ULDTypeResponse = [];
    this.ULDNoCombo = [];
    this.responseAirLines = [];
    this.InitializeForm();
    this.InitializeDetailForm();
    this.ULDResponseModel = new ULDResponseModel();
  }

  ngOnInit(): void {
    this.contourTypeResponse = [];
    this.getContourTypes();
    this.setDate();
    this.getAWBsforBuildup();
    this.getAirLines();
    this.getDeckLocations();

    this.BuildUpForm.controls.contourID.setValue("0");
    this.canEnterDollyName = false;
  }
  ngAfterViewInit() { }
  InitializeDetailForm(): any {
    this.PopupForm = new FormGroup({
      MasterAWBNo: new FormControl(""),
      Pieces: new FormControl(""),
      remainingPieces: new FormControl(""),
      RemPieces: new FormControl(""),
      remainingWeight: new FormControl(""),
      AWBNo: new FormControl(""),
      builduppieces: new FormControl(""),
      grossWeight: new FormControl(""),
      splitShipment: new FormControl(""),
      Destination: new FormControl(""),
      AcceptanceRemarks: new FormControl(""),
      ExaminationRemarks: new FormControl(""),
      ScanningRemarks: new FormControl(""),
      buildupweight: new FormControl(""),
      acceptanceID: new FormControl(""),
      comid: new FormControl(""),
    });
  }
  InitializeForm(): any {
    this.BuildUpForm = new FormGroup({
      BuildID: new FormControl(""),
      ALCode: new FormControl(""),
      ALName: new FormControl(""),
      ULDID: new FormControl(""),
      ULDNo: new FormControl(""),
      taraWeight: new FormControl(""),
      ULDFW: new FormControl(""),
      FWDatetime: new FormControl(""),
      ULDSW: new FormControl(""),
      SWDatetime: new FormControl(""),
      // AWBWT: new FormControl(""),
      SHCode: new FormControl(""),
      ContourType: new FormControl(""),
      contourID: new FormControl(""),
      uldreceiveDetailID: new FormControl(""),
      deckLocation: new FormControl(""),
      deckLocationID: new FormControl(""),
      isNew: new FormControl(""),
      // EMP1: new FormControl(""),
      // EMP2: new FormControl(""),
      // emp1Name: new FormControl(""),
      // emp2Name: new FormControl(""),
      depDate: new FormControl(""),
      depTime: new FormControl(""),
      Destination: new FormControl(""),
      uldNetWt: new FormControl(""),
      DollyWT: new FormControl(""),
      uldgrossWeight: new FormControl(""),
      typeid: new FormControl(""),
      Bulk: new FormControl(""),
      AirwayBillWT: new FormControl(""),
      dollyName: new FormControl(""),
    });
  }
  ngAfterOnInit() { }
  getAirLines() {
    this.API.getdata("/Setups/getAirLines").subscribe(
      (c) => {
        if (c != null) {
          this.responseAirLines = c;
          this.defaultAirline.ALCode = 0;
          this.defaultAirline.ALName = "Select Airline";
          this.responseAirLines.push(this.defaultAirline);
          this.BuildUpForm.controls.ALCode.setValue(0);
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
  saveUserDetails() {
    console.log(this.userTable.value);
  }
  toggleTheme() {
    this.mode = !this.mode;
  }
  CleanFlightData() {
    this.flightULDResponse = [];
  }
  closeDeleteModal() {
    this.confirmDeleteULDModal["first"].nativeElement.click();
  }
  confirmDeleteULDRequest() { }
  closePopUp() {
    this.buildModel["first"].nativeElement.click();
  }
  validationsForPopup() {
    if (
      this.PopupForm.controls.AWBNo.value == "" ||
      this.PopupForm.controls.AWBNo.value == null ||
      this.PopupForm.controls.AWBNo.value == "-1"
    ) {
      Swal.fire({
        text: "Select Master AWB No.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validPopup = false;
      return;
    }
    this.validPopup = true;
  }
  editpush() {
    this.validationsForPopup();
    if (this.validPopup == true) {
    }
  }
  findIndexToUpdate(newItem) {
    return newItem.id === this;
  }
  PushAWBDetail() {
    this.validationsForPopup();
    if (this.validPopup == true) {
      if (this.editDetail == true) {
        this.AWBDetail = this.AWBList.find(
          (x) => x.BuildUPDetailID == this.BuildUPDetailID
        );
        var Index = this.requestBuildUpModel.BuildUpDetail.findIndex(
          (x) => x.AWBNo == this.AWBforDelete
        );
        if (Index != null) {
          this.requestBuildUpModel.BuildUpDetail[Index].AWBNo =
            this.PopupForm.controls.AWBNo.value;
          this.requestBuildUpModel.BuildUpDetail[Index].Pieces =
            this.PopupForm.controls.Pieces.value;
          this.requestBuildUpModel.BuildUpDetail[Index].builduppieces =
            this.PopupForm.controls.builduppieces.value;
          this.requestBuildUpModel.BuildUpDetail[Index].grossWeight =
            this.PopupForm.controls.grossWeight.value;
          this.requestBuildUpModel.BuildUpDetail[Index].splitShipment =
            this.PopupForm.controls.splitShipment.value;
          this.requestBuildUpModel.BuildUpDetail[Index].splitShipment =
            this.PopupForm.controls.splitShipment.value;
          this.requestBuildUpModel.BuildUpDetail[Index].remainingWeight =
            this.PopupForm.controls.remainingWeight.value;
          this.requestBuildUpModel.BuildUpDetail[Index].Destination =
            this.PopupForm.controls.Destination.value;
          this.requestBuildUpModel.BuildUpDetail[Index].buildupweight =
            this.PopupForm.controls.buildupweight.value;
          this.requestBuildUpModel.BuildUpDetail[Index].acceptanceID =
            this.PopupForm.controls.acceptanceID.value;
          if (this.PopupForm.controls.Pieces.value != "") {
            if (this.PopupForm.controls.builduppieces.value != "") {
              var remPieces =
                this.PopupForm.controls.Pieces.value -
                this.PopupForm.controls.builduppieces.value;
              this.requestBuildUpModel.BuildUpDetail[Index].remainingPieces =
                remPieces;
            }
          }
          this.AWBforDelete = null;
        }
      }
      // else {
      //   if (this.PopupForm.controls.RemPieces.value != null && this.PopupForm.controls.RemPieces.value != "") {
      //     if (this.PopupForm.controls.Pieces.value > this.PopupForm.controls.RemPieces.value) {
      //       Swal.fire({
      //         text: "Build UP Pieces cannot be greater than REM Pieces",
      //         icon: 'error',
      //         confirmButtonText: 'OK'
      //       });
      //       return;
      //     }
      //   }
      // for (let i = 0; i < this.requestBuildUpModel.BuildUpDetail.length; i++) {
      //   if (this.PopupForm.controls.AWBNo.value == this.requestBuildUpModel.BuildUpDetail[i].AWBNo) {
      //     Swal.fire({
      //       text: "Build UP already created with entered AWB Number",
      //       icon: 'error',
      //       confirmButtonText: 'OK'
      //     });
      //     return;
      //   }
      // }
      //}
      var TotalWeight = 0;
      // var TotalAWBWeight = 0;
      for (let i = 0; i < this.requestBuildUpModel.BuildUpDetail.length; i++) {
        TotalWeight = +(
          TotalWeight + this.requestBuildUpModel.BuildUpDetail[i].buildupweight
        );
      }
      // for (let i = 0; i < this.requestBuildUpModel.BuildUpDetail.length; i++) {
      //   TotalAWBWeight = + (TotalAWBWeight + this.requestBuildUpModel.BuildUpDetail[i].AWBWeight);
      // }
      // this.BuildUpForm.controls.AWBWT.setValue(TotalAWBWeight);
      this.buildModel["first"].nativeElement.click();
      this.editDetail = false;
    }
  }
  getULDDetails(ULDID: number) {
    var ULDDetail = this.ULDCombo.find(
      (x) => x.ULDID == this.PopupForm.controls.ULDID.value
    );
    if (ULDDetail != undefined) {
      this.PopupForm.controls.taraWeight.setValue(ULDDetail.taraWeight);
      this.PopupForm.controls.maxGrossWeight.setValue(ULDDetail.maxGrossWeight);
      this.PopupForm.controls.status.setValue(ULDDetail.status);
      this.PopupForm.controls.serviceAbility.setValue(ULDDetail.serviceAbility);
    }
  }
  resetDetail() {
    this.PopupForm.reset(true);
    this.PopupForm.controls.acceptanceID.setValue("-1");
    this.editDetail = false;
    this.blnPieces = false;
    this.AWBDetail = new AWBList();
  }
  resetBuildUp() {
    this.canEnterDollyName = false;
    this.BuildUpForm.reset();
    this.PopupForm.reset(true);
    this.addMode = true;
    this.BuildUpForm.controls.ULDNo.enable();
    this.BuildUpForm.controls.isNew.setValue(true);
    this.requestBuildUpModel.BuildUpDetail = [];
    this.BuildUpForm.controls.ALCode.setValue(0);
    this.BuildUpForm.controls.deckLocationID.setValue(0);
    this.BuildUpForm.controls.contourID.setValue(0);
    this.BulkStatus = false;
  }
  validations() {
    if (
      this.BuildUpForm.controls.ALCode.value == "" ||
      this.BuildUpForm.controls.ALCode.value == null
    ) {
      Swal.fire({
        text: "Select Airline",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }

    if (this.BulkStatus == false) {
      if (
        this.BuildUpForm.controls.ULDNo.value == "" ||
        this.BuildUpForm.controls.ULDNo.value == null
      ) {
        Swal.fire({
          text: "Enter ULD No.",
          icon: "error",
          confirmButtonText: "OK",
        });
        this.validForm = false;
        return;
      }
    }
    if (
      this.BuildUpForm.controls.dollyName.value == "" ||
      this.BuildUpForm.controls.dollyName.value == null
    ) {
      Swal.fire({
        text: "Enter Dolly Name",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }

    if (
      this.BuildUpForm.controls.ContourType.value == "" ||
      this.BuildUpForm.controls.ContourType.value == null
    ) {
      Swal.fire({
        text: "Select Contour Type",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (
      this.BuildUpForm.controls.deckLocationID.value == "" ||
      this.BuildUpForm.controls.deckLocationID.value == null
    ) {
      Swal.fire({
        text: "Select Deck Location",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  destroyDT = (tableIndex, clearData): Promise<boolean> => {
    return new Promise((resolve) => {
      if (this.datatableElement)
        this.datatableElement.forEach(
          (dtElement: DataTableDirective, index) => {
            if (index == tableIndex) {
              if (dtElement.dtInstance) {
                if (tableIndex == 0) {
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    if (clearData) {
                      dtInstance.clear();
                    }
                    dtInstance.destroy();
                    resolve(true);
                  });
                } else if (tableIndex == 1) {
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    if (clearData) {
                      dtInstance.clear();
                    }
                    dtInstance.destroy();
                    resolve(true);
                  });
                } else if (tableIndex == 2) {
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    if (clearData) {
                      dtInstance.clear();
                    }
                    dtInstance.destroy();
                    resolve(true);
                  });
                } else if (tableIndex == 3) {
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    if (clearData) {
                      dtInstance.clear();
                    }
                    dtInstance.destroy();
                    resolve(true);
                  });
                } else if (tableIndex == 4) {
                  dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    if (clearData) {
                      dtInstance.clear();
                    }
                    dtInstance.destroy();
                    resolve(true);
                  });
                }
              } else {
                resolve(true);
              }
            }
          }
        );
    });
  };

  // calculateDollyWeight() {
  //   if (
  //     this.BuildUpForm.controls.ULDFW.value != "" &&
  //     this.BuildUpForm.controls.ULDFW.value != null &&
  //     this.BuildUpForm.controls.taraWeight.value != "" &&
  //     this.BuildUpForm.controls.taraWeight.value != null
  //   ) {
  //     var SacleFirstWt = Number(this.BuildUpForm.controls.ULDFW.value);
  //     var TaraWeight = Number(this.BuildUpForm.controls.taraWeight.value);
  //     var DollyWT = SacleFirstWt - TaraWeight;
  //     this.BuildUpForm.controls.DollyWT.setValue(DollyWT);
  //   } else {
  //     this.BuildUpForm.controls.DollyWT.setValue("");
  //   }
  // }

  calculateSecondWeight() {
    if (this.BuildUpForm.controls.ULDSW.value != "" && this.BuildUpForm.controls.ULDSW.value != null && this.BuildUpForm.controls.DollyWT.value != "" && this.BuildUpForm.controls.DollyWT.value != null) {
      var SacleuldgrossWeight = Number(this.BuildUpForm.controls.ULDSW.value);
      var DollyWT = Number(this.BuildUpForm.controls.DollyWT.value);
      var uldgrossWeight = SacleuldgrossWeight - DollyWT;
      this.BuildUpForm.controls.uldgrossWeight.setValue(uldgrossWeight);
    }
    else {
      this.BuildUpForm.controls.uldgrossWeight.setValue("");
    }
  }

  calculateGrossWeight() {
    if (
      this.BuildUpForm.controls.uldgrossWeight.value != "" &&
      this.BuildUpForm.controls.uldgrossWeight.value != null &&
      this.BuildUpForm.controls.ULDFW.value != "" &&
      this.BuildUpForm.controls.ULDFW.value != null
    ) {
      var uldgrossWeight = Number(
        this.BuildUpForm.controls.uldgrossWeight.value
      );
      var ScaleFirstWT = Number(this.BuildUpForm.controls.ULDFW.value);
      var uldgrossWeight = uldgrossWeight - ScaleFirstWT;
      this.BuildUpForm.controls.uldgrossWeight.setValue(uldgrossWeight);
    } else {
      this.BuildUpForm.controls.uldgrossWeight.setValue("");
    }
  }

  getULDs() {
    this.resetAllInputs();
    if (
      this.BuildUpForm.controls.ALCode.value != undefined &&
      this.BuildUpForm.controls.ALCode.value != null &&
      this.BuildUpForm.controls.ALCode.value != 0
    ) {
      this.API.getdata(
        "/ULD/getULDBuild?ALCode=" + this.BuildUpForm.controls.ALCode.value
      ).subscribe(
        (c) => {
          if (c != null) {
            this.buildULD = c;
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
  }
  resetAllInputs() {
    this.BuildUpForm.controls.ULDNo.reset();
    this.BuildUpForm.controls.uldNetWt.reset();
    this.BuildUpForm.controls.ContourType.reset();
    this.BuildUpForm.controls.deckLocation.reset();
    this.BuildUpForm.controls.deckLocationID.setValue(0);
    this.BuildUpForm.controls.ULDSW.reset();
    this.BuildUpForm.controls.ULDFW.reset();
    this.BuildUpForm.controls.SWDatetime.reset();
    this.BuildUpForm.controls.taraWeight.reset();
    this.BuildUpForm.controls.FWDatetime.reset();
    this.requestBuildUpModel.BuildUpDetail = [];
  }
  getULDData() {
    var flightULDResponse = this.flightULDResponse.find(
      (x) => x.ULDID == this.BuildUpForm.controls.ULDID.value
    );
    if (flightULDResponse != undefined) {
      this.BuildUpForm.controls.taraWeight.setValue(
        flightULDResponse.taraWeight
      );
    } else {
      this.BuildUpForm.controls.taraWeight.setValue("");
    }
  }
  // getemployeeDetail(callFrom: string) {
  //   var empID = "";
  //   if (callFrom == "1") {
  //     empID = this.BuildUpForm.controls.EMP1.value
  //     if (this.BuildUpForm.controls.EMP1.value == undefined) {
  //       this.BuildUpForm.controls['EMP1'].setValue("");
  //       this.BuildUpForm.controls['emp1Name'].setValue("");
  //       Swal.fire({
  //         text: "Select Employee 1",
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //       this.validPopup = false;
  //       return;
  //     }
  //   }
  //   if (callFrom == "2") {
  //     empID = this.BuildUpForm.controls.EMP2.value
  //     if (this.BuildUpForm.controls.EMP2.value == undefined) {
  //       this.BuildUpForm.controls['EMP2'].setValue("");
  //       this.BuildUpForm.controls['emp2Name'].setValue("");
  //       Swal.fire({
  //         text: "Select Employee 2",
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //       this.validPopup = false;
  //       return;
  //     }
  //   }
  //   this.API.getdata('/Generic/getEmpDetail?empID=' + empID).subscribe(c => {
  //     if (c != null) {
  //       this.employeeModel = c;
  //       if (callFrom == "1") {
  //         this.BuildUpForm.controls.EMP1.setValue(this.employeeModel.empID);
  //         this.BuildUpForm.controls.emp1Name.setValue(this.employeeModel.employeeName);
  //       }
  //       if (callFrom == "2") {
  //         this.BuildUpForm.controls.EMP2.setValue(this.employeeModel.empID);
  //         this.BuildUpForm.controls.emp2Name.setValue(this.employeeModel.employeeName);
  //       }
  //     }
  //     else {
  //     }
  //   },
  //     error => {
  //       Swal.fire({
  //         text: error.error.Message,
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //     });
  // }
  getAWBsforBuildup() {
    this.API.getdata("/ULD/getAWBsforBuildup").subscribe(
      (c) => {
        if (c != null) {
          this.destroyDT(0, true).then((destroyed) => {
            this.AWBList = c;
            this.AWBList.forEach((element) => {
              if (element.remainingPieces != null) {
                if (Number(element.remainingPieces) > 0) {
                  element.remPCS = element.remainingPieces;
                  element.builduppieces = element.remainingPieces;
                  element.splitShipment = true;
                } else {
                  element.builduppieces = element.Pieces;
                  element.remPCS = 0;
                }
              } else {
                element.builduppieces = element.Pieces;
                element.remPCS = 0;
              }
              if (element.remainingWeight != null) {
                if (Number(element.remainingWeight) > 0) {
                  element.remWt = element.remainingWeight;
                  var remWt = (element.grossWeight / element.Pieces) * element.builduppieces;
                  element.buildupweight = remWt;
                  element.remainingWeight = element.remWt - element.buildupweight;
                }
              }
            });
            this.requestBuildUpModel.BuildUpDetail.forEach((element) => {
              var checkdup = this.AWBList.find(
                (c) => c.acceptanceID == element.acceptanceID
              );
              if (checkdup != null) {
                var index = this.AWBList.findIndex(
                  (c) => c.acceptanceID == element.acceptanceID
                );
                this.AWBList.splice(index, 1);
              }
            });
            this.dtTrigger.next();
          });
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
  // getRemWeightandPieces() {
  //   if (this.blnPieces == true) {
  //     if (this.PopupForm.controls.Pieces != null && this.PopupForm.controls.AWBPieces != null) {
  //       var remainingPieces = this.PopupForm.controls.AWBPieces.value - this.PopupForm.controls.Pieces.value;
  //       this.PopupForm.controls.RemPieces.setValue(remainingPieces);
  //     }
  //     if (this.PopupForm.controls.AWBWeight != null && this.PopupForm.controls.AWBWeight != undefined
  //       && this.PopupForm.controls.Pieces != null && this.PopupForm.controls.Pieces != undefined) {
  //       var singleWt = this.PopupForm.controls.AWBWeight.value / this.PopupForm.controls.AWBPieces.value;
  //       var remainingPieces = this.PopupForm.controls.AWBPieces.value - this.PopupForm.controls.Pieces.value;
  //       var remainingWeight = singleWt * remainingPieces;
  //       this.PopupForm.controls.remainingPieces.setValue(remainingWeight);
  //     }
  //   }
  // }
  disableField(p) {
    this.blnPieces = p;
    if (this.blnPieces == false) {
      this.PopupForm.controls.Pieces.setValue(
        this.PopupForm.controls.AWBPieces.value
      );
      // this.PopupForm.controls.weight.setValue(this.PopupForm.controls.AWBWeight.value);
    }
  }
  editBuildDetail(p) {
    this.PopupForm.patchValue(p);
    this.PopupForm.controls.RemPieces.patchValue(p.remainingPieces);
    if (this.PopupForm.controls.RemPieces.value > 0) {
      this.remPCS = this.PopupForm.controls.RemPieces.value;
      this.PopupForm.controls.splitShipment.setValue(true);
    }
    this.AWBforDelete = p.AWBNo;
    this.BuildUPDetailID = p.BuildUPDetailID;
    this.editDetail = true;
    if (this.PopupForm.controls.splitShipment.value == true) {
      this.blnPieces = true;
    }
    if (
      this.PopupForm.controls.Pieces != null &&
      this.PopupForm.controls.AWBPieces != null
    ) {
      var remainingPieces =
        this.PopupForm.controls.AWBPieces.value -
        this.PopupForm.controls.Pieces.value;
      this.PopupForm.controls.RemPieces.patchValue(remainingPieces);
    }
  }
  saveData(state: string) {
    this.validations();
    if (this.validForm == true) {
      this.requestBuildUpModel.buildUpRequest = this.BuildUpForm.value;
      this.API.PostData("/ULD/saveBuildUp", this.requestBuildUpModel).subscribe(
        (c) => {
          if (c != null) {
            Swal.fire({
              text: "Build UP Created Successfully",
              icon: "success",
              confirmButtonText: "OK",
            });
            this.BuildUpForm.controls.isNew.setValue(false);
            this.BuildUpForm.controls.BuildID.setValue(
              c.buildUpResponse.BuildID
            );
            this.ULDNo = this.BuildUpForm.controls.ULDNo.value;
            this.getBuildUpDetail();
            this.addMode = false;
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
  }
  editData() {
    this.addMode = false;
    if (
      this.BuildUpForm.controls.ULDID.value != undefined &&
      this.BuildUpForm.controls.ULDID.value != "" &&
      this.BuildUpForm.controls.ULDID.value != 0
    ) {
      this.API.getdata(
        "/ULD/buildupViewModel?ULDID=" + this.BuildUpForm.controls.ULDID.value
      ).subscribe(
        (c) => {
          if (c != null) {
            this.requestBuildUpModel.buildUpRequest = c.builupModel;
            this.BuildUpForm.patchValue(c.builupModel);
            this.requestBuildUpModel.BuildUpDetail = c.BuildUpDetail;
            if (
              this.requestBuildUpModel.buildUpRequest.FWDatetime == "00:00:00"
            ) {
              this.BuildUpForm.controls.FWDatetime.reset();
            }
            if (
              this.requestBuildUpModel.buildUpRequest.SWDatetime == "00:00:00"
            ) {
              this.BuildUpForm.controls.SWDatetime.reset();
            }
            // this.getemployeeDetail("1");
            // this.getemployeeDetail("2");
            this.BuildUpForm.controls.ALCode.setValue(
              this.requestBuildUpModel.buildUpRequest.ALCode
            );
            this.BuildUpForm.controls.ULDID.setValue(
              this.requestBuildUpModel.buildUpRequest.ULDID
            );
            this.BuildUpForm.controls.taraWeight.setValue(
              this.requestBuildUpModel.buildUpRequest.taraWeight
            );
            this.BuildUpForm.controls.deckLocation.setValue(
              this.requestBuildUpModel.buildUpRequest.deckLocation
            );
            this.BuildUpForm.controls.ContourType.setValue(
              this.requestBuildUpModel.buildUpRequest.ContourType
            );
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
  }
  bindULDRequestData(uldRequestDetailID: any) {
    if (uldRequestDetailID == "" || uldRequestDetailID == null) {
      return;
    }
    this.API.getdata(
      "/ULD/bindULDData?uldRequestDetailID=" + uldRequestDetailID
    ).subscribe(
      (c) => {
        if (c != null) {
          this.BuildUpForm.controls.ALCode.setValue(c.ALCode);
          this.BuildUpForm.controls.ALName.setValue(c.ALName);
          this.BuildUpForm.controls.ULDID.setValue(c.ULDID);
          this.BuildUpForm.controls.ULDNo.setValue(c.ULDNo);

          this.BuildUpForm.controls.taraWeight.setValue(c.taraWeight);
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
  findULD() {
    if (
      this.BuildUpForm.controls.ALCode.value != undefined &&
      this.BuildUpForm.controls.ALCode.value != ""
    ) {
      if (
        this.BuildUpForm.controls.ULDNo.value != undefined &&
        this.BuildUpForm.controls.ULDNo.value != ""
      ) {
        var results = this.buildULD.find(
          (c) => c.ULDNo == this.BuildUpForm.controls.ULDNo.value.trim()
        );
        if (results != null) {
          this.BuildUpForm.controls.taraWeight.setValue(results.taraWeight);
          this.BuildUpForm.controls.ULDID.setValue(results.ULDID);
          this.BuildUpForm.controls.uldreceiveDetailID.setValue(results.uldreceiveDetailID);
          this.blnULDFound = true;
          this.canEnterDollyName = true;
          this.checkULDStatus();
        } else {
          this.BuildUpForm.controls.taraWeight.setValue("");
          this.BuildUpForm.controls.ULDNo.setValue("");
          this.blnULDFound = false;
          this.canEnterDollyName = false;
          Swal.fire({
            text: "ULD Number Not Found, Enter Correct ULD Number",
            icon: "error",
            confirmButtonText: "OK",
          });
          this.requestBuildUpModel = new requestBuildUpModel();
        }
      } else {
        this.BuildUpForm.controls.ULDNo.setValue("");
        this.BuildUpForm.controls.taraWeight.setValue("");
        this.BuildUpForm.controls.ULDID.setValue("");
      }
    } else {
      this.BuildUpForm.controls.ULDNo.setValue("");
      this.BuildUpForm.controls.taraWeight.setValue("");
      this.BuildUpForm.controls.ULDID.setValue("");
      this.blnULDFound = false;
      this.canEnterDollyName = false;
      Swal.fire({
        text: "Select Airline First",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }
  // getAWBDetail() {
  //   if (this.PopupForm.controls.AWBNo.value != undefined && this.PopupForm.controls.AWBNo.value != "") {
  //     var AWBDetail = this.AWBList.find(c => c.AWBNo == this.PopupForm.controls.AWBNo.value);
  //     if (AWBDetail != null) {
  //       this.PopupForm.controls.AWBPieces.setValue(AWBDetail.Pieces)
  //       this.PopupForm.controls.buildupweight.setValue(AWBDetail.grossWeight)
  //       this.PopupForm.controls.acceptanceID.setValue(AWBDetail.acceptanceID)
  //       this.PopupForm.controls.Pieces.setValue(this.PopupForm.controls.AWBPieces.value);
  //       this.PopupForm.controls.ScanningRemarks.setValue(AWBDetail.ScanningRemarks);
  //       this.PopupForm.controls.AcceptanceRemarks.setValue(AWBDetail.AcceptanceRemarks);
  //       this.PopupForm.controls.ExaminationRemarks.setValue(AWBDetail.ExaminationRemarks);
  //       this.PopupForm.controls.destination.setValue(AWBDetail.Destination);
  //       this.PopupForm.controls.grossWeight.setValue(AWBDetail.grossWeight);
  //       this.PopupForm.controls.splitShipment.setValue(AWBDetail.splitShipment);
  //       this.PopupForm.controls.RemPieces.setValue(AWBDetail.remainingPieces);
  //       if (AWBDetail.remainingPieces != null) {
  //         if (Number(AWBDetail.remainingPieces) > 0) {
  //           // this.PopupForm.controls.AWBPieces.setValue(AWBDetail.remainingPieces)
  //         }
  //       }
  //       if (AWBDetail.splitShipment != null) {
  //         if (AWBDetail.splitShipment == "true") {

  //         }
  //       }

  //     }
  //     else {
  //       Swal.fire({
  //         text: "AWB Not Found",
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //       this.PopupForm.controls.AWBPieces.setValue("")
  //       this.PopupForm.controls.comid.setValue("");
  //       this.PopupForm.controls.buildupweight.setValue("");
  //       this.PopupForm.controls.acceptanceID.setValue("");
  //       this.PopupForm.controls.Pieces.setValue("");;
  //       this.PopupForm.controls.buildupweight.setValue("");
  //       this.PopupForm.controls.AcceptanceRemarks.setValue("");
  //       this.PopupForm.controls.ExaminationRemarks.setValue("");
  //       this.PopupForm.controls.ScanningRemarks.setValue("");
  //     }
  //   }
  //   else {
  //     this.PopupForm.controls.AWBPieces.setValue("")
  //     this.PopupForm.controls.comid.setValue("");
  //     this.PopupForm.controls.buildupweight.setValue("");
  //     this.PopupForm.controls.acceptanceID.setValue("");
  //     this.PopupForm.controls.Pieces.setValue("");;
  //     this.PopupForm.controls.buildupweight.setValue("");

  //     this.PopupForm.controls.AcceptanceRemarks.setValue("");
  //     this.PopupForm.controls.ExaminationRemarks.setValue("");
  //     this.PopupForm.controls.ScanningRemarks.setValue("");

  //   }
  // }
  checkULDStatus() {
    this.requestBuildUpModel = new requestBuildUpModel();
    if (
      this.BuildUpForm.controls.ULDNo.value != "" &&
      this.BuildUpForm.controls.ULDNo.value != ""
    ) {
      this.requestULDStatus.ULDNo = this.BuildUpForm.controls.ULDNo.value;
      this.API.PostData("/ULD/checkULDStatus", this.requestULDStatus).subscribe(
        (c) => {
          if (c != null) {
            this.ULDStatus = c.ULDStatus;
            if (this.ULDStatus != "") {
              if (this.ULDStatus == "NO") {
                Swal.fire({
                  text: "This ULS is not available for Build UP",
                  icon: "error",
                  confirmButtonText: "OK",
                });
                this.BuildUpForm.controls.ULDNo.setValue("");

                this.BuildUpForm.controls.taraWeight.setValue("");
                this.BuildUpForm.controls.ULDID.setValue("");
                this.requestBuildUpModel = new requestBuildUpModel();
                this.BuildUpForm.controls.isNew.setValue(true);
              }
              if (this.ULDStatus == "Issued") {
                //  this.BuildUpForm.controls.isNew.setValue(false);
                // this.editData();
              }
              if (this.ULDStatus == "OK") {
                this.BuildUpForm.controls.isNew.setValue(true);
              }
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
  }
  getDeckLocations() {
    this.API.getdata("/DeckLocation/getDeckLocation").subscribe(
      (c) => {
        if (c != null) {
          this.responseDeckLocation = c;
          this.defaultDecklocation.deckLocationID = "0";
          this.defaultDecklocation.deckLocationName = "Select Deck Location";
          this.responseDeckLocation.push(this.defaultDecklocation);
          this.BuildUpForm.controls.deckLocationID.setValue(0);
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
  setdeckLocation() {
    if (
      this.BuildUpForm.controls.deckLocationID.value != undefined ||
      this.BuildUpForm.controls.deckLocationID.value != ""
    ) {
      var results = this.responseDeckLocation.find(
        (c) =>
          c.deckLocationID == this.BuildUpForm.controls.deckLocationID.value
      );
      if (results != null) {
        this.BuildUpForm.controls.deckLocation.setValue(
          results.deckLocationName
        );
      } else {
        this.BuildUpForm.controls.deckLocation.setValue("");
      }
    }
  }

  setContourType() {
    if (
      this.BuildUpForm.controls.contourID.value != undefined ||
      this.BuildUpForm.controls.contourID.value != ""
    ) {
      var results = this.contourTypeResponse.find(
        (c) => c.contourID == this.BuildUpForm.controls.contourID.value
      );
      if (results != null) {
        this.BuildUpForm.controls.ContourType.setValue(results.ContourType);
      } else {
        this.BuildUpForm.controls.ContourType.setValue("");
      }
    }
  }

  setDate() {
    // this.completeDate = new Date();
    // this.localCompleteDate = this.completeDate.toISOString();
    // this.localCompleteDate = this.localCompleteDate.substring(0, this.localCompleteDate.length - 5);
    // this.BuildUpForm.controls.FWDatetime.setValue(this.localCompleteDate);
    // this.BuildUpForm.controls.SWDatetim.setValue(this.localCompleteDate);
  }

  getWeightfromScale(callFrom: string) {
    if (callFrom == "1") {
      this.API.getdata("/Generic/GetWeightScale?locationName=ULD").subscribe(
        (c) => {
          if (c != null) {
            this.BuildUpForm.controls.ULDFW.setValue(c.weight);
            if (this.BulkStatus == true) {
              this.BuildUpForm.controls.uldgrossWeight.setValue(c.weight);
            }
            this.BuildUpForm.controls.FWDatetime.setValue(
              this.datepipe.transform(c.weightDateTime, "dd/MMM/yyyy HH:mm")
            );
            // this.calculateDollyWeight();
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
    if (callFrom == "2") {
      this.API.getdata("/Generic/GetWeightScale?locationName=ULD").subscribe(
        (c) => {
          if (c != null) {
            this.BuildUpForm.controls.ULDSW.setValue(c.weight);
            this.BuildUpForm.controls.SWDatetime.setValue(
              this.datepipe.transform(c.weightDateTime, "dd/MMM/yyyy HH:mm")
            );
            // this.calculateDollyWeight();
            this.calculateSecondWeight();
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
  }
  private formatDate(date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }
  getBuildUpDetail() {
    this.API.getdata("/ULD/buildupViewModel?uldNo=" + this.ULDNo).subscribe(
      (c) => {
        if (c != null) {
          this.addMode = false;
          this.BuildUpForm.patchValue(c.builupModel);
          this.deckLocation = c.builupModel.deckLocation;
          this.ContourType = c.builupModel.ContourType;
          this.requestBuildUpModel.BuildUpDetail = c.BuildUpDetail;
          this.forDeletion = c.BuildUpDetail;
          this.BuildUpForm.controls.ULDNo.disable();
          this.BuildUpForm.get("ULDNo").disable();
          this.BuildUpForm.controls.isNew.setValue(false);
          this.BuildUpForm.controls.FWDatetime.setValue(
            this.datepipe.transform(
              this.BuildUpForm.controls.FWDatetime.value,
              "dd/MMM/yyyy HH:mm"
            )
          );
          this.BuildUpForm.controls.SWDatetime.setValue(
            this.datepipe.transform(
              this.BuildUpForm.controls.SWDatetime.value,
              "dd/MMM/yyyy HH:mm"
            )
          );
          // this.setFirstTime();
          // this.setSecondTime();
          //this.calculateDollyWeight();
          this.getDollyInfo();
        }
      },
      (error) => {
        this.resetBuildUp();
        Swal.fire({
          text: error.error.Message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }
  deleteBuildUpDetail(p) {
    this.AWBforDelete = p.AWBNo;
    this.BuildIDforDelete = p.BuildID;
    this.BuildUPDetailIDforDelete = p.BuildUPDetailID;
  }
  confirmDelete() {
    var data = this.requestBuildUpModel.BuildUpDetail.find(
      (c) => c.AWBNo == this.AWBforDelete
    );
    if (data != null) {
      if (
        this.BuildUPDetailIDforDelete == undefined ||
        this.BuildUPDetailIDforDelete == null ||
        this.BuildUPDetailIDforDelete == ""
      ) {
        var index = this.requestBuildUpModel.BuildUpDetail.findIndex(
          (c) => c.AWBNo == this.AWBforDelete
        );
        this.requestBuildUpModel.BuildUpDetail.splice(index, 1);
        this.BuildUPDetailIDforDelete = null;
        this.AWBforDelete = null;
        this.deleteModal["first"].nativeElement.click();
        Swal.fire({
          text: "Build UP Detail Deleted Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        let body = {
          BuildID: this.BuildIDforDelete,
          AWBNo: this.AWBforDelete,
          BuildUPDetailID: this.BuildUPDetailIDforDelete,
          ULDID: this.BuildUpForm.controls.ULDID.value,
        };
        this.API.PostData("/ULD/removeAWB", body).subscribe(
          (c) => {
            if (c != null) {
              var index = this.requestBuildUpModel.BuildUpDetail.findIndex(
                (c) => c.BuildUPDetailID == this.BuildUPDetailIDforDelete
              );
              this.requestBuildUpModel.BuildUpDetail.splice(index, 1);
              Swal.fire({
                text: "Build UP Detail Deleted Successfully",
                icon: "success",
                confirmButtonText: "OK",
              });
              this.BuildUPDetailIDforDelete = null;
              this.deleteModal["first"].nativeElement.click();
              this.BuildUPDetailIDforDelete = null;
              this.AWBforDelete = null;
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
    }
  }
  closeModal() {
    this.deleteModal["first"].nativeElement.click();
  }
  donePushingBuildUPDetail() {
    this.closeBuildUPDetailModal["first"].nativeElement.click();
    for (let i = 0; i < this.AWBList.length; i++) {
      if (this.AWBList[i].checked == true) {
        var checkedExisting = this.requestBuildUpModel.BuildUpDetail.find(
          (c) => c.acceptanceID == this.AWBList[i].acceptanceID
        );
        if (checkedExisting == null) {
          this.requestBuildUpModel.BuildUpDetail.push(this.AWBList[i]);
        }
      }
    }
  }
  splitShipmentChange(status, p) {
    if (status == true) {
      for (let i = 0; i < this.AWBList.length; i++) {
        if (p.acceptanceID == this.AWBList[i].acceptanceID) {
          this.AWBList[i].splitShipment = true;
          this.AWBList[i].isEnabled = true;
        }
      }
    } else {
      for (let i = 0; i < this.AWBList.length; i++) {
        if (p.acceptanceID == this.AWBList[i].acceptanceID) {
          this.AWBList[i].splitShipment = false;
          this.AWBList[i].isEnabled = false;
        }
      }
    }
  }
  piecesChanged(p, builduppieces) {
    if (builduppieces.value != null) {
      var index = this.AWBList.findIndex(
        (c) => c.acceptanceID == p.acceptanceID
      );
      if (this.AWBList[index].remPCS != 0) {
        if (Number(builduppieces.value) > p.remPCS) {
          Swal.fire({
            text: "Build UP Pieces exceeds Remaning Pieces",
            icon: "error",
            confirmButtonText: "OK",
          });

          var index = this.AWBList.findIndex(
            (c) => c.acceptanceID == p.acceptanceID
          );
          builduppieces.value = this.AWBList[index].remPCS;
          this.AWBList[index].remainingPieces = this.AWBList[index].remPCS;
          return;
        }
        var rempcs = this.AWBList[index].remPCS - Number(builduppieces.value);
        this.AWBList[index].builduppieces = builduppieces.value;
        this.AWBList[index].remainingPieces = rempcs;
      } else {
        if (Number(builduppieces.value) > p.Pieces) {
          Swal.fire({
            text: "Build UP Pieces exceeds AWB Pieces",
            icon: "error",
            confirmButtonText: "OK",
          });
          builduppieces.value = this.AWBList[index].remPCS;
          return;
        }

        var rempcs = p.Pieces - Number(builduppieces.value);
        var index = this.AWBList.findIndex(
          (c) => c.acceptanceID == p.acceptanceID
        );
      }
      this.AWBList[index].builduppieces = builduppieces.value;
      this.AWBList[index].remainingPieces = rempcs;
      var remWt = (this.AWBList[index].grossWeight / this.AWBList[index].Pieces) * this.AWBList[index].builduppieces;
      this.AWBList[index].buildupweight = remWt;
      this.AWBList[index].remainingWeight = this.AWBList[index].remWt - this.AWBList[index].buildupweight;
    }
  }
  weightChanged(p, buildweight, builduppieces) {
    if (buildweight.value != null && builduppieces.value != null) {
      var index = this.AWBList.findIndex(
        (c) => c.acceptanceID == p.acceptanceID
      );
      if (this.AWBList[index].grossWeight != null && this.AWBList[index].Pieces != null) {
          this.AWBList[index].remainingWeight = Math.round(this.AWBList[index].remWt - buildweight.value);
          this.AWBList[index].buildupweight = buildweight.value;
      }
    }
  }

  piecesChangedEdit() {
    if (
      this.PopupForm.controls.builduppieces.value != null ||
      this.PopupForm.controls.builduppieces.value != ""
    ) {
      if (this.remPCS != 0) {
        if (
          Number(this.PopupForm.controls.builduppieces.value) >
          Number(this.PopupForm.controls.RemPieces.value)
        ) {
          Swal.fire({
            text: "Build UP Pieces exceeds Remaning Pieces",
            icon: "error",
            confirmButtonText: "OK",
          });
          this.PopupForm.controls.builduppieces.setValue(this.remPCS);
          this.PopupForm.controls.RemPieces.patchValue(this.remPCS);
          return;
        }
        var rempcs =
          Number(this.PopupForm.controls.Pieces.value) -
          Number(this.PopupForm.controls.builduppieces.value);
        this.PopupForm.controls.RemPieces.setValue(rempcs);
      } else {
        if (
          Number(this.PopupForm.controls.builduppieces.value) >
          Number(this.PopupForm.controls.Pieces.value)
        ) {
          Swal.fire({
            text: "Build UP Pieces exceeds AWB Pieces",
            icon: "error",
            confirmButtonText: "OK",
          });
          this.PopupForm.controls.builduppieces.setValue(this.remPCS);
          this.PopupForm.controls.RemPieces.setValue(this.remPCS);
          return;
        }
        var rempcs =
          Number(this.PopupForm.controls.Pieces.value) -
          Number(this.PopupForm.controls.builduppieces.value);
        this.PopupForm.controls.RemPieces.setValue(rempcs);
      }
    }
  }
  weightChangedEdit() {
    if (
      this.PopupForm.controls.buildupweight.value != null &&
      this.PopupForm.controls.builduppieces.value != null
    ) {
      if (
        this.PopupForm.controls.grossWeight.value != null &&
        this.PopupForm.controls.Pieces.value != null
      ) {
        var remWeight =
          Number(this.PopupForm.controls.grossWeight.value) -
          this.PopupForm.controls.buildupweight.value;
        this.PopupForm.controls.remainingWeight.setValue(remWeight);
      }
    }
  }

  setFirstTime() {
    if (this.BuildUpForm.controls.ULDFW.value == "") {
      this.BuildUpForm.controls.FWDatetime.setValue("");
    } else
      this.BuildUpForm.controls.FWDatetime.setValue(
        this.datepipe.transform(this.date, "dd/MMM/yyyy HH:mm")
      );
  }
  setSecondTime() {
    if (this.BuildUpForm.controls.ULDSW.value == "") {
      this.BuildUpForm.controls.SWDatetime.setValue("");
    } else
      this.BuildUpForm.controls.SWDatetime.setValue(
        this.datepipe.transform(this.date, "dd/MMM/yyyy HH:mm")
      );
  }

  selectALLCheck(check) {
    for (let i = 0; i < this.AWBList.length; i++) {
      if (check == true) {
        if (
          this.AWBList[i].DNR == false ||
          this.AWBList[i].holdShipment == false
        ) {
          this.AWBList[i].checked = true;
        }
      } else {
        this.AWBList[i].checked = false;
      }
    }
  }

  getContourTypes() {
    this.API.getdata("/Setups/getContour").subscribe(
      (c) => {
        if (c != null) {
          this.contourTypeResponse = c;
          this.defaultContourType.contourID = 0;
          this.defaultContourType.ContourType = "Select Contour Type";
          this.contourTypeResponse.push(this.defaultContourType);
          this.BuildUpForm.controls.contourID.setValue(0);
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

  bulkCheck(check: boolean) {
    if (check == true) {
      this.BulkStatus = true;
      this.BuildUpForm.controls.Bulk.setValue(true);
      this.BuildUpForm.controls.Bulk.setValue(true);
    } else {
      this.BulkStatus = false;
      this.BuildUpForm.controls.ULDNo.setValue("");
    }
  }

  getDollyInfo() {
    if (this.BuildUpForm.controls.dollyName.value == "" || this.BuildUpForm.controls.dollyName.value == null) {
      return
    }
    else {
      this.API.getdata("/Setups/getDollyByDollyName?DollyName=" + this.BuildUpForm.controls.dollyName.value).subscribe(
        (c) => {
          if (c != null) {
            this.BuildUpForm.controls.DollyWT.setValue(c.dollyWeight);
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
  }



  // verifyBuildUPPieces() {
  //   if (this.PopupForm.controls.RemPieces.value != null || this.PopupForm.controls.RemPieces.value != "") {
  //     if (this.remPCS == 0) {
  //       this.remPCS = this.PopupForm.controls.RemPieces.value;
  //     }
  //     if (this.PopupForm.controls.builduppieces.value > this.remPCS) {
  //       this.PopupForm.controls.builduppieces.setValue(this.remPCS);
  //       Swal.fire({
  //         text: "Build UP Pieces exceeds Remaning Pieces",
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //       this.PopupForm.controls.builduppieces.setValue(this.remPCS);
  //       this.PopupForm.controls.RemPieces.setValue(0);
  //       return;
  //     }
  //     var remPCS = this.remPCS - this.PopupForm.controls.builduppieces.value;
  //     this.PopupForm.controls.RemPieces.setValue(remPCS);
  //   }
  //   else {
  //     if (this.PopupForm.controls.Pieces.value != null && this.PopupForm.controls.Pieces.value != "") {
  //       if (this.PopupForm.controls.builduppieces.value > this.PopupForm.controls.Pieces.value) {
  //         this.PopupForm.controls.builduppieces.setValue(this.PopupForm.controls.Pieces.value);
  //         Swal.fire({
  //           text: "Build UP Pieces exceeds AWB Pieces",
  //           icon: 'error',
  //           confirmButtonText: 'OK'
  //         });
  //         return;
  //       }
  //     }
  //   }
  // }
}
