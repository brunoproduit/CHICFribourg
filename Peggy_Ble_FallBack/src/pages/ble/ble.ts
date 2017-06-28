import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { Http } from "@angular/http";

/*
 Define the component, we could write HTML here,
 but it's smoother to create a real page HTML and link it here with the code of this page
 */
@Component({
  selector: 'page-ble',
  templateUrl: 'ble.html'
})

/*
 Main Class of the Ble page
 */
export class BlePage {

  // declaration of local variables
  public device; //device that we are connecting to
  public deviceID = 'C2:27:CD:41:44:9E';
  public connecting;
  public characteristics;
  public idServiceIOS = "DEBE2900-EE8E-4178-AEAE-A0D6CD896263"; //iOS and Android interpret the UUID of the Bluetooth differently,
  public idServiceAndroid = "debe2900-ee8e-4178-aeae-a0d6cd896263"; // one in uper case the other in lower cas
  public idCharacIOS = "DEBE2901-EE8E-4178-AEAE-A0D6CD896263";
  public idCharacAndroid = "debe2901-ee8e-4178-aeae-a0d6cd896263";
  public getValueOf5; //value of the total amount of the coin 5
  public getValueOf2; //value of the total amount of the coin 2

  /*
   Constructor, we give name to the component we need from the imported library to use them in our code
   We can set local variable here, if necessary
   The constructor is launched when the page is launched
   It will run the function connect(deviceID)
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, private ble: BLE, private http: Http, private zone: NgZone) {
    this.device = this.navParams.get('device');
    console.log("## DEVICE INFORMATION ##" + JSON.stringify(this.device));
    this.connecting = true;
    this.connect(this.device.id);
  }

  /*
   The function connect will start the fucntion connect of the Ble library with the deviceID of the device we are connecting to
   If the connection is a success, the function will get the UUID of the characteristic and the service by calling the functions :
   getCharacteristicByName, getServiceByName. Thoses informations are needed to subscribe to the notification service
   */
  connect(deviceID) {
    this.characteristics = [];
    this.ble.connect(deviceID).subscribe(peripheralData => {
      console.log("## DEVICE CONNECTED ##");
      this.connecting = false;
      this.characteristics = peripheralData.characteristics;
      console.log("## CHARACTERISTIC ## " + JSON.stringify(this.characteristics));
      for(let characteristic of this.characteristics ){
        console.log("## CHARACTERISTIC ## " + JSON.stringify(characteristic.service));
      }
    }, peripheralData => {
      console.log('## Could not connect to device -> head to the main page ## ' + peripheralData);
      this.navCtrl.pop();
    });
  }
  readService(){
    this.ble.read(this.deviceID, "180f", "2a19").then(buffer =>{
      console.log("READ TEST : "+ buffer);
      const dataView = new DataView(buffer);
      const battery = dataView.getUint8(0);
      console.log("## BATTERY LEVEL ## " + battery);
    });
    //{"service":"180f","characteristic":"2a19","properties":["Read","Notify"],"descriptors":[{"uuid":"2902"}]}
  }


  /*
   This function will subscribe the Smartphone to the notification service of the Bluetooth device
   It will get every notification that the device made and when a notification is received
   The notification format is an uint8 (defined in the profile BLE) and is received as a buffer [ ][ ][ ][ ][ ][ ][ ][ ]
   Representation of the buffer :

   +-   5   2   1   0.5   0.2   0.1
   [ ] [ ] [ ] [ ] [ ]  [ ]   [ ]   [ ]

   If a bit is set to 1, then it's the coin of the vale above that has made a notification. If the bit of the field +- is at 1
   it's mean that the coin has been withdrawn if it is 0 the coin has been added

   We have to change that buffer in a constant with the help of the javascript object DataView
   When the buffer is transformed in a const we have the value of the notification and insert it ine the constant coin
   then we call the function sortCoin(coin) with the constant coin
   */

  startNotify(deviceID, serviceUUID, characteristicUUID) {
    this.ble.startNotification(deviceID, serviceUUID, characteristicUUID).subscribe(buffer => {
      console.log('## NOTIFICATION DETECTED ##');
    }, error => {
      console.log("## NOTIFY ERROR ## " + error);
    });
  }

  /*
   This function will unsubscribe the smartphone to the nofitication service
   Note : when the smartphone disconnect to the device the notification is stopped as well
   */
  stopNotify(deviceID, serviceUUID, characteristicUUID){
    this.ble.stopNotification(deviceID, serviceUUID, characteristicUUID).then(state =>{
      console.log("## NOTIFICATION STOPPED ## " + state)
    }, state =>{
      console.log("## NOTIFICATION STOPPED ERROR ## " + state)
    })
  }

  /*
   This function is called when the user press on the disconnect button
   It will launch the disconnect function of the BLE library
   It disconnect the device from the smartphone, this means they can't communicate anymore
   */
  disconnect(deviceID){
    console.log("## DISCONNECT FROM ## " + deviceID );
    //this.stopNotify(deviceID, this.getServiceByName(this.characteristics), this.getCharacteristicByName(this.characteristics));
    this.ble.disconnect(deviceID).then(disconnect =>{
      console.log("## DISCONNECTED ## "+ disconnect);
      this.navCtrl.pop();
    }, disconnect => {
      console.log("## ERROR DISCONNECTED ## "+ disconnect)
    });
  }

  /*
   This function will check in the list of characteristics the service we need
   here the service we need is the idServiceAndroid or idServiceIOS
   */
  getServiceByName(characteristics){
    for(let characteristic of characteristics ){
      if((characteristic.service == this.idServiceAndroid) || (characteristic.service == this.idServiceIOS)){
        return characteristic.service;
      }
    }
  }
  /*
   This function will check it the list of characteristics the characteristic we need
   here the characteristic we need is the idCharacAndroid or idCharacIOS
   */
  getCharacteristicByName(characteristics){
    for(let characteristic of characteristics ){
      if((characteristic.characteristic == this.idCharacAndroid) || (characteristic.characteristic == this.idCharacIOS)){
        return characteristic.characteristic;
      }
    }
  }
}


//{"service":"180f","characteristic":"2a19","properties":["Read","Notify"],"descriptors":[{"uuid":"2902"}]}
