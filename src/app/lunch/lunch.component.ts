import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-lunch',
  templateUrl: './lunch.component.html',
  styleUrls: ['./lunch.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LunchComponent implements OnInit {
  @Input() restaurants: string[];
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

  constructor() {}

  ngOnInit() {}

  updatePreferences() {
    console.log('Update preferences!', this.prefs);
    this.updatePrefsEvent.emit(this.prefs);
  }

  onTimeChange(event) {
    console.log(event);
    this.prefs[event['day']].time = event['time'];
  }

  onRestaurantChange(event) {
    console.log(event);
    this.prefs[event['day']].restaurant = event['restaurant'];
  }
}

