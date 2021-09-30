import { Component, OnInit, ViewChildren, QueryList, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { agentsResponse, requestAgent, agentType, attachmentResponse } from '../Models/agents';
import { ApiService } from '../../../Services/API/api.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../Models/cityState';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { consigneeResponse } from '../Models/consignee';
import { ThemeService } from 'ng2-charts';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {
  fileNameFront: string = "Choose file...";
  fileNameBack: string = "Choose file...";
  @ViewChild("fileUploadFront") fileUploadFront: ElementRef; filesFront = [];
  @ViewChild("fileUploadBack") fileUploadBack: ElementRef; filesBack = [];
  attachmentResponse: attachmentResponse[];
  @Output() notifyNewAgentTab2 = new EventEmitter<string>();
  @Output() notifyNewAgentTab1 = new EventEmitter<string>();
  selectAgent(value: string) {
    this.notifyNewAgentTab2.emit(value);
    this.notifyNewAgentTab1.emit(value);
  }
  consigneeResponse: consigneeResponse[];
  agentTypes: agentType[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;

  viewAgent: agentsResponse;
  validForm: boolean = false;
  requestAgent: requestAgent;
  selectedRegion: number;
  selectedCountry: number;
  agentForm: FormGroup;
  responseRegions: responseRegions[];
  responseCountries: responseCountries[];
  responseCity: responseCity[];
  requestCity: requestCity;
  requestStRegions: requestStRegions;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showAgents: boolean = true;
  addnewAgent: boolean = false;
  agentsResponse: agentsResponse[];
  newData: agentsResponse;
  constructor(public API: ApiService, public GV: GvarService) {
    this.attachmentResponse = [];
    this.requestCity = new requestCity();
    this.requestStRegions = new requestStRegions();
    this.responseCity = [];
    this.agentTypes = [];
    this.responseCountries = [];
    this.responseRegions = [];
    this.requestAgent = new requestAgent();
    this.viewAgent = new agentsResponse();
    this.newData = new agentsResponse();
  }
  InitializeForm(): any {
    this.agentForm = new FormGroup({
      agenttypeID: new FormControl("", [Validators.required]),
      agentId: new FormControl(""),
      agentName: new FormControl("", [Validators.required]),
      agentAddress: new FormControl("", [Validators.required]),
      cnicExpiry: new FormControl("", [Validators.required]),
      PhoneNo: new FormControl("", [Validators.required]),
      emailAddress: new FormControl("", [Validators.required]),
      faxNo: new FormControl("", [Validators.required]),
      countryID: new FormControl("", [Validators.required]),
      IATARegNo: new FormControl("", [Validators.required]),
      stateID: new FormControl("", [Validators.required]),
      cityID: new FormControl("", [Validators.required]),
      CNIC: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]{13}$")]),
      cid: new FormControl(""),
      mobileNo: new FormControl(),
      atttypeID: new FormControl(""),
      greyList: new FormControl(""),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.agentsResponse = [];
    this.getCountries();
    this.getAgents();
    this.getAgentTypes();
    this.getConsignees();
  }
  getAgents() {
    this.API.getdata('/Setups/getAgents').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.agentsResponse = c;
          for (let i = 0; i < this.agentsResponse.length; i++) {
            var agentCNIC = this.agentsResponse[i].CNIC;
            var firstPart = agentCNIC.slice(0, 5);
            var secondPart = agentCNIC.slice(5, 12);
            var thirdPart = agentCNIC.slice(12, 13);
            var dash = "-"
            agentCNIC = firstPart.concat(dash, secondPart, dash, thirdPart);
            this.agentsResponse[i].CNIC = agentCNIC;
          }
          this.dtTrigger.next();
        });

      }
    },
      error => {
        Swal.fire({
          text: error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  getCountries() {
    this.API.getdata('/Generic/getCountries').subscribe(c => {
      if (c != null) {
        this.responseCountries = c;
      }
    },
      error => {
        Swal.fire({
          text: error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addnewAgent = true;
      this.showAgents = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.requestAgent.isNew = true;
      this.fileUploadFront.nativeElement.value = '';
      this.fileUploadBack.nativeElement.value = '';
    }
    if (callfrm == "Cancel") {
      this.addnewAgent = false;
      this.showAgents = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.agentForm.reset(this.agentForm.value);
      this.resetForm();
      this.requestAgent.isNew = false;
      this.fileUploadFront.nativeElement.value = '';
      this.fileUploadBack.nativeElement.value = '';
    }
    if (callfrm == "Edit") {
      this.addnewAgent = true;
      this.showAgents = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.requestAgent.isNew = false;
    }
  }
  changeCountry(event) {
    this.selectedCountry = event;
    this.responseRegions = [];
    this.responseCity = [];
    this.getRegions();
  }
  changeRegion(event) {
    this.selectedRegion = event;
    this.responseCity = [];
    this.getCities();
  }
  getRegions() {
    this.requestStRegions.CountryId = this.selectedCountry;
    this.API.PostData('/Generic/getRegions', this.requestStRegions).subscribe(c => {
      if (c != null) {
        this.responseRegions = c;
      }
    },
      error => {
        Swal.fire({
          text: error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  getCities() {
    this.requestCity.RegionId = this.selectedRegion;
    this.API.PostData('/Generic/getCities', this.requestCity).subscribe(c => {
      if (c != null) {
        this.responseCity = c;
      }
    },
      error => {
        Swal.fire({
          text: error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  resetForm(value: any = undefined) {
    this.agentForm.reset(value);
    // (this as {submitted:boolean}.submitted=false);
  }
  saveAgent(status) {
    this.validations();
    if (this.validForm == true) {
      if (status == "New") {
        this.requestAgent.isNew = true;
      }
      else {
        this.requestAgent.isNew = false;
      }
      this.requestAgent.agentId = this.agentForm.controls.agentId.value;
      this.requestAgent.agenttypeID = this.agentForm.controls.agenttypeID.value;
      this.requestAgent.agentName = this.agentForm.controls.agentName.value;
      this.requestAgent.countryID = this.agentForm.controls.countryID.value;
      this.requestAgent.cityID = this.agentForm.controls.cityID.value;
      this.requestAgent.CNIC = this.agentForm.controls.CNIC.value;
      this.requestAgent.agentAddress = this.agentForm.controls.agentAddress.value;
      this.requestAgent.stateID = this.agentForm.controls.stateID.value;
      this.requestAgent.cnicExpiry = this.agentForm.controls.cnicExpiry.value;
      this.requestAgent.PhoneNo = this.agentForm.controls.PhoneNo.value;
      this.requestAgent.IATARegNo = this.agentForm.controls.IATARegNo.value;
      this.requestAgent.emailAddress = this.agentForm.controls.emailAddress.value;
      this.requestAgent.faxNo = this.agentForm.controls.faxNo.value;
      this.requestAgent.mobileNo = this.agentForm.controls.mobileNo.value;
      this.requestAgent.cid = this.agentForm.controls.cid.value;
      this.requestAgent.greyList = this.agentForm.controls.greyList.value;
      this.API.PostData('/Setups/saveAgent', this.requestAgent).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "Agent saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.showhide("Cancel");
          this.getAgents();
        }
      },
        error => {
          Swal.fire({
            text: error,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
  }
  validations() {
    if (this.agentForm.controls.agenttypeID.value == "" || this.agentForm.controls.agenttypeID.value == null) {
      Swal.fire({
        text: "Select Agent Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.agentForm.controls.agentName.value == "" || this.agentForm.controls.agentName.value == null) {
      Swal.fire({
        text: "Enter Agent Name",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.agentForm.controls.countryID.value == "" || this.agentForm.controls.countryID.value == null) {
      Swal.fire({
        text: "Select Country",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.agentForm.controls.stateID.value == "" || this.agentForm.controls.stateID.value == null) {
      Swal.fire({
        text: "Select State",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.agentForm.controls.cityID.value == "" || this.agentForm.controls.cityID.value == null) {
      Swal.fire({
        text: "Select City",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.agentForm.controls.CNIC.value == "" || this.agentForm.controls.CNIC.value == null) {
      Swal.fire({
        text: "Enter CNIC",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.agentForm.controls.CNIC.value.length < 13) {
      Swal.fire({
        text: "CNIC should be of 13 digits",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.agentForm.controls.mobileNo.value == "" || this.agentForm.controls.mobileNo.value == null) {
      Swal.fire({
        text: "Enter Mobile Number",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.agentForm.controls.agentAddress.value == "" || this.agentForm.controls.agentAddress.value == null) {
      Swal.fire({
        text: "Enter Address",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  editAgent(p, i) {
    this.showhide("Edit");
    this.selectedCountry = Number(p.countryID);
    this.selectedRegion = Number(p.stateID);
    this.agentForm.setValue({
      agentId: p.agentId,
      agenttypeID: p.agenttypeID,
      agentName: p.agentName,
      countryID: p.countryID,
      cityID: p.cityID,
      CNIC: p.CNIC,
      cnicExpiry: p.cnicExpiry,
      PhoneNo: p.PhoneNo,
      IATARegNo: p.IATARegNo,
      emailAddress: p.emailAddress,
      faxNo: p.faxNo,
      stateID: p.stateID,
      mobileNo: p.mobileNo,
      cid: p.cid,
      agentAddress: p.agentAddress,
      greyList: p.greyList
    })
    this.getRegions();
    this.getCities();
  }
  getAgentDetail(p) {
    this.viewAgent.agentId = p.agentId;
    this.viewAgent.agenttypeID = p.agenttypeID;
    this.viewAgent.agentName = p.agentName;
    this.viewAgent.countryID = p.countryID;
    this.viewAgent.cityID = p.cityID;
    this.viewAgent.CNIC = p.CNIC;
    this.viewAgent.cnicExpiry = p.cnicExpiry;
    this.viewAgent.PhoneNo = p.PhoneNo;
    this.viewAgent.IATARegNo = p.IATARegNo;
    this.viewAgent.emailAddress = p.emailAddress;
    this.viewAgent.faxNo = p.faxNo;
    this.viewAgent.mobileNo = p.mobileNo;
    this.viewAgent.agentType = p.agentType;
    this.viewAgent.countryName = p.countryName;
    this.viewAgent.regionName = p.regionName;
    this.viewAgent.cityName = p.cityName;
    this.viewAgent.agentAddress = p.agentAddress;
    this.viewAgent.cid = p.cityID;
    this.viewAgent.greyList = p.greyList;
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
  getAgentTypes() {
    this.API.getdata('/Setups/getAgentTypes').subscribe(c => {
      if (c != null) {
        this.agentTypes = c;
      }
    },
      error => {

        Swal.fire({
          text: error,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  getConsignees() {
    this.API.getdata('/Setups/getConsignee').subscribe(c => {
      if (c != null) {

        this.destroyDT(0, false).then(destroyed => {

          this.consigneeResponse = c;
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
  editNew(p, ndx) {
    this.selectedCountry = Number(p.countryID);
    this.selectedRegion = Number(p.stateID);
    this.getRegions();
    this.getCities();
    this.showhide("Edit");
    this.agentForm.patchValue(p);
  }
  setAgent(value) {
    if (this.GV.GoodsCallFrom == "AgentDetailForTab1") {
      this.notifyNewAgentTab1.emit(value);
    }
    if (this.GV.GoodsCallFrom == "AgentDetailForTab2") {
      this.notifyNewAgentTab2.emit(value);
    }
    //notifyNewAgentTab2
    // if (this.GV.GoodsCallFrom == "AWBHouse") {
    //   this.notifyHouse.emit(value);
    // }

  }
  addFieldValue() {
    this.agentsResponse.push(this.newData)
  }
  uploadFile(file, status) {
    const formData = new FormData();
    formData.append('fileByte', file.data);
    formData.append('moduleID', '4');
    formData.append('modulePK', this.agentForm.controls.agentId.value);
    formData.append('attType', "1");
    file.inProgress = true;
    this.API.PostData('/Attachment/uploadFile', formData).subscribe(c => {
      // this.showHideATT('Cancel');
      // this.getAttachments();
      Swal.fire({
        text: "Uploaded successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
      if (status == "Front") {
        this.fileNameFront = "Choose file..."
      }
      else {
        this.fileNameBack = "Choose file..."
      }
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
    this.agentForm.controls.atttypeID.setValue(0);
  }
  onClick(status) {
    if (status == "Front") {
      const fileUploadFront = this.fileUploadFront.nativeElement; fileUploadFront.onchange = () => {
        this.filesFront = [];
        for (let index = 0; index < fileUploadFront.files.length; index++) {
          const file = fileUploadFront.files[index];
          this.filesFront.push({ data: file, inProgress: false, progress: 0 });
        }
        this.fileNameFront = this.filesFront[0].data.name;
      };
      fileUploadFront.click();
    }
    else {
      const fileUploadBack = this.fileUploadBack.nativeElement; fileUploadBack.onchange = () => {
        this.filesBack = [];
        for (let index = 0; index < fileUploadBack.files.length; index++) {
          const file = fileUploadBack.files[index];
          this.filesBack.push({ data: file, inProgress: false, progress: 0 });
        }
        this.fileNameBack = this.filesBack[0].data.name;
      };
      fileUploadBack.click();
    }

  }
  uploadFileFront() {
    if (this.fileNameFront == "" || this.fileNameFront == null || this.fileNameFront == "Choose file...") {
      Swal.fire({
        text: "Attach CNIC Front",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.fileUploadFront.nativeElement.value = '';
    this.filesFront.forEach(file => {
      this.uploadFile(file, 'Front');
    });
  }
  uploadFileBack() {
    if (this.fileNameBack == "" || this.fileNameBack == null || this.fileNameBack == "Choose file...") {
      Swal.fire({
        text: "Attach CNIC Back",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.fileUploadBack.nativeElement.value = '';
    this.filesBack.forEach(file => {
      this.uploadFile(file, 'Back');
    });
  }

  viewImage(p) {
    var imageFile = this.attachmentResponse.find(x => x.attachmentID == p.attachmentID);
    var image = new Image();
    image.src = "data:image/jpg;base64," + imageFile.fileData;
    var w = window.open("");
    w.document.write(image.outerHTML);
  }
  setAgentID(p) {
    this.fileNameFront = "Choose file..."
    this.fileNameBack = "Choose file..."
    this.agentForm.controls.agentId.setValue(p.agentId);
  }
}
