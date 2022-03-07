import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { v4 as uuid } from 'uuid';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';

import { responseAirLines } from '../../AdminArea/Models/airLines';
import { responseFlight } from '../../Export/Flights/Model/flightsModel';
import { ULDResponseModel } from '../../ULD/ULD/Model';
import { ULDCombo, ULDTypeResponse } from '../../ULD/ULD/Model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { emailResponseModel, requestEmail } from '../../../email-module/Email-Module';
import { AWBList, FWBResponse, UWSResponseModel, requestManifestModel, ULDNoCombo, ULDReceiveDetail, ULDReceiveModel, getBuilds, ManfiestDetailModel, buildupModel, RCSResponse, NOTOCResponseModel, removeManifestDetailModel } from './ManifestModel';
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import { style } from '@angular/animations';

@Component({
  selector: 'app-manifest',
  templateUrl: './manifest.component.html',
  styleUrls: ['./manifest.component.css']
})
export class ManifestComponent implements OnInit {
  depDestination:string;
  showMAN: boolean = false;
  showFFM:boolean=false;
  showFWB:boolean=false;
  FlightDep: boolean = false;
  AWBNumber: any;
  AWBDetail: AWBList;
  @ViewChildren("buildModel") buildModel: ElementRef;
  @ViewChildren("deleteModal") deleteModal: ElementRef;
  bulkID: any;
  bulkIDforDelete: any;
  blnPieces: boolean = false;
  acceptanceID: any;
  remPCS: number = 0;
  @ViewChildren("closeBuildUPDetailModal") closeBuildUPDetailModal: ElementRef;
  AWBList: AWBList[];
  UldID: any;
  manifestDetailId: any;
  removeManifestDetailModel: removeManifestDetailModel;
  @ViewChild("fileUpload") fileUpload: ElementRef; files = [];
  emailResponseModel: emailResponseModel;
  requestEmail: requestEmail;
  EmailForm: FormGroup;
  FWBResponse: FWBResponse[];
  emailData: any;
  today = new Date();
  NOTOCResponseModel: NOTOCResponseModel;
  UWSResponseModel: UWSResponseModel;
  ULDId: any;
  ULDArr: buildupModel[];
  buildupModel: buildupModel[];
  ULDModel: buildupModel;
  public src: Blob;
  RCSResponse: RCSResponse;
  alwaysFalse: boolean = false;
  validTableForm: boolean = false;
  AirWayBills: getBuilds[];
  getDataByAWBNoResponse: getBuilds[];
  @ViewChildren('manifestModel') manifestModel: ElementRef;
  @ViewChildren('closeULDSModal') closeULDSModal: ElementRef;
  @ViewChildren('AirwayBillsModal') AirwayBillsModal: ElementRef;
  @ViewChildren('EmailTypeModal') EmailTypeModal: ElementRef;
  @ViewChildren('FWBModel') FWBModel: ElementRef;
  @ViewChildren('MANModel') MANModel: ElementRef;

  ManfiestDetailModel: ManfiestDetailModel;
  BuildsResponse: getBuilds[];
  manifestDetail: getBuilds;
  requestManifestModel: requestManifestModel;
  // employeeModel: employeeModel;
  editDetail: boolean = false;
  isAddMode: boolean = false;
  manifestFlightID: string;
  BuildUPDetailID: string;
  totalReceivedULD: any;
  validForm: boolean = false;
  validPopup: boolean = false;
  ULDTypeResponse: ULDTypeResponse[];
  ULDReceiveDetail: ULDReceiveDetail;
  ULDReceiveModel: ULDReceiveModel;
  ULDCombo: ULDCombo[];
  defaultAirline: responseAirLines;
  @ViewChildren('addULDModal') addULDModal: ElementRef;
  @ViewChildren('confirmDeleteULDModal') confirmDeleteULDModal: ElementRef;
  @ViewChildren('manifestPopUpModel') manifestPopUpModel: ElementRef;
  @ViewChildren('closeAddbyAWBNoModal') closeAddbyAWBNoModal: ElementRef;
  @ViewChildren('closeAddbyULDNoModal') closeAddbyULDNoModal: ElementRef;
  @ViewChildren('RCSPopUpModel') RCSPopUpModel: ElementRef;
  @ViewChildren('closeRCSDetail') closeRCSDetail: ElementRef;

  latestDate: any;
  uldreceiveDetailID: any;
  responseFlight: responseFlight[];
  defaultFlight: responseFlight;
  responseAirLines: responseAirLines[];
  ULDNoCombo: ULDNoCombo[];
  ULDResponseModel: ULDResponseModel;
  arrivalResponse: responseFlight[];
  userTable: FormGroup;
  mode: boolean;
  touchedRows: any;
  EmailFormModule: FormGroup;
  ManifestForm: FormGroup;
  ULDDetailForm: FormGroup;
  PopupForm: FormGroup;
  PopupFormBulk: FormGroup;
  NOTOCForm: FormGroup;
  UWSForm: FormGroup;
  SecondPopupForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showGrid: boolean = true;
  showNewSection: boolean = false;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  constructor(public API: ApiService, public GV: GvarService, private route: ActivatedRoute, public router: Router) {
    this.AWBDetail = new AWBList();
    this.AWBList = [];
    this.removeManifestDetailModel = new removeManifestDetailModel();
    this.emailResponseModel = new emailResponseModel();
    this.requestEmail = new requestEmail();
    this.FWBResponse = [];
    this.NOTOCResponseModel = new NOTOCResponseModel();
    this.UWSResponseModel = new UWSResponseModel();
    this.ULDModel = new buildupModel();
    this.ULDArr = [];
    this.buildupModel = [];
    this.RCSResponse = new RCSResponse();
    this.getDataByAWBNoResponse = [];
    this.AirWayBills = [];
    this.ManfiestDetailModel = new ManfiestDetailModel();
    this.manifestDetail = new getBuilds();
    this.BuildsResponse = [];
    this.requestManifestModel = new requestManifestModel();
    // this.employeeModel = new employeeModel();
    this.ULDTypeResponse = [];
    this.ULDReceiveDetail = new ULDReceiveDetail();
    this.ULDReceiveModel = new ULDReceiveModel();
    this.ULDNoCombo = [];
    this.responseAirLines = [];
    this.arrivalResponse = [];
    this.InitializeForm();
    this.ManifestForm.controls.isNew.setValue(true);
    this.ULDResponseModel = new ULDResponseModel();
    this.defaultAirline = new responseAirLines();
    this.defaultFlight = new responseFlight();

  }
  ngOnInit(): void {
    window.scroll(0,0);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      processing: true
    };
    this.showhide("New");
    this.getAirLines();
    this.ManifestForm.get('DateTable').patchValue(this.formatDate(new Date()));
    this.getAWBsforBuildup();
  }
  InitializeForm(): any {
    this.EmailFormModule = new FormGroup({
      ALCode: new FormControl(),
      ALName: new FormControl(),
      noticedetailID: new FormControl(),
      messageID: new FormControl(),
      emailID: new FormControl(),
      MessageType: new FormControl(),
      emailDetailID: new FormControl(),
      emailType: new FormControl(),
      airportID: new FormControl(),
      emailaddress: new FormControl(),
    });
    this.PopupFormBulk = new FormGroup({
      MasterAWBNo: new FormControl(""),
      Pieces: new FormControl(""),
      remainingPieces: new FormControl(""),
      RemPieces: new FormControl(""),
      remainingWeight: new FormControl(""),
      AWBNo: new FormControl(""),
      bulkPieces: new FormControl(""),
      grossWeight: new FormControl(""),
      splitShipment: new FormControl(""),
      Destination: new FormControl(""),
      AcceptanceRemarks: new FormControl(""),
      ExaminationRemarks: new FormControl(""),
      ScanningRemarks: new FormControl(""),
      bulkWeight: new FormControl(""),
      acceptanceID: new FormControl(""),
      comid: new FormControl(""),
    });

    this.SecondPopupForm = new FormGroup({
      SecordLine: new FormControl(""),
      firstLine: new FormControl(""),
      thirdLine: new FormControl(""),
      fourthLine: new FormControl(""),
    });
    this.UWSForm = new FormGroup({
      depFlightNo: new FormControl(""),
      aircraftTypeName: new FormControl(""),
      depDate: new FormControl(""),
      regNo: new FormControl(""),
      depDestination: new FormControl(""),
      Destination: new FormControl(""),
    });
    this.EmailForm = new FormGroup({
      email_sendTo: new FormControl(""),
      email_sendCC: new FormControl(""),
      email_sendBCC: new FormControl(""),
      email_from: new FormControl(""),
      email_Subject: new FormControl(""),
      email_Body: new FormControl(""),
      noticedetailID: new FormControl(),

      emailID: new FormControl(),
      MessageType: new FormControl(),
      emailDetailID: new FormControl(),
      emailType: new FormControl(),
      airportID: new FormControl(),
      emailaddress: new FormControl(),
    });
    this.ManifestForm = new FormGroup({
      ALCodeTable: new FormControl(""),
      FlightNoTable: new FormControl(""),
      DateTable: new FormControl(""),
      manifestID: new FormControl(""),
      ALCode: new FormControl(""),
      ALName: new FormControl(""),
      flightID: new FormControl(""),
      depFlightNo: new FormControl(""),
      regNo: new FormControl(""),
      STD: new FormControl(""),
      searchAWBNo: new FormControl(""),
      searchULDNo: new FormControl(""),
      aircraftType: new FormControl(""),
      isDepartured: new FormControl(""),
      QRTFlight: new FormControl(""),
      QRTLoading: new FormControl(""),
      loading: new FormControl(""),
      unLoading: new FormControl(""),
      isNew: new FormControl(""),
      uldreceiveDetailID: new FormControl(""),
      Manifest: new FormControl(""),
      aircraftRegNo: new FormControl(""),
    });
    this.NOTOCForm = new FormGroup({
      depFlightNo: new FormControl(""),
      depDate: new FormControl(""),
      regNo: new FormControl(""),
      EmployeeName: new FormControl(""),

    });
    this.PopupForm = new FormGroup({
      Pieces: new FormControl(""),
      depDestination: new FormControl(""),
      AWBWT: new FormControl(""),
      // isChecked: new FormControl(""),
      AWBNo: new FormControl(""),
      grossWeight: new FormControl(""),
      bulkWeight: new FormControl(""),
      physicallyChecked: new FormControl(""),
      ULDNo: new FormControl(""),
      ULDType: new FormControl(""),
      comm_description: new FormControl(""),
      // EDD: new FormControl(""),
      priority: new FormControl(""),
      ContourType: new FormControl(""),
      GDNo: new FormControl(""),
      // Scanning: new FormControl(""),
      QRTFlight: new FormControl(""),
      QRTULoadingPt: new FormControl(""),
      QRT: new FormControl(""),

    });
  }
  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
    }
    if (callfrm == "Cancel") {
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
    }
    if (callfrm == "Edit") {
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
    }
  }
  ngAfterOnInit() {
  }
  saveUserDetails() {
    console.log(this.userTable.value);
  }
  toggleTheme() {
    this.mode = !this.mode;
  }
  closeDeleteModal() {
    this.confirmDeleteULDModal["first"].nativeElement.click();
  }
  setDeleteULD(p) {

    this.uldreceiveDetailID = p.uldRequestDetailID;
  }
  confirmDeleteULDRequest() {

    for (let i = 0; i < this.ULDReceiveModel.ULDReceiveDetail.length; i++) {
      if (this.uldreceiveDetailID == this.ULDReceiveModel.ULDReceiveDetail[i].uldreceiveDetailID) {
        this.ULDReceiveModel.ULDReceiveDetail.splice(i, 1);
      }
    }
  }


  findIndexToUpdate(newItem) {
    return newItem.id === this;
  }
  validations() {
    if (this.ManifestForm.controls.ALCode.value == "" || this.ManifestForm.controls.ALCode.value == null) {
      Swal.fire({
        text: "Search valid flight info first!",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ManifestForm.controls.flightID.value == "" || this.ManifestForm.controls.flightID.value == null || this.ManifestForm.controls.flightID.value == "0") {
      Swal.fire({
        text: "Search valid flight info first!",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    // if (this.requestManifestModel.requestManifestDetails.length == 0 && this.requestManifestModel.bulkLoadRequestModel.length == 0) {
    //   Swal.fire({
    //     text: "Enter atleast 1 Manifest Detail",
    //     icon: 'error',
    //     confirmButtonText: 'OK'
    //   });
    //   this.validForm = false;
    //   return;
    // }
    this.validForm = true;
  }


  saveData(status: any) {
    // this.validations();
    // if (this.validForm == true) {
    //   if (status == "New") {
    //     this.requestManifestModel.requestManifest.isNew = true;
    //   }
    //   else {
    //     this.requestManifestModel.requestManifest.isNew = false;
    //   }
    //   this.requestManifestModel.requestManifest.manifestID = this.ManifestForm.controls.manifestID.value;
    //   this.requestManifestModel.requestManifest.ALCode = this.ManifestForm.controls.ALCode.value;
    //   this.requestManifestModel.requestManifest.flightID = this.ManifestForm.controls.flightID.value;
    //   this.requestManifestModel.requestManifest.STD = this.ManifestForm.controls.STD.value;
    //   this.API.PostData('/Manifest/saveManifest', this.requestManifestModel).subscribe(c => {
    //     if (c != null) {
    //       Swal.fire({
    //         text: "Manifest Saved Successfully",
    //         icon: 'success',
    //         confirmButtonText: 'OK'
    //       });
    //       this.ManifestForm.controls.isNew.setValue(false);
    //       this.ManifestForm.controls.manifestID.setValue(c.manifestID);
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
  }


  bindNewData(flightID: any) {
    if (flightID == "" || flightID == null) {
      return;
    }
    this.API.getdata('/Flights/getFlightData?flightID=' + flightID).subscribe(c => {
      if (c != null) {
        this.ManifestForm.controls.ALCode.setValue(c.ALCode);
        this.ManifestForm.controls.ALName.setValue(c.ALName);
        this.ManifestForm.controls.flightID.setValue(c.flightID);
        this.ManifestForm.controls.depFlightNo.setValue(c.depFlightNo);
        this.ManifestForm.controls.aircraftRegNo.setValue(c.regNo);
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
  cancelManifest() {
    this.ManifestForm.reset();
    this.requestManifestModel = new requestManifestModel();
    this.router.navigate(['/Export/ManifestInquiry/']);
  }
  getBuildupData(flightID: any) {
    if (flightID == "" || flightID == null) {
      return;
    }
    this.API.getdata('/Manifest/getBuildup?flightID=' + flightID).subscribe(c => {
      if (c != null) {
        this.requestManifestModel.requestManifestDetails = c;
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
  getULDs() {
    this.API.getdata('/Manifest/getULDs').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, true).then(destroyed => {
          this.buildupModel = c;
          this.dtTrigger.next();
          this.ULDArr.forEach((element) => {
            var checkdup = this.buildupModel.find(
              (x) => x.ULDID == element.ULDID
            );
            if (checkdup != null) {
              var index = this.buildupModel.findIndex(
                (x) => x.ULDID == element.ULDID
              );
              this.buildupModel.splice(index, 1);
            }
          });
        });
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
  editManifest(p) {
    this.PopupForm.reset(true);
    this.PopupForm.patchValue(p);
    this.BuildUPDetailID = p.BuildUPDetailID;
    this.editDetail = true;
  }

  PushManifestDetail() {
    // if (this.editDetail == true) {
    //   this.ManfiestDetailModel = this.requestManifestModel.requestManifestDetails.find(x => x.BuildUPDetailID == this.BuildUPDetailID);
    //   var Index = this.requestManifestModel.requestManifestDetails.findIndex(x => x.BuildUPDetailID == this.BuildUPDetailID);
    //   if (Index != null) {
    //     this.requestManifestModel.requestManifestDetails[Index].priority = this.PopupForm.controls.priority.value;
    //     this.requestManifestModel.requestManifestDetails[Index].GDNo = this.PopupForm.controls.GDNo.value;
    //     this.requestManifestModel.requestManifestDetails[Index].QRTFlight = this.PopupForm.controls.QRTFlight.value;
    //     this.requestManifestModel.requestManifestDetails[Index].QRTULoadingPt = this.PopupForm.controls.QRTULoadingPt.value;
    //     this.requestManifestModel.requestManifestDetails[Index].QRT = this.PopupForm.controls.QRT.value;
    //     //this.requestManifestModel.requestManifestDetails[Index].isChecked = this.PopupForm.controls.isChecked.value;
    //   }
    // }
    // this.manifestPopUpModel["first"].nativeElement.click();
    // this.editDetail = false;
  }

  closePopUp() {
    this.manifestModel["first"].nativeElement.click();
  }
  resetDetail() {
    this.PopupForm.reset(true);
    this.editDetail = false;
  }

  // getDataByAWBNo() {
  //   if (this.ManifestForm.controls.searchAWBNo.value.length != 11) {
  //     this.closeAddbyAWBNoModal["first"].nativeElement.click();
  //     Swal.fire({
  //       text: "AWB Number not correct",
  //       icon: 'error',
  //       confirmButtonText: 'OK'
  //     });
  //     return;
  //   }
  //   this.API.getdata('/Manifest/getBuildupByAWBNO?AwbNo=' + this.ManifestForm.controls.searchAWBNo.value).subscribe(c => {
  //     if (c != null) {
  //       this.getDataByAWBNoResponse = c;
  //       this.requestManifestModel.requestManifestDetails.forEach(element => {
  //         var checkdup = this.getDataByAWBNoResponse.find(c => c.acceptanceID == element.acceptanceID);
  //         if (checkdup != null) {
  //           var index = this.getDataByAWBNoResponse.findIndex(c => c.acceptanceID == element.acceptanceID);
  //           this.getDataByAWBNoResponse.splice(index, 1);
  //         }
  //       });
  //     }
  //   },
  //     error => {
  //       this.closeAddbyAWBNoModal["first"].nativeElement.click();
  //       Swal.fire({
  //         text: "AWB Number not correct",
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //       return;
  //     });
  // }

  // getDataByULDNo() {
  //   this.API.getdata('/Manifest/getBuildupByUldNO?ULDNo=' + this.ManifestForm.controls.searchULDNo.value).subscribe(c => {
  //     if (c != null) {
  //       this.getDataByAWBNoResponse = c;
  //       this.requestManifestModel.requestManifestDetails.forEach(element => {
  //         var checkdup = this.getDataByAWBNoResponse.find(c => c.acceptanceID == element.acceptanceID);
  //         if (checkdup != null) {
  //           var index = this.getDataByAWBNoResponse.findIndex(c => c.acceptanceID == element.acceptanceID);
  //           this.getDataByAWBNoResponse.splice(index, 1);
  //         }
  //       });
  //     }
  //   },
  //     error => {
  //       this.closeAddbyULDNoModal["first"].nativeElement.click();
  //       Swal.fire({
  //         text: "ULD Number not correct",
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //       return;
  //     });
  // }

  // addByAWBNoDetail(p) {
  //   for (let i = 0; i < this.requestManifestModel.requestManifestDetails.length; i++) {
  //     if (this.requestManifestModel.requestManifestDetails[i].AWBNo == p.AWBNo) {
  //       Swal.fire({
  //         text: "Manifest already present with selected AWB Number",
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //       return;
  //     }
  //   }
  //   this.requestManifestModel.requestManifestDetails.push(p);
  //   this.closeAddbyAWBNoModal["first"].nativeElement.click();
  // }
  // addByULDNoDetail(p) {
  //   for (let i = 0; i < this.requestManifestModel.requestManifestDetails.length; i++) {
  //     if (this.requestManifestModel.requestManifestDetails[i].AWBNo == p.AWBNo) {
  //       Swal.fire({
  //         text: "Manifest already present with selected AWB Number",
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //       return;
  //     }
  //   }
  //   this.requestManifestModel.requestManifestDetails.push(p);
  //   this.closeAddbyULDNoModal["first"].nativeElement.click();
  // }
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
        this.defaultAirline.ALCode = 0;
        this.defaultAirline.ALName = "Select Airline";
        this.responseAirLines.push(this.defaultAirline);
        this.ManifestForm.controls.ALCodeTable.setValue(0);
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
  validationsForSearch() {
    if (this.ManifestForm.controls.ALCodeTable.value == "" || this.ManifestForm.controls.ALCodeTable.value == null) {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validTableForm = false;
      return;
    }
    if (this.ManifestForm.controls.FlightNoTable.value == "" || this.ManifestForm.controls.FlightNoTable.value == null) {
      Swal.fire({
        text: "Enter Flight No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validTableForm = false;
      return;
    }
    if (this.ManifestForm.controls.DateTable.value == "" || this.ManifestForm.controls.DateTable.value == null) {
      Swal.fire({
        text: "Select Date",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validTableForm = false;
      return;
    }
    this.validTableForm = true;
  }
  disableAllForms() {
    // this.ManifestForm.disable();
    // this.PopupForm.disable();
  }
  getManifestDetail() {

    this.requestManifestModel.requestManifestDetails = [];
    this.requestManifestModel.bulkLoadRequestModel = [];
    this.ULDArr = [];
    this.validationsForSearch();
    if (this.validTableForm == true) {
      let body = {
        ALCode: this.ManifestForm.controls.ALCodeTable.value,
        depDate: this.ManifestForm.controls.DateTable.value,
        depFlightNo: this.ManifestForm.controls.FlightNoTable.value.trim(),
      }
      this.API.PostData('/Manifest/manifestViewModel', body).subscribe(c => {
        if (c != null) {
          this.ManifestForm.controls.manifestID.setValue("0");
          this.ManifestForm.controls.flightID.setValue("0");
          if (c.manifestResponseDetail.length == 0) {
            if (c.flightResponse.ALCode == null) {
              this.ManifestForm.patchValue(c.manifestResponse);
            }
            else {

              this.ManifestForm.patchValue(c.flightResponse);
              Swal.fire({
                text: "Flight Found! Add New",
                icon: 'success',
                confirmButtonText: 'OK'
              });
              return;
            }
          }
          if (c.flightResponse.ALCode == null) {
            this.ManifestForm.patchValue(c.manifestResponse);
          }
          else
            this.ManifestForm.patchValue(c.flightResponse);
          this.requestManifestModel.requestManifest = c.manifestResponse;
          if (this.requestManifestModel.requestManifest.isDep == true) {
            this.FlightDep = true;
            Swal.fire({
              text: 'Flight Departed!',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
          else {
            this.FlightDep = false;
          }
          this.requestManifestModel.requestManifestDetails = c.manifestResponseDetail;
          this.requestManifestModel.bulkLoadRequestModel = c.manifestBulkDetail;
          this.ManifestForm.controls.manifestID.setValue(c.manifestResponse.manifestID);
          this.requestManifestModel.requestManifest.manifestID = c.manifestResponse.manifestID;
          this.ULDArr = c.manifestResponseDetail;
          this.AirWayBills = [];
          if (this.ManifestForm.controls.isDepartured.value != null) {
            if (this.ManifestForm.controls.isDepartured.value == true) {
              this.disableAllForms();
            }
          }

          // if (c.manifestResponse.manifestID == null || c.manifestResponse.manifestID == 0) {
          //   this.isAddMode = false;
          //   this.ManifestForm.patchValue(c.flightResponse);
          //   for (let i = 0; i < this.responseAirLines.length; i++) {
          //     if (this.responseAirLines[i].ALCode == c.flightResponse.ALCode) {
          //       this.ManifestForm.controls.ALName.setValue(this.responseAirLines[i].ALName);
          //     }
          //   }
          //   this.ManifestForm.controls.depFlightNo.setValue(this.ManifestForm.controls.FlightNoTable.value);
          // }
          // else {
          //   this.isAddMode = true;
          //   this.ManifestForm.patchValue(c.manifestResponse);
          //   if (this.ManifestForm.controls.isDepartured.value != null) {
          //     if (this.ManifestForm.controls.isDepartured.value == true) {
          //       this.disableAllForms();
          //     }
          //   }
          //   for (let i = 0; i < this.responseAirLines.length; i++) {
          //     if (this.responseAirLines[i].ALCode == c.manifestResponse.ALCode) {
          //       this.ManifestForm.controls.ALName.setValue(this.responseAirLines[i].ALName);
          //     }
          //   }
          //   this.ManifestForm.controls.depFlightNo.setValue(this.ManifestForm.controls.FlightNoTable.value);
          // }
        }
      },
        error => {
          this.resetManifestForError();
          Swal.fire({
            text: error.error.Message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
  }

  resetManifestForError() {
    this.isAddMode = false;
    this.PopupForm.reset();
    this.ManifestForm.controls.isNew.setValue(true);
    this.requestManifestModel.requestManifestDetails = [];
    this.AirWayBills = [];
    this.ULDArr = [];
    this.showhide("New");
    this.requestManifestModel.requestManifestDetails = [];
  }

  resetManifest() {
    this.FlightDep = false;
    this.isAddMode = false;
    this.ManifestForm.reset();
    this.PopupForm.reset();
    this.ManifestForm.controls.isNew.setValue(true);
    this.requestManifestModel.requestManifestDetails = [];
    this.requestManifestModel.bulkLoadRequestModel = [];
    this.getAirLines();
    this.ManifestForm.get('DateTable').patchValue(this.formatDate(new Date()));
    this.AirWayBills = [];
    this.ULDArr = [];
    this.showhide("New");
    this.NOTOCResponseModel = new NOTOCResponseModel();
  }

  getRCSData(p) {
    this.API.getdata('/Acceptance/generateRCS?acceptanceID=' + p.acceptanceID).subscribe(c => {
      if (c != null) {
        this.RCSResponse = c;
        this.SecondPopupForm.patchValue(this.RCSResponse);
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
  saveRCSDetail() {
    this.RCSResponse.firstLine = this.SecondPopupForm.controls.firstLine.value;
    this.RCSResponse.SecordLine = this.SecondPopupForm.controls.SecordLine.value;
    this.RCSResponse.thirdLine = this.SecondPopupForm.controls.thirdLine.value;
    this.RCSResponse.fourthLine = this.SecondPopupForm.controls.fourthLine.value;

    this.API.PostData('/CargoMessages/sendRCS', this.RCSResponse).subscribe(c => {
      if (c != null) {
        this.SecondPopupForm.patchValue(c);
        Swal.fire({
          text: "Message sent successfully",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.RCSPopUpModel["first"].nativeElement.click();
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

  generateManifest() {
    if (this.ManifestForm.controls.manifestID.value == "") {
      Swal.fire({
        text: "Search Manifest First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.closeRCSDetail["first"].nativeElement.click();
      return;
    }
    let body = {
      manifestID: this.ManifestForm.controls.manifestID.value,
      UserName: localStorage.getItem('userName'),
      StationName: localStorage.getItem('StationName')

    }
    this.API.downloadFile('/Reports/genManifest', body).subscribe(data => {
      if (data != null) {
        this.src = data;
        // var w = window.open("", data);
        // w.document.write(data);

        // var dataDetail = new dataDetail();
        // dataDetail.src = "data:image/jpg;base64," + this.src.arrayBuffer;
        // var w = window.open("");
        // w.document.write(dataDetail.outerHTML);

        // var file = new Blob([data.blob()], { type: 'text/xml' });
        // var fileURL = window.URL.createObjectURL(file);
        // window.open(fileURL);
      }
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.closeRCSDetail["first"].nativeElement.click();
      });
  }

  QRTChecked(qrtChecked: boolean) {
    if (qrtChecked) {
      this.PopupForm.get("QRTFlight").enable();
      this.PopupForm.get("QRTULoadingPt").enable();
    }
    else {
      this.PopupForm.get("QRTFlight").reset();
      this.PopupForm.get("QRTULoadingPt").reset();
      this.PopupForm.get("QRTFlight").disable();
      this.PopupForm.get("QRTULoadingPt").disable();
    }
  }

  donePushingByAWB() {
    //   this.closeAddbyAWBNoModal["first"].nativeElement.click();
    //   for (let i = 0; i < this.getDataByAWBNoResponse.length; i++) {
    //     if (this.getDataByAWBNoResponse[i].checked == true) {
    //       var checkedExisting = this.requestManifestModel.requestManifestDetails.find(c => c.acceptanceID == this.getDataByAWBNoResponse[i].acceptanceID);
    //       if (checkedExisting == null) {
    //         this.requestManifestModel.requestManifestDetails.push(this.getDataByAWBNoResponse[i]);
    //       }
    //     }
    //   }
    // }
  }
  donePushingByULD() {
    //   this.closeAddbyULDNoModal["first"].nativeElement.click();
    //   for (let i = 0; i < this.getDataByAWBNoResponse.length; i++) {
    //     if (this.getDataByAWBNoResponse[i].checked == true) {
    //       var checkedExisting = this.requestManifestModel.requestManifestDetails.find(c => c.acceptanceID == this.getDataByAWBNoResponse[i].acceptanceID);
    //       if (checkedExisting == null) {
    //         this.requestManifestModel.requestManifestDetails.push(this.getDataByAWBNoResponse[i]);
    //       }
    //     }
  }
  selectALLCheckULD(check) {
    for (let i = 0; i < this.getDataByAWBNoResponse.length; i++) {
      if (check == true) {
        this.getDataByAWBNoResponse[i].checked = true;
      }
      else {
        this.getDataByAWBNoResponse[i].checked = false;
      }
    }
  }
  selectALLCheckAWB(check) {
    for (let i = 0; i < this.getDataByAWBNoResponse.length; i++) {
      if (check == true) {
        this.getDataByAWBNoResponse[i].checked = true;
      }
      else {
        this.getDataByAWBNoResponse[i].checked = false;
      }
    }
  }
  selectAllULD(check) {
    for (let i = 0; i < this.buildupModel.length; i++) {
      if (check == true) {
        {
          this.buildupModel[i].checked = true;
        }
      } else {
        this.buildupModel[i].checked = false;
      }
    }
  }

  pushULDs() {
    this.closeULDSModal['first'].nativeElement.click();
    for (let i = 0; i < this.buildupModel.length; i++) {
      if (this.buildupModel[i].checked == true) {
        this.ULDArr.push(this.buildupModel[i]);
        this.requestManifestModel.requestManifestDetails = this.ULDArr;
      }
    }
  }

  viewAirwayBills(p) {
    this.API.getdata('/Manifest/getBuildupByUldNO?uldreceiveDetailID=' + p.uldreceiveDetailID).subscribe(c => {
      if (c != null) {
        var button = document.getElementById("AirwayBills");
        button.click();
        this.AirWayBills = c;
      }
    },
      error => {
        this.closeULDSModal['first'].nativeElement.click();
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }

  editULDDetail(p) {
    this.PopupForm.reset(true);
    this.PopupForm.patchValue(p);
    this.ULDId = p.ULDID;
    this.editDetail = true;
  }

  saveULDDetail() {
    if (this.editDetail == true) {
      this.ULDModel = this.ULDArr.find(x => x.ULDID == this.ULDId);
      var Index = this.ULDArr.findIndex(x => x.ULDID == this.ULDId);
      if (Index != null) {
        this.ULDArr[Index].priority = this.PopupForm.controls.priority.value;
        this.ULDArr[Index].QRT = this.PopupForm.controls.QRT.value;
        this.ULDArr[Index].QRTFlight = this.PopupForm.controls.QRTFlight.value;
        this.ULDArr[Index].QRTULoadingPt = this.PopupForm.controls.QRTULoadingPt.value;
      }
    }
    this.manifestPopUpModel["first"].nativeElement.click();
    this.editDetail = false;
  }

  removeULDDetailNotConfirm(p) {
    this.UldID = p.ULDID;
    this.manifestDetailId = p.manifestDetailID;
    var data = this.ULDArr.find(
      (c) => c.ULDID == this.UldID
    );
    Swal.fire({
      text: 'Are you sure you want to remove ' + data.ULDNo + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove',

    }).then((result) => {
      if (result.isConfirmed) {
        this.removeULDDetailConfirm();
      }
    })
  }

  removeULDDetailConfirm() {
    var data = this.ULDArr.find(
      (c) => c.ULDID == this.UldID
    );
    if (data) {
      this.removeManifestDetailModel = data;
      if (this.manifestDetailId != null || this.manifestDetailId != undefined) {
        this.API.PostData('/Manifest/removeULD', this.removeManifestDetailModel).subscribe(c => {
          if (c != null) {
            Swal.fire({
              text: "Removed Successfully!",
              icon: 'success',
              confirmButtonText: 'OK'
            });
            var Index = this.ULDArr.findIndex(x => x.ULDID == this.UldID);
            this.ULDArr.splice(Index, 1);
            this.requestManifestModel.requestManifestDetails = this.ULDArr;
            this.removeManifestDetailModel = new removeManifestDetailModel();
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
      else {
        var Index = this.ULDArr.findIndex(x => x.ULDID == this.UldID);
        this.ULDArr.splice(Index, 1);
        this.requestManifestModel.requestManifestDetails = this.ULDArr;
        Swal.fire({
          text: "Removed Successfully!",
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    }
    else {
      Swal.fire({
        text: "ULD not found",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return
    }
  }

  saveManifest(status: any) {
    this.validations();
    if (this.validForm == true) {
      this.ManifestForm.controls.isNew.setValue(true);
      this.requestManifestModel.requestManifest.manifestID = this.ManifestForm.controls.manifestID.value;
      this.requestManifestModel.requestManifest.ALCode = this.ManifestForm.controls.ALCode.value;
      this.requestManifestModel.requestManifest.flightID = this.ManifestForm.controls.flightID.value;
      this.requestManifestModel.requestManifestDetails = this.ULDArr;
      this.API.PostData('/Manifest/saveManifest', this.requestManifestModel).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Manifest Saved Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.ManifestForm.controls.isNew.setValue(false);
          this.ManifestForm.controls.manifestID.setValue(c.manifestID);
          this.getManifestDetail();
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

  selectBuildUPULD(p) {
    this.closeULDSModal['first'].nativeElement.click();
    var ULDObj = this.buildupModel.find((x) => x.ULDID == p.ULDID);
    if (ULDObj != null) {
      this.ULDArr.push(ULDObj);
      this.requestManifestModel.requestManifestDetails = this.ULDArr;
      return;
    }
  }
  generateUWS() {
    if (this.ManifestForm.controls.flightID.value == "") {
      Swal.fire({
        text: "Search Manifest First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.API.getdata('/CargoMessages/generateUWS?flightID=' + this.ManifestForm.controls.flightID.value).subscribe(c => {
      if (c != null) {
        this.UWSResponseModel = c;
          this.UWSForm.controls.depFlightNo.setValue(this.UWSResponseModel.depFlightNo);

          this.UWSForm.controls.aircraftTypeName.setValue(this.UWSResponseModel.aircraftTypeName);
          this.UWSForm.controls.depDate.setValue(this.UWSResponseModel.depDate);
          this.UWSForm.controls.regNo.setValue(this.UWSResponseModel.regNo);
          this.UWSForm.controls.depDestination.setValue(this.UWSResponseModel.depDestination);

          this.UWSForm.controls.Destination.setValue("KHI");
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
  public convetToPDF() {
    var data = document.getElementById('contentToConvert');
    this.emailData = data;
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('new-file.pdf'); // Generated PDF
      var base64 = canvas.toDataURL();
      var markup = data.innerHTML;
      var encoded = window.btoa(unescape(encodeURIComponent(markup)));
      this.emailUWS(base64);

    });
  }
  print() {
    let printContents, popupWin;
    var divToPrint = document.getElementById('contentToConvert');
    var htmlToPrint = '' +
      '<style type="text/css">' +
      'table th, table td {' +
      'border:1px solid #000;' +
      'padding:0.5em;' +
      '}' +
      '</style>';
    htmlToPrint += divToPrint.outerHTML;
    popupWin = window.open("");
    popupWin.document.write(htmlToPrint);
    popupWin.print();
    popupWin.close()
  }
  printNOTOC() {
    let printContents, popupWin;
    var divToPrint = document.getElementById('printNOTOC');
    var htmlToPrint = '' +
      '<style type="text/css">' +
      'table th, table td {' +
      'border:1px solid #000;' +
      'padding:0.5em;' +
      '}' +
      '</style>';
    htmlToPrint += divToPrint.outerHTML;
    popupWin = window.open("");
    popupWin.document.write(htmlToPrint);
    popupWin.print();
    popupWin.close()
  }
  destroyDT = (tableIndex, clearData): Promise<boolean> => {
    return new Promise((resolve) => {
      if (this.datatableElement)
        this.datatableElement.forEach((dtElement: DataTableDirective, index) => {

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

              }
              else if (tableIndex == 1) {
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

              }
              else if (tableIndex == 3) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });

              }
              else if (tableIndex == 4) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });

              }
              else if (tableIndex == 5) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });

              }
              else if (tableIndex == 6) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });

              }
              else if (tableIndex == 7) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });

              }

            }
            else {
              resolve(true);
            }

          }
        });
    });
  };

  genereateNOTOC() {
    if (this.ManifestForm.controls.flightID.value == "") {
      Swal.fire({
        text: "Search Manifest First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.closeRCSDetail["first"].nativeElement.click();
      return;
    }
    this.API.getdata('/CargoMessages/generateNOTOC?flightID=' + this.ManifestForm.controls.flightID.value).subscribe(c => {
      if (c != null) {
        this.NOTOCResponseModel = c;
        if (this.NOTOCResponseModel.flightDetail != null) {
          this.depDestination=this.NOTOCResponseModel.flightDetail.depDestination;
          this.NOTOCForm.controls.depFlightNo.setValue(this.NOTOCResponseModel.flightDetail.depFlightNo);
          this.NOTOCForm.controls.depDate.setValue(this.NOTOCResponseModel.flightDetail.depDate);
          this.NOTOCForm.controls.regNo.setValue(this.NOTOCResponseModel.flightDetail.regNo);
          this.NOTOCForm.controls.EmployeeName.setValue(localStorage.getItem('userName'));
        }
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
  generateFWB() {

    if (this.ManifestForm.controls.flightID.value == "") {
      Swal.fire({
        text: "Search Manifest First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.FWBModel["first"].nativeElement.click();
      this.showFWB=false;
      return;
    }
    this.showFWB=true;
    this.API.getdata('/CargoMessages/generateFWB?flightID=' + this.ManifestForm.controls.flightID.value).subscribe(c => {
      if (c != null) {
        this.showFWB=true;
        this.EmailForm.controls.email_Body.setValue(c.messageDetail);
      }
    },
      error => {
        this.FWBModel["first"].nativeElement.click();
        this.showFWB=false;
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }


  emailUWS(data: any) {
    // this.emailResponseModel.emailDetailList = [];
    // this.EmailFormModule.controls.ALCode.setValue("19")
    // this.EmailFormModule.controls.messageID.setValue("3")
    // this.requestEmail.ALCode = this.EmailFormModule.controls.ALCode.value;
    // this.requestEmail.messageID = this.EmailFormModule.controls.messageID.value;
    let body = {
      SendTo: "sohail.ahmed@ras.com.pk",
      base64: data
    }
    this.API.PostData('/CargoMessages/SendEMailAttchment', body).subscribe(c => {
      if (c != null) {
        this.EmailTypeModal['first'].nativeElement.click();
        Swal.fire({
          text: "Email Sent Successfully",
          icon: 'success',
          confirmButtonText: 'OK'
        });
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
  deptFlight() {
    if (this.ManifestForm.controls.flightID.value == "") {
      Swal.fire({
        text: "Search Manifest First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.closeRCSDetail["first"].nativeElement.click();
      return;
    }
    if (this.ManifestForm.controls.manifestID.value == "") {
      Swal.fire({
        text: "Manifest not found.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.closeRCSDetail["first"].nativeElement.click();
      return;
    }
    let body = {
      manifestID: this.ManifestForm.controls.manifestID.value,
      flightID: this.ManifestForm.controls.flightID.value
    }
    this.API.PostData('/Manifest/DeptFlight', body).subscribe(c => {
      if (c != null) {
        this.EmailTypeModal['first'].nativeElement.click();
        Swal.fire({
          text: "Flight has been departed Successfully",
          icon: 'success',
          confirmButtonText: 'OK'
        });
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
  getAWBsforBuildup() {
    this.API.getdata("/ULD/getAWBsforBuildup").subscribe(
      (c) => {
        if (c != null) {
          this.destroyDT(1, true).then((destroyed) => {
            this.AWBList = c;
            this.AWBList.forEach((element) => {
              if (element.remainingPieces != null) {
                if (Number(element.remainingPieces) > 0) {
                  element.remPCS = element.remainingPieces;
                  element.bulkPieces = element.remainingPieces;
                  element.splitShipment = true;
                } else {
                  element.bulkPieces = element.Pieces;
                  element.remPCS = 0;
                }
              } else {
                element.bulkPieces = element.Pieces;
                element.remPCS = 0;
              }

              element.bulkWeight = element.grossWeight;
            });
            this.requestManifestModel.bulkLoadRequestModel.forEach((element) => {
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
            this.dtTrigger1.next();
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
  donePushingBuildUPDetail() {
    this.closeBuildUPDetailModal["first"].nativeElement.click();
    for (let i = 0; i < this.AWBList.length; i++) {
      if (this.AWBList[i].checked == true) {
        var checkedExisting = this.requestManifestModel.bulkLoadRequestModel.find(
          (c) => c.acceptanceID == this.AWBList[i].acceptanceID
        );
        if (checkedExisting == null) {
          this.requestManifestModel.bulkLoadRequestModel.push(this.AWBList[i]);
        }
      }
    }
  }
  piecesChanged(p, bulkPieces) {
    if (bulkPieces.value != null) {
      var index = this.AWBList.findIndex(
        (c) => c.acceptanceID == p.acceptanceID
      );
      if (this.AWBList[index].remPCS != 0) {
        if (Number(bulkPieces.value) > p.remPCS) {
          Swal.fire({
            text: "Bulk Pieces exceeds Remaning Pieces",
            icon: "error",
            confirmButtonText: "OK",
          });

          var index = this.AWBList.findIndex(
            (c) => c.acceptanceID == p.acceptanceID
          );
          bulkPieces.value = this.AWBList[index].remPCS;
          this.AWBList[index].remainingPieces = this.AWBList[index].remPCS;
          return;
        }
        var rempcs = this.AWBList[index].remPCS - Number(bulkPieces.value);
        this.AWBList[index].bulkPieces = bulkPieces.value;
        this.AWBList[index].remainingPieces = rempcs;
      } else {
        if (Number(bulkPieces.value) > p.Pieces) {
          Swal.fire({
            text: "Bulk Pieces exceeds AWB Pieces",
            icon: "error",
            confirmButtonText: "OK",
          });
          bulkPieces.value = this.AWBList[index].remPCS;
          return;
        }

        var rempcs = p.Pieces - Number(bulkPieces.value);
        var index = this.AWBList.findIndex(
          (c) => c.acceptanceID == p.acceptanceID
        );
        this.AWBList[index].bulkPieces = bulkPieces.value;
        this.AWBList[index].remainingPieces = rempcs;
      }
    }
  }
  weightChanged(p, buildweight, bulkPieces) {
    if (buildweight.value != null && bulkPieces.value != null) {
      var index = this.AWBList.findIndex(
        (c) => c.acceptanceID == p.acceptanceID
      );
      if (
        this.AWBList[index].grossWeight != null &&
        this.AWBList[index].Pieces != null
      ) {
        // var pcWeight = this.AWBList[index].grossWeight / this.AWBList[index].Pieces;
        if (p.remainingWeight > 0) {
          var remWeight = Number(p.remainingWeight) - buildweight.value;
          this.AWBList[index].remainingWeight = remWeight;
          this.AWBList[index].bulkWeight = buildweight.value;
        } else {
          var remWeight = Number(p.grossWeight) - buildweight.value;
          this.AWBList[index].remainingWeight = remWeight;
          this.AWBList[index].bulkWeight = buildweight.value;
        }
      }
    }
  }

  editBuildDetail(p) {
    this.PopupFormBulk.patchValue(p);
    this.PopupFormBulk.controls.RemPieces.patchValue(p.remainingPieces);
    if (this.PopupFormBulk.controls.RemPieces.value > 0) {
      this.remPCS = this.PopupFormBulk.controls.RemPieces.value;
      this.PopupFormBulk.controls.splitShipment.setValue(true);
    }
    this.acceptanceID = p.acceptanceID;
    this.BuildUPDetailID = p.BuildUPDetailID;
    this.editDetail = true;
    if (this.PopupFormBulk.controls.splitShipment.value == true) {
      this.blnPieces = true;
    }
    if (
      this.PopupFormBulk.controls.Pieces != null &&
      this.PopupFormBulk.controls.AWBPieces != null
    ) {
      var remainingPieces =
        this.PopupFormBulk.controls.AWBPieces.value -
        this.PopupFormBulk.controls.Pieces.value;
      this.PopupFormBulk.controls.RemPieces.patchValue(remainingPieces);
    }
  }
  deleteBuildUpDetailNotConfirm(p) {
    this.acceptanceID = p.acceptanceID;
    this.bulkID = p.bulkID;
    this.bulkIDforDelete = p.bulkID;
    this.AWBNumber = p.AWBNo;

    var data = this.requestManifestModel.bulkLoadRequestModel.find(
      (c) => c.AWBNo == p.AWBNo
    );

    Swal.fire({
      text: 'Are you sure you want to remove ' + data.AWBNo + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove',

    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteBuildUpDetailConfirm(p.bulkID,p.acceptanceID);
      }
    })

  }
  deleteBuildUpDetailConfirm(bulkID,acceptanceID) {
    var data = this.requestManifestModel.bulkLoadRequestModel.find(
      (c) => c.acceptanceID == this.acceptanceID
    );
    if (data != null) {
      if (this.bulkIDforDelete == undefined || this.bulkIDforDelete == null ||this.bulkIDforDelete == "") {
        var index = this.requestManifestModel.bulkLoadRequestModel.findIndex(
          (c) => c.acceptanceID == this.acceptanceID
        );
        this.requestManifestModel.bulkLoadRequestModel.splice(index, 1);
        this.bulkIDforDelete = null;
        this.acceptanceID = null;
        this.deleteModal["first"].nativeElement.click();
        Swal.fire({
          text: "Bulk Load Removed Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        let body = {
          bulkID: bulkID,
          acceptanceID: acceptanceID,
        };
        this.API.PostData("/Manifest/removeAWB", body).subscribe(
          (c) => {
            if (c != null) {
              var index = this.requestManifestModel.bulkLoadRequestModel.findIndex(
                (c) => c.bulkID == this.bulkIDforDelete
              );
              this.requestManifestModel.bulkLoadRequestModel.splice(index, 1);
              Swal.fire({
                text: "Bulk Load Removed Successfully",
                icon: "success",
                confirmButtonText: "OK",
              });
              this.deleteModal["first"].nativeElement.click();
              this.bulkID = null;
              this.acceptanceID = null;
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
  disableField(p) {
    this.blnPieces = p;
    if (this.blnPieces == false) {
      this.PopupFormBulk.controls.Pieces.setValue(
        this.PopupFormBulk.controls.AWBPieces.value
      );
      // this.PopupForm.controls.weight.setValue(this.PopupForm.controls.AWBWeight.value);
    }
  }
  piecesChangedEdit() {
    if (
      this.PopupFormBulk.controls.bulkPieces.value != null ||
      this.PopupFormBulk.controls.bulkPieces.value != ""
    ) {
      if (this.remPCS != 0) {
        if (
          Number(this.PopupFormBulk.controls.bulkPieces.value) >
          Number(this.PopupFormBulk.controls.RemPieces.value)
        ) {
          Swal.fire({
            text: "Bulk Pieces exceeds Remaning Pieces",
            icon: "error",
            confirmButtonText: "OK",
          });
          this.PopupFormBulk.controls.bulkPieces.setValue(this.remPCS);
          this.PopupFormBulk.controls.RemPieces.patchValue(this.remPCS);
          return;
        }
        var rempcs =
          Number(this.PopupFormBulk.controls.Pieces.value) -
          Number(this.PopupFormBulk.controls.bulkPieces.value);
        this.PopupFormBulk.controls.RemPieces.setValue(rempcs);
      } else {
        if (
          Number(this.PopupFormBulk.controls.bulkPieces.value) >
          Number(this.PopupFormBulk.controls.Pieces.value)
        ) {
          Swal.fire({
            text: "Bulk Pieces exceeds AWB Pieces",
            icon: "error",
            confirmButtonText: "OK",
          });
          this.PopupFormBulk.controls.bulkPieces.setValue(this.remPCS);
          this.PopupFormBulk.controls.RemPieces.setValue(this.remPCS);
          return;
        }
        var rempcs =
          Number(this.PopupFormBulk.controls.Pieces.value) -
          Number(this.PopupFormBulk.controls.bulkPieces.value);
        this.PopupFormBulk.controls.RemPieces.setValue(rempcs);
      }
    }
  }
  weightChangedEdit() {
    if (
      this.PopupFormBulk.controls.bulkWeight.value != null &&
      this.PopupFormBulk.controls.bulkPieces.value != null
    ) {
      if (
        this.PopupFormBulk.controls.grossWeight.value != null &&
        this.PopupFormBulk.controls.Pieces.value != null
      ) {
        var remWeight =
          Number(this.PopupFormBulk.controls.grossWeight.value) -
          this.PopupFormBulk.controls.bulkWeight.value;
        this.PopupFormBulk.controls.remainingWeight.setValue(remWeight);
      }
    }
  }
  closeModal() {
    this.deleteModal["first"].nativeElement.click();
  }

  PushAWBDetail() {
    this.validationsForPopup();
    if (this.validPopup == true) {
      if (this.editDetail == true) {
        this.AWBDetail = this.AWBList.find(
          (x) => x.bulkID == this.bulkID
        );
        var Index = this.requestManifestModel.bulkLoadRequestModel.findIndex(
          (x) => x.acceptanceID == this.acceptanceID
        );
        if (Index != null) {
          this.requestManifestModel.bulkLoadRequestModel[Index].AWBNo =
            this.PopupFormBulk.controls.AWBNo.value;
          this.requestManifestModel.bulkLoadRequestModel[Index].Pieces =
            this.PopupFormBulk.controls.Pieces.value;
          this.requestManifestModel.bulkLoadRequestModel[Index].bulkPieces =
            this.PopupFormBulk.controls.bulkPieces.value;
          this.requestManifestModel.bulkLoadRequestModel[Index].grossWeight =
            this.PopupFormBulk.controls.grossWeight.value;
          this.requestManifestModel.bulkLoadRequestModel[Index].splitShipment =
            this.PopupFormBulk.controls.splitShipment.value;
          this.requestManifestModel.bulkLoadRequestModel[Index].splitShipment =
            this.PopupFormBulk.controls.splitShipment.value;
          this.requestManifestModel.bulkLoadRequestModel[Index].remainingWeight =
            this.PopupFormBulk.controls.remainingWeight.value;
          this.requestManifestModel.bulkLoadRequestModel[Index].Destination =
            this.PopupFormBulk.controls.Destination.value;
          this.requestManifestModel.bulkLoadRequestModel[Index].bulkWeight =
            this.PopupFormBulk.controls.bulkWeight.value;
          this.requestManifestModel.bulkLoadRequestModel[Index].acceptanceID =
            this.PopupFormBulk.controls.acceptanceID.value;
          if (this.PopupFormBulk.controls.Pieces.value != "") {
            if (this.PopupFormBulk.controls.bulkPieces.value != "") {
              var remPieces =
                this.PopupFormBulk.controls.Pieces.value -
                this.PopupFormBulk.controls.bulkPieces.value;
              this.requestManifestModel.bulkLoadRequestModel[Index].remainingPieces =
                remPieces;
            }
          }
          this.bulkID = null;
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
      // for (let i = 0; i < this.requestManifestModel.bulkLoadRequestModel.length; i++) {
      //   if (this.PopupForm.controls.AWBNo.value == this.requestManifestModel.bulkLoadRequestModel[i].AWBNo) {
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
      for (let i = 0; i < this.requestManifestModel.bulkLoadRequestModel.length; i++) {
        TotalWeight = +(
          TotalWeight + this.requestManifestModel.bulkLoadRequestModel[i].bulkWeight
        );
      }
      // for (let i = 0; i < this.requestManifestModel.bulkLoadRequestModel.length; i++) {
      //   TotalAWBWeight = + (TotalAWBWeight + this.requestManifestModel.bulkLoadRequestModel[i].AWBWeight);
      // }
      // this.BuildUpForm.controls.AWBWT.setValue(TotalAWBWeight);
      this.buildModel["first"].nativeElement.click();
      this.editDetail = false;
    }
  }
  validationsForPopup() {
    if (
      this.PopupFormBulk.controls.AWBNo.value == "" ||
      this.PopupFormBulk.controls.AWBNo.value == null ||
      this.PopupFormBulk.controls.AWBNo.value == "-1"
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
  generateRCS() {
    if (this.ManifestForm.controls.flightID.value == "") {
      Swal.fire({
        text: "Search Manifest First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.closeRCSDetail["first"].nativeElement.click();
      return;
    }
    this.API.getdata('/CargoMessages/generateFWB?flightID=' + this.ManifestForm.controls.flightID.value).subscribe(c => {
      if (c != null) {

      }
    });
  }
  generateMAN() {
    if (this.ManifestForm.controls.manifestID.value == "") {
      Swal.fire({
        text: "Select Manifest.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showMAN = false;
      this.MANModel['first'].nativeElement.click();
      return;
    }
    if (this.requestManifestModel.requestManifestDetails.length == 0 && this.requestManifestModel.bulkLoadRequestModel.length==0) {
      Swal.fire({
        text: "Enter atleast 1 Manifest Detail.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showMAN = false;
      this.MANModel['first'].nativeElement.click();
      return;
    }
    this.showMAN = true;
    this.API.getdata('/CargoMessages/generateMAN?manifestID=' + this.ManifestForm.controls.manifestID.value).subscribe(c => {
      if (c != null) {
        this.emailData = "";
        this.emailData = c.messageDetail;
        this.EmailForm.controls.email_Body.setValue(this.emailData);
      }
    });
  }
  sendMAN() {

    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.ManifestForm.controls.manifestID.value,
      ALCode:this.ManifestForm.controls.ALCode.value,
      sendAgain: false,
    }
    this.API.PostData('/CargoMessages/sendMAN', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',

        }).then((result) => {
          if (result.isConfirmed) {
            this.ResendMAN();
          }
        })
      });

  }
  ResendMAN() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.ManifestForm.controls.manifestID.value,
      ALCode:this.ManifestForm.controls.ALCode.value,
      sendAgain: true,
    }
    this.API.PostData('/CargoMessages/sendMAN', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    });

  }
  generateFFM() {
    if (this.ManifestForm.controls.manifestID.value == "") {
      Swal.fire({
        text: "Select Manifest.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showFFM = false;
      this.MANModel['first'].nativeElement.click();
      return;
    }
    if (this.requestManifestModel.requestManifestDetails.length == 0 && this.requestManifestModel.bulkLoadRequestModel.length==0) {
      Swal.fire({
        text: "Enter atleast 1 Manifest Detail.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showFFM = false;
      this.MANModel['first'].nativeElement.click();
      return;
    }
    this.showFFM = true;
    this.API.getdata('/CargoMessages/generateFFM?manifestID=' + this.ManifestForm.controls.manifestID.value).subscribe(c => {
      if (c != null) {
        this.emailData = "";
        this.emailData = c.messageDetail;
        this.EmailForm.controls.email_Body.setValue(this.emailData);
      }
    });
  }
  sendFFM() {

    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.ManifestForm.controls.manifestID.value,
      ALCode:this.ManifestForm.controls.ALCode.value,
      sendAgain: false,
    }
    this.API.PostData('/CargoMessages/sendFFM', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',

        }).then((result) => {
          if (result.isConfirmed) {
            this.ResendFFM();
          }
        })
      });

  }
  ResendFFM() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.ManifestForm.controls.manifestID.value,
      ALCode:this.ManifestForm.controls.ALCode.value,
      sendAgain: true,
    }
    this.API.PostData('/CargoMessages/sendMAN', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    });

  }
  sendFWB() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.ManifestForm.controls.manifestID.value,
      ALCode:this.ManifestForm.controls.ALCode.value,
      sendAgain: false,
    }
    this.API.PostData('/CargoMessages/sendFWB', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',

        }).then((result) => {
          if (result.isConfirmed) {
            this.ResendFWB();
          }
        })
      });

  }
  ResendFWB() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.ManifestForm.controls.manifestID.value,
      ALCode:this.ManifestForm.controls.ALCode.value,
      sendAgain: true,
    }
    this.API.PostData('/CargoMessages/sendFWB', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    });

  }
}
