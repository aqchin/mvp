import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-lunch',
  templateUrl: './lunch.component.html',
  styleUrls: ['./lunch.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LunchComponent implements OnInit, OnChanges {
  @Input() meals = [];
  @Input() days: string[] = ['mon', 'tues', 'wednes', 'thurs', 'fri'];
  @Input() prefs: object = {
    mon: {
      time: '12:30-12:45pm',
      restaurant: '',
    },
    tues: {
      time: '12:30-12:45pm',
      restaurant: '',
    },
    wednes: {
      time: '12:30-12:45pm',
      restaurant: '',
    },
    thurs: {
      time: '12:30-12:45pm',
      restaurant: '',
    },
    fri: {
      time: '12:30-12:45pm',
      restaurant: '',
    },
  };
  @Output() updatePrefsEvent: EventEmitter<any> = new EventEmitter();
  restaurants: string[];
  scheduleDay: string = null;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.meals.length > 0) {
      this.restaurants = this.meals.map((entry) => entry['restaurant']);
      this.setScheduleDay(this.meals[0].date);
    }
  }

  setScheduleDay(dateString) { // too hacky
    const [year, xmonth, day] = dateString.split('-');
    this.scheduleDay = this.days[new Date(year, xmonth - 1, day).getDay() - 1];
    // console.log(this.scheduleDay);
  }

  updatePreferences() {
    // console.log('Update preferences!', this.prefs);
    this.updatePrefsEvent.emit(this.prefs);
  }

  onTimeChange(event) {
    // console.log(event);
    this.prefs[event['day']].time = event['time'];
  }

  onRestaurantChange(event) {
    // console.log(event);
    this.prefs[event['day']].restaurant = event['restaurant'];
  }
}

