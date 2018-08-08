import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  DateTime,
  Events
} from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StorageProvider } from "../../providers/storage/storage";
import { Task } from "../../models/task";
import { DataProvider } from "../../providers/data/data";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { Toast } from "@ionic-native/toast";

@IonicPage()
@Component({
  selector: "page-add-task",
  templateUrl: "add-task.html"
})
export class AddTaskPage {
  formGroup: FormGroup;
  taskTime: DateTime;
  //taskTime = new Date().toLocaleTimeString();
  tasks: Task[];
  formData: any;

  TaskNotificationName: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public storageProvider: StorageProvider,
    public events: Events,
    public dataProvider: DataProvider,
    private sqlite: SQLite,
    private toast: Toast
  ) {
    this.formGroup = formBuilder.group({
      isComplete: false,
      dayTask: ["", Validators.required],
      taskTime: this.taskTime
    });
    this.formData = this.formGroup.value;
  }

  createTask(formData) {
    this.sqlite
      .create({
        name: "tasksdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("INSERT INTO tblTasks VALUES(NULL,?,?,?)", [
          formData.dayTask,
          formData.taskTime,
          formData.isComplete
        ]).then(res => {
          console.log(res);
          this.toast.show("Task saved", "5000", "center").subscribe(toast => {
            this.navCtrl.popToRoot();
          });
        });
      })
      .catch(e => {
        console.log(e);
        this.toast.show(e, "5000", "center").subscribe(toast => {
          console.log(toast);
        });
      });
  }
}
