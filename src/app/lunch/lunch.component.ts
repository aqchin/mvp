import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-lunch',
  templateUrl: './lunch.component.html',
  styleUrls: ['./lunch.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LunchComponent implements OnInit {
  @Input() restaurants;
  @Output() updatePrefsEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  updatePreferences() {
    console.log('Update preferences!');
    this.updatePrefsEvent.emit({
    // pass some shit 
    });
  }
}

