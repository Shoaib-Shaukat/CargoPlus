import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { ApiService } from 'src/app/Services/API/api.service';
import { responseAirLines } from 'src/app/Pages/AdminArea/Models/airLines';
import { responseULDStock, responseULDStockAll } from './uldStockAllModel';

@Component({
  selector: 'app-uld-stock-all',
  templateUrl: './uld-stock-all.component.html',
  styleUrls: ['./uld-stock-all.component.css']
})
export class UldStockAllComponent implements OnInit {
  newArrayforULDStock: responseULDStock[];
  ULDsCount: number = 1;
  responseULDStockDuplicate: responseULDStock[];
  responseULDStock: responseULDStock[];
  ULDDetailForm: FormGroup;
  responseULDStockAll: responseULDStockAll[];
  defaultAirline: responseAirLines;
  responseAirLines: responseAirLines[];
  public selectionMode = 'single';
  public $rowEditEnter = false;
  public $cellEditEnter = false;
  public $cellEdit = false;
  public $rowEdit = false;
  public data;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  validFormForTable: boolean = false;
  tableForm: FormGroup;
  showStock: boolean = true;
  constructor(public API: ApiService, public GV: GvarService) {
    this.newArrayforULDStock = [];
    this.responseULDStockDuplicate = [];
    this.responseULDStock = [];
    this.responseULDStockAll = [];
    this.defaultAirline = new responseAirLines();
    this.responseAirLines = [];
  }
  InitializeForm(): any {
    this.tableForm = new FormGroup({
      ALCode: new FormControl(""),
    });
  }
  InitializeDetailForm(): any {
    this.ULDDetailForm = new FormGroup({
      ULDID: new FormControl(""),
      ULDType: new FormControl(""),
      taraWeight: new FormControl(""),
      maxGrossWeight: new FormControl(""),
      airportID: new FormControl(""),
      uldreceiveDetailID: new FormControl(""),
      uldReceiveID: new FormControl(""),
      isDeleted: new FormControl(""),
      isIssued: new FormControl(""),
      status: new FormControl(""),
      ALName: new FormControl(""),
      serviceAbility: new FormControl(""),
      ALCode: new FormControl(""),
      buildupStatus: new FormControl(""),
      flightStatus: new FormControl(""),
      ULDs: new FormControl("")
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.InitializeDetailForm();
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

  getULDStockAll() {
    this.responseULDStock = [];
    this.validationForALCode();
    if (this.validFormForTable == true) {
      this.API.getdata('/ULD/uldDetailrpt?ALCode=' + (+this.tableForm.controls.ALCode.value)).subscribe(c => {
        if (c != null) {
          this.responseULDStock = c;
          this.responseULDStockDuplicate = c;
          for (let i = 0; i < this.responseULDStockDuplicate.length; i++) {
            this.ULDsCount = 1;
            for (let j = 1; j < this.responseULDStockDuplicate.length; j++) {
              if (this.responseULDStockDuplicate[i].ULDType === this.responseULDStockDuplicate[j].ULDType && (i != j)) {
                this.ULDsCount = this.ULDsCount + 1;
                this.responseULDStockDuplicate[i].ULDs = this.ULDsCount;
              }
              else {
                this.responseULDStockDuplicate[i].ULDs = this.ULDsCount;
              }
            }
          }
          this.ULDsCount = 1;
          for (let i = 0; i < this.responseULDStockDuplicate.length; i++) {
            for (let j = 1; j < this.responseULDStockDuplicate.length; j++) {
              if (this.responseULDStockDuplicate[i].ULDs > 1) {
                if (this.responseULDStockDuplicate[i].ULDType === this.responseULDStockDuplicate[j].ULDType) {
                  this.responseULDStockDuplicate.splice(j, 1);
                }
              }
            }
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

    // if (this.validFormForTable == true) {
    //   this.API.getdata('/ULD/getAllULDStockByAirline?ALCode=' + (+this.tableForm.controls.ALCode.value)).subscribe(c => {
    //     if (c != null) {
    //       this.responseULDStockAll = c;
    //     }
    //   },
    //     error => {
    //       Swal.fire({
    //        text: error.error.Message,
    //         icon: 'error',
    //         confirmButtonText: 'OK'
    //       });
    //     });
    // }
  }
  viewULDDetailOnePopup(p) {
    this.ULDDetailForm.patchValue(p);
  }
  viewULDDetailTwo(p) {
    this.newArrayforULDStock = [];
    this.API.getdata('/ULD/uldDetailrpt?ALCode=' + (+this.tableForm.controls.ALCode.value)).subscribe(c => {
      if (c != null) {
        this.responseULDStock = c;
        for (let i = 0; i < this.responseULDStock.length; i++) {
          if (p.ULDType === this.responseULDStock[i].ULDType) {
            this.newArrayforULDStock.push(this.responseULDStock[i]);
          }
        }
      }
    });
  }
  // viewULDDetailTwoPopup(p) {
  //   this.ULDDetailForm.patchValue(p);
  // }
}

