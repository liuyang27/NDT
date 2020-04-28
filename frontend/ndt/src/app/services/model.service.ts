import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private Server_IP="http://localhost:3000"

  constructor(private http: HttpClient) { }

  addNewModel(model):Observable<any>{
    return this.http.post(this.Server_IP+"/model/",model);
  }


  deleteModelById(mid):Observable<any>{
    var res = this.http.delete(this.Server_IP+"/model/"+mid);
    return res;
  }

  getAllModels():Observable<any>{
    var res = this.http.get(this.Server_IP+"/model");
    return res;
  }

  getModelById(mid):Observable<any>{
    var res = this.http.get(this.Server_IP+"/model/"+mid);
    return res;
  }

  editModel(mid,model):Observable<any>{
    var res = this.http.put(this.Server_IP+"/model/"+ mid,model);
    return res;
  }

  trainModel(mid,formData):Observable<any>{
    var res = this.http.post(this.Server_IP+"/model/train/"+ mid,formData);
    return res;
  }

  predictModel(mid,formData):Observable<any>{
    var res = this.http.post(this.Server_IP+"/model/predict/"+ mid,formData);
    return res;
  }



}
