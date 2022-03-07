import { HostListener, Component, OnInit, ViewChildren, ElementRef, QueryList, ViewChild } from '@angular/core';
import { responseAirLines } from "../../../AdminArea/Models/airLines";
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from "src/app/Services/API/api.service";
import { GvarService } from "src/app/Services/Globel/gvar.service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { FormGroup, FormControl } from "@angular/forms";
import { weightReport } from './weightModel'

@Component({
  selector: 'app-weight-report',
  templateUrl: './weight-report.component.html',
  styleUrls: ['./weight-report.component.css']
})
export class WeightReportComponent implements OnInit {

  validForm: boolean = false;
  weightReport: weightReport[];
  reportForm: FormGroup;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  defaultAirline: responseAirLines;
  responseAirLines: responseAirLines[];

  constructor(public router: Router, public API: ApiService, public GV: GvarService) {
    this.responseAirLines = [];
    this.defaultAirline = new responseAirLines();
    this.weightReport = [];

  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
        'csv', 'excel'
      ]
    };
    this.InitializeForm();
    this.getAirLines();
    var date = new Date();
    this.reportForm.get('dateFrom').patchValue(this.formatDate(new Date()));
    this.reportForm.get('dateTo').patchValue(this.formatDate(new Date()));
    debugger
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
  InitializeForm(): any {
    this.reportForm = new FormGroup({
      ALCode: new FormControl(""),
      dateFrom: new FormControl(""),
      dateTo: new FormControl(""),
      vehicleNo: new FormControl(""),
    });
  }
  getAirLines() {
    this.API.getdata("/Setups/getAirLines").subscribe(
      (c) => {
        if (c != null) {
          this.responseAirLines = c;
          this.defaultAirline.ALCode = 0;
          this.defaultAirline.ALName = "ALL";
          this.responseAirLines.push(this.defaultAirline);
          this.reportForm.controls.ALCode.setValue(0);
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
  getData() {
    this.validations();
    if (this.validForm) {
      this.API.PostData("/Exports/Reports/getWeightReport", this.reportForm.value).subscribe(
        (c) => {
          if (c != null) {
            this.destroyDT(0, true).then((destroyed) => {
              this.weightReport = c;
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
  validations() {
    if (this.reportForm.controls.dateFrom.value == "" || this.reportForm.controls.dateFrom.value == undefined || this.reportForm.controls.dateFrom.value == null) {
      Swal.fire({
        text: "Select Date From.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.reportForm.controls.dateTo.value == "" || this.reportForm.controls.dateTo.value == undefined || this.reportForm.controls.dateTo.value == null) {
      Swal.fire({
        text: "Select Date To.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  openAcceptance(AWBNo) {
    debugger
    this.router.navigate(['Export/Acceptance', AWBNo]);
  }
}

