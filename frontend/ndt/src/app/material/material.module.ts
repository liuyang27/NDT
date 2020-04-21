import { NgModule } from '@angular/core';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips'
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';

const MaterialComponents =[
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
  MatChipsModule,
  MatIconModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatDialogModule,

  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatMenuModule,
  MatTabsModule,
];


@NgModule({

  imports: [
    // BrowserAnimationsModule,
    MaterialComponents],
  exports:[MaterialComponents],
})
export class MaterialModule { }
