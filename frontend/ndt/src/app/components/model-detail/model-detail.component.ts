import { Component, OnInit } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-model-detail',
  templateUrl: './model-detail.component.html',
  styleUrls: ['./model-detail.component.scss']
})
export class ModelDetailComponent implements OnInit {

 
  modelId: string;
  modelData: any;

  constructor(private modelService: ModelService,
              private router:Router,
              private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      this.modelId = params.get("mid");
      this.getModelDetail(this.modelId)
    })
  }

  getModelDetail(id) {
    this.modelService.getModelById(id).subscribe((data) => {
      this.modelData = data.results;
      console.log(this.modelData)

      if (this.modelData == -1) {
        this.router.navigate(['/models',]);
        return;
      }


    })
  }



}
