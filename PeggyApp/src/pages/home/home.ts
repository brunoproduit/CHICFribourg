import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Http} from '@angular/http';
import {BleProvider} from '../../providers/ble/ble'
import {InsertMoneyPage} from "../insert-money/insert-money";
import {WithdrawMoneyPage} from "../withdraw-money/withdraw-money";
import {SettingsPage} from "../settings/settings";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public user;
    public peggyUUID;
    public isConnectedToPeggy;
    public tokenSession;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public ble: BleProvider) {
        this.user = this.navParams.get('user');
        this.peggyUUID = this.navParams.get('peggyUUID');
        this.tokenSession = this.navParams.get('tokenSession');
        this.isConnectedToPeggy = ble.getIsConnected();
        console.log("user information: " + JSON.stringify(this.user));
    }

    doThis() {

    }
    parametersCallbackFunction = (user, peggyUUID, tokenSession) => {
        return new Promise((resolve, reject) => {
            this.user = user;
            this.peggyUUID = peggyUUID;
            this.tokenSession = tokenSession;
            resolve();
        })
    };

    goToInsertMoney() {
        this.navCtrl.push(InsertMoneyPage, {
            callback: this.parametersCallbackFunction,
            user: this.user,
            peggyUUID: this.peggyUUID,
            tokenSession: this.tokenSession
        })
    }

    goToWithdrawMoney() {
        this.navCtrl.push(WithdrawMoneyPage, {
            callback: this.parametersCallbackFunction,
            user: this.user,
            peggyUUID: this.peggyUUID,
            tokenSession: this.tokenSession
        })
    }

    goToGoals() {
        //this.navCtrl.push(WithdrawMoneyPage, {callback: this.parametersCallbackFunction, user: this.user, tokenSession: this.tokenSession})
    }

    goToSettings() {
        this.navCtrl.push(SettingsPage, {
            callback: this.parametersCallbackFunction,
            user: this.user,
            peggyUUID: this.peggyUUID,
            tokenSession: this.tokenSession
        })
    }

    logOut() {
        this.navCtrl.popToRoot();
    }


}
