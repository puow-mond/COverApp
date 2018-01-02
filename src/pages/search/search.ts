import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from 'angularfire2/database'
import { Profile } from "../../models/profile"

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

  profile = {} as Profile;

  username;

  authState: any = null;

  //Attribute for ngIf
  user_not_found: boolean;
  showDiscription: boolean;
  showSpinner: boolean;
  showAddFriend_button: boolean;
  showAdded_button: boolean;

  constructor(private afAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams,
    private afDatabase: AngularFireDatabase) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });

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
    this.profile = {} as Profile;

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
      this.profile = found_profile;
      //  await this.afAuth.authState.subscribe(async data => {
      if (found_profile)
        await this.afDatabase.database.ref(`request/${this.authState.uid}`).once('value').then(function (snapshot) {
          snapshot.forEach(async function (userSnapshot) {
            var requested = await userSnapshot.val();
            var my_requested_uid = requested.sender;
            var friend_uid = found_profile.uid;
            if (!requested || requested.sender == undefined) {
              //skip
            }
            else if (my_requested_uid === friend_uid) {
              console.log("KUY");
              valid = false;
              return 2;
            }
          });
        })
      console.log(valid);
      if (valid)
        this.showAddFriend_button = true;
      else
        this.showAdded_button = true;
      this.showDiscription = true;
      // });
    }

    else { // user not found!
      this.showDiscription = false;
      this.user_not_found = true;
    }
    this.showSpinner = false;
  }

  async addFriend() {
    // await this.afAuth.authState.subscribe(auth => {
    //   this.afDatabase.list(`request/${auth.uid}`).push(this.profile.uid);
    //   this.afDatabase.list(`request/${this.profile.uid}`).push(auth.uid);
    // });
    var request = {} as Request;

    request.sender = this.profile.uid;
    await this.afDatabase.list(`request/${this.authState.uid}`).push(request);
    request.sender = this.authState.uid;
    await this.afDatabase.list(`request/${this.profile.uid}`).push(request);

    this.showAddFriend_button = false;
    this.showAdded_button = true;
  }

}
