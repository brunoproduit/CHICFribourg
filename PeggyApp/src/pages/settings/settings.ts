import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {ChangePasswordPage} from "../change-password/change-password";
import {AddNewUserPage} from "../add-new-user/add-new-user";
import {DeleteUserPage} from "../delete-user/delete-user";

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public user;
  public tokenSession;
  public peggyUUID;

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform) {
    platform.ready().then(() => {
      this.user = this.navParams.get('user');
      this.tokenSession = this.navParams.get('tokenSession');
    });
  }

  goToChangePassword = () =>{
    this.navCtrl.push(ChangePasswordPage,{user: this.user, tokenSession: this.tokenSession, peggyUUID: this.peggyUUID});
  }

  goToAddNewUser = () =>{
    this.navCtrl.push(AddNewUserPage,{user: this.user, tokenSession: this.tokenSession, peggyUUID: this.peggyUUID});
  }

  goToDeleteUser = () => {
    this.navCtrl.push(DeleteUserPage,{user: this.user, tokenSession: this.tokenSession, peggyUUID: this.peggyUUID});
  }

  ionViewDidLoad = () => {
    console.log('ionViewDidLoad SettingsPage');
  }

}
