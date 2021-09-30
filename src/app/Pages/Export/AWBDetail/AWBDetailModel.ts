export class AWBDetail {
    acceptanceID: string;
    ALCode: string;
    AWBType: string;
    comm_description: string;
    comid: string;
    AWBNo: string;
    isDepartured: string;
    airportID: string;
    Pieces: string;
    grossWeight: string;
    dimensionalWeight: string;
    regNo: string;
    Nature: string;
    goodsId: string;
    ALName: string;
    AWBStatus: string;
    chargeableWeight:string;
}
export class responseExamination {
    examinationID: string;
    AWBNo: string;
    occurance: boolean;
    examinationType: string;
    completed: boolean;
    pending: boolean;
    exempt: boolean;
    anfCustomExemptionNo: string;
    remarks: string;
}