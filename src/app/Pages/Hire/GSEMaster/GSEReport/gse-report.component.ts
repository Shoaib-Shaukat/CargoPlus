import Swal from "sweetalert2/dist/sweetalert2.js";
import { ApiService } from "src/app/Services/API/api.service";
import { GvarService } from "src/app/Services/Globel/gvar.service";
import { FormGroup, FormControl } from "@angular/forms";
import { responseAirLines } from "../../../AdminArea/Models/airLines";
import { stationResponse } from "../../Hirein/hireModel";
import { gseCateRequestModel } from '../../../AdminArea/GSECat/gseCatModel'
import { Router } from '@angular/router';
import { HostListener, Component, OnInit, ViewChildren, ElementRef, QueryList, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ThrowStmt } from "@angular/compiler";
import { gseMasterResponse } from './gseReportModel'
import { DatePipe } from '@angular/common'
@Component({
  selector: 'app-gse-report',
  templateUrl: './gse-report.component.html',
  styleUrls: ['./gse-report.component.css']
})
export class GseReportComponent implements OnInit {
  viewGSE: gseMasterResponse;
  gseMasterResponse: gseMasterResponse[];
  defaultAirline: responseAirLines;
  responseAirLines: responseAirLines[];
  stationResponse: stationResponse[];
  defaultStation: stationResponse;
  defaultGSECat: gseCateRequestModel;
  gseCateResponseModel: gseCateRequestModel[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  gsemasterReportForm: FormGroup;

  constructor(public datepipe: DatePipe,public router: Router, public API: ApiService, public GV: GvarService) {
    this.viewGSE = new gseMasterResponse();
    this.gseMasterResponse = [];
    this.InitializeForm();
    this.responseAirLines = [];
    this.defaultAirline = new responseAirLines();
    this.stationResponse = [];
    this.defaultStation = new stationResponse();
    this.gseCateResponseModel = [];
    this.defaultGSECat = new gseCateRequestModel();
  }

  ngOnInit(): void {
    this.getGSECat();
    this.getStations();
    this.gsemasterReportForm.controls.isPower.setValue('Both');
  }
  InitializeForm(): any {
    this.gsemasterReportForm = new FormGroup({
      airportID: new FormControl(""),
      StationName: new FormControl(""),
      isPower: new FormControl(""),
      catID: new FormControl(""),
      gsecatID: new FormControl(""),
    });
  }
  getGSECat() {
    this.API.getdata('/Setups/getGSECat').subscribe(c => {
      if (c != null) {
        this.gseCateResponseModel = c;
        this.defaultGSECat.gsecatID = 0;
        this.defaultGSECat.gseCategory = "ALL";
        this.gseCateResponseModel.push(this.defaultGSECat);
        this.gsemasterReportForm.controls.gsecatID.setValue(0);
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
  searchGSEMaster() {

  }
  getStations() {
    this.API.getdata("/Generic/getStations").subscribe(
      (c) => {
        if (c != null) {
          this.stationResponse = c;
          this.defaultStation.airportID = 0;
          this.defaultStation.StationName = "ALL";
          this.stationResponse.push(this.defaultStation);
          this.gsemasterReportForm.controls.airportID.setValue(0);
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
  getData() {
    let body = {
      airportID: this.gsemasterReportForm.controls.airportID.value,
      isPower: this.gsemasterReportForm.controls.isPower.value,
      gsecatID: this.gsemasterReportForm.controls.gsecatID.value
    }
    this.API.PostData('/Setups/getGSEReport', body).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, true).then((destroyed) => {
          this.gseMasterResponse = c;
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
  getAgentDetail(p) {
    this.viewGSE.StationName = p.StationName;
    this.viewGSE.gseMasterID = p.gseMasterID;
    this.viewGSE.airportID = p.airportID;
    this.viewGSE.rasID = p.rasID;
    this.viewGSE.gsecatID = p.gsecatID;
    let inductionDate =this.datepipe.transform(p.inductionDate, 'dd-MMM-yyyy');
    this.viewGSE.inductionDate = inductionDate;
    this.viewGSE.model = p.model;
    this.viewGSE.chassisNo = p.chassisNo;
    this.viewGSE.engineNo = p.engineNo;
    this.viewGSE.isPower = p.isPower;
    this.viewGSE.gStatus = p.gStatus;
    this.viewGSE.remarks = p.remarks;
    this.viewGSE.createdBy = p.createdBy;
    this.viewGSE.modifiedBy = p.modifiedBy;
    let modifiedDate =this.datepipe.transform(p.modifiedDate, 'dd-MMM-yyyy');
    this.viewGSE.modifiedDate = modifiedDate;
    let createdDate =this.datepipe.transform(p.createdDate, 'dd-MMM-yyyy');
    this.viewGSE.createdDate = createdDate;
    this.viewGSE.gseCategory = p.gseCategory;
    this.viewGSE.createdByName = p.createdByName;
    this.viewGSE.modifiedByName = p.modifiedByName;
    this.viewGSE.gseImage = p.gseImage;
    this.viewGSE.uomID = p.uomID;
    this.viewGSE.uomValue = p.uomValue;
    this.viewGSE.YOM = p.YOM;
    this.viewGSE.oemDetail = p.oemDetail;
    this.viewGSE.UOMName = p.UOMName;
    this.viewGSE.powerDetail = p.powerDetail;
  }
  editGSEMaster(p) {
    localStorage.setItem('airportID',p.airportID)
    this.router.navigate(['Hire/NewGSEMaster', p.gseMasterID]);
  }
}
