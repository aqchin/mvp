import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'MealVisitorPal';
  firstName: string;
  lastName: string;
  sessionToken = null;
  restaurants = [];
  prefs = {
    'mon': {},
    'tues': {},
    'wednes': {},
    'thurs': {},
    'fri': {},
  };
  days = Object.keys(this.prefs);

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return !!this.sessionToken;
  }

  onSubmitLogin(body) {
    this.http.post('/login', body).subscribe((data) => {
      console.log('Got a reply!', data);
      this.firstName = data['firstName'];
      this.lastName = data['lastName'];
      this.sessionToken = data['sessionToken'];
      console.log(this.sessionToken);

    }, (err) => {
      console.log('Oh no!', err);
    });
  }

  onUpdatePrefs(event) {
    console.log('onUpdatePrefs listener');
    this.http.post('/lunch', null);
  }
}

