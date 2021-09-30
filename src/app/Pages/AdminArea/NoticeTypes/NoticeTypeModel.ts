



export class noticeTypeRequest {
   noticeType : noticeTypes;
    noticeDetail: noticeDetail[];
   constructor() {
       this.noticeType = new noticeTypes();
       this.noticeDetail = [];
   }


}
export class noticeTypes {
   noticetypeID: string;
   ALCode: string;
   goodsId: string;
   isNew: boolean;
}
export class noticeDetail {
   noticedetailID: string
   noticetypeID: string;
   noticeType: string;
   mandatory: boolean;
   destination: string;
}
export class noticeTypesRequest {
   ALCode: number;
   goodsId: number;
}