import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ToastController } from 'ionic-angular';
import {Http, Headers} from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-add-new-user',
  templateUrl: 'add-new-user.html',
})
export class AddNewUserPage {

  @ViewChild(Navbar) navBar: Navbar;
  public user;
  public callback;
  public peggyUUID;
  public tokenSession;
  public newUserName = '';
  public newUserIsParent;
  public newUserIsChild;
  public password = '';
  public passwordControl = '';
  public rotation = 0;
  public urlCreateUser = 'https://chic.tic.heia-fr.ch/users';
  public red: boolean = false;
  public blue: boolean = false;
  public green: boolean = false;
  public yellow: boolean = false;
  public brown : boolean = false;
  public pink : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController) {
    this.user = this.navParams.get('user');
    this.callback = this.navParams.get('callback');
    this.peggyUUID = this.navParams.get('peggyUUID');
    this.tokenSession = this.navParams.get('tokenSession');
    this.rotation = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewUserPage');
    this.navBar.backButtonClick =(e:UIEvent) =>{
      this.callback(this.user, this.peggyUUID, this.tokenSession).then(()=>{
        this.navCtrl.pop();
      });
    };
  }

  validateUserInformations = () =>{
    if((this.password != '') && (this.newUserName != '')){
      if(this.newUserIsParent == true){
        console.log("Password: "+ this.password);
        console.log("Password Validation: "+ this.passwordControl);
        if(this.password == this.passwordControl){
          this.createUser(true);
        }else{
          this.wrongPasswordToast();
          this.password = '';
          this.passwordControl = '';
        }
      }
      if(this.newUserIsChild == true){
        if(this.red == true){
          this.password += 'Red';
          this.red = false;
        }
        if(this.blue == true){
          this.password += 'Blue';
          this.blue = false;
        }
        if(this.brown == true){
          this.password += 'Brown';
          this.brown = false;
        }
        if(this.pink == true){
          this.password += 'Pink';
          this.pink = false;
        }
        console.log("Password: "+ this.password);
        this.createUser(false);
      }
    }else{
      this.noFullFieldToast();
      this.password = '';
      this.passwordControl = '';
      this.rotation = 0;
    }
  };

  createUser = (isParent) =>{

    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.tokenSession);
    headers.append('Content-Type', 'application/json');

    let body = {
      "name": this.newUserName,
      "password": this.password,
      "isParent": isParent
    };

    var promise = new Promise((resolve, reject) =>{
      this.http.post(this.urlCreateUser, JSON.stringify(body), {headers: headers})
          .map((res: any) => res.json())
          .subscribe(data =>{
                console.log("Data: " + JSON.stringify(data));
                  resolve();
              },
              err => console.log("Error: " + err));

    });
    promise.then(()=>{
      this.password = '';
      this.newUserName = '';
      this.newUserIsParent = false;
      this.newUserIsChild = false;
      this.newUserName = '';
      this.rotation = 0;
      this.successToast();
      console.log("Promise create user finished");
    })
  }

  successToast = () => {
    let toast = this.toastCtrl.create({
      message: 'User was created successfully',
      duration: 3000,
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'X'
    });
    toast.present();
  };

  wrongPasswordToast = () => {
    let toast = this.toastCtrl.create({
      message: 'Passwords do not match, please do it again',
      duration: 4000,
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'X'
    });
    toast.present();
  };

  noFullFieldToast = () => {
    let toast = this.toastCtrl.create({
      message: 'You must fill all the field',
      duration: 4000,
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'X'
    });
    toast.present();
  };

  isParentPressed = () => {
    if(this.newUserIsParent == true && this.newUserIsChild == true){
      this.newUserIsChild = false;
      this.password = '';
      this.rotation = 0;
    }
  };

  isChildPressed = () => {
    if(this.newUserIsChild == true && this.newUserIsParent == true){
      this.newUserIsParent = false;
      this.password = '';
      this.rotation = 0;
    }
  };

  addToPasswordChild = () =>{
    if(this.red == true){
      this.password += 'Red';
      this.red = false;
    }
    if(this.blue == true){
      this.password += 'Blue';
      this.blue = false;
    }
    if(this.green == true){
      this.password += 'Green';
      this.green = false;
    }
    if(this.yellow == true){
      this.password += 'Yellow';
      this.yellow = false;
    }
    if(this.brown == true){
      this.password += 'Brown';
      this.brown = false;
    }
    if(this.pink == true){
      this.password += 'Pink';
      this.pink = false;
    }
    console.log("Password: " + this.password);
    this.rotation++;
  };

  redPressed(){
    if((this.red == true) && ((this.blue == true) || (this.green == true) || (this.yellow == true) || (this.pink == true) || (this.brown == true))){
      this.blue = false;
      this.green = false;
      this.yellow = false;
      this.pink = false;
      this.brown = false;
    }
  }

  bluePressed(){
    if((this.blue == true) && ((this.red == true) || (this.green == true) || (this.yellow == true) || (this.pink == true) || (this.brown == true))){
      this.red = false;
      this.green = false;
      this.yellow = false;
      this.pink = false;
      this.brown = false;
    }

  }

  greenPressed(){
    if((this.green == true) && ((this.red == true) || (this.blue == true) || (this.yellow == true) || (this.pink == true) || (this.brown == true))){
      this.red = false;
      this.blue = false;
      this.yellow = false;
      this.pink = false;
      this.brown = false;
    }
  }

  yellowPressed(){
    if((this.yellow == true) && ((this.red == true) || (this.green == true) || (this.blue == true) || (this.pink == true) || (this.brown == true))){
      this.red = false;
      this.green = false;
      this.blue = false;
      this.pink = false;
      this.brown = false;
    }
  }

  pinkPressed(){
    if((this.pink == true) && ((this.red == true) || (this.green == true) || (this.blue == true) || (this.yellow == true) || (this.brown == true))){
      this.red = false;
      this.green = false;
      this.blue = false;
      this.yellow = false;
      this.brown = false;
    }
  }

  brownPressed(){
    if((this.brown == true) && ((this.red == true) || (this.green == true) || (this.blue == true) || (this.yellow == true) || (this.pink == true))){
      this.red = false;
      this.green = false;
      this.blue = false;
      this.pink = false;
      this.yellow = false;
    }

  }

}
