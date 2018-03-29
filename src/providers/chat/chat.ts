import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuth } from "angularfire2/auth";
import { UserProvider } from '../../providers/user/user';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChatProvider {
  firebuddychats = firebase.database().ref('/buddychats');
  buddy: any;
  my_profile: any;
  allChats: any;
  recentlychats = [];
  constructor(public events: Events, private afDatabase: AngularFireDatabase,
    public afireauth: AngularFireAuth, public userservice: UserProvider) {

  }

  initializebuddy(buddy) {
    this.buddy = buddy;
  }

  initialize_myProfile(my_profile) {
    this.my_profile = my_profile;
  }

  addnewmessage(msg) {
    if (this.buddy) {
      var promise = new Promise(async (resolve, reject) => {
        await this.firebuddychats.child(firebase.auth().currentUser.uid).child(this.buddy.uid).push({
          sentby: firebase.auth().currentUser.uid,
          message: msg,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          this.firebuddychats.child(this.buddy.uid).child(firebase.auth().currentUser.uid).push({
            sentby: firebase.auth().currentUser.uid,
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => {
            resolve(true);
          })
        })
      })
      return promise;
    }
  }

  getbuddymessages() {
    this.firebuddychats.child(firebase.auth().currentUser.uid).on('value', async (chats) => {
      console.log(chats.val());
      this.allChats = await chats.val();
      this.setRecentlyChats();
      this.events.publish('newmessage');
    })
  }

  setRecentlyChats() {
    var temp = [];
    for (let users of Object.keys(this.allChats)) {
      var user_uid = users;
      var uid = (this.allChats[users][Object.keys(this.allChats[users])[Object.keys(this.allChats[users]).length - 1]].sentby);
      (this.userservice.getuserprofile(user_uid).then((res: any) => {
        temp.push({
          profile: res,
          message: this.allChats[users][Object.keys(this.allChats[users])[Object.keys(this.allChats[users]).length - 1]].message,
          timestamp: this.allChats[users][Object.keys(this.allChats[users])[Object.keys(this.allChats[users]).length - 1]].timestamp
        })
      }));
    }
    this.recentlychats = temp;
  }
}