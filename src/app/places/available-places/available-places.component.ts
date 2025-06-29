import {Component, OnDestroy, OnInit, signal} from '@angular/core';

import {Place} from '../place.model';
import {PlacesComponent} from '../places.component';
import {PlacesContainerComponent} from '../places-container/places-container.component';
import {inject} from "@angular/core" ;
// import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {PlacesService} from "../places.service";

@Component({
    selector: 'app-available-places',
    standalone: true,
    templateUrl: './available-places.component.html',
    styleUrl: './available-places.component.css',
    imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit, OnDestroy {
    places = signal<Place[] | undefined>(undefined);
    // private httpClient = inject(HttpClient);
    private placeService = inject(PlacesService);
    isFetching = signal(true);
    private subscription?: Subscription;

    ngOnInit() {
        this.subscription = this.placeService.loadAvailablePlaces()
            .subscribe({
                next: (resData) => this.places.set(resData.places),
                complete: () => this.isFetching.set(false)
            });
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    onSelectPlace(selectedPlace: Place) {
        this.placeService.addPlaceToUserPlaces(selectedPlace).subscribe({
            complete: () => {
                console.log(`Selected Place: ${selectedPlace.id}`)
            },
            error: () => {
                console.error(`Selected Place: ${selectedPlace.id}`)
            }
        })
    }


}
