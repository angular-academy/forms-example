import { Component, OnInit, OnDestroy,
  AfterViewInit, ViewChild } from '@angular/core';
import { NgForm, MaxLengthValidator } from '@angular/forms';
import { UserModel } from '../model/user';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit, OnDestroy,
  AfterViewInit {

  @ViewChild('userForm')
  userForm: NgForm;

  user: UserModel;

  constructor() {
    this.user = {
      name: '',
      gender: 'male'
    };
  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {
    // hier steht userForm erstmalig zur Verfügung
    console.log('USER FORM', this.userForm);
  }

  onSubmit(form: NgForm) {
    console.log('SUBMIT CLICKED', form);
  }

}
