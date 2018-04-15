import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Message } from './models/message';
import { Observable, Subject, BehaviorSubject, Subscriber, Subscription } from 'rxjs';
import { ElectronService } from '../../providers/electron.service';
import { timeInterval } from 'rxjs/operators';
import { timeout } from 'rxjs/operator/timeout';
import { availableNames } from './names'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _electronService: ElectronService, private changeDetector: ChangeDetectorRef) { }

  public newMessage: string = null;


  public messages: Subject<Message[]>;
  private me: string;

  ngOnInit() {
    var randName = Math.floor((Math.random() * availableNames.length));
    this.me = availableNames[randName];
    this.messages = new BehaviorSubject([]);
    this._electronService.subscribeToIpcMsg('chat-msg-rcv', (sender, msg: Message) => {
      this.messages.take(1).subscribe(current => {
        current.push(msg);
        this.messages.next(current);
        setInterval(() => this.changeDetector.detectChanges(), 200);
      });
    });
  }

  onKey(event: KeyboardEvent) {
    if (event.which == 13) {
      this.sendMessage();
    }
  }

  addClient() {
    this._electronService.sendIpcMsg('create-new-window');
  }

  sendMessage() {
    if (this.newMessage == null || this.newMessage.trim().length == 0) {
      return;
    }

    var msg: Message = {
      author: this.me,
      text: this.newMessage,
      time: new Date
    };
    this._electronService.sendIpcMsg('chat-msg', msg);
    this.newMessage = null;
  }
}
