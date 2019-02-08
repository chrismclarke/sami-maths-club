import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AngularFireModule, FirebaseOptionsToken } from "@angular/fire";
import FIREBASE_CONFIG from "../environments/config";
import {
  AngularFirestoreModule,
  AngularFirestore
} from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "@angular/fire/storage";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { IonicStorageModule } from "@ionic/storage";
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
    AngularFireModule.initializeApp(FIREBASE_CONFIG, "sami-maths-club"),
    AngularFirestoreModule.enablePersistence({
      experimentalTabSynchronization: true
    }),
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot({
      name: "__sami-v1",
      driverOrder: ["indexeddb", "sqlite", "websql"]
    }),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    LoginPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // fix required to allow aot with firebase
    { provide: FirebaseOptionsToken, useValue: FIREBASE_CONFIG }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
