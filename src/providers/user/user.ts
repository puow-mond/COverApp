import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database'
import { Profile } from '../../models/profile'
import { Events } from 'ionic-angular';


/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserProvider {
  fireprofile = firebase.database().ref('/profile');
  authState: any = null;
  allChats: any;
  recentlychats = [];
  my_profile = {} as Profile;

  constructor(public afireauth: AngularFireAuth, private afDatabase: AngularFireDatabase
    , public events: Events) {

  }


  loadMyProfile() {
    this.afireauth.authState.subscribe((auth) => {
      this.authState = auth;
      this.setMyProfile(auth.uid);
    });
  }

  setMyProfile(uid) {
    (this.getuserprofile(uid).then((res: any) => {
      this.my_profile = res;
    }));
  }


  async getuserprofile(uid) {
    var promise = await new Promise((resolve, reject) => {
      this.afDatabase.database.ref(`profile/${uid}`).once('value').then(function (snapshot) {
        resolve(snapshot.val());
      })
    });
    return promise;
  }

  updateMyProfile(temp_profile: Profile) {
    var promise = new Promise(async (resolve, reject) => {
      await this.fireprofile.child(firebase.auth().currentUser.uid).update({
        temp_profile
      }).then(() => {
        resolve(true);
      })
    })
    return promise;
  }

}