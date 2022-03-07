import { Component, OnInit, ViewChild, ViewChildren, ElementRef, ChangeDetectorRef, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../../Services/API/api.service'
import { Subject } from 'rxjs';
import { GenericModel, projectModelList, EmployeeInfoModal, GroupRequestModel, RoleAssignModel, UserGroupRolesModel, GroupRoles } from './AssignRolesModel';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgForm } from '@angular/forms';
import 'datatables.net';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-assign-roles',
  templateUrl: './assign-roles.component.html',
  styleUrls: ['./assign-roles.component.css']
})
export class AssignRolesComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions0: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject();

  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject();


  empForm: FormGroup;
  dataTable: any;
  viewRolesdtTrigger: Subject<any> = new Subject();
  dtTrigger: Subject<any> = new Subject();
  GenericModel: GenericModel;
  tempArray: projectModelList;
  default: string = 'All';
  defaultProject: any;
  // Employee Search Variables
  PROJECTID: number;
  empID: number;
  DEPTID: number;
  groupName: string;
  DESIGNATION: string;
  employeeName: string;
  EmployeeInfoModal: EmployeeInfoModal[];
  systemGroupModle: any[];
  selectedItems = [];
  GroupResponseModel: GroupRoles[];
  ViewGroupResponseModel: GroupRoles[];
  assignModel: RoleAssignModel;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings2: IDropdownSettings = {};
  public assignGroupsModel: GroupRequestModel = new GroupRequestModel();
  public groupAssignedRoleList: Array<UserGroupRolesModel> = new Array<UserGroupRolesModel>();
  public temp_var: Object = false;
  @ViewChildren('closeAssignGroupModal') closeAssignGroupModal: ElementRef;
  showAssignOnBehalf: boolean = false;

  userID: number;
  ProjectName: string;
  selectedDep = [];
  ProjectList: any[];
  DepartmentList: any[];
  dropdownSettingsDept: IDropdownSettings = {};
  public temp_var1: Object = false;
  constructor(private api: ApiService, private chRef: ChangeDetectorRef) {
    this.GenericModel = new GenericModel();
    this.tempArray = new projectModelList();
    this.EmployeeInfoModal = [];
    this.selectedItems = [];
    this.GroupResponseModel = [];
    this.ViewGroupResponseModel = [];
    this.assignModel = new RoleAssignModel();
    this.assignGroupsModel = new GroupRequestModel();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'GroupId',
      textField: 'GroupName',
      selectAllText: 'Select All Groups',
      unSelectAllText: 'UnSelect All Groups',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }

    /*
    Assign dept for on behalf
    */
    this.GenericModel = new GenericModel();
    this.tempArray = new projectModelList();
    //this.fillProjectCombo();
    this.EmployeeInfoModal = [];
  }
  ngOnInit(): void {
    window.scroll(0,0);
    this.getSystemUsers();
    this.SearchEmp();
  }
  getSystemUsers() {
    this.api.getdata('/ManageGroup/GetGroupList').subscribe(
      data => {
        if (data != null) {
          this.systemGroupModle = data;
        }
        else {
        }
      },
      error => {
        Swal.fire({
          title: 'ERROR!',
          text: 'An error occured',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  SearchEmp() {
    this.api.getdata('/ManageGroup/GetEmployeeInfo').subscribe(data => {
      if (data != null) {
        if (this.temp_var) {
          this.chRef.detectChanges();
          this.dataTable.destroy();
        }
        this.chRef.detectChanges();
        this.EmployeeInfoModal = data
        this.temp_var = true;
        this.chRef.detectChanges();
        const table: any = $('table');
        this.dataTable = table.DataTable()
      }
    }, error => {
      Swal.fire({
        text: error.error.Message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }
  AssignGroup(grp) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'GroupId',
      textField: 'GroupName',
      selectAllText: 'Select All Groups',
      unSelectAllText: 'UnSelect All Groups',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
    this.assignModel.selectedGroup = grp;
    this.getGroupAssignedRoles(grp.empID).then(roles => {
      this.groupAssignedRoleList = roles;

      this.selectedItems = roles;
      this.assignGroupsModel.AssignedGroups = roles;
    });
    this.assignGroupsModel.EID = grp.empID;
    this.employeeName = grp.EmployeeName

  }
  // ViewGroup(grp) {

  // }
  onItemSelect(item: any) {
    this.assignGroupsModel.AssignedGroups.push(item);
  }
  onItemDeSelect(item: any) {
    this.assignGroupsModel.AssignedGroups
      .splice(this.assignGroupsModel.AssignedGroups
        .findIndex(ele => ele.GroupId == item.GroupId), 1);
  }
  onItemDeSelectAll(item: any) {
    this.assignGroupsModel.AssignedGroups = [];
  }
  onSelectAll(items: any) {
    this.assignGroupsModel.AssignedGroups = items;
  }
  viewGroupToAssignRole(grp: any) {

  }

  getGroupAssignedRoles(empID) {
    return new Promise<any>(resolve => {
      this.api.getdata('/ManageGroup/ViewAssignedGroups?empID=' + empID).subscribe(
        data => {
          if (data != null) {
            this.GroupResponseModel = data;
            resolve(data);
          }
          else {
          }
        },
        error => {
          Swal.fire({
            title: 'ERROR!',
            text: 'An error occured',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    });
  }
  GroupAssignedRolesView(empID) {
    return new Promise<any>(resolve => {
      this.api.getdata('/ManageGroup/ViewAssignedGroups?empID=' + empID).subscribe(
        data => {
          if (data != null) {
            this.destroyDT(1, false).then(destroyed => {
              this.ViewGroupResponseModel = data;
              this.dtTrigger1.next();
            });
          }
        },
        error => {
          Swal.fire({
            title: 'ERROR!',
            text: 'An error occured',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    });
  }
  assignNewRolesToGroup(roleAssignForm: NgForm) {
    this.api.PostData('/ManageGroup/AssignGroup ', this.assignGroupsModel).subscribe(
      data => {
        if (!data.payload) {
          Swal.fire({
            title: 'ERROR!',
            text: 'An error occured, Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
        //this.getUpdatedRoles();
        this.closeAssignGroupModal["first"].nativeElement.click();
        Swal.fire("Assigned group updated successfully");
      },
      error => {
        this.closeAssignGroupModal["first"].nativeElement.click();
        Swal.fire({
          title: 'ERROR!',
          text: 'An error occured',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      });
  }
  viewGroupToAssign(grp: any) {
    this.GroupAssignedRolesView(grp.empID).then(roles => {
    }).then(() => {
    });
  }

  SearchEmployee() {
    this.api.getdata('/Generic/GetEmployeeInfo?PROJECTID=' + this.PROJECTID + '&empID=' + this.empID + '&DEPTID=' + this.DEPTID + '&DESIGNATION=' + this.DESIGNATION + '').subscribe(data => {
      if (data != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.EmployeeInfoModal = data
          this.dtTrigger0.next();
        });

      }
    }, error => {
      Swal.fire({
        title: 'ERROR!',
        text: error.error.Message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }
  getProjectValue2(phaseId) {
    this.api.getdata('/Generic/GetProjectDepartments?PROJECTID=' + phaseId + '').subscribe(data => {
      if (data != null) {
        this.GenericModel.departmentModelList = data
      }
    }, error => {
      Swal.fire({
        title: 'ERROR!',
        text: error.error.Message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }


  ViewGroup(grp) {

  }
  viewGroupToAssignRole2(grp: any) {

  }
  getDept(project) {
    this.getAllDepartments(project.ProjectId);
    this.ProjectName = project.ProjectName;
    this.GetDepforDropDown(project.ProjectId, this.userID).then(projects => {
    }).then(() => {
    });
  }
  GetDepforDropDown(projectID, userID) {
    return new Promise<any>(resolve => {
      this.api.getdata('/ManageGroup/GetAssignedDepartment?ProjectId=' + projectID + '&UserId=' + userID).subscribe(
        data => {
          if (data != null) {
            resolve(data);
          }
        },
        error => {
          Swal.fire({
            title: 'ERROR!',
            text: 'An error occured',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    });
  }
  getAllDepartments(projectID) {
    this.api.getdata('/Generic/GetProjectDepartments?PROJECTID=' + projectID + '').subscribe(data => {
      if (data != null) {
        this.DepartmentList = data
      }
    }, error => {
      Swal.fire({
        title: 'ERROR!',
        text: error.error.Message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }
  AssignDepartmentView(grp) {
    this.dropdownSettingsDept = {
      singleSelection: false,
      idField: 'DepartmentId',
      textField: 'DepartmentName',
      selectAllText: 'Select all departments',
      unSelectAllText: 'UnSelect all departments',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
    this.getAllDepartments(grp.ProjectId);
    this.ProjectName = grp.ProjectName;
    this.employeeName = grp.EmployeeName

  }
  viewAssignedDept() {
    this.api.getdata('/Generic/GetProjectDepartments?PROJECTID=' + this.userID + '').subscribe(data => {
      if (data != null) {
        this.GenericModel.departmentModelList = data
      }
    }, error => {
      Swal.fire({
        title: 'ERROR!',
        text: error.error.Message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  destroyDT = (tableIndex, clearData): Promise<boolean> => {
    return new Promise((resolve) => {
      this.datatableElement.forEach((dtElement: DataTableDirective, index) => {

        if (index == tableIndex) {
          if (dtElement.dtInstance) {

            if (tableIndex == 0) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });

            }
            else if (tableIndex == 1) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });

            } else if (tableIndex == 2) {
              dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                if (clearData) {
                  dtInstance.clear();
                }
                dtInstance.destroy();
                resolve(true);
              });

            }
          }
          else {
            resolve(true);
          }

        }
      });
    });
  };
  rerender(tableIndex): void {

    this.datatableElement.forEach((dtElement: DataTableDirective, index) => {

      if (index == tableIndex) {
        if (dtElement.dtInstance) {

          if (tableIndex == 0) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // dtInstance.clear();
              // dtInstance.destroy();
              this.dtTrigger0.next();
            });

          }
          else if (tableIndex == 1) {
            dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              //dtInstance.clear();
              dtInstance.destroy();
              this.dtTrigger1.next();
            });

          }
        }
        else {
          if (tableIndex == 0) {
            this.dtTrigger0.next();
          }
          else if (tableIndex == 1) {
            this.dtTrigger1.next();
          }
        }
      }
    });
  }
  ResetPasswordtoDefault(empID: string) {
    this.api.getdata('/Profile/ResetPasswordtoDefault?empID=' + empID).subscribe(data => {
      if (data != null) {
        Swal.fire("Password set to default.").then(x => {
        });
      }
    },
      error => {
        Swal.fire({
          text: 'An error occured',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
      });
  }
}

