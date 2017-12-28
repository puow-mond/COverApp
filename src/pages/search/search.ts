import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from 'angularfire2/database'
import { Chat } from "../../models/chat"

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  username;
  profile = {} as Chat;

  //Attribute for ngIf
  user_not_found: boolean;
  showDiscription: boolean;
  showSpinner: boolean;
  showAddFriend_button: boolean;
  showAdded_button: boolean;

  constructor(private afAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams,
    private afDatabase: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    this.showSpinner = false;
    this.showDiscription = false;
    this.user_not_found = false;
    console.log('ionViewDidLoad SearchPage');
  }

  async search() {
    this.user_not_found = false;
    this.showSpinner = true;
    this.showDiscription = false;
    this.showAdded_button = false;
    this.showAddFriend_button = false;
    this.profile = {} as Chat;

    let search = this.username;
    var found_profile;

    if (this.username) {
      await this.afDatabase.database.ref(`profile/`).once('value').then(function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
          var profile = userSnapshot.val();
          if (!profile || profile.user_name == undefined) {
            //skip
          }
          else if (profile.user_name == search) {
            found_profile = profile;
            return 1;
          }
        });
      })
    }

    if (found_profile) {
      var valid = true;
      // copy information for push to request.
      this.profile.user_name = found_profile.user_name;
      this.profile.first_name = found_profile.first_name;
      this.profile.last_name = found_profile.last_name;
      this.profile.photo_url = found_profile.photo_url;
      await this.afAuth.authState.subscribe(async data => {
        if (found_profile)
          await this.afDatabase.database.ref(`request/${data.uid}`).once('value').then(function (snapshot) {
            snapshot.forEach(async function (userSnapshot) {
              var requested = await userSnapshot.val();
              console.log(requested);
              if (!requested || requested.user_name == undefined) {
                //skip
              }
              else if (requested.user_name == found_profile.user_name) {
                valid = false;
                return 2;
              }
            });
          })
        if (valid)
          this.showAddFriend_button = true;
        else
          this.showAdded_button = true;
        this.showDiscription = true;
      });
    }

    else { // user not found!
      this.showDiscription = false;
      this.user_not_found = true;
    }
    this.showSpinner = false;
  }

  async addFriend() {
    await this.afAuth.authState.subscribe(auth => {
      this.afDatabase.list(`request/${auth.uid}`).push(this.profile);
    });
    this.showAddFriend_button = false;
    this.showAdded_button = true;
  }

}
