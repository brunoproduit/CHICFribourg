import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { Storage, IonicStorageModule } from '@ionic/storage';
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
import {AddNewUserPage} from "../pages/add-new-user/add-new-user";
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {DeleteUserPage} from "../pages/delete-user/delete-user";
import {GoalsPage} from "../pages/goals/goals";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    LoginPasswordPage,
    SettingsPage,
    InsertMoneyPage,
    WithdrawMoneyPage,
    SettingsPage,
    AddNewUserPage,
    ChangePasswordPage,
    DeleteUserPage,
    GoalsPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
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
    SettingsPage,
    AddNewUserPage,
    ChangePasswordPage,
    DeleteUserPage,
    GoalsPage,
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
