export class emailDetailModel {
    emailDetailID: string;
    emailID: string;
    emailType: string;
    airportID: string;
    emailaddress: string;
}
export class emailResponseModel {
    emailID: string;
    messageID: string;
    ALCode: string;
    airportID: string;
    MessageType: string;
    emailDetailList: emailDetailModel[];
    constructor() {
        this.emailDetailList = [];
    }
}
export class requestEmail {
    ALCode: string;
    messageID: string;
}

export class messageType {
    messageID: number;
    MessageType: string;
}