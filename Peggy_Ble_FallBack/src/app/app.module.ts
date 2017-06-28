import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {BLE} from "@ionic-native/ble";
import { HttpModule } from '@angular/http';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {BlePage} from "../pages/ble/ble";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BlePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BlePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BLE,
    BluetoothSerial,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
