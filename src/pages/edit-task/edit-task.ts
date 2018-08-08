import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { Toast } from "@ionic-native/toast";
import { Task } from "../../models/task";

@IonicPage()
@Component({
  selector: "page-edit-task",
  templateUrl: "edit-task.html"
})
export class EditTaskPage {
  task = { taskId: 0, dayTask: "", taskTime: "", isComplete: false };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    private toast: Toast
  ) {
    this.getCurrentData(navParams.get("taskId"));
  }

  getCurrentData(taskId) {
    this.sqlite
      .create({
        name: "tasksdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql("SELECT * FROM tblTasks WHERE taskId=?", [taskId])
          .then(res => {
            if (res.rows.length > 0) {
              this.task.taskId = res.rows.item(0).taskId;
              this.task.dayTask = res.rows.item(0).dayTask;
              this.task.taskTime = res.rows.item(0).taskTime;
              this.task.isComplete = res.rows.item(0).isComplete;
            }
          })
          .catch(e => {
            console.log(e);
            this.toast.show(e, "5000", "center").subscribe(toast => {
              console.log(toast);
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

  updateTask() {
    this.sqlite
      .create({
        name: "tasksdb.db",
        location: "default"
      })
      .then((db: SQLiteObject) => {
        db.executeSql(
          "UPDATE tblTasks SET dayTask=?,taskTime=?,isComplete=? WHERE taskId=?",
          [
            this.task.dayTask,
            this.task.taskTime,
            this.task.isComplete,
            this.task.taskId
          ]
        )
          .then(res => {
            console.log(res);
            this.toast
              .show("Task updated", "5000", "center")
              .subscribe(toast => {
                this.navCtrl.popToRoot();
              });
          })
          .catch(e => {
            console.log(e);
            this.toast.show(e, "5000", "center").subscribe(toast => {
              console.log(toast);
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
