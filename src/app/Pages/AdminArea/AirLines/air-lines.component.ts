import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
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
  fileToUpload: any = null;
  imageUrl: string;
  @ViewChild("fileUpload") fileUpload: ElementRef; files = [];
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
      Prefix: new FormControl(""),
      alLogo: new FormControl(""),
    });
  }

  ngOnInit(): void {
    window.scroll(0,0);
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
      this.imageUrl = null;
      this.airLineForm.reset();
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

  saveAirline() {
    this.validations();
    if (this.validForm == true) {
      this.requestAirLines = this.airLineForm.value;
      if (this.imageUrl == null || this.imageUrl == "" || this.imageUrl == undefined) {
        this.imageUrl = ""
      }
      else {
        this.requestAirLines.alLogo = this.imageUrl;
      }
      this.API.PostData('/Setups/saveAirLines', this.requestAirLines).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Airline saved successfully",
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
        text: "Enter Airline Name",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
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
    this.imageUrl = this.airLineForm.controls.alLogo.value;
  }

  attachAlLogo(file: any) {
    if (!file.target.files)
      return;
    this.fileToUpload = file.target.files[0];
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      this.requestAirLines.alLogo = this.imageUrl;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

}
