export class complaints {
    complaintID:string;
    typeID:number;
    descripton:string;
    locationID:number;
    createdDate:Date;
    createdBy:string;
    assignedto:string;
    assignedDate:Date;
}
export class complaintTypes {
    typeID:number;
    complaintType1:string;
}
export class ComplaintCounter {
    complaintCat:string;
    complaintCount:number
}
export class pendingComplaints {
    complaintID:number;
    complaintType:string;
}