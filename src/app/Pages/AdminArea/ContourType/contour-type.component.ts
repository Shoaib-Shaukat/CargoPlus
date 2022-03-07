import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../../../Services/API/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { contourTypeRequest, contourTypeResponse } from './Contour-Model';

@Component({
  selector: 'app-contour-type',
  templateUrl: './contour-type.component.html',
  styleUrls: ['./contour-type.component.css']
})
export class ContourTypeComponent implements OnInit {
  contourTypeResponse: contourTypeResponse[];
  contourTypeRequest: contourTypeRequest;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  ContourTypeForm: FormGroup;
  viewContourType: contourTypeResponse;
  validForm: boolean = false;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showContourTypes: boolean = true;
  addnewContourType: boolean = false;

  constructor(public API: ApiService, public GV: GvarService) {
    this.contourTypeRequest = new contourTypeRequest();
    this.viewContourType = new contourTypeResponse();
  }

  ngOnInit(): void {
    window.scroll(0,0);
    this.InitializeForm();
    this.getContourTypes();
    this.contourTypeResponse = [];
  }

  InitializeForm(): any {
    this.ContourTypeForm = new FormGroup({
      ContourType: new FormControl("", [Validators.required]),
      contourID: new FormControl("", [Validators.required]),
    });
  }

  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addnewContourType = true;
      this.showContourTypes = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.contourTypeRequest.isNew = true;
    }
    if (callfrm == "Cancel") {
      this.addnewContourType = false;
      this.showContourTypes = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.ContourTypeForm.reset(this.ContourTypeForm.value);
      this.resetForm();
      this.contourTypeRequest.isNew = false;
    }
    if (callfrm == "Edit") {
      this.addnewContourType = true;
      this.showContourTypes = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.contourTypeRequest.isNew = false;
    }
  }
  resetForm(value: any = undefined) {
    this.ContourTypeForm.reset(value);
    // (this as {submitted:boolean}.submitted=false);
  }

  validations() {
    if (this.ContourTypeForm.controls.ContourType.value == "" || this.ContourTypeForm.controls.ContourType.value == null) {
      Swal.fire({
        text: "Enter Contour Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }

  editContourType(p) {
    this.showhide("Edit");
    this.ContourTypeForm.setValue({
      contourID: p.contourID,
      ContourType: p.ContourType,
    })
  }

  contourTypeDetail(p) {
    this.viewContourType.ContourType = p.agentType;
    this.viewContourType.contourID = p.contourID;
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

  getContourTypes() {
    this.API.getdata('/Setups/getContour').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.contourTypeResponse = c;
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

  saveContourTypes() {
    this.validations();
    if (this.validForm == true) {
      this.contourTypeRequest.ContourType = this.ContourTypeForm.controls.ContourType.value;
      this.contourTypeRequest.contourID = this.ContourTypeForm.controls.contourID.value;
      this.API.PostData('/Setups/AddContour', this.contourTypeRequest).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Saved Successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getContourTypes();
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
}
