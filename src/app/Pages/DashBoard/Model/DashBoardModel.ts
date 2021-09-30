export class requestModel {
    invoiceno: string;
    FromDate: string;
    dataType: string;
    ToDate: string;
    userid: string;
    ModeofPay: string;
    locationID: string;
    selectedLocations: selectedLocations[];
    constructor() {
        this.selectedLocations = [];
    }
}
export class responseModel {
    constructor() {
        this.monthwiseDetail = [];
        this.locationStatus = [];
    }
    monthwiseDetail: monthwiseDetail[];
    locationStatus: locationStatus[];
}
export class monthwiseDetail {
    Months: number;
    Years: number;
    vDate: Date;
    GrandTotal: number;
    SSTaxAmount: number;
    ExcessAmount: number;
    NetAmount: number;
}
export class locationStatus {
    locationID: number;
    locationName: string;
    locStatus: string;
}
export class selectedLocations {
    locationID: number;
    locationName: string;
}
export class serverStatus {
    serverName: string;
    serverStatus: string;
}
export class waiters {
    WaiterID: number;
    WaiterName: string
    WaiterDOJ: string
    WaiterPhone: string
    WaiterNIC: string
    WaiterAddress: string
    WaiterEmail: string
    Waitermobile: string
    locationID: number
}
export class userwiseResponse {
    constructor() {
        this.userwiseDetail = [];
    }
    userwiseDetail: userwiseDetail[];

}
export class userwiseDetail {
    dbData: string;
    userid: string
    NetAmount: number
}
export class singleUserRequest {
    ToDate: string;
}
export class singleDateResponse {
    dates: Date;
    invoiceno: string;
    Persons: string;
    VALUE: string;
    DisAmount: string;
    saleTax: string;
    BalAmount: string;
    TableNo: string;
}
export class selectedItems {
   isActive:boolean;
   isDeleted:boolean;
   locationID:number;
   locationName:string;
}