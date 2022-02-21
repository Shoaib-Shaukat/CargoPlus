export class stationResponse {
    airportID: number;
    airportName: string;
    StationName: string;
}
export class hireinDetail {

}
// export class hireInRequestModel {
//     hireinModel: hireinModel[];
//   //  hireinDetail: hireinDetail[];
//     constructor() {
//         this.hireinModel = [];
//        // this.hireinDetail = [];
//     }
// }
export class hireinModel {
    isPower: string;
    hireinId: string;
    hireinDate: string;
    Remarks: string;
    ALCode: string;
    catID: string;
    flightNo: string;
    isDeleted: string;
    airportID: string;
    gsecatID: string;
    fromDatetime: string;
    toDateTime: string;
    agencyID: string;
    qty: number;
    UOMTypeID: string;
    Units: number;
    Total: string;
    gseCategory: string;
    agencyName: string;
    StationName: string;
    airportName: string;
    UOMType: string;
    ALName:string;
    isNewRow:boolean;
}
export class hireinViewModel {
    hireinModel: hireinModel;
    hireinDetail: hireinDetail[];
    constructor() {
        this.hireinModel = new hireinModel();
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