import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController  } from 'ionic-angular';
import {Profile} from "../../models/profile"
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from 'angularfire2/database'
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profile = {} as Profile;
  loading;

  constructor(public loadingCtrl: LoadingController, private afAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams, private toast: ToastController
    ,
    private afDatabase: AngularFireDatabase) {
  }
  presentLoadingText() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading Please Wait...'
    });
    this.loading.present();
  }

  ionViewDidLoad() {
    this.update();
    console.log('ionViewDidLoad ProfilePage');
  }
 async update(){
   
     this.afAuth.authState.subscribe(data => {
       this.afDatabase.object(`profile/${data.uid}`).valueChanges().subscribe(value => {
        this.profile.birth_date=value.birth_date;
        this.profile.first_name=value.first_name;
        this.profile.last_name=value.last_name;
        this.profile.mobile_number=value.mobile_number;
       });
     });
 }

}
