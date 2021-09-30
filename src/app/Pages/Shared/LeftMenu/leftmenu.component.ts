import { Component, OnInit } from '@angular/core';
import {RolesRequestModel} from '../SharedModel/Roles'
import {GvarService} from '../../../Services/Globel/gvar.service'

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.css']
})
export class LeftmenuComponent implements OnInit {
  officialDutyOpen: boolean = false;
  private Roles: RolesRequestModel[]
  constructor(public GV:GvarService) { }

  ngOnInit(): void {
  }
  roleMatch(allowedRoles): boolean {
    var temp = (localStorage.getItem('userRoles'));
    if (temp == "undefined") {
      return false
    }
    this.Roles = JSON.parse(localStorage.getItem('userRoles'));
    for (var i = 0; i < this.Roles.length; i++) {
      var checkRole = this.Roles[i].RoleId
      if (allowedRoles == this.Roles[i].RoleId) {
        return true
      }
    }
    return false
  }
  get isAdmin() {
    return  this.roleMatch(2);
}
async showHideSubMenu(menuOrder) {
  if (menuOrder == 1) {
    //Aadmin Area
    this.officialDutyOpen = false;
  }
}
}
