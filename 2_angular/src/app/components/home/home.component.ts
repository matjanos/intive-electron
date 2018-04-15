import { Component, OnInit } from '@angular/core';
import { Message } from './models/message';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _electronService: ElectronService) { }

  public newMessage: string = null;

  public messages: Subject<Message[]>;
  private me: string;

  ngOnInit() {
    this.me = "Kuba";
    this.messages = new BehaviorSubject([]);
    this._electronService.subscribeToIpcMsg('chat-msg-rcv', (sender, msg:Message) => {
      this.messages.take(1).subscribe(current => {
        msg.author = "pong";
        current.push(msg);
        this.messages.next(current);
      })
    });
  }

  onKey(event: KeyboardEvent) {
    if (event.which == 13) {
      this.sendMessage();
    }
  }

  sendMessage() {
    var msg: Message = {
      author: this.me,
      text: this.newMessage,
      time: new Date
    };
    this._electronService.sendIpcMsg('chat-msg', msg);

    this.messages.take(1).subscribe(current => {
      current.push(msg);
      this.messages.next(current);
    })

    this.newMessage = null;

  }

}
