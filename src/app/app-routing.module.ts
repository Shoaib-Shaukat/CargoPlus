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
import { EmailComponent } from './email/email.component';
import { GroupRolesComponent } from './Pages/AdminArea/Roles/GroupRoles/group-roles.component'
import { AssignRolesComponent } from './Pages/AdminArea/Roles/AssignRoles/assign-roles.component'
import { ChangePasswordComponent } from './Pages/UserProfile/ChangePassword/change-password.component'
import { EmailModuleComponent } from './email-module/email-module.component';
import { NotifyComponent } from './Pages/Notify/notify/notify.component';
import { DeptModuleComponent } from './Pages/DeptModule/dept-module.component';
import { ContourTypeComponent } from './Pages/AdminArea/ContourType/contour-type.component';
import { AircraftTypesComponent } from './Pages/AdminArea/Aircraft-Types/aircraft-types.component';
import { DangerGoodsComponent } from './Pages/DangerGoods/danger-goods.component';
import { DollyDetailComponent } from './Pages/AdminArea/Dolly-Detail/dolly-detail.component';
import { AgencyComponent } from './Pages/AdminArea/Agency/agency.component'
import { AirCraftCatComponent } from './Pages/AdminArea/AirCraftCat/air-craft-cat.component'
import { GseCatComponent } from './Pages/AdminArea/GSECat/gse-cat.component'
import { GseMasterComponent } from './Pages/Hire/GSEMaster/gse-master.component'
import { HireinComponent } from './Pages/Hire/Hirein/hirein.component'
import { HireDashBoardComponent } from './Pages/Hire/HireDashBoard/hire-dash-board.component'
import { HireInSearchComponent } from './Pages/Hire/Search/hire-in-search.component'
import { TestingComponent } from './Pages/Testing/testing.component'
import { AddEditMasterComponent } from './Pages/Hire/GSEMaster/AddEdit/add-edit-master.component'
import { GseReportComponent } from './Pages/Hire/GSEMaster/GSEReport/gse-report.component'
import { AcceptanceReportComponent } from './Pages/Export/Reports/AcceptanceReport/acceptance-report.component'
import { UOMComponent } from './Pages/Hire/GSEMaster/UOM/uom.component';
import { ManufacturerComponent } from './Pages/Hire/GSEMaster/Manufacturer/manufacturer.component';
import { GSEModuleComponent } from './Pages/Hire/GSEModule/gsemodule.component';
import { GSEApprovalComponent } from './Pages/Hire/GSEApproval/gseapproval.component';
import { ApprovalsComponent } from './Pages/Hire/GSEMaster/Approvals/approvals.component';
import { DamageModuleComponent } from './Pages/Hire/DamageModule/damage-module.component';
import { HireOutComponent } from './Pages/Hire/HireOut/hire-out.component';
import { HireoutListComponent } from './Pages/Hire/HireOut/hireoutList/hireout-list.component';
import { WeightReportComponent } from './Pages/Export/Reports/WeightReport/weight-report.component';
import { HireoutDashboardComponent } from './Pages/Hire/HireOut/DashBoard/hireout-dashboard.component';

const routes: Routes = [

  {
    path: '', component: LayoutComponent, canActivate: [Auth], children: [
      { path: 'Dashboard', component: DashBoardComponent },
      {
        path: 'Admin', component: AdminAreaComponent, children: [
          { path: 'Shipper', component: ShipperComponent },
          { path: 'GroupRoles', component: GroupRolesComponent },
          { path: 'Consignee', component: ConsigneeComponent },
          { path: 'AgentType', component: AgentTypeComponent },
          { path: 'Agents', component: AgentsComponent },
          { path: 'UDM Master', component: UdmMasterComponent },
          { path: 'AssignRoles', component: AssignRolesComponent },
          { path: 'Commidity', component: CommodityComponent },
          { path: 'Vehicles', component: VehiclesComponent },
          { path: 'Forwader', component: ForwaderComponent },
          { path: 'NatureOfGoods', component: NatureOfGoodsComponent },
          { path: 'AirLines', component: AirLinesComponent },
          { path: 'NoticeType', component: NoticeTypesComponent },
          { path: 'ULDTypes', component: ULDTypesComponent },
          { path: 'CreateBuildUP/:id', component: BuildUpComponent },
          { path: 'Email', component: EmailComponent },
          { path: 'EmailModule', component: EmailModuleComponent },
          { path: 'Notify', component: NotifyComponent },
          { path: 'ContourType', component: ContourTypeComponent },
          { path: 'AircraftTypes', component: AircraftTypesComponent },
          { path: 'DollyDetail', component: DollyDetailComponent },
          { path: 'Agency', component: AgencyComponent },
          { path: 'AircarftCat', component: AirCraftCatComponent },
          { path: 'gseCategory', component: GseCatComponent },



        ]
      },
      {
        path: 'Export', component: ExportComponent, children: [
          { path: 'Acceptance', component: AcceptanceComponent },
          { path: 'Acceptance/:id', component: AcceptanceComponent },
          { path: 'Flights', component: FlightsComponent },
          { path: 'Examination', component: ExaminationComponent },
          { path: 'Scanning', component: ScanningComponent },
          { path: 'Manifest', component: ManifestComponent },
          { path: 'BuildUp', component: BuildUpComponent },
          { path: 'DepartModule', component: DeptModuleComponent },
          { path: 'DangerGoods', component: DangerGoodsComponent },

        ]
      },
      {
        path: 'Reports', component: ExportComponent, children: [
          { path: 'AcceptanceReport', component: AcceptanceReportComponent },
          { path: 'weightReport', component: WeightReportComponent },

        ]
      },
      {
        path: 'Hire', component: ExportComponent, children: [
          { path: 'HireIn', component: HireinComponent },
          { path: 'SearchHireIn', component: HireInSearchComponent },
          { path: 'HireInDetail/:id', component: HireinComponent },
          { path: 'DashBoard', component: HireDashBoardComponent },
          { path: 'Test', component: TestingComponent },
          { path: 'NewGSEMaster', component: AddEditMasterComponent },
          { path: 'NewGSEMaster', component: AddEditMasterComponent },
          { path: 'NewGSEMaster/:id', component: AddEditMasterComponent },
          { path: 'gseReport', component: GseReportComponent },
          { path: 'UOM', component: UOMComponent },
          { path: 'Manufacturer', component: ManufacturerComponent },
          { path: 'Approval', component: ApprovalsComponent },
          { path: 'GSEModule', component: GSEModuleComponent },
          { path: 'GSEApproval', component: GSEApprovalComponent },
          { path: 'DamageModule', component: DamageModuleComponent },
          { path: 'HireOut', component: HireOutComponent },
          { path: 'HireoutList', component: HireoutListComponent },
          { path: 'HireOut/:id', component: HireOutComponent },
          { path: 'hireoutDashboard', component: HireoutDashboardComponent },
          
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
  { path: 'changePassword', component: ChangePasswordComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
