import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {
  // @Input() onSubmit: Function;
  @Output() loginEvent: EventEmitter<any> = new EventEmitter();

  email = '';
  password = '';
  sessionId = '';

  constructor() {}

  ngOnInit() {}

  clickSubmit() {
    // console.log('Submit clicked');
    this.loginEvent.emit({
      email: this.email,
      password: this.password,
    });
  }
}
