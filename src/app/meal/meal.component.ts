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
  @Output() timeChangeEvent: EventEmitter<any> = new EventEmitter();
  @Output() restaurantChangeEvent: EventEmitter<any> = new EventEmitter();
  restaurant: string;
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
  sampleRestaurants = [
    'ponda aspres',
    'tolk o bel',
    'mcdonels',
    'bergor kin',
    'Chick-Fil-A',
  ];

  constructor() {}

  ngOnInit() {
    if (['tues', 'thurs'].indexOf(this.day) !== -1) {
      this.extendedLunch = true;
    }
  }

  onTimeChange() {
  }

  onRestaurantChange() {
  }
}
