import {Component, NgModule, NgZone, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {LoginPasswordPage} from '../login-password/login-password';
import {Http, Headers} from '@angular/http';
import {BleProvider} from '../../providers/ble/ble'
import 'rxjs/add/operator/map';
import {HomePage} from "../home/home";

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

export class LoginPage implements OnInit {

    public user = {uuid: "1234", name: "Test", isParent: true, balance: 0, peggyuuid: "4567"};
    public users;
    public name;
    public isConnectedToPeggy;
    public urlGetListOfUsers = 'https://chic.tic.heia-fr.ch/users';
    public urlCreatePeggy = 'https://chic.tic.heia-fr.ch/peggy';
    public lastPeggyUUID;
    public firstTime;
    public password;
    public passwordControl;
    public passwordMatch;
    public errorCreate;



    constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private platform: Platform, public ble: BleProvider, private zone: NgZone, private storage: Storage) {
        this.isConnectedToPeggy = false;
        this.errorCreate = false;
        platform.ready().then(() => {
            ble.findDevice();
        });
    }

    ionViewWillEnter = () =>{
        this.getListOfUsers();
    }

    ngOnInit() {
        setTimeout(() => {
            console.log("do nothing");
        }, 1000);
        setTimeout(() => {
            console.log("state peggyUUID: " + this.ble.peggyUUID);
            console.log("state isConnected: " + this.ble.isConnected);
            if (this.ble.isConnected == true) {
                if (this.ble.peggyUUID == '0-0-00') {
                    this.firstTime = true;
                } else {
                    this.firstTime = false;
                    this.getUUIDFromDevice().then(() => {
                        this.lastPeggyUUID = this.ble.peggyUUID;
                        this.getListOfUsers();
                    });
                }
            } else {
                this.firstTime = false;
                this.getLastUUIDFromDB().then(data => {
                    this.lastPeggyUUID = data;
                    console.log("lastPeggyUUID in DB: " + this.lastPeggyUUID);
                    this.getListOfUsers();
                });
            }
        }, 4000);
    }

    getListOfUsers = () => {
        this.http.get(this.urlGetListOfUsers + '?uuid=' + this.lastPeggyUUID)
            .map(res => res.json()).subscribe(data => {
            this.users = data;
            console.log("List of Users: " + JSON.stringify(this.users));
        });
    };

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    goToPassword(user) {
        this.isConnectedToPeggy = this.ble.getIsConnected();
        console.log("isConnectedToPeggy: " + this.isConnectedToPeggy);
        this.navCtrl.push(LoginPasswordPage, {user: user, peggyUUID: this.lastPeggyUUID});
    }

    setLastUUIDInDB = () => {
        this.storage.set('lastPeggyUUIDD', this.lastPeggyUUID).then((set) => {
            console.log("SET in DB:" + set);
        });
    };
    getLastUUIDFromDB = () => {
        return new Promise((resolve, reject) => {
            this.storage.get('lastPeggyUUIDD').then((data) => {
                console.log("GET from DB: " + data);
                resolve(data);
            });
        });
    };

    getUUIDFromDevice = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.ble.readPeggyUUID();
            }, 1000);
            resolve();
        });
    };

    removeLastUUIDFromDB = () => {
        this.storage.remove('lastPeggyUUIDD').then((remove) => {
            console.log("Remove from DB: " + remove);
        });
    };

    readUUID() {
        this.ble.readPeggyUUID();
    }

    goToHome() {
        this.navCtrl.push(HomePage, {user: this.user});
    }

    onCreateAccount = () => {
        console.log("Name: " + this.name);
        console.log("Password: " + this.password);
        console.log("Password Validation: " + this.passwordControl);
        if (this.password == this.passwordControl) {
            this.passwordMatch = true;
            this.createAccount(this.name, this.password)
        } else {
            this.passwordMatch = false;
        }
    };

    createAccount = (name: string, password: string) => {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        var body = {
            "name": name,
            "password": password
        };

        this.http.post(this.urlCreatePeggy, JSON.stringify(body), {headers: headers})
            .map((res: any) => res.json())
            .subscribe(data => {
                    this.errorCreate = false;
                    console.log("Data: " + JSON.stringify(data));
                    this.lastPeggyUUID = data.peggy.uuid;
                    console.log("lastPeggyUUID after create Peggy: " + this.lastPeggyUUID);
                    this.firstTime = false;
                    this.getListOfUsers();
                    this.setLastUUIDInDB();
                    this.ble.writePeggyUUID(this.lastPeggyUUID);
                },
                err => {
                    console.log("Error: " + err);
                    this.errorCreate = true;
                });

    }

}
/*
 if(this.ble.peggyUUID == ''){
 if(this.ble.isConnected == true) {
 this.getUUIDFromDevice().then(() => {
 console.log("peggyUUID: "+this.ble.peggyUUID);
 if (this.ble.peggyUUID == '0-0-00') {
 this.firstTime = true;
 } else {
 this.lastPeggyUUID = this.ble.peggyUUID;
 console.log("lastPeggyUUID in device: " + this.lastPeggyUUID);
 this.getListOfUsers();
 }
 });
 }else if(this.ble.isConnected == false){
 this.firstTime = false;
 this.getLastUUIDFromDB().then((data) =>{
 this.lastPeggyUUID = data;
 console.log("lastPeggyUUID in DB " + this.lastPeggyUUID);
 this.getListOfUsers();
 });
 }
 }
 */