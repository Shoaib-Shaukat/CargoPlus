import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common'
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { ModuleRequest, ModuleResponse } from './GSEModuleModel';

@Component({
  selector: 'app-gsemodule',
  templateUrl: './gsemodule.component.html',
  styleUrls: ['./gsemodule.component.css']
})
export class GSEModuleComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


  ModuleRequest: ModuleRequest;
  ModuleResponse: ModuleResponse[];
  submitted: boolean = false;

  public selectionMode = 'single';
  public $rowEditEnter = false;
  public $cellEditEnter = false;
  public $cellEdit = false;
  public $rowEdit = false;
  public data;

  dateForDeparture: any;
  validForm: boolean = false;
  validFormForTable: boolean = false;

  ModuleForm: FormGroup;
  tableForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showData: boolean = true;
  addNewData: boolean = false;
  public date: Date = new Date();
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {

    this.ModuleRequest = new ModuleRequest();
    this.ModuleResponse = [];
  }

  ngOnInit(): void {
    this.InitializeForm();
    this.getData();
    this.submitted = false;
  }

  InitializeForm(): any {
    this.ModuleForm = new FormGroup({
      gsemoduleID: new FormControl(""),
      gseModule: new FormControl("", [Validators.required]),
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
      this.ModuleForm.reset();
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

  get f() { return this.ModuleForm.controls; }

  saveData() {
    this.submitted = true;
    if (this.ModuleForm.valid) {
      if (this.ModuleForm.controls.gsemoduleID.value == "" || this.ModuleForm.controls.gsemoduleID.value == null) {
        this.ModuleForm.controls.gsemoduleID.setValue(0);
      }
      this.ModuleRequest = this.ModuleForm.value;
      this.API.PostData('/Setups/SaveGSEModule', this.ModuleRequest).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "GSE Module added successfully!",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.ModuleResponse = [];
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

  editModule(p) {
    this.showhide("Edit");
    this.ModuleForm.patchValue(p);
  }

  getData() {
    this.API.getdata('/Setups/getGSEModule').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, true).then((destroyed) => {
          this.ModuleResponse = c;
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

