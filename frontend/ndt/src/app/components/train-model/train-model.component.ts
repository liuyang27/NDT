import { Component, OnInit,Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-train-model',
  templateUrl: './train-model.component.html',
  styleUrls: ['./train-model.component.scss']
})
export class TrainModelComponent implements OnInit {

  @Input() modelData:any;
  // modelForm:FormGroup;
  trainingInputs:FormArray;
  constructor( private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadInputsData(this.modelData["trainingInputs"]);
  }

  modelForm = this.fb.group({
    // id: this.modelData["_id"],
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

  onSubmit(){
    
  }

}
