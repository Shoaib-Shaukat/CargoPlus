import { QueryList,Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {requestModel} from './Model/departmentModel'
import{Locations} from '../../Login/Model/locations'
import { ApiService } from '../../../Services/API/api.service';
import { DataTableDirective } from 'angular-datatables';
import { requestLocation } from '../Models/rasLocation'
import { GvarService } from '../../../Services/Globel/gvar.service'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject, Subscription } from 'rxjs';


@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {
  datatableElement: QueryList<DataTableDirective>;
  dtOptions0: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();


  requestDepartment: requestLocation;
  DepartmentForm: FormGroup;
  validForm: boolean = false;
  requestModel:requestModel;
  Locations:Locations[];

  constructor(public API: ApiService, public GV: GvarService, private router: Router) {
    this.Locations=[];
    this.requestModel=new requestModel();
   }
   InitializeForm(): any {
    this.DepartmentForm = new FormGroup({
      departmentName: new FormControl('', [Validators.required]),
      locationName: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.getLocations();
  }
  getLocations(){
    this.API.getdata('/Locations/getLocations').subscribe(data=>{
      if(data!=null){
        this.Locations=data;
      }
    })
  }
  saveDepartment(){
    this.validations();
    if(this.validForm==true) {
      this.requestModel.departmentName = this.DepartmentForm.get('departmentName').value;
        this.requestModel.locationID = this.DepartmentForm.get('locationName').value;
        this.API.PostData('/Departments/saveDepartment', this.requestModel).subscribe(c => {
          if (c != null) {
            Swal.fire({
              text: 'Department has been saved successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.router.navigate(['/Dashboard']);
          }
        },
          error => {
            Swal.fire({
              text: error.error.Message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          })
    }
  }
  validations() {
    if (this.DepartmentForm.controls.departmentName.value == "" || this.DepartmentForm.controls.departmentName.value == null) {
      Swal.fire({
        text: "Please enter department name.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.DepartmentForm.controls.locationName.value == "" || this.DepartmentForm.controls.locationName.value == null) {
      Swal.fire({
        text: "Please select location.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm=true;
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
            }

          }
          else {
            resolve(true);
          }

        }
      });
    });
  };
}
