import { Component, OnInit } from '@angular/core';
import { Message } from './models/message';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  public newMessage: string = null;

  public messages: BehaviorSubject<Message[]>;
  private me: string;

  ngOnInit() {
    this.me = "Kuba";
    this.messages = new BehaviorSubject([]);
  }

  onKey(event: KeyboardEvent) {
    if (event.which == 13) {
      this.sendMessage();
    }
  }

  sendMessage() {
    console.log(this.newMessage);

    var msg: Message = {
      author: this.me,
      text: this.newMessage,
      time: new Date
    };
    this.messages.take(1).subscribe(current => {
      current.push(msg);
      this.messages.next(current);
    })

    this.newMessage = null;

  }

}
