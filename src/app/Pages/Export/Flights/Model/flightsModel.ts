export class requestFlight {
    flightID: string;
    ALCode: string;
    regNo: string;
    depDate: string;
    depTime: string;
    Destination: string;
    isDepartured: boolean;
    flightInfo: string;
    arrivalDate: string;
    arrivalTime: string;
    isArrived: boolean;
    flightStatus: string;
    arrivalFlightNo: string;
    depFlightNo: string;
    depDestination: string;
    isNew: boolean;
    flightType: string;
    flightTypeID: string;
    aircraftCategoryID: string;
    aircraftTypeID: string;
    aircraftCategoryName: string;
}
export class responseFlight {

    flightID: string;
    ALCode: string;
    regNo: string;
    depDate: string;
    depTime: string;
    Destination: string;
    isDepartured: boolean;
    flightInfo: string;
    arrivalDate: string;
    arrivalTime: string;
    isArrived: boolean;
    flightStatus: string;
    arrivalFlightNo: string;
    depFlightNo: string;
    depDestination: string;
    isNew: boolean;
    flightType: string;
    flightTypeID: string;
    aircraftCategoryID: string;
    aircraftTypeID: string;
    aircraftCategoryName: string;

}

export class aircraftCategoryResponse {
    aircraftCategoryID: string;
    aircraftName: string;
}

export class aircraftTypesResponse {
    aircraftTypeID: string;
    aircraftTypeName: string;
    aircraftCategoryName: string;
}