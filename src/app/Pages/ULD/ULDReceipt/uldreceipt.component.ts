import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ULDReceiptModel, ULDNoCombo } from './ULDReceiptModel';
import { ApiService } from '../../../Services/API/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { responseAirLines } from '../../AdminArea/Models/airLines';
import { responseFlight } from '../../Export/Flights/Model/flightsModel'
import { ULDResponseModel, ULDData } from '../ULD/Model';
import { ULDCombo, ULDTypeResponse } from '../ULD/Model'
import { ULDReceiveModel, ULDReceiveDetail } from './ULDReceiptModel'
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-uldreceipt',
  templateUrl: './uldreceipt.component.html',
  styleUrls: ['./uldreceipt.component.css']
})
export class ULDReceiptComponent implements OnInit {
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
  latestDate: any;
  compareULDID: any;
  responseFlight: responseFlight[];
  ALCode: string;
  responseAirLines: responseAirLines[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;

  dtOptions0: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();

  ULDNoCombo: ULDNoCombo[];
  ULDResponseModel: ULDResponseModel;
  arrivalResponse: responseFlight[];
  userTable: FormGroup;
  mode: boolean;
  touchedRows: any;
  ULDForm: FormGroup;
  ULDDetailForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showGrid: boolean = true;
  showNewSection: boolean = false;
  constructor(public API: ApiService, public GV: GvarService, private route: ActivatedRoute, private router: Router) {
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

  }
  ngOnInit(): void {
    this.getAirLines();
    this.getULDTypes();
    this.ULDDetailForm.controls.isNew.setValue(true);
    this.uldReceiveID = this.route.snapshot.params['id'];
    this.isAddMode = !this.uldReceiveID;
    if (!this.isAddMode) {
      this.editData(this.uldReceiveID);
    }
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

    });
  }
  ngAfterOnInit() {
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
            text: error,
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
    this.compareULDID = p.ULDID;
  }
  confirmDeleteULDRequest() {
    for (let i = 0; i < this.ULDReceiveModel.ULDReceiveDetail.length; i++) {
      if (this.compareULDID == this.ULDReceiveModel.ULDReceiveDetail[i].ULDID) {
        this.ULDReceiveModel.ULDReceiveDetail.splice(i, 1);
      }
    }
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

    if (this.ULDForm.controls.ALCode.value == "" || this.ULDForm.controls.ALCode.value == null) {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
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
    this.validForm = true;
  }
  editULDRequest(p) {
    this.ULDDetailForm.patchValue(p);
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
        c.ULDReceiveResponse.arrivalDate = c.ULDReceiveResponse.arrivalDate.substring(0, c.ULDReceiveResponse.arrivalDate.length - 9);
        this.ULDForm.controls.arrivalDate.setValue(c.ULDReceiveResponse.arrivalDate);
        this.ULDForm.controls.aricraftRegNo.setValue(c.ULDReceiveResponse.regNo);
        this.ULDForm.controls.Destination.setValue(c.ULDReceiveResponse.destination);
        this.destroyDT(0, false).then(destroyed => {
          this.ULDReceiveModel.ULDReceiveDetail = c.ULDResponseDetail;
          this.dtTrigger0.next();
          //this.getULDTypesandFlights();
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
            }
            else {
              resolve(true);
            }

          }
        });
    });
  };
  resetData() {
    this.ULDDetailForm.reset();
    this.ULDForm.reset();
    this.ULDReceiveModel = new ULDReceiveModel();
    this.getAirLines();
    this.ULDForm.controls.isNew.setValue(true);
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
}
