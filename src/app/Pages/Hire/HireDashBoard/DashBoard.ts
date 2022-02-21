export class getDashBoardData {
    getGSEHired: getGSEHired[];
    stationWise: stationWise[];
    AgencyWise: AgencyWise[];
    PowerWise: PowerWise[];
    MonthWise: MonthWise[];
    constructor() {
        this.getGSEHired = [];
        this.stationWise = [];
        this.AgencyWise = [];
        this.PowerWise = [];
        this.MonthWise = [];
    }
}
export class getGSEHired {
    number: string;
    gseCategory: string;
}
export class stationWise {
    number: string;
    StationName: string;
}
export class AgencyWise {
    number: string;
    agencyName: string;
}
export class PowerWise {
    number: string;
    Power: string;
}
export class MonthWise {
    number: string;
    Month: string;
}
export class requestSearch {
    agencyID: string;
    ALCode: string;
    airportID: string;
    catID: string;
    fromDate: string;
    ToDate: string;
    gsecatID: string;
}
export class getDetail {
    StationName: string;
    fromDatetime: Date;
    toDateTime: string;
    isPower: string;
    gseCategory: string;
    agencyName: string;
    qty: string;
    UOMType: string;
    Units: string;
    Total: string;
    catName: string;
    flightNo: string;
    Remarks: string;
    airportID: string;
    hireinId: string;
    hireindetailID: string;
    gsecatID: string;
    agencyID: string;
    ALCode: string;
    UOMTypeID: string;
    catID: string;
}