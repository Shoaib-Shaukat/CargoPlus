export class requestStRegions {
    CountryId:number;
}
export class responseRegions {
    Id:number;
    regionName:string;
    CountryId:number;
}
export class requestCity {
    RegionId:number;

}
export class responseCity {
    Id:number;
    cityName:string;
}
export class responseCountries {
    id:number;
    countryName:string;
}