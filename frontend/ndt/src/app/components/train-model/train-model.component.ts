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
  // modelForm:FormGroup;
  modelId;
  uploadFiles = [];
  formData= new FormData();
  trainingInputs:FormArray;
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

  // loadInputs(){

  //   this.modelForm = this.fb.group({
  //     id: [this.modelData["_id"]],
  //     trainingInputs: this.fb.array([]),
  //   })

     ///load trainingInputs data
    //  this.trainingInputs = this.modelForm.get('trainingInputs') as FormArray;
    //  this.modelData.trainingInputs.forEach(element => {
    //    var tempOptions = this.fb.array([]);
    //    element.options.forEach(opt => {
    //      tempOptions.push(this.fb.control(opt, Validators.required))
    //    })
    //    this.trainingInputs.push(
    //      this.fb.group({
    //        name: [element.name],
    //        type: [element.type],
    //        options: tempOptions,
    //        maxChoice: [element.maxChoice]
    //      })
    //    )
    //  });
  // }

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
  onCheckChange(event){
    console.log(event)
    // const formArray: FormArray = this.modelForm.get('trainingInputs') as FormArray;

    // /* Selected */
    // if(event.target.checked){
    //   // Add a new control in the arrayForm
    //   formArray.push(new FormControl(event.target.value));
    // }
    // /* unselected */
    // else{
    //   // find the unselected element
    //   let i: number = 0;
  
    //   formArray.controls.forEach((ctrl: FormControl) => {
    //     if(ctrl.value == event.target.value) {
    //       // Remove the unselected element from the arrayForm
    //       formArray.removeAt(i);
    //       return;
    //     }
  
    //     i++;
    //   });
    // }
  }
  selectFiles(event,inputName){
    console.log(inputName)
    if(event.target.files.length>0){
      // this.uploadFiles=event.target.files;
      this.formData.delete(inputName);
      for(let file of event.target.files){
        this.formData.append(inputName,file);
      }
    }

  }

  onSubmit(){
    // const formData= new FormData();
    // formData.append('file',this.uploadFiles);
    // formData.append('textInputs',this.modelForm.getRawValue());

    // this.formData.append('textInputs',this.modelForm.value);
    this.formData.append('textInputs',JSON.stringify(this.modelForm.value));
    console.log(this.modelForm.value)
    this.modelService.trainModel(this.modelId,this.formData).subscribe(data=>{
      console.log(data)
    })
  }

}
