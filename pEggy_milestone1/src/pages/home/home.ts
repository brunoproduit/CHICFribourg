import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { BlePage } from "../ble/ble";
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public devices; // list of devices
  public isScanning;
  public getValue;


  constructor(public navCtrl: NavController, public ble: BLE, public http: Http) {
    this.navCtrl = navCtrl;
    this.isScanning = false;
    this.getValue;
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
    }, 4000);
  }
  connectToDevice(device) {
    console.log('Connect To Device');
    console.log(JSON.stringify(device))
    this.navCtrl.push(BlePage, {device: device});
  };

  testGet(){
    this.http.get('https://chic.tic.heia-fr.ch/coins/5').map(res => res.json()).subscribe(data =>{
      console.log(data.name);
      console.log(data.amount);
      this.getValue = data.amount;
    })
  }

  testPost(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let body = {
      "name": 5,
      "amount" : 1
    };
    this.http.post('https://chic.tic.heia-fr.ch/coins', JSON.stringify(body), {headers: headers})
      .map(res => res.json())
      .subscribe(data =>{
        console.log(JSON.stringify(data));
      });
    this.testGet();
  }

  testDelete(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let body = {
      "name": 5,
      "amount" : -1
    };
    this.http.post('https://chic.tic.heia-fr.ch/coins', JSON.stringify(body), {headers: headers})
      .map(res => res.json())
      .subscribe(data =>{
        console.log(JSON.stringify(data));
      });
    this.testGet();
  }
}
