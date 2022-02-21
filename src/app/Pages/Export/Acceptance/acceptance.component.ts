import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { ApiService } from '../../../Services/API/api.service';
import { responseAirLines } from '../../AdminArea/Models/airLines';
import { IGX_INPUT_GROUP_TYPE } from 'igniteui-angular';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { responseFlight } from '../Flights/Model/flightsModel'
import { weightScaleResponse, responceCargoMessage, responseDepFlight, responseDriver, requestWeightRPT, HouseAWB, dimWeightResponse, InquiryResponse, noticeTypesRequest, attachmentResponse, acceptanceModel, requestAcceptance, responseAcceptance, responseModel, employeeModel, weightResponseModel, getWeight, requestWeight, AcceptanceDetailModel, SaveALL, NewAcceptanceResponse, AttachmentTypes, responseStatus } from '../Acceptance/Model/acceptance'
import { IgxExpansionPanelComponent } from 'igniteui-angular';
import { responseGoods } from '../../AdminArea/Models/Goods';
import { responseCommodity } from '../../AdminArea/Models/commodity';
import { agentsResponse } from './../../AdminArea/Models/agents'
import { vehicleResponse } from '../../AdminArea/Models/vehicles'
import { shippereResponse } from '../../AdminArea/Models/shipper';
import { consigneeResponse } from '../../AdminArea/Models/consignee';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'
import { responseCountries } from '../../AdminArea/Models/cityState';
import { notifyResponse } from '../../Notify/notify/Notify-model';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
@Component({
  selector: 'app-acceptance',
  templateUrl: './acceptance.component.html',
  styleUrls: ['./acceptance.component.css'],
  providers: [{ provide: IGX_INPUT_GROUP_TYPE, useValue: 'box' }]
})
export class AcceptanceComponent implements OnInit {
  weightScaleResponse: weightScaleResponse[];
  CreatedBy: string;
  CreatedDate: Date;
  ModifedBy: string;
  ModifiedDate: Date;
  showDIS: boolean = false;
  showFHL = false;
  showTFD: boolean = false;
  showRCT: boolean = false;
  showRCS: boolean = false;
  @ViewChildren('EmailTypeModal') EmailTypeModal: ElementRef;
  @ViewChildren('TFDModel') TFDModel: ElementRef;
  @ViewChildren('RCTModel') RCTModel: ElementRef;
  @ViewChildren('DISModel') DISModel: ElementRef;
  @ViewChildren('FHLModel') FHLModel: ElementRef;
  emailData: any;
  responceCargoMessage: responceCargoMessage;
  EmailForm: FormGroup;
  @ViewChildren('flightPopup') flightPopup: ElementRef;
  showFlights: boolean = false;
  responseDepFlight: responseDepFlight[];
  responseCountries: responseCountries[];
  showNotify: boolean = false;
  notifyResponse: notifyResponse[];
  weightID: any;
  keywordCommodity = 'comm_description';
  data: any;
  pdfSrc: any;
  chargableWeightEmpty: boolean = false;
  CWTforAdd: number = 0;
  AgentName: string = "";
  responseStatus: responseStatus[];
  showShipper: boolean = false;
  showConsignee: boolean = false;
  showConsolidator: boolean = false;
  date: string;
  responseDriver: responseDriver;
  requestWeightRPT: requestWeightRPT;
  AttachmentTypes: AttachmentTypes[];
  public src: Blob;
  noticeTypeArrlen: number;
  NewAcceptanceResponse: NewAcceptanceResponse;
  public now: Date = new Date();
  CBM: any;
  SaveALL: SaveALL;
  SaveAll: any;
  delivered: boolean = false;
  editMode: boolean = false;
  TotalNetWeight: number = 0;
  notifyAWBState: boolean = false;
  notifyNewAgentTab2State: boolean = false;
  notifyComidState: boolean = false;
  notifyNewAgentTab1State: boolean = false;
  notifyShipperState: boolean = false;
  notifyConsigneeState: boolean = false;
  notifyNotifyState: boolean = false;
  AcceptanceDetailModel: AcceptanceDetailModel;
  /* #region  Initialize Variables etc */
  @ViewChildren('closeConsolidatorAWBModal') closeConsolidatorAWBModal: ElementRef;
  @ViewChildren('closeNatureOfGoodsModal') closeNatureOfGoodsModal: ElementRef;
  @ViewChildren('closeCommodityModal') closeCommodityModal: ElementRef;
  @ViewChildren('closeAgentsModal') closeAgentsModal: ElementRef;
  @ViewChildren('closeShipperModal') closeShipperModal: ElementRef;
  @ViewChildren('closeConsigneeModal') closeConsigneeModal: ElementRef;
  @ViewChildren('confirmRemoveWeight') confirmRemoveWeight: ElementRef;
  @ViewChildren('closeNotifyModal') closeNotifyModal: ElementRef;




  latestDate: any;
  GoodsID: number;
  AgentIDForTab1: number;
  AgentIDForTab2: number;
  ComidID: number;
  ShipperID: number;
  ConsigneeID: number;
  agentId: number;
  defaultAirline: responseAirLines;
  defaultFlight: responseFlight;
  defaultAttType: AttachmentTypes;
  consigneeResponse: consigneeResponse[];
  shippereResponse: shippereResponse[];
  HouseAWB: HouseAWB[];
  dimWeightResponse: dimWeightResponse[];
  InquiryResponse: InquiryResponse[];
  noticeTypesRequest: noticeTypesRequest;
  attachmentResponse: attachmentResponse[];
  fileName: string = "Choose file...";
  @ViewChild("fileUpload") fileUpload: ElementRef; files = [];
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
  responseGoodsMaster: responseGoods[];
  masterGoods: responseGoods;
  responseFlight: responseFlight[];
  public panel: IgxExpansionPanelComponent;
  validAWBFrom: boolean = false;
  validForm: boolean = false;
  validInputSearch: boolean = false;
  validFormWeight: boolean = false;
  validFormWeightdim: boolean = false;
  generalRequest: requestAcceptance;
  employeeModel: employeeModel;
  responseModel: responseModel;
  selectedText: string;
  responseAirLines: responseAirLines[];
  AWBForm: FormGroup;
  acceptanceForm: FormGroup;
  weightForm: FormGroup;
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
  showeditButtonWeight: boolean = true;
  showSaveButtonWeight: boolean = false;
  showCancelButtonWeight: boolean = false;
  showWeight: boolean = true;
  showNotice: boolean = true;
  addnewWeight: boolean = false;
  shownewButtonWeightDim: boolean = true;
  showeditButtonWeightDim: boolean = true;
  showSaveButtonWeightDim: boolean = false;
  showCancelButtonWeightDim: boolean = false;
  showWeightDim: boolean = true;
  addnewWeightDim: boolean = false;
  shownewButtonAtt: boolean = true;
  showeditButtonAtt: boolean = true;
  showSaveButtonAtt: boolean = false;
  showCancelButtonAtt: boolean = false;
  showAtt: boolean = true;
  addnewAtt: boolean = false;
  shownewButtonHouse: boolean = true;
  showeditButtonHouse: boolean = true;
  showSaveButtonHouse: boolean = false;
  showCancelButtonHouse: boolean = false;
  showHouse: boolean = true;
  addnewHouse: boolean = false;
  AWBNo: string;
  @ViewChildren(DataTableDirective)
  datatableElement: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject<any>();

  /* #endregion */
  constructor(private _sanitizer: DomSanitizer, public datepipe: DatePipe, public API: ApiService, public GV: GvarService, private router: Router,) {
    this.responseCountries = [];
    this.responseDepFlight = [];
    this.notifyResponse = [];
    this.responseStatus = [];
    this.date = new Date().toLocaleString().slice(0, 17);
    this.responseDriver = new responseDriver();
    this.requestWeightRPT = new requestWeightRPT();
    this.AttachmentTypes = [];
    this.SaveALL = new SaveALL();
    this.AcceptanceDetailModel = new AcceptanceDetailModel();
    this.NewAcceptanceResponse = new NewAcceptanceResponse();
    this.defaultAirline = new responseAirLines();
    this.defaultFlight = new responseFlight();
    this.defaultAttType = new AttachmentTypes();
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
    this.responseGoodsMaster = [];
    this.responseCommodity = [];
    this.ConsolidatorResponse = [];
    this.agentsResponse = [];
    this.dimWeightResponse = [];
    this.masterGoods = new responseGoods();
    this.responceCargoMessage = new responceCargoMessage();
    this.weightScaleResponse = [];
    this.getCommodity();
  }
  ngOnInit(): void {
    this.InitializeHouseForm();
    this.consigneeResponse = [];
    this.InitializeWeightForm();
    this.InitializeForm();
    this.InitializeDimWeightForm();
    this.acceptanceForm.controls.AWBType.setValue("General");
    this.acceptanceForm.controls.Region.setValue("Non Europe");
    this.getAirLines();
    this.getGoods();

    this.getVehicleTypes();
    this.showhide('New');
    this.setGrossWeight();
    this.getStatus();
    this.acceptanceForm.get("otherAirlineCode").disable();
    this.weightForm.controls.vehicleID.setValue("1");
    this.delivered = false;
    this.InquiryResponse = [];
    this.showHideWeight('New');
    this.getAgents();
    this.getConsignees();
    // this.getNotifies();
    this.getConsolidator();
    this.getShippers();
    this.getAttTypes();
    this.acceptanceForm.controls.approvalStatus.setValue(4);
    this.getCountries();
    this.getWeightScale();
  }
  /* #region  General Functions */
  uploadFile(file) {
    const formData = new FormData();
    formData.append('fileByte', file.data);
    formData.append('moduleID', '3');
    formData.append('modulePK', this.acceptanceForm.controls.acceptanceID.value);
    formData.append('attType', this.weightForm.controls.atttypeID.value);
    file.inProgress = true;
    this.API.PostData('/Attachment/uploadFile', formData).subscribe(c => {
      Swal.fire({
        text: "Attachment saved successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.showHideATT('Cancel');
      this.weightForm.controls.atttypeID.setValue(0);
      this.getAttachments();
    });
  }
  onClick() {
    const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
      this.files = [];
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0 });
      }
      this.fileName = this.files[0].data.name;
    };
    fileUpload.click();
  }
  uploadFiles() {
    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Save Acceptance First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.weightForm.controls.atttypeID.value == null || this.weightForm.controls.atttypeID.value == 0) {
      Swal.fire({
        text: "Select Att Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return
    }

    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.uploadFile(file);
    });

  }
  viewImage(p) {
    var imageFile = this.attachmentResponse.find(x => x.attachmentID == p.attachmentID);
    var image = new Image();
    var str = p.fileName.slice(p.fileName.length - 3);

    if (str == "jpg") {
      image.src = "data:image/jpg;base64," + imageFile.fileData;
      var w = window.open("");
      w.document.write(image.outerHTML);
    }
    if (str == "png") {
      image.src = "data:image/png;base64," + imageFile.fileData;
      var w = window.open("");
      w.document.write(image.outerHTML);
    }
    if (str == "jpeg") {
      image.src = "data:image/jpeg;base64," + imageFile.fileData;
      var w = window.open("");
      w.document.write(image.outerHTML);
    }
    if (str == "pdf") {
      image.src = "data:application/pdf;base64," + imageFile.fileData;
      this.pdfSrc = image.src;
      document.getElementById("openModalforPDF").click();
    }

  }
  getShipperDetailHouse() {
    var shipperDetail = this.shippereResponse.find(x => x.shipperId == this.houseForm.controls.shipperId.value);
    if (shipperDetail != undefined) {
      this.houseForm.controls.shipperAddress.setValue(shipperDetail.shipperAddress);
      this.houseForm.controls.shipperPhoneNo.setValue(shipperDetail.ContactNo);
      this.houseForm.controls.shippercountryName.setValue(shipperDetail.countryName);
      this.houseForm.controls.shippercityName.setValue(shipperDetail.cityName);
    }
  }
  getConsigneeDetailHouse() {
    var consigneeDetail = this.consigneeResponse.find(x => x.cid == this.houseForm.controls.cid.value);
    if (consigneeDetail != undefined) {
      this.houseForm.controls.consigneeAddress.setValue(consigneeDetail.consigneeAddress);
      this.houseForm.controls.consigneePhoneNo.setValue(consigneeDetail.contactNo);
      this.houseForm.controls.consigneecountryName.setValue(consigneeDetail.countryName);
      this.houseForm.controls.consigneecityName.setValue(consigneeDetail.cityName);
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
    }
    this.verifyChargable();
  }
  calculateNetWeight() {
    if (this.weightForm.controls.firstWt.value != "" && this.weightForm.controls.firstWt.value != null
      && this.weightForm.controls.secondWt.value != "" && this.weightForm.controls.secondWt.value != null) {
      var firstWt = Number(this.weightForm.controls.firstWt.value);
      var secondWt = Number(this.weightForm.controls.secondWt.value);
      var netWt = firstWt - secondWt;
      this.weightForm.controls.netWt.setValue(netWt);
    }
    else {
      this.weightForm.controls.netWt.setValue("");
    }
  }
  setGrossWeight() {
    this.weightForm.get("netWt").valueChanges.subscribe(x => {
    })
  }
  editHouse(p) {
    this.showHideHouse("Edit");
    this.houseForm.patchValue(p);
    this.getShipperDetailHouse();
    this.getConsigneeDetailHouse();
    this.houseForm.controls.goodsId.setValue(p.goodsid);
  }
  setGVGoods(value: string) {
    this.GV.GoodsCallFrom = value;
  }
  public formatCurrency(val: string) {
    return parseInt(val, 10).toFixed(2);
  }
  resetForm(value: any = undefined) {
    this.acceptanceForm.reset(value);
    this.acceptanceForm.reset(this.acceptanceForm.value);
    this.acceptanceForm.controls.AWBType.setValue("General");
    this.acceptanceForm.controls.Region.setValue("Non Europe");
    this.acceptanceForm.controls.approvalStatus.setValue(4);
    this.acceptanceForm.controls.FurShipment.setValue(false);
    this.acceptanceForm.controls.DNR.setValue(false);
    this.acceptanceForm.controls.Occurance.setValue(false);
    this.acceptanceForm.controls.OvrShipment.setValue(false);
    this.acceptanceForm.controls.holdShipment.setValue(false);
    this.acceptanceForm.controls.otherAirline.setValue(false);
  }
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
    if (this.acceptanceForm.controls.AWBNo.value == "" || this.acceptanceForm.controls.AWBNo.value == null) {
      Swal.fire({
        text: "Enter AWB No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.acceptanceForm.controls.ALCode.value == "" || this.acceptanceForm.controls.ALCode.value == null || this.acceptanceForm.controls.ALCode.value == "0") {
      Swal.fire({
        text: "Select Airline",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.acceptanceForm.controls.Destination.value == "" || this.acceptanceForm.controls.Destination.value == null) {
      Swal.fire({
        text: "Select Destination",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.acceptanceForm.controls.AWBType.value == "" || this.acceptanceForm.controls.AWBType.value == null) {
      Swal.fire({
        text: "Select AWB Type",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.acceptanceForm.controls.comid.value == "" || this.acceptanceForm.controls.comid.value == null || this.acceptanceForm.controls.comid.value == 0) {
      Swal.fire({
        text: "Select Commodity",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    this.validForm = true;
  }
  validationsWeight() {
    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Select or Save Acceptance First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeight = false;
      return;
    }
    if (this.weightForm.controls.vehicleID.value == "" || this.weightForm.controls.vehicleID.value == null) {
      Swal.fire({
        text: "Select Vehicle",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeight = false;
      return;
    }
    if ((this.weightForm.controls.vehicleID.value != "7") && (this.weightForm.controls.vehNumer.value == "" || this.weightForm.controls.vehNumer.value == null)) {
      Swal.fire({
        text: "Enter Vehicle No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeight = false;
      return;
    }
    if (this.weightForm.controls.driverName.value == "" || this.weightForm.controls.driverName.value == null) {
      Swal.fire({
        text: "Enter Driver Name",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeight = false;
      return;
    }
    if (this.weightForm.controls.pieces.value == "" || this.weightForm.controls.pieces.value == null) {
      Swal.fire({
        text: "Enter Pieces",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeight = false;
      return;
    }
    this.validFormWeight = true;
  }
  addNewNatureOfGood() {
    this.router.navigate(['/Admin/Agents']);
  }
  addNewConsolidator() {
    this.router.navigate(['/Admin/Agents']);
  }
  validationsWeightdDIM() {
    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Select or Save Acceptance First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeightdim = false;
      return;
    }
    if (this.DimweightForm.controls.pieces.value == "" || this.DimweightForm.controls.pieces.value == null) {
      Swal.fire({
        text: "Enter No of Pieces",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeightdim = false;
      return;
    }
    if (this.DimweightForm.controls.length.value == "" || this.DimweightForm.controls.length.value == null) {
      Swal.fire({
        text: "Enter Length",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeightdim = false;
      return;
    }
    if (this.DimweightForm.controls.width.value == "" || this.DimweightForm.controls.width.value == null) {
      Swal.fire({
        text: "Enter Width",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeightdim = false;
      return;
    }
    if (this.DimweightForm.controls.height.value == "" || this.DimweightForm.controls.height.value == null) {
      Swal.fire({
        text: "Enter Height",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validFormWeightdim = false;
      return;
    }
    this.validFormWeightdim = true;
  }
  getShipperDetail() {
    var shipperDetail = this.shippereResponse.find(x => x.shipperId == this.houseForm.controls.shipperId_shipperId.value);
    if (shipperDetail != undefined) {
      this.ShipperForm.controls.shipperAddress.setValue(shipperDetail.shipperAddress);
      this.ShipperForm.controls.shipperPhoneNo.setValue(shipperDetail.ContactNo);
      this.ShipperForm.controls.shipperEmailAddress.setValue(shipperDetail.emailAddress);
      this.ShipperForm.controls.ShippermobileNo.setValue(shipperDetail.mobileNo);
      this.ShipperForm.controls.shipperregionName.setValue(shipperDetail.regionName);
      this.ShipperForm.controls.shippercountryName.setValue(shipperDetail.countryName);
      this.ShipperForm.controls.shippercityName.setValue(shipperDetail.cityName);
      this.ShipperForm.controls.shipperCNIC.setValue(shipperDetail.CNIC);
    }
  }
  AwbDetailValidations() {
    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Save the Acceptance First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBForm.controls.AWBNo.value == "" || this.AWBForm.controls.AWBNo.value == null) {
      Swal.fire({
        text: "Enter AWB No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBForm.controls.Destination.value == "" || this.AWBForm.controls.Destination.value == null) {
      Swal.fire({
        text: "Enter Destination",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBForm.controls.comid.value == "" || this.AWBForm.controls.comid.value == null) {
      Swal.fire({
        text: "Select Commodity",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBForm.controls.consolidatorID.value == "" || this.AWBForm.controls.consolidatorID.value == null) {
      Swal.fire({
        text: "Select Consolidator",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    this.validAWBFrom = true;
  }
  searchAcceptance() {
  }
  editWeight(p) {
    this.showHideWeight("Edit");
    this.weightForm.patchValue(p);
    this.weightForm.controls.secondWtdatetime.setValue(this.datepipe.transform(p.secondWtdatetime, 'dd/MMM/yyyy HH:mm'));
    this.weightForm.controls.firstWtdatetime.setValue(this.datepipe.transform(p.firstWtdatetime, 'dd/MMM/yyyy HH:mm'));
  }
  editWeightDim(p) {
    this.showHideDimWeight("Edit");
    this.DimweightForm.patchValue(p);
  }
  /* #endregion */
  /* #region  Initialize All Forms */
  InitializeForm(): any {
    // Main Form
    this.acceptanceForm = new FormGroup({
      acceptanceID: new FormControl(""),
      ALCode: new FormControl("", [Validators.required]),
      ALName: new FormControl("", [Validators.required]),
      Destination: new FormControl("", [Validators.required]),
      Region: new FormControl("", [Validators.required]),
      AWBType: new FormControl("", [Validators.required]),
      Schedule: new FormControl("", [Validators.required]),
      AWBNo: new FormControl(""),
      CBM: new FormControl(""),
      SHC: new FormControl(""),
      DOBy: new FormControl(""),
      GDNo: new FormControl(""),
      Nature: new FormControl(""),
      Occurance: new FormControl(""),
      FurShipment: new FormControl(""),
      DNR: new FormControl(""),
      OvrShipment: new FormControl(""),
      holdShipment: new FormControl(""),
      otherAirline: new FormControl(""),
      otherAirlineCode: new FormControl(""),
      docNo: new FormControl(""),
      docDate: new FormControl(""),
      HandedDate: new FormControl(""),
      HandedTime: new FormControl(""),
      Status: new FormControl(""),
      AcceptanceRemarks: new FormControl(""),
      isNew: new FormControl(true),
      Abbr: new FormControl(""),
      searchID: new FormControl(""),
      goodsId: new FormControl("", [Validators.required]),
      cuttTime: new FormControl(""),
      grossWeight: new FormControl("", [Validators.required]),
      chargeableWeight: new FormControl(),
      dimensionalWeight: new FormControl("", [Validators.required]),
      Pieces: new FormControl("", [Validators.required]),
      comid: new FormControl(),
      agentId: new FormControl(),
      consolidatorID: new FormControl("", [Validators.required]),
      cid: new FormControl(),
      shipperId: new FormControl(),
      approvalStatus: new FormControl(),
      comm_description: new FormControl(""),
      IATARegNo: new FormControl(""),
      agentName: new FormControl(""),
      mobileNo: new FormControl(""),
      CNIC: new FormControl(""),
      agentAddress: new FormControl(""),
      PhoneNo: new FormControl(""),

      notifyID: new FormControl(""),

      ALCW: new FormControl(),
      AWBFee: new FormControl(),
      AWC: new FormControl(),
      AIS: new FormControl(),
      MYC: new FormControl(),
      TTL: new FormControl(),
      Rate: new FormControl(),
      CAA: new FormControl(),
      CCC: new FormControl(),
      SCC: new FormControl(),
      DV: new FormControl(),
      OTH: new FormControl(),
      depFlightNo: new FormControl(),
      depDate: new FormControl(),
      depTime: new FormControl(),
      flightID: new FormControl(),

      executionDate: new FormControl(),
    });
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
    this.AWBForm = new FormGroup({
      agentId: new FormControl(),
      comid: new FormControl(true),
      consolidatorID: new FormControl(true),
      cid: new FormControl(true),
      shipperId: new FormControl(true),
      AWBNo: new FormControl("", [Validators.required]),
      acceptanceID: new FormControl("", [Validators.required]),
      AgentType: new FormControl(),
      CNICNo: new FormControl('', [
        Validators.pattern("^[0-9]{13}$")]),
      CNICExp: new FormControl(),
      isNew: new FormControl(true),
      Destination: new FormControl(),
      ZIPCode: new FormControl(),
      shippercountryName: new FormControl(),
      shipperPhoneNo: new FormControl(),
      shipperAddress: new FormControl(),
      consigneeAddress: new FormControl(),
      consigneecountryName: new FormControl(),
      consigneecityName: new FormControl(),
      consigneePhoneNo: new FormControl(),
      agentAddress: new FormControl(),
      agentcountryName: new FormControl(),
      agentPhoneNo: new FormControl(),
      consolidatorCountryName: new FormControl(),
      consolidatorPhoneNo: new FormControl(),
      consolidatorAddress: new FormControl(),
      shippercityName: new FormControl(),


      notifyID: new FormControl(),
      airportID: new FormControl(),
      notifyName: new FormControl(),
      countryID: new FormControl(),
      cityID: new FormControl(),
      NotifyZIPCode: new FormControl(),
      contactNo: new FormControl(),
      createdBy: new FormControl(),
      createdDate: new FormControl(),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),
      isDeleted: new FormControl(),
      notifyCountryName: new FormControl(),
      notifyAddress: new FormControl(),

      ALCW: new FormControl(),
      AWBFee: new FormControl(),
      AWC: new FormControl(),
      AIS: new FormControl(),
      MYC: new FormControl(),
      TTL: new FormControl(),
      Rate: new FormControl(),
      CAA: new FormControl(),
      CCC: new FormControl(),
      SCC: new FormControl(),
      DV: new FormControl(),
      OTH: new FormControl(),

      executionDate: new FormControl(),
    });
  }
  // Weight Form
  InitializeWeightForm(): any {
    this.weightForm = new FormGroup({
      weightDetailID: new FormControl(),
      acceptanceID: new FormControl(),
      AWBNo: new FormControl(),
      empID: new FormControl(),
      vehicleID: new FormControl(),
      firstWtdatetime: new FormControl(),
      secondWtdatetime: new FormControl(),
      vehNumer: new FormControl(""),
      driverName: new FormControl(""),
      driverCNIC: new FormControl(""),
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
      atttypeID: new FormControl(""),
      pieces: new FormControl(""),
      attType: new FormControl(""),
      weightScaleID: new FormControl(""),
    });
  }
  // Dim Weight Form
  InitializeDimWeightForm(): any {
    this.DimweightForm = new FormGroup({
      dimWeightID: new FormControl(),
      acceptanceID: new FormControl(),
      AWBNo: new FormControl(),
      pieces: new FormControl(""),
      length: new FormControl(""),
      width: new FormControl(""),
      height: new FormControl(""),
      CBM: new FormControl(""),
      remarks: new FormControl(""),
      isNew: new FormControl(""),
    });
  }
  // House Form
  InitializeHouseForm(): any {
    this.houseForm = new FormGroup({
      HNo: new FormControl(),
      HAWBNo: new FormControl(),
      acceptanceID: new FormControl(),
      AWBNo: new FormControl(),
      houseWeight: new FormControl(),
      pieces: new FormControl(),
      comid: new FormControl(),
      goodsIdHouse: new FormControl(),
      shipperId: new FormControl(),
      cid: new FormControl(),
      flightNo: new FormControl(),
      ALCode: new FormControl(),
      regNo: new FormControl(),
      depDate: new FormControl(),
      Destination: new FormControl(),
      Nature: new FormControl(),
      shippercountryName: new FormControl(),
      shipperPhoneNo: new FormControl(),
      shippercityName: new FormControl(),
      shipperAddress: new FormControl(),
      consigneeAddress: new FormControl(),
      consigneecountryName: new FormControl(),
      consigneecityName: new FormControl(),
      consigneePhoneNo: new FormControl(),
      goodsId: new FormControl(),
      isNew: new FormControl(),
    });
  }
  /* #endregion */
  /* #region  Show Hide Forms */
  showhide(callfrm: string) {
    if (callfrm == "New") {
      this.addnewAcceptance = true;
      this.showAcceptance = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.resetForm();
    }
    if (callfrm == "Cancel") {
      this.addnewAcceptance = false;
      this.showAcceptance = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.acceptanceForm.reset(this.acceptanceForm.value);
      this.resetForm();
    }
    if (callfrm == "Edit") {
      this.addnewAcceptance = true;
      this.showAcceptance = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
      this.acceptanceForm.controls.isNew.setValue(false);
    }
  }
  showHideDimWeight(callfrm: string) {
    if (callfrm == "New") {
      this.addnewWeightDim = false;
      this.showWeightDim = true;
      this.showCancelButtonWeightDim = false;
      this.showSaveButtonWeightDim = false;
      this.showeditButtonWeightDim = true;
      this.shownewButtonWeightDim = true;
      this.DimweightForm.reset(false);
      this.DimweightForm.controls.isNew.setValue(true);
      this.DimweightForm.controls.AWBNo.setValue(this.AWBNo);
    }
    if (callfrm == "Cancel") {
      this.addnewWeightDim = true;
      this.showWeightDim = false;
      this.showCancelButtonWeightDim = true;
      this.showSaveButtonWeightDim = true;
      this.showeditButtonWeightDim = true;
      this.shownewButtonWeightDim = false;
      this.DimweightForm.reset(false);
      this.DimweightForm.controls.isNew.setValue(false);
    }
    if (callfrm == "Edit") {
      this.addnewWeightDim = false;
      this.showWeightDim = true;
      this.showCancelButtonWeightDim = false;
      this.showSaveButtonWeightDim = true;
      this.showeditButtonWeightDim = false;
      this.shownewButtonWeightDim = true;
      this.DimweightForm.controls.isNew.setValue(false);
    }
  }
  showHideWeight(callfrm: string) {
    if (callfrm == "New") {
      this.addnewWeight = false;
      this.showWeight = true;
      this.showNotice = true;
      this.showCancelButtonWeight = false;
      this.showSaveButtonWeight = false;
      this.showeditButtonWeight = true;
      this.shownewButtonWeight = true;
      this.weightForm.reset(false);
      this.weightForm.controls.vehicleID.setValue(1);

      this.weightForm.controls.isNew.setValue(true);
      this.weightForm.controls.AWBNo.setValue(this.acceptanceForm.controls.AWBNo.value);
      this.weightForm.controls.driverCNIC.setValue("9999999999999");
      this.weightForm.controls.driverName.setValue("KARACHI");
    }
    if (callfrm == "Cancel") {
      this.addnewWeight = true;
      this.showWeight = false;
      this.showNotice = false;
      this.showCancelButtonWeight = true;
      this.showSaveButtonWeight = true;
      this.showeditButtonWeight = true;
      this.shownewButtonWeight = false;
      this.weightForm.reset(false);
      this.weightForm.controls.vehicleID.setValue("1");

      this.weightForm.controls.isNew.setValue(true);
    }
    if (callfrm == "Edit") {
      this.addnewWeight = false;
      this.showWeight = true;
      this.showNotice = true;
      this.showCancelButtonWeight = false;
      this.showSaveButtonWeight = true;
      this.showeditButtonWeight = false;
      this.shownewButtonWeight = true;

      this.weightForm.controls.isNew.setValue(false);
    }
  }
  showHideATT(callfrm: string) {
    if (callfrm == "New") {
      this.addnewAtt = false;
      this.showAtt = true;
      this.showCancelButtonAtt = false;
      this.showSaveButtonAtt = false;
      this.showeditButtonAtt = true;
      this.shownewButtonAtt = true;
      // this.requestGoods.isNew = true;
      // this.requestAgent.isNew = true;
    }
    if (callfrm == "Cancel") {
      this.addnewAtt = true;
      this.showAtt = false;
      this.showCancelButtonAtt = true;
      this.showSaveButtonAtt = true;
      this.showeditButtonAtt = true;
      this.shownewButtonAtt = false;
      // this.requestGoods.isNew = false;
      // this.requestAgent.isNew = false;
    }
    if (callfrm == "Edit") {
      this.addnewAtt = false;
      this.showAtt = true;
      this.showCancelButtonAtt = false;
      this.showSaveButtonAtt = true;
      this.showeditButtonAtt = false;
      this.shownewButtonAtt = true;
      // this.requestGoods.isNew = false;
      // this.requestAgent.isNew = false;
    }
  }
  showHideHouse(callfrm: string) {
    if (callfrm == "New") {
      this.addnewHouse = false;
      this.showHouse = true;
      this.showCancelButtonHouse = false;
      this.showSaveButtonHouse = false;
      this.showeditButtonHouse = true;
      this.shownewButtonHouse = true;
      // this.requestGoods.isNew = true;
      // this.requestAgent.isNew = true;
      this.houseForm.reset(false);
      this.houseForm.controls.isNew.setValue(true);
    }
    if (callfrm == "Cancel") {
      this.addnewHouse = true;
      this.showHouse = false;
      this.showCancelButtonHouse = true;
      this.showSaveButtonHouse = true;
      this.showeditButtonHouse = true;
      this.shownewButtonHouse = false;
      // this.requestGoods.isNew = false;
      // this.requestAgent.isNew = false;
      this.houseForm.controls.isNew.setValue(false);
      this.houseForm.reset(false);
    }
    if (callfrm == "Edit") {
      this.addnewHouse = false;
      this.showHouse = true;
      this.showCancelButtonHouse = false;
      this.showSaveButtonHouse = true;
      this.showeditButtonHouse = false;
      this.shownewButtonHouse = true;
      // this.requestGoods.isNew = false;
      // this.requestAgent.isNew = false;
      this.houseForm.controls.isNew.setValue(false);
    }
  }
  /* #endregion */
  /* #region  Notify - Get Data from Diaglog Box*/
  notifyAWB(value) {
    var Exists = this.responseGoods.find(x => x.goodsId == value.goodsId);
    if (Exists == undefined) {
      this.responseGoods.push(value);
    }
    this.GoodsID = value.goodsId;
    this.acceptanceForm.controls.goodsId.setValue(value.goodsId);
    this.closeNatureOfGoodsModal["first"].nativeElement.click();
    this.GV.GoodsCallFrom = "";
  }
  notifyNewAgentTab1(value) {
    var Exists = this.agentsResponse.find(x => x.agentId == value.agentId);
    if (Exists == undefined) {
      this.agentsResponse.push(value);
    }
    this.agentId = value.agentId;
    this.acceptanceForm.controls.agentId.setValue(value.agentId);
    this.acceptanceForm.controls.IATARegNo.setValue(value.IATARegNo);
    this.agentInfo();
    this.closeAgentsModal["first"].nativeElement.click();
    this.GV.GoodsCallFrom = "";
  }
  notifyNewAgentTab2(value) {
    var Exists = this.ConsolidatorResponse.find(x => x.agentId == value.agentId);
    if (Exists == undefined) {
      this.ConsolidatorResponse.push(value);
    }
    // this.AgentIDForTab1 = value.agentId;
    this.AWBForm.controls.agentId.setValue(value.agentId);
    this.getConsolidatorDetailAWB();
    this.closeConsolidatorAWBModal["first"].nativeElement.click();
    this.GV.GoodsCallFrom = "";
  }
  notifyComid(value) {
    var Exists = this.responseCommodity.find(x => x.comid == value.comid);
    if (Exists == undefined) {
      this.responseCommodity.push(value);
    }
    this.ComidID = value.comid;
    this.acceptanceForm.controls.comid.setValue(value.comid);
    this.closeCommodityModal["first"].nativeElement.click();
    this.GV.GoodsCallFrom = "";
  }
  notifyShipper(value) {
    var Exists = this.shippereResponse.find(x => x.shipperId == value.shipperId);
    if (Exists == undefined) {
      this.shippereResponse.push(value);
    }
    //this.ShipperID = value.shipperId;
    if (this.showShipper == false) {
      this.AWBForm.controls.shipperId.setValue(value.shipperId);
      this.getShipperDetailAWB();
    }
    else {
      this.houseForm.controls.shipperId.setValue(value.shipperId);
      this.getShipperDetailHouse();
    }
    this.closeShipperModal["first"].nativeElement.click();
    this.GV.GoodsCallFrom = "";
  }

  notifyConsignee(value) {
    var Exists = this.consigneeResponse.find(x => x.cid == value.cid);
    if (Exists == undefined) {
      this.consigneeResponse.push(value);
    }
    //this.ConsigneeID = value.cid;
    if (this.showConsignee == true) {
      this.houseForm.controls.cid.setValue(value.cid);
      this.getConsigneeDetailHouse();
    }
    else {
      this.AWBForm.controls.cid.setValue(value.cid);
      this.getConsigneeDetailAWB();
    }
    this.closeConsigneeModal["first"].nativeElement.click();
    this.GV.GoodsCallFrom = "";
  }

  notifyNotify(value) {
    var Exists = this.notifyResponse.find(x => x.notifyID == value.notifyID);
    if (Exists == undefined) {
      this.notifyResponse.push(value);
    }
    //this.ComidID = value.comid;
    this.AWBForm.controls.notifyID.setValue(value.notifyID);
    this.getNotifyDetailAWB();
    this.closeNotifyModal["first"].nativeElement.click();
    this.GV.GoodsCallFrom = "";
  }


  setConsigneeDetail(status) {
    if (status == "AWB") {
      this.showConsignee = false;
    } else {
      this.showConsignee = true;
    }
  }
  setShipperDetail(status) {
    if (status == "AWB") {
      this.showShipper = false;
    } else {
      this.showShipper = true;
    }
  }
  setNotifyDetail(status) {
    if (status == "Notify") {
      this.showNotify = false;
    } else {
      this.showNotify = true;
    }
  }
  /* #endregion */
  /* #region  Save Calls */
  // Save Consignee
  // saveConsignee() {
  //   if (this.AWBForm.controls.AWBID.value == "" || this.AWBForm.controls.AWBID.value == null) {
  //     Swal.fire({
  //       text: "Save the AWB Detail First",
  //       icon: 'error',
  //       confirmButtonText: 'OK'
  //     });
  //     return;
  //   }
  //   if (this.CosigneeForm.controls.cid.value == "" || this.CosigneeForm.controls.cid.value == null) {
  //     Swal.fire({
  //       text: "Select Consignee",
  //       icon: 'error',
  //       confirmButtonText: 'OK'
  //     });
  //     return;
  //   }
  //   this.CosigneeForm.controls.AWBID.setValue(this.AWBForm.controls.AWBID.value);
  //   this.API.PostData('/Acceptance/saveConsignee', this.CosigneeForm.value).subscribe(c => {
  //     if (c != null) {
  //       Swal.fire({
  //         text: "Consignee Saved Successfully",
  //         icon: 'success',
  //         confirmButtonText: 'OK'
  //       });
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
  SaveAcceptance(call: string) {
    this.validations();
    if (this.validForm == true) {
      if (call == "New") {
        this.acceptanceForm.controls.isNew.setValue(true);
      }
      else {
        this.acceptanceForm.controls.isNew.setValue(false);
      }
      this.weightForm.controls.AWBNo.setValue(this.acceptanceForm.controls.AWBNo.value);
      this.DimweightForm.controls.AWBNo.setValue(this.acceptanceForm.controls.AWBNo.value);
      this.AWBForm.controls.AWBNo.setValue(this.acceptanceForm.controls.AWBNo.value);
      if (this.acceptanceForm.controls.HandedTime.value != null) {
        let timeA = this.acceptanceForm.get('HandedTime').value.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour24: true });
        this.acceptanceForm.get('HandedTime').setValue(timeA);
      }
      if (this.AWBForm.controls.consolidatorID.value != null) {
        this.acceptanceForm.controls.consolidatorID.setValue(this.AWBForm.controls.consolidatorID.value);
      }
      if (this.AWBForm.controls.cid.value != null) {
        this.acceptanceForm.controls.cid.setValue(this.AWBForm.controls.cid.value);
      }
      if (this.AWBForm.controls.shipperId.value != null) {
        this.acceptanceForm.controls.shipperId.setValue(this.AWBForm.controls.shipperId.value);
      }
      this.acceptanceForm.controls.ALCW.setValue(this.AWBForm.controls.ALCW.value);
      this.acceptanceForm.controls.AWBFee.setValue(this.AWBForm.controls.AWBFee.value);
      this.acceptanceForm.controls.AWC.setValue(this.AWBForm.controls.AWC.value);
      this.acceptanceForm.controls.AIS.setValue(this.AWBForm.controls.AIS.value);
      this.acceptanceForm.controls.MYC.setValue(this.AWBForm.controls.MYC.value);
      this.acceptanceForm.controls.TTL.setValue(this.AWBForm.controls.TTL.value);
      this.acceptanceForm.controls.Rate.setValue(this.AWBForm.controls.Rate.value);
      this.acceptanceForm.controls.CAA.setValue(this.AWBForm.controls.CAA.value);
      this.acceptanceForm.controls.CCC.setValue(this.AWBForm.controls.CCC.value);
      this.acceptanceForm.controls.SCC.setValue(this.AWBForm.controls.SCC.value);
      this.acceptanceForm.controls.DV.setValue(this.AWBForm.controls.DV.value);
      this.acceptanceForm.controls.OTH.setValue(this.AWBForm.controls.OTH.value);
      this.acceptanceForm.controls.executionDate.setValue(this.AWBForm.controls.executionDate.value);
      this.API.PostData('/Acceptance/saveGeneralAcceptance', this.acceptanceForm.value).subscribe(c => {
        if (c != null) {
          this.acceptanceForm.controls.acceptanceID.setValue(c.acceptanceID);
          this.acceptanceForm.controls.isNew.setValue(false);
          this.editMode = true;
          Swal.fire({
            text: "Acceptance Saved Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.AWBForm.controls.AWBNo.setValue(this.acceptanceForm.controls.AWBNo.value);
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
  saveWeight() {
    this.validationsWeight();
    if (this.validFormWeight == true) {
      this.weightForm.controls.AWBNo.setValue(this.acceptanceForm.controls.AWBNo.value);
      this.weightForm.controls.acceptanceID.setValue(this.acceptanceForm.controls.acceptanceID.value);
      this.API.PostData('/Acceptance/saveweightDetail', this.weightForm.value).subscribe(c => {
        Swal.fire({
          text: "Weight Added Successfully",
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
  saveWeightDIM(status) {
    this.validationsWeightdDIM();
    if (this.validFormWeightdim == true) {
      if (status == "New") {
        this.DimweightForm.controls.isNew.setValue(true);
      }
      else {
        this.DimweightForm.controls.isNew.setValue(false);
      }
      this.DimweightForm.controls.acceptanceID.setValue(this.acceptanceForm.controls.acceptanceID.value);
      this.DimweightForm.controls.AWBNo.setValue(this.acceptanceForm.controls.AWBNo.value);
      this.API.PostData('/Acceptance/saveDimWt', this.DimweightForm.value).subscribe(c => {
        Swal.fire({
          text: "Dimensional Weight Added Successfully",
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
            text: "Airbill Detail Updated Successfully",
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
  saveHouse() {
    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Save Acceptance First",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.HAWBNo.value == "" || this.houseForm.controls.HAWBNo.value == null) {
      Swal.fire({
        text: "Enter House No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.comid.value == "" || this.houseForm.controls.comid.value == null) {
      Swal.fire({
        text: "select commodity.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.pieces.value == "" || this.houseForm.controls.pieces.value == null) {
      Swal.fire({
        text: "Enter pieces",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.shipperId.value == "" || this.houseForm.controls.shipperId.value == null) {
      Swal.fire({
        text: "Select Shipper",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.cid.value == "" || this.houseForm.controls.cid.value == null) {
      Swal.fire({
        text: "Select Consignee",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.houseForm.controls.acceptanceID.setValue(this.acceptanceForm.controls.acceptanceID.value);
    this.houseForm.controls.AWBNo.setValue(this.acceptanceForm.controls.AWBNo.value);
    this.API.PostData('/Acceptance/saveHouse', this.houseForm.value).subscribe(c => {
      if (c != null) {
        Swal.fire({
          text: "House Saved Successfully",
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.showHideHouse("Cancel");
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
  /* #endregion */
  /* #region  Get Data Calls */
  getNoticeTypes() {
    this.noticeTypesRequest.ALCode = this.acceptanceForm.controls.ALCode.value;
    this.noticeTypesRequest.goodsId = this.acceptanceForm.controls.goodsId.value;
    this.API.PostData('/Acceptance/getNoticeTypes', this.noticeTypesRequest).subscribe(c => {
      if (c != null) {
        this.InquiryResponse = c;
        for (let i = 0; i < this.InquiryResponse.length; i++) {
          this.InquiryResponse[i].IsPending = true;
          this.InquiryResponse[i].IsRevieved = false;
          this.InquiryResponse[i].NA = false;
        }
        this.noticeTypeArrlen = this.InquiryResponse.length;
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
        this.dimWeightResponse = c;
        const sum = this.dimWeightResponse.reduce((sum, current) => sum + current.netWeight, 0);
        const CBMsum = this.dimWeightResponse.reduce((sum, current) => sum + current.CBM, 0);
        if (sum != null) {
          // this.acceptanceForm.controls.chargeableWeight.setValue(Math.round(sum * 100) / 100);
        }
        if (CBMsum != null) {
          this.acceptanceForm.controls.CBM.setValue(Math.round(CBMsum * 100) / 100);
        }
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
  getHouseDetail() {
    this.API.getdata('/Acceptance/getHouseDetail?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
      if (c != null) {
        this.HouseAWB = c;
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
  getAttachments() {
    this.API.getdata('/Acceptance/getAcceptanceAttachments?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
      if (c != null) {
        this.attachmentResponse = c;
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
  getConsignees() {
    this.API.getdata('/Setups/getConsignee').subscribe(c => {
      if (c != null) {
        this.consigneeResponse = c;
        this.consigneeResponse = this.consigneeResponse.sort((a, b) => (a.consigneeName > b.consigneeName) ? 1 : -1);
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
  getNotifies() {
    this.API.getdata('/Setups/getNotify').subscribe(c => {
      if (c != null) {
        this.notifyResponse = c;
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
  getAgents() {
    this.API.getdata('/Setups/getAgents').subscribe(c => {
      if (c != null) {
        this.agentsResponse = c;
        this.agentsResponse = this.agentsResponse.sort((a, b) => (a.agentName > b.agentName) ? 1 : -1);
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
  getAirLines() {
    this.API.getdata('/Setups/getAirLines').subscribe(c => {
      if (c != null) {
        this.responseAirLines = c;
        this.defaultAirline.ALCode = 0;
        this.defaultAirline.ALName = "Select Airline";
        this.responseAirLines.push(this.defaultAirline);
        this.acceptanceForm.controls.ALCode.setValue(0);
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
  public saveNotice() {
    for (let i = 0; i < this.InquiryResponse.length; i++) {
      // if (this.InquiryResponse[i].NA == null) {
      //   this.InquiryResponse[i].NA = false;
      // }
      // if (this.InquiryResponse[i].IsPending == null) {
      //   this.InquiryResponse[i].IsPending = false;
      // }
      // if (this.InquiryResponse[i].IsRevieved == null) {
      //   this.InquiryResponse[i].IsRevieved = false;
      // }
      // if (this.InquiryResponse[i].mandatory == null) {
      //   this.InquiryResponse[i].mandatory = false;
      // }
      this.InquiryResponse[i].acceptanceID = this.acceptanceForm.controls.acceptanceID.value;
    }
    for (let i = 0; i < this.InquiryResponse.length; i++) {
      if (this.InquiryResponse[i].IsPending == false && this.InquiryResponse[i].IsRevieved == false && this.InquiryResponse[i].NA == false) {
        Swal.fire({
          text: "Atleast one checkbox should be checked of each Notice type",
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return
      }
    }
    this.API.PostData('/Acceptance/addAwbNotice', this.InquiryResponse).subscribe(c => {
      if (c != null) {
        Swal.fire({
          text: "Notice Types Saved Successfully.",
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
  getGoods() {
    this.API.getdata('/Setups/getNatofGoods').subscribe(c => {
      if (c != null) {
        this.responseGoods = c;
        this.responseGoodsMaster = c;
        this.responseAirLines.push(this.defaultAirline);
        this.acceptanceForm.controls.ALCode.setValue(0);
        // this.filterGoods();

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
        debugger
        this.responseCommodity = c;
        this.responseCommodity = this.responseCommodity.sort((a, b) => (a.comm_description > b.comm_description) ? 1 : -1);
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
        this.ConsolidatorResponse = this.ConsolidatorResponse.sort((a, b) => (a.agentName > b.agentName) ? 1 : -1);
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
  getWeightDetail() {
    this.getWeight.acceptanceID = this.acceptanceForm.controls.acceptanceID.value;
    this.API.PostData('/Acceptance/getWeight', this.getWeight).subscribe(c => {
      if (c != null) {
        this.weightResponseModel.weightDetailResponse = c.weightDetailResponse;
        const sum = this.weightResponseModel.weightDetailResponse.reduce((sum, current) => sum + current.netWt, 0);
        const sumPieces = this.weightResponseModel.weightDetailResponse.reduce((sum, current) => sum + current.pieces, 0);
        if (sum != null) {
          this.acceptanceForm.controls.grossWeight.setValue(Math.round(sum * 100) / 100);
          this.acceptanceForm.controls.Pieces.setValue(sumPieces);
        }

        this.TotalNetWeight = 0;
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
  getShippers() {
    this.API.getdata('/Setups/getShipper').subscribe(c => {
      if (c != null) {
        this.shippereResponse = c;
        this.shippereResponse = this.shippereResponse.sort((a, b) => (a.shipperName > b.shipperName) ? 1 : -1);
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
    if (this.AWBNo == "" || this.AWBNo == null || this.AWBNo == undefined) {
      Swal.fire({
        text: "Enter AWB No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validInputSearch = false;
      return;
    }
    this.validInputSearch = true;
  }
  setModalState(state: any) {
    if (state == 'notifyAWB') {
      this.notifyAWBState = true;
      this.notifyNewAgentTab2State = false;
      this.notifyComidState = false;
      this.notifyNewAgentTab1State = false;
      this.notifyShipperState = false;
      this.notifyConsigneeState = false;
    }
    if (state == 'notifyNewAgentTab2') {
      this.notifyAWBState = false;
      this.notifyNewAgentTab2State = true;
      this.notifyComidState = false;
      this.notifyNewAgentTab1State = false;
      this.notifyShipperState = false;
      this.notifyConsigneeState = false;
    }
    if (state == 'notifyComid') {
      this.notifyAWBState = false;
      this.notifyNewAgentTab2State = false;
      this.notifyComidState = true;
      this.notifyNewAgentTab1State = false;
      this.notifyShipperState = false;
      this.notifyConsigneeState = false;
    }
    if (state == 'notifyNewAgentTab1') {
      this.notifyAWBState = false;
      this.notifyNewAgentTab2State = false;
      this.notifyComidState = false;
      this.notifyNewAgentTab1State = true;
      this.notifyShipperState = false;
      this.notifyConsigneeState = false;
    }
    if (state == 'notifyShipper') {
      this.notifyAWBState = false;
      this.notifyNewAgentTab2State = false;
      this.notifyComidState = false;
      this.notifyNewAgentTab1State = false;
      this.notifyShipperState = true;
      this.notifyConsigneeState = false;
    }
    if (state == 'notifyConsignee') {
      this.notifyAWBState = false;
      this.notifyNewAgentTab2State = false;
      this.notifyComidState = false;
      this.notifyNewAgentTab1State = false;
      this.notifyShipperState = false;
      this.notifyConsigneeState = true;
    }
    if (state == 'notifyNotify') {
      this.notifyAWBState = false;
      this.notifyNewAgentTab2State = false;
      this.notifyComidState = false;
      this.notifyNewAgentTab1State = false;
      this.notifyShipperState = false;
      this.notifyConsigneeState = false;
      this.notifyNotifyState = true;
    }
  }
  getAWBDetail() {
    var awbNo = this.AWBNo;
    this.resetAcceptance();
    this.AWBNo = awbNo;
    this.validationForSearch();
    if (this.validInputSearch == true) {

      this.API.getdata('/Acceptance/getAcceptanceDetail?AWBNo=' + this.AWBNo).subscribe(x => {
        if (x != null) {
          
          this.CreatedBy = x.AcceptanceDetail.CreatedByName + "(" + x.AcceptanceDetail.createdBy + ")";
          this.CreatedDate = x.AcceptanceDetail.createdDate;
          this.ModifedBy = x.AcceptanceDetail.ModifiedByName + "(" + x.AcceptanceDetail.modifiedBy + ")";
          this.ModifiedDate = x.AcceptanceDetail.ModifiedDate;
          this.editMode = true;
          this.AcceptanceDetailModel.AcceptanceDetail = x.AcceptanceDetail;
          var agentDetail = this.agentsResponse.find(x => x.agentId == this.AcceptanceDetailModel.AcceptanceDetail.agentId);
          if (agentDetail != null) {
            this.acceptanceForm.controls.IATARegNo.setValue(agentDetail.IATARegNo);
            this.agentInfo();
          }
          this.AcceptanceDetailModel.noticeTypeResponse = x.noticeTypes;
          this.weightResponseModel.weightDetailResponse = x.WeightResponse;
          this.dimWeightResponse = x.DimWeightResponse;
          this.HouseAWB = x.houseResponse;
          this.acceptanceForm.patchValue(this.AcceptanceDetailModel.AcceptanceDetail);
          var com = this.responseCommodity.find(c => c.comid == this.acceptanceForm.controls.comid.value);
          if (com != null) {
            this.acceptanceForm.controls.comid.setValue(com.comid);
            this.acceptanceForm.controls.comm_description.setValue(com.comm_description);
          }
          this.setCuttoffTime();
          this.acceptanceForm.controls.goodsId.setValue(this.AcceptanceDetailModel.AcceptanceDetail.goodsId);
          if (this.AcceptanceDetailModel.AcceptanceDetail.HandedDate != null) {
            this.AcceptanceDetailModel.AcceptanceDetail.HandedDate = this.AcceptanceDetailModel.AcceptanceDetail.HandedDate.substring(0, this.AcceptanceDetailModel.AcceptanceDetail.HandedDate.length - 9);
            this.acceptanceForm.controls.HandedDate.setValue(this.AcceptanceDetailModel.AcceptanceDetail.HandedDate);
          }
          this.acceptanceForm.controls.HandedTime.setValue(this.AcceptanceDetailModel.AcceptanceDetail.HandedTimeStr);
          this.getDimWeight();
          this.getHouseDetail();
          this.getAttachments();
          this.showHideWeight("Cancel");
          this.showHideDimWeight("Cancel");
          this.showHideATT("Cancel");
          this.showHideHouse("Cancel");
          this.acceptanceForm.controls.AWBNo.setValue(this.AWBNo);
          this.weightForm.controls.AWBNo.setValue(this.AWBNo);
          this.DimweightForm.controls.AWBNo.setValue(this.AWBNo);
          this.AWBForm.controls.AWBNo.setValue(this.AWBNo);
          if (this.acceptanceForm.controls.cid.value != null) {
            this.AWBForm.controls.cid.setValue(this.acceptanceForm.controls.cid.value);
            this.getConsigneeDetailAWB();
          }
          if (this.acceptanceForm.controls.shipperId.value != null) {
            this.AWBForm.controls.shipperId.setValue(this.acceptanceForm.controls.shipperId.value);
            this.getShipperDetailAWB();
          }
          if (this.AcceptanceDetailModel.AcceptanceDetail.consolidatorID != null) {
            this.AWBForm.controls.consolidatorID.setValue(this.AcceptanceDetailModel.AcceptanceDetail.consolidatorID);
            this.getConsolidatorDetailAWB();
          }
          if (this.acceptanceForm.controls.notifyID.value != null) {
            this.AWBForm.controls.notifyID.setValue(this.acceptanceForm.controls.notifyID.value);
            this.getNotifyDetailAWB();
          }
          else {
            if (this.acceptanceForm.controls.agentId.value != null) {
              this.AWBForm.controls.consolidatorID.setValue(this.acceptanceForm.controls.agentId.value);
              this.getConsolidatorDetailAWB();
            }
          }
          this.noticeTypesRequest.ALCode = this.acceptanceForm.controls.ALCode.value;
          if (this.AcceptanceDetailModel.noticeTypeResponse.length != 0) {
            this.InquiryResponse = this.AcceptanceDetailModel.noticeTypeResponse;
            this.noticeTypeArrlen = this.InquiryResponse.length;
          }
          else {
            this.getNoticeTypes();
          }
          this.acceptanceForm.controls.approvalStatus.setValue(x.AcceptanceDetail.approvalStatus);
          this.getSHC();
          this.AWBForm.controls.ALCW.setValue(this.acceptanceForm.controls.ALCW.value);
          this.AWBForm.controls.AWBFee.setValue(this.acceptanceForm.controls.AWBFee.value);
          this.AWBForm.controls.AWC.setValue(this.acceptanceForm.controls.AWC.value);
          this.AWBForm.controls.AIS.setValue(this.acceptanceForm.controls.AIS.value);
          this.AWBForm.controls.MYC.setValue(this.acceptanceForm.controls.MYC.value);
          this.AWBForm.controls.TTL.setValue(this.acceptanceForm.controls.TTL.value);
          this.AWBForm.controls.Rate.setValue(this.acceptanceForm.controls.Rate.value);
          this.AWBForm.controls.CAA.setValue(this.acceptanceForm.controls.CAA.value);
          this.AWBForm.controls.CCC.setValue(this.acceptanceForm.controls.CCC.value);
          this.AWBForm.controls.SCC.setValue(this.acceptanceForm.controls.SCC.value);
          this.AWBForm.controls.DV.setValue(this.acceptanceForm.controls.DV.value);
          this.AWBForm.controls.OTH.setValue(this.acceptanceForm.controls.OTH.value);
          if (this.acceptanceForm.controls.executionDate.value != null) {
            this.AcceptanceDetailModel.AcceptanceDetail.executionDate = this.AcceptanceDetailModel.AcceptanceDetail.executionDate.substring(0, this.AcceptanceDetailModel.AcceptanceDetail.executionDate.length - 9);
            this.AWBForm.controls.executionDate.setValue(this.AcceptanceDetailModel.AcceptanceDetail.executionDate);
          }
          if (this.acceptanceForm.controls.flightID.value != null) {
            this.getFlightDataAcceptance();
          }
        }
      },
        error => {
          this.resetAcceptance();
          Swal.fire({
            text: "Enter Correct AWB No.",
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
    /* #endregion */
  }
  resetAcceptance() {
    this.AWBNo = "";
    this.chargableWeightEmpty = false;
    this.DimweightForm.reset();
    this.showhide("New");
    this.showHideDimWeight("New");
    this.showHideATT("New");
    this.showHideHouse("New");
    this.showHideWeight("New");
    this.getAirLines();
    this.AWBForm.reset();
    this.weightResponseModel = new weightResponseModel();
    this.dimWeightResponse = [];
    this.HouseAWB = [];
    this.attachmentResponse = [];
    this.editMode = false;
    this.acceptanceForm.enable();
    this.AWBForm.enable();
    this.weightForm.enable();
    this.DimweightForm.enable();
    this.houseForm.enable();
    this.acceptanceForm.get("otherAirlineCode").reset();
    this.acceptanceForm.get("otherAirlineCode").setValue(0);
    this.acceptanceForm.get("otherAirlineCode").disable();
    this.acceptanceForm.controls.approvalStatus.setValue(4);
    this.delivered = false;
    this.InquiryResponse = [];
    this.destroyDT(0, true);

  }
  otherAirlineChecked(otherAirline: boolean) {
    if (otherAirline) {
      this.acceptanceForm.get("otherAirlineCode").enable();
      let body = {
        noticetypeID: "40",
        mandatory: false,
        noticeType: 'TRM',
        IsRevieved: false,
        IsPending: false,
        NA: false,
        acceptanceID: this.acceptanceForm.controls.acceptanceID.value,
        noticeID: null,
        noticedetailID: "85",
      }
      this.InquiryResponse.push(body);
    }
    else {
      this.acceptanceForm.get("otherAirlineCode").reset();
      this.acceptanceForm.get("otherAirlineCode").disable();
      if (this.noticeTypeArrlen != this.InquiryResponse.length) {
        this.InquiryResponse.pop();
      }
    }
  }
  calculateCBM() {
    this.CBM = ((this.DimweightForm.controls.length.value) * (this.DimweightForm.controls.width.value) * (this.DimweightForm.controls.height.value) * (this.DimweightForm.controls.pieces.value)) / 1000000;
    this.DimweightForm.controls.CBM.setValue(this.CBM);
  }
  setCuttoffTime() {
    var cutofTime = this.responseGoods.find(x => x.goodsId == this.acceptanceForm.controls.goodsId.value);
    if (cutofTime != undefined) {
      if (cutofTime.cutTime != null) {
        this.acceptanceForm.controls.cuttTime.setValue(cutofTime.cutTime);
      }
    }
  }

  disableAllForms() {
    this.delivered = true;
    this.acceptanceForm.disable();
    this.AWBForm.disable();
    this.weightForm.disable();
    this.DimweightForm.disable();
    this.houseForm.disable();
  }
  getWeightfromScale(callFrom: string) {
    if (callFrom == "1") {
      this.API.getdata('/Generic/GetWeightScaleAcceptance?weightScaleID=' + this.weightForm.controls.weightScaleID.value).subscribe(c => {
        if (c != null) {
          this.weightForm.controls.firstWt.setValue(c.weight);
          var datettime = this.datepipe.transform(c.weightDateTime, 'dd/MMM/yyyy');
          this.weightForm.controls.firstWtdatetime.setValue(this.datepipe.transform(c.weightDateTime, 'dd/MMM/yyyy HH:mm'));
          this.calculateNetWeight();
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
    if (callFrom == "2") {
      this.API.getdata('/Generic/GetWeightScaleAcceptance?weightScaleID=' + this.weightForm.controls.weightScaleID.value).subscribe(c => {
        if (c != null) {
          this.weightForm.controls.secondWt.setValue(c.weight)
          var datettime = this.datepipe.transform(c.weightDateTime, 'dd/MMM/yyyy');
          this.weightForm.controls.secondWtdatetime.setValue(this.datepipe.transform(c.weightDateTime, 'dd/MMM/yyyy HH:mm'));
          //this.weightForm.get('secondWtdatetime').patchValue(c.weightDateTime.slice(0, 16));
          this.calculateNetWeight();
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
    if (callFrom == "3") {
      this.API.getdata('/Generic/GetWeightScale?locationName=Acceptance').subscribe(c => {
        if (c != null) {
          this.houseForm.controls.houseWeight.setValue(c.weight)
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
  selectAirline() {
    var prefixString = this.acceptanceForm.controls.AWBNo.value;
    if (prefixString != null) {
      var prefix = prefixString.substring(0, 3);
      var airline = this.responseAirLines.find(x => x.Prefix == prefix);
      if (airline != null) {
        this.acceptanceForm.controls.ALCode.setValue(airline.ALCode);
        this.setDestination();
        // this.filterGoods();
      }
      else {
        this.acceptanceForm.controls.ALCode.setValue("0");
      }
    }
    else {
      this.acceptanceForm.controls.ALCode.setValue("0");
    }
  }
  setDestination() {
    var Destination = this.responseAirLines.find(x => x.ALCode == this.acceptanceForm.controls.ALCode.value);
    if (Destination != undefined) {
      if (Destination.hub != null) {
        this.acceptanceForm.controls.Destination.setValue(Destination.hub);
      }
      else {
        this.acceptanceForm.controls.Destination.setValue("");
      }
    }
    else {
      this.acceptanceForm.controls.Destination.setValue("");
    }
  }
  getAcceptanceWeight(p) {
    if (p.weightDetailID != null) {
      this.requestWeightRPT.weightDetailID = p.weightDetailID;
      this.API.downloadFile('/Reports/getAcceptanceWeightReport', this.requestWeightRPT).subscribe(
        // this.API.downloadFile('/Reports/getUWS', this.requestWeightRPT).subscribe(
        data => {
          this.src = data; // pdfSrc can be Blob or Uint8Array
          // this.pdfViewer.refresh(); // Ask pdf viewer to load/refresh pdf
        }
        , error => {
          Swal.fire({
            text: error.error.Message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
  }
  getConsigneeDetailAWB() {
    var consigneeDetail = this.consigneeResponse.find(x => x.cid == this.AWBForm.controls.cid.value);
    if (consigneeDetail != undefined) {
      this.AWBForm.controls.consigneeAddress.setValue(consigneeDetail.consigneeAddress);
      this.AWBForm.controls.consigneePhoneNo.setValue(consigneeDetail.contactNo);
      this.AWBForm.controls.consigneecountryName.setValue(consigneeDetail.countryName);
      this.AWBForm.controls.consigneecityName.setValue(consigneeDetail.cityName);
      this.AWBForm.controls.ZIPCode.setValue(consigneeDetail.ZIPCode);

    }
  }
  // getAgentDetailAWB() {
  //   var agentDetail = this.agentsResponse.find(x => x.agentId == this.AWBForm.controls.agentId.value);
  //   if (agentDetail != undefined) {
  //     this.AWBForm.controls.agentAddress.setValue(agentDetail.agentAddress);
  //     this.AWBForm.controls.agentPhoneNo.setValue(agentDetail.PhoneNo);
  //     this.AWBForm.controls.agentcountryName.setValue(agentDetail.countryName);
  //   }
  // }
  getShipperDetailAWB() {
    var shipperDetail = this.shippereResponse.find(x => x.shipperId == this.AWBForm.controls.shipperId.value);
    if (shipperDetail != undefined) {
      this.AWBForm.controls.shipperAddress.setValue(shipperDetail.shipperAddress);
      this.AWBForm.controls.shipperPhoneNo.setValue(shipperDetail.ContactNo);
      this.AWBForm.controls.shippercountryName.setValue(shipperDetail.countryName);
      this.AWBForm.controls.shippercityName.setValue(shipperDetail.cityName);

    }
  }
  getConsolidatorDetailAWB() {
    this.AWBForm.controls.agentId.setValue(this.AWBForm.controls.consolidatorID.value);
    var consolidatorDetail = this.ConsolidatorResponse.find(x => x.agentId == this.AWBForm.controls.agentId.value);
    if (consolidatorDetail != undefined) {
      this.AWBForm.controls.consolidatorID.setValue(consolidatorDetail.agentId);
      this.AWBForm.controls.consolidatorAddress.setValue(consolidatorDetail.agentAddress);
      this.AWBForm.controls.consolidatorPhoneNo.setValue(consolidatorDetail.PhoneNo);
      this.AWBForm.controls.consolidatorCountryName.setValue(consolidatorDetail.countryName);
    }
  }
  getAttTypes() {
    this.API.getdata('/Generic/getAttType?moduleID=3').subscribe(c => {
      if (c != null) {
        this.AttachmentTypes = c;
        this.weightForm.controls.atttypeID.setValue(0);
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
  setFirstTime() {
    if (this.weightForm.controls.firstWt.value == "") {
      this.weightForm.controls.firstWtdatetime.setValue("");
    }
    else
      this.weightForm.controls.firstWtdatetime.setValue(this.datepipe.transform(this.date, 'dd/MMM/yyyy HH:mm'));
  }
  setSecondTime() {
    if (this.weightForm.controls.secondWt.value == "") {
      this.weightForm.controls.secondWtdatetime.setValue("");
    }
    else
      this.weightForm.controls.secondWtdatetime.setValue(this.datepipe.transform(this.date, 'dd/MMM/yyyy HH:mm'));
  }
  // getDriverDetail() {
  //   if (this.weightForm.controls.driverCNIC.value != null) {

  //     this.API.getdata('/Generic/getDriverDetail?Cnic=' + this.weightForm.controls.driverCNIC.value).subscribe(c => {
  //       if (c != null) {
  //         this.responseDriver = c;
  //         this.weightForm.controls.driverName.setValue(this.responseDriver.driverName)
  //         this.weightForm.controls.vehNumer.setValue(this.responseDriver.vehNumer)
  //       }
  //       else {
  //         this.weightForm.controls.driverName.setValue("");
  //         this.weightForm.controls.vehNumer.setValue("");
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
  verifyAgent() {
    var agentInfo = this.agentsResponse.find(x => x.agentId == this.acceptanceForm.controls.agentId.value);
    if (agentInfo.greyList == true) {
      this.AgentName = agentInfo.agentName;
    }
    else {
      this.AgentName = "";
    }
  }
  getStatus() {
    this.API.getdata('/Generic/GetAcceptanceStatus').subscribe(c => {
      if (c != null) {
        this.responseStatus = c;
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
  setConsolidatorDetail(p) {
    this.AWBForm.controls.agentId.setValue(p.agentId);
    this.AWBForm.controls.consolidatorID.setValue(this.AWBForm.controls.agentId.value);
    this.closeConsolidatorAWBModal["first"].nativeElement.click();
    this.getConsolidatorDetailAWB();
  }
  // sendEmail (body:any) {
  //   this.API.PostData('/Manifest/sendRCS',body).subscribe(c => {
  //     if (c != null) {

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
  // sendRCS(){
  //   this.API.getdata('/Acceptance/generateRCS?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
  //     if (c != null) {
  //       let body={
  //         firstLine:c.firstLine,
  //         SecordLine:c.SecordLine,
  //         thirdLine:c.thirdLine
  //       }
  //       this.sendEmail(body);
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
  SyncData() {
    this.validationForSearch();
    if (this.validInputSearch == true) {
      this.API.getdata('/Acceptance/synData?AWBNo=' + this.AWBNo).subscribe(x => {
        if (x != null) {
          this.getAWBDetail();
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
  verifyPieces() {
    if (this.houseForm.controls.pieces.value > this.acceptanceForm.controls.Pieces.value) {
      Swal.fire({
        text: "No. of Pieces cannot be greater than Master",
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  verifyChargable() {
    if (this.houseForm.controls.chargeableWeight.value > this.acceptanceForm.controls.chargeableWeight.value) {
      Swal.fire({
        text: "House Chargeable Weight cannot be greater than Master",
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  checkDNR(p, checkStatus, status) {
    if (status == "isPendingCheck") {
      for (let i = 0; i < this.InquiryResponse.length; i++) {
        if (this.InquiryResponse[i].noticedetailID == p.noticedetailID) {
          if (checkStatus == false) {
            this.InquiryResponse[i].IsPending = false;
            break;
          }
          else {
            this.InquiryResponse[i].IsPending = true;
            this.InquiryResponse[i].IsRevieved = false;
            this.InquiryResponse[i].NA = false;
            break;
          }
        }
      }
    }
    if (status == "isRevievedCheck") {
      for (let i = 0; i < this.InquiryResponse.length; i++) {
        if (this.InquiryResponse[i].noticedetailID == p.noticedetailID) {
          if (checkStatus == false) {
            this.InquiryResponse[i].IsRevieved = false;
            break;
          }
          else {
            this.InquiryResponse[i].IsRevieved = true;
            this.InquiryResponse[i].IsPending = false;
            this.InquiryResponse[i].NA = false;
            break;
          }
        }
      }
    }
    if (status == "NACheck") {
      for (let i = 0; i < this.InquiryResponse.length; i++) {
        if (this.InquiryResponse[i].noticedetailID == p.noticedetailID) {
          if (checkStatus == false) {
            this.InquiryResponse[i].NA = false;
            break;
          }
          else {
            this.InquiryResponse[i].NA = true;
            this.InquiryResponse[i].IsPending = false;
            this.InquiryResponse[i].IsRevieved = false;
            break;
          }
        }
      }
    }
    //............................................................
    for (let i = 0; i < this.InquiryResponse.length; i++) {
      if (this.InquiryResponse[i].IsPending == false) {
        this.acceptanceForm.controls.DNR.setValue(false);
      }
      else {
        this.acceptanceForm.controls.DNR.setValue(true);
        break
      }
    }
  }
  checkByHand() {
    if (this.weightForm.controls.vehicleID.value == "7") {
      this.weightForm.get("firstWt").enable();
      this.weightForm.get("secondWt").enable();
    }
    else {
      //this.weightForm.get("firstWt").setValue("");
      //this.weightForm.get("secondWt").setValue("");
      // this.weightForm.get("firstWt").disable();
      // this.weightForm.get("secondWt").disable();
      this.calculateNetWeight();
    }
  }

  getSHC() {
    if (this.acceptanceForm.controls.comid.value != null) {
      var SHC = this.responseCommodity.find(c => c.comid == this.acceptanceForm.controls.comid.value);
      this.acceptanceForm.controls.SHC.setValue(SHC.handlingCodes);
      this.acceptanceForm.controls.Nature.setValue(SHC.Nature);
      this.acceptanceForm.controls.goodsId.setValue(SHC.goodsId);
    }
  }

  getSHCHouse() {
    if (this.houseForm.controls.comid.value != null) {
      var SHC = this.responseCommodity.find(c => c.comid == this.houseForm.controls.comid.value);
      this.houseForm.controls.goodsId.setValue(SHC.goodsId);
      this.houseForm.controls.Nature.setValue(SHC.Nature);
    }
  }

  agentInfo() {
    if (this.acceptanceForm.controls.IATARegNo.value == "" || this.acceptanceForm.controls.IATARegNo.value == undefined) {
      this.acceptanceForm.controls.agentAddress.setValue("");
      this.acceptanceForm.controls.mobileNo.setValue("");
      this.acceptanceForm.controls.agentId.setValue("");
      this.acceptanceForm.controls.CNIC.setValue("");
      this.acceptanceForm.controls.PhoneNo.setValue("");
      this.acceptanceForm.controls.agentName.setValue("");
    }
    else {
      var agentDetail = this.agentsResponse.find(x => x.IATARegNo == this.acceptanceForm.controls.IATARegNo.value);
      if (agentDetail != null) {
        this.acceptanceForm.controls.agentAddress.setValue(agentDetail.agentAddress);
        this.acceptanceForm.controls.mobileNo.setValue(agentDetail.mobileNo);
        this.acceptanceForm.controls.agentId.setValue(agentDetail.agentId);
        this.acceptanceForm.controls.CNIC.setValue(agentDetail.CNIC);
        this.acceptanceForm.controls.PhoneNo.setValue(agentDetail.PhoneNo);
        this.acceptanceForm.controls.agentName.setValue(agentDetail.agentName);

      }
      else {
        this.acceptanceForm.controls.agentAddress.setValue("");
        this.acceptanceForm.controls.mobileNo.setValue("");
        this.acceptanceForm.controls.agentId.setValue("");
        this.acceptanceForm.controls.CNIC.setValue("");
        this.acceptanceForm.controls.PhoneNo.setValue("");
        this.acceptanceForm.controls.agentName.setValue("");
      }
    }
  }

  // filterGoods() {
  //   this.responseGoods = this.responseGoodsMaster.filter(c => c.destination == this.acceptanceForm.controls.Region.value);
  // }

  removeWeight(p) {
    this.weightID = p.weightDetailID;
  }

  confirmRemoveWT() {
    // this.API.PostData('/Acceptance?weightDetailID=', this.weightID).subscribe(c => {
    //   if (c != null) {
    //     Swal.fire({
    //       text: "Weight removed successfully",
    //       icon: 'success',
    //       confirmButtonText: 'OK'
    //     });
    //     this.confirmRemoveWeight["first"].nativeElement.click();
    //     this.getDimWeight();
    //   }
    // },
    //   error => {
    //     Swal.fire({
    //       text: error.error.Message,
    //       icon: 'error',
    //       confirmButtonText: 'OK'
    //     });
    //   });
  }

  closeRemovePOPUP() {
    this.confirmRemoveWeight["first"].nativeElement.click();
  }
  getNotifyDetailAWB() {
    var notifyDetail = this.notifyResponse.find(x => x.notifyID == this.AWBForm.controls.notifyID.value);
    if (notifyDetail != undefined) {
      this.AWBForm.controls.notifyName.setValue(notifyDetail.notifyName);
      this.AWBForm.controls.NotifyZIPCode.setValue(notifyDetail.ZIPCode);
      this.AWBForm.controls.contactNo.setValue(notifyDetail.contactNo);
      this.AWBForm.controls.createdBy.setValue(notifyDetail.createdBy);
      this.AWBForm.controls.modifiedBy.setValue(notifyDetail.modifiedBy);
      this.AWBForm.controls.countryID.setValue(notifyDetail.countryID);
      this.AWBForm.controls.notifyAddress.setValue(notifyDetail.notifyAddress);


      var countryDetail = this.responseCountries.find(x => x.id == this.AWBForm.controls.countryID.value);
      if (countryDetail != undefined) {
        this.AWBForm.controls.notifyCountryName.setValue(countryDetail.countryName);
      }
    }
  }
  getCountries() {
    this.API.getdata('/Generic/getCountries').subscribe(c => {
      if (c != null) {
        this.responseCountries = c;
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
  getDepFlightsByAriline() {
    if (this.acceptanceForm.controls.ALCode.value == 0) {
      Swal.fire({
        text: "Select Airline first.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showFlights = false;
      return;
    }
    this.API.getdata('/Flights/getDepFlightsByAriline?ALCode=' + this.acceptanceForm.controls.ALCode.value).subscribe(c => {
      if (c != null) {
        this.showFlights = true;
        this.responseDepFlight = c;
        this.dtTrigger1.next;
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
              else if (tableIndex == 7) {
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
  flightDetail(flightID) {
    var flightDetail = this.responseDepFlight.find(c => c.flightID == flightID);
    if (flightDetail != null) {
      this.acceptanceForm.controls.depFlightNo.setValue(flightDetail.depFlightNo);
      this.acceptanceForm.controls.depDate.setValue(flightDetail.depDate.substring(0, flightDetail.depDate.length - 9));
      this.acceptanceForm.controls.depTime.setValue(flightDetail.depTime.toString());
      this.acceptanceForm.controls.flightID.setValue(flightDetail.flightID);
      this.flightPopup["first"].nativeElement.click();
    }
  }
  getFlightDataAcceptance() {
    this.API.getdata('/Flights/getFlightDataAcceptance?flightID=' + this.acceptanceForm.controls.flightID.value).subscribe(c => {
      if (c != null) {
        this.acceptanceForm.controls.depFlightNo.setValue(c.depFlightNo);
        this.acceptanceForm.controls.depDate.setValue(c.depDate.substring(0, c.depDate.length - 9));
        this.acceptanceForm.controls.depTime.setValue(c.depTime.toString());
        this.acceptanceForm.controls.flightID.setValue(c.flightID);
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
  sendRCS() {
    if (this.acceptanceForm.controls.acceptanceID.value == "") {
      Swal.fire({
        text: "Select Acceptance.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showRCS = false;
      this.EmailTypeModal['first'].nativeElement.click();
      return;
    }
    if (this.acceptanceForm.controls.flightID.value == "" || this.acceptanceForm.controls.flightID.value == null) {
      Swal.fire({
        text: "Enter flight detail.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showRCS = false;
      this.EmailTypeModal['first'].nativeElement.click();
      return;
    }
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.acceptanceForm.controls.acceptanceID.value,
      ALCode: this.acceptanceForm.controls.ALCode.value,
      sendAgain: false,
    }
    this.showRCS = true;
    this.API.PostData('/CargoMessages/sendRCS', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',

        }).then((result) => {
          if (result.isConfirmed) {
            this.ResendRCS();
          }
        })
      });

  }
  ResendTFD() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.acceptanceForm.controls.acceptanceID.value,
      sendAgain: true,
    }
    this.API.PostData('/CargoMessages/sendRCS', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    });

  }
  generateRCS() {
    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Select Acceptance.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showRCS = false;
      this.EmailTypeModal['first'].nativeElement.click();
      return;
    }
    if (this.acceptanceForm.controls.flightID.value == "" || this.acceptanceForm.controls.flightID.value == null) {
      Swal.fire({
        text: "Enter flight detail.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showRCS = false;
      this.EmailTypeModal['first'].nativeElement.click();
      return;
    }
    this.showRCS = true;
    this.API.getdata('/CargoMessages/generateRCS?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
      if (c != null) {
        this.responceCargoMessage = c;
        this.emailData = "";
        this.emailData = this.emailData + this.responceCargoMessage.firstLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.SecordLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.thirdLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.fourthLine + "<br>";
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
  sendTFD() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.acceptanceForm.controls.acceptanceID.value,
      ALCode: this.acceptanceForm.controls.ALCode.value,
      sendAgain: false,
    }
    this.showRCS = true;
    this.API.PostData('/CargoMessages/sendTFD', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
      error => {
        if (error.error.Message == 'Email address not found.') {
          Swal.fire({
            text: "Email address not found.",
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
        else {

          Swal.fire({
            text: error.error.Message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',

          }).then((result) => {
            if (result.isConfirmed) {
              this.ResendTFD();
            }
          })
        }
      });

  }
  ResendRCS() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.acceptanceForm.controls.acceptanceID.value,
      ALCode: this.acceptanceForm.controls.ALCode.value,
      sendAgain: true,
    }
    this.API.PostData('/CargoMessages/sendTFD', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message saved successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    });

  }
  generateTFD() {
    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Select Acceptance.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showTFD = false;
      this.TFDModel['first'].nativeElement.click();
      return;
    }
    if (this.acceptanceForm.controls.otherAirlineCode.value == "" || this.acceptanceForm.controls.otherAirlineCode.value == null) {
      Swal.fire({
        text: "Other Airline not selected.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showTFD = false;
      this.EmailTypeModal['first'].nativeElement.click();
      return;
    }
    this.showTFD = true;
    this.API.getdata('/CargoMessages/generateTFD?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
      if (c != null) {
        this.responceCargoMessage = c;
        this.emailData = "";
        this.emailData = this.emailData + this.responceCargoMessage.firstLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.SecordLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.thirdLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.fourthLine + "<br>";
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
  sendRCT() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.acceptanceForm.controls.acceptanceID.value,
      ALCode: this.acceptanceForm.controls.ALCode.value,
      sendAgain: false,
    }
    this.showRCT = true;
    this.API.PostData('/CargoMessages/sendRCT', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
      error => {
        if (error.error.Message == 'Email address not found.') {
          Swal.fire({
            text: "Email address not found.",
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
        else {

          Swal.fire({
            text: error.error.Message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',

          }).then((result) => {
            if (result.isConfirmed) {
              this.ResendRCT();
            }
          })
        }
      });

  }
  ResendRCT() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.acceptanceForm.controls.acceptanceID.value,
      ALCode: this.acceptanceForm.controls.ALCode.value,
      sendAgain: true,
    }
    this.API.PostData('/CargoMessages/sendRCT', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message saved successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    });

  }
  generateRCT() {
    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Select Acceptance.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showRCT = false;
      this.TFDModel['first'].nativeElement.click();
      return;
    }
    if (this.acceptanceForm.controls.otherAirlineCode.value == "" || this.acceptanceForm.controls.otherAirlineCode.value == null) {
      Swal.fire({
        text: "Other Airline not selected.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showRCT = false;
      this.EmailTypeModal['first'].nativeElement.click();
      return;
    }
    this.showRCT = true;
    this.API.getdata('/CargoMessages/generateRCT?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
      if (c != null) {
        this.responceCargoMessage = c;
        this.emailData = "";
        this.emailData = this.emailData + this.responceCargoMessage.firstLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.SecordLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.thirdLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.fourthLine + "<br>";
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
  sendDIS() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.acceptanceForm.controls.acceptanceID.value,
      ALCode: this.acceptanceForm.controls.ALCode.value,
      sendAgain: false,
    }
    this.showRCT = true;
    this.API.PostData('/CargoMessages/sendDIS', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
      error => {
        if (error.error.Message == 'Email address not found.') {
          Swal.fire({
            text: "Email address not found.",
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
        else {

          Swal.fire({
            text: error.error.Message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',

          }).then((result) => {
            if (result.isConfirmed) {
              this.ResendDIS();
            }
          })
        }
      });

  }
  ResendDIS() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.acceptanceForm.controls.acceptanceID.value,
      ALCode: this.acceptanceForm.controls.ALCode.value,
      sendAgain: true,
    }
    this.API.PostData('/CargoMessages/sendDIS', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message saved successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    });

  }
  generateDIS() {
    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Select Acceptance.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showDIS = false;
      this.DISModel['first'].nativeElement.click();
      return;
    }
    this.showDIS = true;
    this.API.getdata('/CargoMessages/generateDIS?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
      if (c != null) {
        this.responceCargoMessage = c;
        this.emailData = "";
        this.emailData = this.emailData + this.responceCargoMessage.firstLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.SecordLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.thirdLine + "<br>";
        this.emailData = this.emailData + this.responceCargoMessage.fourthLine + "<br>";
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
  sendFHL() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.acceptanceForm.controls.acceptanceID.value,
      ALCode: this.acceptanceForm.controls.ALCode.value,
      sendAgain: false,
    }
    this.showRCT = true;
    this.API.PostData('/CargoMessages/sendFHL', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message sent successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
      error => {
        if (error.error.Message == 'Email address not found.') {
          Swal.fire({
            text: "Email address not found.",
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
        else {

          Swal.fire({
            text: error.error.Message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',

          }).then((result) => {
            if (result.isConfirmed) {
              this.ResendFHL();
            }
          })
        }
      });

  }
  ResendFHL() {
    let body = {
      emailBody: this.EmailForm.controls.email_Body.value,
      moduleID: this.acceptanceForm.controls.acceptanceID.value,
      ALCode: this.acceptanceForm.controls.ALCode.value,
      sendAgain: true,
    }
    this.API.PostData('/CargoMessages/sendFHL', body).subscribe(c => {
      Swal.fire({
        text: "Email/Message saved successfully",
        icon: 'success',
        confirmButtonText: 'OK'
      });
    });

  }
  generateFHL() {
    if (this.acceptanceForm.controls.acceptanceID.value == "" || this.acceptanceForm.controls.acceptanceID.value == null) {
      Swal.fire({
        text: "Select Acceptance.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.showFHL = false;
      this.FHLModel['first'].nativeElement.click();
      return;
    }
    this.API.getdata('/CargoMessages/generateFHL?acceptanceID=' + this.acceptanceForm.controls.acceptanceID.value).subscribe(c => {
      if (c != null) {
        this.showFHL = true;
        this.EmailForm.controls.email_Body.setValue(c.messageDetail);
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
  getWeightScale() {
    this.API.getdata('/Generic/getWeightScale').subscribe(c => {
      if (c != null) {
        this.weightScaleResponse = c;
        var defaultValue = this.weightScaleResponse.find(c => c.isDefault == true);
        if (defaultValue != null) {
          this.weightForm.controls.weightScaleID.setValue(defaultValue.weightScaleID);
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
  autocompleListFormatter = (data: any): SafeHtml => {
    let html = `<span>${data.comm_description} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }
  valueChanged(newVal) {
    var com = this.responseCommodity.find(c => c.comm_description == newVal);
    if (com != null) {
      this.acceptanceForm.controls.comid.setValue(com.comid);
    }
    else {
      this.acceptanceForm.controls.comid.setValue(0);
      this.acceptanceForm.controls.comm_description.setValue("");
    }
  }
}
