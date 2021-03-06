import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { PoresComponent } from './components/pores/pores.component';
import { CracksComponent } from './components/cracks/cracks.component';
import { CnnModelsComponent } from './components/cnn-models/cnn-models.component';
import { TrainModelComponent } from './components/train-model/train-model.component';
import { PredictComponent } from './components/predict/predict.component';
import { AboutComponent } from './components/about/about.component';
import { AddNewModelComponent } from './components/add-new-model/add-new-model.component';
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { ManageModelsComponent } from './components/manage-models/manage-models.component';
import { EditModelComponent } from './components/edit-model/edit-model.component';
import { ModelDetailComponent } from './components/model-detail/model-detail.component';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [
    AppComponent,
    PoresComponent,
    CracksComponent,
    CnnModelsComponent,
    TrainModelComponent,
    PredictComponent,
    AboutComponent,
    AddNewModelComponent,
    ManageModelsComponent,
    EditModelComponent,
    ModelDetailComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxEchartsModule,
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
