import { Component, OnInit, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-parks',
  templateUrl: './parks.component.html',
  styleUrls: ['./parks.component.css']
})
@Injectable()
export class ParksComponent implements OnInit {
  title: string = 'US National Parks';
  lat: number = 40.654541;
  lng: number = -96.650221;
  zoom: number = 4;

  markers: marker[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    readLocationMarkers(this);
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

function readLocationMarkers(t) {
var markers = [];
  t.http.get("/getPins").subscribe(res=> {
    res.forEach(item => {
      markers.push({
        lat: Number(item['lat']),
        lng: Number(item['lng']),
        label: item['label'],
        visitor: item['visitor'],
        location: item['location']
      });
    });
    t.markers = markers;
  });
}