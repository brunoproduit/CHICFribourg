import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { Http, Headers} from "@angular/http";

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
      console.log('## GET CHARACTERISTIC ##' + this.getCharacteristicByName(this.characteristics));
      console.log('## GET SERVICE ##' + this.getServiceByName(this.characteristics));
      this.startNotify(this.device.id, this.getServiceByName(this.characteristics), this.getCharacteristicByName(this.characteristics));
    }, peripheralData => {
      console.log('## Could not connect to device -> head to the main page ## ' + peripheralData);
      this.navCtrl.pop();
    });
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
      const dataView = new DataView(buffer);
      const coin = dataView.getUint8(0);
      console.log("## NOTIFY VALUE ## " + coin);
      this.sortCoin(coin);
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

  /*
  This function will receive in parameter a value that has been sent through a notification, the buffer can either return of those values :
  1 2 4 8 16 32 65 65 68 72 80 96. 1 2 4 8 16 32 means that the bit +- in the array buffer is set to 0 so it add the coin, the other means the bit
  is set to 1 so it withdraw the coin
  With the help of a switch, we execute the function doPut with the paramater that we want according to the buffer value.
   */

  sortCoin(value){
    switch (value){
      case 1:
       // this.money += 0.1;
        this.doPut("0.1", "+1");
        break;
      case 2:
        //this.money += 0.2;
        this.doPut("0.2", "+1");
        break;
      case 4:
        //this.money += 0.5;
        this.doPut("0.5", "+1");
        break;
      case 8:
        //this.money += 1;
        this.doPut("1", "+1");
        break;
      case 16:
       // this.money += 2;
        this.doPut("2", "+1");
        break;
      case 32:
        //this.money += 5;
        this.doPut("5", "+1");
        break;
      case 65:
        //this.money -= 0.1;
        this.doPut("0.1", "-1");
        break;
      case 66:
        //this.money -= 0.2;
        this.doPut("0.2", "-1");
        break;
      case 68:
        //this.money -= 0.5;
        this.doPut("0.5", "-1");
        break;
      case 72:
        //this.money -= 1;
        this.doPut("1", "-1");
        break;
      case 80:
        //this.money -= 2;
        this.doPut("2", "-1");
        break;
      case 96:
        //this.money -= 5;
        this.doPut("5", "-1");
        break;
    }
  }
  /*
    This function use the HTTP library
    This function will get data to the web server at the address mentioned. the web server return a json.
    We can easily take information of a Json with javascript.
    This.zone.run is a function to actualize the UI when a parameter change without refresh the page
   */
  doGet(name){
    this.http.get('https://chic.tic.heia-fr.ch/coins/'+name).map(res => res.json()).subscribe(data =>{
      if(data.name == "2"){
        this.zone.run(() => {
          this.getValueOf2 = data.amount;
        });
        console.log("## VALUE OF 2 ## "+ this.getValueOf2);
      } else if (data.name == "5"){
        this.zone.run(() => {
          this.getValueOf5 = data.amount;
        });
        console.log("## VALUE OF 5 ## "+ this.getValueOf5);
      }
    })
  }

  /*
   This function use the HTTP library
   This function will put data to the web server at the address mentioned. the web server needs a Json, so the format send
   is in Json. The format is put in the header of the request HTTP, and the parameter in the body.
   */

  doPut(name , amount){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log("VALUE AMOUNT : "+ amount);

    let body = {
      "name": name,
      "amount" : amount
    };
    this.http.put('https://chic.tic.heia-fr.ch/coins', JSON.stringify(body), {headers: headers})
      .map(res => res.json())
      .subscribe(data =>{
        console.log(JSON.stringify(data));
        this.doGet(name);
      });
  }
}
