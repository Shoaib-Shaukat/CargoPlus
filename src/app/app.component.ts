import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from './Services/ShareService/share.service';
import { BnNgIdleService } from 'bn-ng-idle';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HelpDesk';
  setSidemenuClass : boolean = false;
  constructor(private bnIdle: BnNgIdleService,router:Router,private share: ShareService){
    this.bnIdle.startWatching(3600).subscribe((res) => {
      if(res) {
        router.navigate(['/login']);
      }
    })
  }
  ngOnInit(): void {
    this.share.toggleSidemenu$.subscribe(message=>this.setSidemenuClass = message);
  }
}
