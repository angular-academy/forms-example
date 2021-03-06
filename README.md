# FormsExample

[Ausführlichere Beschreibung](https://github.com/angular-academy/forms-example/blob/master/FORMS.md)

## Themen

* Template Driven Forms
* Reactive Forms
* Validatoren
* Custom Form Elements

Auslesen von Input-Elementen mittels NgModel wurde bereits vorgestellt. Für Formulare bietet angular zwei Mechanismen: *template-driven forms* und *reactive forms*. Template-Driven Forms sind vom Prinzip her näher an AngularJs dran und bieten Input Validierung im Template und arbeiten asynchron. Reactive Forms sind der moderne Weg aus angular2+, bieten Model-Definition und Validierung im Controller und arbeiten synchron.


## Template Driven Forms

Wir erzeugen zunächste Input-Elemente für ein Formular:

```html
<label>User Name
    <input type="text" [(ngModel)]="user.name">
</label>
```

Um das Formular selbst zu referenzieren, setzen wir eine Template-Variable auf die NgForm Direktive:
```html
<form #userForm="ngForm" (submit)="onSubmit($event, userForm)">
    ...
</form>
```

Wir können nun im Template den Status des Formulars abfragen, um z.B. einen Submit-Button gezielt ein- und auszuschalten:

```html
<button type="submit" [disabled]="userForm.invalid">Absenden</button>
```

In der Komponente ist das Formular als *ViewChild* verfügbar:

```typescript
@ViewChild('userForm')
userForm: NgForm;
```

## Reactive Forms

Reactive Forms sind ein model-getriebener Ansatz, um Formulare in angular zu nutzen. Anstelle eines 2-way Databindung wie bei NgModel existiert für jedes Input-Element im HTML eine *FormControl* in den Komponente, die den Zustand des Elements repräsentiert.

### FormControl

Mit der FormControl Klasse können wir in Komponenten einzelne Felder definieren. Wir erzeugen ein FormControl durch Aufruf des Konstruktors

```typescript
this.textControl = new FormControl('');
```

und weisen das FormControl im Template einem einem Input-Element zu:

```html
<label>Text Input
  <input type="text" [formControl]="textControl">
</label>
```

Ein FormControll stellt Observables für Value- und Statusänderungen bereit, sodass wir in Komponenten oder Templates (mit der async Pipe) auf Änderungen subscriben können:

```typescript
this.textChangeSubscription = this.textControl.valueChanges.subscribe(
    newValue => console.log(newValue)
);
```

```html
<p>{{textControl.valueChanges | async | json}}</p>
```

### FormGroup

Einzelne Formelemente können zu einer FormGroup kombiniert werden. Einer Formgroup können im Konstruktor initial FormControl-Defitionen übergeben werden. Zur Laufzeit sind diese ebenfalls hinzufügbar / entfernbar, ebenso sind Observables für Status- und Wertänderungen verfügbar.

```typescript
this.userForm = new FormGroup({
    name: new FormControl(''),
    gender: new FormControl('male'),
    favoriteDrink: new FormControl('')
});
```

```html
<form [formGroup]="userForm" (submit)="onSubmit($event, userForm)">
    <!-- ... -->
</form>
```

## Validatoren


### Template Driven Forms

angular unterstützt die Auswertung von Eingaben bei Form-Elementen nach den [HTML Form Validator Attributen](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation) .

Wir können diesen Zustand pro Element abfragen, indem wir den Status des NgModel eines Formularelements abfragen, um zum Beispiel gezielt Hilfe zu leisten:

<label>User Name
    <input type="text" name="inputName" [(ngModel)]="user.name" #userName="ngModel" minlength="6">
    <p *ngIf="userName.invalid && !userName.pristine">Name muss min. 6 Buchstaben lang sein<p>
</label>

Die Liste der möglichen Validator-Flags findet ihr in der [NgModel Dokumentation](https://angular.io/api/forms/NgModel)

### Reactive Forms

In Reactive Forms setzen wir Validatoren auf das FormControl eines Elements. Hierzu bietet angular eine Reihe [eingebauter Validator](https://angular.io/api/forms/Validators)

```typescript
this.userForm = new FormGroup({
      name: new FormControl('', [Validators.minLength(6)]),
      // ...
});
```

Fehler sind über die *errors* Property einer FormGroup oder FormControl abfragbar. Hierbei gilt folgendes:
* Fehler individueller FormControl Elemente sind an der jeweiligen *error* Property abzufragen, z.B. über this.userForm.controls.name.error
* Fehler für (Teil)Formulare müssen über eine eigene Validator-Funktion bei der entsprechenden FormGroup registriert werden.

## Custom Form Elements
