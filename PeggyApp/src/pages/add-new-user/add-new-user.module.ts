import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewUserPage } from './add-new-user';

@NgModule({
  declarations: [
    AddNewUserPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewUserPage),
  ],
  exports: [
    AddNewUserPage
  ]
})
export class AddNewUserPageModule {}
