export class ULDResponseModel {
    ULDResponse: ULDResponse[];
    constructor() {
        this.ULDResponse = [];
    }
    ULDTypeID: string;
}
class ULDResponse {
    ULDTypeID: string;
    ULDType: string;
}