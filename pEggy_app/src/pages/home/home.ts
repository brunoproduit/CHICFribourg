import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { BlePage } from "../ble/ble";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public devices; // list of devices
  public isScanning;
  public user;
  public user2;


  constructor(public navCtrl: NavController, public ble: BLE, private http: Http) {
    this.navCtrl = navCtrl;
    this.isScanning = false;
    this.user = "dad";
    this.user2 = "mom"
  }

  startScanning() {
    console.log("## Scanning Started ##");
    this.devices = [];
    console.log("## STATE DEVICE VARIABLE ## " + JSON.stringify(this.devices))
    this.isScanning = true;
    this.ble.startScan([]).subscribe(device => {
      console.log("## DEVICE FOUND ##" + JSON.stringify(device));
      this.devices.push(device);
    });
    setTimeout(() => {
      this.ble.stopScan().then(() => {
        console.log("## Scanning has stopped ## ");
        console.log("## DEVICES SCANNED ## " + JSON.stringify(this.devices))
        this.isScanning = false;
      });
    }, 5000);
  }
  connectToDevice(device) {
    console.log('Connect To Device');
    console.log(JSON.stringify(device))
    this.navCtrl.push(BlePage, {device: device});
  };

  searchUser(UserName) {
    var url = 'https://chic.tic.heia-fr.ch/users/' + encodeURI(UserName);
    //var response = this.http.get(url).map(res => res.json());
    //var response = this.http.get(url).map(res => res.json());
   this.http.get(url).map(res => res.json()).subscribe(data =>{
      console.log(data);
    });

  };
}
