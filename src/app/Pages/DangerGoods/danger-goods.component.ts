import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AWBDetail, DangerGoodsRequestModel, DangerGoodsResponseModel, NewExaminationResponse } from './DangerGoods.Model';

@Component({
  selector: 'app-danger-goods',
  templateUrl: './danger-goods.component.html',
  styleUrls: ['./danger-goods.component.css']
})
export class DangerGoodsComponent implements OnInit {
  DangerGoodsResponseModel: DangerGoodsResponseModel;
  DangerGoodsRequestModel: DangerGoodsRequestModel;
  NewExaminationResponse: NewExaminationResponse;
  validForm: boolean = false;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showFlights: boolean = true;
  addnewFlight: boolean = false;
  showDangerGoodsForm: boolean = false;
  showDangerGoodsTable: boolean = false;
  holdShipmentStatus: boolean = false;
  AWBNo: string;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  AWBDetail: AWBDetail;
  AWBForm: FormGroup;
  DangerGoodsForm: FormGroup;
  validPopUpForm: boolean = false;
  delivered: boolean = false;
  editMode: boolean = false;

  constructor(public API: ApiService, public GV: GvarService) {
    this.AWBDetail = new AWBDetail();
    this.InitializeForm();
    this.NewExaminationResponse = new NewExaminationResponse();
    this.DangerGoodsRequestModel = new DangerGoodsRequestModel();
    this.DangerGoodsResponseModel = new DangerGoodsResponseModel();
  }

  ngOnInit(): void {
    this.delivered = false;
  }

  InitializeForm(): any {
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
      ScanningRemarks: new FormControl(""),
    });

    this.DangerGoodsForm = new FormGroup({
      dgID: new FormControl(""),
      acceptanceID: new FormControl(""),
      createdBy: new FormControl(""),
      createdDate: new FormControl(""),
      ClassDetail: new FormControl(""),
      UNNumber: new FormControl(""),
      subRisk: new FormControl(""),
      packagesNo: new FormControl(""),
      netQuantity: new FormControl(""),
      materialCat: new FormControl(""),
      packingGroup: new FormControl(""),
      code: new FormControl(""),
      CAO: new FormControl(""),
      ERGCode: new FormControl(""),
      isNew: new FormControl(""),
      AWBNo: new FormControl(""),
    });
  }

  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addnewFlight = true;
      this.showFlights = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
    }
    if (callfrm == "Cancel") {
      this.addnewFlight = false;
      this.showFlights = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
    }
    if (callfrm == "Edit") {
      this.addnewFlight = true;
      this.showFlights = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
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
            }
            else {
              resolve(true);
            }
          }
        });
    });
  };

  resetAcceptance() {
    this.holdShipmentStatus = false;
    this.AWBForm.reset();
    this.DangerGoodsForm.reset();
    this.DangerGoodsRequestModel = new DangerGoodsRequestModel();
    this.DangerGoodsResponseModel = new DangerGoodsResponseModel();
    this.destroyDT(0, false).then(destroyed => {
      this.dtTrigger.next();
    });
    this.delivered = false;
    this.editMode = false;
    this.showhide('Cancel');
  }

  disableAllForms() {
    this.delivered = true;
    this.AWBForm.disable();
    this.DangerGoodsForm.disable();
  }



  getAWBDetail() {
    this.resetAcceptance();
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
        this.API.getdata('/DGShipment/getDGShipment?AWBNo=' + this.AWBNo).subscribe(x => {
          if (x != null) {
            this.DangerGoodsResponseModel = x;
            this.DangerGoodsForm.patchValue(this.DangerGoodsResponseModel);
          }
        },
          error => {
            Swal.fire({
              text: error.error.Message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
            this.DangerGoodsForm.reset();
          });
      }
      else {
        this.resetAcceptance();
        Swal.fire({
          text: "Enter Correct AWB Number!",
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
      });
  }

  Validations() {
    if (this.AWBForm.controls.AWBNo.value == "" || this.AWBForm.controls.AWBNo.value == null) {
      Swal.fire({
        text: "Search AWB Detail First!",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }

  saveDangerGood() {
    this.Validations();
    if (this.validForm == true) {
      this.DangerGoodsForm.controls.isNew.setValue(true);
      if (this.DangerGoodsForm.controls.dgID.value == "" || this.DangerGoodsForm.controls.dgID.value == undefined) {
        this.DangerGoodsForm.controls.dgID.setValue(null);
      }
      this.DangerGoodsForm.controls.AWBNo.setValue(this.AWBNo);
      this.DangerGoodsRequestModel = this.DangerGoodsForm.value;
      this.DangerGoodsRequestModel.acceptanceID = this.AWBForm.controls.acceptanceID.value;
      this.API.PostData('/DGShipment/CreateDGShipment', this.DangerGoodsRequestModel).subscribe(c => {
        if (c != null) {
          this.editMode = false;
          Swal.fire({
            text: "Danger Good Saved Successfully",
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
      return
    }
  }
}
