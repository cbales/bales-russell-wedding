import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-parks',
  templateUrl: './parks.component.html',
  styleUrls: ['./parks.component.css']
})
export class ParksComponent implements OnInit {
  title: string = 'US National Parks';
  lat: number = 40.654541;
  lng: number = -96.650221;
  zoom: number = 4;

  markers: marker[] = [
	  {
		  lat: 40.4252,
		  lng: 40.7144,
      label: 'Mt. Rainier National Park',
      visitor: 'Caitlin',
      location: 'Mt. Rainier National Park'
	  },
	  {
		  lat: 51.373858,
		  lng: 7.215982,
      label: 'B',
      visitor: 'Darin',
      location: 'Grand Canyon'
	  },
	  {
		  lat: 51.723858,
		  lng: 7.895982,
      label: 'C',
      visitor: 'Darin & Caitlin',
      location: 'Yellowstone'
	  }
  ]

  constructor() { }

  ngOnInit() {
  }
}

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
  label?: string;
  visitor: string;
  location: string;
}

