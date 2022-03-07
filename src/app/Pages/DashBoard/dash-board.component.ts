import { HostListener,Component, OnInit, ViewChildren, ElementRef,QueryList,ViewChild } from '@angular/core';
import { ApiService } from '../../Services/API/api.service';
import { GvarService } from '../../Services/Globel/gvar.service'
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CargoDashBoadModel,ExaminationModel ,BuildupModel} from './Model/DashBoardModel';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {PopoutService} from '../Shared/Service/popout.service';
@HostListener('window:beforeunload', ['$event'])
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  BuildupModel:BuildupModel[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dtOptions1: any = {};
  dtTrigger1: Subject<any> = new Subject();
  dataTable: any;
  tableData = [];

  CargoDashBoadModel:CargoDashBoadModel;
  ExaminationModel:ExaminationModel[];
  
  
  constructor( public route: Router,private popoutService: PopoutService,public API: ApiService, public GV: GvarService, private router: Router) {
    this.CargoDashBoadModel=new CargoDashBoadModel();
    this.ExaminationModel=[];
    this.BuildupModel=[];
  }

  ngOnInit(): void {
    window.scroll(0,0);
    this.MissingEntries();
  }
  getDetailedExamination(){
    this.API.getdata('/DashBoard/GetMissingExaminatinDetail').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.ExaminationModel=c;
          this.dtTrigger.next();
        });
      }
    },  (err) => {
      console.log('-----> err', err);
    });
  }
  GetMissingScanningDetail(){
    this.API.getdata('/DashBoard/GetMissingScanningDetail').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.ExaminationModel=c;
          this.dtTrigger.next();
        });
      }
    },  (err) => {
      console.log('-----> err', err);
    });
  }
  MissingEntries(){
    this.API.getdata('/DashBoard/MissingEntries').subscribe(c => {
      if (c != null) {
          this.CargoDashBoadModel=c;
      }
    },  (err) => {
      console.log('-----> err', err);
    });
  }
  destroyDT = (tableIndex, clearData): Promise<boolean> => {
    return new Promise((resolve) => {
      if(this.datatableElement)
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
  GetMissingBuildupFW(){
    this.API.getdata('/DashBoard/GetMissingBuildupFW').subscribe(c => {
      if (c != null) {
        this.destroyDT(1, false).then(destroyed => {
          this.BuildupModel=c;
          this.dtTrigger1.next();
        });
      }
    },  (err) => {
      console.log('-----> err', err);
    });
  }
  GetMissingBuildupSW(){
    this.API.getdata('/DashBoard/GetMissingBuildupSW').subscribe(c => {
      if (c != null) {
        this.destroyDT(1, false).then(destroyed => {
          this.BuildupModel=c;
          this.dtTrigger1.next();
        });
      }
    },  (err) => {
      console.log('-----> err', err);
    });
  }
  GetMissingBuildupGW(){
    this.API.getdata('/DashBoard/GetMissingBuildupGW').subscribe(c => {
      if (c != null) {
        this.destroyDT(1, false).then(destroyed => {
          this.BuildupModel=c;
          this.dtTrigger1.next();
        });
      }
    },  (err) => {
      console.log('-----> err', err);
    });
  }
}