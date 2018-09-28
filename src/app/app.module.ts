import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { WeddingComponent } from './wedding/wedding.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { GalleryComponent } from './gallery/gallery.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ParksComponent } from './parks/parks.component';
import { RsvpComponent } from './rsvp/rsvp.component';
import { RegistryComponent } from './registry/registry.component';
import { StoryComponent } from './story/story.component';
import { PeopleComponent } from './people/people.component';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { DetailsComponent } from './details/details.component';


@NgModule({
  declarations: [
    AppComponent,
    WeddingComponent,
    ScheduleComponent,
    GalleryComponent,
    NavigationComponent,
    ParksComponent,
    RsvpComponent,
    RegistryComponent,
    StoryComponent,
    PeopleComponent,
    DetailsComponent,
    
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBxFdXdIWjH5KPaTtm4YjTO58SRQQo1UyE'
    }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


