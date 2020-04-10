import { Component, OnInit, AfterContentChecked, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.scss']
})
export class EditModelComponent implements OnInit,AfterContentChecked {

  modelId: string;
  modelForm;
  trainingInputs: FormArray;
  predictInputs: FormArray;
  options: FormArray;
  inputParameterTypes=["File","Number","DropdownList","RadioButton","CheckBox"];

  constructor(private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modelService: ModelService,
    private router: Router,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      this.modelId = params.get("mid");
      this.getModelDetail(this.modelId)
    })
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }


  getModelDetail(id) {
    this.modelService.getModelById(id).subscribe((data) => {
      var modeldata = data.results;
      // console.log(modeldata)

      if (modeldata == -1) {
        this.router.navigate(['/manage',]);
        return;
      }
      this.modelForm = this.fb.group({
        name: [modeldata.name, Validators.required],
        type: [modeldata.type, Validators.required],
        about: [modeldata.about],
        author: [modeldata.author],
        remarks: [modeldata.remarks],
        modelEnable: [modeldata.modelEnable],
        createdDate: [modeldata.createdDate],
        trainingInputs: this.fb.array([]),
        predictInputs: this.fb.array([]),
      })

      ///load trainingInputs data
      this.trainingInputs = this.modelForm.get('trainingInputs') as FormArray;
      modeldata.trainingInputs.forEach(element => {
        var tempOptions = this.fb.array([]);
        element.options.forEach(opt => {
          tempOptions.push(this.fb.control(opt, Validators.required))
        })
        this.trainingInputs.push(
          this.fb.group({
            name: [element.name],
            type: [element.type],
            options: tempOptions,
            maxChoice: [element.maxChoice]
          })
        )
      });

      ///load predictInputs data
      this.predictInputs = this.modelForm.get('predictInputs') as FormArray;
      modeldata.predictInputs.forEach(element => {
        var tempOptions = this.fb.array([]);
        element.options.forEach(opt => {
          tempOptions.push(this.fb.control(opt, Validators.required))
        })
        this.predictInputs.push(
          this.fb.group({
            name: [element.name],
            type: [element.type],
            options: tempOptions,
            maxChoice: [element.maxChoice]
          })
        )
      });
    })
  }

  removeParameter(index,train_Predict){
    if(train_Predict=='train'){
      this.trainingInputs.removeAt(index)
    }else if(train_Predict=='predict'){
      this.predictInputs.removeAt(index)
    }
  }

  changeType(type,item){
    // console.log(type)
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

  onSubmit(){
    // console.log(this.modelForm.value);
    this.modelService.editModel(this.modelId,this.modelForm.value).subscribe(data=>{
      // console.log(data)
      if(data.results==1){
        alert("model edited successfully.");
        window.location.href="/manage";
      }else{
        alert("error..");
      }
    })
  }

  backToHome(){
    this.router.navigate(['/manage',]);
  }

}
