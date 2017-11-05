import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Profile } from "../../models/profile"
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

  profile = {} as Profile;
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

    if (!this.profile.email) {
      this.doAlert("Email must not be empty :)");
    }
    else if (!this.profile.password) {
      this.doAlert("Password must not be empty :)");
    }
    else if (this.confirm_Password != this.profile.password) {
      this.doAlert("Invalid Re-Password :)");
    }
    else if (!this.profile.first_name) {
      this.doAlert("First name must not be empty :)");
    }
    else if (!this.profile.last_name) {
      this.doAlert("Last name must not be empty :)");
    }
    else if (!this.profile.birth_date) {
      this.doAlert("Birth date must not be empty :)");
    }
    else if (!this.profile.mobile_number) {
      this.doAlert("Mobile number must not be empty :)");
    }
    else {
      try {
        this.presentLoadingText();
        const resultCreate = await this.afAuth.auth.createUserWithEmailAndPassword(this.profile.email, this.profile.password);
        if (resultCreate) {
          const resultLogin = await this.afAuth.auth.signInWithEmailAndPassword(this.profile.email, this.profile.password);
          if (resultLogin) {
            this.afAuth.authState.subscribe(auth => {
              this.afDatabase.object(`profile/${auth.uid}`).set(this.profile).then(() => this.navCtrl.setRoot('HomePage'));
            })
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