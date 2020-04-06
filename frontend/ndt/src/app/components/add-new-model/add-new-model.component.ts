import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-add-new-model',
  templateUrl: './add-new-model.component.html',
  styleUrls: ['./add-new-model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewModelComponent implements OnInit {

  
  trainingInputs: FormArray;
  predictInputs: FormArray;
  options: FormArray;
  inputParameterTypes=["File","Number","DropdownList","RadioButton","CheckBox"];


  constructor(private fb: FormBuilder,
              private router:Router,
              private _modelService:ModelService) { }


  ngOnInit(): void {
  }


  modelForm = this.fb.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    about: [],
    author: [],
    remarks: [],
    modelEnable: [false],
    trainingInputs: this.fb.array([]),
    predictInputs: this.fb.array([]),
  })

  addInputParameter(train_Predict): void {
    if(train_Predict=='train'){
      this.trainingInputs = this.modelForm.get('trainingInputs') as FormArray;
      this.trainingInputs.push(this.createParameter());
    }else if(train_Predict=='predict'){
      this.predictInputs = this.modelForm.get('predictInputs') as FormArray;
      this.predictInputs.push(this.createParameter());
    }else{

    }
 
  }

  
  createParameter(): FormGroup {
    return this.fb.group({
      name:[],
      type:[],
      options:this.fb.array([]),
      maxChoice:[]
    });
  }

 
  removeParameter(index,train_Predict){
    if(train_Predict=='train'){
      this.trainingInputs.removeAt(index)
    }else if(train_Predict=='predict'){
      this.predictInputs.removeAt(index)
    }
    
  }


  changeType(type,item){
    console.log(type)
    if(type=="File" || type=="Number"){
       (item.get("options") as FormArray).clear();
       this.updateMaxChoice(item);
       // item.patchValue({ maxChoice:1 })
    }else{
       if(item.get("options").value.length<=0){
           this.addOption(item);
       }else{
           this.updateMaxChoice(item);
       }
    }
 }

 addOption(item){
  this.options=item.get('options') as FormArray;
  this.options.push(this.fb.control(null,Validators.required));
  this.updateMaxChoice(item);
}

 updateMaxChoice(item){
  if(item.get("type").value=="CheckBox"){
    item.get("maxChoice").patchValue(item.get("options").value.length)
  }else{
    item.get("maxChoice").patchValue(null);
  }
}

removeOption(item,index){
  (item.controls["options"] as FormArray).removeAt(index);
  this.updateMaxChoice(item);
}

  onSubmit(){
    console.log(this.modelForm.value);
    // alert("new event added.");
    this._modelService.addNewModel(this.modelForm.value).subscribe(data=>{
      if(data.results==1){
        alert("new model added.");
        window.location.href="/manage";
      }else{
        alert("error..");
      }
    })

  }


  backToHome(){
    this.router.navigate(['/models',]);
  }

}
