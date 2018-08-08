import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Task } from "../../models/task";

@Injectable()
export class DataProvider {
  baseuri = "http://localhost:3200/api/todos";

  constructor(public http: HttpClient) {}

  getTodos(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseuri}`);
  }

  addTodo(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseuri}`, task);
  }
  toggleStatus(taskId, task) {
    return this.http.put(`${this.baseuri}/${taskId}`, task);
  }
  deleteTodo(taskId) {
    return this.http.delete(`${this.baseuri}/${taskId}`);
  }
}
