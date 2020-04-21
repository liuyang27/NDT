import { Component, OnInit } from '@angular/core';
import { ModelService } from '../../services/model.service';


@Component({
  selector: 'app-cnn-models',
  templateUrl: './cnn-models.component.html',
  styleUrls: ['./cnn-models.component.scss']
})
export class CnnModelsComponent implements OnInit {

  modelList:any[];

  constructor(private modelService:ModelService) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(){
    this.modelService.getAllModels().subscribe(
      (data)=>{
        this.modelList=data["results"];
          // console.log(this.modelList)
          // console.log(this.modelList[0])
      })
  }

}
