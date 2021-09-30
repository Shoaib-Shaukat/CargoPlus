import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { responseNoticeTypes } from '../Models/noticeTypes';
import { ApiService } from '../../../Services/API/api.service';
import { requestGoods, responseGoods } from '../Models/Goods';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { consigneeResponse } from '../Models/consignee';
import { requestAirLines, responseAirLines } from '../Models/airLines';
import { ThemeService } from 'ng2-charts';
import { noticeDetail, noticeTypeRequest, noticeTypes, noticeTypesRequest } from './NoticeTypeModel';


@Component({
  selector: 'app-notice-types',
  templateUrl: './notice-types.component.html',
  styleUrls: ['./notice-types.component.css']
})
export class NoticeTypesComponent implements OnInit {
  noticeTypesRequest: noticeTypesRequest;
  defaultGoods: responseGoods;
  defaultAirline: responseAirLines;
  @ViewChildren('newNoticeType') newNoticeType: ElementRef;
  noticeTypeRequest: noticeTypeRequest;
  noticeTypes: noticeTypes;
  noticeDetail: noticeDetail;

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

  responseGoods: responseGoods[];
  responseAirLines: responseAirLines[];
  noticeForm: FormGroup;
  responseNoticeTypes: responseNoticeTypes[];

  constructor(public API: ApiService, public GV: GvarService) {
    this.noticeTypesRequest = new noticeTypesRequest();
    this.defaultAirline = new responseAirLines();
    this.defaultGoods = new responseGoods();
    this.responseAirLines = [];
    this.responseNoticeTypes = [];

    this.noticeTypeRequest = new noticeTypeRequest;
    this.noticeTypes = new noticeTypes;
    this.noticeDetail = new noticeDetail;
  }

  ngOnInit(): void {
    this.InitializeForm();
    this.getAirLines();
  }

  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addnewNoticeType = true;
      this.showNoticeTypes = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.noticeForm.controls.isNew.setValue(true);
    }
    if (callfrm == "Cancel") {
      this.addnewNoticeType = false;
      this.showNoticeTypes = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.noticeForm.reset(this.noticeForm.value);
      this.resetForm();
      this.noticeForm.controls.isNew.setValue(false);
    }
    if (callfrm == "Edit") {
      this.addnewNoticeType = true;
      this.showNoticeTypes = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.noticeForm.controls.isNew.setValue(false);
    }
  }
  getGoods() {
    this.API.getdata('/Setups/getNatofGoods').subscribe(c => {
      if (c != null) {
        this.responseGoods = c;
        this.defaultGoods.goodsId = 0;
        this.defaultGoods.Nature = "Select Goods";
        this.responseGoods.push(this.defaultGoods);
        this.noticeForm.controls.goodsId.setValue("0");

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
  InitializeForm(): any {
    this.noticeForm = new FormGroup({
      noticetypeID: new FormControl("", [Validators.required]),
      ALCode: new FormControl(),
      goodsId: new FormControl(),
      Destination: new FormControl(),
      mandatory: new FormControl(),
      isDeleted: new FormControl(),
      Nature: new FormControl(),
      ALName: new FormControl(),
      Schedule: new FormControl(),
      noticeType: new FormControl(),
      isNew: new FormControl(),
      noticedetailID: new FormControl(),


    });
  }
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
        this.defaultAirline.ALCode = 0;
        this.defaultAirline.ALName = "Select Airline";
        this.responseAirLines.push(this.defaultAirline);
        this.noticeForm.controls.ALCode.setValue(0);
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
  validations() {
    if (this.noticeForm.controls.ALCode.value == "" || this.noticeForm.controls.ALCode.value == null) {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.noticeForm.controls.goodsId.value == "" || this.noticeForm.controls.goodsId.value == null) {
      Swal.fire({
        text: "Select Nature of Goods",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.noticeTypeRequest.noticeDetail.length == 0) {
      Swal.fire({
        text: "Add atleast 1 New Notice Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  saveNoticeType() {
    this.validations();
    if (this.validForm == true) {
      this.noticeTypeRequest.noticeType.noticetypeID = this.noticeForm.controls.noticetypeID.value;
      this.noticeTypeRequest.noticeType.ALCode = this.noticeForm.controls.ALCode.value;
      this.noticeTypeRequest.noticeType.goodsId = this.noticeForm.controls.goodsId.value;
      this.noticeTypeRequest.noticeType.isNew = true;

      this.API.PostData('/Setups/saveNoticeTypes', this.noticeTypeRequest).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Notice Type saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
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

  validationForSearch() {
    if (this.noticeForm.controls.ALCode.value == "" || this.noticeForm.controls.ALCode.value == null) {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.searchParameters = false;
      return;
    }
    if (this.noticeForm.controls.goodsId.value == "" || this.noticeForm.controls.goodsId.value == null) {
      Swal.fire({
        text: "Select Goods Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.searchParameters = false;
      return;
    }
    this.validForm = true;
  }

  validationsForPopup() {
    if (this.noticeForm.controls.noticeType.value == "" || this.noticeForm.controls.noticeType.value == null) {
      Swal.fire({
        text: "Enter Notice Type Name",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validInfoPopup = false;
      return;
    }
    this.validInfoPopup = true;
  }
  pushNoticeType() {
    this.validationsForPopup();
    if (this.validInfoPopup == true) {
      if (this.editDetail == true) {
        this.noticeTypeRequest.noticeDetail;
        var noticeTypeDetail = this.noticeTypeRequest.noticeDetail.find(x => x.noticedetailID == this.noticeForm.controls.noticedetailID.value);
        if (noticeTypeDetail != undefined) {
          noticeTypeDetail.noticeType = this.noticeForm.controls.noticeType.value;
          if (this.noticeForm.controls.mandatory.value == null) {
            noticeTypeDetail.mandatory = false;
          }
          else {
            noticeTypeDetail.mandatory = this.noticeForm.controls.mandatory.value;
          }
          this.noticeDetail = noticeTypeDetail;
        }
      }
      else {
        this.noticeDetail = new noticeDetail();
        this.noticeDetail.noticedetailID = this.noticeForm.controls.noticedetailID.value;
        this.noticeDetail.noticetypeID = this.noticeForm.controls.noticetypeID.value;
        this.noticeDetail.noticeType = this.noticeForm.controls.noticeType.value;
        this.noticeDetail.destination = "Europe";
        if (this.noticeForm.controls.mandatory.value == null) {
          this.noticeDetail.mandatory = false;
        }
        else {
          this.noticeDetail.mandatory = this.noticeForm.controls.mandatory.value;
        }
        this.noticeTypeRequest.noticeDetail.push(this.noticeDetail);
      }
      this.noticeForm.get('noticeType').reset();
      this.noticeForm.get('mandatory').reset();
      this.editDetail = false;
      this.newNoticeType["first"].nativeElement.click();
    }
  }
  editNoticeTypes(p) {
    this.showhide("Edit");
    this.noticeForm.patchValue(p);
    this.noticeForm.controls.isNew.setValue(false);
    this.editDetail = true;
  }
  editData() {

    this.noticeTypeRequest.noticeDetail;
    var noticeTypeDetail = this.noticeTypeRequest.noticeDetail.find(x => x.noticedetailID == this.noticeForm.controls.noticedetailID.value);
    if (noticeTypeDetail != undefined) {

    }
  }
  resetForm() {
    this.noticeForm.reset();
    this.defaultAirline = new responseAirLines();
    this.defaultGoods = new responseGoods();
    this.responseAirLines = [];
    this.responseNoticeTypes = [];

    this.noticeTypeRequest = new noticeTypeRequest;
    this.noticeTypes = new noticeTypes;
    this.noticeDetail = new noticeDetail;
    this.getAirLines();
  }
  getNoticeTypes() {
    this.noticeTypesRequest.ALCode = this.noticeForm.controls.ALCode.value;
    this.noticeTypesRequest.goodsId = this.noticeForm.controls.goodsId.value;
    this.API.PostData('/Acceptance/getNoticeTypes', this.noticeTypesRequest).subscribe(c => {
      if (c != null) {
        this.noticeTypeRequest.noticeDetail = c;
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
