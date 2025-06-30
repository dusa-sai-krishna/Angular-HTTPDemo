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
        let prevData: Place[] = this.userPlaces();
        if (!this.userPlaces().some(p => p.id === place.id)) {

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

    removeUserPlace(placeId: string) {
        //optimistic Updating
        let prevData = this.userPlaces();
        this.userPlaces.update(oldPlaces=>oldPlaces.filter(p => p.id !== placeId));
        return this.httpClient.delete<{ userPlaces: Place[] }>("http://localhost:3000/user-places/" + placeId).pipe(
            tap({
                next: resData => {
                    console.log(resData.userPlaces);
                    this.userPlaces.set(resData.userPlaces)
                }
            }),
            catchError((error) => throwError(() => {
                this.userPlaces.set(prevData);
                return new Error(error)
            }))
        )
    }

    private fetchPlaces(url: string) {
        return this.httpClient.get<{ places: Place[] }>(url);
    }
}
