import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from 'angularfire2/database'
import { ChatProvider } from '../../providers/chat/chat';
import { Profile } from '../../models/profile';
import { RequestFriend } from "../../models/request"
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the FriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friend',
  templateUrl: 'friend.html',
})
export class FriendPage {

  requests: any[];
  friends: any[];

  authState: any = null;

  //my_profile: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth, public chatservice: ChatProvider
    , public userservice: UserProvider) {
    this.update_requestsAndFriends();
  }


  update_requestsAndFriends() {

    this.afAuth.authState.subscribe(async (auth) => {
      this.authState = auth;
      //update my profile
      // var temp_profile = {} as Profile;
      // await this.afDatabase.database.ref(`profile/${auth.uid}`).once('value').then(function (snapshot) {
      //   temp_profile = snapshot.val();
      //   console.log(temp_profile);
      // })
      // this.my_profile = temp_profile;
      //update friends
      this.afDatabase.list(`friend/${auth.uid}`).valueChanges().subscribe(requests => {
        var temp = [];
        for (let request of requests) {
          this.afDatabase.database.ref(`profile/${request.sender}`).once('value').then(function (snapshot) {
            console.log(snapshot.val());
            temp.push(snapshot.val());
          })
        }
        this.friends = temp;
      })
      //update requests
      this.requests = [];
      this.afDatabase.list(`request/${auth.uid}`).valueChanges().subscribe(requests => {
        var temp = [];
        for (let request of requests) {
          this.afDatabase.database.ref(`profile/${request.sender}`).once('value').then(function (snapshot) {
            console.log(snapshot.val());
            temp.push(snapshot.val());
          })
        }
        this.requests = temp;
      })
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendPage');
  }


  async accept(item: any) {
    //delete request
    await this.deleteRequest(item.uid, this.authState.uid);
    await this.deleteRequest(this.authState.uid, item.uid);
    //update friend
    var request = {} as RequestFriend;
    request.sender = this.authState.uid;
    this.afDatabase.list(`friend/${item.uid}`).push(request);
    request.sender = item.uid;
    this.afDatabase.list(`friend/${this.authState.uid}`).push(request);
  }

  async deleteRequest(uid: string, friend_uid: string) {
    var key: string;
    await this.afDatabase.database.ref(`request/${uid}`).once('value').then(function (snapshot) {
      snapshot.forEach(function (userSnapshot) {
        var request = userSnapshot.val();
        if (request.sender = friend_uid) {
          key = userSnapshot.key;
          return 1;
        }
      });
    })
    if (key)
      this.afDatabase.list(`request/${uid}/${key}`).remove();
  }

  chat(buddy: ItemSliding) {
    this.chatservice.initializebuddy(buddy);
    //this.chatservice.initialize_myProfile(this.my_profile);
    this.chatservice.initialize_myProfile(this.userservice.my_profile);
    console.log(buddy);
    this.navCtrl.push('BuddychatPage');
  }

}