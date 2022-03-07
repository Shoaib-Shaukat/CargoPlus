import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { AWBDetail, examinationResponse, NewExaminationResponse, responseExamination } from './ExaminationModel';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ApiService } from '../../../Services/API/api.service';
import { GvarService } from '../../../Services/Globel/gvar.service'

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})
export class ExaminationComponent implements OnInit {
  ANFIndex: any;
  ANFDateTime: any;
  examinationResponse: examinationResponse;
  examinationList: responseExamination[];
  holdShipmentStatus: boolean = false;
  NewExaminationResponse: NewExaminationResponse;
  @ViewChildren('examinationPopUpModel') examinationPopUpModel: ElementRef;
  @ViewChildren('emailPopUpModel') emailPopUpModel: ElementRef;
  @ViewChildren('ANFModal') ANFModal: ElementRef;
  responseExamination: responseExamination[];
  AWBNo: string;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  AWBDetail: AWBDetail;
  examinationForm: FormGroup;
  AWBForm: FormGroup;
  validPopUpForm: boolean = false;
  delivered: boolean = false;
  editMode: boolean = false;
  constructor(public API: ApiService, public GV: GvarService) {
    this.examinationList = [];
    this.examinationResponse = new examinationResponse();
    this.AWBDetail = new AWBDetail();
    this.InitializeForm();
    this.InitializeFormAWB();
    this.responseExamination = [];
    this.NewExaminationResponse = new NewExaminationResponse();
  }

  ngOnInit(): void {
    window.scroll(0,0);
    this.delivered = false;
    //this.getEmails();
  }
  SaveDetail() {
    this.examinationForm.controls.isNew.setValue(false);
    if (this.AWBForm.controls.ExaminationRemarks.value != null) {
      this.examinationForm.controls.ExaminationRemarks.setValue(this.AWBForm.controls.ExaminationRemarks.value)
    }
    this.examinationForm.controls.acceptanceID.setValue(this.AWBForm.controls.acceptanceID.value);
    this.API.PostData('/Examination/saveExamination', this.examinationForm.value).subscribe(c => {
      if (c != null) {
        this.editMode = false;
        Swal.fire({
          text: "Examination Updated Successfully",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.examinationPopUpModel["first"].nativeElement.click();
      }
      this.getExamination();
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  getAWBDetail() {
    this.API.getdata('/Acceptance/searchAcceptanceDetail?AWBNo=' + this.AWBNo).subscribe(c => {
      if (c != null) {
        this.NewExaminationResponse = c;
        if (this.NewExaminationResponse.holdShipment == true) {
          this.holdShipmentStatus = true;
        }
        else {
          this.holdShipmentStatus = false;
        }
        this.AWBForm.patchValue(this.NewExaminationResponse);
        this.editMode = true;
        this.AWBDetail = c;
        this.AWBForm.patchValue(c);
        if (this.AWBDetail.AWBStatus == "Delivered") {
          this.disableAllForms();
        }
        this.getExamination();
      }
      else {
        this.resetAcceptance();
        Swal.fire({
          text: "Enter Correct AWB No.",
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    },
      error => {
        this.resetAcceptance();
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.examinationForm.reset(true);
      });
  }
  getExamination() {
    this.API.getdata('/Examination/getExamination?AWBNo=' + this.AWBNo).subscribe(c => {
      if (c != null) {
        this.AWBForm.patchValue(c);
        this.destroyDT(0, false).then(destroyed => {
          this.responseExamination = c;
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
        this.examinationForm.reset(true);
      });
  }
  InitializeFormAWB(): any {
    this.AWBForm = new FormGroup({
      acceptanceID: new FormControl(""),
      ALCode: new FormControl(""),
      AWBType: new FormControl(""),
      comm_description: new FormControl(""),
      comid: new FormControl(""),
      chargeableWeight: new FormControl(""),
      AWBNo: new FormControl(""),
      isDepartured: new FormControl(""),
      airportID: new FormControl(""),
      Pieces: new FormControl(""),
      grossWeight: new FormControl(""),
      dimensionalWeight: new FormControl(""),
      Nature: new FormControl(""),
      goodsId: new FormControl(""),
      ALName: new FormControl(""),
      AcceptanceRemarks: new FormControl(""),
      ExaminationRemarks: new FormControl(""),
    });
  }
  InitializeForm(): any {
    this.examinationForm = new FormGroup({
      acceptanceID: new FormControl(""),
      examinationID: new FormControl(""),
      AWBNo: new FormControl(""),
      occurance: new FormControl(""),
      examinationType: new FormControl(""),
      completed: new FormControl(""),
      pending: new FormControl(""),
      exempt: new FormControl(""),
      anfCustomExemptionNo: new FormControl(""),
      ExaminationRemarks: new FormControl(""),
      isNew: new FormControl(""),
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
            }
            else {
              resolve(true);
            }
          }
        });
    });
  };
  editExamination(p) {
    this.examinationForm.patchValue(p);
  }
  resetAcceptance() {
    this.holdShipmentStatus = false;
    this.AWBNo = "";
    this.AWBForm.reset();
    this.examinationForm.reset();
    this.responseExamination = [];
    this.destroyDT(0, false).then(destroyed => {
      this.dtTrigger.next();
    });
    this.delivered = false;
    this.editMode = false;
  }
  disableAllForms() {
    this.delivered = true;
    this.AWBForm.disable();
    this.examinationForm.disable();
  }
  

  // selectALLCheck(check) {
  //   for (let i = 0; i < this.responseExamination.length; i++) {
  //     if (check == true && (this.responseExamination[i].occurance == true || 
  //       this.responseExamination[i].pending == true || this.responseExamination[i].exempt == true || 
  //       this.responseExamination[i].completed == true)) {
  //       this.responseExamination[i].checked = true;
  //     }
  //     else {
  //       this.responseExamination[i].checked = false;
  //     }
  //   }
  // }

  ExamNoChange(p, anfCustomExemptionNo) {
    var index = this.responseExamination.findIndex(c => c.examinationID == p.examinationID);
    this.responseExamination[index].anfCustomExemptionNo = anfCustomExemptionNo.value;
  }


  checkBoxesValidation(p, checkStatus, status) {
    if (status == "occuranceCheck") {
      for (let i = 0; i < this.responseExamination.length; i++) {
        if (this.responseExamination[i].examinationID == p.examinationID) {
          if (checkStatus == true) {
            this.responseExamination[i].occurance = true;
            this.responseExamination[i].pending = false;
            this.responseExamination[i].exempt = false;
            this.responseExamination[i].completed = false;
            break;
          }
          else {
            this.responseExamination[i].occurance = false;
            break;
          }
        }
      }
    }
    if (status == "completedCheck") {
      if (p.examinationType == "ANF") {
        if (checkStatus == true) {
          var button = document.getElementById("ANFPopup");
          button.click();
          this.ANFIndex = this.responseExamination.findIndex(c => c.examinationType == "ANF");
        }
        else {
          this.ANFIndex = this.responseExamination.findIndex(c => c.examinationType == "ANF");
          this.responseExamination[this.ANFIndex].ANFDate = "";
        }
      }
      for (let i = 0; i < this.responseExamination.length; i++) {
        if (this.responseExamination[i].examinationID == p.examinationID) {
          if (checkStatus == true) {
            this.responseExamination[i].completed = true;
            this.responseExamination[i].exempt = false;
            this.responseExamination[i].pending = false;
            this.responseExamination[i].occurance = false;
            break;
          }
          else {
            this.responseExamination[i].completed = false;
            break;
          }
        }
      }
    }
    if (status == "pendingCheck") {
      for (let i = 0; i < this.responseExamination.length; i++) {
        if (this.responseExamination[i].examinationID == p.examinationID) {
          if (checkStatus == true) {
            this.responseExamination[i].pending = true;
            this.responseExamination[i].exempt = false;
            this.responseExamination[i].occurance = false;
            this.responseExamination[i].completed = false;
            break;
          }
          else {
            this.responseExamination[i].pending = false;
            break;
          }
        }
      }
    }
    if (status == "exemptCheck") {
      for (let i = 0; i < this.responseExamination.length; i++) {
        if (this.responseExamination[i].examinationID == p.examinationID) {
          if (checkStatus == true) {
            this.responseExamination[i].exempt = true;
            this.responseExamination[i].pending = false;
            this.responseExamination[i].occurance = false;
            this.responseExamination[i].completed = false;
            break;
          }
          else {
            this.responseExamination[i].exempt = false;
            break;
          }
        }
      }
    }
  }
  updateTable() {
    this.examinationResponse.acceptanceID = this.AWBForm.controls.acceptanceID.value;
    this.examinationResponse.ExaminationRemarks = this.AWBForm.controls.ExaminationRemarks.value;
    this.examinationResponse.examinationList = this.responseExamination;

    this.API.PostData('/Examination/saveExamination', this.examinationResponse).subscribe(c => {
      if (c != null) {
        Swal.fire({
          text: "Updated Successfully",
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
      this.getExamination();
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  saveDateTimeANF() {
    this.ANFDateTime = document.getElementById("datetimeANF");
    if (this.ANFIndex != null) {
      this.responseExamination[this.ANFIndex].ANFDate = this.ANFDateTime.value;
      this.ANFModal["first"].nativeElement.click();
    }
    this.ANFIndex = null;
  }
  viewANF(p) {
    $('#datetimeANF').val(p.ANFDate);
    var button = document.getElementById("ANFPopup");
    button.click();
  }
}
