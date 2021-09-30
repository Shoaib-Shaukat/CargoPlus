export class agentsResponse {
     agentId: string;
     agenttypeID: string;
     airportID: string;
     agentName: string;
     agentAddress: string;
     countryID: string;
     stateID: string;
     cityID: string;
     CNIC: string;
     cnicExpiry: string;
     PhoneNo: string;
     IATARegNo: string;
     emailAddress: string;
     faxNo: string;
     mobileNo: string;
     isDeleted: string;
     agentType: string;
     airportName: string;
     cityName: string;
     countryName: string;
     regionName: string;
     cid: string;
     CNIC_F: string;
     CNIC_B: string;
     fileNameCNICF: string;
     fileNameCNICB: string;
     CNICFModule: string;
     CNICBModule: string;
     CNICB_data: string;
     CNICF_data: string;
     greyList: boolean;
}
export class requestAgent {
     agentId: number;
     agenttypeID: string;
     airportID: string;
     agentAddress: string;
     countryID: string;
     stateID: string;
     cityID: string;
     CNIC: string;
     cnicImage: string;
     cnicExpiry: string;
     PhoneNo: string;
     IATARegNo: string;
     emailAddress: string;
     agentName: string;
     faxNo: string;
     mobileNo: string;
     isNew: boolean;
     cid: number;
     greyList: boolean;
}
export class agentType {
     typeid: number;
     agentType: string;
}

export class attachmentResponse {
     attachmentID: number;
     module: string;
     atttypeID: string;
     fileName: string;
     fileData: Blob;
     attType: string;
     acceptanceID: number;
 }

 export class AttachmentTypes {
     atttypeID: number;
     moduleID: string;
     attType: string;
     airportID: string;
 }