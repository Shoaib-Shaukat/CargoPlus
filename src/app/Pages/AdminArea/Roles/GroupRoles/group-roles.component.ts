import { Component, OnInit, ViewChild, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { requestGroups, UserGroupRolesRequestModel, RoleAssignModel, UserGroupRolesModel, UserValidationRequestModel } from './RolesModel'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ApiService } from '../../../../Services/API/api.service'
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-group-roles',
  templateUrl: './group-roles.component.html',
  styleUrls: ['./group-roles.component.css']
})
export class GroupRolesComponent implements OnInit {

  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;

  dtOptions0: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject();

  dtOptions1: DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject();

  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject();


  viewRolesdtTrigger: Subject<any> = new Subject();
  @ViewChildren('closeThisModal') closeThisModal: ElementRef;
  @ViewChildren('closeGroupModal') closeGroupModal: ElementRef;
  @ViewChildren('closeAssignGroupModal') closeAssignGroupModal: ElementRef;
  @ViewChildren('closeEditRoleModal') closeEditRoleModal: ElementRef;
  requestGroups: requestGroups;
  responseGroups: any = [];
  groupForm: FormGroup;
  groupName:string;
  assignModel: RoleAssignModel;
  canEditUserGroup: boolean;
  public systemRoleModel: any = [];
  public userGroupRolesAssignModel: UserGroupRolesRequestModel = new UserGroupRolesRequestModel();
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  public groupAssignedRoleList: Array<UserGroupRolesModel> = new Array<UserGroupRolesModel>();
  public defaultParameter: UserValidationRequestModel;
  constructor(private api: ApiService, private router: Router) {
    this.requestGroups = new requestGroups();
    this.assignModel = new RoleAssignModel();
    this.responseGroups = [];
    this.systemRoleModel = [];
    this.userGroupRolesAssignModel = new UserGroupRolesRequestModel();
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'RoleID',
      textField: 'RoleName',
      selectAllText: 'Select All Roles',
      unSelectAllText: 'UnSelect All Roles',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
    this.getSystemUsers();
  }
  ngOnInit(): void {
    this.InitializeForm();
  }
  InitializeForm(): any {
    this.groupForm = new FormGroup({
      groupName: new FormControl('', [Validators.required]),
    });
    this.getGroups();
  }
  saveGroup() {
  }
  viewGroupToEdit(grp: any) {
  }
  getGroups() {
    this.api.getdata('/ManageGroup/GetGroupList').subscribe(data => {
      if (data != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.responseGroups = data;
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
  getSystemUsers() {
    this.api.getdata('/ManageGroup/GetRolesList').subscribe(
      data => {
        if (data != null) {
            this.systemRoleModel = data;
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
  onItemSelect(item: any) {
    this.userGroupRolesAssignModel.AssignedRoles.push(item);
  }
  onItemDeSelect(item: any) {
    this.userGroupRolesAssignModel.AssignedRoles
      .splice(this.userGroupRolesAssignModel.AssignedRoles
        .findIndex(ele => ele.RoleID == item.RoleID), 1);
  }
  onSelectAll(items: any) {
    this.userGroupRolesAssignModel.AssignedRoles = items;
  }
  assignNewRolesToGroup(roleAssignForm: NgForm) {
    this.api.PostData('/ManageGroup/AssignGroupRole ', this.userGroupRolesAssignModel).subscribe(
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
        Swal.fire("Roles Updated Successfully");
      },
      error => {
        this.closeAssignGroupModal["first"].nativeElement.click();
        Swal.fire({
          title: 'ERROR!',
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      });
  }
  async getUpdatedRoles() {
    this.api.getdata('/GroupRoles/GetGroupRoles').subscribe(
      data => {
        if (data) {
          localStorage.setItem("roles", JSON.stringify(data));
        }
      },
      error => {
        console.log(error);
      });
  }
  viewGroupToAssignRole(grp: any) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'RoleID',
      textField: 'RoleName',
      selectAllText: 'Select All Roles',
      unSelectAllText: 'UnSelect All Roles',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
    this.assignModel.selectedGroup = grp;
    this.getGroupAssignedRoles(grp.GroupId).then(roles => {
      this.destroyDT(1, false).then(destroyed => {
        this.groupAssignedRoleList = roles;
        this.selectedItems = roles;
      this.userGroupRolesAssignModel.AssignedRoles = roles;
        this.dtTrigger1.next();
      });
      
    });
    this.userGroupRolesAssignModel.GroupId = grp.GroupId;
    this.groupName=grp.GroupName;
  }
  getGroupAssignedRoles(groupId) {
    return new Promise<any>(resolve => {
      this.api.getdata('/ManageGroup/GetGroupRoleList?GroupId=' + groupId).subscribe(
        data => {
          if (data != null) {
            this.destroyDT(1, false).then(destroyed => {
              resolve(data);
              this.dtTrigger1.next();
            });
           
          }
          else {
          }
        },
        error => {
          Swal.fire({
            title: 'ERROR!',
            text: error.error.Message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    });
  }
  viewGroupToAssign(grp: any) {
    this.getGroupAssignedRoles(grp.GroupId).then(roles => {
      this.groupAssignedRoleList = roles;
      this.selectedItems = roles;
    }).then(() => {
    });
  }
  ngOnDestroy(): void {
    this.viewRolesdtTrigger.unsubscribe();
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

            } 
          }
          else {
            resolve(true);
          }

        }
      });
    });
  };
}
