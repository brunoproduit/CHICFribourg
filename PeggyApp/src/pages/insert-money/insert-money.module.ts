import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InsertMoneyPage } from './insert-money';

@NgModule({
  declarations: [
    InsertMoneyPage,
  ],
  imports: [
    IonicPageModule.forChild(InsertMoneyPage),
  ],
  exports: [
    InsertMoneyPage
  ]
})
export class InsertMoneyPageModule {}
