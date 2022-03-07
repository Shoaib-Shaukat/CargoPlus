import { agencyRequestModel } from '../../../../Pages/AdminArea/Agency/AgencyModel'
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ApiService } from "src/app/Services/API/api.service";
import { GvarService } from "src/app/Services/Globel/gvar.service";
import { FormGroup, FormControl } from "@angular/forms";
import { responseAircraftCategory } from '../../../AdminArea/AirCraftCat/CraftModel';
import { responseAirLines } from "../../../AdminArea/Models/airLines";
import { stationResponse } from "../../Hirein/hireModel";
import { requestSearch, getDashBoardData, getDetail,hireoutModel } from './dashBoardModel'
import { gseCateRequestModel } from '../../../AdminArea/GSECat/gseCatModel'
import { Router } from '@angular/router';
import { ChartType, ChartOptions, ChartDataSets, } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { DataTableDirective } from 'angular-datatables';
import { HostListener, Component, OnInit, ViewChildren, ElementRef, QueryList, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-hireout-dashboard',
  templateUrl: './hireout-dashboard.component.html',
  styleUrls: ['./hireout-dashboard.component.css']
})
export class HireoutDashboardComponent implements OnInit {

  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  getDetail: hireoutModel[];
  showCharts: boolean = false;
  pieChartOptions: ChartOptions;
  pieChartLabels: Label[];
  pieChartData: SingleDataSet;
  pieChartType: ChartType;
  pieChartPlugins = [pluginDataLabels];
  gseCount = [];
  stationCount = [];
  getDashBoardData = new getDashBoardData();
  requestSearch: requestSearch;
  public barChartLabelGSEWise: Label[];
  public barCharDataGSEWise: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];
  // GESE Wise Chart Variables
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];
  public barChartOptions: ChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'black',
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 4000,
      easing: 'easeInOutElastic',
    },
    legend: {
      display: false,
      position: 'left'
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }
      ]
    }
  }

  // Station Wise Chart Variables
  public barChartLabelStationWise: Label[];
  public barCharDataStationWise: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];
  public barChartTypeStationWise: ChartType = 'bar';
  public barChartPluginsStationWise = [];
  public barChartOptionsStationWise: ChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'black',
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 4000,
      easing: 'easeInOutElastic',
    },
    legend: {
      display: false,
      position: 'left'
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }
      ]
    }
  }
  // Month Wise Chart Variables
  MonthWiseCount = [];
  public barChartLabelMonthWise: Label[];
  public barCharDataMonthWise: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];
  public barChartTypeMonthWise: ChartType = 'bar';
  public barChartPluginsMonthWise = [];
  public barChartOptionsMonthWise: ChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'black',
      }
    },
    legend: {
      display: false,
      position: 'left'
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }
      ]
    }
  }
  // Agency Wise Char Variables
  AgencyCount = [];
  public pieChartLabelAgencyWise: Label[];
  public pieCharDataAgencyWise: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];

  public pieChartTypeAgencyWise: ChartType = 'pie';
  public pieChartPluginsAgencyWise = [];
  public pieChartOptionsAgencyWise: ChartOptions = {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr: any[] = ctx.chart.data.datasets[0].data;
          dataArr.map((data: number) => {
            sum += data;
          });
          let percentage = (value * 100 / sum).toFixed(2) + "%";
          return percentage;
        },
        color: '#fff',
      }
    },
    
    legend: {
      display: true,
      position: 'left'
    },
  }
  // Power Wise Char Variables
  PowerCount = [];
  public pieChartLabelPowerWise: Label[];
  public pieCharDataPowerWise: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];
  public pieChartTypePowerWise: ChartType = 'pie';
  public pieChartPluginsPowerWise = [];
  public pieChartOptionsPowerWise: ChartOptions = {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr: any[] = ctx.chart.data.datasets[0].data;
          dataArr.map((data: number) => {
            sum += data;
          });
          let percentage = (value * 100 / sum).toFixed(2) + "%";
          return percentage;
        },
        color: '#fff',
      }
    },
    legend: {
      display: true,
      position: 'left'
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }
      ]
    }
  }
  gseCateResponseModel: gseCateRequestModel[];
  defaultGSECat: gseCateRequestModel;
  dashBoardForm: FormGroup;
  validForm: boolean = false;
  stationResponse: stationResponse[];
  defaultStation: stationResponse;
  defaultAirline: responseAirLines;
  responseAirLines: responseAirLines[];
  defaultCat: responseAircraftCategory;
  responseAircraftCategory: responseAircraftCategory[];
  defaultAgency: agencyRequestModel;
  agencyResponseModel: agencyRequestModel[];
  constructor(public router: Router, public API: ApiService, public GV: GvarService) {
    this.getDetail = [];
    this.InitializeForm();
    this.InitializeForm();
    this.agencyResponseModel = [];
    this.defaultAgency = new agencyRequestModel();
    this.responseAircraftCategory = [];
    this.defaultCat = new responseAircraftCategory();
    this.responseAirLines = [];
    this.defaultAirline = new responseAirLines();
    this.stationResponse = [];
    this.defaultStation = new stationResponse();
    this.gseCateResponseModel = [];
    this.defaultGSECat = new gseCateRequestModel();
    this.requestSearch = new requestSearch();
    this.getDashBoardData = new getDashBoardData();
  }
  // public pieChartOptionsPowerWise: any = {
  //   pieceLabel: {
  //     render: function (args) {
  //       const label = args.label,
  //             value = args.value;
  //       return label + ': ' + value;
  //     }
  //   }
  // }
  private createOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        labels: {
          render: 'percentage',
          fontColor: ['green', 'white', 'red'],
          precision: 2
        }
      },
    };
  }
  ngOnInit(): void {
    window.scroll(0,0);

    this.getagency();
    this.getStations();
    this.getCatData();
    this.getGSECat();
    this.pieChartOptionsPowerWise;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel','pdf'
      ]
    };
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.dashBoardForm.get('fromDate').patchValue(this.formatDate(new Date(y, m, 1)));
    this.dashBoardForm.get('ToDate').patchValue(this.formatDate(new Date(y, m + 1, 0)));
    this.searchHireIn();
  }
  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  InitializeForm(): any {
    this.dashBoardForm = new FormGroup({
      ALCode: new FormControl(""),
      ALName: new FormControl(""),
      airportID: new FormControl(""),
      StationName: new FormControl(""),
      agencyID: new FormControl(""),
      agencyName: new FormControl(""),
      fromDate: new FormControl(""),
      ToDate: new FormControl(""),
      catID: new FormControl(""),
      catName: new FormControl(""),
      Remarks: new FormControl(""),
      hireinDate: new FormControl(""),
      flightNo: new FormControl(""),
      hireinId: new FormControl(""),
      gsecatID: new FormControl(""),
    });
  }
  getagency() {
    this.API.getdata('/Setups/getAgenciesList').subscribe(c => {
      if (c != null) {
        this.agencyResponseModel = c;
        this.defaultAgency.agencyID = 0;
        this.defaultAgency.agencyName = "ALL";
        this.agencyResponseModel.push(this.defaultAgency);
        this.dashBoardForm.controls.agencyID.setValue(0);
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
  resetHireIn() {
    this.dashBoardForm.reset();
    this.dashBoardForm.controls.agencyID.setValue(0);
  }

  getStations() {
    this.API.getdata("/Generic/getStations").subscribe(
      (c) => {
        if (c != null) {
          this.stationResponse = c;
          this.defaultStation.airportID = 0;
          this.defaultStation.StationName = "ALL";
          this.stationResponse.push(this.defaultStation);
          this.dashBoardForm.controls.airportID.setValue(0);
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
  validations() {
    if (this.dashBoardForm.controls.fromDate.value == "" || this.dashBoardForm.controls.fromDate.value == undefined || this.dashBoardForm.controls.fromDate.value == null) {
      Swal.fire({
        text: "Select From Date.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    if (this.dashBoardForm.controls.ToDate.value == "" || this.dashBoardForm.controls.ToDate.value == undefined || this.dashBoardForm.controls.ToDate.value == null) {
      Swal.fire({
        text: "Select To Date.",
        icon: "error",
        confirmButtonText: "OK",
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  getCatData() {
    this.API.getdata('/Flights/getAircraftCategory').subscribe(c => {
      if (c != null) {
        this.responseAircraftCategory = c;
        this.defaultCat.catID = 0;
        this.defaultCat.catName = "ALL";
        this.responseAircraftCategory.push(this.defaultCat);
        this.dashBoardForm.controls.catID.setValue(0);



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
  getGSECat() {
    this.API.getdata('/Setups/getGSECat').subscribe(c => {
      if (c != null) {
        this.gseCateResponseModel = c;
        this.defaultGSECat.gsecatID = 0;
        this.defaultGSECat.gseCategory = "ALL";
        this.gseCateResponseModel.push(this.defaultGSECat);
        this.dashBoardForm.controls.gsecatID.setValue(0);


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
  searchHireIn() {
    this.validations();
    if (this.validForm == true) {
      this.requestSearch.agencyID = this.dashBoardForm.controls.agencyID.value;
      this.requestSearch.airportID = this.dashBoardForm.controls.airportID.value;
      this.requestSearch.catID = this.dashBoardForm.controls.catID.value;
      this.requestSearch.fromDate = this.dashBoardForm.controls.fromDate.value;
      this.requestSearch.ToDate = this.dashBoardForm.controls.ToDate.value;
      this.requestSearch.gsecatID = this.dashBoardForm.controls.gsecatID.value;
      this.API.PostData('/Hire/getDashBoardDataHireout', this.requestSearch).subscribe(c => {
        if (c != null) {
          this.getDashBoardData = c;
          this.getDetailReport();
          this.showCharts = true;
          this.gseCount = this.getDashBoardData.getGSEHired.map((item) => {
            return item.number;
          });
          this.barCharDataGSEWise = [{ data: this.gseCount, backgroundColor: ['#5446eb', '#2492e0', '#e07924', '#78716b', '#5446eb', '#2492e0', '#e07924', '#78716b', '#78716b', '#5446eb', '#2492e0', '#78716b'], hoverBackgroundColor: ['#a1bbf7', '#afdaed', '#ede31f', '#c9c9bd', '#5446eb', '#2492e0', '#e07924', '#78716b', '#78716b', '#5446eb', '#2492e0', '#78716b'], fill: false }];
          var gseCategory = [];
          gseCategory = this.getDashBoardData.getGSEHired.map((item) => {
            return item.gseCategory;
          });
          this.barChartLabelGSEWise = gseCategory;
          // Station Wise Bar Chart Setting and Data Load

          this.stationCount = this.getDashBoardData.stationWise.map((item) => {
            return item.number;
          });
          this.barCharDataStationWise = [{ data: this.stationCount, backgroundColor: ['#5446eb', '#2492e0', '#e07924', '#78716b', '#78716b', '#5446eb', '#2492e0', '#78716b'], hoverBackgroundColor: ['#a1bbf7', '#afdaed', '#ede31f', '#c9c9bd'], fill: false }];
          var stationName = [];
          stationName = this.getDashBoardData.stationWise.map((item) => {
            return item.StationName;
          });
          this.barChartLabelStationWise = stationName;
          // Agency Wise Bar Chart Setting and Data Load
          this.AgencyCount = this.getDashBoardData.AgencyWise.map((item) => {
            return item.number;
          });
          this.pieCharDataAgencyWise = [{ data: this.AgencyCount, backgroundColor: ['#5446eb', '#2492e0', '#e07924', '#78716b', '#5446eb', '#2492e0', '#78716b'], hoverBackgroundColor: ['#a1bbf7', '#afdaed', '#ede31f', '#c9c9bd'] }];
          var AgencyName = [];
          AgencyName = this.getDashBoardData.AgencyWise.map((item) => {
            return item.agencyName;
          });
          this.pieChartLabelAgencyWise = AgencyName;
          // Power Wise Bar Chart Setting and Data Load
          this.PowerCount = this.getDashBoardData.PowerWise.map((item) => {
            return item.number;
          });
          this.pieCharDataPowerWise = [{ data: this.PowerCount, backgroundColor: ['#5446eb', '#2492e0', '#e07924', '#78716b', '#78716b', '#5446eb', '#2492e0', '#78716b'], hoverBackgroundColor: ['#a1bbf7', '#afdaed', '#ede31f', '#c9c9bd'] },];
          var PowerName = [];
          PowerName = this.getDashBoardData.PowerWise.map((item) => {
            return item.Power;
          });
          this.pieChartLabelPowerWise = PowerName;
          // Month Wise Bar Chart Setting and Data Load
          this.MonthWiseCount = this.getDashBoardData.MonthWise.map((item) => {
            return item.number;
          });
          this.barCharDataMonthWise = [{ data: this.MonthWiseCount, backgroundColor: ['#5446eb', '#2492e0', '#e07924', '#78716b', '#78716b', '#5446eb', '#2492e0', '#78716b'], hoverBackgroundColor: ['#a1bbf7', '#afdaed', '#ede31f', '#c9c9bd'] }];
          var MonthName = [];
          MonthName = this.getDashBoardData.MonthWise.map((item) => {
            return item.Month;
          });
          this.barChartLabelMonthWise = MonthName;

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
  destroyDT = (tableIndex, clearData): Promise<boolean> => {
    return new Promise((resolve) => {
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

          }
          else {
            resolve(true);
          }

        }
      });
    });
  };
  getDetailReport() {
    this.validations();
    if (this.validForm == true) {
      this.requestSearch.agencyID = this.dashBoardForm.controls.agencyID.value;
      this.requestSearch.airportID = this.dashBoardForm.controls.airportID.value;
      this.requestSearch.fromDate = this.dashBoardForm.controls.fromDate.value;
      this.requestSearch.ToDate = this.dashBoardForm.controls.ToDate.value;
      this.requestSearch.gsecatID = this.dashBoardForm.controls.gsecatID.value;
      this.API.PostData('/Hire/getDetailhireout', this.requestSearch).subscribe(c => {
        if (c != null) {
          this.destroyDT(0, true).then((destroyed) => {
            this.getDetail = c;
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
  public convetToPDF(elementID) {
    var data = document.getElementById(elementID);
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('new-file.pdf'); // Generated PDF
    });
  }
}
