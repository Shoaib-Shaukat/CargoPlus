export class GenericModel {
    projectModelList:projectModelList[];
    departmentModelList:departmentModelList[];
    designationModelList:designationModelList[];
    EmployeeModelList : EmployeeInfoModal[];
    constructor(){
        this.projectModelList=[];
        this.departmentModelList=[];
        this.designationModelList=[];
        this.EmployeeModelList = [];
    }
}
export class projectModelList {
    ProjectId:number;
    ProjectName:string;
}
class departmentModelList {
    DepartmentId:number;
    DepartmentName:string;
}
class designationModelList {
    DesignationId:number;
    DesignationName:string;
}
export class EmployeeInfoModal{
    empID:string;
    EmployeeName:string;
    DesignationTitle:string;
    DepartmentName:string;
}

export class BlockDetailModel
{
    BlockedBy: string;
    Remarks: string;
    BlockDate: Date;
}
export class GroupRequestModel {
    constructor(){
        this.AssignedGroups = [];
    }
    public EID: number;
    public AssignedGroups: GroupRoles[];
}
export class GroupRoles {
    public GroupId: number;
    public GroupName: string;
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
