import { Component } from "@angular/core";
import { MenuController, Platform, ToastController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { APIService } from "./API.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  appPages = [
    {
      title: "Schedule",
      url: "/app/tabs/schedule",
      icon: "calendar",
    },
    {
      title: "Speakers",
      url: "/app/tabs/speakers",
      icon: "people",
    },
    {
      title: "Map",
      url: "/app/tabs/map",
      icon: "map",
    },
    {
      title: "About",
      url: "/app/tabs/about",
      icon: "information-circle",
    },
  ];
  loggedIn = false;
  dark = false;
  todos: Array<any>;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,

    private toastCtrl: ToastController,
    private apiService: APIService
  ) {
    this.initializeApp();
  }

  createTodo() {
    this.apiService.CreateTodo({
      name: "ionic",
      description: "testing",
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.apiService.ListTodos().then((evt) => {
        this.todos = evt.items;
      });
      this.apiService.OnCreateTodoListener.subscribe((evt) => {
        const data = (evt as any).value.data.onCreateTodo;
        this.todos = [...this.todos, data];
      });
    });
  }
}
