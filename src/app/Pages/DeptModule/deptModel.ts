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
export class AWBDims {
    dimmsDetail: string;
}
export class NOTOCResponseModel {
    QRTLoadingPt: string;
    QRTULoadingPt: string;
    QRTFlightDate: string;
    acceptanceID: string;
    Destination: string;
    AWBNo: string;
    grossWeight: string;
    comm_description: string;
    handlingCodes: string;
    suppInfo: string;
    pieces: string;
    ULDNo: string;
    depDestination: string;
    depFlightNo: string;
    ALName: string;
    regNo: string;
    depDate: string;
    depTime: string;
    airportName: string;
    ShortID: string;
    chargeableWeight: string;
    builduppieces: string;
    buildupweight: string;
    hub: string;
}
