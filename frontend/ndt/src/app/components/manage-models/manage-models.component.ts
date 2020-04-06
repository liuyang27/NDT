import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ModelService } from '../../services/model.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manage-models',
  templateUrl: './manage-models.component.html',
  styleUrls: ['./manage-models.component.scss']
})
export class ManageModelsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'type', 'author','modelEnable','details'];
  dataSource;

  constructor(private modelService:ModelService,
              private router:Router) { }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(){
    this.modelService.getAllModels().subscribe(
      (data)=>{
          this.dataSource=new MatTableDataSource(data["results"]);
      })
  }

  showEdit(id){
    console.log(id)
  }

  onDelete(id){
    if(!confirm("Are you sure to delete this event? ")) {
      return;
    }
    this.modelService.deleteModelById(id).subscribe((data)=>{
      if(data.results==1){
        alert("Model deleted");
        this.loadPage();
        
      }else{
        alert("error...");
      }
    })  
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
