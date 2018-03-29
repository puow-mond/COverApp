import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from 'angularfire2/database'

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  email;
  password;

  confirm_Password;

  loading;

  constructor(public loadingCtrl: LoadingController, private afAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, private toast: ToastController
    , public alertCtrl: AlertController,
    private afDatabase: AngularFireDatabase) {
  }

  presentLoadingText() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading Please Wait...'
    });
    this.loading.present();
  }

  doAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Invalid information',
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  async register() {

    if (!this.email) {
      this.doAlert("Email must not be empty :)");
    }
    else if (!this.password) {
      this.doAlert("Password must not be empty :)");
    }
    else if (this.confirm_Password != this.password) {
      this.doAlert("Invalid Re-Password :)");
    }
    else {
      try {
        this.presentLoadingText();
        const resultCreate = await this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password);
        if (resultCreate) {
          const resultLogin = await this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
          if (resultLogin) {
            this.navCtrl.setRoot('LoginPage');
          }
        }
      }
      catch (e) {
        console.log(e.message);
        var string = e.message.split(':');
        if (string[1])
          this.toast.create({
            message: `${string[1]}`,
            duration: 3000
          }).present();
        else
          this.toast.create({
            message: `${string[0]}`,
            duration: 3000
          }).present();
      }
      finally {
        this.loading.dismiss();
      }
    }
  }

  goback() {
    this.navCtrl.push('LoginPage');
  }




}