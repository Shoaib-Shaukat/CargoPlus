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
}

export class ModuleResponse {
    moduleID: number;
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