import { thisMonth } from "@igniteui/material-icons-extended";

export class ULDReceiptModel {

}
export class ULDTypeResponse {
    ULDTypesID: string;
    ALCode: string;
    ULDType: string;
    taraWeight: string;
    maxGrossWeight: string;
    ALName: string;
}
export class arrivalResponse {

}
export class ULDNoCombo {
    ULDID: string;
    ULDTypeID: string;
    ULDNo: string;
    taraWeight: string;
    maxGrossWeight: string;
    status: string;
    serviceAbility: string;
    ULDType: string;
}
export class ULDReceiveModel {
    requestULDReceive: requestULDReceive;
    ULDReceiveDetail: ULDReceiveDetail[];
    constructor() {
        this.requestULDReceive = new requestULDReceive();
        this.ULDReceiveDetail = [];
    }
}
export class requestULDReceive {
    uldReceiveID: string;
    ALCode: string;
    flightID: string;
    destination: string;
    remarks: string;
    isNew: string;
}
export class ULDReceiveDetail {
    uldreceiveDetailID: string;
    ULDTypeID: string;
    uldReceiveID: string;
    ULDID: string;
    ULDType: string;
    ULDNo: string;
}


export class Manifest {
    manifestID: string;
    ALCode: string;
    flightID: string;
    isNew: boolean;
    isDep: boolean;
}

// export class employeeModel {
//     empID: string;
//     employeeName: string;
// }
export class getBuilds {
    acceptanceID: string;
    ALCode: string;
    Destination: string;
    AWBType: string;
    Status: string;
    airportID: string;
    isDeleted: string;
    ALName: string;
    AWBID: string;
    AWBNo: string;
    flightID: string;
    aricraftRegNo: string;
    grossWeight: string;
    buildupweight: string;
    dimensionalWeight: string;
    comid: string;
    statusID: string;
    // EDD: string;
    ETD: string;
    ContourType: string;
    physicallyChecked: string;
    comm_description: string;
    depDate: string;
    depTime: string;
    isDepartured: string;
    depFlightNo: string;
    depDestination: string;
    NetWT: string;
    AWBWT: string;
    priority: string;
    QRTFlight: string;
    QRT: boolean = false;
    QRTLoadingPt: string;
    QRTULoadingPt: string;
    GDNo: string;
    AWBDetailID: string;
    AWBPieces: string;
    pieces: string;
    ULDID: string;
    ULDNo: string;
    ULDType: string;
    taraWeight: string;
    maxGrossWeight: string;
    BuildID: string;
    BuildUPDetailID: string;
    // isChecked: boolean = false;
    builduppieces: string;
    Pieces: string;
    checked: boolean;
}

export class ManfiestDetailModel {
    AWBPieces: string;
    depDestination: string;
    AWBWT: string;
    AWBNo: string;
    grossWeight: string;
    buildupweight: string;
    physicallyChecked: string
    ULDNo: string;
    ULDType: string;
    comm_description: string;
    // EDD: string;


}
export class ManifestDetail {
    manifestDetailID: string;
    manifestID: string;
    ULDID: string;
    ULDTypeID: string;
    AWBID: string;
    priority: string;
    GDNo: string;
    QRT: string;
    // isChecked: string;
    airportID: string;
    QRTFlight: string;
    QRTLoadingPt: string;
    QRTULoadingPt: string;
}
export class requestManifestModel {
    requestManifest: Manifest;
    requestManifestDetails: buildupModel[];
    bulkLoadRequestModel: AWBList[];
    constructor() {
        this.requestManifest = new Manifest();
        this.requestManifestDetails = [];
        this.bulkLoadRequestModel = [];
    }
}

export class getDataByAWBNoResponse {
    AWBID: string;
    acceptanceID: string;
    AWBNo: string;
    aricraftRegNo: string;
    Pieces: string;
    grossWeight: string;
    buildupweight: string;
    dimensionalWeight: string;
    ExaminationStatus: string;
    ScaningStatus: string;
    AWBStatus: string;
    OvrShipment: boolean;
    holdShipment: boolean;
    DNR: boolean
    FurShipment: boolean;
    airportID: string;
    isDeleted: boolean;
    // EDD: string;
    ETD: string;
    physicallyChecked: string;
    oversizeShipments: string;
    occurance: string;
    frustratedShipment: string;
    BuildID: string;
    flightID: string;
    ULDID: string;
    FWDatetime: string;
    ULDFW: string;
    ULDSW: string;
    SWDatetim: string;
    NetWT: string;
    SHCode: string;
    ContourType: string;
    deckLocation: string;
    uldRequestDetailID: string;
    manifestID: string;
    // isChecked: string;
    ULDNo: string;
    taraWeight: string;
    maxGrossWeight: string;
    status: string;
    serviceAbility: string;
    ULDType: string;
    ALName: string;
    isDepartured: string;
    depDestination: string;
    depFlightNo: string;
    arrivalFlightNo: string;
    comm_description: string;
    builduppieces: string;
    checked: boolean;
}
export class RCSResponse {
    firstLine: string;
    SecordLine: string;
    thirdLine: string;
    fourthLine: string;
}
export class buildupModel {
    manifestDetailID: string;
    manifestID: string;
    BuildID: string;
    ULDID: string;
    ContourType: string;
    deckLocationName: string;
    deckLocation: string;
    ULDNo: string;
    ULDType: string;
    checked: boolean;
    priority: string;
    QRT: boolean;
    QRTFlight: string;
    QRTLoadingPt: string;
    QRTULoadingPt: string;
    uldreceiveDetailID: string;
}
export class UWSResponseModel {
    totManifestWt: number;
    totActWeight: number;
    totTareWeight: number;
    totBulkManifestwt: number;
    totBulkActWt: number;
    grandTotalManifest: number;
    grandTotalActual: number;
    depFlightNo: string;
    aircraftTypeName: string;
    depDate: string;
    regNo: string;
    depDestination: string;

    UWSModel: UWSModel[];
    manifestBulkDetail: manifestBulkDetail[];
    constructor() {
        this.UWSModel = [];
        this.manifestBulkDetail = [];
    }
}
export class UWSModel {
    handlingCodes: string;
    ULDNo: string;
    ULDType: string;
    taraWeight: string;
    uldgrossWeight: string;
    regNo: string;
    depDestination: string;
    depFlightNo: string;
    aircraftTypeName: string;
    flightID: string;
    isDeleted: string;
    airportID: string;
    ContourType: string;
    depDate: string;
    grossWeight: string;
}
export class manifestBulkDetail {
    SHC: string;
    Destination: string;
    bulkID: string;
    AWBNo: string;
    manifestID: string;
    acceptanceID: string;
    awbNo: string;
    bulkPieces: string;
    bulkWeight: string;
    Pieces: string;
    grossWeight: string;
    chargeableWeight: string;
    remainingWeight: string;
    remainingPieces: string;
}

export class AWBDims {
    dimmsDetail: string;
}
export class FWBResponse {
    constructor() {
        this.dimsList = [];
    }
    dimsList: AWBDims[];
    FWBDetail: string;
    AWBDetail: string;
    FlightDetail: string;
    RTGDetail: string;
    SHP: string;
    ShipperName: string;
    ShipperAddress: string;
    ShipperCity: string;
    ShipperCountry: string;
    Consignee: string;
    ConsigneeName: string;
    ConsigneeAddress: string;
    ConsigneeCity: string;
    ConsigneeCountry: string;
    Agent: string;
    AgentName: string;
    AgentAddress: string;
    AgentCity: string;
    AgentCountry: string;
    AgentIATACode: string;
    CVD: string;
    RTDDetail: string;
    commodity: string;
    OTH: string;
    AWC: string;
    AIS: string;
    HLD: string;
    SSC: string;
    GTC: string;
    PPD: string;
    OC: string;
    ISU: string;
    REF: string;
    SPH: string;
}

export class removeManifestDetailModel {
    manifestDetailID: string;
    BuildID: string;
}
export class AWBList {
    acceptanceID: string;
    Destination: string;
    DNR: boolean;
    Occurance: string;
    OvrShipment: string;
    holdShipment: boolean;
    otherAirline: string;
    otherAirLineName: string;
    otherAirlineCode: string;
    HandedDate: string;
    GDNo: string;
    Region: string;
    Pieces: number;
    grossWeight: number;
    chargeableWeight: number;
    cuttTime: string;
    ExaminationRemarks: string;
    ScanningRemarks: string;
    remainingPieces: number;
    remPCS: number = 0;
    remainingWeight: number;
    ExaminationStatus: string;
    ScaningStatus: string;
    AWBStatus: string;
    HandedTime: string;
    FurShipment: string;
    AWBNo: string;
    hub: string;
    AcceptanceRemarks: string;
    splitShipment: boolean;
    bulkWeight: number;
    checked: boolean;
    isEnabled: boolean = false;
    bulkID: string;
    bulkPieces: number;
}


export class NOTOCModel {
    handlingCodes: string;
    Destination: string;
    AWBNo: string;
    ALName: string;
    builduppieces: string;
    splitShipment: string;
    buildupweight: string;
    ULDType: string;
    regNo: string;
    depDate: string;
    depFlightNo: string;
    depDestination: string;
    EmployeeName: string;
    acceptanceID: string;
    flightID: string;
    comm_description: string;
    ULDNo: string;
}
export class manifestResponseModel {
    manifestID: string;
    ALCode: string;
    flightID: string;
    ariportID: string;
    isDeleted: boolean;
    manifestDetailID: string;
    QRT: boolean;
    QRTFlight: string;
    QRTLoadingPt: string;
    QRTULoadingPt: string;
    comm_description: string;
    handlingCodes: string;
    suppInfo: string;
    ULDNo: string;
    ULDType: string;
    ULDID: string;
    BuildID: string;
    depDestination: string;
    flightType: string;
    depFlightNo: string;
    isDepartured: boolean;
    GDNo: string;
    ALName: string;
    ULDGroup: string;
    GrossPcs: string;
    regNo: string;
    depDate: string;
    depTime: string;
    aircraftTypeName: string;
    aircraftCategoryName: string;
    airportName: string;
    ShortID: string;
    airportID: string;
    chargeableWeight: string;
    ArrivalDestination: string;
    splitShipment: boolean;
    CBM: string;
    builduppieces: string;
    buildupweight: string;
    uldgrossWeight: string;
    AWBNo: string;
    Destination: string;
    EmployeeName: string;
}
export class flightDetail {
    ALCode: string;
    Prefix: string;
    Schedule: boolean;
    hub: string;
    depDate: string;
    depTime: string;
    regNo: string;
    depDestination: string;
    depFlightNo: string;
    flightStatus: string;
    aircraftTypeName: string;
    aircraftCategoryName: string;
    isDepartured: boolean;
    manifestID: string;
    flightID: string;
}
export class DGShipmentResponse {
    acceptanceID: string;
    AWBNo: string;
    Destination: string;
    shipperName: string;
    dgID: string;
    ClassDetail: string;
    UNNumber: string;
    subRisk: string;
    packagesNo: string;
    netQuantity: string;
    packingGroup: string;
    materialCat:string;
    code: string;
    CAO: string;
    ERGCode: string;
    airportID: string;
    BuildUPDetailID: string;
    BuildID: string;
    ULDID: string;
    ULDNo: string;
    ULDType: string;
}
export class NOTOCResponseModel {
    NOTOCModel: NOTOCModel[];
    manifestResponseModel: manifestResponseModel[];
    DGShipmentResponse:DGShipmentResponse[];
    flightDetail: flightDetail;
    public NOTOCResponseModel() {
        this.NOTOCModel = [];
        this.DGShipmentResponse=[];
        this.manifestResponseModel = [];
        this.flightDetail = new flightDetail();
    }
}
export class responceCargoMessage {
    firstLine: string;
    SecordLine: string;
    thirdLine: string;
    fourthLine: string;
    lineBreak: string;
}