import {Component, NgModule, NgZone, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
//import { HomePage } from '../home/home';
import { LoginPasswordPage } from '../login-password/login-password';
import { Http } from '@angular/http';
import { BleProvider } from '../../providers/ble/ble'
import 'rxjs/add/operator/map';
import { InsertMoneyPage } from "../insert-money/insert-money";

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
@NgModule({
  providers: [BleProvider],
})

export class LoginPage implements OnInit{

  public users;
  public isConnectedToPeggy;
  public urlGetListOfUsers = 'https://chic.tic.heia-fr.ch/users';
  public lastPeggyUUID = 'cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1';

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private platform: Platform, public ble: BleProvider, private zone: NgZone) {
    this.isConnectedToPeggy = false;
    platform.ready().then(() => {
      ble.findDevice();
    });
  }

  ngOnInit(){
    var getUsers = this.getListOfUsers();
    getUsers.subscribe(data => {
    this.users = data;
    console.log("List of Users: " + JSON.stringify(this.users));
    console.log("isConnectedToPeggy: " + this.isConnectedToPeggy);
   });
  }
  getListOfUsers(){
    let result = this.http.get(this.urlGetListOfUsers + '?uuid='+ this.lastPeggyUUID)
      .map(res => res.json());
    return result;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToPassword(user){
    this.isConnectedToPeggy = this.ble.getIsConnected();
    console.log("isConnectedToPeggy: " + this.isConnectedToPeggy);
    this.navCtrl.push(LoginPasswordPage, {user: user});
  }
  navigate(){
    this.navCtrl.push(InsertMoneyPage);
  }
}
