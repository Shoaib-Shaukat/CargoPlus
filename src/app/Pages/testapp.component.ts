import { Component, OnInit,OnDestroy  } from '@angular/core';
import { ApiService } from 'src/app/Services/API/api.service';
import {buildupModel} from './AirCargoManifest/Manifest/ManifestModel'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-testapp',
  templateUrl: './testapp.component.html',
  styleUrls: ['./testapp.component.css']
})
export class TestappComponent implements OnInit,OnDestroy  {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  buildupModel:buildupModel[];
  ULDArr: buildupModel[];

  constructor(public API: ApiService) {
    this.buildupModel=[];
    this.ULDArr=[];
   }
   ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  ngOnInit(): void {
    this.getULDs();
  }
  getULDs() {
    this.API.getdata('/Manifest/getULDs').subscribe(c => {
      if (c != null) {
        this.buildupModel = c;
        this.dtTrigger.next();
        this.ULDArr.forEach((element) => {
          var checkdup = this.buildupModel.find(
            (x) => x.ULDID == element.ULDID
          );
          if (checkdup != null) {
            var index = this.buildupModel.findIndex(
              (x) => x.ULDID == element.ULDID
            );
            this.buildupModel.splice(index, 1);
          }
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
