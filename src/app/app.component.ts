import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { APIService } from "./API.service";
import { FormFieldTypes } from "@aws-amplify/ui-components";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  todos: Array<any>;
  formFields: FormFieldTypes;
  authenticated: Boolean;
  user: Object;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private apiService: APIService
  ) {
    this.formFields = [
      {
        type: "email",
        label: "Custom email Label",
        placeholder: "custom email placeholder",
        required: true,
      },
      {
        type: "password",
        label: "Custom Password Label",
        placeholder: "custom password placeholder",
        required: true,
      },
    ];
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
