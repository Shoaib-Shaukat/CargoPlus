export class ULDResponseModel {
    ULDResponse: ULDResponse[];
    constructor() {
        this.ULDResponse = [];
    }
    ULDTypesID: string;
}
class ULDResponse {
    ULDTypesID: string;
    ALCode: string;
    ULDType: string;
    taraWeight: string;
    maxGrossWeight: string;
    ALName:string;
}