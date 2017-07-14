import {Component, NgModule, NgZone, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {LoginPasswordPage} from '../login-password/login-password';
import {Http, Headers} from '@angular/http';
import {BleProvider} from '../../providers/ble/ble'
import 'rxjs/add/operator/map';
import {HomePage} from "../home/home";

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


    constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private platform: Platform, public ble: BleProvider, private zone: NgZone, private storage: Storage, public toastCtrl: ToastController) {
        this.isConnectedToPeggy = false;
        platform.ready().then(() => {
            ble.findDevice();
        });
    }

    /**
     * This function is called everytime the page is showed (even if the page is already loaded)
     */

    ionViewWillEnter = () => {
        this.getListOfUsers();
    };

    /*
     * This function is called everytime the page has finished loading. Inside it, we set the callback parameters to
     * transmit the important information between pages.
     * */
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
                    this.createAccountWarningToast();
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

    /**
     * Function to get from the server the list of users of the Peggy
     */

    getListOfUsers = () => {
        this.http.get(this.urlGetListOfUsers + '?uuid=' + this.lastPeggyUUID)
            .map(res => res.json()).subscribe(data => {
            this.users = data;
            console.log("List of Users: " + JSON.stringify(this.users));
        });
    };


    /**
     *
     * function to navigate to the password page
     */
    goToPassword(user) {
        this.isConnectedToPeggy = this.ble.getIsConnected();
        console.log("isConnectedToPeggy: " + this.isConnectedToPeggy);
        this.navCtrl.push(LoginPasswordPage, {user: user, peggyUUID: this.lastPeggyUUID});
    }

    /**
     * function to set the UUID of the last Peggy used into the memory of the phone
     */

    setLastUUIDInDB = () => {
        this.storage.set('lastPeggyUUIDD', this.lastPeggyUUID).then((set) => {
            console.log("SET in DB:" + set);
        });
    };

    /**
     * function to get the UUID of the last Peggy used from the memory of the phone
     */
    getLastUUIDFromDB = () => {
        return new Promise((resolve, reject) => {
            this.storage.get('lastPeggyUUIDD').then((data) => {
                console.log("GET from DB: " + data);
                resolve(data);
            });
        });
    };

    /**
     * function to get the UUID from the Peggy itself, it will call the function readPeggyUUID from the BleProvider
     */

    getUUIDFromDevice = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.ble.readPeggyUUID();
            }, 1000);
            resolve();
        });
    };

    /**
     * Function to delete the UUID of the last Peggy used from the memory of the phone
     */

    removeLastUUIDFromDB = () => {
        this.storage.remove('lastPeggyUUIDD').then((remove) => {
            console.log("Remove from DB: " + remove);
        });
    };

    /**
     * Function to control if the parameters to create an account are correct
     */
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

    /**
     * function to request the server to create a new Peggy with a new user
     */

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
                    this.createAccountErrorToast()
                });

    };

    createAccountErrorToast = () => {
        let toast = this.toastCtrl.create({
            message: "Error while trying create account, check your internet connection or server might be offline",
            duration: 3000,
            position: 'middle',
            showCloseButton: true,
            closeButtonText: 'X'
        });
        toast.present();
    };

    createAccountWarningToast = () => {
        let toast = this.toastCtrl.create({
            message: "A parent must create the first account on the Peggy!",
            position: 'middle',
            showCloseButton: true,
            closeButtonText: 'X'
        });
        toast.present();
    };
}