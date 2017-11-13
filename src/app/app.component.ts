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
  meals = [];
  prefs = {
    'mon': {},
    'tues': {},
    'wednes': {},
    'thurs': {},
    'fri': {},
  };
  days = Object.keys(this.prefs);

  constructor(private http: HttpClient) {
    // this.restaurants = this.sampleRestaurants;
    this.fetchMeals();
  }

  isLoggedIn(): boolean {
    return !!this.sessionToken;
  }

  onLogin(body) {
    this.http.post('/login', body).subscribe((data: object) => {
      console.log('Got a reply!', data);
      this.firstName = data['firstName'];
      this.lastName = data['lastName'];
      this.sessionToken = data['sessionToken'];
      console.log(this.sessionToken);

    }, (err) => {
      console.log('Oh no! We couldn\'t log in:', err);
    });
  }

  fetchMeals() {
    this.http.get('/lunch').subscribe((data: object[]) => {
      // console.log('Got food!', data);
      this.meals = data;

    }, (err) => {
      console.log('Oh no! We couldn\'t find food:', err);
    });
  }

  onUpdatePrefs(event) {
    console.log('onUpdatePrefs listener', event);
    const body = {
      session_token: this.sessionToken.slice(2),
      prefs: event,
    };
    this.http.post('/lunch', body).subscribe((data) => {
      console.log('update success', data);

    }, (err) => {
      console.log('Oh no! We couldn\'t update your preferences:', err);
    });
  }
}

