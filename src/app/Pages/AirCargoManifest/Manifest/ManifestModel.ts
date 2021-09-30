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
    STD: string;
    // empID: string;
    isNew: boolean;
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
    checked:boolean;
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
    requestManifestDetails: getBuilds[];
    constructor() {
        this.requestManifest = new Manifest();
        this.requestManifestDetails = [];
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
    checked:boolean;
}
export class RCSResponse {
    firstLine: string;
    SecordLine: string;
    thirdLine: string;
    fourthLine: string;
}