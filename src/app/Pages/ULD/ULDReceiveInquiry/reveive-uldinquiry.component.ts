import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { ApiService } from '../../../Services/API/api.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DataTableDirective } from 'angular-datatables';
import { responseFlight } from '../../Export/Flights/Model/flightsModel'
import { responseAirLines } from '../../AdminArea/Models/airLines';
import { ULDRecInqResponse } from './uldRecInqModel'
import { arrivalResponse } from '../ULDReceipt/ULDReceiptModel';
@Component({
  selector: 'app-reveive-uldinquiry',
  templateUrl: './reveive-uldinquiry.component.html',
  styleUrls: ['./reveive-uldinquiry.component.css']
})
export class ReveiveULDInquiryComponent implements OnInit {
  defaultAirline: responseAirLines;
  defaultFlight: responseFlight;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;

  dtOptions0: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();
  ULDRecInqResponse: ULDRecInqResponse[];
  responseAirLines: responseAirLines[];
  arrivalResponse: responseFlight[];
  ULDInquiryForm: FormGroup;

  constructor(public API: ApiService, public GV: GvarService, public router: Router) {
    this.defaultAirline = new responseAirLines();
    this.defaultFlight = new responseFlight();
    this.ULDRecInqResponse = [];
    this.responseAirLines = [];
    this.arrivalResponse = [];
  }

  ngOnInit(): void {
    window.scroll(0,0);
    this.InitializeDetailForm();
    this.getAirLines();
  }
  InitializeDetailForm(): any {
    this.ULDInquiryForm = new FormGroup({
      ALCode: new FormControl(""),
      flightID: new FormControl(""),
    });
  }
  getDetails() {
    if (this.ULDInquiryForm.controls.ALCode.value == "" || this.ULDInquiryForm.controls.ALCode.value == null) {
      return;
    }
    if (this.ULDInquiryForm.controls.ALCode.value != undefined && this.ULDInquiryForm.controls.ALCode.value != null) {
      this.API.getdata('/Flights/getArrivalFlightsByAriline?ALCode=' + this.ULDInquiryForm.controls.ALCode.value).subscribe(c => {
        if (c != null) {
          this.arrivalResponse = c;
          this.defaultFlight.flightID = "0";
          this.defaultFlight.arrivalFlightNo = "Select Flight";
          this.arrivalResponse.push(this.defaultFlight);
          this.ULDInquiryForm.controls.flightID.setValue("0");
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
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
        this.defaultAirline.ALCode = 0;
        this.defaultAirline.ALName = "Select AirLine";
        this.responseAirLines.push(this.defaultAirline);
        this.ULDInquiryForm.controls.ALCode.setValue(0);
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

  searchData() {
    if (this.ULDInquiryForm.controls.flightID.value == "" || this.ULDInquiryForm.controls.flightID.value == null) {
      return;
    }
    this.API.getdata('/ULD/getALLReceivedULDs?flightID=' + this.ULDInquiryForm.controls.flightID.value).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.ULDRecInqResponse = c;
          this.dtTrigger0.next();
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
  editULDType(p: any) {
    this.router.navigate(['/ULD/ULDReceive/' + p.uldReceiveID + '']);
  }
}
