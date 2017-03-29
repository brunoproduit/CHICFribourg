import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { BlePage } from "../ble/ble";
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public devices; // list of devices
  public isScanning;
  public test;


  constructor(public navCtrl: NavController, public ble: BLE) {
    this.navCtrl = navCtrl;
    this.isScanning = false;
    this.test = ""
  }

  startScanning() {
    console.log("## Scanning Started ##");
    this.devices = [];
    console.log("## STATE DEVICE VARIABLE ## " + JSON.stringify(this.devices))
    this.isScanning = true;
    this.ble.startScan([]).subscribe(device => {
      console.log("## DEVICE FOUND ##" + JSON.stringify(device));
      this.devices.push(device);
      this.test = this.pushAndRefresh(this.test);
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
  pushAndRefresh(text){
   return text += "A";
  }
}
