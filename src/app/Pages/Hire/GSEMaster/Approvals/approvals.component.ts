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
import { gseDraftModel } from './approvalModel'
import { DatePipe } from '@angular/common'
import { gseMasterResponse } from '../GSEReport/gseReportModel'
@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css']
})
export class ApprovalsComponent implements OnInit {
  @ViewChildren("closeRejectModal") closeRejectModal: ElementRef;
  @ViewChildren("closePopupModal") closePopupModal: ElementRef;
  remarks: string;
  viewGSE: gseMasterResponse;
  viewGSDraft: gseDraftModel;
  gseMasterResponse: gseMasterResponse[];
  approvalResponse: gseDraftModel[];
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

  constructor(public datepipe: DatePipe, public router: Router, public API: ApiService, public GV: GvarService) {
    this.viewGSE = new gseMasterResponse();
    this.gseMasterResponse = [];
    this.viewGSDraft = new gseDraftModel();
    this.approvalResponse = [];
    this.InitializeForm();
    this.responseAirLines = [];
    this.defaultAirline = new responseAirLines();
    this.stationResponse = [];
    this.defaultStation = new stationResponse();
    this.gseCateResponseModel = [];
    this.defaultGSECat = new gseCateRequestModel();
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.getApprovals();
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
  getApprovals() {
    this.API.getdata('/Setups/getApprovals').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, true).then((destroyed) => {
          this.approvalResponse = c;
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
  viewGSEDetail(p) {
    this.viewGSDraft.StationName = p.StationName;
    this.viewGSDraft.gseMasterID = p.gseMasterID;
    this.viewGSDraft.airportID = p.airportID;
    this.viewGSDraft.rasID = p.rasID;
    this.viewGSDraft.gsecatID = p.gsecatID;
    let inductionDate = this.datepipe.transform(p.inductionDate, 'dd-MMM-yyyy');
    this.viewGSDraft.inductionDate = inductionDate;
    this.viewGSDraft.model = p.model;
    this.viewGSDraft.chassisNo = p.chassisNo;
    this.viewGSDraft.draftID = p.draftID;
    this.viewGSDraft.engineNo = p.engineNo;
    this.viewGSDraft.isPower = p.isPower;
    this.viewGSDraft.gStatus = p.gStatus;
    this.viewGSDraft.remarks = p.remarks;
    this.viewGSDraft.createdBy = p.createdBy;
    this.viewGSDraft.gseCategory = p.gseCategory;
    this.viewGSDraft.uomID = p.uomID;
    this.viewGSDraft.uomValue = p.uomValue;
    this.viewGSDraft.YOM = p.YOM;
    this.viewGSDraft.oemDetail = p.oemDetail;
    this.viewGSDraft.UOMName = p.UOMName;
    this.getGSEData(p.gseMasterID, p.airportID);
  }
  editGSEMaster(p) {
    localStorage.setItem('airportID', p.airportID)
    this.router.navigate(['Hire/NewGSEMaster', p.gseMasterID]);
  }
  getGSEData(gseMasterID, airportID) {
    let body = {
      gseMasterID: gseMasterID,
      airportID: airportID,
    }
    this.API.PostData('/Setups/getGSESingleRecord', body).subscribe(c => {
      if (c != null) {
        this.viewGSE = c;
        let inductionDate = this.datepipe.transform(c.inductionDate, 'dd-MMM-yyyy');
        this.viewGSE.inductionDate = inductionDate;
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
  approveGSE() {
    this.API.getdata('/Setups/approveGSEMaster?draftID=' + this.viewGSDraft.draftID).subscribe(c => {
      if (c != null) {
        Swal.fire({
          text: "GSE approved successfully",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.getApprovals();
        this.closePopupModal["first"].nativeElement.click();
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
  rejectGSE() {
    let body = {
      draftID: this.viewGSDraft.draftID,
      Reason: this.remarks,
    }
    this.API.PostData('/Setups/RejectGSEMaster', body).subscribe(c => {
      if (c != null) {
        Swal.fire({
          text: "GSE Rejected successfully",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.getApprovals();
        this.closeRejectModal["first"].nativeElement.click();
        this.closePopupModal["first"].nativeElement.click();
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
