import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { ChatProvider } from '../../providers/chat/chat';
import { Profile } from '../../models/profile'

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  chats = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public userservice: UserProvider, public chatservice: ChatProvider, public events: Events, public zone: NgZone) {
    this.chats = this.chatservice.recentlychats;

    this.chats.sort(function (a, b) {
      if (a.timestamp < b.timestamp)
        return 1;
      if (a.timestamp > b.timestamp)
        return -1;
      return 0;
    });

    this.events.subscribe('newmessage', () => {
      this.chats = this.chatservice.recentlychats;
      this.chats.sort(function (a, b) {
        if (a.timestamp < b.timestamp)
          return 1;
        if (a.timestamp > b.timestamp)
          return -1;
        return 0;
      });
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }


  add_friend() {
    this.navCtrl.push('SearchPage');
  }

  search() {
    this.navCtrl.push('FriendPage');
  }

}
