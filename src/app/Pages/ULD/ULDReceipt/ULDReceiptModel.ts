export class ULDReceiptModel {

}
export class ULDTypeResponse {
    ULDTypesID: string;
    ALCode: string;
    ULDType: string;
    taraWeight: string;
    maxGrossWeight: string;
    ALName: string;
    isDamage: boolean;
    damageDetail: string;
    approvedBy: boolean;
    readyForBuildup: string;
}
export class arrivalResponse {
    flightID: string;
    arrivalFlightNo: string;
    ALCode: string;
    regNo: string;
    arrivalDate: string;
    arrivalTime: string;
    Destination: string;
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
    isDamage: boolean;
    damageDetail: string;
    approvedBy: boolean;
    readyForBuildup: string;
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
    isDamage: boolean;
    damageDetail: string;
    approvedBy: boolean;
    readyForBuildup: string;
}