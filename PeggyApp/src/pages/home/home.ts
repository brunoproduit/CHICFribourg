import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { BleProvider } from '../../providers/ble/ble'
import {InsertMoneyPage} from "../insert-money/insert-money";
import {WithdrawMoneyPage} from "../withdraw-money/withdraw-money";
import {SettingsPage} from "../settings/settings";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public user;
  public isConnectedToPeggy;
  public tokenSession;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public ble: BleProvider) {
    this.user = this.navParams.get('user');
    this.tokenSession = this.navParams.get('tokenSession');
    this.isConnectedToPeggy = ble.getIsConnected()
    console.log("user information: "+ JSON.stringify(this.user));
  }

  doThis(){

  }

  testToken(){

    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.tokenSession);

    this.http.get('https://chic.tic.heia-fr.ch/peggy/'+'cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1', {headers: headers})
      .map((res:any) => res.json())
      .subscribe(data => console.log("Data: "+ JSON.stringify(data)),
        err => console.log("Error: "+ err));
  }

  parametersCallbackFunction = (user, tokenSession) =>{
    return new Promise((resolve, reject)=>{
      this.user = user;
      this.tokenSession = tokenSession;
      resolve();
    })
  };

  goToInsertMoney(){
    this.navCtrl.push(InsertMoneyPage, {callback: this.parametersCallbackFunction, user: this.user, tokenSession: this.tokenSession})
  }

  goToWithdrawMoney(){
    this.navCtrl.push(WithdrawMoneyPage, {callback: this.parametersCallbackFunction, user: this.user, tokenSession: this.tokenSession})
  }

  goToGoals(){
    //this.navCtrl.push(WithdrawMoneyPage, {callback: this.parametersCallbackFunction, user: this.user, tokenSession: this.tokenSession})
  }

  goToSettings(){
    this.navCtrl.push(SettingsPage, {callback: this.parametersCallbackFunction, user: this.user, tokenSession: this.tokenSession})
  }

  logOut(){
    this.navCtrl.popToRoot();
  }


}
