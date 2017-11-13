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
      time: '12:30pm-12:45pm',
      restaurant: '',
      objectId: null,
    },
    tues: {
      time: '12:30pm-12:45pm',
      restaurant: '',
      objectId: null,
    },
    wednes: {
      time: '12:30pm-12:45pm',
      restaurant: '',
      objectId: null,
    },
    thurs: {
      time: '12:30pm-12:45pm',
      restaurant: '',
      objectId: null,
    },
    fri: {
      time: '12:30pm-12:45pm',
      restaurant: '',
      objectId: null,
    },
  };
  @Output() updatePrefsEvent: EventEmitter<any> = new EventEmitter();
  @Output() setTodaysMealEvent: EventEmitter<any> = new EventEmitter();
  restaurants: string[];
  mealMap = {};
  idMap = {};
  scheduleDay: string = null;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.meals.length > 0) {
      this.restaurants = this.meals.map((entry) => {
        this.mealMap[entry['restaurant']] = entry['meal'];
        this.idMap[entry['restaurant']] = entry['objectId'];
        return entry['restaurant'];
      });
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

  setTodaysMeal() {
    this.setTodaysMealEvent.emit(this.prefs);
  }

  onTimeChange(event) {
    // console.log(event);
    this.prefs[event['day']].time = event['time'];
  }

  onRestaurantChange(event) {
    // console.log(event);
    this.prefs[event['day']].restaurant = event['restaurant'];
    this.prefs[event['day']].objectId = this.idMap[event['restaurant']] || null;
  }
}

