import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { v4 as uuid } from 'uuid';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';

import { responseAirLines } from '../AdminArea/Models/airLines';
import { responseFlight } from '../Export/Flights/Model/flightsModel';
import { ULDResponseModel } from '../ULD/ULD/Model';
import { FWBResponse, NOTOCResponseModel } from './deptModel'
import { requestManifestModel } from '../AirCargoManifest/Manifest/ManifestModel';
import { emailResponseModel, requestEmail } from '../../email-module/Email-Module'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dept-module',
  templateUrl: './dept-module.component.html',
  styleUrls: ['./dept-module.component.css']
})
export class DeptModuleComponent implements OnInit {
  NOTOCForm: FormGroup;
  NOTOCResponseModel: NOTOCResponseModel[];
  validForm: boolean = false;
  requestEmail: requestEmail;
  emailResponseModel: emailResponseModel;
  FWBResponse: FWBResponse[];
  ManifestForm: FormGroup;
  tableForm: FormGroup;
  emailData: any;
  emailResponse: any = [];
  NewStr: any;
  EmailForm: FormGroup;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  requestManifestModel: requestManifestModel;
  // employeeModel: employeeModel;
  defaultAirline: responseAirLines;
  responseFlight: responseFlight[];
  defaultFlight: responseFlight;
  responseAirLines: responseAirLines[];
  constructor(public API: ApiService, public GV: GvarService, private route: ActivatedRoute, public router: Router) {
    this.FWBResponse = [];
    this.requestManifestModel = new requestManifestModel();
    this.responseAirLines = [];
    this.InitializeForm();
    this.defaultAirline = new responseAirLines();
    this.defaultFlight = new responseFlight();
    this.emailResponseModel = new emailResponseModel();
    this.requestEmail = new requestEmail();
    this.NOTOCResponseModel == [];
  }

  ngOnInit(): void {
    this.generateFWB();
    this.getAirLines();
    this.InitializeFormEmail();
    this.genereateNOTOC();
  }

  InitializeForm(): any {
    this.tableForm = new FormGroup({
      ALCode: new FormControl(""),
      flightNo: new FormControl(""),
      dateForSearch: new FormControl(""),
      messageID: new FormControl(),
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
  }

  ngAfterOnInit() {
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
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
        this.defaultAirline.ALCode = 0;
        this.defaultAirline.ALName = "Select Airline";
        this.responseAirLines.push(this.defaultAirline);
        this.tableForm.controls.ALCode.setValue(0);
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
  InitializeFormEmail(): any {
    this.EmailForm = new FormGroup({
      email_sendTo: new FormControl(""),
      email_sendCC: new FormControl(""),
      email_sendBCC: new FormControl(""),
      email_from: new FormControl(""),
      email_Subject: new FormControl(""),
      email_Body: new FormControl(""),
      noticedetailID: new FormControl(),

      emailID: new FormControl(),
      MessageType: new FormControl(),
      emailDetailID: new FormControl(),
      emailType: new FormControl(),
      airportID: new FormControl(),
      emailaddress: new FormControl(),
    });
    this.NOTOCForm = new FormGroup({
      ShortID: new FormControl(""),
      depFlightNo: new FormControl(""),
      depDate: new FormControl(""),
      regNo: new FormControl(""),
    })
  }
  genereateNOTOC() {
    this.ManifestForm.controls.flightID.setValue("73");
    this.API.getdata('/CargoMessages/generateNOTOC?flightID=' + this.ManifestForm.controls.flightID.value).subscribe(c => {
      if (c != null) {
        this.NOTOCResponseModel = c;
        if (this.NOTOCResponseModel.length > 0) {
          this.NOTOCForm.controls.ShortID.setValue(this.NOTOCResponseModel[0].ShortID);
          this.NOTOCForm.controls.depFlightNo.setValue(this.NOTOCResponseModel[0].depFlightNo);
          this.NOTOCForm.controls.depDate.setValue(this.NOTOCResponseModel[0].depDate);
          this.NOTOCForm.controls.regNo.setValue(this.NOTOCResponseModel[0].regNo);
        }
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
  generateFWB() {
    this.ManifestForm.controls.flightID.setValue("73");
    this.API.getdata('/CargoMessages/generateFWB?flightID=' + this.ManifestForm.controls.flightID.value).subscribe(c => {
      if (c != null) {
        this.FWBResponse = c;
        this.emailData = "";
        this.FWBResponse.forEach(element => {
          this.emailData = "";
          this.emailData = this.emailData + element.FWBDetail + "<br>";
          this.emailData = this.emailData + element.AWBDetail + "<br>";
          this.emailData = this.emailData + element.FlightDetail + "<br>";
          this.emailData = this.emailData + element.SHP + "<br>";
          this.emailData = this.emailData + element.ShipperName + "<br>";
          this.emailData = this.emailData + element.ShipperAddress + "<br>";
          this.emailData = this.emailData + element.ShipperCity + "<br>";
          this.emailData = this.emailData + element.ShipperCountry + "<br>";
          this.emailData = this.emailData + element.Consignee + "<br>";
          this.emailData = this.emailData + element.ConsigneeName + "<br>";
          this.emailData = this.emailData + element.ConsigneeAddress + "<br>";
          this.emailData = this.emailData + element.ConsigneeCountry + "<br>";
          this.emailData = this.emailData + element.Agent + "<br>";
          this.emailData = this.emailData + element.AgentAddress + "<br>";
          this.emailData = this.emailData + element.AgentCity + "<br>";
          this.emailData = this.emailData + element.CVD + "<br>";
          this.emailData = this.emailData + element.RTDDetail + "<br>";
          this.emailData = this.emailData + element.commodity + "<br>";
          element.dimsList.forEach(dims => {
            this.emailData = this.emailData + dims.dimmsDetail + "<br>";
          });
          if (element.AWC != null)
            this.emailData = this.emailData + element.AWC + "<br>";
          if (element.AIS != null)
            this.emailData = this.emailData + element.AIS + "<br>";
          if (element.SSC != null)
            this.emailData = this.emailData + element.SSC + "<br>";
          if (element.GTC != null)
            this.emailData = this.emailData + element.GTC + "<br>";
          if (element.OC != null)
            this.emailData = this.emailData + element.OC + "<br>";
          if (element.ISU != null)
            this.emailData = this.emailData + element.ISU + "<br>";
          if (element.REF != null)
            this.emailData = this.emailData + element.REF + "<br>";
          if (element.SPH != null)
            this.emailData = this.emailData + element.SPH + "<br>";
          this.emailData = this.emailData + element.ShipperCountry + "<br>";
        });
        this.EmailForm.controls.email_Body.setValue(this.emailData);
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
  validationForSearch() {
    if (this.tableForm.controls.ALCode.value == "" || this.tableForm.controls.ALCode.value == null) {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  getEmails() {
    this.emailResponseModel.emailDetailList = [];
    this.validationForSearch();
    if (this.validForm == true) {
      this.requestEmail.ALCode = this.tableForm.controls.ALCode.value;
      this.requestEmail.messageID = "2";
      this.API.PostData('/CargoMessages/getEmails', this.requestEmail).subscribe(c => {
        if (c == false) {
          this.emailResponseModel = new emailResponseModel();
        }
        else {
          this.emailResponseModel.emailDetailList = c.emailDetailList;
          this.emailResponseModel = c;
          var emailTo = this.emailResponseModel.emailDetailList.filter(c => c.emailType == "To");
          emailTo.forEach(emailTo => {
            if (this.NewStr == "") {
              this.NewStr = emailTo.emailaddress.concat(',');
            }
            else
              this.NewStr = this.NewStr + emailTo.emailaddress.concat(',');
          });
          var str = this.NewStr.slice(this.NewStr.length - 1, this.NewStr.length);
          if (str == ",") {
            this.NewStr = this.NewStr.slice(0, this.NewStr.length - 1)
            this.EmailForm.controls.email_sendCC.setValue(this.NewStr);
            this.NewStr = "";
          }
          else {
            this.EmailForm.controls.email_sendCC.setValue(this.NewStr);
          }
          this.NewStr = "";
          var emailCC = this.emailResponseModel.emailDetailList.filter(c => c.emailType == "CC");
          emailCC.forEach(emailCC => {
            if (this.NewStr = "")
              this.NewStr = emailCC.emailaddress.concat(',');
            else
              this.NewStr = this.NewStr.concat(emailCC.emailaddress.concat(','));
          });
          var str = this.NewStr.slice(this.NewStr.length - 1, this.NewStr.length);
          if (str == ",") {
            this.NewStr = this.NewStr.slice(0, this.NewStr.length - 1)
            this.EmailForm.controls.email_sendBCC.setValue(this.NewStr);
            this.NewStr = "";
          }
          else {
            this.EmailForm.controls.email_sendBCC.setValue(this.NewStr);
          }
        }
      });
    }
  }
  public convetToPDF() {
    var data = document.getElementById('contentToConvert');
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

