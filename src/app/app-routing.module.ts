import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'template-form',
    loadChildren: './template-form/template-form.module#TemplateFormModule'
  },
  {
    path: 'reactive-form',
    loadChildren: './reactive-form/reactive-form.module#ReactiveFormModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
