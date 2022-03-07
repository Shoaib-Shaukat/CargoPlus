import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common'
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { DamageRequest, DamageResponse } from './DamageModel';
@Component({
  selector: 'app-damage-module',
  templateUrl: './damage-module.component.html',
  styleUrls: ['./damage-module.component.css']
})
export class DamageModuleComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  DamageRequest: DamageRequest;
  DamageResponse: DamageResponse[];

  submitted: boolean = false;

  public selectionMode = 'single';
  public $rowEditEnter = false;
  public $cellEditEnter = false;
  public $cellEdit = false;
  public $rowEdit = false;
  public data;

  DamageForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showData: boolean = true;
  addNewData: boolean = false;
  public date: Date = new Date();
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {

    this.DamageRequest = new DamageRequest();
    this.DamageResponse = [];
  }

  ngOnInit(): void {
    this.InitializeForm();
    this.getData();
    this.submitted = false;
  }

  InitializeForm(): any {
    this.DamageForm = new FormGroup({
      damagetypeID: new FormControl(""),
      damageType: new FormControl("", [Validators.required]),
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
      this.DamageForm.reset();
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

  get f() { return this.DamageForm.controls; }

  saveData() {
    this.submitted = true;
    if (this.DamageForm.valid) {
      if (this.DamageForm.controls.damagetypeID.value == "" || this.DamageForm.controls.damagetypeID.value == null) {
        this.DamageForm.controls.damagetypeID.setValue(0);
      }
      if (this.DamageForm.controls.isActive.value == "" || this.DamageForm.controls.isActive.value == null) {
        this.DamageForm.controls.isActive.setValue(false);
      }
      this.DamageRequest = this.DamageForm.value;
      this.API.PostData('/Generic/SaveDamageType', this.DamageRequest).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Damage Detail added successfully!",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.DamageResponse = [];
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

  editDamageDetail(p) {
    this.showhide("Edit");
    this.DamageForm.patchValue(p);
  }
  isActiveCheck(check: boolean) {
    if (check == true) {
      this.DamageForm.controls.isActive.setValue(true);
    } else {
      this.DamageForm.controls.isActive.setValue(false);
    }
  }
  getData() {
    this.API.getdata('/Generic/getDamageType').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, true).then((destroyed) => {
          this.DamageResponse = c;
        });
        this.dtTrigger.next();
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
}

