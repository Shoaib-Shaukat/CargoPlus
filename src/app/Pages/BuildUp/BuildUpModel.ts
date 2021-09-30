
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
export class flightULDResponse {
    uldRequestID: string;
    ALCode: string;
    dueDate: string;
    postingDate: string;
    uldReqQty: string;
    palletsReqQty: string;
    remarks: string;
    statusID: string;
    uldRequestDetailID: string;
    uldTypeID: string;
    isPallet: string;
    isIssue: string;
    uldreceiveDetailID: string;
    ULDID: string;
    depDate: string;
    depTime: string;
    Destination: string;
    isDepartured: string;
    flightStatus: string;
    ALName: string;
    ULDNo: string;
    ULDType: string;
    taraWeight: string;
    maxGrossWeight: string;
    BuildID: string;
    isBuildUP: string;
    arrivalDate: string;
    arrivalTime: string;
    arrivalFlightNo: string;
    depFlightNo: string;
    isArrived: string;
    depDestination: string;
}
export class employeeModel {
    empID: string;
    employeeName: string;
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
    grossWeight: string;
    chargeableWeight: number;
    cuttTime: string;
    ExaminationRemarks: string;
    ScanningRemarks: string;
    remainingPieces: number;
    remPCS:number=0;
    remainingWeight: string;
    ExaminationStatus: string;
    ScaningStatus: string;
    AWBStatus: string;
    HandedTime: string;
    FurShipment: string;
    AWBNo: string;
    hub: string;
    AcceptanceRemarks: string;
    splitShipment:boolean;
    buildupweight:number;
    checked:boolean;
    isEnabled:boolean=false;
    BuildUPDetailID:string;
    builduppieces:number;
}
export class requestBuildUpModel {
    buildUpRequest: buildUpRequest;
    BuildUpDetail: AWBList[];
    constructor() {
        this.buildUpRequest = new buildUpRequest();
        this.BuildUpDetail = [];
    }
}
export class buildUpRequest {
    BuildID: string;
    ALCode: string;
    ULDID: string;
    ULDFW: string;
    FWDatetime: string;
    ULDSW: string;
    SWDatetime: string;
    // AWBWT: string;
    uldNetWt: string;
    // EMP1: string;
    // EMP2: string;
    SHCode: string;
    ContourType: string;
    deckLocation: string;
    uldRequestDetailID: string;
    taraWeight: string;
    isNew: boolean;
    deckLocationID: string;
    deckLocationName: string;
    checked:boolean;
}
export class BuildUpDetail {
    BuildUPDetailID: string;
    BuildID: string;
    AWBNo: string;
    pieces: number;
    AWBPieces: string;
    splitShipment: boolean;
    destination: string;
    comid: string;
    buildupweight: string;
    AWBWeight: string;
    AWBID: string;
    isChecked: string;
    acceptanceID: string;
    checked:boolean;
    isEnabled:boolean=false;
}
export class buildupViewModel {
    builupModel: buildUpRequest;
    BuildUpDetail: BuildUpDetail[];
    constructor() {
        this.builupModel = new buildUpRequest();
        this.BuildUpDetail = [];
    }
}
export class buildULD {
    uldReceiveID: string;
    ALCode: string;
    flightID: string;
    airportID: string;
    isDeleted: string;
    ULDID: string;
    uldreceiveDetailID: string;
    isIssued: string;
    ULDTypeID: string;
    taraWeight: string;
    status: string;
    serviceAbility: string;
    ULDType: string;
    ULDNo: string;
}
export class requestULDStatus {
    flightID: string;
    ULDNo: string;
}

export class responseDeckLocation {
    deckLocationID: string;
    deckLocationName: string;
}