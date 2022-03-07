import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ULDReceiptModel, ULDNoCombo, attachmentResponse, flightRequest, flightResponse } from './ULDReceiptModel';
import { ApiService } from '../../../Services/API/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { responseAirLines } from '../../AdminArea/Models/airLines';
import { responseFlight } from '../../Export/Flights/Model/flightsModel'
import { ULDResponseModel, ULDData } from '../ULD/Model';
import { ULDCombo, ULDTypeResponse } from '../ULD/Model'
import { ULDReceiveModel, ULDReceiveDetail } from './ULDReceiptModel'
import { v4 as uuid } from 'uuid';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-uldreceipt',
  templateUrl: './uldreceipt.component.html',
  styleUrls: ['./uldreceipt.component.css']
})
export class ULDReceiptComponent implements OnInit {
  searchedFlight: boolean = false;
  flightResponse: flightResponse;
  flightRequest: flightRequest;
  UploadCount: any = [1];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions0: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();

  @ViewChild("fileUpload") fileUpload: ElementRef; files = [];
  pdfSrc: any;
  fileName: string = "Choose file...";
  showAtt: Boolean = false;
  addnewAtt: Boolean = false;
  attachForm: FormGroup;
  attachmentResponse: attachmentResponse[];

  uldNoForCompare: string = "";
  approvedByName: any = "";
  damageDetailText: any = "";
  UCMINstring: any;

  keyword = 'ULDNo';
  data: any;
  defaultULDNo: ULDCombo;
  defaultULDType: ULDTypeResponse;
  defaultFlight: responseFlight;
  defaultAirline: responseAirLines;
  editDetail: boolean = false;
  isAddMode: boolean;
  uldReceiveID: string;
  totalReceivedULD: any;
  validForm: boolean = false;
  validPopup: boolean = false;
  ULDTypeResponse: ULDTypeResponse[];
  ULDReceiveDetail: ULDReceiveDetail;
  ULDReceiveModel: ULDReceiveModel;
  ULDCombo: ULDCombo[];

  @ViewChildren('addULDModal') addULDModal: ElementRef;
  @ViewChildren('confirmDeleteULDModal') confirmDeleteULDModal: ElementRef;
  @ViewChildren('getUCMINDetail') getUCMINDetail: ElementRef;
  @ViewChildren('DamageDetailModal') DamageDetailModal: ElementRef;
  @ViewChildren('approvedByModal') approvedByModal: ElementRef;
  @ViewChildren('AttachmentsModal') AttachmentsModal: ElementRef;

  latestDate: any;
  compareULDNo: any;
  responseFlight: responseFlight[];
  ALCode: string;
  responseAirLines: responseAirLines[];
  ULDNoCombo: ULDNoCombo[];
  ULDResponseModel: ULDResponseModel;
  arrivalResponse: responseFlight[];
  userTable: FormGroup;
  mode: boolean;
  touchedRows: any;

  ULDForm: FormGroup;
  SearchForm: FormGroup;
  ULDDetailForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showGrid: boolean = true;
  showNewSection: boolean = false;
  constructor(public API: ApiService, public GV: GvarService, private route: ActivatedRoute, private router: Router) {
    this.attachmentResponse = [];
    this.defaultULDNo = new ULDCombo();
    this.defaultULDType = new ULDTypeResponse();
    this.defaultAirline = new responseAirLines();
    this.defaultFlight = new responseFlight;
    this.ULDTypeResponse = [];
    this.ULDReceiveDetail = new ULDReceiveDetail();
    this.ULDReceiveModel = new ULDReceiveModel();
    this.ULDNoCombo = [];
    this.responseAirLines = [];
    this.arrivalResponse = [];
    this.InitializeForm();
    this.InitializeDetailForm();
    this.ULDForm.controls.isNew.setValue(true);
    this.ULDResponseModel = new ULDResponseModel();
    this.flightRequest = new flightRequest();
    this.flightResponse = new flightResponse();

  }
  ngOnInit(): void {
    window.scroll(0, 0);
    this.getAirLines();
    this.getULDTypes();
    this.ULDDetailForm.controls.isNew.setValue(true);
    this.uldReceiveID = this.route.snapshot.params['id'];
    this.isAddMode = !this.uldReceiveID;
    if (!this.isAddMode) {
      this.editData(this.uldReceiveID);
    }
    this.SearchForm.get('arrivalDate').patchValue(this.formatDate(new Date()));
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
  InitializeDetailForm(): any {
    this.ULDDetailForm = new FormGroup({
      uldreceiveDetailID: new FormControl(""),
      uldReceiveID: new FormControl(""),
      ULDTypeID: new FormControl(""),
      ULDNo: new FormControl(""),
      ULDID: new FormControl(""),
      taraWeight: new FormControl(""),
      status: new FormControl(""),
      serviceAbility: new FormControl(""),
      maxGrossWeight: new FormControl(""),
      ULDType: new FormControl(""),
      isNew: new FormControl(""),
      isDamage: new FormControl(""),
      damageDetail: new FormControl(""),
      readyForBuildup: new FormControl(""),
      approvedBy: new FormControl(""),
    });

    this.attachForm = new FormGroup({
      atttypeID: new FormControl(""),
      attType: new FormControl(""),
    })
  }
  InitializeForm(): any {
    this.ULDForm = new FormGroup({
      uldReceiveID: new FormControl(""),
      destination: new FormControl(""),
      ULDID: new FormControl(""),
      ALCode: new FormControl(""),
      ULDTypesID: new FormControl(""),
      ULDType: new FormControl(""),
      ULDNo: new FormControl(""),
      remarks: new FormControl(""),
      maxGrossWeight: new FormControl(""),
      status: new FormControl(""),
      serviceAbility: new FormControl(""),
      isNew: new FormControl(""),
      regNo: new FormControl(""),
      arrivalDate: new FormControl(""),
      arrivalTime: new FormControl(""),
      Destination: new FormControl(""),
      flightID: new FormControl(""),
      aricraftRegNo: new FormControl(""),
      ALName: new FormControl(""),
    });

    this.SearchForm = new FormGroup({
      arrivalDate: new FormControl(""),
      arrivalFlightNo: new FormControl(""),
    });
  }
  ngAfterOnInit() {
  }

  getULDRecieveDetail() {
    if (this.SearchForm.controls.arrivalFlightNo.value == "" || this.SearchForm.controls.arrivalFlightNo.value == null) {
      Swal.fire({
        text: "Enter Flight No",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.SearchForm.controls.arrivalDate.value == "" || this.SearchForm.controls.arrivalDate.value == null) {
      Swal.fire({
        text: "Select Date",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.flightRequest = this.SearchForm.value;
    this.API.PostData('/Generic/getFlightDetail', this.flightRequest).subscribe(c => {
      if (c != null) {
        debugger
        this.searchedFlight = true;
        this.flightResponse = c;
        this.ULDForm.controls.ALCode.setValue(this.flightResponse.ALCode);
        this.ULDForm.controls.ALName.setValue(this.flightResponse.ALName);
        this.ULDForm.controls.destination.setValue(this.flightResponse.Destination);
        this.ULDForm.controls.flightID.setValue(this.flightResponse.flightID);
        this.ULDForm.controls.aricraftRegNo.setValue(this.flightResponse.regNo);
        Swal.fire({
          text: "Flight found.",
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
  clearTextarea() {
    $('#UCMIN').val('');
    debugger
    if (this.searchedFlight == false) {
      Swal.fire({
        text: "Search flight first!",
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
    else {
      var button = document.getElementById("ucminPopup");
      button.click();
    }
  }
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
        this.defaultAirline.ALCode = 0;
        this.defaultAirline.ALName = "Select Airline";
        this.responseAirLines.push(this.defaultAirline);
        this.ULDForm.controls.ALCode.setValue(0);
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
  getULDTypes() {
    this.API.getdata('/ULD/getULDTypesByAirLine').subscribe(c => {
      if (c != null) {
        this.ULDTypeResponse = c;
        this.defaultULDType.ULDTypeID = 0;
        this.defaultULDType.ULDType = "Select ULD Type";
        this.ULDTypeResponse.push(this.defaultULDType);
        this.ULDDetailForm.controls.ULDTypeID.setValue(0);
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
  saveUserDetails() {
    console.log(this.userTable.value);
  }
  toggleTheme() {
    this.mode = !this.mode;
  }
  getFlights() {
    if (this.ULDForm.controls.ALCode.value != undefined && this.ULDForm.controls.ALCode.value != null) {
      this.API.getdata('/Flights/getArrivalFlightsByAriline?ALCode=' + this.ULDForm.controls.ALCode.value).subscribe(c => {
        if (c != null) {
          this.arrivalResponse = c;
          this.defaultFlight.flightID = "0";
          this.defaultFlight.arrivalFlightNo = "Select Flight";
          this.arrivalResponse.push(this.defaultFlight);
          this.ULDForm.controls.flightID.setValue("0");
          if (!this.isAddMode) {
            this.ULDForm.controls.flightID.patchValue(this.ULDReceiveModel.requestULDReceive.flightID);
            this.getFlightDetail();
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
  }
  getFlightDetail() {
    var flightDetail = this.arrivalResponse.find(x => x.flightID == this.ULDForm.controls.flightID.value);
    if (flightDetail != undefined) {
      this.ULDForm.controls.aricraftRegNo.setValue(flightDetail.regNo);
      var dateString = flightDetail.arrivalDate;
      dateString = new Date(dateString).toUTCString();
      dateString = dateString.split(' ').slice(1, 4).join(' ');
      this.ULDForm.controls.arrivalDate.setValue(dateString);

      this.ULDForm.controls.arrivalTime.setValue(flightDetail.arrivalTime);
      this.ULDForm.controls.Destination.setValue(flightDetail.Destination);
    }
  }
  getULDComboData() {

    if (this.ULDForm.controls.ALCode.value != undefined && this.ULDForm.controls.ALCode.value != null) {
      this.API.getdata('/Flights/getArrivalFlightsByAriline?ALCode=' + this.ULDForm.controls.ALCode.value).subscribe(c => {
        if (c != null) {
          this.arrivalResponse = c;
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
  closeDeleteModal() {
    this.confirmDeleteULDModal["first"].nativeElement.click();
  }
  setDeleteULD(p) {
    this.compareULDNo = p.ULDNo;
  }
  confirmDeleteULD() {
    var index = this.ULDReceiveModel.ULDReceiveDetail.findIndex(c => c.ULDNo == this.compareULDNo);
    this.ULDReceiveModel.ULDReceiveDetail.splice(index, 1);
    this.compareULDNo = "";
  }
  closePopUp() {
    this.addULDModal["first"].nativeElement.click();
  }
  validationsForPopup() {

    if (this.ULDDetailForm.controls.ULDTypeID.value == "" || this.ULDDetailForm.controls.ULDTypeID.value == null) {
      Swal.fire({
        text: "Select ULD Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validPopup = false;
      return;
    }

    if (this.ULDDetailForm.controls.ULDID.value == "" || this.ULDDetailForm.controls.ULDID.value == null || this.ULDDetailForm.controls.ULDID.value == "0") {
      Swal.fire({
        text: "Select ULD No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validPopup = false;
      return;
    }
    if (this.ULDDetailForm.controls.isDamage.value == true) {
      if (this.ULDDetailForm.controls.damageDetail.value == "" || this.ULDDetailForm.controls.damageDetail.value == null) {
        Swal.fire({
          text: "Enter Damage Detail",
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.validPopup = false;
        return;
      }
    }
    if (this.ULDDetailForm.controls.readyForBuildup.value == true) {
      if (this.ULDDetailForm.controls.approvedBy.value == "" || this.ULDDetailForm.controls.approvedBy.value == null) {
        Swal.fire({
          text: "Enter Approved By",
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.validPopup = false;
        return;
      }
    }
    this.validPopup = true;
  }

  findIndexToUpdate(newItem) {
    return newItem.id === this;
  }
  pushULD() {
    this.validationsForPopup();
    if (this.validPopup == true) {
      if (this.editDetail == true) {
        let updateItem = this.ULDReceiveModel.ULDReceiveDetail.find(this.findIndexToUpdate, this.ULDReceiveDetail.uldReceiveID);
        this.ULDReceiveDetail = new ULDReceiveDetail();
        this.ULDReceiveDetail.ULDTypeID = this.ULDDetailForm.controls.ULDTypeID.value;
        this.ULDReceiveDetail.ULDID = this.ULDDetailForm.controls.ULDID.value;

        this.ULDReceiveDetail.isDamage = this.ULDDetailForm.controls.isDamage.value;
        this.ULDReceiveDetail.damageDetail = this.ULDDetailForm.controls.damageDetail.value;
        this.ULDReceiveDetail.approvedBy = this.ULDDetailForm.controls.approvedBy.value;
        this.ULDReceiveDetail.readyForBuildup = this.ULDDetailForm.controls.readyForBuildup.value;

        var ULDNo = this.ULDCombo.find(x => x.ULDID == this.ULDDetailForm.controls.ULDID.value);
        this.ULDReceiveDetail.ULDNo = ULDNo.ULDNo;
        var ULDDetail = this.ULDTypeResponse.find(x => x.ULDTypeID == this.ULDDetailForm.controls.ULDTypeID.value);
        this.ULDReceiveDetail.ULDType = ULDDetail.ULDType;
        let index = this.ULDReceiveModel.ULDReceiveDetail.indexOf(updateItem);
        this.ULDReceiveModel.ULDReceiveDetail[index] = this.ULDReceiveDetail;
        this.editDetail = false;
      }
      else {
        this.ULDReceiveDetail = new ULDReceiveDetail();
        this.ULDReceiveDetail.ULDTypeID = this.ULDDetailForm.controls.ULDTypeID.value;
        this.ULDReceiveDetail.ULDID = this.ULDDetailForm.controls.ULDID.value;

        this.ULDReceiveDetail.isDamage = this.ULDDetailForm.controls.isDamage.value;
        this.ULDReceiveDetail.damageDetail = this.ULDDetailForm.controls.damageDetail.value;
        this.ULDReceiveDetail.approvedBy = this.ULDDetailForm.controls.approvedBy.value;
        this.ULDReceiveDetail.readyForBuildup = this.ULDDetailForm.controls.readyForBuildup.value;

        var ULDNo = this.ULDCombo.find(x => x.ULDID == this.ULDDetailForm.controls.ULDID.value);
        this.ULDReceiveDetail.ULDNo = ULDNo.ULDNo;
        var ULDDetail = this.ULDTypeResponse.find(x => x.ULDTypeID == this.ULDDetailForm.controls.ULDTypeID.value);
        this.ULDReceiveDetail.ULDType = ULDDetail.ULDType;
        this.ULDReceiveDetail.uldReceiveID = uuid();
        this.ULDReceiveModel.ULDReceiveDetail.push(this.ULDReceiveDetail);
      }
      this.addULDModal["first"].nativeElement.click();
    }
  }
  getULDDetails(ULDID: number) {
    var ULDDetail = this.ULDCombo.find(x => x.ULDID == this.ULDDetailForm.controls.ULDID.value);
    if (ULDDetail != undefined) {
      this.ULDDetailForm.controls.taraWeight.setValue(ULDDetail.taraWeight);
      this.ULDDetailForm.controls.maxGrossWeight.setValue(ULDDetail.maxGrossWeight);
      this.ULDDetailForm.controls.status.setValue(ULDDetail.status);
      this.ULDDetailForm.controls.serviceAbility.setValue(ULDDetail.serviceAbility);
      this.ULDDetailForm.controls.serviceAbility.setValue(ULDDetail.serviceAbility);
    }
  }
  resetDetail() {
    this.ULDDetailForm.reset(true);
    this.ULDDetailForm.controls.damageDetail.disable();
    this.ULDDetailForm.controls.approvedBy.disable();
  }
  getULDs(uldTypeID: any) {
    this.ULDDetailForm.controls.ULDTypeID.setValue(uldTypeID);
    uldTypeID = +uldTypeID;
    this.API.getdata('/ULD/getULDCombo?ULDTypeID=' + uldTypeID).subscribe(c => {
      if (c != null) {
        this.ULDCombo = c;
        for (let i = 0; i < this.ULDCombo.length; i++) {
          for (let j = 0; j < this.ULDReceiveModel.ULDReceiveDetail.length; j++) {
            if (this.ULDCombo[i].ULDType == this.ULDReceiveModel.ULDReceiveDetail[j].ULDType &&
              this.ULDCombo[i].ULDNo == this.ULDReceiveModel.ULDReceiveDetail[j].ULDNo) {
              this.ULDCombo.splice(i, 1);
            }
          }
        }

        // this.defaultULDNo.ULDID = 0;
        // this.defaultULDNo.ULDNo = "Select ULD No.";
        // this.ULDCombo.push(this.defaultULDNo);
        // this.ULDDetailForm.controls.ULDID.setValue(0);
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
  saveData() {
    this.validations();
    if (this.validForm == true) {
      this.ULDReceiveModel.requestULDReceive.uldReceiveID = this.ULDForm.controls.uldReceiveID.value;
      this.ULDReceiveModel.requestULDReceive.ALCode = this.ULDForm.controls.ALCode.value;
      this.ULDReceiveModel.requestULDReceive.flightID = this.ULDForm.controls.flightID.value;
      this.ULDReceiveModel.requestULDReceive.destination = this.ULDForm.controls.destination.value;
      this.ULDReceiveModel.requestULDReceive.remarks = this.ULDForm.controls.remarks.value;
      this.ULDReceiveModel.requestULDReceive.isNew = this.ULDForm.controls.isNew.value;
      this.API.PostData('/ULD/saveULDReceipt', this.ULDReceiveModel).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "ULD Received successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.ULDForm.controls.isNew.setValue(false);
          this.ULDForm.controls.uldReceiveID.setValue(c.uldReceiptID);
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

    if (this.ULDForm.controls.flightID.value == "" || this.ULDForm.controls.flightID.value == null) {
      Swal.fire({
        text: "Select Flight",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ULDReceiveModel.ULDReceiveDetail.length == 0) {
      Swal.fire({
        text: "Receive ULD (At least 1)",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    for (let i = 0; i < this.ULDReceiveModel.ULDReceiveDetail.length; i++) {
      if (this.ULDReceiveModel.ULDReceiveDetail[i].taraWeight == null ||
        this.ULDReceiveModel.ULDReceiveDetail[i].taraWeight == "" ||
        this.ULDReceiveModel.ULDReceiveDetail[i].taraWeight == undefined) {
        Swal.fire({
          text: "Each ULD Recieved must have Tare Weight",
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.validForm = false;
        return;
      }
    }
    this.validForm = true;
  }
  editULDRequest(p) {
    this.ULDDetailForm.patchValue(p);
    var ULDDetail = this.ULDReceiveModel.ULDReceiveDetail.find(c => c.ULDNo == p.ULDNo);
    if (ULDDetail != null) {
      this.ULDDetailForm.controls.ULDTypeID.patchValue(ULDDetail.ULDTypeID);
      this.ULDDetailForm.controls.ULDNo.patchValue(ULDDetail.ULDNo);
    }
    this.ULDDetailForm.controls.isNew.setValue(false);
    this.editDetail = true;
  }
  editData(uldReceiveID: string) {
    if (uldReceiveID == "" || uldReceiveID == null) {
      return;
    }
    this.API.getdata('/ULD/getULDReceive?uldReceiveID=' + uldReceiveID).subscribe(c => {
      if (c != null) {
        this.ULDReceiveModel.requestULDReceive = c.ULDReceiveResponse;
        this.ULDForm.patchValue(this.ULDReceiveModel.requestULDReceive);
        this.getFlights();
        c.ULDReceiveResponse.arrivalDate = c.ULDReceiveResponse.arrivalDate.substring(0, c.ULDReceiveResponse.arrivalDate.length - 9);
        this.ULDForm.controls.arrivalDate.setValue(c.ULDReceiveResponse.arrivalDate);
        this.ULDForm.controls.aricraftRegNo.setValue(c.ULDReceiveResponse.regNo);
        this.ULDForm.controls.Destination.setValue(c.ULDReceiveResponse.destination);
        this.destroyDT(0, false).then(destroyed => {
          this.ULDReceiveModel.ULDReceiveDetail = c.ULDResponseDetail;
          this.dtTrigger0.next();
        });
        this.ULDForm.controls.flightID.patchValue(this.ULDReceiveModel.requestULDReceive.flightID);
        this.ULDForm.controls.isNew.setValue(false);
        var flightDetail = this.arrivalResponse.find(x => x.flightID == this.ULDForm.controls.flightID.value);
        if (flightDetail != undefined) {
          this.ULDForm.controls.aricraftRegNo.setValue(flightDetail.regNo);
          var dateString = flightDetail.arrivalDate;
          dateString = new Date(dateString).toUTCString();
          dateString = dateString.split(' ').slice(1, 4).join(' ');
          this.ULDForm.controls.arrivalDate.setValue(dateString);
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
  destroyDT = (tableIndex, clearData): Promise<boolean> => {
    return new Promise((resolve) => {
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
          }
          else {
            resolve(true);
          }

        }
      });
    });
  };
  rerender(tableIndex): void {
    this.datatableElement.forEach((dtElement: DataTableDirective, index) => {
      if (index == tableIndex) {
        if (dtElement.dtInstance) {
          if (tableIndex == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              this.dtTrigger0.next();
            });

          }
        }
      }
    });
  }
  resetData() {
    this.ULDDetailForm.reset();
    this.ULDForm.reset();
    this.ULDReceiveModel = new ULDReceiveModel();
    this.getAirLines();
    this.ULDForm.controls.isNew.setValue(true);
    this.searchedFlight = false;
    this.SearchForm.reset();
    this.SearchForm.get('arrivalDate').patchValue(this.formatDate(new Date()));
  }
  cancelData() {
    this.router.navigate(['/ULD/ULDReceiveInquiry']);
  }

  isDamagedULD(isDamage: boolean) {
    if (isDamage) {
      this.ULDDetailForm.get("damageDetail").enable();
    }
    else {
      this.ULDDetailForm.get("damageDetail").reset();
      this.ULDDetailForm.get("damageDetail").disable();
    }
  }
  canBeUsedForBuildUP(status) {
    if (status) {
      this.ULDDetailForm.get("approvedBy").enable();
    }
    else {
      this.ULDDetailForm.get("approvedBy").reset();
      this.ULDDetailForm.get("approvedBy").disable();
    }
  }
  selectEvent(item) {
    this.ULDDetailForm.controls.ULDID.setValue(item.ULDID);
    this.getULDDetails(item.ULDID);
    // do something with selected item
  }
  searchCleared() {
    console.log('searchCleared');
    this.data = [];
  }
  onChangeSearch(val: string) {
    var ULDNoforcompare = val.toUpperCase();
    for (let i = 0; i < this.ULDCombo.length; i++) {
      if (this.ULDCombo[i].ULDNo == ULDNoforcompare) {
        var uldDetail = this.ULDCombo.find(x => x.ULDNo == ULDNoforcompare);
        this.ULDDetailForm.controls.ULDID.setValue(+uldDetail.ULDID);
        this.getULDDetails(+uldDetail.ULDID);
        break;
      }
      else {
        this.ULDDetailForm.controls.taraWeight.setValue("");
        this.ULDDetailForm.controls.maxGrossWeight.setValue("");
        this.ULDDetailForm.controls.status.setValue("");
        this.ULDDetailForm.controls.serviceAbility.setValue("");
      }
    }
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }

  tareWeightChange(p, TareWeight) {
    var index = this.ULDReceiveModel.ULDReceiveDetail.findIndex(c => c.ULDNo == p.ULDNo);
    this.ULDReceiveModel.ULDReceiveDetail[index].taraWeight = TareWeight.value;
  }

  getUCMIN() {
    this.UCMINstring = document.getElementById('UCMIN');
    this.API.getdata('/ULD/CPMIN?CPMIN=' + this.UCMINstring.value).subscribe(c => {
      if (c != null) {
        for (let i = 0; i < c.length; i++) {
          this.ULDReceiveModel.ULDReceiveDetail.push(c[i]);
        }
        this.getUCMINDetail["first"].nativeElement.click();
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

  enterDamageDetail(p, checkboxDamage) {
    if (checkboxDamage == true) {
      this.uldNoForCompare = p.ULDNo;
      var button = document.getElementById("detailsPopup");
      button.click();
      $('#damageDetailtext').val('');
      var index = this.ULDReceiveModel.ULDReceiveDetail.findIndex(c => c.ULDNo == p.ULDNo);
      this.ULDReceiveModel.ULDReceiveDetail[index].isDamage = true;
    }
    else {
      var index = this.ULDReceiveModel.ULDReceiveDetail.findIndex(c => c.ULDNo == p.ULDNo);
      this.ULDReceiveModel.ULDReceiveDetail[index].damageDetail = "";
      this.DamageDetailModal["first"].nativeElement.click();
    }
  }
  enterBuildUPDetail(p, checkboxReadyBuildup) {
    if (checkboxReadyBuildup == true) {
      this.uldNoForCompare = p.ULDNo;
      var button = document.getElementById("buildUPPopup");
      button.click();
      $('#approvedBy').val('');
      var index = this.ULDReceiveModel.ULDReceiveDetail.findIndex(c => c.ULDNo == p.ULDNo);
      this.ULDReceiveModel.ULDReceiveDetail[index].readyForBuildup = true;
    }
    else {
      var index = this.ULDReceiveModel.ULDReceiveDetail.findIndex(c => c.ULDNo == p.ULDNo);
      this.ULDReceiveModel.ULDReceiveDetail[index].approvedBy = "";
      this.approvedByModal["first"].nativeElement.click();
    }
  }

  saveDamageDetail() {
    var index = this.ULDReceiveModel.ULDReceiveDetail.findIndex(c => c.ULDNo == this.uldNoForCompare);
    this.damageDetailText = document.getElementById("damageDetailtext");
    this.ULDReceiveModel.ULDReceiveDetail[index].damageDetail = this.damageDetailText.value;
    this.DamageDetailModal["first"].nativeElement.click();
    this.uldNoForCompare = null;
    if (this.damageDetailText.value == null || this.damageDetailText.value == "" || this.damageDetailText.value == undefined) {
      this.ULDReceiveModel.ULDReceiveDetail[index].isDamage = false;
    }
  }

  saveApprovedBy() {
    var index = this.ULDReceiveModel.ULDReceiveDetail.findIndex(c => c.ULDNo == this.uldNoForCompare);
    this.approvedByName = document.getElementById("approvedBy");
    this.ULDReceiveModel.ULDReceiveDetail[index].approvedBy = this.approvedByName.value;
    this.approvedByModal["first"].nativeElement.click();
    this.uldNoForCompare = null;
    if (this.approvedByName.value == null || this.approvedByName.value == "" || this.approvedByName.value == undefined) {
      this.ULDReceiveModel.ULDReceiveDetail[index].readyForBuildup = false;
    }
  }

  checkEmptyDamageDetail() {
    var index = this.ULDReceiveModel.ULDReceiveDetail.findIndex(c => c.ULDNo == this.uldNoForCompare);
    this.damageDetailText = document.getElementById("damageDetailtext");
    if (this.damageDetailText.value == null || this.damageDetailText.value == "" || this.damageDetailText.value == undefined) {
      this.ULDReceiveModel.ULDReceiveDetail[index].isDamage = false;
    }
    else {
      this.ULDReceiveModel.ULDReceiveDetail[index].isDamage = true;
    }
  }

  checkEmptyApprovedBy() {
    var index = this.ULDReceiveModel.ULDReceiveDetail.findIndex(c => c.ULDNo == this.uldNoForCompare);
    this.approvedByName = document.getElementById("approvedBy");
    if (this.approvedByName.value == null || this.approvedByName.value == "" || this.approvedByName.value == undefined) {
      this.ULDReceiveModel.ULDReceiveDetail[index].readyForBuildup = false;
    }
    else {
      this.ULDReceiveModel.ULDReceiveDetail[index].readyForBuildup = true;
    }
  }

  getAttachments() {
    // this.API.getdata('/Acceptance/getAcceptanceAttachments?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
    //   if (c != null) {
    //     this.attachmentResponse = c;
    //   }
    // },
    //   error => {
    //     Swal.fire({
    //       text: error.error.Message,
    //       icon: 'error',
    //       confirmButtonText: 'OK'
    //     });
    //   });
  }

  uploadFile(file) {
    const formData = new FormData();
    formData.append('fileByte', file.data);
    formData.append('moduleID', '1');
    formData.append('modulePK', this.ULDForm.controls.ULDNo.value);
    formData.append('attType', "1");
    file.inProgress = true;
    this.API.PostData('/Attachment/uploadFile', formData).subscribe(c => {
      Swal.fire({
        text: "Attachment saved successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
      //this.AttachmentsModal["first"].nativeElement.click();
      //this.getAttachments();
    });
  }

  setID(p) {
    this.fileName = "Choose file..."
    this.ULDForm.controls.ULDNo.setValue(p.ULDNo);
  }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
      this.files = [];
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0 });
      }
      this.fileName = this.files[0].data.name;
    };
    fileUpload.click();
  }

  uploadFiles() {
    if (this.fileName == "Choose file...") {
      Swal.fire({
        text: "Select File to Upload",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return
    }

    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  viewImage(p) {
    var imageFile = this.attachmentResponse.find(x => x.attachmentID == p.attachmentID);
    var image = new Image();
    var str = p.fileName.slice(p.fileName.length - 3);

    if (str == "jpg") {
      image.src = "data:image/jpg;base64," + imageFile.fileData;
      var w = window.open("");
      w.document.write(image.outerHTML);
    }
    if (str == "png") {
      image.src = "data:image/png;base64," + imageFile.fileData;
      var w = window.open("");
      w.document.write(image.outerHTML);
    }
    if (str == "jpeg") {
      image.src = "data:image/jpeg;base64," + imageFile.fileData;
      var w = window.open("");
      w.document.write(image.outerHTML);
    }
    if (str == "pdf") {
      image.src = "data:application/pdf;base64," + imageFile.fileData;
      this.pdfSrc = image.src;
      document.getElementById("openModalforPDF").click();
    }
  }
  addNewAtttach() {
    this.UploadCount.push(1);
  }
  resetUploadCount() {
    this.UploadCount = [1];
    this.AttachmentsModal["first"].nativeElement.click();
  }

  saveTareWeight(ULDNumber, TareWT) {
    var index = this.ULDReceiveModel.ULDReceiveDetail.findIndex(c => c.ULDNo == ULDNumber);
    this.ULDReceiveModel.ULDReceiveDetail[index].taraWeight = TareWT.value;
  }
}
