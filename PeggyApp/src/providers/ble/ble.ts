import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import { Platform } from 'ionic-angular';
import * as ble from "cordova-plugin-ble/ble.js";
import { BleProviderCallback} from "./BleProviderCallback";

/*
 Generated class for the BleProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */

@Injectable()
export class BleProvider {

  public test;
  public isConnected: boolean;
  public mDevice;
  public deviceName = 'Peggy';
  public deviceUUID = 'debe2900-ee8e-4178-aeae-a0d6cd896263';
  public coinEventNotificationUUID = 'debe2901-ee8e-4178-aeae-a0d6cd896263';
  public pendingTransactionsIndicatorUUID = 'debe2902-ee8e-4178-aeae-a0d6cd896263';
  public pendingTransactionsUUID = 'debe2903-ee8e-4178-aeae-a0d6cd896263';
  public peggyUuidUUID = 'debe2904-ee8e-4178-aeae-a0d6cd896263';
  public eraseBondingUUID = 'debe2905-ee8e-4178-aeae-a0d6cd896263';
  public userInformationUUID = 'debe2906-ee8e-4178-aeae-a0d6cd896263';
  public service;
  public characteristicCoinNotification;
  public characteristicPeggyUuid;

  private callback : BleProviderCallback;

  constructor(public http: Http, public platform: Platform)
  {
    this.isConnected = false;
   console.log('Hello BleProvider Provider');

  }

  setCallback(callback: BleProviderCallback)
  {
    this.callback = callback;
  }

  findDevice = () => {
    this.disconnectDevice();
    this.searchForBondedDevice({
      deviceName: this.deviceName,
      deviceUUID: this.deviceUUID,
      onFound: this.connectToDevice,
      onNotFound: this.scanForDevice,
    });
  };

  disconnectDevice = () => {
    ble.stopScan();
    if (this.mDevice) {
      ble.close(this.mDevice);
    }
    this.mDevice = '';
    console.log('Disconnected');
  };


  searchForBondedDevice = (params) => {
    console.log('Searching for bonded device');
    console.log('Searching for ' + params.deviceName);

    if(this.platform.is('ios')){
      console.log("Platform is IOS");
      return this.scanForDevice();
    }

    let listOfBondedDevices = (devices) => {
      console.log('Bonded devices: ' + JSON.stringify(devices));
      for (var i in devices) {
        var device = devices[i];
        if (device.name == params.deviceName) {
          console.log('Found bonded device: ' + device.name);
          params.onFound(device);
          return;
        }
      }
      console.log("Peggy not found");
      params.onNotFound();

    }, listOfBondedDevicesError = (error) => {
      console.log('getBondedDevices error: ' + error);
      params.onNotFound(error);
    };

    ble.getBondedDevices(
        listOfBondedDevices,
        listOfBondedDevicesError,
        {serviceUUIDs: params.deviceUUID}
    );
  };

  connectToDevice = (device) => {
    console.log('Connecting to device...');
    this.mDevice = device;

    let onConnected = (device) => {
        console.log("Connected to device: " + device.name);
        this.isConnected = true;
        console.log("Connected to device: " + this.isConnected);
        this.service = ble.getService(this.mDevice, this.deviceUUID);
        console.log("SERVICE: "+ JSON.stringify(this.service));
        this.enableCoinNotification(device);
        this.readPeggyUUID();
      },
      onDisconnected = (device) => {
        console.log('Disconnected from device: ' + device.name);
        this.isConnected = false;
        this.findDevice();
      },
      onConnectError = (error) => {
        console.log('Connect error: ' + error);
        this.isConnected = false;
        this.findDevice();
      };

    setTimeout(() => {
      ble.connectToDevice(
        device,
        onConnected,
        onDisconnected,
        onConnectError)
    }, 500);
  };

  enableCoinNotification = (device) => {
    this.service = ble.getService(device, this.deviceUUID);
    console.log("SERVICE: "+ JSON.stringify(this.service));
    this.characteristicCoinNotification = ble.getCharacteristic(this.service, this.coinEventNotificationUUID);
    console.log("CHARACTERISTIC: "+ JSON.stringify(this.characteristicCoinNotification));

    console.log("Start Notification process...");
    let onNotificationSuccess = (data) => {
        const dataView = new DataView(data);
        const coinNotify = dataView.getUint8(0);
        console.log('Notify Data: ' + coinNotify);
        this.sortCoin(coinNotify);
      },
      onNotificationError = (error) => {
        console.log('Error Notification: ' + error);
      };
    ble.enableNotification(
      device,
      this.characteristicCoinNotification,
      onNotificationSuccess,
      onNotificationError)
  };


  scanForDevice = () => {

    console.log('Scanning for Peggy');

    let bondState = (state) =>{
          // Android returns 'bonded' when bonding is complete.
          // iOS will return 'unknown' and show paring dialog
          // when connecting.
          if(state == 'bonded' || state == 'unknown'){
            this.connectToDevice(this.mDevice);
          }
          else if(state == 'bonding'){
            console.log("Bonding in progress");
          }
          else if(state == 'unbonded'){
            console.log("Bonding aborted")
          }
    },
        bondError = (error) =>{
          console.log("Bond error: "+ error);
        };


    let onDeviceFound = (device) => {
      console.log('Found device: ' + device.name);
      this.mDevice = device;
      if (device.advertisementData.kCBAdvDataLocalName == 'Peggy2') {
        console.log('Found Peggy');
        ble.stopScan();
        ble.bond(
            device,
            bondState,
            bondError
        );
      }
    },
        onScanError = (error) => {
      console.log('Scan error: ' + error);
    };

    ble.startScan(
        onDeviceFound,
        onScanError);
  };

  readPeggyUUID = () =>{
    console.log("Read Peggy UUID...");
    this.characteristicPeggyUuid = ble.getCharacteristic(this.service, this.peggyUuidUUID);
    console.log("CHARACTERISTIC: "+ JSON.stringify(this.characteristicPeggyUuid));

       ble.readCharacteristic(
         this.mDevice,
         this.characteristicPeggyUuid,
         function(data)
         {
           console.log('characteristic data: ' + ble.fromUtf8(data));
         },
         function(errorCode)
         {
           console.log('readCharacteristic error: ' + errorCode);
         });
  };

  sortCoin = (value) => {
    var coin:string;
    switch (value){
      case 1:
        console.log("Coin of 10ct added");
         coin = "coin10c";
        if (this.callback != null)
        {
          this.callback.onMoneyInserted(coin);
        }
        break;
      case 2:
        console.log("Coin of 20ct added");
        coin = "coin20c";
        if (this.callback != null)
        {
          this.callback.onMoneyInserted(coin);
        }
        break;
      case 4:
        console.log("Coin of 50ct added");
        coin = "coin50c";
        if (this.callback != null)
        {
          this.callback.onMoneyInserted(coin);
        }
        break;
      case 8:
        console.log("Coin of 1.- added");
        coin = "coin1";
        if (this.callback != null)
        {
          this.callback.onMoneyInserted(coin);
        }
        break;
      case 16:
        console.log("Coin of 2.- added");
        coin = "coin2";
        if (this.callback != null)
        {
          this.callback.onMoneyInserted(coin);
        }
        break;
      case 32:
        console.log("Coin of 5.- added");
        coin = "coin5";
        if (this.callback != null)
        {
          this.callback.onMoneyInserted(coin);
        }
        break;
      case 65:
        console.log("Coin of 10ct substracted");
        coin = "coin10c";
        if (this.callback != null)
        {
          this.callback.onMoneyWithdrawn(coin);
        }
        break;
      case 66:
        console.log("Coin of 20ct substracted");
        coin = "coin20c";
        if (this.callback != null)
        {
          this.callback.onMoneyWithdrawn(coin);
        }
        break;
      case 68:
        console.log("Coin of 50ct substracted");
        coin = "coin50c";
        if (this.callback != null)
        {
          this.callback.onMoneyWithdrawn(coin);
        }
        break;
      case 72:
        console.log("Coin of 1.- substracted");
        coin = "coin1";
        if (this.callback != null)
        {
          this.callback.onMoneyWithdrawn(coin);
        }
        break;
      case 80:
        console.log("Coin of 2.- substracted");
        coin = "coin2";
        if (this.callback != null)
        {
          this.callback.onMoneyWithdrawn(coin);
        }
        break;
      case 96:
        console.log("Coin of 5.- substracted");
        coin = "coin5";
        if (this.callback != null)
        {
          this.callback.onMoneyWithdrawn(coin);
        }
        break;
    }
  };

  getIsConnected = () =>{
    if (this.callback != null) {
      return this.isConnected
    }
  };
}
