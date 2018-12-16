import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
import { IonicStorageModule } from "@ionic/storage";
import { HomePage } from "../pages/home/home";
import { TabsPage } from "../pages/tabs/tabs";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HttpClientModule } from "@angular/common/http";
import { StorageProvider } from "../providers/storage/storage";
import { DataProvider } from "../providers/data/data";
import { AudioProvider } from "../providers/audio/audio";
import { NativeAudio } from "@ionic-native/native-audio";

import { SQLite } from "@ionic-native/sqlite";
import { Toast } from "@ionic-native/toast";
import { EditTaskPageModule } from "../pages/edit-task/edit-task.module";
import { AddTaskPageModule } from "../pages/add-task/add-task.module";

@NgModule({
  declarations: [MyApp, HomePage, TabsPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: "_tasksdb",
      driverOrder: ["indexeddb", "sqlite", "websql"]
    }),
    EditTaskPageModule,
    AddTaskPageModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, TabsPage],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpClientModule,
    StorageProvider,
    DataProvider,
    AudioProvider,
    NativeAudio,
    SQLite,
    Toast
  ]
})
export class AppModule {}
