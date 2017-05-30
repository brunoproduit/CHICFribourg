//Import of libraries
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { BlePage } from "../ble/ble";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Define the component, we could write HTML here,
  but it's smoother to create a real page HTML and link it here with the code of this page
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

/*
  Main Class of the home page
*/
export class HomePage {

  public devices; // list of devices
  public isScanning; //set a true if scanning is on


  /*
    Constructor, we give name to the component we need from the imported library to use them in our code
    We can set local variable here, if necessary
  */
  constructor(public navCtrl: NavController, public ble: BLE, public http: Http) {
    this.navCtrl = navCtrl;
    this.isScanning = false;
  }

  /*
    Function called when the button Scan is pressed.
    Function that will launch the function startScan from the BLE Library
    The scan last for 4000 ms -> 4 secondes
    Every device found is put in a array
   */
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

  /*
    Function called when the button connect on a device found is pressed
    This function will open the page BlePage with the variable device which contains the information of the device
    we are connecting to.
  */
  connectToDevice(device) {
    console.log('Connect To Device');
    console.log(JSON.stringify(device))
    this.navCtrl.push(BlePage, {device: device});
  };
}
