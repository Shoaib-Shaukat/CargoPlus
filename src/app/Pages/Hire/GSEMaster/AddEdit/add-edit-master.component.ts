import { Renderer2, Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from '../../../../Services/API/api.service';
import { ActivatedRoute } from "@angular/router";
import { responseAirLines } from '../../../AdminArea/Models/airLines';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GvarService } from '../../../../Services/Globel/gvar.service'
import { DatePipe } from '@angular/common'
import { aircraftCategoryResponse, aircraftTypesResponse, requestFlight, responseFlight } from '../../../Export/Flights/Model/flightsModel';
import { gseMasterRequestModel, gseMasterResponse } from '../gseMasterModel';
import { gseCateRequestModel } from '../../../AdminArea/GSECat/gseCatModel'
import { stationResponse } from "../../Hirein/hireModel";
import { UOMRequest } from '../../GSEMaster/UOM/UOMModel';
import { ManufacturerRequest } from '..//Manufacturer/manufactuerModel'

@Component({
  selector: 'app-add-edit-master',
  templateUrl: './add-edit-master.component.html',
  styleUrls: ['./add-edit-master.component.css']
})
export class AddEditMasterComponent implements OnInit {
  editMode: boolean = false;
  id: number;
  private sub: any;
  images: string[] = [];
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  defaultManufacturer: ManufacturerRequest;
  ManufacturerResponse: ManufacturerRequest[];
  UOMResponse: UOMRequest[];
  defaultUOM: UOMRequest;



  shownewButton: boolean = true;
  showeditButton: boolean = false;
  showSaveButton: boolean = false;
  showCancelButton: boolean = false;
  showData: boolean = true;
  addNewData: boolean = false;

  stationResponse: stationResponse[];
  defaultStation: stationResponse;

  gseCateResponseModel: gseCateRequestModel[];
  defaultGSECat: gseCateRequestModel;

  validForm: boolean = false;
  gseMasterForm: FormGroup;
  constructor(private route: ActivatedRoute, private renderer: Renderer2, public datepipe: DatePipe, public API: ApiService, public GV: GvarService) {
    this.gseCateResponseModel = [];
    this.InitializeForm();
    this.ManufacturerResponse = [];
    this.defaultManufacturer = new ManufacturerRequest();
    this.UOMResponse = [];
    this.defaultUOM = new UOMRequest();
    this.stationResponse = [];
    this.defaultStation = new stationResponse();
    this.defaultGSECat = new gseCateRequestModel();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      if (this.id != null && this.id > 0) {
        this.gseMasterForm.controls.gseMasterID.setValue(this.id);
        this.gseMasterForm.controls.airportID.setValue(localStorage.getItem('airportID'));
        this.editMode = true;
        this.getGSEMater();
      }
    });
  }

  ngOnInit(): void {
   
    this.getCatData();
    this.getStations();
    this.getUOMData();
    this.getManufacturerData();
    this.showhide('New');
  }

  InitializeForm(): any {
    this.gseMasterForm = new FormGroup({
      gseMasterID: new FormControl(""),
      airportID: new FormControl(""),
      rasID: new FormControl(""),
      gsecatID: new FormControl(""),
      YOM: new FormControl(""),
      uomID: new FormControl(""),
      inductionDate: new FormControl(""),
      Manufacturer: new FormControl(""),
      model: new FormControl(""),
      chassisNo: new FormControl(""),
      engineNo: new FormControl(""),
      uomValue: new FormControl(""),
      isPower: new FormControl(""),
      powerDetail: new FormControl(""),
      gStatus: new FormControl(""),
      remarks: new FormControl(""),
      gseImage: new FormControl(""),
      oemID: new FormControl(""),
      file: new FormControl(""),
    });
  }

  get f() { return this.gseMasterForm.controls; }

  validations() {
    if (this.gseMasterForm.controls.airportID.value == "" || this.gseMasterForm.controls.airportID.value == null) {
      Swal.fire({
        text: "Select Station.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.rasID.value == "" || this.gseMasterForm.controls.rasID.value == null) {
      Swal.fire({
        text: "Enter Menzies-Ras ID.",
        icon: 'error',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          const element = this.renderer.selectRootElement('#rasID');
          setTimeout(() => element.focus(), 10);
        }
      })
      this.validForm = false;

      return;
    }
    if (this.gseMasterForm.controls.gsecatID.value == "" || this.gseMasterForm.controls.gsecatID.value == null) {
      Swal.fire({
        text: "Enter GSE Category.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.oemID.value == "" || this.gseMasterForm.controls.oemID.value == 0) {
      Swal.fire({
        text: "Enter Manufacturer Detail.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.YOM.value == "" || this.gseMasterForm.controls.YOM.value == null) {
      Swal.fire({
        text: "Enter year of manufacturer.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.inductionDate.value == "" || this.gseMasterForm.controls.inductionDate.value == null) {
      Swal.fire({
        text: "Enter induction date.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.model.value == "" || this.gseMasterForm.controls.model.value == null) {
      Swal.fire({
        text: "Enter model number.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.isPower.value == "" || this.gseMasterForm.controls.isPower.value == null) {
      Swal.fire({
        text: "Select Power/Non Power.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.chassisNo.value == "" || this.gseMasterForm.controls.chassisNo.value == null) {
      Swal.fire({
        text: "Enter chassis number.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.engineNo.value == "" || this.gseMasterForm.controls.engineNo.value == null) {
      Swal.fire({
        text: "Enter engine number.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.uomValue.value == "" || this.gseMasterForm.controls.uomValue.value == null) {
      Swal.fire({
        text: "Enter power capacity.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.uomID.value == "" || this.gseMasterForm.controls.uomID.value == 0) {
      Swal.fire({
        text: "Select unit of measure.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.gStatus.value == "" || this.gseMasterForm.controls.gStatus.value == null) {
      Swal.fire({
        text: "Enter Status.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    if (this.gseMasterForm.controls.gsecatID.value == "" || this.gseMasterForm.controls.gsecatID.value == null) {
      Swal.fire({
        text: "Enter.",
        icon: 'error',
        confirmButtonText: 'OK'
      });
      this.validForm = false;
      return;
    }
    this.validForm = true;
  }

  editCategory(p) {
    this.gseMasterForm.patchValue(p);
  }

  getCatData() {
    this.API.getdata('/Setups/getGSECat').subscribe(c => {
      if (c != null) {
        this.gseCateResponseModel = c;
        this.defaultGSECat.gsecatID = 0;
        this.defaultGSECat.gseCategory = "Select";
        this.gseCateResponseModel.push(this.defaultGSECat);
        if (!this.editMode)
          this.gseMasterForm.controls.gsecatID.setValue(0);
      }
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }
  getStations() {
    this.API.getdata("/Generic/getStations").subscribe(
      (c) => {
        if (c != null) {
          this.stationResponse = c;
          this.defaultStation.airportID = 0;
          this.defaultStation.StationName = "Select";
          this.stationResponse.push(this.defaultStation);
          if (!this.editMode)
            this.gseMasterForm.controls.airportID.setValue(0);
        }
      },
      (error) => {
        Swal.fire({
          text: error.error.Message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }
  showhide(callfrm: string) {
    debugger
    if (callfrm == "New") {
      this.addNewData = true;
      this.showData = false;
      this.showCancelButton = true;
      this.showSaveButton = true;
      this.showeditButton = false;
      this.shownewButton = false;
      this.resetGSEMaster();
    }
    if (callfrm == "Cancel") {
      this.addNewData = false;
      this.showData = true;
      this.showCancelButton = false;
      this.showSaveButton = false;
      this.showeditButton = false;
      this.shownewButton = true;
      this.resetGSEMaster();
    }
    if (callfrm == "Edit") {
      debugger
      this.addNewData = true;
      this.showData = false;
      this.showCancelButton = true;
      this.showSaveButton = false;
      this.showeditButton = true;
      this.shownewButton = false;
    }
  }
  resetGSEMaster() {
    this.gseMasterForm.reset();
    this.gseMasterForm.controls.airportID.setValue(0);
    this.gseMasterForm.controls.gsecatID.setValue(0);
    this.gseMasterForm.controls.oemID.setValue(0);
    this.gseMasterForm.controls.uomID.setValue(0);
  }
  saveGSEMaster() {
    this.validations();
    if (this.validForm == true) {
      this.API.PostData('/Setups/SaveGSEMaster', this.gseMasterForm.value).subscribe(c => {
        if (c != null) {
          Swal.fire({
            text: "GSE-Master Saved Successfully",
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
        this.gseMasterForm.controls.gseMasterID.setValue(c.gseMasterID);
        this.showhide('Edit');
        this.getGSEMater();
      },
        error => {
          Swal.fire({
            text: error.error.Message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
  }
  getGSEMater() {
    let body = {
      gseMasterID: this.gseMasterForm.controls.gseMasterID.value,
      airportID: this.gseMasterForm.controls.airportID.value,
    }
    this.API.PostData('/Setups/getGSESingleRecord', body).subscribe(c => {
      if (c != null) {
        debugger
        this.gseMasterForm.patchValue(c);
        let inductionDate =this.datepipe.transform(c.inductionDate, 'dd-MMM-yyyy');
       // this.gseMasterForm.controls.inductionDate.setValue(inductionDate);
        this.gseMasterForm.controls.inductionDate.setValue(c.inductionDate.substring(0, c.inductionDate.length - 9));
        this.showhide('Edit');
      }
    },
      (error) => {
        Swal.fire({
          text: error.error.Message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }
  getUOMData() {
    this.API.getdata('/Setups/getUOM?showAll=false').subscribe(c => {
      if (c != null) {
        this.UOMResponse = c;
        this.defaultUOM.uomID = 0;
        this.defaultUOM.UOMName = "Select";
        this.UOMResponse.push(this.defaultUOM);
        if (!this.editMode)
          this.gseMasterForm.controls.uomID.setValue(0);
      }
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }

  getManufacturerData() {
    this.API.getdata('/Setups/getManufacturer?showAll=true').subscribe(c => {
      if (c != null) {
        this.ManufacturerResponse = c;
        this.defaultManufacturer.oemID = 0;
        this.defaultManufacturer.oemDetail = "Select";
        this.ManufacturerResponse.push(this.defaultManufacturer);
        if (!this.editMode)
          this.gseMasterForm.controls.oemID.setValue(0);
      }
    },
      error => {
        Swal.fire({
          text: error.error.Message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          // Push Base64 string
          this.images.push(event.target.result);
          //  this.patchValues();
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  removeImage(url: any) {
    console.log(this.images, url);
    debugger
    this.images = this.images.filter(img => (img != url));
    // this.patchValues();
  }
}

