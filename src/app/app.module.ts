import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AngularFireModule, FirebaseOptionsToken } from "@angular/fire";
import { firebaseConfig } from "../environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "@angular/fire/storage";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { LoginPageModule } from "src/pages/login/login.module";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig, "sami-maths-club"),
    AngularFirestoreModule.enablePersistence({
      experimentalTabSynchronization: true
    }),
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    LoginPageModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // fix required to allow aot with firebase
    { provide: FirebaseOptionsToken, useValue: firebaseConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
