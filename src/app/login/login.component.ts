import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit(): void {
    console.log('onSubmit() called');
    const body = {
      email: this.email,
      password: this.password,
    };

    this.http.post('/login', body).subscribe(data => {
      console.log('Got a reply!', data);
    });
  }
}
