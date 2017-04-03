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
  public characteristics;
  public isNotify;
  public idService = "debe2900-ee8e-4178-aeae-a0d6cd896263";
  public idCharac = "debe2901-ee8e-4178-aeae-a0d6cd896263";
  public money;

  constructor(public navCtrl: NavController, public navParams: NavParams, private ble: BLE) {
    this.device = this.navParams.get('device');
    console.log("## DEVICE INFORMATION ##" + JSON.stringify(this.device));
    this.connecting = true;
    this.isNotify = false;
    this.connect(this.device.id);
    this.money = 0;
  }
  connect(deviceID) {
    this.characteristics = [];
    this.ble.connect(deviceID).subscribe(peripheralData => {
      console.log("## DEVICE CONNECTED ##");
      this.connecting = false;
      this.characteristics = peripheralData.characteristics;
      console.log('## GET CHARACTERISTIC ##' + this.getCharacteristicByName(this.characteristics));
      console.log('## GET SERVICE ##' + this.getServiceByName(this.characteristics));
      this.startNotify(this.device.id, this.getServiceByName(this.characteristics), this.getCharacteristicByName(this.characteristics));
    }, peripheralData => {
      console.log('## Could not connect to device -> head to the main page ## ' + peripheralData);
      this.navCtrl.pop();
    });
  }
  startNotify(deviceID, serviceUUID, characteristicUUID) {
    this.isNotify = true;
    this.ble.startNotification(deviceID, serviceUUID, characteristicUUID).subscribe(buffer => {
      console.log('## NOTIFY STARTED ##');
      var dataView = new DataView(buffer);
      var coin = dataView.getUint8(0);
      console.log("## NOTIFY VALUE ## " + coin);
      this.sortCoin(coin);
      console.log('## MONEY ## '+ this.money);
    }, error => {
      console.log("## NOTIFY ERROR ## " + error);
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
  getServiceByName(characteristics){
    for(let characteristic of characteristics ){
      if(characteristic.service == this.idService){
        return characteristic.service;
      }
    }
  }
  getCharacteristicByName(characteristics){
    for(let characteristic of characteristics ){
      if(characteristic.characteristic == this.idCharac){
        return characteristic.characteristic;
      }
    }
  }
  displayNotifyButton(service){
    if(service == "Notify"){
      return true;
    }
    return false;
  }

  sortCoin(value){
    switch (value){
      case 1:
        this.money += 0.1;
        break;
      case 2:
        this.money += 0.2;
        break;
      case 4:
        this.money += 0.5;
        break;
      case 8:
        this.money += 1;
        break;
      case 16:
        this.money += 2;
        break;
      case 32:
        this.money += 5;
        break;
      case 65:
        this.money -= 0.1;
        break;
      case 66:
        this.money -= 0.2;
        break;
      case 68:
        this.money -= 0.5;
        break;
      case 72:
        this.money -= 1;
        break;
      case 80:
        this.money -= 2;
        break;
      case 96:
        this.money -= 5;
        break;
    }
  }
}
