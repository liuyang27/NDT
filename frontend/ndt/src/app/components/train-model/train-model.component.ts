import { Component, OnInit,Input, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-train-model',
  templateUrl: './train-model.component.html',
  styleUrls: ['./train-model.component.scss']
})
export class TrainModelComponent implements OnInit {

  @Input() modelData:any;

  modelId;
  formData= new FormData();
  trainingInputs:FormArray;
  outputData="";
  autoRefreshId;

  constructor(private fb: FormBuilder,
              private modelService: ModelService,
              private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.modelId=this.modelData["_id"];
    // console.log(this.modelId)
    this.loadInputsData(this.modelData["trainingInputs"]);
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  modelForm = this.fb.group({
    trainingInputs: this.fb.array([]),
  })


  loadInputsData(input_array): void {
    input_array.forEach(parameter => {
      this.trainingInputs = this.modelForm.get("trainingInputs") as FormArray;
      this.trainingInputs.push(this.createInput(parameter));
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
    this.formData.append('textInputs',JSON.stringify(this.modelForm.value));
    console.log(this.modelForm.value)
    this.modelService.trainModel(this.modelId,this.formData).subscribe(data=>{
      if(data.results=="ok"){
        console.log("Submit ok")
        this.getTrainOutput();
      }else{
        alert("Submit error: "+data.results)
        console.log("Submit error:"+data.results)
      }
      
    })
  }


  getTrainOutput(){
    this.modelService.getTrainOutput(this.modelId).subscribe(data=>{
      if(data.results=="" || data.results.length==0){
        alert("Cannot get train results")
      }
      this.outputData=data.results;
    })
  }

  autoRefreshEnable(event){
    if(event.checked==true){
      this.autoRefreshId = setInterval(()=>{
        this.getTrainOutput();
      }, 30000);
    }else{
      clearInterval(this.autoRefreshId);
    }
  }

  ngOnDestroy() {
    if (this.autoRefreshId) {
      clearInterval(this.autoRefreshId);
    }
  }

}
