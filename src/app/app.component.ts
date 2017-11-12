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

  // sampleRestaurants = [
  //   'ponda aspres',
  //   'tolk o bel',
  //   'mcdonels',
  //   'bergor kin',
  //   'Chick-Fil-A',
  // ];

  constructor(private http: HttpClient) {
    // this.restaurants = this.sampleRestaurants;
    this.fetchMeals();
  }

  isLoggedIn(): boolean {
    return !!this.sessionToken;
  }

  onLogin(body) {
    this.http.post('/login', body).subscribe((data) => {
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
      // this.restaurants = data.map((entry) => entry['restaurant']);

    }, (err) => {
      console.log('Oh no! We couldn\'t find food:', err);
    });
  }

  onUpdatePrefs(event) {
    console.log('onUpdatePrefs listener');
    // this.http.post('/lunch', null);
  }
}

