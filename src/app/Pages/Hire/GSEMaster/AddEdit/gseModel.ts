export class gseMasterModel {
    gseMasterID: string;
    airportID: string;
    YOM: string;
    rasID: string;
    gsecatID: string;
    uomID: string;
    uomValue: string;
    inductionDate: string;
    Manufacturer: string;
    model: string;
    chassisNo: string;
    engineNo: string;
    isPower: string;
    powerDetail: string;
    gStatus: string;
    remarks: string;
    createdBy: string;
    createdDate: string;
    modifiedBy: string;
    modifiedDate: string;
    gseImage: string;
    oemID: string;
    capacityValue: string;
    capacityUnit: string;
    gseImages:gseImages[];
    public constructor () {
        this.gseImages=[];
    }
}
export class gseImages {
    gseimgID: string;
    gseMasterID: string;
    gseImg: string;
}