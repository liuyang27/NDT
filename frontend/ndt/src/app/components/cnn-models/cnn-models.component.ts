import { Component, OnInit } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-cnn-models',
  templateUrl: './cnn-models.component.html',
  styleUrls: ['./cnn-models.component.scss']
})
export class CnnModelsComponent implements OnInit {

  modelList: any[];
  LogoURL = "assets/images/MLlogo.JPG"
  constructor(private modelService: ModelService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
    
    this.modelService.getAllModels().subscribe(
      (data) => {
        this.spinner.hide();
        this.modelList = data["results"];
        // console.log(this.modelList)
        // console.log(this.modelList[0])
      })
  }

}
