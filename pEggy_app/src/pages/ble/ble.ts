import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';


@Component({
  selector: 'page-ble',
  templateUrl: 'ble.html'
})
export class BlePage {

  public device;
  public connecting;
  public characteristics = [];
  public isRead;
  public StringData;
  public StringDataNotify;
  public isNotify;

  constructor(public navCtrl: NavController, public navParams: NavParams, private ble: BLE) {
    this.device = this.navParams.get('device');
    console.log("## DEVICE INFORMATION ##" + JSON.stringify(this.device));
    this.connecting = true;
    this.isNotify = false;
    this.connect(this.device.id);
  }

  connect(deviceID) {
    this.characteristics = [];
    this.ble.connect(deviceID).subscribe(peripheralData => {
      console.log(peripheralData.characteristics);
      console.log("## DEVICE CONNECTED ##");
      console.log(this.connecting);
      this.connecting = false;
      this.characteristics = peripheralData.characteristics;
    }, peripheralData => {
      console.log('## Could not connect to device -> head to the main page ## ' + peripheralData);
      this.navCtrl.pop();
    });
  }
  readCharacteristic(deviceID, serviceUUID, characteristicUUID) {
    console.log("## READ FROM ## " +deviceID+" "+ serviceUUID+" "+characteristicUUID);
    this.isRead = true;
    this.ble.read(deviceID, serviceUUID, characteristicUUID).then( data => {
      console.log("## READ DATA NOT MODIFIED ##" +data);
      var dataView = new DataView(data);
      //dataView.getUint16(0).toString();
      console.log("## DATAVIEW ##" + dataView.getUint16(0, true).toString());
      this.StringData = this.bytesToString(data);
      console.log("## READ ## " + this.StringData);
    }, data => {
      console.log("## ERROR READ ##" + data);
    });
  }

  startNotify(deviceID, serviceUUID, characteristicUUID) {
    this.isNotify = true;
    this.ble.startNotification(deviceID, serviceUUID, characteristicUUID).subscribe(buffer => {
      console.log("## NOTIFY BUFFER CONTENT ## "+ buffer.byteLength);
      this.StringDataNotify = String.fromCharCode.apply(null, new Uint8Array(buffer));
      console.log("## NOTIFY VALUE ## " + String.fromCharCode.apply(null, new Uint8Array(buffer)));
    }, error => {
      console.log("## NOTIFY ERROR ## " + error);
    });
  }

  stopNotify(deviceID, serviceUUID, characteristicUUID){
    this.isNotify = false;
    this.ble.stopNotification(deviceID, serviceUUID, characteristicUUID).then(state =>{
      console.log("## NOTIFICATION STOPPED ## " + state)
    }, state =>{
      console.log("## NOTIFICATION STOPPED ERROR ## " + state)
    })
  }


  writeCharacteristic(deviceID, serviceUUID, characteristicUUID, value){
    var valuetoAB = this.stringToBytes(value);
    this.ble.write(deviceID, serviceUUID, characteristicUUID, valuetoAB).then(isWrite =>{
      console.log( isWrite + "## HAS BEEN WRITE ## "+ valuetoAB)
    }, isNotWrite =>{
      console.log("## ERROR TO WRITE ## "+ isNotWrite)
    });
  }

  disconnect(deviceID){
    console.log("## DISCONNECT FROM ## " + deviceID );
    this.ble.disconnect(deviceID).then(disconnect =>{
      console.log("## DISCONNECTED ## "+ disconnect);
      this.navCtrl.pop();
    }, disconnect => {
      console.log("## ERROR DISCONNECTED ## "+ disconnect)
    });
  }

  displayReadButton(service){
    if((service == "Read,Write") || (service == "Read")){
      return true;
    }
    return false;
  }
  displayWriteButton(service){
    if((service == "Read,Write") || (service == "Write")){
      return true;
    }
    return false;
  }
  displayNotifyButton(service){
    if(service == "Notify"){
      return true;
    }
    return false;
  }


  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  };
}




