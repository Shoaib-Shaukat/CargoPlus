import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ApiService } from '../../../Services/API/api.service';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { AWBDetail, responseExamination } from '../Examination/ExaminationModel';
import { consigneeResponse } from '../../AdminArea/Models/consignee';
import { shippereResponse } from '../../AdminArea/Models/shipper';
import { agentsResponse } from './../../AdminArea/Models/agents';
import { responseCommodity } from '../../AdminArea/Models/commodity';
import { requestGoods, responseGoods } from '../../AdminArea/Models/Goods';
import { HouseAWB, dimWeightResponse, InquiryResponse, noticeTypesRequest, attachmentResponse, acceptanceModel, requestAcceptance, responseAcceptance, responseModel, employeeModel, weightResponseModel, getWeight, requestWeight, AcceptanceDetailModel, SaveALL } from '../Acceptance/Model/acceptance'
@Component({
  selector: 'app-awbdetail',
  templateUrl: './awbdetail.component.html',
  styleUrls: ['./awbdetail.component.css']
})
export class AWBDetailComponent implements OnInit {
  @ViewChildren('closeConsolidatorModal') closeConsolidatorModal: ElementRef;
  @ViewChildren('closeNatureOfGoodsModal') closeNatureOfGoodsModal: ElementRef;
  @ViewChildren('closeCommodityModal') closeCommodityModal: ElementRef;
  @ViewChildren('closeAgentsModal') closeAgentsModal: ElementRef;
  @ViewChildren('closeShipperModal') closeShipperModal: ElementRef;
  @ViewChildren('closeConsigneeModal') closeConsigneeModal: ElementRef;
  GoodsID: number;
  AgentIDForTab1: number;
  AgentIDForTab2: number;
  ComidID: number;
  ShipperID: number;
  ConsigneeID: number;
  validFormWeightdim: boolean = false;
  CBM: any;
  sizeinCM: any;
  showWeightDim: boolean = true;
  addnewWeightDim: boolean = false;
  shownewButtonWeightDim: boolean = true;
  showeditButtonWeightDim: boolean = true;
  showSaveButtonWeightDim: boolean = false;
  showCancelButtonWeightDim: boolean = false;
  showHouse: boolean = true;
  addnewHouse: boolean = false;
  shownewButtonHouse: boolean = true;
  showeditButtonHouse: boolean = true;
  showSaveButtonHouse: boolean = false;
  showCancelButtonHouse: boolean = false;
  dimWeightResponse: dimWeightResponse[];
  HouseAWB: HouseAWB[];
  responseGoods: responseGoods[];
  responseCommodity: responseCommodity[];
  agentsResponse: agentsResponse[];
  ConsolidatorResponse: agentsResponse[];
  shippereResponse: shippereResponse[];
  consigneeResponse: consigneeResponse[];
  notifyAWBState: boolean = false;
  notifyNewAgentTab2State: boolean = false;
  notifyComidState: boolean = false;
  notifyNewAgentTab1State: boolean = false;
  notifyShipperState: boolean = false;
  notifyConsigneeState: boolean = false;
  validAWBFrom: boolean = false;
  @ViewChildren('examinationPopUpModel') examinationPopUpModel: ElementRef;
  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject();
  dtOptions3: DataTables.Settings = {};
  dtTrigger3: Subject<any> = new Subject();
  responseExamination: responseExamination[];
  AWBNo: string;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  AWBDetail: AWBDetail;
  houseForm: FormGroup;
  DimweightForm: FormGroup;
  AWBDetailForm: FormGroup;
  AWBForm: FormGroup;
  validPopUpForm: boolean = false;
  delivered: boolean = false;
  editMode: boolean = false;
  constructor(public API: ApiService, public GV: GvarService) {
    this.shippereResponse = [];
    this.consigneeResponse = [];
    this.agentsResponse = [];
    this.responseCommodity = [];
    this.HouseAWB = [];
    this.responseGoods = [];
    this.dimWeightResponse = [];
    this.ConsolidatorResponse = [];
    this.AWBDetail = new AWBDetail();
    this.responseExamination = [];
  }

  ngOnInit(): void {
    this.InitializeForm();
    this.InitializeFormAWB();
    //this.getShippers();
   // this.getConsignees();
   // this.getConsolidator();
   // this.getAgents();
    //this.getCommodity();
    //this.getGoods();
    this.delivered = false;
  }
  InitializeFormAWB(): any {
    this.AWBForm = new FormGroup({
      acceptanceID: new FormControl(""),
      ALCode: new FormControl(""),
      AWBType: new FormControl(""),
      
      comm_description: new FormControl(""),
      comid: new FormControl(""),
      chargeableWeight: new FormControl(""),
      AWBNo: new FormControl(""),
      isDepartured: new FormControl(""),
      airportID: new FormControl(""),
      Pieces: new FormControl(""),
      grossWeight: new FormControl(""),
      dimensionalWeight: new FormControl(""),
      Nature: new FormControl(""),
      goodsId: new FormControl(""),
      ALName: new FormControl(""),
      Remarks: new FormControl(""),
    });
  }
  InitializeForm(): any {
    this.AWBDetailForm = new FormGroup({
      AWBNo: new FormControl("", [Validators.required]),
      acceptanceID: new FormControl("", [Validators.required]),
      goodsId: new FormControl("", [Validators.required]),
      Pieces: new FormControl("", [Validators.required]),
      grossWeight: new FormControl("", [Validators.required]),
      dimensionalWeight: new FormControl("", [Validators.required]),
      comid: new FormControl("", [Validators.required]),
      cuttTime: new FormControl("", [Validators.required]),
      agentId: new FormControl("", [Validators.required]),
      consolidatorID: new FormControl("", [Validators.required]),
      LicenseNo: new FormControl(),
      chargeableWeight: new FormControl(),
      AWBID: new FormControl(),
      AgentType: new FormControl(),
      cid: new FormControl(),
      shipperId: new FormControl(),
      CNICNo: new FormControl('', [
        Validators.pattern("^[0-9]{13}$")]),
      CNICExp: new FormControl(),
      isNew: new FormControl(true),
      Destination: new FormControl(),
      shippercountryName: new FormControl(),
      shipperPhoneNo: new FormControl(),
      shipperAddress: new FormControl(),
      consigneeAddress: new FormControl(),
      consigneecountryName: new FormControl(),
      consigneePhoneNo: new FormControl(),
      agentAddress: new FormControl(),
      agentcountryName: new FormControl(),
      agentPhoneNo: new FormControl(),
    });
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
    this.DimweightForm = new FormGroup({
      dimWeightID: new FormControl(),
      acceptanceID: new FormControl(),
      AWBNo: new FormControl(),
      pieces: new FormControl(""),
      length: new FormControl(""),
      width: new FormControl(""),
      height: new FormControl(""),
      sizeinCM: new FormControl(""),
      CBM: new FormControl(""),
      totalWeight: new FormControl(""),
      remarks: new FormControl(""),
      isNew: new FormControl(""),
    });
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
  showHideHouse(callfrm: string) {
    if (callfrm == "New") {
      this.addnewHouse = false;
      this.showHouse = true;
      this.showCancelButtonHouse = false;
      this.showSaveButtonHouse = false;
      this.showeditButtonHouse = true;
      this.shownewButtonHouse = true;
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
      this.houseForm.controls.isNew.setValue(false);
    }
  }
  getAWBDetail() {
    this.API.getdata('/Acceptance/getAWBDetail?AWBNo=' + this.AWBNo).subscribe(c => {
      if (c != null) {
        this.editMode = true;
        this.AWBDetail = c;
        this.AWBForm.patchValue(c);
        if (this.AWBDetail.AWBStatus == "Delivered") {
          this.disableAllForms();
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
  resetAcceptance() {
    this.AWBNo = "";
    this.AWBForm.reset();
    this.responseExamination = [];
    this.destroyDT(0, false).then(destroyed => {
      this.dtTrigger.next();
    });
    this.delivered = false;
    this.editMode = false;
    this.AWBForm.enable();
    this.houseForm.enable();
    this.DimweightForm.enable();
    this.AWBDetailForm.enable();
  }
  disableAllForms() {
    this.delivered = true;
    this.AWBForm.disable();
    this.houseForm.disable();
    this.DimweightForm.disable();
    this.AWBDetailForm.disable();
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
  }
  AwbDetailValidations() {
    if (this.AWBDetailForm.controls.comid.value == "" || this.AWBDetailForm.controls.comid.value == null) {
      Swal.fire({
        text: "Select Commodity",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBDetailForm.controls.consolidatorID.value == "" || this.AWBDetailForm.controls.consolidatorID.value == null) {
      Swal.fire({
        text: "Select Consolidator",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBDetailForm.controls.agentId.value == "" || this.AWBDetailForm.controls.agentId.value == null) {
      Swal.fire({
        text: "Select Agent",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBDetailForm.controls.shipperId.value == "" || this.AWBDetailForm.controls.shipperId.value == null) {
      Swal.fire({
        text: "Select Shipper",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    if (this.AWBDetailForm.controls.cid.value == "" || this.AWBDetailForm.controls.cid.value == null) {
      Swal.fire({
        text: "Select Consignee",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validAWBFrom = false;
      return;
    }
    this.validAWBFrom = true;
  }
  setGVGoods(value: string) {
    this.GV.GoodsCallFrom = value;
  }
  saveAWBDetail() {
    this.AwbDetailValidations();
    if (this.validAWBFrom) {
      this.AWBDetailForm.controls.isNew.setValue(false);
      this.AWBDetailForm.controls.acceptanceID.setValue(this.AWBForm.controls.acceptanceID.value);
      this.AWBDetailForm.controls.AWBNo.setValue(this.AWBForm.controls.AWBNo.value);
      this.API.PostData('/Acceptance/addawbDetail', this.AWBDetailForm.value).subscribe(c => {
        if (c != null) {
          this.AWBDetailForm.controls.AWBID.setValue(c.AWBID);
          Swal.fire({
            text: "Airbill Detail Updated Successfully.",
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
  getConsigneeDetailHouse() {
    var consigneeDetail = this.consigneeResponse.find(x => x.cid == this.houseForm.controls.cid.value);
    if (consigneeDetail != undefined) {
      this.houseForm.controls.consigneeAddress.setValue(consigneeDetail.consigneeAddress);
      this.houseForm.controls.consigneePhoneNo.setValue(consigneeDetail.PhoneNo);
      this.houseForm.controls.consigneecountryName.setValue(consigneeDetail.countryName);
    }
  }
  getHouseDetail() {
    this.API.getdata('/Acceptance/getHouseDetail?acceptanceID=' + this.AWBForm.controls.acceptanceID.value).subscribe(c => {
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
  saveHouse() {
    if (this.houseForm.controls.HAWBNo.value == "" || this.houseForm.controls.HAWBNo.value == null) {
      Swal.fire({
        text: "Enter House No.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.pieces.value == "" || this.houseForm.controls.pieces.value == null) {
      Swal.fire({
        text: "Enter No of Pieces",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.length.value == "" || this.houseForm.controls.length.value == null) {
      Swal.fire({
        text: "Enten Length",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.width.value == "" || this.houseForm.controls.width.value == null) {
      Swal.fire({
        text: "Enter Width",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.height.value == "" || this.houseForm.controls.height.value == null) {
      Swal.fire({
        text: "Enter Height",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.grossWeight.value == "" || this.houseForm.controls.grossWeight.value == null) {
      Swal.fire({
        text: "Enter Gross Weight",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.comid.value == "" || this.houseForm.controls.comid.value == null) {
      Swal.fire({
        text: "Select Commodity",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.houseForm.controls.goodsIdHouse.value == "" || this.houseForm.controls.goodsIdHouse.value == null) {
      Swal.fire({
        text: "Select Nature of Good",
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
    this.houseForm.controls.acceptanceID.setValue(this.AWBForm.controls.acceptanceID.value);
    this.houseForm.controls.AWBNo.setValue(this.AWBForm.controls.AWBNo.value);
    this.API.PostData('/Acceptance/saveHouse', this.houseForm.value).subscribe(c => {
      if (c != null) {
        Swal.fire({
          text: "House Saved Successfully.",
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
  getShipperDetailHouse() {
    var shipperDetail = this.shippereResponse.find(x => x.shipperId == this.houseForm.controls.shipperId.value);
    if (shipperDetail != undefined) {
      this.houseForm.controls.shipperAddress.setValue(shipperDetail.shipperAddress);
      this.houseForm.controls.shipperPhoneNo.setValue(shipperDetail.PhoneNo);
      this.houseForm.controls.shippercountryName.setValue(shipperDetail.countryName);
    }
  }
  getDimWeight() {
    this.API.getdata('/Acceptance/getDimWeight?acceptanceID=' + this.AWBForm.controls.acceptanceID.value).subscribe(c => {
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
  calculateCBM() {
    this.CBM = (this.DimweightForm.controls.length.value) * (this.DimweightForm.controls.width.value) * (this.DimweightForm.controls.height.value) / 1000000;
    this.DimweightForm.controls.CBM.setValue(Math.floor(this.CBM));
    this.sizeinCM = (this.DimweightForm.controls.length.value) * (this.DimweightForm.controls.width.value) * (this.DimweightForm.controls.height.value) / 6000;
    this.DimweightForm.controls.sizeinCM.setValue(Math.floor(this.sizeinCM));
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
  validationsWeightdDIM() {
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
  saveWeightDIM() {
    this.validationsWeightdDIM();
    if (this.validFormWeightdim == true) {
      this.DimweightForm.controls.acceptanceID.setValue(this.AWBForm.controls.acceptanceID.value);
      this.DimweightForm.controls.AWBNo.setValue(this.AWBForm.controls.AWBNo.value);
      this.DimweightForm.controls.isNew.setValue(true);
      this.API.PostData('/Acceptance/saveDimWt', this.DimweightForm.value).subscribe(c => {
        Swal.fire({
          text: "Dimensional Weight Added Successfully.",
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
  getShipperDetailAWB() {
    var shipperDetail = this.shippereResponse.find(x => x.shipperId == this.AWBDetailForm.controls.shipperId.value);
    if (shipperDetail != undefined) {
      this.AWBDetailForm.controls.shipperAddress.setValue(shipperDetail.shipperAddress);
      this.AWBDetailForm.controls.shipperPhoneNo.setValue(shipperDetail.PhoneNo);
      this.AWBDetailForm.controls.shippercountryName.setValue(shipperDetail.countryName);
    }
  }
  getConsigneeDetailAWB() {
    var consigneeDetail = this.consigneeResponse.find(x => x.cid == this.AWBDetailForm.controls.cid.value);
    if (consigneeDetail != undefined) {
      this.AWBDetailForm.controls.consigneeAddress.setValue(consigneeDetail.consigneeAddress);
      this.AWBDetailForm.controls.consigneePhoneNo.setValue(consigneeDetail.PhoneNo);
      this.AWBDetailForm.controls.consigneecountryName.setValue(consigneeDetail.countryName);
    }
  }
  getAgentDetailAWB() {
    var agentDetail = this.agentsResponse.find(x => x.agentId == this.AWBDetailForm.controls.agentId.value);
    if (agentDetail != undefined) {
      this.AWBDetailForm.controls.agentAddress.setValue(agentDetail.agentAddress);
      this.AWBDetailForm.controls.agentPhoneNo.setValue(agentDetail.PhoneNo);
      this.AWBDetailForm.controls.agentcountryName.setValue(agentDetail.countryName);
    }
  }
  notifyAWB(value) {
    var Exists = this.responseGoods.find(x => x.goodsId == value.goodsId);
    if (Exists == undefined) {
      this.responseGoods.push(value);
    }
    this.GoodsID = value.goodsId;
    this.AWBDetailForm.controls.goodsId.setValue(value.goodsId);
    this.closeNatureOfGoodsModal["first"].nativeElement.click();
    this.GV.GoodsCallFrom = "";
  }

  notifyComid(value) {
    var Exists = this.responseCommodity.find(x => x.comid == value.comid);
    if (Exists == undefined) {
      this.responseCommodity.push(value);
    }
    this.ComidID = value.comid;
    this.AWBDetailForm.controls.comid.setValue(value.comid);
    this.closeCommodityModal["first"].nativeElement.click();
    this.GV.GoodsCallFrom = "";
  }
  notifyShipper(value) {
    var Exists = this.shippereResponse.find(x => x.shipperId == value.shipperId);
    if (Exists == undefined) {
      this.shippereResponse.push(value);
    }
    this.ShipperID = value.shipperId;
    this.AWBDetailForm.controls.shipperId.setValue(value.shipperId);
    this.getShipperDetailAWB();
    this.closeShipperModal["first"].nativeElement.click();
    this.GV.GoodsCallFrom = "";
  }
  notifyConsignee(value) {
    var Exists = this.consigneeResponse.find(x => x.cid == value.cid);
    if (Exists == undefined) {
      this.consigneeResponse.push(value);
    }
    this.ConsigneeID = value.cid;
    this.AWBDetailForm.controls.cid.setValue(value.cid);
    this.closeConsigneeModal["first"].nativeElement.click();
    this.GV.GoodsCallFrom = "";
  }
}
