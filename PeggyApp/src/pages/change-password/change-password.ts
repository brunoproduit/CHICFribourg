import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers} from '@angular/http';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  public user;
  public rotation;
  public password;
  public passwordValidation;
  public passwordMatch;
  public passwordChangeSuccess;
  public tokenSession;
  public urlChangePassword = 'https://chic.tic.heia-fr.ch/users';
  red: boolean = false;
  blue: boolean = false;
  green: boolean = false;
  yellow: boolean = false;
  brown : boolean = false;
  pink : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
    this.user = this.navParams.get('user');
    this.tokenSession = this.navParams.get('tokenSession');
    this.passwordMatch = true;
    this.passwordChangeSuccess = false;
    this.password = '';
    this.rotation = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  changePasswordParent = () =>{
    console.log("Password: "+ this.password);
    console.log("Password Validation: "+ this.passwordValidation);
    if(this.password == this.passwordValidation){
      this.passwordMatch = true;
      this.changePassword(this.password);
    }else{
      this.passwordMatch = false;
      this.passwordChangeSuccess = false;
    }

  };

  changePasswordChild = () =>{
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
    this.changePassword(this.password);
  };

  changePassword = (password) =>{
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.tokenSession);
    headers.append('Content-Type', 'application/json');

    let body = {
      "uuid": this.user.uuid,
      "name": this.user.name,
      "password": password,
      "isParent": this.user.isparent
    }

    this.http.put(this.urlChangePassword, JSON.stringify(body), {headers: headers})
        .map((res: any) => res.json())
        .subscribe(data =>{
              console.log("Data: " + JSON.stringify(data));
              this.passwordChangeSuccess = true;
              },
            err => console.log("Error: " + err));
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
