import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { responseAirLines } from '../Pages/AdminArea/Models/airLines';
import { GvarService } from '../Services/Globel/gvar.service';
import { ApiService } from '../Services/API/api.service';
import { responseGoods } from '../Pages/AdminArea/Models/Goods';
import { emailDetailModel, emailResponseModel, messageType, requestEmail } from './Email-Module';

@Component({
  selector: 'app-email-module',
  templateUrl: './email-module.component.html',
  styleUrls: ['./email-module.component.css']
})
export class EmailModuleComponent implements OnInit {
  emailDetailModel: emailDetailModel;
  requestEmail: requestEmail;
  emailResponseModel: emailResponseModel;
  messageType: messageType[];

  defaultGoods: responseGoods;
  defaultAirline: responseAirLines;
  defaultMessageType: messageType;
  @ViewChildren('EmailTypeModal') EmailTypeModal: ElementRef;

  validForm: boolean = false;
  validInfoPopup: boolean = false;
  searchParameters: boolean = false;
  editDetail: boolean = false;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showNoticeTypes: boolean = true;
  addnewNoticeType: boolean = false;

  responseAirLines: responseAirLines[];
  EmailForm: FormGroup;

  constructor(public API: ApiService, public GV: GvarService) {
    this.emailDetailModel = new emailDetailModel();
    this.requestEmail = new requestEmail();
    this.emailResponseModel = new emailResponseModel();
    this.defaultMessageType = new messageType();
    this.messageType = [];

    this.defaultAirline = new responseAirLines();
    this.responseAirLines = [];
  }

  ngOnInit(): void {
    window.scroll(0,0);
    this.InitializeForm();
    this.getAirLines();
    this.getMessageTypes();
  }

  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addnewNoticeType = true;
      this.showNoticeTypes = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
    }
    if (callfrm == "Cancel") {
      this.addnewNoticeType = false;
      this.showNoticeTypes = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.EmailForm.reset(this.EmailForm.value);
      this.resetForm();
    }
    if (callfrm == "Edit") {
      this.addnewNoticeType = true;
      this.showNoticeTypes = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
    }
  }

  InitializeForm(): any {
    this.EmailForm = new FormGroup({
      ALCode: new FormControl(),
      ALName: new FormControl(),
      noticedetailID: new FormControl(),
      messageID: new FormControl(),
      emailID: new FormControl(),
      MessageType: new FormControl(),
      emailDetailID: new FormControl(),
      emailType: new FormControl(),
      airportID: new FormControl(),
      emailaddress: new FormControl(),
    });
  }

  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
        this.defaultAirline.ALCode = 0;
        this.defaultAirline.ALName = "Select Airline";
        this.responseAirLines.push(this.defaultAirline);
        this.EmailForm.controls.ALCode.setValue(0);
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

  validationForSearch() {
    if (this.EmailForm.controls.ALCode.value == "" || this.EmailForm.controls.ALCode.value == null) {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.EmailForm.controls.messageID.value == "" || this.EmailForm.controls.messageID.value == null) {
      Swal.fire({
        text: "Select Message Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }

  validationsForPopup() {
    if (this.EmailForm.controls.emailaddress.value == "" || this.EmailForm.controls.emailaddress.value == null) {
      Swal.fire({
        text: "Enter Email Address",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validInfoPopup = false;
      return;
    }
    if (this.EmailForm.controls.emailType.value == "" || this.EmailForm.controls.emailType.value == null || this.EmailForm.controls.emailType.value == "Select Email Type") {
      Swal.fire({
        text: "Select Email Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validInfoPopup = false;
      return;
    }
    this.validInfoPopup = true;
  }

  pushEmailType() {
    this.validationsForPopup();
    if (this.validInfoPopup == true) {
      if (this.editDetail == true) {
        var EmailTypeDetail = this.emailResponseModel.emailDetailList.find(x => x.emailDetailID == this.EmailForm.controls.emailDetailID.value);
        if (EmailTypeDetail != undefined) {
          EmailTypeDetail.emailType = this.EmailForm.controls.emailType.value;
          EmailTypeDetail.emailaddress = this.EmailForm.controls.emailaddress.value;
        }
      }
      else {
        this.emailDetailModel = new emailDetailModel();
        this.emailDetailModel.emailaddress = this.EmailForm.controls.emailaddress.value;
        this.emailDetailModel.emailType = this.EmailForm.controls.emailType.value;
        this.emailResponseModel.emailDetailList.push(this.emailDetailModel);
      }
      this.editDetail = false;
      this.EmailTypeModal["first"].nativeElement.click();
    }
  }

  editEmailType(p) {
    this.showhide("Edit");
    this.EmailForm.patchValue(p);
    this.editDetail = true;
    this.EmailForm.controls.emailDetailID.setValue(p.emailDetailID);
  }

  resetForm() {
    this.EmailForm.reset();
    this.emailResponseModel.emailDetailList = [];
    this.EmailForm.controls.ALCode.setValue(0);
    this.EmailForm.controls.messageID.setValue(0);
  }

  getMessageTypes() {
    this.API.getdata('/CargoMessages/getMessageTypes').subscribe(c => {
      if (c != null) {
        this.messageType = c;
        this.defaultMessageType.messageID = 0;
        this.defaultMessageType.MessageType = "Select Message Type";
        this.messageType.push(this.defaultMessageType);
        this.EmailForm.controls.messageID.setValue(0);
        this.emailResponseModel=new emailResponseModel();
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

  getEmails() {
    this.emailResponseModel.emailDetailList = [];
    this.validationForSearch();
    if (this.validForm == true) {
      this.requestEmail.ALCode = this.EmailForm.controls.ALCode.value;
      this.requestEmail.messageID = this.EmailForm.controls.messageID.value;
      this.API.PostData('/CargoMessages/getEmails', this.requestEmail).subscribe(c => {
        if(c==false){
         this.emailResponseModel=new emailResponseModel();
        }
        else
        {
          this.emailResponseModel.emailDetailList = c.emailDetailList;
          this.emailResponseModel = c;
        }
      });
    }
  }

  saveEmails() {
    this.validationForSearch();
    if (this.validForm == true) {
      if (this.emailResponseModel.emailDetailList.length != 0) {
        this.emailResponseModel.ALCode = this.EmailForm.controls.ALCode.value;
        this.emailResponseModel.messageID = this.EmailForm.controls.messageID.value;
        this.API.PostData('/CargoMessages/saveEmail', this.emailResponseModel).subscribe(c => {
          if (c != null) {
            Swal.fire({
              text: "Saved Successfully",
              icon: 'success',
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
      else {
        Swal.fire({
          text: "Enter atleast one Email Type",
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
    }
  }

  resetPopup() {
    this.EmailForm.controls.emailaddress.setValue("");
    this.EmailForm.controls.emailType.setValue("Select Email Type");
  }
}

