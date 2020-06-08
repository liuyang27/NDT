import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ModelService } from 'src/app/services/model.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss']
})
export class PredictComponent implements OnInit {

  @Input() modelData:any;

  modelId;
  formData= new FormData();
  predictInputs:FormArray;
  constructor(private fb: FormBuilder,
              private modelService: ModelService,
              private ref: ChangeDetectorRef,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.modelId=this.modelData["_id"];
    // console.log(this.modelId)
    this.loadInputsData(this.modelData["predictInputs"]);
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  modelForm = this.fb.group({
    predictInputs: this.fb.array([]),
  })

  loadInputsData(input_array): void {
    input_array.forEach(parameter => {
      this.predictInputs = this.modelForm.get("predictInputs") as FormArray;
      this.predictInputs.push(this.createInput(parameter));
    });
  }

  createInput(item): FormGroup {
    return this.fb.group({
      "name": item["name"],
      "type": item["type"],
      "options": this.fb.array(item["options"]),
      "maxChoice": item["maxChoice"],
      "answer": new FormControl([]),
    });
  }

  selectFiles(event,inputName){
    if(event.target.files.length>0){
      this.formData.delete(inputName);
      for(let file of event.target.files){
        this.formData.append(inputName,file);
      }
    }

  }

  onSubmit(){
    this.spinner.show("predictUploadSpinner");
    setTimeout(() => {
      this.spinner.hide("predictUploadSpinner");
    }, 10000);

    this.formData.append('textInputs',JSON.stringify(this.modelForm.value));
    // console.log("=================================")
    // console.log(this.modelForm.value)
    this.modelService.predictModel(this.modelId,this.formData).subscribe(data=>{
      this.spinner.hide("predictUploadSpinner");
      if(data.results=="ok"){
        console.log("Submit ok, processing data..");

        this.spinner.show("predictProcessSpinner");
        setTimeout(() => {
          this.spinner.hide("predictProcessSpinner");
        }, 10000);

        this.modelService.getPredictResult(this.modelId,data.timeStampId).subscribe(data=>{
          this.spinner.hide("predictProcessSpinner");
          if(data.results=="" || data.results.length==0){
            alert("Cannot get predict results")
          }
          console.log("check folder for results...haha")
        })
      }else{
        alert("Submit error: "+data.results)
        console.log("Submit error:"+data.results)
      }
      
    })
  }

}
