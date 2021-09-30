export class ULDResponseModel {
    ULDResponse: ULDResponse[];
    constructor() {
        this.ULDResponse = [];
    }
    ULDTypesID: string;
}
export class ULDResponse {
    ULDTypesID: string;
    ALCode: string;
    ULDType: string;
    taraWeight: string;
    maxGrossWeight: string;
    ALName: string;
}
export class ULDData {
    ULDID: string;
    ALCode: string;
    ULDTypesID: string;
    ULDNo: string;
    taraWeight: string;
    maxGrossWeight: string;
    status: string;
    serviceAbility: string;
    isDeleted: string;
    airportID: string;
    ULDType: string;
    ALName: string;
}
export class ULDCombo {
    ULDID: string;
    ULDTypeID: string;
    ULDNo: string;
    taraWeight: string;
    maxGrossWeight: string;
    status: string;
    serviceAbility: string;
    ULDType: string;
}

export class ULDTypeResponse {
    ULDTypeID: number;
    ALCode: string;
    ULDType: string;
    taraWeight: string;
    maxGrossWeight: string;
    ALName: string;
    ULDNo: string;
    Status: string;
    serviceAbility: string;
    flightID: string;
    depFlightNo: string;
}