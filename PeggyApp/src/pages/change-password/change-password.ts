import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { Http, Headers} from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  @ViewChild(Navbar) navBar: Navbar;
  public user;
  public callback;
  public peggyUUID;
  public rotation;
  public password;
  public passwordValidation;
  public passwordMatch;
  public passwordChangeSuccess;
  public tokenSession;
  public urlChangePassword = 'https://chic.tic.heia-fr.ch/users';
  public red: boolean = false;
  public blue: boolean = false;
  public green: boolean = false;
  public yellow: boolean = false;
  public brown : boolean = false;
  public pink : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
    this.user = this.navParams.get('user');
    this.tokenSession = this.navParams.get('tokenSession');
    this.callback = this.navParams.get('callback');
    this.peggyUUID = this.navParams.get('peggyUUID');
    this.passwordMatch = true;
    this.passwordChangeSuccess = false;
    this.password = '';
    this.rotation = 0;
  }

  /*
   * This function is called everytime the page has finished loading. Inside it, we set the callback parameters to
   * transmit the important information between pages.
   * */
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
    this.navBar.backButtonClick =(e:UIEvent) =>{
      this.callback(this.user, this.peggyUUID, this.tokenSession).then(()=>{
        this.navCtrl.pop();
      });
    };
  }

  /*
  * function that is executed when the user press on the button to validate the new password, it will check that both
  * password are matching
  * */

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

  /*
  * This function will be executed when the user press on the button to validate the new password
  * */

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

  /*
  * function that will request to the server to change the password
  * */

  changePassword = (password) =>{
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.tokenSession);
    headers.append('Content-Type', 'application/json');

    let body = {
      "uuid": this.user.uuid,
      "name": this.user.name,
      "password": password,
      "isParent": this.user.isparent
    };

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
