export class stationResponse {
    airportID: number;
    airportName: string;
    StationName: string;
}
export class gseCateRequestModel {
    gsecatID: number;
    gseCategory: string;
    isPower: boolean;
}
export class gseCateMasterModel {
    gsecatID: number;
    gseCategory: string;
    isPower: boolean;
}

export class hireinDetail {

}
export class hireoutModel {
    hireoutID: string;
    rasID: number;
    flightNo: string;
    Remarks: string;
    agencyID: string;
    qty: number;
    UOMTypeID: number;
    Units: number;
    Total: string;
    airportID: number;
    gseMasterID: number;
    fromDatetime: string;
    toDateTime: string;
    UOMType: string;
    agencyName: string;
    gseCategory: string;
    StationName: string;
    isNewRow: boolean;
    modifiedDate:string;
    createdBy:string;
    createdDate:string;
    modifiedBy:string;  
}
export class hireinViewModel {
    hireoutModel: hireoutModel;
    hireinDetail: hireinDetail[];
    constructor() {
        this.hireoutModel = new hireoutModel();
        this.hireinDetail = [];
    }
}

export class removeDetailModel {
    gsecatID: string;
    hireindetailID: string;
}
export class UOMTypeResponse {
    UOMTypeID: number;
    UOMType: string;
}

export class gseMasterResponse {
    StationName: string;
    gseMasterID: string;
    airportID: string;
    rasID: string;
    gsecatID: string;
    inductionDate: string;
    model: string;
    chassisNo: string;
    engineNo: string;
    isPower: string;
    gStatus: string;
    remarks: string;
    createdBy: string;
    modifiedBy: string;
    modifiedDate: string;
    createdDate: string;
    gseCategory: string;
    createdByName: string;
    modifiedByName: string;
    gseImage: string;
    uomID: string;
    uomValue: string;
    YOM:string;
    oemDetail: string;
    UOMName: string;
    powerDetail: string;
}