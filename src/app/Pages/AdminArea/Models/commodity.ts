export class requestCommodity {
    comid: number
    comm_description: string
    handlingCodes: string
    isNew: boolean;
    suppInfo: string;
    goodsId:number;
    showonNOTOC: boolean;

}
export class responseCommodity {
    comid: number
    comm_description: string
    handlingCodes: string
    suppInfo: string
    Nature:string;
    goodsId:number;
    showonNOTOC: boolean;
}