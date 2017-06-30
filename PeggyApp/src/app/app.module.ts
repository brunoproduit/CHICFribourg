import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { Network } from "@ionic-native/network";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { LoginPasswordPage } from '../pages/login-password/login-password';
import { SettingsPage } from '../pages/settings/settings';
import { InsertMoneyPage } from '../pages/insert-money/insert-money';
import { WithdrawMoneyPage } from '../pages/withdraw-money/withdraw-money';
import { BleProvider } from '../providers/ble/ble';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    LoginPasswordPage,
    SettingsPage,
    InsertMoneyPage,
    WithdrawMoneyPage,
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
    LoginPage,
    LoginPasswordPage,
    SettingsPage,
    InsertMoneyPage,
    WithdrawMoneyPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    BleProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
