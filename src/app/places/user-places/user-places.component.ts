import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';

import {PlacesContainerComponent} from '../places-container/places-container.component';
import {PlacesComponent} from '../places.component';

import {Subscription} from "rxjs";
import {PlacesService} from "../places.service";

@Component({
    selector: 'app-user-places',
    standalone: true,
    templateUrl: './user-places.component.html',
    styleUrl: './user-places.component.css',
    imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit, OnDestroy {

    private placeService  = inject(PlacesService);

    places = this.placeService.userPlacesReadOnly
    private subscription: Subscription | undefined = undefined;
    error = signal("");
    isFetching = signal(true);


    ngOnInit() {
        this.subscription = this.placeService.loadUserPlaces().subscribe({
            error: error => {
                console.error(error.message);
                this.error.set("Something went wrong while fetching favourite places");
            },
            complete: () => this.isFetching.set(false)
        })
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

}
