import {Component, Injectable, NgZone, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, Navbar, ToastController} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {BleProviderCallback} from "../../providers/ble/BleProviderCallback";
import {BleProvider} from "../../providers/ble/ble";


@IonicPage()
@Component({
    selector: 'page-insert-money',
    templateUrl: 'insert-money.html',
})
@Injectable()
export class InsertMoneyPage implements BleProviderCallback {

    @ViewChild(Navbar) navBar: Navbar;
    public user;
    public peggyUUID;
    public callback;
    public amountAccount;
    public isConnectedToPeggy;
    public tokenSession;
    public urlAddMoney = 'https://chic.tic.heia-fr.ch/peggy';
    public moneyAdded;

    constructor(private bleProvider: BleProvider, private navCtrl: NavController, private navParams: NavParams, public http: Http, public platform: Platform, private zone: NgZone, public toastCtrl: ToastController) {
        platform.ready().then(() => {
            this.user = this.navParams.get('user');
            this.peggyUUID = this.navParams.get('peggyUUID');
            this.tokenSession = this.navParams.get('tokenSession');
            this.callback = this.navParams.get('callback');
            this.amountAccount = this.user.balance;
            if(this.moneyAdded == null){
                this.moneyAdded = 0;
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InsertMoneyPage');
        this.bleProvider.setCallback(this);
        this.isConnectedToPeggy = this.bleProvider.isConnected;
        console.log("isConnectedToPeggy: "+ this.isConnectedToPeggy);
        if(!this.isConnectedToPeggy){
            this.bleProvider.findDevice();
        }
        this.navBar.backButtonClick =(e:UIEvent) =>{
            this.callback(this.user, this.peggyUUID, this.tokenSession).then(()=>{
                this.navCtrl.pop();
            });
        };
    }

    onMoneyInserted = (coin) => {
        console.log("TEST moneyInserted called:" + coin);
        let body = {};

        switch (coin) {
            case 'coin10c':
                body = {
                    "uuid": this.peggyUUID,
                    "coin10c": "+1",
                };
                this.sendMoneyToAccount(body);
                break;
            case 'coin20c':
                body = {
                    "uuid": this.peggyUUID,
                    "coin20c": "+1",
                };
                this.sendMoneyToAccount(body);
                break;
            case 'coin50c':
                body = {
                    "uuid": this.peggyUUID,
                    "coin50c": "+1",
                };
                this.sendMoneyToAccount(body);
                break;
            case 'coin1':
                body = {
                    "uuid": this.peggyUUID,
                    "coin1": "+1",
                };
                this.sendMoneyToAccount(body);
                break;
            case 'coin2':
                body = {
                    "uuid": this.peggyUUID,
                    "coin2": "+1",
                };
                this.sendMoneyToAccount(body);
                break;
            case 'coin5':
                body = {
                    "uuid": this.peggyUUID,
                    "coin5": "+1",
                };
                this.sendMoneyToAccount(body);
                break;
        }
    };

    sendMoneyToAccount = (body) =>{

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.tokenSession);
            headers.append('Content-Type', 'application/json');

            var promise = new Promise((resolve, reject) =>{
                this.http.put(this.urlAddMoney, JSON.stringify(body), {headers: headers})
                    .map((res: any) => res.json())
                    .subscribe(data =>{
                            console.log("Data: " + JSON.stringify(data));
                            this.zone.run(() => {
                                this.moneyAdded += data.balance - this.amountAccount;
                                this.moneyAdded =  Math.round(this.moneyAdded * 10)/10;
                                this.amountAccount = data.balance;
                                this.user.balance = data.balance;
                                this.controlMaxCoinReached(data.coin5, data.coin2, data.coin1, data.coin50c, data.coin20c, data.coin10c);
                                resolve();
                            });
                        },
                        err => console.log("Error: " + err));

            });
            promise.then(()=>{
                console.log("Promise send money finished");
            })
    };

    controlMaxCoinReached = (coin5, coin2, coin1, coin50c, coin20c, coin10c) =>{
        if(coin5 == 20){
            this.maxCoinReachedToast("Warning ! Coins of 5 CHF have reached their limit")
        }else if(coin2 == 21){
            this.maxCoinReachedToast("Warning ! Coins of 2 CHF have reached their limit")
        }else if(coin1 == 30){
            this.maxCoinReachedToast("Warning ! Coins of 1 CHF have reached their limit")
        }else if(coin50c == 37){
            this.maxCoinReachedToast("Warning ! Coins of 0.50 cents have reached their limit")
        }else if(coin20c == 28){
            this.maxCoinReachedToast("Warning ! Coins of 0.20 cents have reached their limit")
        }else if(coin10c == 32){
            this.maxCoinReachedToast("Warning ! Coins of 0.10 cents have reached their limit")
        }

    };

    maxCoinReachedToast = (alert) => {
        let toast = this.toastCtrl.create({
            message: alert,
            position: 'middle',
            showCloseButton: true,
            closeButtonText: 'X'
        });
        toast.present();
    };
    onMoneyWithdrawn = (coin) => {}
}

