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
import { hireoutModel } from '../HireOutModel'
import { DatePipe } from '@angular/common'
import { agencyRequestModel } from "src/app/Pages/AdminArea/Agency/AgencyModel";

@Component({
  selector: 'app-hireout-list',
  templateUrl: './hireout-list.component.html',
  styleUrls: ['./hireout-list.component.css']
})
export class HireoutListComponent implements OnInit {
  agencyResponseModel: agencyRequestModel[];
  defaultAgency: agencyRequestModel;

  viewHireout: hireoutModel;
  hireoutList: hireoutModel[];
  stationResponse: stationResponse[];
  defaultStation: stationResponse;
  defaultGSECat: gseCateRequestModel;
  gseCateResponseModel: gseCateRequestModel[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  hireoutlistFrom: FormGroup;

  constructor(public datepipe: DatePipe,public router: Router, public API: ApiService, public GV: GvarService) {
    this.viewHireout = new hireoutModel();
    this.hireoutList = [];
    this.InitializeForm();
    this.stationResponse = [];
    this.defaultStation = new stationResponse();
    this.gseCateResponseModel = [];
    this.defaultGSECat = new gseCateRequestModel();
    this.agencyResponseModel=[];
    this.defaultAgency=new agencyRequestModel();
  }

  ngOnInit(): void {
    window.scroll(0,0);
    this.getGSECat();
    this.getagency();
    this.getStations();
    this.hireoutlistFrom.controls.isPower.setValue('Both');
  }
  InitializeForm(): any {
    this.hireoutlistFrom = new FormGroup({
      airportID: new FormControl(""),
      StationName: new FormControl(""),
      isPower: new FormControl(""),
      catID: new FormControl(""),
      gsecatID: new FormControl(""),
      agencyID:new FormControl(""),
    });
  }
  getGSECat() {
    this.API.getdata('/Setups/getGSECat').subscribe(c => {
      if (c != null) {
        this.gseCateResponseModel = c;
        this.defaultGSECat.gsecatID = 0;
        this.defaultGSECat.gseCategory = "ALL";
        this.gseCateResponseModel.push(this.defaultGSECat);
        this.hireoutlistFrom.controls.gsecatID.setValue(0);
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
          this.hireoutlistFrom.controls.airportID.setValue(0);
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
      airportID: this.hireoutlistFrom.controls.airportID.value,
      agencyID: this.hireoutlistFrom.controls.agencyID.value
    }
    this.API.PostData('/Hire/getHireout', body).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, true).then((destroyed) => {
          this.hireoutList = c;
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
    this.viewHireout.StationName = p.StationName;
    this.viewHireout.gseMasterID = p.gseMasterID;
    this.viewHireout.airportID = p.airportID;
    this.viewHireout.rasID = p.rasID;
    this.viewHireout.hireoutID = p.hireoutID;
    let inductionDate =this.datepipe.transform(p.inductionDate, 'dd-MMM-yyyy');
    this.viewHireout.flightNo = p.flightNo;
    this.viewHireout.agencyID = p.agencyID;
    this.viewHireout.UOMTypeID = p.UOMTypeID;
    this.viewHireout.qty = p.qty;
    this.viewHireout.Units = p.Units;
    this.viewHireout.Total = p.Total;
    this.viewHireout.createdBy = p.createdBy;
    this.viewHireout.modifiedBy = p.modifiedBy;
    let createdDate =this.datepipe.transform(p.createdDate, 'dd-MMM-yyyy');
    this.viewHireout.createdDate = createdDate;
    let modifiedDate =this.datepipe.transform(p.modifiedDate, 'dd-MMM-yyyy');
    this.viewHireout.modifiedDate = modifiedDate;
    this.viewHireout.gseCategory = p.gseCategory;
    this.viewHireout.airportID = p.airportID;
    this.viewHireout.Remarks = p.Remarks;
    let fromDatetime =this.datepipe.transform(p.fromDatetime, 'dd-MMM-yyyy');
    this.viewHireout.fromDatetime = fromDatetime;
    let toDateTime =this.datepipe.transform(p.toDateTime, 'dd-MMM-yyyy');
    this.viewHireout.toDateTime = toDateTime;
    this.viewHireout.agencyName = p.agencyName;
    this.viewHireout.UOMType = p.UOMType;
  }
  editGSEMaster(p) {
    //localStorage.setItem('airportID',p.hireoutID)
    this.router.navigate(['Hire/HireOut', p.hireoutID]);
  }
  getagency() {
    this.API.getdata('/Setups/getAgenciesList').subscribe(c => {
      if (c != null) {
        this.agencyResponseModel = c;
        this.defaultAgency.agencyID = 0;
        this.defaultAgency.agencyName = "Select Agency";
        this.agencyResponseModel.push(this.defaultAgency);
        this.hireoutlistFrom.controls.agencyID.setValue(0);

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
