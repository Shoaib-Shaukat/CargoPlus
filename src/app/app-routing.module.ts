import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Pages/Login/login.component';
import { LayoutComponent } from './Pages/Shared/Layout/layout.component'
import { Auth } from './Services/Guard/guard.service'
import { DashBoardComponent } from './Pages/DashBoard/dash-board.component';
import { AdminAreaComponent } from './Pages/AdminArea/admin-area.component';
import { ShipperComponent } from './Pages/AdminArea/Shipper/shipper.component'
import { AgentTypeComponent } from './Pages/AdminArea/AgentType/agent-type.component'
import { ConsigneeComponent } from './Pages/AdminArea/Consignee/consignee.component'
import { AgentsComponent } from './Pages/AdminArea/Agents/agents.component'
import { UdmMasterComponent } from './Pages/AdminArea/UDMMaster/udm-master.component'
import { CommodityComponent } from './Pages/AdminArea/Commodity/commodity.component'
import { VehiclesComponent } from './Pages/AdminArea/Vehicles/vehicles.component'
import { ForwaderComponent } from './Pages/AdminArea/Forwader/forwader.component'
import { NatureOfGoodsComponent } from './Pages/AdminArea/NatureofGoods/nature-of-goods.component'
import { AirLinesComponent } from './Pages/AdminArea/AirLines/air-lines.component'
import { ExportComponent } from './Pages/Export/export.component'
import { AcceptanceComponent } from './Pages/Export/Acceptance/acceptance.component'
import { InquiryComponent } from './Pages/Export/Inquiry/inquiry.component'
import { NoticeTypesComponent } from './Pages/AdminArea/NoticeTypes/notice-types.component'
import { ExaminationComponent } from './Pages/Export/Examination/examination.component'
import { ScanningComponent } from './Pages/Export/Scanning/scanning.component'
import { ULDTypesComponent } from './Pages/AdminArea/ULDTypes/uldtypes.component'
import { ULDRouteComponent } from './Pages/ULD/uldroute.component'
import { ULDComponent } from './Pages/ULD/ULD/uld.component'
import { ULDReceiptComponent } from './Pages/ULD/ULDReceipt/uldreceipt.component'
import { ReveiveULDInquiryComponent } from './Pages/ULD/ULDReceiveInquiry/reveive-uldinquiry.component';
import { BuildUpComponent } from './Pages/BuildUp/build-up.component';
import { FlightsComponent } from './Pages/Export/Flights/flights.component';

import { ManifestComponent } from './Pages/AirCargoManifest/Manifest/manifest.component';
import { UldStockEachComponent } from './Pages/ULD/ULDStock/uldStockEach/uld-stock-each.component';
import { UldStockAllComponent } from './Pages/ULD/ULDStock/uldStockAll/uld-stock-all.component';
import { AWBDetailComponent } from './Pages/Export/AWBDetail/awbdetail.component';
import { EmailComponent } from './email/email.component';

const routes: Routes = [

  {
    path: '', component: LayoutComponent, canActivate: [Auth], children: [
      { path: 'Dashboard', component: DashBoardComponent },
      {
        path: 'Admin', component: AdminAreaComponent, children: [
          { path: 'Shipper', component: ShipperComponent },
          { path: 'Consignee', component: ConsigneeComponent },
          { path: 'AgentType', component: AgentTypeComponent },
          { path: 'Agents', component: AgentsComponent },
          { path: 'UDM Master', component: UdmMasterComponent },
          { path: 'Commidity', component: CommodityComponent },
          { path: 'Vehicles', component: VehiclesComponent },
          { path: 'Forwader', component: ForwaderComponent },
          { path: 'NatureOfGoods', component: NatureOfGoodsComponent },
          { path: 'AirLines', component: AirLinesComponent },
          { path: 'NoticeType', component: NoticeTypesComponent },
          { path: 'ULDTypes', component: ULDTypesComponent },
          { path: 'CreateBuildUP/:id', component: BuildUpComponent },
          { path: 'Email', component: EmailComponent },

        ]
      },
      {
        path: 'Export', component: ExportComponent, children: [
          { path: 'Acceptance', component: AcceptanceComponent },
          { path: 'Flights', component: FlightsComponent },
          { path: 'Inquiry', component: InquiryComponent },
          { path: 'Examination', component: ExaminationComponent },
          { path: 'Scanning', component: ScanningComponent },
          { path: 'Manifest', component: ManifestComponent },
          { path: 'BuildUp', component: BuildUpComponent },
          { path: 'AWBDetail', component: AWBDetailComponent },
        ]
      },
      {
        path: 'ULD', component: ULDRouteComponent, children: [
          { path: 'ULD', component: ULDComponent },
          { path: 'ULDReceive', component: ULDReceiptComponent },
          { path: 'ULDReceive/:id', component: ULDReceiptComponent },
          { path: 'ULDReceiveInquiry', component: ReveiveULDInquiryComponent },
          { path: 'editBuildup/:id', component: BuildUpComponent },
          { path: 'UldStockEachComponent', component: UldStockEachComponent },
          { path: 'UldStockAllComponent', component: UldStockAllComponent },
        ]
      },
    ]
  },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
