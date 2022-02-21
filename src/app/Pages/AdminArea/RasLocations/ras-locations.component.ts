import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../Services/API/api.service';
import { DataTableDirective } from 'angular-datatables';
import { requestLocation } from '../Models/rasLocation'
import { GvarService } from '../../../Services/Globel/gvar.service'
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-ras-locations',
  templateUrl: './ras-locations.component.html',
  styleUrls: ['./ras-locations.component.css']
})
export class RasLocationsComponent implements OnInit {
  requestLocation: requestLocation;
  LocationForm: FormGroup;
  validForm: boolean = false;

  constructor(public API: ApiService, public GV: GvarService, private router: Router) {
    this.requestLocation = new requestLocation();
  }
  InitializeForm(): any {
    this.LocationForm = new FormGroup({
      locationName: new FormControl('', [Validators.required]),
      ShortID: new FormControl('', [Validators.required]),
      connectionString: new FormControl('', [Validators.required]),
      dbName: new FormControl('', [Validators.required]),
      userID: new FormControl('', [Validators.required]),
      dbPWD: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
  }
  saveLocation() {
    if (this.LocationForm.valid) {
      this.FormValidation();
      if (this.validForm == true) {
        this.requestLocation.locationName = this.LocationForm.get('locationName').value;
        this.requestLocation.ShortID = this.LocationForm.get('ShortID').value;
        this.requestLocation.connectionString = this.LocationForm.get('connectionString').value;
        this.requestLocation.dbName = this.LocationForm.get('dbName').value;
        this.requestLocation.userID = this.LocationForm.get('userID').value;
        this.requestLocation.dbPWD = this.LocationForm.get('dbPWD').value;
        this.API.PostData('/Locations/saveLocations', this.requestLocation).subscribe(c => {
          if (c != null) {
            Swal.fire({
              text: 'Location has been saved successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.router.navigate(['/Dashboard']);
          }
        },
          error => {
            Swal.fire({
              text: error.error.Message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          })
      }
    }
  }
  FormValidation() {
    if (this.LocationForm.controls.locationName.value == "" || this.LocationForm.controls.locationName.value == null) {
      Swal.fire({
        text: "Please enter location Name.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.LocationForm.controls.ShortID.value == "" || this.LocationForm.controls.ShortID.value == null) {
      Swal.fire({
        text: "Please enter ShortID.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.LocationForm.controls.connectionString.value == "" || this.LocationForm.controls.connectionString.value == null) {
      Swal.fire({
        text: "Please enter connectionString.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.LocationForm.controls.dbName.value == "" || this.LocationForm.controls.dbName.value == null) {
      Swal.fire({
        text: "Please enter data base Name.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.LocationForm.controls.userID.value == "" || this.LocationForm.controls.userID.value == null) {
      Swal.fire({
        text: "Please enter database user.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.LocationForm.controls.dbPWD.value == "" || this.LocationForm.controls.dbPWD.value == null) {
      Swal.fire({
        text: "Please enter user password.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }
}
