import { HostListener,Component, OnInit, ViewChildren, ElementRef,QueryList,ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NumberValueAccessor } from '@angular/forms';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { MultiDataSet, Label, Color ,SingleDataSet} from 'ng2-charts';
import { ApiService } from '../../Services/API/api.service';
import { GvarService } from '../../Services/Globel/gvar.service'
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { requestModel, userwiseResponse,serverStatus,waiters,singleUserRequest,singleDateResponse,selectedItems,selectedLocations } from './Model/DashBoardModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {Locations} from '../Login/Model/locations'
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {POPOUT_MODAL_DATA, POPOUT_MODALS, PopoutData, PopoutModalName} from '../Shared/Service/popout.tokens';
import {PopoutService} from '../Shared/Service/popout.service';
@HostListener('window:beforeunload', ['$event'])
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  selectedLocations:selectedLocations;
  objselectedItems:selectedItems;
  reportdate:string;
  totalUldRequest:any;
  totalUldRecieved:any;
  singleDateResponse:singleDateResponse[];
  singleUserRequest:singleUserRequest;
  @ViewChildren('closeDateModal') closeDateModal: ElementRef;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions0: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();

  dateFormat:string="dd-MMMM-yyyy";
  userwiseResponse:userwiseResponse;
  grandTotal:number=0;
  colors = [{ status: "Passed", color: "red" }, { status: "Approuved", color: "red" }, 
                { status: "warning", color: "green" }, { status: "Ignored", color: "yellow" }]
  serverStatus:serverStatus[];
  waiters:waiters[];
  Locations:Locations[];
  dropdownList = [];
  selectedItems :selectedItems[];
  dropdownSettings: IDropdownSettings = { 
    singleSelection: false,
    idField: 'locationID',
    textField: 'locationName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 8,
    allowSearchFilter: true
  };
  
  showBarChart: boolean = false;
  selectedReport:string="";
  selectedData:string;
  validForm: boolean = false;
  showpieChart:boolean=false;
  disableDate:boolean=true;
  complaintCount=[];
  chartSelectedValue: string = "bar";
  // PIE Chart 
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      labels: {
        //fontFamily: '"Arvo", serif',
        fontSize: 20,
      }
    }
  };
  public pieChartLabels: Label[];
  public pieChartData: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];


  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  // En PieChart
  // Bar chart Start
  public barChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          return "Rs " + Number(tooltipItem.yLabel).toFixed(0).replace(/./g, function (c, i, a) {
            return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
          });
        }
      }
    },
    scales: {
      xAxes: [{
        ticks: {}
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 500000,
          // Return an empty string to draw the tick line but hide the tick label
          // Return `null` or `undefined` to hide the tick line entirely
          callback: function (value, index, values) {
            // Convert the number to a string and splite the string every 3 charaters from the end
            // value = value.toString();
            // values = value.split(/(?=(?:...)*$)/);
            // // Convert the array to a string and format the output
            // value = values.join(',');
            // return 'PKR - ' + value;
            var val=Number(value) / 1e6 + 'M';
            return val
            
          }
        }
      }]
    }
  };
  public barChartLabels: Label[];
  public barChartData: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];

  public barChartLabelsNaturewise: Label[];
  public barChartDataNaturewise: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];

  public barChartLabelsTrending: Label[];
  public barChartDataTrending: ChartDataSets[] = [
    { data: [12, 68, 6] }
  ];

  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  // End Bar chart
  DashBoardForm: FormGroup;
  valueFrom: Date;
  requestModel: requestModel;
  valueFromTime: Date = new Date();
  valueTo: Date;
  valueToTime: Date = new Date();
  fromDate = new Date();
  toDate = new Date();
  
  constructor(private popoutService: PopoutService,public API: ApiService, public GV: GvarService, private router: Router) {
    this.requestModel = new requestModel();
    this.selectedLocations=new selectedLocations();
    this.userwiseResponse = new userwiseResponse();
    this.singleUserRequest=new singleUserRequest();
    this.singleDateResponse=[];
    this.Locations=[];
    this.serverStatus=[];
    this.waiters=[];
    this.selectedItems=[];
    this.selectedItems=[];
    this.objselectedItems=new selectedItems();
  }

  ngOnInit(): void {
    this.getTotalULDRequest();
   this.getTotalULDReceived();
  }
  InitializeForm(): any {
    this.DashBoardForm = new FormGroup({
      dateFrom: new FormControl(this.valueFrom, [Validators.required]),
      dateTo: new FormControl(this.valueTo, [Validators.required]),
      reportType: new FormControl('', [Validators.required]),
      pmtMode: new FormControl('', [Validators.required]),
      selectedWaiter: new FormControl('', [Validators.required]),

    });
  }
  getTotalULDRequest(){
    // debugger
    // this.API.getdata('/DashboardsULD/getTotalUldRequest').subscribe(c => {
    //   debugger
    //   if (c != null) {
       
    //     this.totalUldRequest = c;
        
    //   }
    // },
    //   error => {
    //     debugger
    //     Swal.fire({
    //       text: error.error.Message,
    //       icon: 'error',
    //       confirmButtonText: 'OK'
    //     });
    //   });
  }
  getTotalULDReceived(){
    // debugger
    // this.API.getdata('/DashboardsULD/getTotalUldReceived').subscribe(c => {
    //   debugger
    //   if (c != null) {
       
    //     this.totalUldRecieved = c;
        
    //   }
    // },
    //   error => {
    //     debugger
    //     Swal.fire({
    //       text: error.error.Message,
    //       icon: 'error',
    //       confirmButtonText: 'OK'
    //     });
    //   });
  }
}
