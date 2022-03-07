export class ApprovalRequest {
    aID: number;
    gsemoduleID: number;
    approvalID: string;
    priority: number;
    airportID: string;
   
}

export class ApprovalResponse {
    aID: number;
    gsemoduleID: number;
    approvalID: string;
    priority: number;
    airportID: string;
    ApprovalName:string;
    gseModule:string;
    StationName:string;
}

export class ModuleResponse {
    gsemoduleID: number;
    gseModule: string;
}

export class employeeModel {
    empID: string;
    employeeName: string;
}

export class stationResponse {
    airportID: number;
    airportName: string;
    StationName: string;
}