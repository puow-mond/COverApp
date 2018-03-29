import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import firebase from 'firebase';
/**
 * Generated class for the BuddychatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-buddychat',
  templateUrl: 'buddychat.html',
})
export class BuddychatPage {
  @ViewChild('content') content: Content;
  buddy: any;
  my_profile: any;
  newmessage;
  allmessages = [];
  buddymesseges = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider,
    public events: Events, public zone: NgZone) {
    this.buddy = this.chatservice.buddy;
    this.my_profile = this.chatservice.my_profile;
   // console.log(this.buddy);
    if (this.chatservice.allChats) {
      this.allmessages = this.chatservice.allChats;
      this.buddymesseges = Object.keys(this.allmessages[this.buddy.uid]);
    }

    this.scrollto();
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.zone.run(() => {
        if (this.chatservice.allChats) {
          this.allmessages = this.chatservice.allChats;
          this.buddymesseges = Object.keys(this.allmessages[this.buddy.uid]);
        }
      })
    })
  }

  addmessage() {
    this.chatservice.addnewmessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidEnter() {
    console.log("HEL");
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

}