import { Component, Pipe } from "@angular/core";
import { NavController, AlertController } from "ionic-angular";
import { DataProvider } from "../../providers/data/data";
import { Task } from "../../models/task";
import { HttpClient } from "@angular/common/http";
import { NativeAudio } from "@ionic-native/native-audio";
import { AudioProvider } from "../../providers/audio/audio";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { EditTaskPage } from "../edit-task/edit-task";
import { AddTaskPage } from "../add-task/add-task";
import { Toast } from "@ionic-native/toast";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
@Pipe({ name: "keys" })
export class HomePage {
  //tasks: Task[] = [];
  tasks: Task[];
  // the 'it-IT' helps display time in 24 hrs
  //taskStartTime = new Date().toLocaleTimeString("it-IT");
  taskStartTime;
  constructor(
    public navCtrl: NavController,
    public dataProvider: DataProvider,
    public http: HttpClient,
    public alertCtrl: AlertController,
    public nativeAudio: NativeAudio,
    public audioProvider: AudioProvider,
    private sqlite: SQLite,
    private toast: Toast
  ) {
    this.loadAlarm();
    this.getTasks();
    setInterval(() => {
      this.taskStartTime = new Date().toLocaleTimeString("it-IT");
    }, 1000);
    this.taskStatusAlert();
  }

  loadAlarm() {
    this.audioProvider.preload("alertSound", "assets/audio/alarm.wav");
  }

  ionViewWillEnter() {
    this.loadAlarm();
    this.getTasks();
    setInterval(() => {
      this.taskStartTime = new Date().toLocaleTimeString("it-IT");
    }, 1000);
  }

  // ionViewDidLoad() {
  //   this.getTasks();
  //   setInterval(() => {
  //     this.taskStartTime = new Date().toLocaleTimeString("it-IT");
  //   }, 1000);
  // }

  getTasks() {
    this.sqlite
      .create({
        name: "tasksdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "CREATE TABLE IF NOT EXISTS tblTasks(taskId INTEGER PRIMARY KEY, dayTask TEXT, taskTime TEXT, isComplete BOOLEAN)",
          []
        )
          .then(res => console.log("Executed SQL"))
          .catch(e => console.log(e));

        db.executeSql("SELECT * FROM tblTasks ORDER BY taskId DESC", [])
          .then(res => {
            this.tasks = [];
            for (var i = 0; i < res.rows.length; i++) {
              this.tasks.push({
                taskId: res.rows.item(i).taskId,
                dayTask: res.rows.item(i).dayTask,
                taskTime: res.rows.item(i).taskTime,
                isComplete: res.rows.item(i).isComplete
              });
            }
          })
          .catch(e => console.log(e));
      });
  }

  addTask() {
    this.navCtrl.push(AddTaskPage);
  }

  editTask(taskId) {
    this.navCtrl.push(EditTaskPage, {
      taskId: taskId
    });
  }

  deleteTask(taskId) {
    this.sqlite
      .create({
        name: "tasksdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("DELETE FROM tblTasks WHERE taskId=?", [taskId])
          .then(res => {
            console.log(res);
            this.getTasks();
          })
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  playAudio() {
    this.audioProvider.play("alertSound");
  }

  taskStatusAlert() {
    setInterval(() => {
      let status = this.tasks.find(
        task => task.isComplete == false && task.taskTime == this.taskStartTime
      );
      if (status) return this.audioProvider.play("alertSound");
    }, 1000);
  }

  toggleStatus(task) {
    this.sqlite
      .create({
        name: "tasksdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("INSERT INTO tblTasks VALUES(NULL,?,?,?)", [
          task.dayTask,
          task.taskTime,
          true
        ]).then(res => {
          this.toast
            .show("Task is done!", "5000", "center")
            .subscribe(toast => {
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
