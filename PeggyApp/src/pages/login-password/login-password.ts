import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/map';

/**
 * Generated class for the LoginPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login-password',
  templateUrl: 'login-password.html',
})
export class LoginPasswordPage {

  public user;
  public rotation;
  public password;
  public tokenSession;
  public errorPassword;
  public urlAuth = 'https://chic.tic.heia-fr.ch/auth';
  red: boolean = false;
  blue: boolean = false;
  green: boolean = false;
  yellow: boolean = false;
  brown : boolean = false;
  pink : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
    this.user = this.navParams.get('user');
    console.log("## USER INFORMATION : " + JSON.stringify(this.user));
    this.password = '';
    this.rotation = 0;
    this.tokenSession = '';
    this.errorPassword = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPasswordPage');
  }

  addToPasswordChild(){
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
  }

  loginChild(){
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
    console.log("Password: " + this.password);
    this.sendPassword();
  }

  loginParent(){
    console.log("Password:"+ this.password);
    this.sendPassword();
  }

  sendPassword(){
    console.log("Send Password");
    this.http.get(this.urlAuth +'?uuid='+ this.user.uuid +'&password='+ this.password)
      .map((res:any) => res.json())
      .subscribe(data => this.correctPassword(data),
                 err => this.wrongPassword(err));
  }

  correctPassword(data){
    this.tokenSession = data.token;
    console.log("Token Session value: "+ this.tokenSession);
    console.log("User information" + JSON.stringify(this.user));
    this.navCtrl.push(HomePage, {user: this.user, tokenSession: this.tokenSession});
    this.rotation = 0;
    this.password = '';
    console.log("Password after correct:"+ this.password);
  }

  wrongPassword(error){
    console.log("Wrong Password:"+ error);
    this.errorPassword = true;
    this.rotation = 0;
    this.password = '';
  }

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
