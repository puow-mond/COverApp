import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider
    , public userservice: UserProvider) { }

  ionViewDidLoad() {
    this.chatservice.getbuddymessages();
    this.userservice.loadMyProfile();
    console.log('ionViewDidLoad HomePage');
  }



}
