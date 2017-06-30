import {Component, Injectable, Injector} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {BleProviderCallback} from "../../providers/ble/BleProviderCallback";
import {BleProvider} from "../../providers/ble/ble";


/**
 * Generated class for the InsertMoneyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-insert-money',
    templateUrl: 'insert-money.html',
})
@Injectable()
export class InsertMoneyPage implements BleProviderCallback {

    public user;
    public isConnectedToPeggy;
    public tokenSession;
    public urlAddMoney = 'https://chic.tic.heia-fr.ch/peggy';
    public moneyAdded;

    constructor(private bleProvider: BleProvider, private navParams: NavParams, public http: Http, public platform: Platform) {
        platform.ready().then(() => {
            this.user = this.navParams.get('user');
            this.tokenSession = this.navParams.get('tokenSession');

        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InsertMoneyPage');
        this.bleProvider.setCallback(this);
        this.isConnectedToPeggy = this.bleProvider.getIsConnected();
        console.log("isConnectedToPeggy"+ this.isConnectedToPeggy);
    }

    onMoneyInserted = (coin) => {
        console.log("TEST moneyInserted called:" + coin);

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.tokenSession);

        let body = {};

        switch (coin) {
            case 'coin10c':
                body = {
                    "uuid": "cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1",
                    'coin10c': "+1",
                };
                this.moneyAdded += 0.1;
                break;
            case 'coin20c':
                body = {
                    "uuid": "cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1",
                    'coin20c': "+1",
                };
                this.moneyAdded += 0.2;
                break;
            case 'coin50c':
                body = {
                    "uuid": "cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1",
                    'coin50c': "+1",
                };
                this.moneyAdded += 0.5;
                break;
            case 'coin1':
                body = {
                    "uuid": "cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1",
                    'coin1': "+1",
                };
                this.moneyAdded += 1;
                break;
            case 'coin2':
                body = {
                    "uuid": "cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1",
                    'coin2': "+1",
                };
                this.moneyAdded += 2;
                break;
            case 'coin5':
                body = {
                    "uuid": "cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1",
                    'coin5': "+1",
                };
                this.moneyAdded += 5;
                break;
        }
        this.http.put(this.urlAddMoney + 'cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1', JSON.stringify(body), {headers: headers})
            .map((res: any) => res.json())
            .subscribe(data => console.log("Data: " + JSON.stringify(data)),
                err => console.log("Error: " + err));
    }
}

