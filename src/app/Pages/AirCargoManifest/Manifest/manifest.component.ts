import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { v4 as uuid } from 'uuid';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';

import { responseAirLines } from '../../AdminArea/Models/airLines';
import { responseFlight } from '../../Export/Flights/Model/flightsModel';
import { ULDResponseModel } from '../../ULD/ULD/Model';
import { ULDCombo, ULDTypeResponse } from '../../ULD/ULD/Model';
import { requestManifestModel, ULDNoCombo, ULDReceiveDetail, ULDReceiveModel, getBuilds, ManfiestDetailModel, getDataByAWBNoResponse, RCSResponse } from './ManifestModel';

@Component({
  selector: 'app-manifest',
  templateUrl: './manifest.component.html',
  styleUrls: ['./manifest.component.css']
})
export class ManifestComponent implements OnInit {
  public src: Blob;
  RCSResponse: RCSResponse;
  alwaysFalse: boolean = false;
  validTableForm: boolean = false;
  getDataByAWBNoResponse: getBuilds[];
  @ViewChildren('manifestModel') manifestModel: ElementRef;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  ManfiestDetailModel: ManfiestDetailModel;
  BuildsResponse: getBuilds[];
  manifestDetail: getBuilds;
  requestManifestModel: requestManifestModel;
  // employeeModel: employeeModel;
  editDetail: boolean = false;
  isAddMode: boolean = false;
  manifestFlightID: string;
  BuildUPDetailID: string;
  totalReceivedULD: any;
  validForm: boolean = false;
  validPopup: boolean = false;
  ULDTypeResponse: ULDTypeResponse[];
  ULDReceiveDetail: ULDReceiveDetail;
  ULDReceiveModel: ULDReceiveModel;
  ULDCombo: ULDCombo[];
  defaultAirline: responseAirLines;
  @ViewChildren('addULDModal') addULDModal: ElementRef;
  @ViewChildren('confirmDeleteULDModal') confirmDeleteULDModal: ElementRef;
  @ViewChildren('manifestPopUpModel') manifestPopUpModel: ElementRef;
  @ViewChildren('closeAddbyAWBNoModal') closeAddbyAWBNoModal: ElementRef;
  @ViewChildren('closeAddbyULDNoModal') closeAddbyULDNoModal: ElementRef;
  @ViewChildren('RCSPopUpModel') RCSPopUpModel: ElementRef;
  @ViewChildren('closeRCSDetail') closeRCSDetail: ElementRef;

  latestDate: any;
  uldreceiveDetailID: any;
  responseFlight: responseFlight[];
  defaultFlight: responseFlight;
  responseAirLines: responseAirLines[];
  ULDNoCombo: ULDNoCombo[];
  ULDResponseModel: ULDResponseModel;
  arrivalResponse: responseFlight[];
  userTable: FormGroup;
  mode: boolean;
  touchedRows: any;
  ManifestForm: FormGroup;
  ULDDetailForm: FormGroup;
  tableForm: FormGroup;
  PopupForm: FormGroup;
  SecondPopupForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showGrid: boolean = true;
  showNewSection: boolean = false;
  constructor(public API: ApiService, public GV: GvarService, private route: ActivatedRoute, public router: Router) {
    this.RCSResponse = new RCSResponse();
    this.getDataByAWBNoResponse = [];
    this.ManfiestDetailModel = new ManfiestDetailModel();
    this.manifestDetail = new getBuilds();
    this.BuildsResponse = [];
    this.requestManifestModel = new requestManifestModel();
    // this.employeeModel = new employeeModel();
    this.ULDTypeResponse = [];
    this.ULDReceiveDetail = new ULDReceiveDetail();
    this.ULDReceiveModel = new ULDReceiveModel();
    this.ULDNoCombo = [];
    this.responseAirLines = [];
    this.arrivalResponse = [];
    this.InitializeForm();
    this.ManifestForm.controls.isNew.setValue(true);
    this.ULDResponseModel = new ULDResponseModel();
    this.defaultAirline = new responseAirLines();
    this.defaultFlight = new responseFlight();

  }
  ngOnInit(): void {
    this.getAirLines();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      scrollX: true,
      processing: true,
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'copyHtml5',
          // exportOptions: {
          //    // columns: [ 0, ':visible' ]
          // }
        },
        {
          extend: 'excelHtml5',
          // exportOptions: {
          //    // columns: ':visible'
          // }
        },
        {
          extend: 'pdfHtml5',
          // exportOptions: {
          //  columns: ':visible'
          // }
        },
        {
          extend: 'colvis',
        }
      ]
    };
    this.tableForm.get('dateForSearch').patchValue(this.formatDate(new Date()));
    this.PopupForm.controls.QRTFlight.disable();
    this.PopupForm.controls.QRTULoadingPt.disable();
  }
  InitializeForm(): any {
    this.tableForm = new FormGroup({
      ALCodeforTable: new FormControl(""),
      flightNo: new FormControl(""),
      dateForSearch: new FormControl(""),
    });
    this.SecondPopupForm = new FormGroup({
      SecordLine: new FormControl(""),
      firstLine: new FormControl(""),
      thirdLine: new FormControl(""),
      fourthLine: new FormControl(""),
    });

    this.ManifestForm = new FormGroup({
      manifestID: new FormControl(""),
      ALCode: new FormControl(""),
      ALName: new FormControl(""),
      flightID: new FormControl(""),
      depFlightNo: new FormControl(""),
      regNo: new FormControl(""),
      STD: new FormControl(""),
      searchAWBNo: new FormControl(""),
      searchULDNo: new FormControl(""),
      // empID: new FormControl(""),
      aircraftType: new FormControl(""),
      isDepartured: new FormControl(""),
      QRTFlight: new FormControl(""),
      QRTLoading: new FormControl(""),
      loading: new FormControl(""),
      unLoading: new FormControl(""),
      isNew: new FormControl(""),
      uldRequestDetailID: new FormControl(""),
      Manifest: new FormControl(""),
      aircraftRegNo: new FormControl(""),
    });

    this.PopupForm = new FormGroup({
      Pieces: new FormControl(""),
      depDestination: new FormControl(""),
      AWBWT: new FormControl(""),
      // isChecked: new FormControl(""),
      AWBNo: new FormControl(""),
      grossWeight: new FormControl(""),
      buildupweight: new FormControl(""),
      physicallyChecked: new FormControl(""),
      ULDNo: new FormControl(""),
      ULDType: new FormControl(""),
      comm_description: new FormControl(""),
      // EDD: new FormControl(""),
      priority: new FormControl(""),
      ContourType: new FormControl(""),
      GDNo: new FormControl(""),
      // Scanning: new FormControl(""),
      QRTFlight: new FormControl(""),
      QRTULoadingPt: new FormControl(""),
      QRT: new FormControl(""),

    });
  }
  ngAfterOnInit() {
  }
  saveUserDetails() {
    console.log(this.userTable.value);
  }
  toggleTheme() {
    this.mode = !this.mode;
  }
  closeDeleteModal() {
    this.confirmDeleteULDModal["first"].nativeElement.click();
  }
  setDeleteULD(p) {

    this.uldreceiveDetailID = p.uldRequestDetailID;
  }
  confirmDeleteULDRequest() {

    for (let i = 0; i < this.ULDReceiveModel.ULDReceiveDetail.length; i++) {
      if (this.uldreceiveDetailID == this.ULDReceiveModel.ULDReceiveDetail[i].uldreceiveDetailID) {
        this.ULDReceiveModel.ULDReceiveDetail.splice(i, 1);
      }
    }
  }


  findIndexToUpdate(newItem) {
    return newItem.id === this;
  }
  validations() {
    if (this.ManifestForm.controls.ALCode.value == "" || this.ManifestForm.controls.ALCode.value == null) {
      Swal.fire({
        text: "Search valid flight info first!",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ManifestForm.controls.flightID.value == "" || this.ManifestForm.controls.flightID.value == null || this.ManifestForm.controls.flightID.value == "0") {
      Swal.fire({
        text: "Search valid flight info first!",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.ManifestForm.controls.STD.value == "" || this.ManifestForm.controls.STD.value == null) {
      Swal.fire({
        text: "Enter STD",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    // if (this.ManifestForm.controls.empID.value == "" || this.ManifestForm.controls.empID.value == null) {
    //   Swal.fire({
    //     text: "Enter Employee ID",
    //     icon: 'error',
    //     confirmButtonText: 'OK'
    //   });
    //   this.validForm = false;
    //   return;
    // }
    if (this.requestManifestModel.requestManifestDetails.length == 0) {
      Swal.fire({
        text: "Enter atleast 1 Manifest Detail",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
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

  saveData(status: any) {
    this.validations();
    if (this.validForm == true) {
      if (status == "New") {
        this.requestManifestModel.requestManifest.isNew = true;
      }
      else {
        this.requestManifestModel.requestManifest.isNew = false;
      }
      this.requestManifestModel.requestManifest.manifestID = this.ManifestForm.controls.manifestID.value;
      this.requestManifestModel.requestManifest.ALCode = this.ManifestForm.controls.ALCode.value;
      this.requestManifestModel.requestManifest.flightID = this.ManifestForm.controls.flightID.value;
      this.requestManifestModel.requestManifest.STD = this.ManifestForm.controls.STD.value;
      this.API.PostData('/Manifest/saveManifest', this.requestManifestModel).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Manifest Saved Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.ManifestForm.controls.isNew.setValue(false);
          this.ManifestForm.controls.manifestID.setValue(c.manifestID);
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


  bindNewData(flightID: any) {
    if (flightID == "" || flightID == null) {
      return;
    }
    this.API.getdata('/Flights/getFlightData?flightID=' + flightID).subscribe(c => {
      if (c != null) {
        this.ManifestForm.controls.ALCode.setValue(c.ALCode);
        this.ManifestForm.controls.ALName.setValue(c.ALName);
        this.ManifestForm.controls.flightID.setValue(c.flightID);
        this.ManifestForm.controls.depFlightNo.setValue(c.depFlightNo);
        this.ManifestForm.controls.aircraftRegNo.setValue(c.regNo);
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
  // getemployeeDetail() {
  //   var empID = "";
  //   empID = this.ManifestForm.controls.empID.value
  //   if (this.ManifestForm.controls.empID.value == undefined) {
  //     this.ManifestForm.controls['empID'].setValue("");
  //     this.ManifestForm.controls['empName'].setValue("");
  //     Swal.fire({
  //       text: "Select Employee",
  //       icon: 'error',
  //       confirmButtonText: 'OK'
  //     });
  //     this.validPopup = false;
  //     return;
  //   }

  //   this.API.getdata('/Generic/getEmpDetail?empID=' + empID).subscribe(c => {
  //     if (c != null) {
  //       this.employeeModel = c;
  //       this.ManifestForm.controls.empID.setValue(this.employeeModel.empID);
  //       this.ManifestForm.controls.empName.setValue(this.employeeModel.employeeName);
  //     }
  //     else {
  //     }
  //   },
  //     error => {
  //       Swal.fire({
  //         text: error.error.Message,
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //     });
  // }
  cancelManifest() {
    this.ManifestForm.reset();
    this.requestManifestModel = new requestManifestModel();
    this.router.navigate(['/Export/ManifestInquiry/']);
  }
  getBuildupData(flightID: any) {
    if (flightID == "" || flightID == null) {
      return;
    }
    this.API.getdata('/Manifest/getBuildup?flightID=' + flightID).subscribe(c => {
      if (c != null) {
        this.requestManifestModel.requestManifestDetails = c;
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

  editManifest(p) {
    this.PopupForm.reset(true);
    this.PopupForm.patchValue(p);
    this.BuildUPDetailID = p.BuildUPDetailID;
    this.editDetail = true;
  }

  PushManifestDetail() {
    if (this.editDetail == true) {
      this.ManfiestDetailModel = this.requestManifestModel.requestManifestDetails.find(x => x.BuildUPDetailID == this.BuildUPDetailID);
      var Index = this.requestManifestModel.requestManifestDetails.findIndex(x => x.BuildUPDetailID == this.BuildUPDetailID);
      if (Index != null) {
        this.requestManifestModel.requestManifestDetails[Index].priority = this.PopupForm.controls.priority.value;
        this.requestManifestModel.requestManifestDetails[Index].GDNo = this.PopupForm.controls.GDNo.value;
        this.requestManifestModel.requestManifestDetails[Index].QRTFlight = this.PopupForm.controls.QRTFlight.value;
        this.requestManifestModel.requestManifestDetails[Index].QRTULoadingPt = this.PopupForm.controls.QRTULoadingPt.value;
        this.requestManifestModel.requestManifestDetails[Index].QRT = this.PopupForm.controls.QRT.value;
        //this.requestManifestModel.requestManifestDetails[Index].isChecked = this.PopupForm.controls.isChecked.value;
      }
    }
    this.manifestPopUpModel["first"].nativeElement.click();
    this.editDetail = false;
  }

  closePopUp() {
    this.manifestModel["first"].nativeElement.click();
  }
  resetDetail() {
    this.PopupForm.reset(true);
    this.editDetail = false;
  }

  getDataByAWBNo() {
    if (this.ManifestForm.controls.searchAWBNo.value.length != 11) {
      this.closeAddbyAWBNoModal["first"].nativeElement.click();
      Swal.fire({
        text: "AWB Number not correct",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.API.getdata('/Manifest/getBuildupByAWBNO?AwbNo=' + this.ManifestForm.controls.searchAWBNo.value).subscribe(c => {
      if (c != null) {
        this.getDataByAWBNoResponse = c;
        this.requestManifestModel.requestManifestDetails.forEach(element => {
          var checkdup = this.getDataByAWBNoResponse.find(c => c.acceptanceID == element.acceptanceID);
          if (checkdup != null) {
            var index = this.getDataByAWBNoResponse.findIndex(c => c.acceptanceID == element.acceptanceID);
            this.getDataByAWBNoResponse.splice(index, 1);
          }
        });
      }
    },
      error => {
        this.closeAddbyAWBNoModal["first"].nativeElement.click();
        Swal.fire({
          text: "AWB Number not correct",
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      });
  }

  getDataByULDNo() {
    this.API.getdata('/Manifest/getBuildupByUldNO?ULDNo=' + this.ManifestForm.controls.searchULDNo.value).subscribe(c => {
      if (c != null) {
        this.getDataByAWBNoResponse = c;
        this.requestManifestModel.requestManifestDetails.forEach(element => {
          var checkdup = this.getDataByAWBNoResponse.find(c => c.acceptanceID == element.acceptanceID);
          if (checkdup != null) {
            var index = this.getDataByAWBNoResponse.findIndex(c => c.acceptanceID == element.acceptanceID);
            this.getDataByAWBNoResponse.splice(index, 1);
          }
        });
      }
    },
      error => {
        this.closeAddbyULDNoModal["first"].nativeElement.click();
        Swal.fire({
          text: "ULD Number not correct",
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      });
  }

  addByAWBNoDetail(p) {
    for (let i = 0; i < this.requestManifestModel.requestManifestDetails.length; i++) {
      if (this.requestManifestModel.requestManifestDetails[i].AWBNo == p.AWBNo) {
        Swal.fire({
          text: "Manifest already present with selected AWB Number",
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
    }
    this.requestManifestModel.requestManifestDetails.push(p);
    this.closeAddbyAWBNoModal["first"].nativeElement.click();
  }
  addByULDNoDetail(p) {
    for (let i = 0; i < this.requestManifestModel.requestManifestDetails.length; i++) {
      if (this.requestManifestModel.requestManifestDetails[i].AWBNo == p.AWBNo) {
        Swal.fire({
          text: "Manifest already present with selected AWB Number",
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
    }
    this.requestManifestModel.requestManifestDetails.push(p);
    this.closeAddbyULDNoModal["first"].nativeElement.click();
  }
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
        this.defaultAirline.ALCode = 0;
        this.defaultAirline.ALName = "Select Airline";
        this.responseAirLines.push(this.defaultAirline);
        this.tableForm.controls.ALCodeforTable.setValue(0);
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
  validationsForSearch() {
    if (this.tableForm.controls.ALCodeforTable.value == "" || this.tableForm.controls.ALCodeforTable.value == null) {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validTableForm = false;
      return;
    }
    if (this.tableForm.controls.flightNo.value == "" || this.tableForm.controls.flightNo.value == null) {
      Swal.fire({
        text: "Enter Flight No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validTableForm = false;
      return;
    }
    if (this.tableForm.controls.dateForSearch.value == "" || this.tableForm.controls.dateForSearch.value == null) {
      Swal.fire({
        text: "Select Date",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validTableForm = false;
      return;
    }
    this.validTableForm = true;
  }
  disableAllForms() {
    // this.ManifestForm.disable();
    // this.PopupForm.disable();
  }
  getManifestDetail() {
    this.validationsForSearch();
    if (this.validTableForm == true) {
      let body = {
        ALCode: this.tableForm.controls.ALCodeforTable.value,
        depDate: this.tableForm.controls.dateForSearch.value,
        depFlightNo: this.tableForm.controls.flightNo.value,
      }
      this.API.PostData('/Manifest/manifestViewModel', body).subscribe(c => {
        if (c != null) {
          this.requestManifestModel.requestManifestDetails = c.manifestResponseDetail;
          if (c.manifestResponse.manifestID == null || c.manifestResponse.manifestID == 0) {
            this.isAddMode = false;
            this.ManifestForm.patchValue(c.flightResponse);
            for (let i = 0; i < this.responseAirLines.length; i++) {
              if (this.responseAirLines[i].ALCode == c.flightResponse.ALCode) {
                this.ManifestForm.controls.ALName.setValue(this.responseAirLines[i].ALName);
              }
            }
            this.ManifestForm.controls.depFlightNo.setValue(this.tableForm.controls.flightNo.value);
          }
          else {
            this.isAddMode = true;
            this.ManifestForm.patchValue(c.manifestResponse);
            if (this.ManifestForm.controls.isDepartured.value != null) {
              if (this.ManifestForm.controls.isDepartured.value == true) {
                this.disableAllForms();
              }
            }
            for (let i = 0; i < this.responseAirLines.length; i++) {
              if (this.responseAirLines[i].ALCode == c.manifestResponse.ALCode) {
                this.ManifestForm.controls.ALName.setValue(this.responseAirLines[i].ALName);
              }
            }
            this.ManifestForm.controls.depFlightNo.setValue(this.tableForm.controls.flightNo.value);
          }
        }
      },
        error => {
          this.resetManifestForError();
          Swal.fire({
            text: error.error.Message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
  }
  resetManifestForError() {
    this.isAddMode = false;
    this.ManifestForm.reset();
    this.PopupForm.reset();
    this.ManifestForm.controls.isNew.setValue(true);
    this.requestManifestModel.requestManifestDetails = [];
  }
  resetManifest() {
    this.isAddMode = false;
    this.ManifestForm.reset();
    this.tableForm.reset();
    this.PopupForm.reset();
    this.ManifestForm.controls.isNew.setValue(true);
    this.requestManifestModel.requestManifestDetails = [];
    this.getAirLines();
    this.tableForm.get('dateForSearch').patchValue(this.formatDate(new Date()));
  }

  getRCSData(p) {
    this.API.getdata('/Acceptance/generateRCS?acceptanceID=' + p.acceptanceID).subscribe(c => {
      if (c != null) {
        this.RCSResponse = c;
        this.SecondPopupForm.patchValue(this.RCSResponse);
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
  saveRCSDetail() {
    this.RCSResponse.firstLine = this.SecondPopupForm.controls.firstLine.value;
    this.RCSResponse.SecordLine = this.SecondPopupForm.controls.SecordLine.value;
    this.RCSResponse.thirdLine = this.SecondPopupForm.controls.thirdLine.value;
    this.RCSResponse.fourthLine = this.SecondPopupForm.controls.fourthLine.value;

    this.API.PostData('/CargoMessages/sendRCS', this.RCSResponse).subscribe(c => {
      if (c != null) {
        this.SecondPopupForm.patchValue(c);
        Swal.fire({
          text: "Message sent successfully",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.RCSPopUpModel["first"].nativeElement.click();
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
  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  generateManifest() {
    if (this.ManifestForm.controls.manifestID.value == "") {
      Swal.fire({
        text: "Search Manifest First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.closeRCSDetail["first"].nativeElement.click();
      return;
    }
    let body = {
      manifestID: this.ManifestForm.controls.manifestID.value
    }
    this.API.downloadFile('/Reports/genManifest', body).subscribe(data => {
      if (data != null) {
        this.src = data;
        // var w = window.open("", data);
        // w.document.write(data);

        // var dataDetail = new dataDetail();
        // dataDetail.src = "data:image/jpg;base64," + this.src.arrayBuffer;
        // var w = window.open("");
        // w.document.write(dataDetail.outerHTML);

        // var file = new Blob([data.blob()], { type: 'text/xml' });
        // var fileURL = window.URL.createObjectURL(file);
        // window.open(fileURL);
      }
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.closeRCSDetail["first"].nativeElement.click();
      });
  }
  QRTChecked(qrtChecked: boolean) {
    if (qrtChecked) {
      this.PopupForm.get("QRTFlight").enable();
      this.PopupForm.get("QRTULoadingPt").enable();
    }
    else {
      this.PopupForm.get("QRTFlight").reset();
      this.PopupForm.get("QRTULoadingPt").reset();
      this.PopupForm.get("QRTFlight").disable();
      this.PopupForm.get("QRTULoadingPt").disable();
    }
  }
  donePushingByAWB() {
    this.closeAddbyAWBNoModal["first"].nativeElement.click();
    for (let i = 0; i < this.getDataByAWBNoResponse.length; i++) {
      if (this.getDataByAWBNoResponse[i].checked == true) {
        var checkedExisting = this.requestManifestModel.requestManifestDetails.find(c => c.acceptanceID == this.getDataByAWBNoResponse[i].acceptanceID);
        if (checkedExisting == null) {
          this.requestManifestModel.requestManifestDetails.push(this.getDataByAWBNoResponse[i]);
        }
      }
    }
  }
  donePushingByULD() {
    this.closeAddbyULDNoModal["first"].nativeElement.click();
    for (let i = 0; i < this.getDataByAWBNoResponse.length; i++) {
      if (this.getDataByAWBNoResponse[i].checked == true) {
        var checkedExisting = this.requestManifestModel.requestManifestDetails.find(c => c.acceptanceID == this.getDataByAWBNoResponse[i].acceptanceID);
        if (checkedExisting == null) {
          this.requestManifestModel.requestManifestDetails.push(this.getDataByAWBNoResponse[i]);
        }
      }
    }
  }
  selectALLCheckULD(check) {
    for (let i = 0; i < this.getDataByAWBNoResponse.length; i++) {
      if (check == true) {
        this.getDataByAWBNoResponse[i].checked = true;
      }
      else {
        this.getDataByAWBNoResponse[i].checked = false;
      }
    }
  }
  selectALLCheckAWB(check) {
    for (let i = 0; i < this.getDataByAWBNoResponse.length; i++) {
      if (check == true) {
        this.getDataByAWBNoResponse[i].checked = true;
      }
      else {
        this.getDataByAWBNoResponse[i].checked = false;
      }
    }
  }
}
