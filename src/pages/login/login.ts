import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';


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
export class LoginPage {
  credentials = {} as User;

  constructor(public loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    private afDatabase: AngularFireDatabase,
    private toast: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loading;

  presentLoadingText() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading Please Wait...'
    });
    this.loading.present();
  }

  async login() {

    try {
      this.presentLoadingText();
      const result = await this.afAuth.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password);
      if (result) {
        this.afAuth.authState.subscribe(data => {
          this.afDatabase.object(`profile/${data.uid}`).valueChanges().subscribe(value => {
            console.log(value);
            if (!value) this.navCtrl.setRoot('ProfileInfoPage');
            //else
            //this.navCtrl.setRoot('TabsPage');
          });
        });
        // this.navCtrl.setRoot('TabsPage');
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


  passwordreset() {
    this.navCtrl.push('PasswordresetPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

}