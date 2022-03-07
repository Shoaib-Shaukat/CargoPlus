import { Component, OnInit, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { requestCommodity, responseCommodity } from '../Models/commodity';
import { ApiService } from '../../../Services/API/api.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { requestGoods, responseGoods } from '../Models/Goods';
@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.css']
})
export class CommodityComponent implements OnInit {
  responseGoods: responseGoods[];
  @Output() notifyComid = new EventEmitter<string>();
  selectCommodity(value: string) {
    this.notifyComid.emit(value);
  }
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  viewCommodity: responseCommodity;
  validForm: boolean = false;
  requestCommodity: requestCommodity;
  selectedRegion: number;
  selectedCountry: number;
  commodityForm: FormGroup;
  responseRegions: responseRegions[];
  responseCountries: responseCountries[];
  responseCity: responseCity[];
  requestCity: requestCity;
  requestStRegions: requestStRegions;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showCommodity: boolean = true;
  addnewCommodity: boolean = false;
  responseCommodity: responseCommodity[];
  constructor(public API: ApiService, public GV: GvarService) {
    this.responseGoods = [];
    this.requestCity = new requestCity();
    this.requestStRegions = new requestStRegions();
    this.responseCity = [];
    this.responseCountries = [];
    this.responseRegions = [];
    this.requestCommodity = new requestCommodity();
    this.viewCommodity = new responseCommodity();
  }
  InitializeForm(): any {
    this.commodityForm = new FormGroup({
      comm_description: new FormControl("", [Validators.required]),
      handlingCodes: new FormControl("", [Validators.required]),
      comid: new FormControl("", [Validators.required]),
      suppInfo: new FormControl("", [Validators.required]),
      isNew: new FormControl(""),
      goodsId: new FormControl(""),
      showonNOTOC: new FormControl(""),
    });
  }
  ngOnInit(): void {
    window.scroll(0,0);
    this.InitializeForm();
    this.responseCommodity = [];
    this.getCommodity();
    this.getGoods();

  }
  getCommodity() {
    this.API.getdata('/Setups/getCommodity').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.responseCommodity = c;
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
  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addnewCommodity = true;
      this.showCommodity = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.requestCommodity.isNew = true;
    }
    if (callfrm == "Cancel") {
      this.addnewCommodity = false;
      this.showCommodity = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.commodityForm.reset(this.commodityForm.value);
      this.resetForm();
      this.requestCommodity.isNew = false;
    }
    if (callfrm == "Edit") {
      this.addnewCommodity = true;
      this.showCommodity = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.requestCommodity.isNew = false;
    }
  }
  resetForm(value: any = undefined) {
    this.commodityForm.reset(value);
    // (this as {submitted:boolean}.submitted=false);
  }
  saveCommodity(status) {
    this.validations();
    if (this.validForm == true) {
      if (status == "New") {
        this.commodityForm.controls.isNew.setValue(true);
      }
      else {
        this.commodityForm.controls.isNew.setValue(false);
      }
      if (this.commodityForm.controls.showonNOTOC.value == "" || this.commodityForm.controls.showonNOTOC.value == null) {
        this.commodityForm.controls.showonNOTOC.setValue(false);
      }
      this.requestCommodity.comm_description = this.commodityForm.controls.comm_description.value;
      this.requestCommodity.handlingCodes = this.commodityForm.controls.handlingCodes.value;
      this.requestCommodity.comid = this.commodityForm.controls.comid.value;
      this.requestCommodity.suppInfo = this.commodityForm.controls.suppInfo.value;
      this.requestCommodity.isNew = this.commodityForm.controls.isNew.value;
      this.requestCommodity.goodsId = this.commodityForm.controls.goodsId.value;
      this.requestCommodity.showonNOTOC = this.commodityForm.controls.showonNOTOC.value;
      this.API.PostData('/Setups/saveCommodity', this.requestCommodity).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Commodity saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getCommodity();
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
    if (this.commodityForm.controls.comm_description.value == "" || this.commodityForm.controls.comm_description.value == null) {
      Swal.fire({
        text: "Enter Commodity Description",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.commodityForm.controls.handlingCodes.value == "" || this.commodityForm.controls.handlingCodes.value == null) {
      Swal.fire({
        text: "Handling Codes",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.commodityForm.controls.handlingCodes.value.length != 3) {
      Swal.fire({
        text: "Handling Codes should be of 3 characters",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editCommodity(p) {
    this.showhide("Edit");
    this.commodityForm.patchValue({
      comid: p.comid,
      comm_description: p.comm_description,
      handlingCodes: p.handlingCodes,
      goodsId: p.goodsId,
      suppInfo: p.suppInfo,
      showonNOTOC: p.showonNOTOC
    })
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


  setComid(value) {
    if (this.GV.GoodsCallFrom == "CommodityDetail") {
      this.notifyComid.emit(value);
    }
  }
  getGoods() {
    this.API.getdata('/Setups/getNatofGoods').subscribe(c => {
      if (c != null) {
        this.responseGoods = c;
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
  showNOTOC(status) {
    if (status == true) {
      this.commodityForm.controls.showonNOTOC.setValue(true);
    } else {
      this.commodityForm.controls.showonNOTOC.setValue(false);
    }
  }


}

