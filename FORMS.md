# Angular Forms
Formulare sind ein essentieller Bestandteil einer Vielzahl von Web Applikationen, sei es zu Zwecken der Authentifizierung, zur Verwaltung von Profilseiten oder zur Erfassung von anderen Daten. Aus diesem Grund bringt Angular von Haus aus eine Menge an Komponenten und Direktiven mit, die den Umgang mit Formularen vereinfachen und vereinheitlichen sollen.

Angular bringt gleich zwei verschiedene Herangehensweisen für Formulare mit. 
* **Template-driven Forms** sind für einfach gehaltene Formulare, wie beispielsweise E—Mail Newsletter Masken gedacht. Sie sind einfach einzubinden, skalieren jedoch nicht so gut wie der andere Formular-Ansatz. Wie der Name vermuten lässt werden Template-driven Forms meist vollständig im Template realisiert.
* **Reactive forms** sind die Alternative zu Template-driven Forms. Vorteile sind eine bessere Skalierbarkeit, Wiederverwendbarkeit und Testbarkeit. Dafür ist der Programmieraufwand größer. Im Gegensatz zu Template-driven Forms besitzen Reactive forms eine vollständige Repräsentation des Formulars in der Komponente (TS-Datei) und im Template werden einzelne Felder dieser Repräsentation referenziert.

Beide Arten der Formulare enthalten die folgenden vier Bausteine.
* Ein **FormControl** repräsentiert ein einzelnes Formularelement und verwaltet dessen Wert und Zustand.
* Eine **FormGroup** gruppiert eine Anzahl an FormControls und verwaltet darüber hinaus die Werte und den Status der gesamten Gruppe.
* Ein **FormArray** verwaltet eine Liste von FormControls sowie deren Werte und Status.
* Ein **FormValueAccessor** stellt eine Brücke zwischen dem FormControl und dem nativen DOM-Element dar.

## Template-driven Forms
### Aufbau eines einfachen Formulars
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-template-favorite-color',
  template: `
    Favorite Color: <input type="text" [(ngModel)]="favoriteColor">
  `
})
export class FavoriteColorComponent {
  favoriteColor = '';
}
```
Bei Template-driven Forms wird der Zustand des Formulars über das Formular abgebildet. Der Wert eines Formularfeldes wird mit Hilfe der NgModel Direktive auslesen. Zugriff auf das FormControl selbst und seinen Status ist üblicherweise nicht vorgesehen.
### Der Datenfluss
Jedes Formularfeld ist mit einer Direktive verknüpft, die intern den Wert und Zustand dieses Feldes als FormControl verwaltet.
Wird der Wert der Farbe des im oben genannten Beispiels geändert, indem der Benutzer eine Eingabe im Formularfeld tätigt, so wird ein Input Event ausgelöst, auf das die Direktive lauscht. Die Direktive schreibt darauf hin den Wert des Events in das FormControl und ändert anschließend das mit NgModel referenzierte Attribut in der Komponente. Auch in die entgegengesetzte Richtung übernimmt die NgModel Direktive die Koordination. Die Direktive lauscht auf Änderungen am Attribut und speichert den neuen Wert im FormControl und schreibt ihn in das DOM Element.
### Validieren
Einerseits unterstützt Angular die Standardvalidatoren der Formularfelder wie beispielsweise *required*. Andererseits müssen eigene Validatoren als Methoden umgesetzt und in eine eigene Direktive eingebunden werden, die dann an das Formularfeld gehängt werden.
### Testen
Das Testen von Template-driven Forms erfordert ein Verständnis des Change Detection Prozesses und wie sich Direktiven in diesem Prozess verhalten, um die Formularelemente im richtigen Zeitpunkt zu beziehen, zu testen und zu ändern.
Im folgenden wird ein Test zum oben aufgeführten Beispiel des Farb-Feldes aufgeführt.
```typescript
it('should update the favorite color in the component', fakeAsync(() => {
  const input = fixture.nativeElement.querySelector('input');
  const event = createNewEvent('input');

  input.value = 'Red';
  input.dispatchEvent(event);

  fixture.detectChanges();

  expect(component.favoriteColor).toEqual('Red');
}));
```
### Veränderbarkeit
Template-driven Forms setzen auf das Verändern von Daten durch Zwei-Wege-Datenbindung. Durch die NgModel Direktive werden Änderungen am Datenmodell vorgenommen, sofern Änderungen am Template durchgeführt wurden und umgekehrt.

## Reactive Forms
### Aufbau eines einfachen Formulars
```typescript
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
 
@Component({
  selector: 'app-reactive-favorite-color',
  template: `
    Favorite Color: <input type="text" [formControl]="favoriteColorControl">
  `
})
export class FavoriteColorComponent {
  favoriteColorControl = new FormControl('');
}
```
Bei Reactive Forms wird der Zustand des Formulars über das Datenmodell abgebildet. Im Beispiel ist das Datenmodell als FormControl umgesetzt. Das Formularfeld im Template wird durch die FormControlDirektive an das Datenmodell angebunden. Damit diese Bindung stattfinden kann, muss das Element, an das die Direktive gebunden wird, das Interface des ControlValueAccessors implementieren.
### Der Datenfluss
Ein Formularfeld kann durch eine FormControlDirective mit einem FormControl verknüpft werden. Wird das Input Event ausgelöst, ändert die Direktive das FormControl, das im Gegensatz zu Template-driven Forms in der Komponente gehalten wird. Anders herum lauscht die Direktive auf Änderungen am FormControl und schreibt den neuen Wert in das verknüpfte DOM Element. Im Gegensatz zu Template-driven Forms werden Änderungen bei Reactive Forms synchron durchgeführt.
### Validieren
Angular bringt von Haus aus Standardvalidatoren für Formularfelder wie beispielsweise *required* mit. Eigene Validatoren werden als Methoden umgesetzt und an das FormControl übergeben. Sollen diese Validatoren auch für Template-driven Forms verwendbar sein, müssen sie in eine Direktive eingebunden werden.
### Testen
Da Reactive Forms sowohl synchronen Zugriff gewähren, als auch nicht auf das UI Rendering angewiesen sind, sind sie im Vergleich zu Template-driven Forms sehr einfach zu testen, was das folgende Beispiel zeigt.
```typescript
it('should update the value of the input field', () => {
  const input = fixture.nativeElement.querySelector('input');
  const event = createNewEvent('input');

  input.value = 'Red';
  input.dispatchEvent(event);

  expect(fixture.componentInstance.favoriteColorControl.value).toEqual('Red');
});
```
### Veränderbarkeit
Reactive Forms halten das Datenmodell als unveränderliche Datenstruktur.  Bei jeder Änderung des Wertes eines FormControls wird eine neue Datenstruktur erzeugt, welche die Alte ersetzt.
