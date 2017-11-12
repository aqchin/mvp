import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class MealComponent implements OnInit {
  @Input() day: string;
  @Input() restaurants: string[];
  @Input() isScheduleDay = false;
  @Output() timeChangeEvent: EventEmitter<any> = new EventEmitter();
  @Output() restaurantChangeEvent: EventEmitter<any> = new EventEmitter();
  restaurant: string;
  time: string;
  extendedLunch = false;

  times = [
    '12:30-12:45pm',
    '12:45-1:00pm',
    '1:00-1:15pm',
    '1:15-1:30pm',
  ];
  timesExtended = [
    '1:30-1:45pm',
    '1:45-2:00pm',
    '2:15-2:30pm',
  ];

  constructor() {}

  ngOnInit() {
    this.extendedLunch = new Set(['tues', 'thurs']).has(this.day);
    // console.log(this.day, this.isScheduleDay);
  }

  onTimeChange(event) {
    // console.log('onTimeChange', event.target.value);
    // console.log(this.day, this.isScheduleDay);
    this.timeChangeEvent.emit({
      day: this.day,
      time: event.target.value
    });
  }

  onRestaurantChange(event) {
    // console.log('onRestaurantChange', event.target.value);
    this.restaurantChangeEvent.emit({
      day: this.day,
      restaurant: event.target.value,
      index: event.target.key
    });
  }
}

