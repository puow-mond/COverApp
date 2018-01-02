import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Profile } from "../../models/profile"

/**
 * Generated class for the ChangeprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changeprofile',
  templateUrl: 'changeprofile.html',
})
export class ChangeprofilePage {
  loading;
  profile = {} as Profile;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public userservice: UserProvider, public loadingCtrl: LoadingController) {
    this.profile = this.userservice.my_profile;
  }
  presentLoadingText() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading Please Wait...'
    });
    this.loading.present();
  }

  update() {
    this.userservice.updateMyProfile(this.profile);
  }

}
