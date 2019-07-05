import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { AngularFireModule, FirebaseOptionsToken } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { firebaseConfig, environment } from "src/environments";
import { LoginPageModule } from "src/pages/login/login.module";
import { WebModule } from "src/modules/web/web.module";
import { NativeModule } from "src/modules/native/native.module";

// Additionally register platform module to register service worker on web
// or provide additional native providers on native
const PlatformModule = environment.isAndroid ? NativeModule : WebModule;
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
    LoginPageModule,
    PlatformModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // fix required to allow aot with firebase
    { provide: FirebaseOptionsToken, useValue: firebaseConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
