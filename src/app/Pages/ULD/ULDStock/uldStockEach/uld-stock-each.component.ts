import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common'
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { ApiService } from 'src/app/Services/API/api.service';
import { responseAirLines } from 'src/app/Pages/AdminArea/Models/airLines';
import { responseULDStockEach } from './uldStockModel';


@Component({
  selector: 'app-uld-stock-each',
  templateUrl: './uld-stock-each.component.html',
  styleUrls: ['./uld-stock-each.component.css']
})
export class UldStockEachComponent implements OnInit {
  responseULDStockEach: responseULDStockEach[];
  defaultAirline: responseAirLines;
  public selectionMode = 'single';
  public $rowEditEnter = false;
  public $cellEditEnter = false;
  public $cellEdit = false;
  public $rowEdit = false;
  responseAirLines: responseAirLines[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  validForm: boolean = false;
  validFormForTable: boolean = false;
  tableForm: FormGroup;
  showStock: boolean = true;
  public date: Date = new Date();
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {
    this.responseULDStockEach = [];
    this.defaultAirline = new responseAirLines();
    this.responseAirLines = [];
  }
  InitializeForm(): any {
    this.tableForm = new FormGroup({
      ALCode: new FormControl(""),
    });
  }
  ngOnInit(): void {
    window.scroll(0,0);
    this.InitializeForm();
    this.getAirLines();
  }

  validationForALCode() {
    if (this.tableForm.controls.ALCode.value == "" || this.tableForm.controls.ALCode.value == null) {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormForTable = false;
      return;
    }
    this.validFormForTable = true;
  }

  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.showStock = false;
      this.tableForm.reset();
      this.getAirLines();
    }
    if (callfrm == "Cancel") {
      this.showStock = true;
      this.tableForm.controls.isNew.setValue(false);
    }
    if (callfrm == "Edit") {
      this.showStock = false;
      this.tableForm.controls.isNew.setValue(false);
    }
  }
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
        this.defaultAirline.ALCode = 0;
        this.defaultAirline.ALName = "Select Airline";
        this.responseAirLines.push(this.defaultAirline);
        this.tableForm.controls.ALCode.setValue(0);
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

  getULDStockEach(){
    this.validationForALCode();
    if (this.validFormForTable == true) {
      this.API.getdata('/ULD/getULDStockByAirline?ALCode=' + this.tableForm.controls.ALCode.value).subscribe(c => {
        if (c != null) {
          this.responseULDStockEach = c;
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
}
