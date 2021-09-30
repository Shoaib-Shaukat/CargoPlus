import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { requestAirLines, responseAirLines } from '../Models/airLines';
import { ApiService } from '../../../Services/API/api.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { agentsResponse } from '../Models/agents';

@Component({
  selector: 'app-air-lines',
  templateUrl: './air-lines.component.html',
  styleUrls: ['./air-lines.component.css']
})
export class AirLinesComponent implements OnInit {
  public $rowEditEnter = false;
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject();
  agentsResponse: agentsResponse[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  viewAirLines: responseAirLines;
  validForm: boolean = false;
  requestAirLines: requestAirLines;
  airLineForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showAirLine: boolean = true;
  addnewAirLine: boolean = false;
  responseAirLines: responseAirLines[];
  constructor(public API: ApiService, public GV: GvarService) {
    this.agentsResponse = [];
    this.requestAirLines = new requestAirLines();
    this.viewAirLines = new responseAirLines();
  }
  InitializeForm(): any {
    this.airLineForm = new FormGroup({
      ALCode: new FormControl("", [Validators.required]),
      ALName: new FormControl("", [Validators.required]),
      Schedule: new FormControl("", [Validators.required]),
      DOBy: new FormControl(""),
      DOAmount: new FormControl(""),
      Abbr: new FormControl(""),
      hub: new FormControl(""),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.responseAirLines = [];
    this.getAirLines();

  }
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.responseAirLines = c;
          this.dtTrigger.next();
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
  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addnewAirLine = true;
      this.showAirLine = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.requestAirLines.isNew = true;
    }
    if (callfrm == "Cancel") {
      this.addnewAirLine = false;
      this.showAirLine = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.airLineForm.reset(this.airLineForm.value);
      this.resetForm();
      this.requestAirLines.isNew = false;
    }
    if (callfrm == "Edit") {
      this.addnewAirLine = true;
      this.showAirLine = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.requestAirLines.isNew = false;
    }
  }

  resetForm(value: any = undefined) {
    this.airLineForm.reset(value);
    // (this as {submitted:boolean}.submitted=false);
  }
  saveConsignee() {
    this.validations();
    if (this.validForm == true) {
      this.requestAirLines.ALCode = this.airLineForm.controls.ALCode.value;
      this.requestAirLines.ALName = this.airLineForm.controls.ALName.value;
      this.requestAirLines.Schedule = this.airLineForm.controls.Schedule.value;
      this.requestAirLines.DOBy = this.airLineForm.controls.DOBy.value;
      this.requestAirLines.DOAmount = this.airLineForm.controls.DOAmount.value;
      this.requestAirLines.hub = this.airLineForm.controls.hub.value;
      this.API.PostData('/Setups/saveAirLines', this.requestAirLines).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Airline saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getAirLines();
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
    if (this.airLineForm.controls.ALName.value == "" || this.airLineForm.controls.ALName.value == null) {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editConsignee(p, i) {
    this.showhide("Edit");
    this.airLineForm.setValue({
      ALCode: p.ALCode,
      ALName: p.ALName,
      Schedule: p.Schedule,
      DOBy: p.DOBy,
      DOAmount: p.DOAmount,
      Abbr: p.Abbr,
      hub: p.hub
    })
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
  getAgents(cid: number) {
    this.API.getdata('/Setups/getConAgents?cid=' + cid).subscribe(c => {
      if (c != null) {
        this.destroyDT(1, false).then(destroyed => {
          this.agentsResponse = c;
          this.dtTrigger2.next();
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

  public rowEditEnter(evt) {
    var p = evt.newValue
    this.editAirLines(p, 1);
  }
  editAirLines(p, i) {
    this.showhide("Edit");
    this.airLineForm.patchValue(p);
  }

}
