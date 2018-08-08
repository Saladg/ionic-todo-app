import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage'
import { Task } from '../../models/task';



@Injectable()
export class StorageProvider {
  tasks: Task[];

  constructor(public http: HttpClient,
    public storageProvider: Storage) {

    console.log('Hello StorageProvider Provider');

  }


  set(key, value) {

    return this.storageProvider.set(key, value);

  }

  // getData() {
  //   return this.storage.get('todos'); 
  // }
 
  // save(data){
  //   this.storage.set('todos', data);
  // }


  get(key) {

    return this.storageProvider.get(key);

  }

  remove(key) {

    return this.storageProvider.remove(key);
  }


}
