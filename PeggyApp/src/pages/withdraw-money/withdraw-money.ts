import {Component, NgZone, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, AlertController, Navbar} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {BleProviderCallback} from "../../providers/ble/BleProviderCallback";
import {BleProvider} from "../../providers/ble/ble";


/**
 * Generated class for the WithdrawMoneyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-withdraw-money',
  templateUrl: 'withdraw-money.html',
})
export class WithdrawMoneyPage implements BleProviderCallback {

  @ViewChild(Navbar) navBar: Navbar;
  public user;
  public peggyUUID;
  public callback;
  public amountFrozen;
  public amountWithdrawn;
  public totalWithdrawn;
  public amountAccount;
  public amountValidated:boolean;
  public isConnectedToPeggy;
  public amountToWithdraw;
  public tokenSession;
  public urlWithdrawMoney = 'https://chic.tic.heia-fr.ch/peggy';

  constructor(private bleProvider: BleProvider, private navCtrl: NavController, private navParams: NavParams, public http: Http, public platform: Platform, private zone: NgZone, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      this.user = this.navParams.get('user');
      this.peggyUUID = this.navParams.get('peggyUUID');
      this.tokenSession = this.navParams.get('tokenSession');
      this.callback = this.navParams.get('callback');
      this.amountAccount = this.user.balance;
      this.amountFrozen = this.user.balance;
      this.amountValidated = false;
      this.amountToWithdraw = 0;
      this.amountWithdrawn = 0;
      this.totalWithdrawn = 0;
    });
  }

  /**
   * This function is called everytime the page has finished loading. Inside it, we set the callback parameters to
   * transmit the important information between pages. The callback to the BleProvider is set here
   * */

  ionViewDidLoad() {
    console.log('ionViewDidLoad WithdrawMoneyPage');
    this.bleProvider.setCallback(this);
    this.isConnectedToPeggy = this.bleProvider.isConnected;
    console.log("isConnectedToPeggy"+ this.isConnectedToPeggy);
    this.navBar.backButtonClick =(e:UIEvent) =>{
      this.callback(this.user, this.peggyUUID, this.tokenSession).then(()=>{
        this.navCtrl.pop();
      });
    };
  }

  /**
   * function to increase the value that the user want to withdraw
   */
  addToAmountToWithdraw = (value) =>{
    if(this.amountToWithdraw + value > this.amountAccount){
      console.log("You don't have enough money");
      this.onAlertNotEnoughMoney();
    }else{
      this.amountToWithdraw += value;
      this.amountToWithdraw =  Math.round(this.amountToWithdraw * 10)/10;
    }
  };

  /**
   * Alert displayed if the user has not enough money on his account
   */
  onAlertNotEnoughMoney = () =>{
    let alert = this.alertCtrl.create({
      title: 'Not enough money',
      message: 'You do not possess enough money to withdraw the amount you selected',
      buttons: ['OK'],
    });
    alert.present();
  };

  /**
   * function called when the amount is validated, it will call the function allowToWithdraw from the BleProvider
   */
  validateAmount = () =>{
    this.amountValidated = true;
    this.bleProvider.allowToWithdraw(true);
  };

  /**
   * Function called when the user press on the reset button to reset the amount to withdraw
   */

  resetAmount = () =>{
    this.amountToWithdraw = 0;
  };

  /**
   * function that check if the user has enough money
   */

  checkAmountToWithdrawMoney = (amount) =>{
    if(this.user.balance == 0){
      return false
    }
    if(this.user.balance < amount ){
      return false
    }
    return true;
  };

  /**
   * This function is called from the BleProvider. It is called everytime a notification for a coin withdrawn is
   * received by the smartphone
   */
  onMoneyWithdrawn = (coin) => {
    console.log("TEST moneyWithdrawn called:" + coin);
    let body = {};

    switch (coin) {
      case 'coin10c':
        body = {
          "uuid": this.peggyUUID,
          "coin10c": "-1",
        };
        this.updateMoneyToAccount(body);
        break;
      case 'coin20c':
        body = {
          "uuid": this.peggyUUID,
          "coin20c": "-1",
        };
        this.updateMoneyToAccount(body);
        break;
      case 'coin50c':
        body = {
          "uuid": this.peggyUUID,
          "coin50c": "-1",
        };
        this.updateMoneyToAccount(body);
        break;
      case 'coin1':
        body = {
          "uuid": this.peggyUUID,
          "coin1": "-1",
        };
        this.updateMoneyToAccount(body);
        break;
      case 'coin2':
        body = {
          "uuid": this.peggyUUID,
          "coin2": "-1",
        };
        this.updateMoneyToAccount(body);
        break;
      case 'coin5':
        body = {
          "uuid": this.peggyUUID,
          "coin5": "-1",
        };
        this.updateMoneyToAccount(body);
        break;
    }
  };

  /**
   * Function to request the server to update the amount of the user.
   */
  updateMoneyToAccount = (body) =>{
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.tokenSession);
    headers.append('Content-Type', 'application/json');

    var promise = new Promise((resolve, reject) => {
      this.http.put(this.urlWithdrawMoney, JSON.stringify(body), {headers: headers})
          .map((res: any) => res.json())
          .subscribe(data => {
                console.log("Data: " + JSON.stringify(data));
                this.zone.run(() => {
                  this.amountToWithdraw -= (this.amountAccount - data.balance);
                  this.amountWithdrawn = (this.amountAccount - data.balance);
                  this.totalWithdrawn += this.amountWithdrawn;
                  this.amountAccount = data.balance;
                  this.user.balance = data.balance;
                  resolve();
                });
              },
              err => console.log("Error: " + err));
    });
    promise.then(()=>{
      console.log("Promise withdraw money finished");
      if(this.amountToWithdraw <= 0){
        this.bleProvider.allowToWithdraw(false);
      }
    })
  };

  onMoneyInserted = (coin) => {}

}
