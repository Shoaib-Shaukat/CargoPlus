import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ApiService } from '../Services/API/api.service';
import { GvarService } from '../Services/Globel/gvar.service'
import { ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { thisYear } from '@igniteui/material-icons-extended';
import { BackLogRequest, BackLogResponse } from './email-model';
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  submitted: boolean = false;
  BackLogRequest: BackLogRequest;
  BackLogResponse: BackLogResponse[];
  editorData: any;
  EmailForm: FormGroup;
  BackLogForm: FormGroup;
  emailResponse: any = [];
  NewStr: any;
  dtOptions: any = {};
  BackLogValid: boolean = false;
  dtTrigger: Subject<any> = new Subject();
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  constructor(public API: ApiService, public GV: GvarService) {
    this.BackLogRequest = new BackLogRequest();
    this.InitializeForm();
    this.BackLogResponse = [];
  }

  ngOnInit(): void {
    window.scroll(0,0);
    this.InitializeForm();
    //this.getEmails();
    var test = "Hello" + "<br>" + "World";
    this.EmailForm.controls.email_Body.setValue(test);
    this.editorData = test;
    this.getEmails(test);
    this.submitted = false;
  }
  get f() { return this.BackLogForm.controls; }

  InitializeForm(): any {
    this.EmailForm = new FormGroup({
      email_sendTo: new FormControl(""),
      email_sendCC: new FormControl(""),
      email_sendBCC: new FormControl(""),
      email_from: new FormControl(""),
      email_Subject: new FormControl(""),
      email_Body: new FormControl(""),
    });

    this.BackLogForm = new FormGroup({
      CreatedFrom: new FormControl("", [Validators.required]),
      CreatedTo: new FormControl("", [Validators.required]),
    });
  }
  getEmails(test) {
    this.API.getdata('/CargoMessages/generateFWB?flightID=' + this.EmailForm.controls.email_Body.value).subscribe(c => {
      if (c != null) {
        this.emailResponse = c;
        this.EmailForm.controls.email_Subject.setValue(this.emailResponse.emailModel.Subject);
        this.EmailForm.controls.email_from.setValue(this.emailResponse.emailModel.sendFrom);
        //CC
        for (let i = 0; i < this.emailResponse.emaildetaillist.length; i++) {
          if ((i + 1) < this.emailResponse.emaildetaillist.length) {
            if (this.emailResponse.emaildetaillist[i].sendcc != "" || this.emailResponse.emaildetaillist[i + 1].sendcc != "") {
              this.NewStr = this.emailResponse.emaildetaillist[i].sendcc.concat(',', this.emailResponse.emaildetaillist[i + 1].sendcc);
            }
          }
        }
        var str = this.NewStr.slice(this.NewStr.length - 1, this.NewStr.length);
        if (str == ",") {
          this.NewStr = this.NewStr.slice(0, this.NewStr.length - 1)
          this.EmailForm.controls.email_sendCC.setValue(this.NewStr);
          this.NewStr = "";
        }
        else {
          this.EmailForm.controls.email_sendCC.setValue(this.NewStr);
        }
        //BCC
        for (let i = 0; i < this.emailResponse.emaildetaillist.length; i++) {
          if ((i + 1) < this.emailResponse.emaildetaillist.length) {
            if (this.emailResponse.emaildetaillist[i].sendbcc != "" || this.emailResponse.emaildetaillist[i + 1].sendbcc != "") {
              this.NewStr = this.emailResponse.emaildetaillist[i].sendbcc.concat(',', this.emailResponse.emaildetaillist[i + 1].sendbcc);
            }
          }
        }
        var str = this.NewStr.slice(this.NewStr.length - 1, this.NewStr.length);
        if (str == ",") {
          this.NewStr = this.NewStr.slice(0, this.NewStr.length - 1)
          this.EmailForm.controls.email_sendBCC.setValue(this.NewStr);
          this.NewStr = "";
        }
        else {
          this.EmailForm.controls.email_sendBCC.setValue(this.NewStr);
        }
        //Send To
        for (let i = 0; i < this.emailResponse.emaildetaillist.length; i++) {
          if ((i + 1) < this.emailResponse.emaildetaillist.length) {
            if (this.emailResponse.emaildetaillist[i].sendto != "" || this.emailResponse.emaildetaillist[i + 1].sendto != "") {
              this.NewStr = this.emailResponse.emaildetaillist[i].sendto.concat(',', this.emailResponse.emaildetaillist[i + 1].sendto);
            }
          }
        }
        var str = this.NewStr.slice(this.NewStr.length - 1, this.NewStr.length);
        if (str == ",") {
          this.NewStr = this.NewStr.slice(0, this.NewStr.length - 1)
          this.EmailForm.controls.email_sendTo.setValue(this.NewStr);
          this.NewStr = "";
        }
        else {
          this.EmailForm.controls.email_sendTo.setValue(this.NewStr);
        }
      }
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.EmailForm.reset(true);
      });
  }
  sendEmail() {
    let body = {
      from: this.EmailForm.controls.email_from.value,
      ccArr: this.EmailForm.controls.email_sendCC.value.split(','),
      bccArr: this.EmailForm.controls.email_sendBCC.value.split(','),
      sendToArr: this.EmailForm.controls.email_sendTo.value.split(','),
      Subject: this.EmailForm.controls.email_Subject.value,
      Body: this.EmailForm.controls.email_Body.value
    }
    this.API.PostData('/CargoMessages/SendMail', body).subscribe(c => {
      if (c != null) {
        Swal.fire({
          text: "Email Sent",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        // this.getEmails();
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
            }
            else {
              resolve(true);
            }
          }
        });
    });
  };

  BackLogFormValidation() {
    if (this.BackLogForm.controls.CreatedFrom.value == "" || this.BackLogForm.controls.CreatedFrom.value == null) {
      Swal.fire({
        text: "Select Created From Date",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.BackLogValid = false;
      return;
    }
    if (this.BackLogForm.controls.CreatedTo.value == "" || this.BackLogForm.controls.CreatedTo.value == null) {
      Swal.fire({
        text: "Select Created To Date",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.BackLogValid = false;
      return;
    }
    this.BackLogValid = true;
  }

  getBackLog() {
    this.submitted = true;
    this.BackLogForm.markAllAsTouched();
    this.BackLogFormValidation();
    if (this.BackLogValid) {
      this.BackLogRequest = this.BackLogForm.value;
      this.API.getdata('/DashBoard/BackLogVAcceptanceDetailCreatedDate?CreatedFrom=' + this.BackLogRequest.CreatedFrom + '&CreatedTo=' + this.BackLogRequest.CreatedTo).subscribe(c => {
        if (c != null) {
          this.destroyDT(0, false).then(destroyed => {
            this.BackLogResponse = c;
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
  }

}
