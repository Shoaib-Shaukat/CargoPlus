import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../../../../Services/API/api.service';
import { responseAirLines } from './../../../AdminArea/Models/airLines';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from './../../../../Services/Globel/gvar.service'
import { DatePipe } from '@angular/common'
import { UOMRequest } from './UOMModel';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.css']
})
export class UOMComponent implements OnInit {

  UOMRequest: UOMRequest;
  UOMResponse: UOMRequest[];
  submitted: boolean = false;

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
  dataTable: any;
  dateForDeparture: any;
  validForm: boolean = false;
  validFormForTable: boolean = false;

  UOMForm: FormGroup;
  tableForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showData: boolean = true;
  addNewData: boolean = false;
  public date: Date = new Date();
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {


    this.UOMResponse = [];
    this.UOMRequest = new UOMRequest();
  }

  ngOnInit(): void {
    window.scroll(0,0);
    this.InitializeForm();
    this.getData();
    this.submitted = false;
  }

  InitializeForm(): any {
    this.UOMForm = new FormGroup({
      uomID: new FormControl(""),
      UOMName: new FormControl("", [Validators.required]),
      isActive: new FormControl(""),
    });
  }
  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addNewData = true;
      this.showData = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.UOMForm.reset();
    }
    if (callfrm == "Cancel") {
      this.submitted = false;
      this.addNewData = false;
      this.showData = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
    }
    if (callfrm == "Edit") {
      this.addNewData = true;
      this.showData = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
    }
  }

  get f() { return this.UOMForm.controls; }

  saveUOM() {
    this.validations();
    if (this.validForm == true) {
      this.UOMRequest = this.UOMForm.value;
      this.API.PostData('/Setups/SaveUOMType', this.UOMRequest).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "GSE UOM has been added Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.UOMResponse = [];
          this.showhide("Cancel");
          this.getData();
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
    this.submitted = true;
    if (this.UOMForm.controls.UOMName.value == "" || this.UOMForm.controls.UOMName.value == null) {
      Swal.fire({
        text: "Enter UOM Type.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }

  editCategory(p) {
    this.showhide("Edit");
    this.UOMForm.patchValue(p);
  }

  getData() {
    this.API.getdata('/Setups/getUOM?showAll=true').subscribe(c => {
      if (c != null) {
        this.UOMResponse = c;
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

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.UOMForm.controls.isActive.setValue(true);
    } else {
      this.UOMForm.controls.isActive.setValue(false);
    }
  }
}


