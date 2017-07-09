import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-delete-user',
  templateUrl: 'delete-user.html',
})
export class DeleteUserPage {

  @ViewChild(Navbar) navBar: Navbar;
  public urlGetListOfUsers = 'https://chic.tic.heia-fr.ch/users';
  public urlDeleteUser = 'https://chic.tic.heia-fr.ch/users/';
  public userSession;
  public users;
  public tokenSession;
  public peggyUUID;
  public callback;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.userSession = this.navParams.get('user');
    this.callback = this.navParams.get('callback');
    this.peggyUUID = this.navParams.get('peggyUUID');
    this.tokenSession = this.navParams.get('tokenSession');
    this.getListOfUsers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeleteUserPage');
    this.navBar.backButtonClick =(e:UIEvent) =>{
      this.callback(this.userSession, this.peggyUUID, this.tokenSession).then(()=>{
        this.navCtrl.pop();
      });
    };
  }

  getListOfUsers = () => {
    this.http.get(this.urlGetListOfUsers + '?uuid=' + this.peggyUUID)
        .map(res => res.json()).subscribe(data => {
        this.users = data;
        console.log("List of Users: " + JSON.stringify(this.users));
    });
  };

  checkToDelete = (user) =>{
    if(user.balance > 0){
      this.noDeleteToast();
    }else if(user.uuid == this.userSession.uuid){
      this.noDeleteYourselfToast();
    } else{
      this.showConfirmDelete(user)
    }
  };

  deleteUser = (user) =>{
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.tokenSession);
    headers.append('Content-Type', 'application/json');

    var promise = new Promise((resolve, reject) => {
      this.http.delete(this.urlDeleteUser + user.uuid, {headers: headers})
          .map(res => res.json()).subscribe(data => {
        console.log("Data: " + JSON.stringify(data));
        resolve();
      });
    });
    promise.then(()=>{
      console.log("Delete user finished");
      this.getListOfUsers();
    })
  };

  showConfirmDelete = (user) =>{
    let confirm = this.alertCtrl.create({
      title: 'Delete user',
      message: 'Are you sure you want to delete this user?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          console.log('Delete user accepted');
          this.deleteUser(user);
        }
      },
        {
          text: 'No',
          handler: () => {
            console.log('Delete user refused');
          }
        }
      ]
    });
    confirm.present();
  }

  noDeleteToast = () => {
    let toast = this.toastCtrl.create({
      message: 'User account is not empty!',
      duration: 3000,
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'X'
    });
    toast.present();
  };

  noDeleteYourselfToast = () => {
    let toast = this.toastCtrl.create({
      message: "You can't delete yourself!",
      duration: 3000,
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'X'
    });
    toast.present();
  };

}
