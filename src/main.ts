import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import {

    provideHttpClient

} from "@angular/common/http";

//
// function loggingIntercept(request: HttpRequest<any>,next:HttpHandlerFn) {
//
//     console.log(request); // This is request body
//
//
//
//     return next(request).pipe(
//         tap({
//             next:event=>{
//                 if(event===HttpResponse)
//             }
//         })
//     ) // forwards the outgoing request to server
// }

bootstrapApplication(AppComponent,{
    providers:[provideHttpClient()],
}).catch((err) => console.error(err));
