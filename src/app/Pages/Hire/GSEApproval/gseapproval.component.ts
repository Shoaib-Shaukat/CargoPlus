import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common'
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { ApprovalRequest, ApprovalResponse, employeeModel, ModuleResponse, stationResponse } from './GSEApprovalModel';

@Component({
  selector: 'app-gseapproval',
  templateUrl: './gseapproval.component.html',
  styleUrls: ['./gseapproval.component.css']
})
export class GSEApprovalComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  defaultStation: stationResponse;
  stationResponse: stationResponse[];
  ApprovalRequest: ApprovalRequest;
  ApprovalResponse: ApprovalResponse[];
  ModuleResponse: ModuleResponse[];
  employeeModel: employeeModel;
  submitted: boolean = false;

  public selectionMode = 'single';
  public $rowEditEnter = false;
  public $cellEditEnter = false;
  public $cellEdit = false;
  public $rowEdit = false;
  public data;

  dateForDeparture: any;
  validFormForTable: boolean = false;

  ApprovalForm: FormGroup;
  tableForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showData: boolean = true;
  addNewData: boolean = false;
  public date: Date = new Date();
  constructor(public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {
    this.ModuleResponse = [];
    this.ApprovalResponse = [];
    this.ApprovalRequest = new ApprovalRequest();
    this.employeeModel = new employeeModel();
    this.stationResponse = [];
    this.defaultStation = new stationResponse();
  }

  ngOnInit(): void {
    this.InitializeForm();
    this.getApprovals();
    this.getStations();
    this.submitted = false;
  }

  InitializeForm(): any {
    this.ApprovalForm = new FormGroup({
      aID: new FormControl(""),
      gsemoduleID: new FormControl("", [Validators.required]),
      approvalID: new FormControl("", [Validators.required]),
      priority: new FormControl("", [Validators.required]),
      approverName: new FormControl(""),
      airportID: new FormControl("", [Validators.required]),
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
      this.ApprovalForm.reset();
      $('input[name="priority"]').prop("checked", false);
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

  get f() { return this.ApprovalForm.controls; }

  getStations() {
    this.API.getdata("/Generic/getStations").subscribe(
      (c) => {
        if (c != null) {
          this.stationResponse = c;
          this.defaultStation.airportID = 0;
          this.defaultStation.StationName = "Select Station";
          this.stationResponse.push(this.defaultStation);
          this.ApprovalForm.controls.airportID.setValue(0);
          var station = localStorage.getItem("StationName");
          if (station != null) {
            var Userstation = this.stationResponse.find(c => c.StationName == station);
            this.ApprovalForm.controls.airportID.setValue(Userstation.airportID);
          }
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

  checkPriority() {
    var value: any = $("input:radio[name=priority]:checked").val();
    if (value == "P1") {
      this.ApprovalForm.controls.priority.setValue(1);
    }
    else {
      this.ApprovalForm.controls.priority.setValue(2);
    }
  }
  saveData() {
    this.submitted = true;
    if (this.ApprovalForm.valid == true) {
      if (this.ApprovalForm.controls.approverName.value == "" || this.ApprovalForm.controls.approverName.value == null) {
        Swal.fire({
          text: 'Enter valid Approval ID!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return
      }
      this.ApprovalRequest = this.ApprovalForm.value;
      this.API.PostData('/Setups/SaveGSEApprove', this.ApprovalRequest).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Approval added successfully!",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.ApprovalResponse = [];
          this.showhide("Cancel");
          this.getApprovals();
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

  editApproval(p) {
    this.showhide("Edit");
    this.ApprovalForm.patchValue(p);
  }

  getApprovals() {
    this.API.getdata('/Setups/getGSEApprove').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, true).then((destroyed) => {
          this.ApprovalResponse = c;
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
  getGSEModules() {
    this.API.getdata('/Setups/?showAll=true').subscribe(c => {
      if (c != null) {
        this.ModuleResponse = c;
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
  getEmployees() {
    if (this.ApprovalForm.controls.approvalID.value != "" && this.ApprovalForm.controls.approvalID.value != null) {
      this.API.getdata('/Generic/getEmpDetail?empID=' + this.ApprovalForm.controls.approvalID.value).subscribe(c => {
        if (c != null) {
          this.employeeModel = c;
          this.ApprovalForm.controls.approverName.setValue(this.employeeModel.employeeName);
        }
        else {
          this.ApprovalForm.controls.approverName.setValue("");
          Swal.fire({
            text: 'Invalid Approver ID',
            icon: 'error',
            confirmButtonText: 'OK'
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

