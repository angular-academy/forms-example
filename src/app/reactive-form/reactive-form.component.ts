import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { UserModel } from '../model/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit, OnDestroy {

  user: UserModel;

  userForm: FormGroup;

  userFormChangeSubscription: Subscription;

  genderChangeSubscription: Subscription;

  textControl: FormControl;

  textChangeSubscription: Subscription;

  constructor() {
    this.user = {
      name: '',
      gender: 'male',
      favoriteDrink: ''
    };

    this.textControl = new FormControl('');
    this.textChangeSubscription = this.textControl.valueChanges.subscribe(
      newValue => console.log(newValue)
    );

    this.initFormGroup();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.textChangeSubscription && !this.textChangeSubscription.closed) {
      this.textChangeSubscription.unsubscribe();
    }
    if (this.genderChangeSubscription && !this.genderChangeSubscription.closed) {
      this.genderChangeSubscription.unsubscribe();
    }
    if (this.userFormChangeSubscription && !this.userFormChangeSubscription.closed) {
      this.userFormChangeSubscription.unsubscribe();
    }
  }

  onSubmit(form: NgForm) {
    console.log('SUBMIT CLICKED', form);
  }

  initFormGroup() {
    this.userForm = new FormGroup({
      name: new FormControl(''),
      gender: new FormControl('male'),
      favoriteDrink: new FormControl('')
    });

    this.genderChangeSubscription = this.userForm.controls['gender'].valueChanges.subscribe(
      gender => {
        this.initFavorites(gender);
      }
    );

    this.userFormChangeSubscription = this.userForm.valueChanges.subscribe(
      (newUser: UserModel) => {
        console.log('new user model', {...newUser });
        this.user = newUser;
      }
    );
  }

  initFavorites(gender: 'male' | 'female' ) {
    switch (gender) {
      case 'female':
      if (this.userForm.controls.hasOwnProperty('favoriteDrink')) {
        console.log('remove drink');
        this.userForm.removeControl('favoriteDrink');
      }
      if (!this.userForm.controls.hasOwnProperty('favoriteDress')) {
        console.log('add dress');
        this.userForm.addControl('favoriteDress', new FormControl(''));
      }
      break;

      case 'male':
      if (this.userForm.controls.hasOwnProperty('favoriteDress')) {
        console.log('remove dress');
        this.userForm.removeControl('favoriteDress');
      }
      if (!this.userForm.controls.hasOwnProperty('favoriteDrink')) {
        console.log('add drink');
        this.userForm.addControl('favoriteDrink', new FormControl(''));
      }
      break;
    }
  }
}
