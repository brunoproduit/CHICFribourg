import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeleteUserPage } from './delete-user';

@NgModule({
  declarations: [
    DeleteUserPage,
  ],
  imports: [
    IonicPageModule.forChild(DeleteUserPage),
  ],
  exports: [
    DeleteUserPage
  ]
})
export class DeleteUserPageModule {}
