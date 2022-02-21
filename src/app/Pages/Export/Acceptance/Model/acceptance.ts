export class requestAcceptance {
    acceptanceID: number
    ALCode: number
    ALName: string
    Destination: string
    AWBType: string
    FurShipment: string
    DNR: boolean
    Occurance: boolean
    OvrShipment: boolean
    holdShipment: boolean
    otherAirline: boolean
    SHC: string;
    otherAirLineName: string
    otherAirlineCode: string
    docNo: number
    docDate: string
    HandedDate: string
    HandedTime: string
    CBM: string;
    Status: string
    AcceptanceRemarks: string
    isNew: boolean
    HandedTimeStr: string;
    goodsId: string;
    cuttTimeStr: string;
    cuttTime: string;
    grossWeight: string;
    chargeableWeight: string;
    dimensionalWeight: string;
    Pieces: string;
    scaleWeight: string;
    billWeight: string;
    comid: number;
    AWBStatus: number;
    agentId: string;
    consolidatorID: string;
    executionDate: string;
}
export class acceptanceModel {
    generalRequest: requestAcceptance;
    awbDetailRequest: AWBDetailRequest;
    constructor() {
        this.generalRequest = new requestAcceptance();
        this.awbDetailRequest = new AWBDetailRequest();
    }
}
export class responseModel {
    isSaved: boolean;
    responseAcceptance: responseAcceptance;
    responseModel() {
        this.responseAcceptance = new responseAcceptance();
    }

}
export class responseAcceptance {
    acceptanceID: number
    ALCode: number
    ALName: string
    Destination: string
    AWBType: string
    FurShipment: string
    DNR: boolean
    Occurance: boolean
    OvrShipment: boolean
    holdShipment: boolean
    otherAirline: boolean
    otherAirLineName: string
    otherAirlineCode: string
    docNo: number
    docDate: string
    HandedDate: string
    HandedTime: string
    Status: string
    AcceptanceRemarks: string
    goodsId: string
    cuttTimeStr: string;
    cuttTime: string;
    grossWeight: string;
    chargeableWeight: string;
    dimensionalWeight: string;
    Pieces: string;
    agentId: string;
}
export class employeeModel {
    empID: string;
    employeeName: string;
}
export class AWBDetailRequest {
    acceptanceID: string;
    AWBNo: string;
    comid: number;
    consolidatorID: string;
    shipperId: string;
    cid: string;
    dimWeightID: string;
    HAWBNo: string;
    AWBStatus: string;
    Destination: string;
    executionDate: string;
}
export class requestWeight {
    weightDetailID: string;
    acceptanceID: string;
    AWBNo: string;
    empID: string;
    vehicleID: string;
    vehNumer: string;
    driverName: string;
    driverCNIC: string;
    firstWt: string;
    firstTime: string;
    firstDate: string;
    secondWt: string;
    secondTime: string;
    secondDate: string;
    AWBWt: string;
    netWt: string;
    remarks: string;
}
export class weightResponseModel {
    weightResponse: requestWeight;
    weightDetailResponse: weightDetailResponse[];
    constructor() {
        this.weightResponse = new requestWeight();
        this.weightDetailResponse = [];

    }
}
class weightDetailResponse {
    weightID: string;
    acceptanceID: string;
    airportID: string;
    AWBNo: string;
    empID: string;
    isDeleted: string;
    weightDetailID: string;
    vehicleID: string;
    vehNumer: string;
    driverName: string;
    driverCNIC: string;
    firstWt: string;
    firstTime: string;
    firstDate: string;
    secondWt: string;
    secondTime: string;
    secondDate: string;
    AWBWt: string;
    remarks: string;
    netWt: number;
    isDeleted_Detail: string;
    vehicleType: string;
    pieces: number;
}
export class getWeight {
    weightID: string;
    acceptanceID: string;
}
export class attachmentResponse {
    attachmentID: number;
    module: string;
    atttypeID: string;
    fileName: string;
    fileData: Blob;
    attType: string;
    acceptanceID: number;
}
export class noticeTypesRequest {
    ALCode: number;
    goodsId: number;
}
export class InquiryResponse {
    noticetypeID: string;
    mandatory: boolean;
    noticeType: string;
    IsRevieved: boolean;
    IsPending: boolean;
    NA: boolean;
    acceptanceID: string;
    noticeID: string;
    noticedetailID: string;
}

export class dimWeightResponse {
    dimWeightID: string;
    acceptanceID: string;
    AWBNo: string;
    goodsid: string;
    pieces: string;
    length: string;
    width: string;
    height: string;
    CBM: number;
    remarks: string;
    netWeight: number;
}
export class HouseAWB {
    HNo: string;
    HAWBNo: string;
    acceptanceID: string;
    flightID: string;
    AWBNo: string;
    chargeableWeight: string;
    width: string;
    height: string;
    length: string;
    pieces: string;
    dimensionalWeight: string;
    comid: number;
    goodsid: string;
    shipperId: string;
    cid: string;
    flightNo: string;
    ALCode: string;
    regNo: string;
    depDate: string;
    Destination: string;
    depTime: string;
    Nature: string;
}
export class AcceptanceDetailModel {
    AcceptanceDetail: requestAcceptance;
    //AWBDetail: AWBDetailRequest;
    noticeTypeResponse: InquiryResponse[];
    WeightResponse: weightDetailResponse[];
    //DimWeightResponse:responseDimWt[];
    //  houseResponse: HouseAWB[];
    constructor() {
        this.AcceptanceDetail = new requestAcceptance();
        //this.AWBDetail = new AWBDetailRequest();
        this.WeightResponse = [];
        this.noticeTypeResponse = [];
        // this.houseResponse = [];
        // this.DimWeightResponse=[];
    }
}
// export class responseDimWt {
//      dimWeightID { get; set; }
//     public Nullable<long> acceptanceID { get; set; }
//     AWBNo { get; set; }
//     public Nullable<int> goodsid { get; set; }
//     public int pieces { get; set; }
//     public Nullable<decimal> length { get; set; }
//     public Nullable<decimal> width { get; set; }
//     public Nullable<decimal> height { get; set; }
//     public Nullable<decimal> sizeinCM { get; set; }
//     public Nullable<decimal> totalWeight { get; set; }
//     remarks { get; set; }
//     public Nullable<bool> isDeleted { get; set; }
//     public Nullable<int> airportID { get; set; }
//     Nature { get; set; }
// }

export class SaveALL {
    AWBForm: any;
}
export class NewAcceptanceResponse {
    acceptanceID: number;
    ALCode: number;
    Destination: string;
    AWBType: string;
    DNR: boolean;
    Occurance: boolean;
    OvrShipment: boolean;
    holdShipment: boolean;
    otherAirline: boolean;
    otherAirLineName: string;
    empName: string;
    otherAirlineCode: string;
    airportID: number;
    HandedDate: string;
    AcceptanceRemarks: string;
    createdBy: string;
    createdDate: string;
    ModifiedDate: string;
    modifiedBy: string;
    isDeleted: boolean;
    GDNo: string;
    Region: string;
    goodsId: string;
    Pieces: string;
    grossWeight: string;
    dimensionalWeight: string;
    chargeableWeight: string;
    cuttTime: string;
    ExaminationRemarks: string;
    ScanningRemarks: string;
    flightID: string;
    ULDID: string;
    remainingPieces: string;
    remainingWeight: string;
    ExaminationStatus: string;
    ScaningStatus: string;
    AWBStatus: string;
    HandedTime: string;
    empID: string;
    FurShipment: string;
    AWBNo: string;
    Prefix: number;
    hub: string;
    ALName: string;
    scaleWeight: string;
    billWeight: string;
    comid: number;
    agentId: string;
}
export class requestWeightRPT {
    weightDetailID: string;
}
export class AttachmentTypes {
    atttypeID: number;
    moduleID: string;
    attType: string;
    airportID: string;
}
export class responseDriver {
    driverName: string;
    vehNumer: string;
    driverCnic: string;

}
export class responseStatus {
    acceptanceStatus: string;
    acceptanceStatusID: number;

}
export class responseDepFlight {
    ALName: string;
    flightID: number;
    depFlightNo: string;
    ALCode: number;
    regNo: string;
    depDate: string;
    depTime: string;
    depDestination: string;
}
export class responceCargoMessage {
    firstLine:string;
    SecordLine:string;
    thirdLine:string;
    fourthLine:string;
    
}
export class weightScaleResponse {
    weightScaleID:number;
    locationName:string;
    isDefault:boolean;
}