import { Component, OnInit, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { requestGoods, responseGoods } from '../Models/Goods';
import { ApiService } from '../../../Services/API/api.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'


@Component({
  selector: 'app-nature-of-goods',
  templateUrl: './nature-of-goods.component.html',
  styleUrls: ['./nature-of-goods.component.css']
})
export class NatureOfGoodsComponent implements OnInit {
  @Output() notifyAWB = new EventEmitter<string>();
  @Output() notifyHouse = new EventEmitter<string>();
  selectNature(value: string) {
    this.notifyAWB.emit(value);
  }
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  viewGoods: responseGoods;
  validForm: boolean = false;
  requestGoods: requestGoods;
  selectedRegion: number;
  selectedCountry: number;
  goodsForm: FormGroup;
  responseRegions: responseRegions[];
  responseCountries: responseCountries[];
  responseCity: responseCity[];
  requestCity: requestCity;
  requestStRegions: requestStRegions;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showGoods: boolean = true;
  addnewGoods: boolean = false;
  responseGoods: responseGoods[];
  constructor(public API: ApiService, public GV: GvarService) {
    this.requestCity = new requestCity();
    this.requestStRegions = new requestStRegions();
    this.responseCity = [];
    this.responseCountries = [];
    this.responseRegions = [];
    this.requestGoods = new requestGoods();
    this.viewGoods = new responseGoods();
  }
  InitializeForm(): any {
    this.goodsForm = new FormGroup({
      Nature: new FormControl("", [Validators.required]),
      cutTime: new FormControl("", [Validators.required]),
      destination: new FormControl("", [Validators.required]),
      goodsId: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.responseGoods = [];
    this.getGoods();

  }
  getGoods() {
    this.API.getdata('/Setups/getNatofGoods').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.responseGoods = c;

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
      this.addnewGoods = true;
      this.showGoods = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.requestGoods.isNew = true;
    }
    if (callfrm == "Cancel") {
      this.addnewGoods = false;
      this.showGoods = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.goodsForm.reset(this.goodsForm.value);
      this.resetForm();
      this.requestGoods.isNew = false;
    }
    if (callfrm == "Edit") {
      this.addnewGoods = true;
      this.showGoods = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.requestGoods.isNew = false;
    }
  }
  resetForm(value: any = undefined) {
    this.goodsForm.reset(value);
    // (this as {submitted:boolean}.submitted=false);
  }
  saveGoods() {
    this.validations();
    if (this.validForm == true) {
      this.requestGoods.Nature = this.goodsForm.controls.Nature.value;
      this.requestGoods.cutTime = this.goodsForm.controls.cutTime.value;
      this.requestGoods.destination = this.goodsForm.controls.destination.value;
      this.requestGoods.goodsId = this.goodsForm.controls.goodsId.value;
      this.API.PostData('/Setups/saveNatureofGoods', this.requestGoods).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Nature of goods saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getGoods();
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
    if (this.goodsForm.controls.Nature.value == "" || this.goodsForm.controls.Nature.value == null) {
      Swal.fire({
        text: "Please enter nature of goods.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.goodsForm.controls.cutTime.value == "" || this.goodsForm.controls.cutTime.value == null) {
      Swal.fire({
        text: "Please enter cut of time.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.goodsForm.controls.destination.value == "" || this.goodsForm.controls.destination.value == null) {
      Swal.fire({
        text: "Please enter destination.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editGoods(p, i) {
    this.showhide("Edit");
    this.goodsForm.setValue({
      goodsId: p.goodsId,
      Nature: p.Nature,
      cutTime: p.cutTime,
      destination: p.destination,
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
  setGoods(value) {
    if (this.GV.GoodsCallFrom == "AWBDetail") {
      this.notifyAWB.emit(value);
    }
    if (this.GV.GoodsCallFrom == "AWBHouse") {
      this.notifyHouse.emit(value);
    }

  }
}

