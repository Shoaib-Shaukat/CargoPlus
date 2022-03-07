export class AWBDetail {
    acceptanceID: string;
    ALCode: string;
    AWBType: string;
    comm_description: string;
    comid: string;
    AWBNo: string;
    isDepartured: string;
    airportID: string;
    Pieces: string;
    grossWeight: string;
    dimensionalWeight: string;
    regNo: string;
    Nature: string;
    goodsId: string;
    ALName: string;
    AWBStatus: string;
    chargeableWeight: string;
}
export class responseExamination {
    examinationID: string;
    AWBNo: string;
    occurance: boolean;
    examinationType: string;
    completed: boolean;
    pending: boolean;
    exempt: boolean;
    anfCustomExemptionNo: string;
    ANFDate: string;
}

export class NewExaminationResponse {
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
    Remarks: string;
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
    comid: string;
    AcceptanceRemarks: string;
}

export class examinationResponse {
    acceptanceID: string;
    ExaminationRemarks: string;
    examinationList: responseExamination[];
    constructor() {
        this.examinationList = [];
    }
}

export class DangerGoodsRequestModel {
    dgID: string;
    acceptanceID: string;
    createdBy: string;
    createdDate: string;
    ClassDetail: string;
    UNNumber: string;
    subRisk: string;
    packagesNo: string;
    netQuantity: string;
    materialCat: string;
    packingGroup: string;
    code: string;
    CAO: string;
    ERGCode: string;
    isNew: boolean;
    AWBNo: string;
    shipingName:string;
}

export class DangerGoodsResponseModel {
    dgID: string;
    acceptanceID: string;
    createdBy: string;
    createdDate: string;
    ClassDetail: string;
    UNNumber: string;
    subRisk: string;
    packagesNo: string;
    netQuantity: string;
    materialCat: string;
    packingGroup: string;
    code: string;
    CAO: string;
    ERGCode: string;
    isNew: boolean;
    AWBNo: string;
    shipingName:string;
}
