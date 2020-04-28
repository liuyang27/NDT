import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PoresComponent } from './components/pores/pores.component';
import { CracksComponent } from './components/cracks/cracks.component';
import { CnnModelsComponent } from './components/cnn-models/cnn-models.component';
import { TrainModelComponent } from './components/train-model/train-model.component';
import { PredictComponent } from './components/predict/predict.component';
import { AboutComponent } from './components/about/about.component';
import { AddNewModelComponent } from './components/add-new-model/add-new-model.component';
import { ManageModelsComponent } from './components/manage-models/manage-models.component';
import { EditModelComponent } from './components/edit-model/edit-model.component';
import { ModelDetailComponent } from './components/model-detail/model-detail.component';


const routes: Routes = [
  {
    path:"models",component:CnnModelsComponent,
  },
  {
    path:"manage",component:ManageModelsComponent,
  },
  {
    path:"manage/editmodel/:mid",component:EditModelComponent
  },
  {
    path:"addNewModel",component:AddNewModelComponent,
  },
  {
    path:"models/:mid",component:ModelDetailComponent,
    // children:[
    //   {path:"about",component:AboutComponent,data: { modelData: 'modelData' }},
    //   {path:"train",component:TrainModelComponent,data: { modelData: 'modelData' }},
    //   {path:"predict",component:PredictComponent,data: { modelData: 'modelData' }},
    //   {path:"**",redirectTo:"about"}
    // ]
  },
  // {
  //   path:"models/pores",component:PoresComponent,
  //   children:[
  //     {path:"about",component:AboutComponent},
  //     {path:"train",component:TrainModelComponent},
  //     {path:"predict",component:PredictComponent},
  //     {path:"**",redirectTo:"about"}
  //   ]

  // },
  // {
  //   path:"models/cracks",component:CracksComponent,
  //   children:[
  //     {path:"about",component:AboutComponent},
  //     {path:"train",component:TrainModelComponent},
  //     {path:"predict",component:PredictComponent},
  //     {path:"**",redirectTo:"about"}
  //   ]
  // },
  { path:"**",redirectTo:'models' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
