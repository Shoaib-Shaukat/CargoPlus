import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { AWBDetail, NewExaminationResponse, responseExamination } from './ExaminationModel';
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
  emailResponse: any = [];
  NewStr: string;

  holdShipmentStatus: boolean = false;
  NewExaminationResponse: NewExaminationResponse;
  @ViewChildren('examinationPopUpModel') examinationPopUpModel: ElementRef;
  @ViewChildren('emailPopUpModel') emailPopUpModel: ElementRef;

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
    this.AWBDetail = new AWBDetail();
    this.InitializeForm();
    this.InitializeFormAWB();
    this.responseExamination = [];
    this.NewExaminationResponse = new NewExaminationResponse();
  }

  ngOnInit(): void {
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

      email_sendTo: new FormControl(""),
      email_sendCC: new FormControl(""),
      email_sendBCC: new FormControl(""),
      email_from: new FormControl(""),
      email_Subject: new FormControl(""),
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
  getEmails() {
    this.API.getdata('/CargoMessages/getEmails?moduleID=5').subscribe(c => {
      if (c != null) {
        this.emailResponse = c;
        this.examinationForm.controls.email_Subject.setValue(this.emailResponse.emailModel.Subject);
        this.examinationForm.controls.email_from.setValue(this.emailResponse.emailModel.sendFrom);
        //document.getElementById("openEmailModal").click();
        //CC
        for (let i = 0; i < this.emailResponse.emaildetaillist.length; i++) {
          if ((i + 1) < this.emailResponse.emaildetaillist.length) {
            if (this.emailResponse.emaildetaillist[i].sendcc != "" || this.emailResponse.emaildetaillist[i + 1].sendcc != "") {
              this.NewStr = this.emailResponse.emaildetaillist[i].sendcc.concat(', ', this.emailResponse.emaildetaillist[i + 1].sendcc);
            }
          }
        }
        var str = this.NewStr.slice(this.NewStr.length - 2, this.NewStr.length);
        if (str == ", ") {
          this.NewStr = this.NewStr.slice(0, this.NewStr.length - 2)
          this.examinationForm.controls.email_sendCC.setValue(this.NewStr);
          this.NewStr = "";
        }
        else {
          this.examinationForm.controls.email_sendCC.setValue(this.NewStr);
        }
        //BCC
        for (let i = 0; i < this.emailResponse.emaildetaillist.length; i++) {
          if ((i + 1) < this.emailResponse.emaildetaillist.length) {
            if (this.emailResponse.emaildetaillist[i].sendbcc != "" || this.emailResponse.emaildetaillist[i + 1].sendbcc != "") {
              this.NewStr = this.emailResponse.emaildetaillist[i].sendbcc.concat(', ', this.emailResponse.emaildetaillist[i + 1].sendbcc);
            }
          }
        }
        var str = this.NewStr.slice(this.NewStr.length - 2, this.NewStr.length);
        if (str == ", ") {
          this.NewStr = this.NewStr.slice(0, this.NewStr.length - 2)
          this.examinationForm.controls.email_sendBCC.setValue(this.NewStr);
          this.NewStr = "";
        }
        else {
          this.examinationForm.controls.email_sendBCC.setValue(this.NewStr);
        }
        //Send To
        for (let i = 0; i < this.emailResponse.emaildetaillist.length; i++) {
          if ((i + 1) < this.emailResponse.emaildetaillist.length) {
            if (this.emailResponse.emaildetaillist[i].sendto != "" || this.emailResponse.emaildetaillist[i + 1].sendto != "") {
              this.NewStr = this.emailResponse.emaildetaillist[i].sendto.concat(', ', this.emailResponse.emaildetaillist[i + 1].sendto);
            }
          }
        }
        var str = this.NewStr.slice(this.NewStr.length - 2, this.NewStr.length);
        if (str == ", ") {
          this.NewStr = this.NewStr.slice(0, this.NewStr.length - 2)
          this.examinationForm.controls.email_sendTo.setValue(this.NewStr);
          this.NewStr = "";
        }
        else {
          this.examinationForm.controls.email_sendTo.setValue(this.NewStr);
        }
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
  sendEmail() {
    let body = {
      ccArr: this.examinationForm.controls.email_sendCC.value.split(', '),
      bccArr: this.examinationForm.controls.email_sendBCC.value.split(', '),
      sendToArr: this.examinationForm.controls.email_sendTo.value.split(', '),
    }
    this.emailPopUpModel["first"].nativeElement.click();

    // this.API.PostData('' ).subscribe(c => {
    //   if (c != null) {
    //     Swal.fire({
    //       text: "Email Sent",
    //       icon: 'success',
    //       confirmButtonText: 'OK'
    //     });
    //   }
    // },
    //   error => {
    //     Swal.fire({
    //       text: error.error.Message,
    //       icon: 'error',
    //       confirmButtonText: 'OK'
    //     });
    //   });

  }
}
