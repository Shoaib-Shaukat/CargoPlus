import { HostListener, Component, OnInit, ViewChildren, ElementRef, QueryList, ViewChild } from '@angular/core';
import { responseAirLines } from "../../../AdminArea/Models/airLines";
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from "src/app/Services/API/api.service";
import { GvarService } from "src/app/Services/Globel/gvar.service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { FormGroup, FormControl } from "@angular/forms";
import { acceptanceReport } from './reportModel'

@Component({
  selector: 'app-acceptance-report',
  templateUrl: './acceptance-report.component.html',
  styleUrls: ['./acceptance-report.component.css']
})
export class AcceptanceReportComponent implements OnInit {
  validForm: boolean = false;
  acceptanceReport: acceptanceReport[];
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
    this.acceptanceReport = [];

  }

  ngOnInit(): void {
    window.scroll(0,0);
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
  }
  InitializeForm(): any {
    this.reportForm = new FormGroup({
      ALCode: new FormControl(""),
      ALName: new FormControl(""),
      airportID: new FormControl(""),
      HandedTimeFrom: new FormControl(""),
      HandedTimeTo: new FormControl(""),
      HandedDate: new FormControl(""),
      createdBy: new FormControl(""),
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
      this.API.PostData("/Exports/Reports/getAcceptanceReport", this.reportForm.value).subscribe(
        (c) => {
          if (c != null) {
            this.destroyDT(0, true).then((destroyed) => {
              this.acceptanceReport = c;
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
    if (this.reportForm.controls.HandedDate.value == "" || this.reportForm.controls.HandedDate.value == undefined || this.reportForm.controls.HandedDate.value == null) {
      Swal.fire({
        text: "Select Acceptance Handed Date.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
}
