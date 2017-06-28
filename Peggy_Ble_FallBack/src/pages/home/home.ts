//Import of libraries
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import 'rxjs/add/operator/map';
import * as ble from "cordova-plugin-ble/ble.js";

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

  public static mDevice;
  public static deviceName = 'Nordic_Keyboard';
  public static deviceAddress = 'C2:27:CD:41:44:9E';
  public static deviceUUID = '00001812-0000-1000-8000-00805f9b34fb';
  public static serviceNameUUID = '0000180f-0000-1000-8000-00805f9b34fb';
  public static characNameUUID = '00002a19-0000-1000-8000-00805f9b34fb';
  public static service;
  public static charac;



  constructor(public navCtrl: NavController, public ble: BLE) {
    this.navCtrl = navCtrl;
  }

  findDevice(){

    this.disconnectDevice();

    this.searchForBondedDevice({
      deviceName: HomePage.deviceName,
      deviceUUID: HomePage.deviceUUID,
      serviceUUID: HomePage.serviceNameUUID,
      onFound: this.connectToDevice,
      onNotFound: this.scanForDevice,
    })

  }

  searchForBondedDevice(params){
    console.log('Searching for bonded device');

    ble.getBondedDevices(
      function(devices){
        console.log('Bonded devices: ' + JSON.stringify(devices));
        console.log('## TEST params.deviceName : '+ params.deviceName);
        for (var i in devices){
          var device = devices[i];
          if(device.name == params.deviceName){
          console.log('Found bonded device: ' + device.name);
            params.onFound(device);
            return;
          }
        }
        params.onNotFound()
      },
      function(error){
        params.onNotFound(error)
      },
      { serviceUUID : params.serviceUUID})
  }

  disconnectDevice(){

    ble.stopScan();

  }

  scanForDevice(){

  }
  connectToDevice(device) {

    console.log('Connecting to device...');

    HomePage.mDevice = device;

    ble.connectToDevice(device, onConnected, onDisconnected, onConnectError, {serviceUUIDs: "0000180f-0000-1000-8000-00805f9b34fb"});

    function onConnected(device) {
      console.log("Connected to device" + device.name);
      HomePage.service = ble.getService(device, "0000180f-0000-1000-8000-00805f9b34fb");
      console.log("## SERVICE : " + JSON.stringify(HomePage.service));
      HomePage.charac = ble.getCharacteristic(HomePage.service, "00002a19-0000-1000-8000-00805f9b34fb");
      console.log("## CHARACTERISTIC : " + JSON.stringify(HomePage.charac));
    }
    function onDisconnected(device) {
      console.log('Disconnected from device' + device.name);
    }
    function onConnectError(error) {
      console.log('Connect error: ' + error);
    }
  }

  readCharacteristic(){
    ble.readCharacteristic(HomePage.mDevice, HomePage.charac, onCharacRead, onCharacError);

    function onCharacRead(data){
      const dataView = new DataView(data);
      const battery = dataView.getUint8(0);
      console.log('## Battery level : '+ battery);
    }
    function onCharacError(error){
      console.log("## ERROR READ : "+ error);
    }
  }

  /*
  findDevice(){
    ble.stopScan();

    ble.startScan(onDeviceFound, onScanError);

    function onDeviceFound(device) {
      if (device.advertisementData.kCBAdvDataLocalName == "Nordic_Keyboard") {
        console.log("## Found device : " + device.advertisementData.kCBAdvDataLocalName);
        console.log("## Device Name : " + device.advertisementData.kCBAdvDataLocalName);
        console.log("## Device is connectable : " + device.advertisementData.kCBAdvDataIsConnectable);
        console.log("## Device UUID : " + device.advertisementData.kCBAdvDataServiceUUIDs);
        console.log("## Device DATA : " + JSON.stringify(device.advertisementData));
        ble.stopScan();
        HomePage.deviceToConnect = device;
        HomePage.connectToDevice(device);
      }
    }
    function onScanError(error){
      console.log("## Scan error: " + error)
    }
  }

  static connectToDevice(device){

    ble.connectToDevice(device, onConnected, onDisconnected, onConnectError, { serviceUUIDs : "0000180f-0000-1000-8000-00805f9b34fb"});

    function onConnected(device){
      console.log("Connected to device" + device.name);
      var service = ble.getService(device, "00001800-0000-1000-8000-00805f9b34fb");
      console.log("## SERVICE : "+ JSON.stringify(service));
      var charac = ble.getCharacteristic(service, "00002a00-0000-1000-8000-00805f9b34fb");
      console.log("## CHARACTERISTIC : "+ JSON.stringify(charac));
      ble.readCharacteristic(device, charac, onCharacRead, onCharacError);
    }
    function onDisconnected(device)
    {
      console.log('Disconnected from device' + device.name);
    }
    function onConnectError(error)
    {
      console.log('Connect error: ' + error);
    }
    function onCharacRead(data){
      //var raw = new DataView(data)

      console.log('## DATA : '+ HomePage.ab2str(data));
    }
    function onCharacError(error){
      console.log("## ERROR READ : "+ error);
    }
  }
  */

  static ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}


  // UUID NRF : 00001812-0000-1000-8000-00805f9b34fb


  /*
  * 06-13 17:39:38.381 21054 21054 I chromium: [INFO:CONSOLE(56335)] "## SERVICE : {"handle":5,"uuid":"00001812-0000-1000-8000-00805f9b34fb","type":0,"characteristics":[{"handle":12,"uuid":"00002a4e-0000-1000-8000-00805f9b34fb","permissions":0,"properties":6,"writeType":1,"descriptors":[]},{"handle":13,"uuid":"00002a4d-0000-1000-8000-00805f9b34fb","permissions":0,"properties":26,"writeType":2,"descriptors":[{"handle":21,"uuid":"00002902-0000-1000-8000-00805f9b34fb","permissions":0},{"handle":22,"uuid":"00002908-0000-1000-8000-00805f9b34fb","permissions":0}]},{"handle":14,"uuid":"00002a4d-0000-1000-8000-00805f9b34fb","permissions":0,"properties":14,"writeType":1,"descriptors":[{"handle":23,"uuid":"00002908-0000-1000-8000-00805f9b34fb","permissions":0}]},{"handle":15,"uuid":"00002a4b-0000-1000-8000-00805f9b34fb","permissions":0,"properties":2,"writeType":2,"descriptors":[]},{"handle":16,"uuid":"00002a22-0000-1000-8000-00805f9b34fb","permissions":0,"properties":18,"writeType":2,"descriptors":[{"handle":24,"uuid":"00002902-0000-1000-8000-00805f9b34fb","permissions":0}]},{"handle":17,"uuid":"00002a32-0000-1000-8000-00805f9b34fb","permissions":0,"properties":14,"writeType":1,"descriptors":[]},{"handle":18,"uuid":"00002a4a-0000-1000-8000-00805f9b34fb","permissions":0,"properties":2,"writeType":2,"descriptors":[]},{"handle":19,"uuid":"00002a4c-0000-1000-8000-00805f9b34fb","permissions":0,"properties":4,"writeType":1,"descriptors":[]}]}", source: file:///android_asset/www/build/main.js (56335)
  *
  * */


/*
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

  connectDevice() {
    console.log('Connect To Device');
    this.characteristics = [];
    this.ble.connect(this.deviceID).subscribe(peripheralData => {
      console.log("## DEVICE CONNECTED ##");
      this.characteristics = peripheralData.characteristics;
      console.log("## CHARACTERISTIC ## " + JSON.stringify(this.characteristics));
      for(let characteristic of this.characteristics ){
        console.log("## CHARACTERISTIC ## " + JSON.stringify(characteristic.service));
      }
    }, peripheralData => {
      console.log('## Could not connect to device ## ' + peripheralData);
    });
  };

  connectToDevice(deviceID) {
    console.log('Connect To Device');
    this.characteristics = [];
    this.ble.connect(deviceID).subscribe(peripheralData => {
      console.log("## DEVICE CONNECTED ##");
      this.characteristics = peripheralData.characteristics;
      console.log("## CHARACTERISTIC ## " + JSON.stringify(this.characteristics));
      for(let characteristic of this.characteristics ){
        console.log("## CHARACTERISTIC ## " + JSON.stringify(characteristic.service));
      }
    }, peripheralData => {
      console.log('## Could not connect to device ## ' + peripheralData);
    });
  };

  isConnected(deviceID){
    this.ble.isConnected(deviceID).then(
      () => { console.log('DEVICE AND SMARTPHONE ARE CONNECTED'); },
      () => { console.log('DEVICE AND SMARTPHONE ARE NOT CONNECTED');}
    );
  }

  readService(){
    this.ble.read(this.deviceID, "1800", "2a00").then(buffer =>{
      console.log("READ TEST : "+ buffer);
      const dataView = new DataView(buffer);
      const battery = dataView.getUint8(0);
      console.log("## BATTERY LEVEL ## " + battery);
    });
    //{"service":"180f","characteristic":"2a19","properties":["Read","Notify"],"descriptors":[{"uuid":"2902"}]}
  }
 */
}





/*
 2017-06-09 15:14:20.451217+0200 MyApp[301:17158] ## DEVICE FOUND ##{"id":"F1E1847A-F384-4D5B-8D23-2C36B5575CC5","rssi":-87,"advertising":{"kCBAdvDataIsConnectable":false}}
 2017-06-09 15:14:20.455931+0200 MyApp[301:17158] Discovered {
 advertising =     {
 kCBAdvDataIsConnectable = 1;
 kCBAdvDataLocalName = "Nordic_Keyboard";
 kCBAdvDataServiceUUIDs =         (
 1812
 );
 };
 id = "7D829BB2-4DD4-4BC8-A98A-5A5371F34A5B";
 name = "Nordic_Keyboard";
 rssi = "-63";

* */
