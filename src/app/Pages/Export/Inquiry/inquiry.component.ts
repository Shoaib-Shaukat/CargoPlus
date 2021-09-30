import { Component, OnInit, ViewChildren, QueryList, ElementRef, Input, EventEmitter, Output, OnChanges, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { ApiService } from '../../../Services/API/api.service';
import { responseAirLines } from '../../AdminArea/Models/airLines';
import { IGX_INPUT_GROUP_TYPE } from 'igniteui-angular';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { IgxGridComponent, IgxStringFilteringOperand } from 'igniteui-angular';
import { responseFlight } from '../Flights/Model/flightsModel'
import { HouseAWB, dimWeightResponse, InquiryResponse, noticeTypesRequest, attachmentResponse, acceptanceModel, requestAcceptance, responseAcceptance, responseModel, employeeModel, weightResponseModel, getWeight, requestWeight } from '../Acceptance/Model/acceptance'
import { IgxExpansionPanelComponent } from 'igniteui-angular';
import { requestGoods, responseGoods } from '../../AdminArea/Models/Goods';
import { responseCommodity } from '../../AdminArea/Models/commodity';
import { agentsResponse, agentType, requestAgent } from './../../AdminArea/Models/agents'
import { vehicleResponse } from '../../AdminArea/Models/vehicles'
import { shippereResponse } from '../../AdminArea/Models/shipper';
import { consigneeResponse, requestConsignee } from '../../AdminArea/Models/consignee';
import { Router } from '@angular/router';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions } from '../../AdminArea/Models/cityState';
@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css']
})
export class InquiryComponent implements OnInit {
  AWBNo:string;
  @ViewChildren('closeConsolidatorModal') closeConsolidatorModal: ElementRef;
  @ViewChildren('closeNatureOfGoodsModal') closeNatureOfGoodsModal: ElementRef;
  @ViewChildren('closeCommodityModal') closeCommodityModal: ElementRef;
  @ViewChildren('closeAgentsModal') closeAgentsModal: ElementRef;

  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;

  dtOptions0: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject();

  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject();

  dtOptions3: DataTables.Settings = {};
  dtTrigger3: Subject<any> = new Subject();

  dtOptions4: DataTables.Settings = {};
  dtTrigger4: Subject<any> = new Subject();

  dtOptions5: DataTables.Settings = {};
  dtTrigger5: Subject<any> = new Subject();

  dtOptions6: DataTables.Settings = {};
  dtTrigger6: Subject<any> = new Subject();

  dtOptions7: DataTables.Settings = {};
  dtTrigger7: Subject<any> = new Subject();
  // agentID: number;
  // goodsID: number;
  selectGood(selectedGoodID: number) {
    this.GoodsID = selectedGoodID;
    this.AWBForm.controls.goodsId.setValue(selectedGoodID);
    this.closeNatureOfGoodsModal["first"].nativeElement.click();
  }

  selectNewAgentForTab1(selectedAgentID: number) {
    this.AgentIDForTab1 = selectedAgentID;
    this.AWBForm.controls.consolidatorID.setValue(selectedAgentID);
    this.getConsolidatorDetail();
    this.closeConsolidatorModal["first"].nativeElement.click();
  }
  selectNewAgentForTab2(selectedAgentID: number) {
    this.AgentIDForTab2 = selectedAgentID;
    this.AgentForm.controls.agentId.setValue(selectedAgentID);
    this.getAgentDetail();
    this.closeAgentsModal["first"].nativeElement.click();
  }
  //comid
  selectCommodity(selectedCommodityID: number) {
    this.ComidID = selectedCommodityID;
    this.AWBForm.controls.comid.setValue(selectedCommodityID);
    this.closeCommodityModal["first"].nativeElement.click();
  }
  GoodsID: number;
  AgentIDForTab1: number;
  AgentIDForTab2: number;
  ComidID: number;
  // addnewAgent: boolean = false;
  consigneeResponse: consigneeResponse[];
  shippereResponse: shippereResponse[];
  agentTypes: agentType[];
  // requestCity: requestCity;
  // goodsForm: FormGroup;
  // consigneeForm: FormGroup;
  // agentForm: FormGroup;
  // requestGoods: requestGoods;
  // requestConsignee: requestConsignee;
  // selectedRegion: number;
  // selectedCountry: number;
  // responseCity: responseCity[];
  // responseCountries: responseCountries[];
  // requestStRegions: requestStRegions;
  // responseRegions: responseRegions[];
  // requestAgent: requestAgent;
  HouseAWB: HouseAWB[];
  dimWeightResponse: dimWeightResponse[];
  InquiryResponse: InquiryResponse[];
  noticeTypesRequest: noticeTypesRequest;
  attachmentResponse: attachmentResponse[];
  fileName: string = "Choose file...";
  // @ViewChild("fileUpload") fileUpload: ElementRef; files = [];

  acceptanceModel: acceptanceModel;
  acceptanceData = [];
  acceptanceID: number = 0
  vehicleResponse: vehicleResponse[];
  requestWeight: requestWeight;
  getWeight: getWeight;
  weightResponseModel: weightResponseModel;
  agentsResponse: agentsResponse[];
  ConsolidatorResponse: agentsResponse[];
  responseCommodity: responseCommodity[];
  responseGoods: responseGoods[];
  responseFlight: responseFlight[];
  public panel: IgxExpansionPanelComponent;
  public arivalTime: Date = new Date();
  public handedTime: Date = new Date();
  public handedDate: Date = new Date();
  public date: Date = new Date();
  validAWBFrom: boolean = false;
  validForm: boolean = false;
  validFormWeight: boolean = false;
  validFormWeightdim: boolean = false;
  generalRequest: requestAcceptance;
  employeeModel: employeeModel;
  responseModel: responseModel;
  selectedText: string;
  responseAirLines: responseAirLines[];
  acceptanceForm: FormGroup;
  weightForm: FormGroup;
  AWBForm: FormGroup;
  AgentForm: FormGroup;
  ShipperForm: FormGroup;
  houseForm: FormGroup;
  DimweightForm: FormGroup;
  CosigneeForm: FormGroup;
  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showAcceptance: boolean = true;
  addnewAcceptance: boolean = false;

  shownewButtonWeight: boolean = true;
  showeditButtonWeight: boolean = false;
  showSaveButtonWeight: boolean = false;
  showCancelButtonWeight: boolean = false;
  showWeight: boolean = true;
  addnewWeight: boolean = false;

  shownewButtonWeightDim: boolean = true;
  showeditButtonWeightDim: boolean = false;
  showSaveButtonWeightDim: boolean = false;
  showCancelButtonWeightDim: boolean = false;
  showWeightDim: boolean = true;
  addnewWeightDim: boolean = false;



  shownewButtonAtt: boolean = true;
  showeditButtonAtt: boolean = false;
  showSaveButtonAtt: boolean = false;
  showCancelButtonAtt: boolean = false;
  showAtt: boolean = true;
  addnewAtt: boolean = false;


  shownewButtonHouse: boolean = true;
  showeditButtonHouse: boolean = false;
  showSaveButtonHouse: boolean = false;
  showCancelButtonHouse: boolean = false;
  showHouse: boolean = true;
  addnewHouse: boolean = false;






  constructor(public API: ApiService, public GV: GvarService, private router: Router,) {
    // this.requestGoods = new requestGoods();
    // this.requestConsignee = new requestConsignee();
    // this.requestCity = new requestCity();
    // this.responseCity = [];
    // this.responseRegions = [];
    // this.responseCountries = [];
    // this.requestStRegions = new requestStRegions();
    // this.requestAgent = new requestAgent();
    // this.agentTypes = [];
    this.HouseAWB = [];
    this.InquiryResponse = [];
    this.noticeTypesRequest = new noticeTypesRequest();
    this.attachmentResponse = [];
    this.shippereResponse = [];
    this.acceptanceModel = new acceptanceModel();
    this.acceptanceData = [];
    this.vehicleResponse = [];
    this.requestWeight = new requestWeight();
    this.getWeight = new getWeight();
    this.weightResponseModel = new weightResponseModel();
    this.responseAirLines = [];
    this.responseModel = new responseModel();
    this.employeeModel = new employeeModel();
    this.generalRequest = new requestAcceptance();
    this.responseGoods = [];
    this.responseCommodity = [];
    this.ConsolidatorResponse = [];
    this.agentsResponse = [];
    this.dimWeightResponse = [];

  }
  // InitializeConsigneeForm(): any {
  //   this.consigneeForm = new FormGroup({
  //     country: new FormControl("", [Validators.required]),
  //     region: new FormControl("", [Validators.required]),
  //     cityid: new FormControl("", [Validators.required]),
  //     mobile: new FormControl(""),
  //     fax: new FormControl(""),
  //     email: new FormControl(""),
  //     cnic: new FormControl(""),
  //     ph: new FormControl("", [Validators.required]),
  //     address: new FormControl("", [Validators.required]),
  //     cid: new FormControl(),
  //     consigneeName: new FormControl("", [Validators.required]),
  //   });
  // }
  // InitializeNatureOfGoodForm(): any {
  //   this.goodsForm = new FormGroup({
  //     Nature: new FormControl("", [Validators.required]),
  //     cutTime: new FormControl("", [Validators.required]),
  //     destination: new FormControl("", [Validators.required]),
  //     goodsId: new FormControl("", [Validators.required]),
  //   });
  // }
  // InitializeAgentForm(): any {
  //   this.agentForm = new FormGroup({
  //     agenttypeID: new FormControl("", [Validators.required]),
  //     agentId: new FormControl(""),
  //     agentName: new FormControl("", [Validators.required]),
  //     agentAddress: new FormControl("", [Validators.required]),
  //     cnicExpiry: new FormControl("", [Validators.required]),
  //     PhoneNo: new FormControl("", [Validators.required]),
  //     emailAddress: new FormControl("", [Validators.required]),
  //     faxNo: new FormControl("", [Validators.required]),
  //     countryID: new FormControl("", [Validators.required]),
  //     IATARegNo: new FormControl("", [Validators.required]),
  //     stateID: new FormControl("", [Validators.required]),
  //     cityID: new FormControl("", [Validators.required]),
  //     CNIC: new FormControl("", [Validators.required]),
  //     cid: new FormControl(""),

  //     mobileNo: new FormControl(),
  //   });
  // }
  ngOnInit(): void {
    // this.InitializeConsigneeForm();
    // this.InitializeNatureOfGoodForm();
    // this.InitializeAgentForm();
    this.InitializeHouseForm();
    this.InitializeConsignee();
    this.consigneeResponse = [];
    this.getVehicleTypes();
    this.InitializeShipper();
    this.InitializeWeightForm();
    this.InitializeForm();
    this.InitializeAWBForm();
    this.InitializeAgent();
    this.InitializeDimWeightForm();
    this.getAirLines();
    this.acceptanceForm.controls.AWBType.setValue("General");
    this.acceptanceForm.controls.station.setValue("Head Office");
    this.acceptanceForm.controls.Destination.setValue("Rest of world");
    this.getAgents();
    this.getGoods();
    this.getCommodity();
    this.getConsolidator();
    this.getShippers();
    this.getConsignees();
    this.showhide('New');
    //this.getCountries();
    this.getAgentTypes();
  }

  // selectAgent(agentID: any) {
  //   this.agentID = agentID;
  // }
  // selectGoods(goodsID: any) {
  //   this.goodsID = goodsID;

  // }
  // this.getDimWeight();
  //this.getAttachments();



  getAgents() {
    this.API.getdata('/Setups/getAgents').subscribe(c => {
      if (c != null) {
        this.agentsResponse = c;
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

  public formatDate(val: Date) {
    return new Intl.DateTimeFormat('en-US').format(val);
  }

  public formatCurrency(val: string) {
    return parseInt(val, 10).toFixed(2);
  }
  InitializeAWBForm(): any {
    this.AWBForm = new FormGroup({
      AWBNo: new FormControl("", [Validators.required]),
      acceptanceID: new FormControl("", [Validators.required]),
      flightID: new FormControl("", [Validators.required]),
      aricraftRegNo: new FormControl("", [Validators.required]),
      departureDate: new FormControl(),
      departureTime: new FormControl(),
      Destination: new FormControl(),
      goodsId: new FormControl("", [Validators.required]),
      Pieces: new FormControl("", [Validators.required]),
      grossWeight: new FormControl("", [Validators.required]),
      dimensionalWeight: new FormControl("", [Validators.required]),
      comid: new FormControl("", [Validators.required]),
      cuttTime: new FormControl("", [Validators.required]),
      agentId: new FormControl("", [Validators.required]),
      consolidatorID: new FormControl("", [Validators.required]),
      LicenseNo: new FormControl(),
      AWBID: new FormControl(),
      AgentType: new FormControl(),
      CNICNo: new FormControl('', [
        Validators.pattern("^[0-9]{13}$")]),
      CNICExp: new FormControl(),
      isNew: new FormControl(true),
    });
  }
  InitializeHouseForm(): any {
    this.houseForm = new FormGroup({
      HNo: new FormControl(),
      HAWBNo: new FormControl(),
      acceptanceID: new FormControl(),
      flightID: new FormControl(),
      AWBNo: new FormControl(),
      grossWeight: new FormControl(),
      chargeableWeight: new FormControl(),
      width: new FormControl(),
      height: new FormControl(),
      length: new FormControl(),
      pieces: new FormControl(),
      dimensionalWeight: new FormControl(),
      comid: new FormControl(),
      goodsIdHouse: new FormControl(),
      shipperId: new FormControl(),
      cid: new FormControl(),
      flightNo: new FormControl(),
      ALCode: new FormControl(),
      regNo: new FormControl(),
      depDate: new FormControl(),
      Destination: new FormControl(),
      depTime: new FormControl(),
      Nature: new FormControl(),
      shippercountryName: new FormControl(),
      shipperPhoneNo: new FormControl(),
      shipperAddress: new FormControl(),
      consigneeAddress: new FormControl(),
      consigneecountryName: new FormControl(),
      consigneePhoneNo: new FormControl(),
      isNew: new FormControl(true),
    });
  }
  InitializeAgent(): any {
    this.AgentForm = new FormGroup({
      agentId: new FormControl("", [Validators.required]),
      A_LicenseNo: new FormControl(),
      A_AgentType: new FormControl(),
      A_CNICNo: new FormControl('', [
        Validators.pattern("^[0-9]{13}$")]),
      A_CNICExp: new FormControl(),
      A_Address: new FormControl(),
      AWBID: new FormControl(),

    });
  }
  InitializeShipper(): any {
    this.ShipperForm = new FormGroup({
      shipperId: new FormControl("", [Validators.required]),
      shippercountryName: new FormControl(),
      shipperregionName: new FormControl(),
      shippercityName: new FormControl(),
      shipperCNIC: new FormControl('', [
        Validators.pattern("^[0-9]{13}$")]),
      shipperEmailAddress: new FormControl(),
      shipperPhoneNo: new FormControl(),
      ShippermobileNo: new FormControl(),
      shipperAddress: new FormControl(),
      AWBID: new FormControl(),

    });
  }
  InitializeConsignee(): any {
    this.CosigneeForm = new FormGroup({
      cid: new FormControl("", [Validators.required]),
      consigneecountryName: new FormControl(),
      consigneeregionName: new FormControl(),
      consigneecityName: new FormControl(),
      consigneeCNIC: new FormControl('', [
        Validators.pattern("^[0-9]{13}$")]),
      consigneeEmailAddress: new FormControl(),
      consigneePhoneNo: new FormControl(),
      consigneemobileNo: new FormControl(),
      consigneeAddress: new FormControl(),
      AWBID: new FormControl(),

    });
  }
  InitializeForm(): any {

    this.acceptanceForm = new FormGroup({
      acceptanceID: new FormControl(""),
      ALCode: new FormControl("", [Validators.required]),
      ALName: new FormControl("", [Validators.required]),
      Destination: new FormControl("", [Validators.required]),
      AWBType: new FormControl("", [Validators.required]),
      empID: new FormControl("", [Validators.required]),
      empName: new FormControl("", Validators.required),
      station: new FormControl("", [Validators.required]),
      Schedule: new FormControl("", [Validators.required]),

      ArrivalDate: new FormControl(this.date, [Validators.required]),
      ArrivalTime: new FormControl(this.arivalTime, [Validators.required]),
      DOBy: new FormControl(""),
      Occurance: new FormControl(""),
      FurShipment: new FormControl(""),
      DNR: new FormControl(""),
      OvrShipment: new FormControl(""),
      holdShipment: new FormControl(""),
      otherAirline: new FormControl(""),
      otherAirlineCode: new FormControl(""),
      docNo: new FormControl(""),
      docDate: new FormControl(""),
      HandedDate: new FormControl(this.handedDate),
      HandedTime: new FormControl(this.handedTime),
      Status: new FormControl(""),
      Remarks: new FormControl(""),
      isNew: new FormControl(true),
      Abbr: new FormControl(""),
      searchID: new FormControl(""),
    });
  }
  InitializeWeightForm(): any {
    this.weightForm = new FormGroup({
      weightDetailID: new FormControl(),
      acceptanceID: new FormControl(),
      AWBNo: new FormControl(),
      empID: new FormControl(),
      vehicleID: new FormControl(""),
      vehNumer: new FormControl(""),
      driverName: new FormControl(""),
      driverCNIC: new FormControl('', [
        Validators.pattern("^[0-9]{13}$")]),
      firstWt: new FormControl(""),
      firstTime: new FormControl(""),
      firstDate: new FormControl(""),
      Status: new FormControl(""),
      secondWt: new FormControl(""),
      secondTime: new FormControl(""),
      secondDate: new FormControl(""),
      AWBWt: new FormControl(""),
      netWt: new FormControl(""),
      remarks: new FormControl(""),
      isNew: new FormControl(""),
    });
  }
  InitializeDimWeightForm(): any {
    this.DimweightForm = new FormGroup({
      dimWeightID: new FormControl(),
      acceptanceID: new FormControl(),
      AWBNo: new FormControl(),
      goodsidDIM: new FormControl(),
      pieces: new FormControl(""),
      length: new FormControl(""),
      width: new FormControl(""),
      height: new FormControl(""),
      sizeinCM: new FormControl(""),
      totalWeight: new FormControl(""),
      remarks: new FormControl(""),
      isNew: new FormControl(""),
    });
  }

  showhide(callfrm: string) {
    if (callfrm == "New") {
      //this.addnewAgent = true;
      this.addnewAcceptance = true;
      this.showAcceptance = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      // this.requestGoods.isNew = true;
      // this.requestAgent.isNew = true;
      this.resetForm();

    }
    if (callfrm == "Cancel") {
      //this.addnewAgent = false;
      this.addnewAcceptance = false;
      this.showAcceptance = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      // this.requestGoods.isNew = false;
      // this.requestAgent.isNew = false;
      this.acceptanceForm.reset(this.acceptanceForm.value);
      // this.agentForm.reset(this.agentForm.value);
      this.resetForm();
    }
    if (callfrm == "Edit") {
      // this.addnewAgent = true;
      this.addnewAcceptance = true;
      this.showAcceptance = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      // this.requestGoods.isNew = false;
      // this.requestAgent.isNew = false;
    }
  }
  resetForm(value: any = undefined) {
    this.acceptanceForm.reset(value);
    this.acceptanceForm.reset(this.acceptanceForm.value);
    this.acceptanceForm.controls.AWBType.setValue("General");
    this.acceptanceForm.controls.station.setValue("Head Office");
    this.acceptanceForm.controls.Destination.setValue("Rest of world");
    this.handedTime = new Date();
    this.handedDate = new Date();
    this.date = new Date();
    this.arivalTime = new Date();
    this.acceptanceForm.controls.ArrivalTime.setValue(this.arivalTime);
    this.acceptanceForm.controls.ArrivalDate.setValue(this.date);
    this.acceptanceForm.controls.HandedDate.setValue(this.handedDate);
    this.acceptanceForm.controls.HandedTime.setValue(this.handedTime);
    this.acceptanceForm.controls.FurShipment.setValue(false);
    this.acceptanceForm.controls.DNR.setValue(false);
    this.acceptanceForm.controls.Occurance.setValue(false);
    this.acceptanceForm.controls.OvrShipment.setValue(false);
    this.acceptanceForm.controls.holdShipment.setValue(false);
    this.acceptanceForm.controls.otherAirline.setValue(false);
  }
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
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

          }
          else {
            resolve(true);
          }

        }
      });
    });
  };
  // saveGoods() {
  //   this.requestGoods.Nature = this.goodsForm.controls.Nature.value;
  //   this.requestGoods.cutTime = this.goodsForm.controls.cutTime.value;
  //   this.requestGoods.destination = this.goodsForm.controls.destination.value;
  //   this.requestGoods.goodsId = this.goodsForm.controls.goodsId.value;
  //   this.goodsForm.reset();
  //   this.API.PostData('/Setups/saveNatureofGoods', this.requestGoods).subscribe(c => {
  //     if (c != null) {
  //       Swal.fire({
  //         text: "Nature of goods saved successfully.",
  //         icon: 'success',
  //         confirmButtonText: 'OK'
  //       });
  //       this.showhide("Cancel");
  //       this.getGoods();
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
  // saveConsigneeForm() {
  //   if (this.validForm == true) {
  //     this.requestConsignee.cid = this.consigneeForm.controls.cid.value;
  //     this.requestConsignee.CNIC = this.consigneeForm.controls.cnic.value;
  //     this.requestConsignee.PhoneNo = this.consigneeForm.controls.ph.value;
  //     this.requestConsignee.cityID = this.consigneeForm.controls.cityid.value;
  //     this.requestConsignee.countryID = this.consigneeForm.controls.country.value;
  //     this.requestConsignee.emailAddress = this.consigneeForm.controls.email.value;
  //     this.requestConsignee.faxNo = this.consigneeForm.controls.fax.value;
  //     this.requestConsignee.mobileNo = this.consigneeForm.controls.mobile.value;
  //     this.requestConsignee.stateID = this.consigneeForm.controls.region.value;
  //     this.requestConsignee.consigneeAddress = this.consigneeForm.controls.address.value;
  //     this.requestConsignee.consigneeName = this.consigneeForm.controls.consigneeName.value;
  //     this.requestCity.RegionId = this.selectedRegion;
  //     this.API.PostData('/Setups/saveConsignee', this.requestConsignee).subscribe(c => {
  //       if (c != null) {
  //         Swal.fire({
  //           text: "Consignee saved successfully.",
  //           icon: 'success',
  //           confirmButtonText: 'OK'
  //         });
  //         this.showhide("Cancel");
  //         this.getConsignees();
  //       }
  //     },
  //       error => {
  //         Swal.fire({
  //           text: error.error.Message,
  //           icon: 'error',
  //           confirmButtonText: 'OK'
  //         });
  //       });

  //   }
  // }
  // saveShipperForm() {
  //   this.requestAgent.agentId = this.agentForm.controls.agentId.value;
  //   this.requestAgent.agenttypeID = this.agentForm.controls.agenttypeID.value;
  //   this.requestAgent.agentName = this.agentForm.controls.agentName.value;
  //   this.requestAgent.countryID = this.agentForm.controls.countryID.value;
  //   this.requestAgent.cityID = this.agentForm.controls.cityID.value;
  //   this.requestAgent.CNIC = this.agentForm.controls.CNIC.value;
  //   this.requestAgent.agentAddress = this.agentForm.controls.agentAddress.value;
  //   this.requestAgent.stateID = this.agentForm.controls.stateID.value;
  //   this.requestAgent.cnicExpiry = this.agentForm.controls.cnicExpiry.value;
  //   this.requestAgent.PhoneNo = this.agentForm.controls.PhoneNo.value;
  //   this.requestAgent.IATARegNo = this.agentForm.controls.IATARegNo.value;
  //   this.requestAgent.emailAddress = this.agentForm.controls.emailAddress.value;
  //   this.requestAgent.faxNo = this.agentForm.controls.faxNo.value;
  //   this.requestAgent.mobileNo = this.agentForm.controls.mobileNo.value;
  //   this.requestAgent.cid = this.agentForm.controls.cid.value;
  //   this.agentForm.reset();
  //   this.API.PostData('/Setups/saveAgent', this.requestAgent).subscribe(c => {
  //     if (c != null) {
  //       Swal.fire({
  //         text: "Agent saved successfully.",
  //         icon: 'success',
  //         confirmButtonText: 'OK'
  //       });
  //       this.showhide("Cancel");
  //       this.getAgents();
  //     }
  //   },
  //     error => {
  //       Swal.fire({
  //         text: error,
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //     });
  // }
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
  // getCountries() {
  //   this.API.getdata('/Generic/getCountries').subscribe(c => {
  //     if (c != null) {
  //       this.responseCountries = c;
  //     }
  //   },
  //     error => {
  //       Swal.fire({
  //         text: error,
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //     });
  // }
  // getCities() {
  //   this.requestCity.RegionId = this.selectedRegion;
  //   this.API.PostData('/Generic/getCities', this.requestCity).subscribe(c => {
  //     if (c != null) {
  //       this.responseCity = c;
  //     }
  //   },
  //     error => {
  //       Swal.fire({
  //         text: error,
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //     });
  // }
  // getRegions() {
  //   this.requestStRegions.CountryId = this.selectedCountry;
  //   this.API.PostData('/Generic/getRegions', this.requestStRegions).subscribe(c => {
  //     if (c != null) {
  //       this.responseRegions = c;
  //     }
  //   },
  //     error => {
  //       Swal.fire({
  //         text: error,
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //     });
  // }
  // changeRegion(event) {
  //   this.selectedRegion = event;
  //   this.responseCity = [];
  //   this.getCities();
  // }
  // changeCountry(event) {
  //   this.selectedCountry = event;
  //   this.responseRegions = [];
  //   this.responseCity = [];
  //   this.getRegions();
  // }
  getemployeeDetail() {
    if (this.acceptanceForm.controls.empID.value != undefined) {
      this.API.getdata('/Generic/getEmpDetail?empID=' + this.acceptanceForm.controls.empID.value).subscribe(c => {
        if (c != null) {
          this.employeeModel = c;
          this.acceptanceForm.controls['empID'].setValue(this.employeeModel.empID);
          this.acceptanceForm.controls['empName'].setValue(this.employeeModel.employeeName);
        }
        else {
          this.acceptanceForm.controls['empID'].setValue("");
          this.acceptanceForm.controls['empName'].setValue("");
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
  validations() {
    if (this.acceptanceForm.controls.ALCode.value == "" || this.acceptanceForm.controls.ALCode.value == null) {
      Swal.fire({
        text: "Select AirLine.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.acceptanceForm.controls.Destination.value == "" || this.acceptanceForm.controls.Destination.value == null) {
      Swal.fire({
        text: "Select Destination.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.acceptanceForm.controls.AWBType.value == "" || this.acceptanceForm.controls.AWBType.value == null) {
      Swal.fire({
        text: "Select AWB Type.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.acceptanceForm.controls.empID.value == "" || this.acceptanceForm.controls.empID.value == null) {
      Swal.fire({
        text: "Select Menzies RAS Employee.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
  SaveAcceptance(call: string) {
    this.validations();
    if (this.validForm) {
      if (call == "New") {
        this.acceptanceForm.controls.isNew.setValue(true);
      }
      else {
        this.acceptanceForm.controls.isNew.setValue(false);
      }
      this.API.PostData('/Acceptance/saveGeneralAcceptance', this.acceptanceForm.value).subscribe(c => {
        if (c != null) {
          this.acceptanceForm.controls.acceptanceID.setValue(c.acceptanceID);
          this.acceptanceForm.controls.isNew.setValue(false);

          Swal.fire({
            text: "Acceptance saved successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
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
  getFlights() {
    this.API.getdata('/Flights/getdepartureFlights?ALCode=' + this.acceptanceForm.controls.ALCode.value).subscribe(c => {
      if (c != null) {
        this.responseFlight = c;
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
  getFlightDetail() {
    var flightDetail = this.responseFlight.find(x => x.flightID == this.AWBForm.controls.flightID.value);
    if (flightDetail != undefined) {
      this.AWBForm.controls.aricraftRegNo.setValue(flightDetail.regNo);
      this.AWBForm.controls.departureDate.setValue(flightDetail.depDate);
      this.AWBForm.controls.departureTime.setValue(flightDetail.depTime);
      this.AWBForm.controls.Destination.setValue(flightDetail.depDestination);
    }
  }
  getGoods() {
    this.API.getdata('/Setups/getNatofGoods').subscribe(c => {
      if (c != null) {
        this.responseGoods = c;
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
  getCommodity() {
    this.API.getdata('/Setups/getCommodity').subscribe(c => {
      if (c != null) {
        this.responseCommodity = c;
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
  getConsolidator() {
    this.API.getdata('/Generic/getConsolidator').subscribe(c => {
      if (c != null) {
        this.ConsolidatorResponse = c;
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
  getConsolidatorDetail() {
    var ConsolidatorDetail = this.ConsolidatorResponse.find(x => x.agentId == this.AWBForm.controls.consolidatorID.value);
    if (ConsolidatorDetail != undefined) {
      this.AWBForm.controls.LicenseNo.setValue(ConsolidatorDetail.IATARegNo);
      this.AWBForm.controls.AgentType.setValue(ConsolidatorDetail.agentType);
      this.AWBForm.controls.CNICNo.setValue(ConsolidatorDetail.CNIC);
      this.AWBForm.controls.CNICExp.setValue(ConsolidatorDetail.cnicExpiry);
    }
  }
  getAgentDetail() {
    var ageentDetail = this.agentsResponse.find(x => x.agentId == this.AgentForm.controls.agentId.value);
    if (ageentDetail != undefined) {
      this.AgentForm.controls.A_LicenseNo.setValue(ageentDetail.IATARegNo);
      this.AgentForm.controls.A_AgentType.setValue(ageentDetail.agentType);
      this.AgentForm.controls.A_CNICNo.setValue(ageentDetail.CNIC);
      this.AgentForm.controls.A_CNICExp.setValue(ageentDetail.cnicExpiry);
      this.AgentForm.controls.A_Address.setValue(ageentDetail.agentAddress);
    }
  }
  getWeightDetail() {
    this.getWeight.acceptanceID = this.AWBForm.controls.acceptanceID.value;
    this.API.PostData('/Acceptance/getWeight', this.getWeight).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.weightResponseModel.weightDetailResponse = c.weightDetailResponse;
          this.dtTrigger0.next();
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
  getVehicleTypes() {
    this.API.getdata('/Setups/getVehicles').subscribe(c => {
      if (c != null) {
        this.vehicleResponse = c;

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
  showHideDimWeight(callfrm: string) {
    if (callfrm == "New") {
      this.addnewWeightDim = true;
      this.showWeightDim = false;
      this.showCancelButtonWeightDim = true;
      this.showSaveButtonWeightDim = true;
      this.showeditButtonWeightDim = false;
      this.shownewButtonWeightDim = false;
      this.DimweightForm.reset(true);
      this.DimweightForm.controls.isNew.setValue(true);
    }
    if (callfrm == "Cancel") {
      this.addnewWeightDim = false;
      this.showWeightDim = true;
      this.showCancelButtonWeightDim = false;
      this.showSaveButtonWeightDim = false;
      this.showeditButtonWeightDim = false;
      this.shownewButtonWeightDim = true;
      this.DimweightForm.reset(true);
      this.DimweightForm.controls.isNew.setValue(false);
    }
    if (callfrm == "Edit") {
      this.addnewWeightDim = true;
      this.showWeightDim = false;
      this.showCancelButtonWeightDim = true;
      this.showSaveButtonWeightDim = false;
      this.showeditButtonWeightDim = true;
      this.shownewButtonWeightDim = false;
      this.DimweightForm.controls.isNew.setValue(false);
    }
  }
  showHideWeight(callfrm: string) {
    if (callfrm == "New") {
      this.addnewWeight = true;
      this.showWeight = false;
      this.showCancelButtonWeight = true;
      this.showSaveButtonWeight = true;
      this.showeditButtonWeight = false;
      this.shownewButtonWeight = false;
      this.weightForm.reset(true);
      this.weightForm.controls.isNew.setValue(true);
    }
    if (callfrm == "Cancel") {
      this.addnewWeight = false;
      this.showWeight = true;
      this.showCancelButtonWeight = false;
      this.showSaveButtonWeight = false;
      this.showeditButtonWeight = false;
      this.shownewButtonWeight = true;
      this.weightForm.reset(true);
      this.weightForm.controls.isNew.setValue(true);
    }
    if (callfrm == "Edit") {
      this.addnewWeight = true;
      this.showWeight = false;
      this.showCancelButtonWeight = true;
      this.showSaveButtonWeight = false;
      this.showeditButtonWeight = true;
      this.shownewButtonWeight = false;
      this.weightForm.controls.isNew.setValue(false);
    }
  }
  showHideWeightNature(callfrm: string) {
    if (callfrm == "New") {
      this.addnewWeight = true;
      this.showWeight = false;
      this.showCancelButtonWeight = true;
      this.showSaveButtonWeight = true;
      this.showeditButtonWeight = false;
      this.shownewButtonWeight = false;
      //this.requestGoods.isNew = true;
      this.weightForm.reset(true);
      this.weightForm.controls.isNew.setValue(true);
    }
    if (callfrm == "Cancel") {
      this.addnewWeight = false;
      this.showWeight = true;
      this.showCancelButtonWeight = false;
      this.showSaveButtonWeight = false;
      this.showeditButtonWeight = false;
      this.shownewButtonWeight = true;
      //this.requestGoods.isNew = false;
      this.weightForm.reset(true);
      this.weightForm.controls.isNew.setValue(true);
    }
    if (callfrm == "Edit") {
      this.addnewWeight = true;
      this.showWeight = false;
      this.showCancelButtonWeight = true;
      this.showSaveButtonWeight = false;
      this.showeditButtonWeight = true;
      this.shownewButtonWeight = false;
      //this.requestGoods.isNew = false;
      this.weightForm.controls.isNew.setValue(false);
    }
  }
  showHideWeightAgent(callfrm: string) {
    if (callfrm == "New") {
      this.addnewWeight = true;
      this.showWeight = false;
      this.showCancelButtonWeight = true;
      this.showSaveButtonWeight = true;
      this.showeditButtonWeight = false;
      this.shownewButtonWeight = false;
      //this.requestAgent.isNew = true;
      this.weightForm.reset(true);
      this.weightForm.controls.isNew.setValue(true);
    }
    if (callfrm == "Cancel") {
      this.addnewWeight = false;
      this.showWeight = true;
      this.showCancelButtonWeight = false;
      this.showSaveButtonWeight = false;
      this.showeditButtonWeight = false;
      this.shownewButtonWeight = true;
      //this.requestAgent.isNew = false;
      this.weightForm.reset(true);
      this.weightForm.controls.isNew.setValue(true);
    }
    if (callfrm == "Edit") {
      this.addnewWeight = true;
      this.showWeight = false;
      this.showCancelButtonWeight = true;
      this.showSaveButtonWeight = false;
      this.showeditButtonWeight = true;
      this.shownewButtonWeight = false;
      //this.requestAgent.isNew = false;
      this.weightForm.controls.isNew.setValue(false);
    }
  }
  showHideATT(callfrm: string) {
    if (callfrm == "New") {
      this.addnewAtt = true;
      this.showAtt = false;
      this.showCancelButtonAtt = true;
      this.showSaveButtonAtt = true;
      this.showeditButtonAtt = false;
      this.shownewButtonAtt = false;

      // this.requestGoods.isNew = true;
      // this.requestAgent.isNew = true;
    }
    if (callfrm == "Cancel") {
      this.addnewAtt = false;
      this.showAtt = true;
      this.showCancelButtonAtt = false;
      this.showSaveButtonAtt = false;
      this.showeditButtonAtt = false;
      this.shownewButtonAtt = true;
      // this.requestGoods.isNew = false;
      // this.requestAgent.isNew = false;
    }
    if (callfrm == "Edit") {
      this.addnewAtt = true;
      this.showAtt = false;
      this.showCancelButtonAtt = true;
      this.showSaveButtonAtt = false;
      this.showeditButtonAtt = true;
      this.shownewButtonAtt = false;
      // this.requestGoods.isNew = false;
      // this.requestAgent.isNew = false;
    }
  }
  showHideHouse(callfrm: string) {
    if (callfrm == "New") {
      this.addnewHouse = true;
      this.showHouse = false;
      this.showCancelButtonHouse = true;
      this.showSaveButtonHouse = true;
      this.showeditButtonHouse = false;
      this.shownewButtonHouse = false;
      // this.requestGoods.isNew = true;
      // this.requestAgent.isNew = true;
      this.houseForm.reset(true);
      this.houseForm.controls.isNew.setValue(true);
    }
    if (callfrm == "Cancel") {
      this.addnewHouse = false;
      this.showHouse = true;
      this.showCancelButtonHouse = false;
      this.showSaveButtonHouse = false;
      this.showeditButtonHouse = false;
      this.shownewButtonHouse = true;
      // this.requestGoods.isNew = false;
      // this.requestAgent.isNew = false;
      this.houseForm.controls.isNew.setValue(false);
      this.houseForm.reset(true);
    }
    if (callfrm == "Edit") {
      this.addnewHouse = true;
      this.showHouse = false;
      this.showCancelButtonHouse = true;
      this.showSaveButtonHouse = false;
      this.showeditButtonHouse = true;
      this.shownewButtonHouse = false;
      // this.requestGoods.isNew = false;
      // this.requestAgent.isNew = false;
      this.houseForm.controls.isNew.setValue(false);
    }
  }
  validationsWeight() {

    if (this.AWBForm.controls.acceptanceID.value == "" || this.AWBForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Select or Save Acceptance First.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeight = false;
      return;
    }
    if (this.weightForm.controls.vehicleID.value == "" || this.weightForm.controls.vehicleID.value == null) {
      Swal.fire({
        text: "Please select Vehicle.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeight = false;
      return;
    }
    if (this.weightForm.controls.vehNumer.value == "" || this.weightForm.controls.vehNumer.value == null) {
      Swal.fire({
        text: "Enter vehicle number.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeight = false;
      return;
    }
    if (this.weightForm.controls.driverName.value == "" || this.weightForm.controls.driverName.value == null) {
      Swal.fire({
        text: "Enter driver name.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeight = false;
      return;
    }
    if (this.weightForm.controls.driverCNIC.value == "" || this.weightForm.controls.driverCNIC.value == null) {
      Swal.fire({
        text: "Enter driver CNIC.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeight = false;
      return;
    }
    this.validFormWeight = true;
  }
  saveWeight() {
    this.validationsWeight();
    if (this.validFormWeight == true) {
      this.weightForm.controls.acceptanceID.setValue(this.AWBForm.controls.acceptanceID.value);
      this.weightForm.controls.AWBNo.setValue(this.AWBForm.controls.AWBNo.value);

      this.API.PostData('/Acceptance/saveweightDetail', this.weightForm.value).subscribe(c => {
        Swal.fire({
          text: "Weight added successfully.",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.showHideWeight("Cancel");
        this.getWeightDetail();
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
  addNewNatureOfGood() {
    this.router.navigate(['/Admin/Agents']);
  }
  addNewConsolidator() {
    this.router.navigate(['/Admin/Agents']);
  }
  validationsWeightdDIM() {

    if (this.AWBForm.controls.acceptanceID.value == "" || this.AWBForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Select or Save Acceptance First.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeightdim = false;
      return;
    }
    if (this.DimweightForm.controls.goodsidDIM.value == "" || this.DimweightForm.controls.goodsidDIM.value == null) {
      Swal.fire({
        text: "Select nature of goods.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeightdim = false;
      return;
    }
    if (this.DimweightForm.controls.pieces.value == "" || this.DimweightForm.controls.pieces.value == null) {
      Swal.fire({
        text: "Enter number of pieces.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeightdim = false;
      return;
    }
    if (this.DimweightForm.controls.length.value == "" || this.DimweightForm.controls.length.value == null) {
      Swal.fire({
        text: "Enter length.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeightdim = false;
      return;
    }
    if (this.DimweightForm.controls.width.value == "" || this.DimweightForm.controls.width.value == null) {
      Swal.fire({
        text: "Enter width.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeightdim = false;
      return;
    }
    if (this.DimweightForm.controls.height.value == "" || this.DimweightForm.controls.height.value == null) {
      Swal.fire({
        text: "Enter height.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeightdim = false;
      return;
    }
    this.validFormWeightdim = true;
  }
  saveWeightDIM() {
    this.validationsWeightdDIM();
    if (this.validFormWeightdim == true) {
      this.DimweightForm.controls.acceptanceID.setValue(this.AWBForm.controls.acceptanceID.value);
      this.DimweightForm.controls.AWBNo.setValue(this.AWBForm.controls.AWBNo.value);

      this.API.PostData('/Acceptance/saveDimWt', this.DimweightForm.value).subscribe(c => {
        Swal.fire({
          text: "Dimensional Weight added successfully.",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.showHideDimWeight("Cancel");
        this.getDimWeight();
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
  saveAWBDetail() {
    this.AwbDetailValidations();
    if (this.validAWBFrom) {

      if (this.AWBForm.controls.AWBID.value == "" || this.AWBForm.controls.AWBID.value == null) {
        this.AWBForm.controls.isNew.setValue(true);
      }
      else {
        this.AWBForm.controls.isNew.setValue(false);
      }
      this.AWBForm.controls.acceptanceID.setValue(this.acceptanceForm.controls.acceptanceID.value);
      this.API.PostData('/Acceptance/addawbDetail', this.AWBForm.value).subscribe(c => {
        if (c != null) {
          this.AWBForm.controls.AWBID.setValue(c.AWBID);
          Swal.fire({
            text: "Airbill detail has been updated successfully.",
            icon: 'success',
            confirmButtonText: 'OK'
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
  getShippers() {
    this.API.getdata('/Setups/getShipper').subscribe(c => {
      if (c != null) {
        this.shippereResponse = c;
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
  getShipperDetail() {
    var shipperDetail = this.shippereResponse.find(x => x.shipperId == this.ShipperForm.controls.shipperId.value);
    if (shipperDetail != undefined) {
      this.ShipperForm.controls.shipperAddress.setValue(shipperDetail.shipperAddress);
      this.ShipperForm.controls.shipperPhoneNo.setValue(shipperDetail.PhoneNo);
      this.ShipperForm.controls.shipperEmailAddress.setValue(shipperDetail.emailAddress);

      this.ShipperForm.controls.ShippermobileNo.setValue(shipperDetail.mobileNo);
      this.ShipperForm.controls.shipperregionName.setValue(shipperDetail.regionName);
      this.ShipperForm.controls.shippercountryName.setValue(shipperDetail.countryName);
      this.ShipperForm.controls.shippercityName.setValue(shipperDetail.cityName);
      this.ShipperForm.controls.shipperCNIC.setValue(shipperDetail.CNIC);
    }
  }
  getConsigneeDetail() {
    var consigneeDetail = this.consigneeResponse.find(x => x.cid == this.CosigneeForm.controls.cid.value);
    if (consigneeDetail != undefined) {
      this.CosigneeForm.controls.consigneeAddress.setValue(consigneeDetail.consigneeAddress);
      this.CosigneeForm.controls.consigneePhoneNo.setValue(consigneeDetail.PhoneNo);
      this.CosigneeForm.controls.consigneeEmailAddress.setValue(consigneeDetail.emailAddress);

      this.CosigneeForm.controls.consigneemobileNo.setValue(consigneeDetail.mobileNo);
      this.CosigneeForm.controls.consigneeregionName.setValue(consigneeDetail.regionName);
      this.CosigneeForm.controls.consigneecountryName.setValue(consigneeDetail.countryName);
      this.CosigneeForm.controls.consigneecityName.setValue(consigneeDetail.cityName);
      this.CosigneeForm.controls.consigneeCNIC.setValue(consigneeDetail.CNIC);
    }
  }
  getConsignees() {
    this.API.getdata('/Setups/getConsignee').subscribe(c => {
      if (c != null) {
        this.consigneeResponse = c;
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
  AwbDetailValidations() {

    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Save the acceptance first.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBForm.controls.AWBNo.value == "" || this.AWBForm.controls.AWBNo.value == null) {
      Swal.fire({
        text: "Enter AWB Number.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBForm.controls.flightID.value == "" || this.AWBForm.controls.flightID.value == null) {
      Swal.fire({
        text: "Select flight.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBForm.controls.goodsId.value == "" || this.AWBForm.controls.goodsId.value == null) {
      Swal.fire({
        text: "Select nature of goods.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBForm.controls.Pieces.value == "" || this.AWBForm.controls.Pieces.value == null) {
      Swal.fire({
        text: "Enter number of pieces.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBForm.controls.comid.value == "" || this.AWBForm.controls.comid.value == null) {
      Swal.fire({
        text: "Select Commodity.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBForm.controls.consolidatorID.value == "" || this.AWBForm.controls.consolidatorID.value == null) {
      Swal.fire({
        text: "Select Consolidator.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    this.validAWBFrom = true;
  }
  SaveAgent() {
    if (this.AWBForm.controls.AWBID.value == "" || this.AWBForm.controls.AWBID.value == null) {
      Swal.fire({
        text: "Save the AWB Detail First.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.AgentForm.controls.agentId.value == "" || this.AgentForm.controls.agentId.value == null) {
      Swal.fire({
        text: "Select Agent.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.AgentForm.controls.AWBID.setValue(this.AWBForm.controls.AWBID.value);
    this.API.PostData('/Acceptance/addAgent', this.AgentForm.value).subscribe(c => {
      if (c != null) {

        Swal.fire({
          text: "Agent saved successfully.",
          icon: 'success',
          confirmButtonText: 'OK'
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
  saveShipper() {
    if (this.AWBForm.controls.AWBID.value == "" || this.AWBForm.controls.AWBID.value == null) {
      Swal.fire({
        text: "Save the AWB Detail First.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.ShipperForm.controls.shipperId.value == "" || this.ShipperForm.controls.shipperId.value == null) {
      Swal.fire({
        text: "Select Shipper.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.ShipperForm.controls.AWBID.setValue(this.AWBForm.controls.AWBID.value);
    this.API.PostData('/Acceptance/saveShipper', this.ShipperForm.value).subscribe(c => {
      if (c != null) {

        Swal.fire({
          text: "Shipper saved successfully.",
          icon: 'success',
          confirmButtonText: 'OK'
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
  saveConsignee() {
    if (this.AWBForm.controls.AWBID.value == "" || this.AWBForm.controls.AWBID.value == null) {
      Swal.fire({
        text: "Save the AWB Detail First.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.CosigneeForm.controls.cid.value == "" || this.CosigneeForm.controls.cid.value == null) {
      Swal.fire({
        text: "Select Consignee.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.CosigneeForm.controls.AWBID.setValue(this.AWBForm.controls.AWBID.value);
    this.API.PostData('/Acceptance/saveConsignee', this.CosigneeForm.value).subscribe(c => {
      if (c != null) {

        Swal.fire({
          text: "consignee saved successfully.",
          icon: 'success',
          confirmButtonText: 'OK'
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
  searchAcceptance() {

  }
  editWeight(p) {
    this.showHideWeight("Edit");
    this.weightForm.patchValue(p);
  }
  editWeightDim(p) {
    this.showHideDimWeight("Edit");
    this.DimweightForm.patchValue(p);
  }
  // uploadFiles() {
  //   this.fileUpload.nativeElement.value = '';
  //   this.files.forEach(file => {
  //     this.uploadFile(file);
  //   });
  //}
  uploadFile(file) {
    const formData = new FormData();
    formData.append('fileByte', file.data);
    formData.append('moduleID', this.acceptanceForm.controls.acceptanceID.value);
    formData.append('moduleName', "Acceptance");
    file.inProgress = true;
    this.API.PostData('/Attachment/uploadFile', formData).subscribe(c => {
      this.showHideATT('Cancel');
      this.getAttachments();
    });
  }
  onClick() {
    // const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
    //   this.files = [];
    //   for (let index = 0; index < fileUpload.files.length; index++) {
    //     const file = fileUpload.files[index];
    //     this.files.push({ data: file, inProgress: false, progress: 0 });
    //   }
    //   this.fileName = this.files[0].data.name;
    // };
    //fileUpload.click();
  }
  getAttachments() {
    this.API.getdata('/Acceptance/getAcceptanceAttachments?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
      if (c != null) {
        this.destroyDT(4, false).then(destroyed => {
          this.attachmentResponse = c;
          this.dtTrigger4.next();
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
  viewImage(p) {
    var imageFile = this.attachmentResponse.find(x => x.attachmentID == p.attachmentID);
    var image = new Image();
    image.src = "data:image/jpg;base64," + imageFile.fileData;
    var w = window.open("");
    w.document.write(image.outerHTML);
  }
  getNoticeTypes() {
    this.noticeTypesRequest.ALCode = this.acceptanceForm.controls.ALCode.value;
    this.noticeTypesRequest.goodsId = this.AWBForm.controls.goodsId.value;
    this.API.PostData('/Acceptance/getNoticeTypes', this.noticeTypesRequest).subscribe(c => {
      if (c != null) {
        this.destroyDT(2, false).then(destroyed => {
          this.InquiryResponse = c;
          this.dtTrigger2.next();
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
  getDimWeight() {
    this.API.getdata('/Acceptance/getDimWeight?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
      if (c != null) {
        this.destroyDT(1, false).then(destroyed => {
          this.dimWeightResponse = c;
          this.dtTrigger1.next();
        });
      }
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      });
  }
  calculateCM() {

  }
  getShipperDetailHouse() {
    var shipperDetail = this.shippereResponse.find(x => x.shipperId == this.houseForm.controls.shipperId.value);
    if (shipperDetail != undefined) {
      this.houseForm.controls.shipperAddress.setValue(shipperDetail.shipperAddress);
      this.houseForm.controls.shipperPhoneNo.setValue(shipperDetail.PhoneNo);
      this.houseForm.controls.shippercountryName.setValue(shipperDetail.countryName);
    }
  }
  getConsigneeDetailHouse() {
    var consigneeDetail = this.consigneeResponse.find(x => x.cid == this.houseForm.controls.cid.value);
    if (consigneeDetail != undefined) {
      this.houseForm.controls.consigneeAddress.setValue(consigneeDetail.consigneeAddress);
      this.houseForm.controls.consigneePhoneNo.setValue(consigneeDetail.PhoneNo);
      this.houseForm.controls.consigneecountryName.setValue(consigneeDetail.countryName);
    }
  }
  getChargeable() {
    if (this.houseForm.controls.pieces.value != "" || this.houseForm.controls.pieces.value != null
      || this.houseForm.controls.length.value != null || this.houseForm.controls.length.value != null
      || this.houseForm.controls.height.value != null || this.houseForm.controls.height.value != null
      || this.houseForm.controls.width.value != null || this.houseForm.controls.width.value != null) {
      var width = Number(this.houseForm.controls.width.value);
      var length = Number(this.houseForm.controls.length.value);
      var height = Number(this.houseForm.controls.height.value);
      var pieces = Number(this.houseForm.controls.pieces.value);
      var chargeableWt = (width * length * height * pieces) / 6000;
      this.houseForm.controls.chargeableWeight.setValue(chargeableWt);

    }
  }
  calculateNetWeight() {
    if (this.weightForm.controls.firstWt.value != "" && this.weightForm.controls.firstWt.value != null
      && this.weightForm.controls.secondWt.value != null && this.weightForm.controls.secondWt.value != null) {
      var firstWt = Number(this.weightForm.controls.firstWt.value);
      var secondWt = Number(this.weightForm.controls.secondWt.value);
      var netWt = firstWt - secondWt;
      this.weightForm.controls.netWt.setValue(netWt);

    }
  }
  saveHouse() {
    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Save the acceptance first.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.AWBForm.controls.AWBID.value == "" || this.AWBForm.controls.AWBID.value == null) {
      Swal.fire({
        text: "Save the AWB Detail First.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.HAWBNo.value == "" || this.houseForm.controls.HAWBNo.value == null) {
      Swal.fire({
        text: "Enter house number.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.pieces.value == "" || this.houseForm.controls.pieces.value == null) {
      Swal.fire({
        text: "Enter number of pieces.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.length.value == "" || this.houseForm.controls.length.value == null) {
      Swal.fire({
        text: "Enten length.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.width.value == "" || this.houseForm.controls.width.value == null) {
      Swal.fire({
        text: "Enter width.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.height.value == "" || this.houseForm.controls.height.value == null) {
      Swal.fire({
        text: "Enter height.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.grossWeight.value == "" || this.houseForm.controls.grossWeight.value == null) {
      Swal.fire({
        text: "Enter gross weight.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.shipperId.value == "" || this.houseForm.controls.shipperId.value == null) {
      Swal.fire({
        text: "Select Shipper.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.cid.value == "" || this.houseForm.controls.cid.value == null) {
      Swal.fire({
        text: "Select consignee.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.houseForm.controls.acceptanceID.setValue(this.acceptanceForm.controls.acceptanceID.value);
    this.houseForm.controls.AWBNo.setValue(this.AWBForm.controls.AWBNo.value);
    this.houseForm.controls.flightID.setValue(this.AWBForm.controls.flightID.value);
    this.API.PostData('/Acceptance/saveHouse', this.houseForm.value).subscribe(c => {
      if (c != null) {

        Swal.fire({
          text: "House saved successfully.",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.getHouseDetail();
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
  getHouseDetail() {
    this.API.getdata('/Acceptance/getHouseDetail?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
      if (c != null) {
        this.destroyDT(3, false).then(destroyed => {
          this.HouseAWB = c;
          this.dtTrigger3.next();
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
  editHouse(p) {
    this.showHideHouse("Edit");
    this.houseForm.patchValue(p);
  }
  public saveNotice() {

  }
  getAWBDetail() {

  }






}

