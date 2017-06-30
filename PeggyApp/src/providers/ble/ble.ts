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
  public sendUuidUUID = 'debe2904-ee8e-4178-aeae-a0d6cd896263';
  public eraseBondingUUID = 'debe2905-ee8e-4178-aeae-a0d6cd896263';
  public userInformationUUID = 'debe2906-ee8e-4178-aeae-a0d6cd896263';
  public characteristic;
  public service;
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
        this.service = ble.getService(device, this.deviceUUID);
        console.log("SERVICE: "+ JSON.stringify(this.service));
        this.characteristic = ble.getCharacteristic(this.service, this.coinEventNotificationUUID);
        console.log("CHARACTERISTIC: "+ JSON.stringify(this.characteristic));
        this.enableCoinNotification(device);
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
      this.characteristic,
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
      if (device.advertisementData.kCBAdvDataLocalName == 'Peggy') {
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

  sortCoin = (value) => {
    switch (value){
      case 1:
        //this.doPut("coin10c", "+1");
        console.log("Coin of 10ct added");
        break;
      case 2:
        //this.doPut("coin20c", "+1");
        console.log("Coin of 20ct added");
        break;
      case 4:
        //this.doPut("coin50c", "+1");
        console.log("Coin of 50ct added");
        break;
      case 8:
        //this.doPut("coin1", "+1");
        console.log("Coin of 1.- added");
        break;
      case 16:
        //this.doPut("coin2", "+1");
        console.log("Coin of 2.- added");
        break;
      case 32:
        //this.doPut("coin5", "+1");
        console.log("Coin of 5.- added");
        var coin = "coin5";
        if (this.callback != null)
        {
          this.callback.onMoneyInserted(coin);
        }
        break;
      case 65:
        //this.doPut("coin10c", "-1");
        console.log("Coin of 10ct substracted");
        break;
      case 66:
        //this.doPut("coin20c", "-1");
        console.log("Coin of 20ct substracted");
        break;
      case 68:
        //this.doPut("coin50c", "-1");
        console.log("Coin of 50ct substracted");
        break;
      case 72:
        //this.doPut("coin1", "-1");
        console.log("Coin of 1.- substracted");
        break;
      case 80:
        //this.doPut("coin2", "-1");
        console.log("Coin of 2.- substracted");
        break;
      case 96:
        //this.doPut("coin5", "-1");
        console.log("Coin of 5.- substracted");
        break;
    }
  };
  getIsConnected = () =>{
    if (this.callback != null) {
      return this.isConnected
    }
  };
}
