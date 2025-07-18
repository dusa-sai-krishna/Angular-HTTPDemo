import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';

import {PlacesContainerComponent} from '../places-container/places-container.component';
import {PlacesComponent} from '../places.component';

import {Subscription} from "rxjs";
import {PlacesService} from "../places.service";
import {ErrorService} from "../../../../shared/error.service";
import {Place} from "../place.model";

@Component({
    selector: 'app-user-places',
    standalone: true,
    templateUrl: './user-places.component.html',
    styleUrl: './user-places.component.css',
    imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit, OnDestroy {

    private placeService  = inject(PlacesService);
private errorService = inject(ErrorService);
    places = this.placeService.userPlacesReadOnly
    private subscription: Subscription | undefined = undefined;
    error = signal("");
    isFetching = signal(true);


    onSelectPlace(place:Place){

        this.placeService.removeUserPlace(place.id).subscribe({
            error:error=>{
                this.errorService.showError("Error while removing user places.");
                console.log(error.message);
        },
            complete: ()=>{
                this.isFetching.set(false);
            }
        })
    }

    ngOnInit() {
        this.subscription = this.placeService.loadUserPlaces().subscribe({
            error: error => {
                console.error(error.message);
                this.error.set("Something went wrong while fetching favourite places");
                this.errorService.showError("Something went wrong while fetching favourite places");
            },
            complete: () => this.isFetching.set(false)
        })
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

}
