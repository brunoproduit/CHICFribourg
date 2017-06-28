//Import of libraries
import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { BlePage } from "../ble/ble";
import { Http, Headers } from '@angular/http';
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
  public ValueOf5; //value of the total amount of the coin 5
  public ValueOf2; //value of the total amount of the coin 2
  public ValueOf1; //value of the total amount of the coin 1
  public ValueOf50c; //value of the total amount of the coin 50 ct
  public ValueOf20c; //value of the total amount of the coin 20 ct
  public ValueOf10c; //value of the total amount of the coin 10 ct
  public CoinsData;


  /*
    Constructor, we give name to the component we need from the imported library to use them in our code
    We can set local variable here, if necessary
  */
  constructor(public navCtrl: NavController, public ble: BLE, public http: Http, private zone: NgZone) {
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

  /*

  doGet(){
    this.http.get('https://chic.tic.heia-fr.ch/peggy').map(res => res.json()).subscribe(data => {
        this.CoinsData = data[0];
        this.ValueOf5 = this.CoinsData.coin5;
        this.ValueOf2 = this.CoinsData.coin2;
        this.ValueOf1 = this.CoinsData.coin1;
        this.ValueOf50c = this.CoinsData.coin50c;
        this.ValueOf20c = this.CoinsData.coin20c;
        this.ValueOf10c = this.CoinsData.coin10c;
      }
    );

}*/
  /*
   This function use the HTTP library
   This function will put data to the web server at the address mentioned. the web server needs a Json, so the format send
   is in Json. The format is put in the header of the request HTTP, and the parameter in the body.


  doPut(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let body = {
      "uuid": "cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1",
      "coin5": 2,
      "coin2": 0,
      "coin1": 0,
      "coin50c": 0,
      "coin20c": 0,
      "coin10c": 0
    };
    this.http.put('https://chic.tic.heia-fr.ch/peggy', JSON.stringify(body), {headers: headers})
      .map(res => res.json())
      .subscribe(data =>{
        console.log(JSON.stringify(data));
        this.doGet();
      });
  }*/

}
