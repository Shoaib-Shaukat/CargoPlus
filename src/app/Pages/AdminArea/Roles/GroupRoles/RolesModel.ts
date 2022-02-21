export class requestGroups {
    GroupId: number;
    GroupName: string;
}
export class responseGroups {
    GroupId: number;
    GroupName: string;
}
export class UserGroupRolesRequestModel {
    constructor(){
        this.AssignedRoles = [];
    }
    public GroupId: number;
    public AssignedRoles: GroupRoles[];
}
export class GroupRoles {
    public RoleID: number;
    public RoleName: string;
}
export class RoleAssignModel {
    public selectedRoles: RolesRequestModel[];
    public selectedGroup: any;
}
export class RolesRequestModel {
    public RoleID: number;
    public RoleName: string = "";
    public CreatedBy: number;
    public ModifiedBy: number;
}
export class UserGroupRolesModel {
    public GroupRoleID: number;
    public UserGroupId: any;
    public UserGroup: string;
    public RoleID: any;
    public RoleName: string;
    public UserID: any;
    public UserName: string;
}
export class UserValidationRequestModel {
    public UserName: string;
    public Token: string;
    public ID: number;
    public UserID : number;
    public RoleID : number;
    public UserGroupId : number;
  }