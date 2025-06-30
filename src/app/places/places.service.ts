import {inject, Injectable, signal} from '@angular/core';

import {Place} from './place.model';
import {HttpClient} from "@angular/common/http";
import {catchError, tap, throwError} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class PlacesService {
    private userPlaces = signal<Place[]>([]);
    private httpClient = inject(HttpClient);
    userPlacesReadOnly = this.userPlaces.asReadonly();

    loadedUserPlaces = this.userPlaces.asReadonly();

    loadAvailablePlaces() {
        return this.fetchPlaces("http://localhost:3000/places");
    }

    loadUserPlaces() {
        return this.fetchPlaces("http://localhost:3000/user-places").pipe(tap({
            next: resData => this.userPlaces.set(resData.places)
        }));
    }

    addPlaceToUserPlaces(place: Place) {
        let prevData: Place[] = [];
        if (!this.userPlaces().some(p => p.id === place.id)) {
             prevData = this.userPlaces();
            this.userPlaces.update(userPlaces => [...userPlaces, place]);

        }
        // if duplicates found backend will return an error
        return this.httpClient.put("http://localhost:3000/user-places", {
            placeId: place.id,
        }).pipe(catchError(err => {
            this.userPlaces.set(prevData);//fallback if any error occurs
            return throwError(() => new Error(err));
        }));

    }

    removeUserPlace(place: Place) {
    }

    private fetchPlaces(url: string) {
        return this.httpClient.get<{ places: Place[] }>(url);
    }
}
