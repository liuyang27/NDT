import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ModelService } from '../../services/model.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-manage-models',
  templateUrl: './manage-models.component.html',
  styleUrls: ['./manage-models.component.scss']
})
export class ManageModelsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'type', 'author', 'modelEnable', 'createdDate', 'details'];
  dataSource;

  constructor(private modelService: ModelService,
    private router: Router,
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
        this.dataSource = new MatTableDataSource(data["results"]);
        // console.log(data)
      })
  }

  showEdit(id) {
    // console.log(id)
    this.router.navigate(['/manage/editmodel', id]);
  }

  onDelete(id) {
    if (!confirm("Are you sure to delete this Model? ")) {
      return;
    }
    this.modelService.deleteModelById(id).subscribe((data) => {
      if (data.results == 1) {
        alert("Model deleted");
        this.loadPage();

      } else {
        alert("error...");
      }
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
