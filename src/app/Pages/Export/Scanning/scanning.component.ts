import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlDirective } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { AWBDetail, NewScanningResponse, scanningResponse } from './scanningModel';
import { Subject } from 'rxjs';
import { employeeModel } from '../../Export/Acceptance/Model/acceptance'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ApiService } from '../../../Services/API/api.service';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-scanning',
  templateUrl: './scanning.component.html',
  styleUrls: ['./scanning.component.css']
})
export class ScanningComponent implements OnInit {
  holdShipmentStatus: boolean = false;
  NewScanningResponse: NewScanningResponse;
  public date: Date = new Date();
  occurranceDetailEnable: boolean = false;
  validInputSearch: boolean = false;
  editMode: boolean = false;
  delivered: boolean = false;
  validForm: boolean = false;
  scanningPerson: employeeModel;
  securityPerson: employeeModel;

  scanningResponse: scanningResponse;
  AWBNo: string;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  AWBDetail: AWBDetail;
  scanningForm: FormGroup;
  AWBForm: FormGroup;
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {
    this.AWBDetail = new AWBDetail();
    this.InitializeForm();
    this.InitializeFormAWB();
    this.scanningResponse = new scanningResponse();
    this.scanningPerson = new employeeModel();
    this.securityPerson = new employeeModel();
    this.NewScanningResponse = new NewScanningResponse();
  }

  ngOnInit(): void {
    this.scanningForm.get('scanningDate').patchValue(this.formatDate(new Date()));
    this.scanningForm.controls.isNew.setValue(true);
    this.scanningForm.controls.securityPersonalID.setValue(this.GV.UserId);
    this.scanningForm.controls.spName.setValue(this.GV.userName);
    this.scanningForm.controls.scaningPersonalID.setValue(this.GV.UserId);
    this.scanningForm.controls.scanPName.setValue(this.GV.userName);
    this.scanningForm.controls.scanningType.setValue("Single");
    this.scanningForm.controls.scannedStatus.setValue("Open");
    this.delivered = false;
    let latest_date = this.datepipe.transform(this.date, 'HH:mm');
    this.scanningForm.controls.scanningTime.setValue(latest_date);
    this.scanningForm.controls.OvrShipment.disable();
    this.scanningForm.controls.FurShipment.disable();
    this.scanningForm.controls.Occurance.disable();
    this.scanningForm.controls.SHR.disable();
    this.scanningForm.controls.SPX.disable();
  }
  SaveDetail() {
    this.Validations();
    if (this.validForm == false) {
      return
    }
    this.scanningForm.controls.AWBNo.setValue(this.AWBForm.controls.AWBNo.value)
    this.scanningForm.controls.acceptanceID.setValue(this.AWBForm.controls.acceptanceID.value)
    this.API.PostData('/Scanning/saveScanning', this.scanningForm.value).subscribe(c => {
      if (c != null) {
        this.editMode = false;
        Swal.fire({
          text: "Scanning Updated Successfully",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.getAWBDetail();
        this.scanningForm.controls.scanningID.setValue(c.scanningID);
      }
      this.scanningForm.controls.isNew.setValue(false);
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }

  InitializeFormAWB(): any {
    this.AWBForm = new FormGroup({
      acceptanceID: new FormControl(""),
      chargeableWeight: new FormControl(""),
      ALCode: new FormControl(""),
      AWBType: new FormControl(""),
      comm_description: new FormControl(""),
      comid: new FormControl(""),
      AWBNo: new FormControl(""),
      isDepartured: new FormControl(""),
      airportID: new FormControl(""),
      Pieces: new FormControl(""),
      grossWeight: new FormControl(""),
      dimensionalWeight: new FormControl(""),
      Nature: new FormControl(""),
      goodsId: new FormControl(""),
      ALName: new FormControl(""),
      AcceptanceRemarks: new FormControl(""),
      ExaminationRemarks: new FormControl(""),
    });
  }
  InitializeForm(): any {
    this.scanningForm = new FormGroup({
      scanningID: new FormControl(""),
      station: new FormControl(""),
      AWBNo: new FormControl(""),
      HAWBNO: new FormControl(""),
      scanningType: new FormControl(""),
      securityPersonalID: new FormControl(""),
      scaningPersonalID: new FormControl(""),
      acceptanceID: new FormControl(""),
      scannedStatus: new FormControl(""),
      scanningTime: new FormControl(""),
      scanningDate: new FormControl(""),
      scanPName: new FormControl(""),
      occurranceDetail: new FormControl(""),
      frustratedShipment: new FormControl(""),
      occurance: new FormControl(""),
      oversizeShipments: new FormControl(""),
      physicallyChecked: new FormControl(""),
      remarks: new FormControl(""),
      ETD: new FormControl(""),
      EDD: new FormControl(""),
      isNew: new FormControl(""),
      spName: new FormControl(""),
      OvrShipment: new FormControl(""),
      FurShipment: new FormControl(""),
      Occurance: new FormControl(""),
      SHR: new FormControl(""),
      SPX: new FormControl(""),
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

  getSecurityPerson() {
    if (this.scanningForm.controls.securityPersonalID.value != "" && this.scanningForm.controls.securityPersonalID.value != null) {
      this.API.getdata('/Generic/getEmpDetail?empID=' + this.scanningForm.controls.securityPersonalID.value).subscribe(c => {
        if (c != null) {
          this.securityPerson = c;
          this.scanningForm.controls.spName.setValue(this.securityPerson.employeeName);
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
  getScanningPerson() {
    if (this.scanningForm.controls.scaningPersonalID.value != "" && this.scanningForm.controls.scaningPersonalID.value != null) {
      this.API.getdata('/Generic/getEmpDetail?empID=' + this.scanningForm.controls.scaningPersonalID.value).subscribe(c => {
        if (c != null) {
          this.scanningPerson = c;
          this.scanningForm.controls.scanPName.setValue(this.scanningPerson.employeeName);
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
  Validations() {
    if (this.AWBForm.controls.AWBNo.value == "" || this.AWBForm.controls.AWBNo.value == null) {
      Swal.fire({
        text: "Select AWB Detail First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.scanningForm.controls.securityPersonalID.value == "" || this.scanningForm.controls.securityPersonalID.value == null) {
      Swal.fire({
        text: "Select Security Person",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.scanningForm.controls.scaningPersonalID.value == "" || this.scanningForm.controls.scaningPersonalID.value == null) {
      Swal.fire({
        text: "Select Scanning Person",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.scanningForm.controls.scanningType.value == "" || this.scanningForm.controls.scanningType.value == null) {
      Swal.fire({
        text: "Select Scanning Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.scanningForm.controls.scannedStatus.value == "" || this.scanningForm.controls.scannedStatus.value == null) {
      Swal.fire({
        text: "Select Scanning Status",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.scanningForm.controls.scanningTime.value == "" || this.scanningForm.controls.scanningTime.value == null) {
      Swal.fire({
        text: "Enter Scanning Time",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.scanningForm.controls.scanningDate.value == "" || this.scanningForm.controls.scanningDate.value == null) {
      Swal.fire({
        text: "Enter Scanning Date",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  validationForSearch() {
    if (this.AWBNo == "" || this.AWBNo == null || this.AWBNo == undefined) {
      Swal.fire({
        text: "Enter AWB No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validInputSearch = false;
      return;
    }
    this.validInputSearch = true;
  }
  getAWBDetail() {
    this.validationForSearch();
    if (this.validInputSearch == true) {
      this.API.getdata('/Acceptance/searchAcceptanceDetail?AWBNo=' + this.AWBNo).subscribe(c => {
        if (c != null) {
          this.NewScanningResponse = c;
          if (this.NewScanningResponse.Region == "Europe") {
            this.scanningForm.controls.SHR.setValue(true);
            this.scanningForm.controls.SPX.setValue(false);
          }
          else {
            this.scanningForm.controls.SHR.setValue(false);
            this.scanningForm.controls.SPX.setValue(true);
          }
          if (this.NewScanningResponse.holdShipment == true) {
            this.holdShipmentStatus = true;
          }
          else {
            this.holdShipmentStatus = false;
          }
          this.AWBForm.patchValue(this.NewScanningResponse);
          this.scanningForm.patchValue(this.NewScanningResponse);
          if (this.NewScanningResponse.DNR == true) {
            this.disableAllForms();
          }
          if (this.NewScanningResponse.holdShipment == true) {
            this.disableAllForms();
          }
          this.editMode = true;
          this.AWBDetail = c;
          this.AWBForm.patchValue(this.AWBDetail);
          if (this.AWBDetail.AWBStatus == "Delivered") {
            this.disableAllForms();
          }
          // this.scanningForm.reset(true);
          // this.scanningForm.controls.isNew.setValue(true);


          this.API.getdata('/Scanning/getScanningdata?AWBNo=' + this.AWBNo).subscribe(x => {
            if (x != null) {
              this.scanningResponse = x;
              var dateString = x.scanningDate.slice(0, 10);
              // dateString = new Date(dateString).toUTCString();
              // dateString = dateString.split(' ').slice(1, 4).join(' ');
              // this.scanningResponse.scanningDate = dateString;
              this.scanningForm.patchValue(this.scanningResponse);
              this.scanningForm.get('scanningDate').patchValue(dateString);
              this.getSecurityPerson();
              this.getScanningPerson();
              this.scanningForm.controls.isNew.setValue(false);
            }
          },
            error => {
              Swal.fire({
                text: error.error.Message,
                icon: 'error',
                confirmButtonText: 'OK'
              });
              //this.scanningForm.reset(true);
            });

          // this.destroyDT(0, false).then(destroyed => {
          //   this.AWBDetail = c;
          //   this.dtTrigger.next();
          // });
        }
        else {
          this.resetAcceptance();
          Swal.fire({
            text: "Enter Correct AWB No.",
            icon: 'error',
            confirmButtonText: 'OK'
          });

        }
      },
        error => {
          this.resetAcceptance();
          Swal.fire({
            text: error.error.Message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
  }
  resetAcceptance() {
    this.holdShipmentStatus = false;
    this.AWBNo = "";
    this.AWBForm.reset();
    this.scanningForm.reset();
    this.scanningForm.get('scanningDate').patchValue(this.formatDate(new Date()));
    this.scanningForm.controls.securityPersonalID.setValue(this.GV.UserId);
    this.scanningForm.controls.spName.setValue(this.GV.userName);
    this.scanningForm.controls.scaningPersonalID.setValue(this.GV.UserId);
    this.scanningForm.controls.scanPName.setValue(this.GV.userName);
    this.scanningForm.controls.scanningType.setValue("Single");
    this.scanningForm.controls.scannedStatus.setValue("Open");
    this.scanningForm.controls.isNew.setValue(true);
    this.delivered = false;
    this.editMode = false;
    this.AWBForm.enable();
    this.scanningForm.enable();
    let latest_date = this.datepipe.transform(this.date, 'HH:mm');
    this.scanningForm.controls.scanningTime.setValue(latest_date);
    this.scanningForm.controls.OvrShipment.disable();
    this.scanningForm.controls.FurShipment.disable();
    this.scanningForm.controls.Occurance.disable();
    this.scanningForm.controls.SHR.disable();
    this.scanningForm.controls.SPX.disable();
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

  occurranceDetailChecked(occurranceDetail: boolean) {
    if (occurranceDetail) {
      this.occurranceDetailEnable = true;
      this.scanningForm.controls.occurranceDetail.reset();
    }
    else {
      this.occurranceDetailEnable = false;
    }
  }
  disableAllForms() {
    this.delivered = true;
    this.AWBForm.disable();
    this.scanningForm.disable();
  }
}
