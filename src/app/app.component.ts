import { Component, HostListener } from '@angular/core';
import axios from 'axios';
import * as moment from 'moment-timezone';
import { Socket } from 'ngx-socket-io';
import { DateTimeFormat } from './datetime-format';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'realtimeChatApplication';
  username = '';
  isLogin: boolean = false;
  activeUserList: Array<any> = [];
  newMessage: string;
  messages: Array<any>= [];
  selectedUserId: string;
  currentUserData: any = {};
  isNameEdit: boolean = false;
  activeUserIntervalId: any;

  constructor(private socket: Socket) {
    let userData: any = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : '';
    if(userData && userData['user_id']) {
      this.currentUserData = userData;
      this.socketMessage();
      let tabCount:any = parseInt(localStorage.getItem('tabCount')) + 1;
      localStorage.setItem('tabCount', tabCount + '');
      this.isLogin = true;
      this.getUserList();
      this.autoRefresh();
      window.scroll(0, 0);
    }
  }

  @HostListener('window:unload', ['$event'])
  unloadHander(event) {
    let tabCount:any = parseInt(localStorage.getItem('tabCount'));
    if(tabCount < 0 && this.currentUserData['user_id']) {
      clearInterval(this.activeUserIntervalId);
      this.logout();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    let tabCount:any = parseInt(localStorage.getItem('tabCount')) - 1;
    localStorage.setItem('tabCount', tabCount + '');
    clearInterval(this.activeUserIntervalId);
  }

  socketMessage() {
    this.socket.on('updateUser', socketData => {
      const isUserIndex: number = this.activeUserList.findIndex(item => item['user_id'] === socketData['user_id']);
      if(isUserIndex >= 0) {
        this.activeUserList[isUserIndex]['name'] = socketData['name'];
      }
    });

    this.socket.on('newUser', socketData => {
      this.activeUserList.push(socketData);
    });

    this.socket.on('chat', socketData => {
      if([this.currentUserData['user_id'], this.selectedUserId].includes(socketData['from_user_id'])  &&  [this.currentUserData['user_id'], this.selectedUserId].includes(socketData['to_user_id'])) {
        this.messages.push(socketData);
      }
    });
  }

  async joinChat() {
    try {
      const loginResponse = await axios.post('http://localhost:3000/userReg', {
        "name": this.username,
      });
      this.currentUserData = loginResponse.data;
      localStorage.setItem('userData', JSON.stringify(this.currentUserData));
      localStorage.setItem('tabCount', '1');
      this.socketMessage();
      this.isLogin = true;
      this.getUserList();
      this.autoRefresh();
    } catch (err) {
      console.log(err);
    }
  }

  async getUserList() {
    try {
      const response = await axios.get('http://localhost:3000/getActiveUsers');
      this.activeUserList = response.data.filter(item => item.name != this.currentUserData['name']);
      this.selectedUserId = this.activeUserList.length ? this.activeUserList[0].user_id : '';
      this.selectUser(this.selectedUserId);
    } catch (err) {
      console.log(err);
      this.isLogin = false;
    }
  }

  async selectUser(id) {
    try {
      this.selectedUserId = id;
      const response = await axios.get(`http://localhost:3000/getAllMessageById/from/${this.currentUserData['user_id']}/to/${this.selectedUserId}`);
      this.messages = response.data;
    } catch (err) {
      console.log(err);
    }
  }
  async sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/sendMessage', {
        "from_user_id": this.currentUserData['user_id'],
        "to_user_id": this.selectedUserId,
        "message": this.newMessage,
        "messageCreatedTime": moment().tz('Asia/Calcutta').format()
      });
      this.newMessage = '';
    } catch (err) {
      console.log(err);
    }
  }

  editName() {
    this.isNameEdit = !this.isNameEdit;
  }

  async saveName() {
    try {
      const response = await axios.put('http://localhost:3000/saveName', {
        "userId": this.currentUserData['user_id'],
        "name": this.currentUserData['name'],
      });
      this.isNameEdit = !this.isNameEdit;
      let userData = JSON.parse(localStorage.getItem("userData"));
      userData['name'] = response.data['name'];
      localStorage.setItem("userData", JSON.stringify(userData));
    } catch (err) {
      console.log(err);
    }
  }

  logout() {
    localStorage.clear();
    axios.post('http://localhost:3000/logout', {
      "userId": this.currentUserData['user_id'],
    });
    window.location.reload();
  }

   autoRefresh() {
    this.activeUserIntervalId = setInterval(async () => {
      try {
        const response = await axios.get('http://localhost:3000/getActiveUsers');
        this.activeUserList = response.data.filter(item => item.name != this.currentUserData['name']);
      } catch (err) {
        console.log(err);
      }
    },1000 * 60)
  }

}
